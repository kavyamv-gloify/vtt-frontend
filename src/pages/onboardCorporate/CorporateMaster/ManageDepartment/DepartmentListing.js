import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import EditIcon from '@mui/icons-material/Edit';
import {Navigate, useNavigate} from 'react-router-dom';
import axios from 'axios';
import _, {values} from 'lodash';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import RestoreIcon from '@mui/icons-material/Restore';
import EditForm from './EditPage';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import CreateForm from '../ManageDepartment/CreateForm';
import {Delete} from '@mui/icons-material';
import DetailPage from '../ManageDepartment/DetailPage';
import CustomLabel from 'pages/common/CustomLabel';
import Confirm from '@confirmation-box';
import ExcelContainer from '@excelupload';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
  {title: 'Department Name', value: 'departmentName'},
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
      if (el.subModuleName == 'Departments') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  // const corporateId = user?.userList?.profileId;
  const [opendetail, setOpenDetail] = useState(false);
  // const tableRef = React.useRef();
  const [openDialog, setopenDialog] = useState(false);
  const [openform, setOpenForm] = useState(false);
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
  const closeConfirmBoxReactivate = (dd, reason) => {
    setOpenConfirmBoxReactivate(false);
    setId(null);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/department/activateDepartment/${id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(`${res?.data?.data?.departmentName} reactivated`);
            // toast.success('Department reactivated successfully');
            getFilterData();
          }
        });
    }
  };
  useEffect(() => {
    getFilterData();
  }, [filter]);
  const getFilterData = () => {
    let url_ = Api.baseUri + '/api/dashboard/employee/filter';
    let post_ = {
      collection: 'EmployeeDepartment',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'EmployeeDepartment',
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
  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  function popBTNClick(val) {
    // setTimeout(() => {
    //   tableRef.current && tableRef.current.onQueryChange()
    // }, 0);
    getFilterData();
    if (!val) {
      setopenDialog(false);
    }
  }

  const tableTemplate = {
    columns: [
      {
        title: 'Department Name',
        field: 'departmentName',
      },
      {
        title: 'No of Shifts',
        field: 'shifts',
        type: 'arraycount',
      },
      // {
      //   title: 'Description',
      //   field: 'description',
      // },
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
  function handleClickDelete(rowData) {
    setId(rowData?._id);
    handleConfirmBox();
  }
  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?.departmentName);
  }
  const handleDialogForm = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  const closeDetailForm = () => {
    setOpenDetail(false);
  };

  const handleCloseForm = (status) => {
    // setTimeout(() => {
    //   tableRef?.current?.onQueryChange()
    // }, 0);
    getFilterData();
    setOpenForm(status);
  };
  const internaldialogs = () => {
    setOpenDetail(false);
  };
  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };
  const closeConfirmBox = (dd, reason) => {
    if (dd == 'YES') {
      axios
        .post(
          `${Api.department.list}/deactivatedepartment/${id}/${
            reason?.length ? reason : null
          }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            getFilterData();
            setOpenConfirmBox(false);
            toast.success(
              `${response?.data?.data?.departmentName} deactivated`,
            );
            // toast.success('Department deactivated successfully.');
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

  const handleDialogDetailForm = (rowData) => {
    setdialID(rowData?.departmentName);
    setOpenDetail(true);
  };
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} sm={3} md={4} sx={{mb: 2}}>
          <CustomLabel labelVal='Departments' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <QuickSearchPage
            masterKey='departmentName'
            module={'EmployeeDepartment'}
            getFilterData={getFilterData}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            masterFields={['empCode', 'emailId', 'firstName']}
            displayFields={['departmentName']}
            // masterFields={['empCode', 'emailId', 'firstName']}
            filterRes={filterRes}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={4} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              {/* <AppTooltip placement={'top'} title={'Search Departments'}>
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
                <AppTooltip placement={'top'} title={'Add New Department'}>
                  <img
                    src='/assets/images/title-icon/add-department.svg'
                    className='title-icons-mui'
                    onClick={handleDialogForm}
                  />
                </AppTooltip>
              )}
            </div>
            {myActions?.includes('Download And Upload') && (
              <ExcelContainer
                downloadFile={'Department'}
                downloadURL={'/user-reg/department/download'}
                getHeadersUrl={'/user-reg/department/headerdata'}
                downloadTempURL={
                  '/user-reg/department/mapping/download-template'
                }
                uploadURL={'/user-reg/department/mapping/import-excel'}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* <Excel api={'/user-reg/department/download'}/> */}
      {dialID && openDialog && (
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
              >
                s
              </div>
            </>
          ),
        }}
        title='Department Details'
        columns={tableTemplate.columns}
        // tableRef={tableRef}
        data={
          filterRes || []
          // query =>
          // new Promise((resolve, reject, values) => {
          //   let url = `${Api?.department?.list}/null/employeeId/${CorpId}/corporateId?page=${query.page}&size=${query.pageSize}`,
          //     body = {
          //       pageSize: query.pageSize,
          //       pageNo: query.page
          //     }
          //   axios.get(url, body).then(result => {
          //     resolve({
          //       data: result?.data?.data?.body['DepartmentList'] ?? [],
          //       page: result?.data?.data?.body?.currentPage || 0,
          //       totalCount: result?.data?.data?.body?.totalItems || 0,
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
                    opacity: rd?.status == 'INACTIVE' ? '0.3' : '',
                    color: '#bc0805',
                  }}
                />
              ),
              tooltip: 'Deactivate',
              onClick: (event, rowData) => {
                if (rowData?.status == 'INACTIVE') {
                  return;
                }
                handleClickDelete(rowData);
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
                console.log(rowData);
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
        open={openform}
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
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
              <h1 style={{marginTop: '1.5rem'}}>Department</h1>
              <CloseIcon
                onClick={handleClose}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: 0}}>
              <CreateForm close={handleCloseForm} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <Dialog
        open={opendetail}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '60%',
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
                width: '60%',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Department Detail</h1>
              <CloseIcon
                onClick={closeDetailForm}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', marginTop: '1.5rem'}}>
              {dialID && <DetailPage close={internaldialogs} id={dialID} />}
            </div>
          </DialogContent>
        </div>
      </Dialog>
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Department Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the department?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the department?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
    </>
  );
};
export default List;
