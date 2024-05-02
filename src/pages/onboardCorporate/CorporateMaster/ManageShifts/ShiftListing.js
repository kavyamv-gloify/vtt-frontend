import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import {Delete} from '@mui/icons-material';
import SmartForm from '@smart-form';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import {Navigate, useNavigate} from 'react-router-dom';
import axios from 'axios';
import _, {stubFalse, values} from 'lodash';
import api from '@api';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Button from '@mui/material/Button';
import {setFilters} from 'redux/actions';
import EditForm from './EditShifts';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import ShiftCreateForm from './NewShifts';
import DetailForm from './NewShiftsDetails';
import ExcelContainer from '@excelupload';
import CustomLabel from 'pages/common/CustomLabel';
import Confirm from '@confirmation-box';
import Grid from '@mui/material/Grid';
import AppTooltip from '@crema/core/AppTooltip';
import {Box} from '@mui/material';
import {useSelector} from 'react-redux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import QuickSearchPage from '@quick-search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import {toast} from 'react-toastify';
import moment from 'moment';
const fieldList = [
  {title: 'Shift Name', value: 'shiftName'},
  // {title: 'Shift Type', value: 'shiftType'},
  {title: 'Start Time', value: 'shiftStart'},
  {title: 'End Time', value: 'shiftEnd'},
  {title: 'Pickup Mode', value: 'pickupType'},
  {title: 'Status', value: 'status'},
];

const List = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Shifts') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);

  // const tableRef = React.useRef();
  const [openDialog, setopenDialog] = useState(false);
  const [openform, setOpenForm] = useState(false);
  const [opendetail, setOpenDetail] = useState(false);
  const [dialID, setdialID] = useState();
  const [id, setId] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [filter, setFilter] = useState({});
  const [searchClicked, setsearchClicked] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);

  useEffect(() => {
    getFilterData();
  }, [filter]);
  const getFilterData = () => {
    let url_ = Api.baseUri + '/api/dashboard/employee/filter';
    let post_ = {
      collection: 'EmployeeShift',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'EmployeeShift',
      pageNo: 1,
      pageSize: 1000,
    };
    axios
      .post(url_, !filter || _.isEmpty(filter) ? def_post : post_)
      .then((re_) => {
        setFilterRes(re_?.data?.data);
      })
      .catch((err) => {
        setFilterRes([]);
      });
  };
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };
  function popBTNClick(val) {
    // setTimeout(() => {
    //   tableRef.current && tableRef.current.onQueryChange()
    // }, 0);
    getFilterData();
    if (!val) {
      setopenDialog(false);
    }
  }

  const closeConfirmBoxReactivate = (dd, reason) => {
    setOpenConfirmBoxReactivate(false);
    setId(null);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/shift/activateShift/${id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(`${res?.data?.data?.shiftName}  activated`);
            // toast.success('Shift reactivated successfully');
            getFilterData();
          }
        });
    }
  };

  const tableTemplate = {
    columns: [
      {
        title: 'Login',
        field: 'shiftStart',
        type: 'date',
      },
      {
        title: 'Logout',
        field: 'shiftEnd',
        type: 'date',
      },
      {
        title: 'Pickup Mode',
        field: 'pickupType',
      },
      {
        title: ' Shift Name',
        field: 'shiftName',
      },
      {
        title: 'Status',
        field: 'status',
        render: (rowData) =>
          rowData.status == 'ACTIVE' ? (
            <span style={{color: 'green'}}>ACTIVE</span>
          ) : rowData.status == 'INACTIVE' ? (
            <span style={{color: 'red'}}>INACTIVE</span>
          ) : (
            rowData.status
          ),
      },
      {
        title: 'Created by',
        field: 'createdOn',
        render: (rd) => {
          return (
            rd.createdBy +
            '  ' +
            moment(rd.createdOn).format('DD/MM/YYYY HH:MM')
          );
        },
      },
      {
        title: 'Last Updated',
        field: 'updatedOn',
        type: 'datetime',
      },
    ],
  };

  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?._id);
  }
  const handleDialogForm = () => {
    setOpenForm(true);
  };
  const handleDialogDetailForm = (rowData) => {
    setOpenDetail(true);
    setdialID(rowData?._id);
  };

  const handleClose = () => {
    setOpenForm(false);
  };
  const handleCloseForm = (status) => {
    getFilterData();
    setOpenForm(status);
  };

  const closeDetailForm = () => {
    setOpenDetail(false);
  };
  function handleClickdelete(rowData) {
    setId(rowData?._id);
    handleConfirmBox();
  }

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };

  const closeConfirmBox = (dd, reason) => {
    if (dd == 'YES') {
      axios
        .post(
          `${api.masters.getallShift}/deactivateshift/${id}/${
            reason?.length ? reason : null
          }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            // setTimeout(() => {
            //   tableRef.current && tableRef.current.onQueryChange()
            // }, 0);
            toast.success(`${response?.data?.data?.shiftName} deactivated`);

            getFilterData();
            setOpenConfirmBox(false);
            navigate('/onboardCorporate/shift/shift-listing');
          }
        })
        .catch((err) => {});
    }
    if (dd == 'NO') {
      setOpenConfirmBox(false);
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          mb: 6,
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
        className='page-header-second'
      >
        <Grid item xs={12} sm={3} md={4} sx={{mb: 2}}>
          <div>
            <CustomLabel labelVal='Shifts' variantVal='h3-underline' />
          </div>
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <QuickSearchPage
            masterKey='shiftName'
            module={'EmployeeShift'}
            searchClicked={true}
            getFilterData={getFilterData}
            searchUrl={'/employee-reg/filter'}
            displayFields={['shiftName', 'status']}
            // masterFields={['empCode', 'emailId', 'firstName']}
            filterRes={filterRes}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={4} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              {/* <AppTooltip placement={'top'} title={'Search Shifts'}>
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
                <AppTooltip placement={'top'} title={'Add New Shift'}>
                  <img
                    src='/assets/images/title-icon/add shift.svg'
                    className='title-icons-mui'
                    onClick={handleDialogForm}
                  />
                </AppTooltip>
              )}
            </div>
            {myActions?.includes('Download And Upload') && (
              <ExcelContainer
                downloadFile={'Shift'}
                downloadURL={'/user-reg/shift/download'}
                getHeadersUrl={'/user-reg/shift/headerdata'}
                downloadTempURL={'/user-reg/shift/download-template'}
                uploadURL={'/user-reg/shift/import-excel'}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* <Excel api={'/user-reg/shift/download'}/>   */}
      {openDialog && dialID && (
        <EditForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}
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
        title='Shift Details'
        columns={tableTemplate.columns}
        // tableRef={tableRef}
        data={
          filterRes || []
          // query =>
          // new Promise((resolve, reject, values) => {

          //   let url = `${api.manageshifts.getlistbyCorporate}corporateId?page=${query.page}&size=${query.pageSize}&shiftName=null`,
          //     body = {
          //       pageSize: query.pageSize,
          //       pageNo: query.page
          //     }

          //   axios.get(url, body).then(result => {
          //
          //     resolve({
          //       data: (result?.data?.data?.body?.ShiftList && result?.data?.data?.body) ? result?.data?.data?.body?.ShiftList : [],
          //       page: (result.data.data.body && result.data.data.body.currentPage) ? result.data.data.body.currentPage : 0,
          //       totalCount: (result.data.data && result.data.data.body.totalItems) ? result.data.data.body.totalItems : 0,
          //     })
          //   }).catch(err => {
          //     resolve({
          //       data: [],
          //       page: 0,
          //       totalCount: 0,
          //     })
          //   })
          // })
        }
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (rd) =>
            myActions?.includes('Edit') && {
              icon: () => (
                <EditIcon
                  color='primary'
                  style={{opacity: rd?.status == 'INACTIVE' ? '0.3' : ' '}}
                />
              ),
              tooltip: 'Edit',
              onClick: (event, rowData) => {
                if (rowData?.status == 'INACTIVE') {
                  return;
                }
                handleClickEdit(rowData);
              },
            },

          myActions?.includes('View') && {
            icon: () => <VisibilityIcon color='primary' />,
            tooltip: 'view',
            onClick: (event, rowData) => handleDialogDetailForm(rowData),
          },

          (rd) =>
            myActions?.includes('Deactivate') && {
              icon: () => (
                <Delete
                  color='primary'
                  style={{
                    color: '#bc0805',
                    opacity: rd?.status == 'INACTIVE' ? '0.3' : ' ',
                  }}
                />
              ),
              tooltip: 'Deactivate',
              onClick: (event, rowData) => {
                if (rowData?.status == 'INACTIVE') {
                  return;
                }
                handleClickdelete(rowData);
              },
            },
          (rd) =>
            myActions?.includes('Edit') && {
              icon: () => (
                <RestoreIcon
                  color='primary'
                  style={{opacity: rd?.status == 'INACTIVE' ? '' : '0.2'}}
                />
              ),
              tooltip: 'Reactivate',
              onClick: (event, rowData) => {
                if (rowData?.status == 'INACTIVE') {
                  setId(rowData?._id);
                  setOpenConfirmBoxReactivate(true);
                }
              },
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

      <Dialog
        // onClose={handleClose}
        open={openform}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '600px',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
                position: 'fixed',
                width: '600px',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Shift</h1>
              <CloseIcon
                onClick={handleClose}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '4rem'}}>
              <ShiftCreateForm close={handleCloseForm} />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Dialog
        onClose={handleClose}
        open={opendetail}
        style={{borderRadius: '4rem'}}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Shift Details</h1>
              <CloseIcon
                onClick={() => {
                  setOpenDetail(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              {dialID && <DetailForm close={closeDetailForm} id={dialID} />}
            </div>
          </DialogContent>
        </div>
      </Dialog>

      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Shift Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Shift?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the Shift?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
    </>
  );
};
export default List;
