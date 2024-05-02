import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Delete} from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import _, {set} from 'lodash';
import {Button, Dialog, DialogContent, DialogTitle} from '@mui/material';
import Api from '@api';
import CreateForm from './CreateForm';
import CloseIcon from '@mui/icons-material/Close';
import EditForm from './EditForm';
import CustomLabel from 'pages/common/CustomLabel';
import ExcelContainer from '@excelupload';
import Confirm from '@confirmation-box';
import Grid from '@mui/material/Grid';
import AppTooltip from '@crema/core/AppTooltip';
import {Box} from '@mui/material';
import {useSelector} from 'react-redux';
import QuickSearchPage from '@quick-search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import {toast} from 'react-toastify';
import RestoreIcon from '@mui/icons-material/Restore';
import moment from 'moment';
import {useAuthUser} from '@crema/utility/AuthHooks';

const fieldList = [{title: 'Vendor Name', value: 'vendorName'}];

const List = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [myActions, setMyActions] = useState([]);
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Manage Holidays') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  const [myHolidays, setMyHolidays] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState();
  const [delid, setDelId] = useState('');
  const [myId, setMyId] = useState();
  const [reactiveId, setReactiveId] = useState();
  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [searchClicked, setsearchClicked] = useState(false);

  useEffect(() => {
    getFilterData();
  }, []);
  const getFilterData = () => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/gps-provider/get-AllgpsVendorAssociateWithCorporate',
      )
      // .get(Api.baseUri + '/user-reg/gps-provider/get-AllgpsProvider')
      .then((re_) => {
        setFilterRes(re_?.data?.data ?? []);
      })
      .catch((err) => {
        setFilterRes([]);
      });
  };
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };
  function handleClicked(val) {
    setMyId('');
    getFilterData();
  }
  useEffect(() => {
    let products = filterRes ?? [];
    let sortedProducts = products.sort((p1, p2) =>
      new Date(p1.holidayDate) > new Date(p2.holidayDate)
        ? 1
        : new Date(p1.holidayDate) < new Date(p2.holidayDate)
        ? -1
        : 0,
    );
    setMyHolidays(sortedProducts ?? []);
  }, [filterRes]);

  const closeConfirmBoxReactivate = (dd, reason) => {
    console.log('reason', reason);
    setOpenConfirmBoxReactivate(false);
    setReactiveId(null);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/siteoffice-holyday/activateHoliday/${reactiveId}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(`${res?.data?.data?.holidayName} reactivated`);
            // toast.success('Holiday reactivated successfully');
            getFilterData();
          }
        });
    }
  };
  const tableTemplate = {
    columns: [
      {
        title: 'Vendor Name',
        field: 'vendorName',
      },
      // {
      //   title: 'Created By',
      //   field: 'createdBy',
      // },
      // {
      //   title: 'Created On',
      //   field: 'createdOn',
      //   render: (rd) => {
      //     return (
      //       moment(rd.createdOn).format('DD/MM/YYYY')
      //     );
      //   },
      // },
      // {
      //   title: 'Updated On',
      //   field: 'updatedOn',
      //   render: (rd) => {
      //     return (
      //       moment(rd.createdOn).format('DD/MM/YYYY')
      //     );
      //   },
      // },
      // {
      //   title: 'Status',
      //   field: 'status',
      //   render: (rd) => {
      //     return (
      //       <div
      //         style={{
      //           color: rd?.status == 'ACTIVE' ? 'green' : 'rgb(188, 8, 5)',
      //         }}
      //       >
      //         {rd?.status == 'ACTIVE' ? 'Active' : 'Inactive'}
      //       </div>
      //     );
      //   },
      // },
    ],
  };

  function handleClickView(rowData) {
    setMyId(rowData?.id);
  }
  function handleClickDelete(rowData) {
    setDelId(rowData._id);
    setOpenConfirmBox(true);
  }
  const closeConfirmBox = (dd, reason) => {
    if (dd == 'YES') {
      axios
        .post(
          `${
            Api.baseUri
          }/user-reg/siteoffice-holyday/deactivateofficeholiday/${delid}/${
            reason?.length ? reason : null
          }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(`${response?.data?.data?.holidayName} deactivated`);
            // toast.success('Holiday deactivated successfully.');
            setOpenConfirmBox(false);
            getFilterData();
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    }
    if (dd == 'NO') {
      setOpenConfirmBox(false);
    }
  };
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={4} md={4} sm={3}>
          <CustomLabel labelVal='GPS Vendor List' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={8} md={4} sm={3}>
          <QuickSearchPage
            masterKey='vendorName'
            module={'GpsProviderDetail'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            displayFields={['vendorName']}
            filterRes={filterRes}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={8} md={4} sm={3}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              {/* <AppTooltip placement={'top'} title={'Search Employee'}>
                <SearchOutlinedIcon
                  onClick={() => {
                    setsearchClicked(!searchClicked);
                  }}
                  sx={{ml: 2, mr: 4}}
                  className='pointer'
                />
              </AppTooltip> */}
              <AppTooltip placement={'top'} title={'Add Filter'}>
                <FilterAltOutlinedIcon
                  className='title-icons-mui'
                  style={{color: _.isEmpty(filter) ? '' : '#ff9800'}}
                  onClick={() => {
                    setfilterShow(true);
                    setOpenFilter(true);
                  }}
                />
              </AppTooltip>
              <AppTooltip placement={'top'} title={'Clear Filter'}>
                <img
                  src='/assets/images/clear-filter.png'
                  onClick={() => {
                    setfilterShow(false);
                    setFilter({});
                    handleClosefilter({button: 'clear'});
                  }}
                  className='title-icons-mui'
                />
              </AppTooltip>
              {myActions?.includes('Create') && (
                <AppTooltip placement={'top'} title={'Add GPS Vendor'}>
                  <img
                    src='/assets/images/gps.svg'
                    className='title-icons-mui'
                    onClick={(e) => {
                      setMyId('create');
                    }}
                  />
                </AppTooltip>
              )}
            </div>
            {myActions?.includes('Download And Upload') && (
              <ExcelContainer
                downloadFile={'GPS Vendors'}
                // downloadURL={'/user-reg/siteoffice-holyday/download'}
                // getHeadersUrl={'/user-reg/siteoffice-holyday/headerdata'}
                downloadTempURL={'/user-reg/gps-vehicle/download-template'}
                uploadURL={'/user-reg/gps-vehicle/import-excel'}
              />
            )}
          </Box>
        </Grid>
      </Grid>
      {
        <SmartTable
          components={{
            Toolbar: (props) => (
              <>
                <div
                  style={{
                    height: '0px',
                  }}
                ></div>
              </>
            ),
          }}
          title='Onboard Tenants List'
          columns={tableTemplate.columns}
          data={myHolidays ?? []}
          // tableRef={tableRef}
          options={{
            search: false,
            showTitle: false,
            actionsColumnIndex: -1,
            headerStyle: {position: 'sticky', top: 0},
          }}
          actions={[
            (rd) =>
              myActions?.includes('Edit') && {
                icon: () => <EditIcon color='primary' />,
                tooltip: 'Edit',
                onClick: (event, rowData) => {
                  handleClickView(rowData);
                },
              },
            // (rd) =>
            //   myActions?.includes('Deactivate') && {
            //     icon: () => (
            //       <Delete
            //         style={{
            //           color: '#bc0805',
            //           opacity: rd.status == 'INACTIVE' ? '0.3' : '',
            //         }}
            //       />
            //     ),
            //     tooltip: 'Deactivate',
            //     onClick: (event, rowData) => {
            //       if (rowData.status == 'ACTIVE') handleClickDelete(rowData);
            //     },
            //   },

            // (rd) =>
            //   myActions?.includes('Edit') && {
            //     icon: () => (
            //       <RestoreIcon
            //         color='primary'
            //         style={{opacity: rd?.status == 'INACTIVE' ? '' : '0.2'}}
            //       />
            //     ),
            //     tooltip: 'Reactivate',
            //     onClick: (event, rowData) => {
            //       console.log(rowData);
            //       if (rowData?.status == 'INACTIVE') {
            //         setReactiveId(rowData?._id);
            //         setOpenConfirmBoxReactivate(true);
            //       }
            //     },
            //   },
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
      }
      {myId == 'create' ? (
        <Dialog
          open={true}
          onClose={() => {
            handleClose('NO');
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle
            id='alert-dialog-title'
            style={{backgroundColor: '#f4f2f2', fontWeight: 600}}
          >
            <h1>Add Vendor Name</h1>
            <div style={{position: 'absolute', right: '12px', top: '16px'}}>
              <CloseIcon
                sx={{cursor: 'pointer'}}
                onClick={() => {
                  setMyId('');
                }}
              />
            </div>
          </DialogTitle>
          <DialogContent>
            <CreateForm handleClicked={handleClicked} />
          </DialogContent>
        </Dialog>
      ) : null}
      {myId && myId != 'create' ? (
        <Dialog
          open={true}
          // onClose={() => { handleClose("NO") }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle style={{background: '#f4f2f2'}}>
            <h1>Update Vendor Name</h1>
            <CloseIcon
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                color: '#4f4f4f',
                fontWeight: 'bold',
              }}
              onClick={() => {
                setMyId('');
              }}
            />
          </DialogTitle>

          <DialogContent>
            <EditForm id={myId} handleClicked={handleClicked} />
          </DialogContent>
        </Dialog>
      ) : null}
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the holiday?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the holiday?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'GPS Vendor Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
    </>
  );
};

export default List;
