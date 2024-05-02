import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import DriverComp from './Driver/driverCom';
import VehicleComp from './Vehicle';
import CustomLabel from 'pages/common/CustomLabel';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SmartTable from '@smart-table';
import axios from 'axios';
import AppTooltip from '@crema/core/AppTooltip';
import Api from '@api';
import {toast} from 'react-toastify';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {useAuthUser} from '@crema/utility/AuthHooks';
import QuickSearchPage from '@quick-search';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import SmartForm from '@smart-form';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
const DriverComplisting = () => {
  const {user} = useAuthUser();
  const navigate = useNavigate();
  const [actionClicked, setActionClicked] = React.useState(false);
  const [TabValue, setTabValue] = React.useState(0);
  const [saveClicked, setSaveClicked] = React.useState(false);
  const [pendingDial, setPendingDial] = React.useState(false);
  const [pendingList, setPendingList] = React.useState([]);
  const [searchClicked, setsearchClicked] = useState(false);
  const [finalData, setFinalData] = useState([]);
  const [openReport, setOpenReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState();

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
    setSearchTerm('');
  };
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  const clearSearchTerm = () => {
    setSearchTerm('');
  };

  const [myActions, setMyActions] = useState([]);
  const [sub_Module, setSub_Module] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let mod = false;
    let sub_mod = {};
    let sub_mod_arr = [];
    permissionCheck?.map((el) => {
      if (el.moduleName == 'Compliance') {
        if (el.actions.includes('View')) sub_mod_arr.push(el.subModuleName);
        mod = true;
        if (TabValue == 0 && el.subModuleName == 'Compliance') sub_mod = el;
        if (TabValue == 1 && el.subModuleName == 'Compliance') sub_mod = el;
      }
    });
    setMyActions(sub_mod?.actions);
    setSub_Module(sub_mod_arr);
    if (!mod) navigate('/error-pages/error-404');
  }, [permissionCheck, TabValue]);
  useEffect(() => {
    if (user?.userList?.userRoleName) getPendingData();
  }, [user?.userList?.profileId]);
  function getPendingData() {
    let tem_url =
      '/user-reg/compliance-topic/get-compliance-topic-pending-request';
    axios
      .get(Api.baseUri + tem_url)
      .then((res) => {
        let arr = [];
        res?.data?.data?.map((el) => {
          el?.complianceSubTopicList?.map((ch_el) => {
            if (ch_el.status == 'PENDING') {
              arr.push({
                fileName: ch_el.fileName,
                subTopicName: ch_el.subTopicName || ch_el.subTopicKey,
                topic: el.topicNameKey,
                createdBy: el.createdBy,
                createdOn: el.createdOn,
                id: el.id,
                complianceType: el.complianceType,
              });
            }
          });
        });

        setPendingList(arr);
      })
      .catch((err) => {
        setPendingList([]);
      });
  }

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Bank Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'autocomplete',
            name: 'compliance',
            id: 'compliance',
            title: 'Compliance',
            validationProps: {
              required: 'This is a mandatory field',
            },
            options: [
              {title: 'Driver', value: 'Driver'},
              {title: 'Vehicle', value: 'Vehicle'},
            ],
          },
          {
            type: 'array',
            name: 'complianceSubTopicList',
            id: 'complianceSubTopicList',
            layout: {
              column: 1,
              spacing: 2,
              size: 'small',
              label: 'blank',
              type: 'table',
            },
            columns: ['Field', 'Value'],
            subFields: [
              {
                type: 'autocomplete',
                name: 'subTopicKey',
                id: 'subTopicKey',
                title: 'Field Value',
                validationProps: {
                  required: 'This is a mandatory field',
                },
                options: [
                  {title: 'Driver Name', value: 'Driver Name'},
                  {title: 'Mobile No.', value: 'Mobile No.'},
                  {title: 'Driving License No.', value: 'Driving License No.'},
                  {title: 'Vendor Name', value: 'Vendor Name'},
                  {title: 'Compliance Status', value: 'Compliance Status'},
                ],
                // dynamic: {
                //   field: 'subTopicKey',
                //   arrName: 'complianceSubTopicList',
                //   isNotValue: 'ADDNEW',
                //   defaultShow: ' ',
                // },
              },

              {
                type: 'text',
                name: 'inputType',
                id: 'inputType',
                title: 'Search Value',
                // dynamic: {
                //   field: 'subTopicKey',
                //   value: 'Mobile No.',
                // },
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'inputType',
                id: 'inputType',
                title: 'Search Value',
                isNumber: true,
                maxChar: 6,
                dynamic: {
                  field: 'subTopicKey',
                  value: 'Mobile No.',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },
          // {
          //   type: 'date',
          //   name: 'fromDate',
          //   id: 'fromDate',
          //   title: 'From Date',
          // },
          // {
          //   type: 'date',
          //   name: 'toDate',
          //   id: 'toDate',
          //   title: 'To Date',
          // },
        ],
      },
    ],
  };
  function handleClickApprove(v) {
    let tem_url =
      '/user-reg/compliance-topic/forward-compliance-topic-vehicle-request';
    // let tem_url = (user?.userList?.userRoleName == 'CORPORATEADMIN') ? '/user-reg/compliance-topic/update-compliance-topic-request' : '/user-reg/compliance-topic/forward-compliance-topic-vehicle-request'
    axios
      .post(Api.baseUri + tem_url, [
        {
          id: v.id,
          status: 'APPROVED',
        },
      ])
      .then((res) => {
        getPendingData();
        if (res?.data?.status == '200') {
          toast.success('Compliance request approved');
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong.');
        getPendingData();
      });
  }
  function handleClickReject(v) {
    let tem_url =
      '/user-reg/compliance-topic/forward-compliance-topic-vehicle-request';
    // let tem_url = (user?.userList?.userRoleName == 'CORPORATEADMIN') ? '/user-reg/compliance-topic/update-compliance-topic-request' : '/user-reg/compliance-topic/forward-compliance-topic-vehicle-request'
    axios
      .post(Api.baseUri + tem_url, [
        {
          id: v.id,
          status: 'REJECTED',
        },
      ])
      .then((res) => {
        getPendingData();
        if (res?.data?.status == '200') {
          toast.success('Compliance request rejected ');
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong.');
      });
  }
  const tableTemplate = {
    columns: [
      {
        title: 'Compliance Name',
        field: 'topic',
      },
      {
        title: 'For',
        field: 'complianceType',
      },
      {
        title: 'Sub Compliance',
        field: 'subTopicName',
      },
      {
        title: 'Date/File',
        field: 'fileName',
        type: 'date',
      },
      {
        title: 'Created by',
        field: 'createdBy',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'date',
      },
    ],
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function handleSubmit(value) {
    console.log('value', value);
    let myArray = value?.data?.complianceSubTopicList;
    const getValue = (key) => {
      let findobj = myArray.find((el) => el.subTopicKey === key);
      if (!!findobj) {
        return findobj.inputType;
      }
      return null;
    };
    let driver = getValue('Driver Name');
    let mobileNo = getValue('Mobile No.');
    let dlNo = getValue('Driving License No.');
    let vendor = getValue('Vendor Name');
    let compliance = getValue('Compliance Status');
    console.log('driver', driver, mobileNo, dlNo, vendor, compliance);

    if (value?.data?.compliance == 'Driver') {
      axios
        .get(Api.baseUri + '/user-reg/driverComplianceReport/getHeaders')
        .then((res) => {
          if (res?.data?.status == '200') {
            axios
              .post(
                Api.baseUri +
                  `/user-reg/driverComplianceReport/download-report/${
                    value?.button?.toUpperCase() == 'XLS' ? 'EXCEL' : 'PDF'
                  }/${driver || null}/${mobileNo || null}/${dlNo || null}/${
                    vendor || null
                  }/${compliance || null}`,
                res?.data?.data,
                {responseType: 'blob'},
              )
              .then((response) => {
                setOpenReport(false);
                const url = window.URL.createObjectURL(
                  new Blob([response.data]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                  'download',
                  'driver_compliance/' +
                    (value?.button?.toUpperCase() == 'XLS' ? '.xls' : '.pdf'),
                );
                document.body.appendChild(link);
                link.click();
              });
          }
        })
        .catch((err) => {});
    }
    if (value?.data?.compliance == 'Vehicle') {
      axios
        .get(Api.baseUri + '/user-reg/vehicleComplianceReport/getHeaders')
        .then((res) => {
          if (res?.data?.status == '200') {
            axios
              .post(
                Api.baseUri +
                  `/user-reg/vehicleComplianceReport/download-report/${
                    value?.button?.toUpperCase() == 'XLS' ? 'EXCEL' : 'PDF'
                  }${driver || null}/${mobileNo || null}/${dlNo || null}/${
                    vendor || null
                  }/${compliance || null}`,
                res?.data?.data,
                {responseType: 'blob'},
              )
              .then((response) => {
                setOpenReport(false);
                const url = window.URL.createObjectURL(
                  new Blob([response.data]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                  'download',
                  'vehicle_compliance/' +
                    (value?.button?.toUpperCase() == 'XLS' ? '.xls' : '.pdf'),
                );
                document.body.appendChild(link);
                link.click();
              });
          }
        })
        .catch((err) => {});
    }
  }
  return (
    <div>
      <Grid container spacing={2} className='page-header-second' sx={{mb: 6}}>
        <Grid item xs={3} md={4}>
          <Box sx={{width: '100%', mb: 4, mt: 1}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
              <Tabs
                value={TabValue}
                onChange={handleChangeTab}
                aria-label='basic tabs example'
              >
                {sub_Module?.includes('Compliance') && (
                  <Tab label='Driver' {...a11yProps(0)} />
                )}
                {sub_Module?.includes('Compliance') && (
                  <Tab label='Vehicle' {...a11yProps(1)} />
                )}
                {/* <Tab label="Vendor" {...a11yProps(2)} /> */}
              </Tabs>
            </Box>
          </Box>
        </Grid>
        <Grid item md={4}>
          <div style={{width: '100%', position: 'relative'}}>
            <TextField
              style={{marginTop: '5px'}}
              id='full-width-text-field'
              margin='normal'
              size='small'
              fullWidth
              autoComplete='off'
              onChange={handleInputChange}
              value={searchTerm}
              placeholder={
                TabValue == 0
                  ? 'Search by Driver Name'
                  : 'Search by Vehicle Number'
              }
              // style={{borderRadius: '20px'}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm.length > 1 && (
                  <InputAdornment position='end'>
                    <ClearIcon
                      onClick={clearSearchTerm}
                      style={{cursor: 'pointer'}}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Grid>
        <Grid item xs={9} md={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              {/* <QuickSearchPage
                masterKey='_id'
                searchClicked={searchClicked}
                searchUrl={'/employee-reg/filter'}
                masterFields={['empCode', 'emailId', 'firstName']}
                finalData={finalData}
                setFinalData={setFinalData}
              /> */}

              <AppTooltip placement={'top'} title={'Download'}>
                <FileDownloadIcon
                  onClick={() => {
                    setOpenReport(true);
                  }}
                  sx={{ml: 2, mr: 4}}
                  className='pointer'
                />
              </AppTooltip>
              {/* <AppTooltip placement={'top'} title={'Search'}>
                <SearchOutlinedIcon
                  onClick={() => {
                    setsearchClicked(!searchClicked);
                  }}
                  sx={{ml: 2, mr: 4}}
                  className='pointer'
                />
              </AppTooltip> */}
              {myActions?.includes('Approve Or Reject') && (
                <AppTooltip placement={'top'} title={'Pending Request'}>
                  <img
                    src='/assets/images/title-icon/profile-change.svg'
                    className='title-icons-mui'
                    onClick={() => {
                      setPendingDial(true);
                    }}
                  />
                </AppTooltip>
              )}
              {myActions?.includes('Setting') && (
                <AppTooltip placement={'top'} title={'Settings'}>
                  <SettingsIcon
                    onClick={() => {
                      setActionClicked(true);
                    }}
                    className='title-icons-mui'
                  />
                </AppTooltip>
              )}
              {/* <AppTooltip placement={'top'}
                title={'Save'}>
                <SaveIcon onClick={() => { setSaveClicked(true); }} className='title-icons-mui' />
              </AppTooltip> */}
            </div>
          </Box>
        </Grid>
      </Grid>

      <Dialog
        onClose={() => {
          setPendingDial(false);
        }}
        open={pendingDial}
        PaperProps={{
          sx: {
            width: '80%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Pending Requests</h1>
          <CloseIcon
            onClick={() => {
              setPendingDial(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '20px', paddingTop: '0', marginTop: '20px'}}>
            <SmartTable
              components={{
                Toolbar: (props) => (
                  <>
                    <div
                      style={{
                        height: '0px',
                        // marginTop:"10px"
                      }}
                    ></div>
                  </>
                ),
              }}
              columns={tableTemplate.columns}
              data={pendingList || []}
              options={{
                search: false,
                showTitle: false,
                selection: false,
                sorting: true,
                actionsColumnIndex: -1,
                headerStyle: {position: 'sticky', top: 0},
              }}
              actions={[
                {
                  icon: () => <TaskAltIcon color='primary' />,
                  tooltip: 'Approve',
                  onClick: (event, rowData) => handleClickApprove(rowData),
                },
                {
                  icon: () => (
                    <CancelScheduleSendIcon
                      color='primary'
                      style={{color: '#bc0805'}}
                    />
                  ),
                  tooltip: 'Reject',
                  onClick: (event, rowData) => handleClickReject(rowData),
                },
              ]}
              localization={{
                body: {
                  emptyDataSourceMessage: 'No records to display',
                  filterRow: {
                    filterTooltip: 'Filter',
                    filterPlaceHolder: 'Filtaaer',
                  },
                },
              }}
              style={{
                borderRadius: 16,
                boxShadow: '0px 10px 10px 4px rgb(0 0 0 / 4%)',
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {TabValue == 0 ? (
        <>
          {sub_Module?.includes('Compliance') && (
            <DriverComp
              searchTerm={debouncedSearchTerm}
              saveClicked={saveClicked}
              setSaveClicked={setSaveClicked}
              actionClicked={actionClicked}
              setActionClicked={setActionClicked}
              searchedDriver={'register driver'}
            />
          )}
        </>
      ) : TabValue == 1 ? (
        <>
          {sub_Module?.includes('Compliance') && (
            <VehicleComp
              searchTerm={debouncedSearchTerm}
              saveClicked={saveClicked}
              setSaveClicked={setSaveClicked}
              actionClicked={actionClicked}
              setActionClicked={setActionClicked}
            />
          )}
        </>
      ) : null}

      <Dialog
        open={openReport}
        PaperProps={{
          sx: {
            width: '50%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Compliance Report</h1>
          <CloseIcon
            onClick={() => {
              setOpenReport(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '20px', paddingTop: '0', marginTop: '20px'}}>
            <SmartForm
              template={template}
              onSubmit={handleSubmit}
              buttons={['xls', 'pdf']}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverComplisting;
