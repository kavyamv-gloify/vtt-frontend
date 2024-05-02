import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import keys from '@common/keys';
import AppLoader from '@crema/core/AppLoader';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import RouteDataList from './routeDataList';
import CustomLabel from 'pages/common/CustomLabel';
import {Button, Checkbox, Tooltip} from '@mui/material';
import Box from '@mui/material/Box';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import Api from '@api';
import AssignToVendor from './assign-to-vendor';
import moment from 'moment';
import {toast} from 'react-toastify';
import Confirm from '@confirmation-box';

const CustomExpandIcon = () => {
  return (
    <Box
      sx={{
        '.Mui-expanded & > .collapsIconWrapper': {
          display: 'none',
        },
        '.expandIconWrapper': {
          display: 'none',
        },
        '.Mui-expanded & > .expandIconWrapper': {
          display: 'block',
        },
      }}
    >
      <div className='expandIconWrapper'>
        <IndeterminateCheckBoxOutlinedIcon style={{color: '#407999'}} />
      </div>
      <div className='collapsIconWrapper'>
        <AddBoxOutlinedIcon style={{color: '#407999'}} />
      </div>
    </Box>
  );
};
const RouteLists = () => {
  var mapObject, direction_plugin;
  const [showbtn, setshowbtn] = React.useState(true);
  const [selectedAccord, setSelectedAccord] = React.useState([]);
  const {user} = useAuthUser();
  const navigate = useNavigate();
  const [formData, setformData] = useState({});
  const [isAnySelected, setIsAnySelected] = useState(false);
  const [searchAction, setSearchAction] = useState('');
  const [shiftList, setShiftList] = useState();
  const [myData, setMyData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [childData, setChildData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [addClicked, setAddClicked] = React.useState(false);
  const [tripidToAddEmp, setTripidToAddEmp] = React.useState(false);
  const [assigneeEmp, setassigneeEmp] = React.useState();
  const [deleteConfirmbox, setDeleteConfirmbox] = useState(false);
  const [deleteEmpId, setDeleteEmpId] = React.useState([]);
  const [tripId, setTripId] = React.useState([]);
  useEffect(() => {
    let url = `${
      Api.employee.list
    }/corporate?page=${0}&size=${1200}&emailId=${null}&employeeCode=${null}&mobileNo=${null}`;
    axios
      .get(url)
      .then((result) => {
        let tem = result?.data?.data?.body?.EmployeeList;
        let temArr = [];
        tem?.map((el) => {
          //
          temArr.push({title: el?.employeeFullName, value: el?.id});
        });
        setassigneeEmp(temArr ?? []);
      })
      .catch((err) => {
        setassigneeEmp([]);
      });
  }, []);
  useEffect(() => {
    let arr = [{title: 'All Shifts', value: 'ALL'}];
    let url = `${
      Api.manageshifts.getlistbyCorporate
    }corporateId?page=${0}&size=${1000}&shiftName=null`;
    axios
      .get(url)
      .then((re) => {
        let temArray = re?.data?.data?.body?.ShiftList ?? [];
        temArray?.map((el) => {
          arr.push({title: el?.shiftName, value: el?.id});
        });
        setShiftList(arr);
      })
      .catch((err) => {
        setShiftList([{title: 'All Shifts', value: 'ALL'}]);
      });
  }, []);

  useEffect(() => {
    getAllList();
  }, [filterOptions, searchAction]);

  function handleSubmitAddEmp(val) {
    let reqBody = {
      tripId: tripidToAddEmp,
      passengers: [val?.data?.empId],
    };

    axios
      .post(Api?.baseUri + '/user-reg/trip-altr/add', reqBody)
      .then((res) => {
        if (res?.status == 200) {
          if (res?.data?.status == 200) {
            toast.success(res?.message ?? 'Added successfully');
            getAllList();
          } else {
            toast.error(res?.data?.message ?? 'Something went wrong');
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  }
  function getAllList() {
    let postData = {
      date: filterOptions?.date || moment(new Date()).format('YYYY-MM-DD'),
      tripType: filterOptions?.tripType || 'ALL',
      shiftTime: filterOptions?.shiftTime || 'ALL',
    };
    axios
      .post(Api.trip?.tripList, postData)
      .then((result) => {
        let arr = [];
        result?.data?.data?.map((r) => {
          if (searchAction == 'ASSIGN_TO_VENDOR' && r?.vendorStatus != 'NONE') {
            return;
          }
          let tem = {};
          tem.id = r?.id;
          tem.tripCode = r?.tripCode ?? 'NA';
          tem.vehicleNo = r?.vehicleNo || 'Not Assigned';
          tem.driverName = r?.driverName || 'Not Assigned';
          tem.tripCategory = r?.tripCategory == 'REGTRIP' ? 'Regular' : 'Adhoc';
          tem.tripType = r?.tripType;
          tem.routeDate = r?.date;
          tem.vendorStatus = r?.vendorStatus == 'NONE' ? 'No' : 'Yes';
          tem.vendorName = r?.vendorName ?? '-';
          tem.status = r?.status;
          tem.noOfStoppage = r?.stopList?.length;
          tem.stops = r?.stopList;
          let temarr = [];
          r?.stopList?.map((empc) => {
            empc?.onBoardPassengers?.map((elel) => {
              temarr.push(elel);
            });
          });
          tem.empList = temarr;
          arr.push(tem);
        });
        setMyData([...arr]);
        setChildData([...arr]);
      })
      .catch((err) => {});
  }
  useEffect(() => {
    let init = false;
    for (let [key, value] of Object.entries(childData)) {
      value?.empList?.length &&
        value?.empList?.map((ar) => {
          if (ar.checked == true) {
            init = true;
          }
        });
    }
    setIsAnySelected(init);
  }, [childData]);

  const actionList = [
    {label: 'Assign to Vendor', value: 'ASSIGN_TO_VENDOR'},
    {label: 'Action 2', value: 'a2'},
    {label: 'Action 3', value: 'a3'},
  ];
  const groupList = [
    {label: 'Group 1', value: 'g1'},
    {label: 'Group 2', value: 'g2'},
    {label: 'Group 3', value: 'g3'},
  ];
  const localitiesList = [
    {label: 'Localities 1', value: 'l1'},
    {label: 'Localities 2', value: 'l2'},
    {label: 'Localities 3', value: 'l3'},
  ];

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }));

  useEffect(() => {
    setSearchAction(searchAction);
  }, [searchAction]);
  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'small',
      label: 'fixed',
      type: 'flex',
    },
    title: '',
    description: 'Routes',
    sections: [
      {
        layout: {
          column: 4,
          spacing: 2,
          size: 'small',
          label: 'fixed',
          type: 'flex',
        },
        id: 'route_information',
        fields: [
          {
            type: 'date',
            name: 'date',
            id: 'date',
            title: 'Date',
            size: 'small',
            defaultValue: moment(new Date()).format('YYYY-MM-DD'),
            min: 'today',
            style: {width: '20%'},
          },
          {
            type: 'autocomplete',
            name: 'tripType',
            id: 'tripType',
            defaultValue: 'ALL',
            title: 'Trip Type',
            options: [
              {title: 'All', value: 'ALL'},
              {title: 'Login', value: 'UPTRIP'},
              {title: 'Logout', value: 'DOWNTRIP'},
            ],
            style: {width: '25%'},
          },
          {
            type: 'autocomplete',
            name: 'shiftTime',
            id: 'shiftTime',
            defaultValue: 'ALL',
            title: 'Shift Time',
            options: shiftList ?? [{title: 'All Shifts', value: 'ALL'}],
            style: {width: '25%'},
          },
        ],
      },
    ],
  };
  let templateAdd = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'route_information',
        fields: [
          {
            type: 'autocomplete',
            name: 'empId',
            id: 'empId',
            title: 'Select Employee',
            options: assigneeEmp ?? [],
          },
        ],
      },
    ],
  };

  const selectParentData = async (event, evId) => {
    let temArr = selectedAccord;
    if (!temArr.includes(evId)) {
      temArr.push(evId);
      selectChildData(true, evId, 'ALL');
    } else {
      selectChildData(false, evId, 'ALL');
      temArr.splice(temArr.indexOf(evId), 1);
    }
    setSelectedAccord([...temArr]);
  };

  const selectChildData = async (event, parentId, myId) => {
    let tem = childData;
    let thisselec = true;
    tem[parentId]?.empList?.map((el, ind) => {
      if (myId == 'ALL') {
        tem[parentId].empList[ind].checked = event;
      } else if (el.id == myId) {
        if (event == false) {
          let temArr = selectedAccord;
          temArr.splice(temArr.indexOf(parentId), 1);
          setSelectedAccord([...temArr]);
        }
        tem[parentId].empList[ind].checked =
          !tem[parentId].empList[ind].checked;
      }
      if (!tem[parentId].empList[ind].checked) thisselec = false;
    });
    if (thisselec && myId != 'ALL' && !selectedAccord?.includes(parentId)) {
      setSelectedAccord([...selectedAccord, parentId]);
    }
    setChildData({...tem});
  };
  const deleteEmpFromTrip = async (data) => {
    setDeleteConfirmbox(true);
    setDeleteEmpId(data?.id);
    setTripId(data?.tripId);
  };
  const closeDeleteConfirmBox = (dd) => {
    if (dd == 'YES') {
      setDeleteConfirmbox(false);
      let reqBody = {
        tripId: tripId,
        passengers: [deleteEmpId],
      };

      axios
        .post(Api?.baseUri + '/user-reg/trip-altr/remove', reqBody)
        .then((res) => {
          if (res?.status == 200) {
            toast.success(res?.message ?? 'Removed successfully');
            getAllList();
          } else {
            toast.error(res?.message ?? 'Something went wrong');
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
    if (dd == 'NO') {
      setDeleteConfirmbox(false);
    }
  };
  const remInput = (msg, id, parentId) => {
    let tem = childData;
    tem[parentId]?.empList?.map((el, ind) => {
      if (el.id == id) {
        tem[parentId].empList[ind].remarks = msg;
      }
    });
    setChildData({...tem});
  };
  const handleSubmit = async (values) => {
    setFilterOptions({
      date: values?.data?.date || moment(new Date()).format('YYYY-MM-DD'),
      tripType: values?.data?.tripType || 'ALL',
      shiftTime: values?.data?.shiftTime || 'ALL',
    });
  };
  function handleSubmitAction(values) {
    let Arr = [];
    for (let [key, value] of Object.entries(childData)) {
      value?.empList?.length &&
        value?.empList?.map((ar) => {
          if (ar.checked == true) {
            Arr.push(value?.id);
          }
        });
    }
    setSelectedItems(Arr);
  }

  function setOpenFun(d) {
    if (d == false) {
      setSelectedItems([]);
      setSelectedAccord([]);
      getAllList();
    }
  }

  const createmap = async (data) => {
    initialize(localStorage.getItem('mappl_access_token'), () => {
      afterScriptsLoaded(data);
    });
  };

  function afterScriptsLoaded(data) {
    //
    let startPoint = {
      label: data.stops[0].location.locName,
      geoposition:
        data.stops[0].location.latitude +
        ',' +
        data.stops[0].location.longitude,
    };
    let endPoint = {
      label: data.stops[data.stops.length - 1].location.locName,
      geoposition:
        data.stops[data.stops.length - 1].location.latitude +
        ',' +
        data.stops[data.stops.length - 1].location.longitude,
    };
    let viaPoints = [];
    for (let i = 1; i < data.stops.length; i++) {
      viaPoints.push({
        label: data.stops[i].location.locName,
        geoposition:
          data.stops[i].location.latitude +
          ',' +
          data.stops[i].location.longitude,
      });
    }

    var div = document.getElementById(data.tripCode);
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    mapObject = '';
    mapObject = window.mappls.Map(data.tripCode, {
      center: [
        data.stops[0].location.latitude,
        data.stops[0].location.longitude,
      ],
      zoom: 8,
      zoomControl: false,
    });
    if (mapObject !== undefined && mapObject !== '') {
      var direction_option = {
        map: mapObject,
        divWidth: '0px',
        search: false,
        isDraggable: false,
        start: startPoint,
        end: endPoint,
        Profile: ['driving', 'biking', 'trucking', 'walking'],
        via: viaPoints,
        routeColor: 'red',
        start_icon: {
          html: `<div class='marker-pin'><span class='p-img'><img src = '/assets/images/route_page_icon/escort.png' /><p>${startPoint?.label}</p></span><img src='https://maps.mappls.com/images/from.png' /></div>`,
          width: 30, //optional
          height: 40, //optional
        },
        end_icon: {
          html: `<div class='marker-pin'><span class='p-img'><img src = '/assets/images/route_page_icon/escort.png' /><p>${endPoint?.label}</p></span><img src='https://maps.mappls.com/images/to.png' /></div>`,
          width: 30, //optional
          height: 40, //optional
        },
        via_icon: {
          html: `<div class='marker-pin'><span class='p-img'><img src = '/assets/images/route_page_icon/escort.png' /><p>ViaPoint</p></span><img src='https://maps.mappls.com/images/2.png' /></div>`,
          width: 30,
          height: 40,
        },
      };

      new window.mappls.direction(direction_option, function (data) {
        direction_plugin = data;
      });
    }
  }
  // Map section end
  return (
    <>
      <div className='route-list'>
        {!showbtn ? <AppLoader /> : null}
        {/* <div style={{ textAlign: "right" }}>
                    <Button id='btnMui123' variant='outlined' onClick={(e) => { navigate('/assign-route-to-vendor') }}>Assign To Vendor</Button>
                </div> */}
        <CustomLabel labelVal='Routes' variantVal='h3-underline' />
        <div className='grid-container route-search'>
          <SmartForm
            template={template}
            filterbtnStyle={{
              maxHeight: '36px',
              marginLeft: '15px',
              marginTop: '26px',
              backgroundColor: '#006685',
            }}
            defaultValues={formData}
            onSubmit={handleSubmit}
            fieldsize='SMALL'
            buttons={['submit']}
          />
        </div>
        <div className='grid-container route-list'>
          <div className='search-area' style={{background: 'white'}}>
            <Grid item xs={12} md={4} className='action-search-grid'>
              <Autocomplete
                disablePortal
                id='actions'
                size='small'
                options={actionList}
                onChange={(e, option, v) => {
                  if (v === 'clear') {
                    setSearchAction('');
                  }
                  if (v === 'selectOption') {
                    setSearchAction(option.value);
                  }
                }}
                sx={{width: 250, m: 2}}
                renderInput={(params) => (
                  <TextField {...params} label='Actions' />
                )}
              />
              <SearchIcon
                fontSize='large'
                className='action-search-icon'
                onClick={() => {}}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                id='actions'
                size='small'
                options={groupList}
                onChange={(e, option, v) => {}}
                sx={{width: 250, m: 2}}
                renderInput={(params) => (
                  <TextField {...params} label='Groups' />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                size='small'
                id='actions'
                options={localitiesList}
                onChange={(e, option, v) => {}}
                sx={{width: 250, m: 2}}
                renderInput={(params) => (
                  <TextField {...params} label='Localities' />
                )}
              />
            </Grid>
          </div>
          <div>
            {myData?.length ? (
              myData
                // ? data.slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((e, index) => {
                  return (
                    <>
                      <Accordion style={{padding: '10px'}}>
                        <AccordionSummary
                          className='mb-2'
                          // expandIcon={<><ExpandMoreIcon /></>}
                          expandIcon={<CustomExpandIcon />}
                          // onClick={() => { setDataid(e.id); }}
                          aria-controls='panel1a-content'
                          id='panel1a-header'
                        >
                          <Typography style={{width: '5%'}}>
                            <Checkbox
                              color='success'
                              style={{borderColor: 'red'}}
                              disabled={!searchAction}
                              checked={selectedAccord?.includes(index)}
                              onClick={(ev) => {
                                ev.stopPropagation();
                              }}
                              onChange={(ev) => {
                                selectParentData(ev, index);
                              }}
                            />
                          </Typography>
                          <Typography
                            style={{width: '15%'}}
                            onClick={(eve) => {
                              eve.stopPropagation();
                            }}
                          >
                            <img
                              className='route-icons'
                              src='/assets/images/route_page_icon/TRID.png'
                              style={{
                                position: 'relative',
                                top: '5px',
                                right: '5px',
                              }}
                            />
                            <span>{e?.tripCode}</span>
                          </Typography>
                          <Typography
                            style={{width: '10%'}}
                            onClick={(eve) => {
                              eve.stopPropagation();
                            }}
                          >
                            <img
                              className='route-icons'
                              src='/assets/images/route_page_icon/employee_blue.png'
                              style={{
                                position: 'relative',
                                top: '3px',
                                right: '5px',
                              }}
                            />
                            <span>{e?.empList?.length}</span>
                          </Typography>
                          <Typography
                            style={{width: '60%'}}
                            onClick={(eve) => {
                              eve.stopPropagation();
                            }}
                          >
                            <img
                              style={{marginRight: '8%'}}
                              className='route-icons'
                              src={
                                e?.escortName == 'Not Assigned'
                                  ? '/assets/images/route_page_icon/escort.png'
                                  : '/assets/images/route_page_icon/escort_blue.png'
                              }
                            />
                            <Tooltip title={e?.driverName}>
                              <img
                                style={{marginRight: '8%'}}
                                className='route-icons'
                                src={
                                  e?.driverName == 'Not Assigned'
                                    ? '/assets/images/route_page_icon/driver.png'
                                    : '/assets/images/route_page_icon/driver_blue.png'
                                }
                              />
                            </Tooltip>
                            <Tooltip title={e?.vehicleNo}>
                              <img
                                style={{marginRight: '8%'}}
                                className='route-icons'
                                src={
                                  e?.vehicleNo == 'Not Assigned'
                                    ? '/assets/images/route_page_icon/car.png'
                                    : '/assets/images/route_page_icon/car_orange.png'
                                }
                              />
                            </Tooltip>
                            <img
                              style={{marginRight: '8%'}}
                              className='route-icons'
                              src='/assets/images/route_page_icon/map.png'
                              onClick={() => {
                                createmap(e);
                              }}
                            />
                            <img
                              style={{marginRight: '8%'}}
                              className='route-icons'
                              src='/assets/images/route_page_icon/addEmployee_blue.png'
                              onClick={() => {
                                setAddClicked(true);
                                setTripidToAddEmp(e.id);
                              }}
                            />
                            <img
                              style={{marginRight: '8%'}}
                              className='route-icons'
                              src='/assets/images/route_page_icon/delink_blue.png'
                            />
                            <span className='adhoc-creation btn'>
                              {e?.tripCategory}
                            </span>
                          </Typography>
                          <Typography
                            style={{width: '10%'}}
                            onClick={(eve) => {
                              eve.stopPropagation();
                            }}
                          >
                            <img
                              className='route-icons'
                              src='/assets/images/dashboard/recent_order_option.png'
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography
                            sx={{
                              border: '1px solid #efefef',
                              borderRadius: '8px',
                            }}
                          >
                            <div
                              id={e.tripCode}
                              className='emp-location-map'
                              style={{height: '300px', maxHeight: '300px'}}
                            ></div>
                            <table style={{borderSpacing: '0px'}}>
                              <tbody>
                                <RouteDataList
                                  selectedAccord={selectedAccord}
                                  childdata={childData}
                                  id={index}
                                  searchAction={searchAction}
                                  selectParentData={selectParentData}
                                  selectChildData={selectChildData}
                                  remInput={remInput}
                                  deleteEmpFromTrip={deleteEmpFromTrip}
                                />
                              </tbody>
                            </table>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </>
                  );
                })
            ) : !myData ? (
              <p
                style={{
                  fontSize: '12px',
                  paddingLeft: '45%',
                  margin: '20% 0 20% 0',
                }}
              >
                No records to display
              </p>
            ) : (
              <p
                style={{
                  fontSize: '12px',
                  paddingLeft: '45%',
                  margin: '20% 0 20% 0',
                }}
              >
                No records to display
              </p>
            )}
          </div>
        </div>
        <div style={{textAlign: 'center'}}>
          <Button
            id='btnMui123'
            variant='contained'
            disabled={!isAnySelected}
            sx={{mr: 2}}
            onClick={(e) => {
              handleSubmitAction(e);
            }}
          >
            Submit
          </Button>
          <Button
            id='btnMui123'
            variant='outlined'
            sx={{mr: 2}}
            onClick={(e) => {
              navigate('/dashboard');
            }}
          >
            Cancel
          </Button>
        </div>

        {addClicked ? (
          <Dialog
            open={addClicked}
            onClose={() => {
              setAddClicked(false);
            }}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            maxWidth='false'
            PaperProps={{
              sx: {
                width: 400,
                maxHeight: 500,
                overflow: 'hidden',
              },
            }}
          >
            <DialogTitle
              id='alert-dialog-title'
              style={{position: 'relative', fontSize: '21px'}}
            >
              Add Employee
              <IconButton
                onClick={() => {
                  setAddClicked(false);
                }}
                style={{position: 'absolute', top: '8px', right: '8px'}}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div className='grid-container'>
                <SmartForm
                  template={templateAdd}
                  onSubmit={handleSubmitAddEmp}
                  buttons={['Add']}
                />
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
      {selectedItems?.length ? (
        <AssignToVendor selectedItems={selectedItems} setOpen={setOpenFun} />
      ) : null}

      <Confirm
        open={deleteConfirmbox}
        header={'Confirm to Cancel'}
        cnfMsg={`Are you sure, You want to delete this employee from trip?`}
        handleClose={closeDeleteConfirmBox}
      />
    </>
  );
};

function initialize(mmiToken, loadCallback) {
  try {
    if (mmiToken) {
      let count = 0;
      //Insert your script seperated by comma like scriptArr = [mapSDK_url, plugins_url];
      let mapSDK_url =
        'https://apis.mappls.com/advancedmaps/api/' +
        mmiToken +
        '/map_sdk?layer=vector&v=3.0';
      let plugins_url =
        'https://apis.mappls.com/advancedmaps/api/' +
        mmiToken +
        '/map_sdk_plugins?v=3.0';
      var scriptArr = [mapSDK_url, plugins_url];
      const recursivelyAddScript = (script) => {
        if (count < script.length) {
          const el = document.createElement('script');
          el.src = script[count];
          el.async = true;
          el.type = 'text/javascript';
          document.getElementsByTagName('head')[0].appendChild(el);
          count = count + 1;
          el.onload = function () {
            recursivelyAddScript(script);
          };
        } else {
          return loadCallback();
        }
      };
      recursivelyAddScript(scriptArr);
    } else {
    }
  } catch (e) {
    console.error(String(e));
  }
}
export default RouteLists;
