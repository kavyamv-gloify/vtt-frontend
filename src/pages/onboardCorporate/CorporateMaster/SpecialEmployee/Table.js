import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import SmartForm from '@smart-form';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {Navigate, useNavigate} from 'react-router-dom';
import axios from 'axios';
import _, {values} from 'lodash';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Button from '@mui/material/Button';
import {setFilters} from 'redux/actions';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import {Delete} from '@mui/icons-material';
import EditForm from './EditForm';
import CreateForm from '../SpecialEmployee/Createform';
import DetailPage from '../SpecialEmployee/Detail';
import ExcelContainer from '@excelupload';
import CustomLabel from 'pages/common/CustomLabel';
import Confirm from '@confirmation-box';
import AppTooltip from '@crema/core/AppTooltip';
import {Box, Grid} from '@mui/material';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import QuickSearchPage from '@quick-search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import RestoreIcon from '@mui/icons-material/Restore';
import moment from 'moment';
const fieldList = [
  {title: 'Category Name', value: 'categoryName'},
  {title: 'Guard is required', value: 'guardisRequired'},
  {title: 'Exclusive Vehicle', value: 'exclusiveVehicle'},
  {title: 'Status', value: 'status'},
];
const Table = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Special Employee') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  const [opendetail, setOpenDetail] = useState(false);

  const tableRef = React.useRef();
  const [myData, setMyData] = useState([]);
  const [openDialog, setopenDialog] = useState(false);
  const [openform, setOpenForm] = useState(false);
  const [dialID, setdialID] = useState();
  const [id, setId] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState();
  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [searchClicked, setsearchClicked] = useState(false);
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);
  useEffect(() => {
    getFilterData();
  }, [filter]);
  const getFilterData = () => {
    let url_ = Api.baseUri + '/api/dashboard/employee/filter';
    let post_ = {
      collection: 'SpecialCategoryEmployeeDto',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'SpecialCategoryEmployeeDto',
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
  async function onSubmit(val) {
    setFilters(val.data);
    getFilterData();
    // setTimeout(() => {
    //   tableRef.current && table.Ref.current()
    // }, 0);
  }
  // useEffect(() => {
  //   getFilterData();
  // }, []);
  // const getAllSpecialEmp = () => {
  //   let url = Api.specialEmployee.getall;
  //   axios
  //     .get(url)
  //     .then((res) => {
  //       setMyData(res?.data?.data ?? []);
  //     })
  //     .catch((err) => {
  //       setMyData([]);
  //     });
  // };
  const tableTemplate = {
    columns: [
      {
        title: 'Category Name',
        field: 'categoryName',
      },
      {
        title: 'Guard is Required',
        field: 'guardisRequired',
      },
      {
        title: 'Exclusive Vehicle',
        field: 'exclusiveVehicle',
      },
      // {
      //   title: 'Strength',
      //   field: 'size',
      // },
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
      {
        title: 'Status',
        field: 'status',
        render: (rd) => {
          return (
            <div
              style={{
                color: rd?.status == 'ACTIVE' ? 'green' : 'rgb(188, 8, 5)',
              }}
            >
              {rd?.status == 'ACTIVE' ? 'Active' : 'Inactive'}
            </div>
          );
        },
      },
    ],
  };

  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?._id);
  }

  const handleClickDelete = (rowData) => {
    setId(rowData._id);
    handleConfirmBox();
  };
  const handleDialogForm = () => {
    setOpenForm(true);
  };
  const handleClickView = (rowData) => {
    setId(rowData?._id);
    setOpenDetail(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };
  const handleCloseForm = (status) => {
    setOpenForm(status);
    getFilterData();
    // setTimeout(() => {
    //   tableRef.current && tableRef.current.onQueryChange()
    // }, 0);
  };
  const handlecloseDialoge = () => {
    setOpenDetail(false);
  };

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };

  const closeConfirmBox = (dd, reason) => {
    if (dd == 'YES') {
      axios
        .post(
          `${Api.specialEmployee.getbyId}/deactivatespecialemployee/${id}/${
            reason?.length ? reason : null
          }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            // setTimeout(() => {
            //   tableRef.current && tableRef.current.onQueryChange()
            // }, 0);
            getFilterData();
            setOpenConfirmBox(false);
            toast.success(`${response?.data?.data?.categoryName} deactivated`);
            // toast.success('Employee deactivated successfully.');
            // navigate(
            //   '/onboardCorporate/special-employee/specialemployee-listing',
            // );
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

  const closeConfirmBoxReactivate = (dd, reason) => {
    console.log('reason', reason);
    setOpenConfirmBoxReactivate(false);
    setdialID(null);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/special-employee/activateSpecialEmp//${dialID}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(`${res?.data?.data?.categoryName} reactivated`);
            // toast.success('Special Employee reactivated successfully');
            getFilterData();
          }
        });
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} md={4} sm={3}>
          <CustomLabel
            labelVal='Special Employees category'
            variantVal='h3-underline'
          />
        </Grid>
        <Grid item xs={12} md={4} sm={3}>
          <QuickSearchPage
            masterKey='categoryName'
            module={'SpecialCategoryEmployeeDto'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            displayFields={['categoryName']}
            filterRes={filterRes}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid itemxs={12} md={4} sm={3}>
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
                <AppTooltip placement={'top'} title={'Add Special Category'}>
                  <img
                    src='/assets/images/title-icon/Add special employees.svg'
                    className='title-icons-mui'
                    onClick={handleDialogForm}
                  />
                </AppTooltip>
              )}
            </div>
            {myActions?.includes('Download And Upload') && (
              <ExcelContainer
                downloadFile={'Special Employee'}
                downloadURL={'/user-reg/special-employee/download'}
                getHeadersUrl={'/user-reg/special-employee/headerdata'}
                downloadTempURL={'/user-reg/special-employee/download-template'}
                uploadURL={'/user-reg/special-employee/import-excel'}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* <Excel api={'/user-reg/special-employee/download'} /> */}
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
        columns={tableTemplate.columns}
        // tableRef={tableRef}
        data={filterRes || []}
        options={{
          search: false,
          showTitle: false,
          selection: false,
          sorting: true,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (rd) =>
            myActions?.includes('Edit') && {
              icon: () => (
                <EditIcon
                  color='primary'
                  style={{
                    opacity: rd.status == 'INACTIVE' ? '0.3' : '',
                  }}
                />
              ),
              tooltip: 'Edit',
              onClick: (event, rowData) => {
                if (rowData.status == 'ACTIVE') handleClickEdit(rowData);
              },
            },
          (rd) =>
            myActions?.includes('Deactivate') && {
              icon: () => (
                <Delete
                  color='primary'
                  style={{
                    color: '#bc0805',
                    opacity: rd.status == 'INACTIVE' ? '0.3' : '',
                  }}
                />
              ),
              tooltip: 'Deactivate',
              onClick: (event, rowData) => {
                if (rowData.status == 'ACTIVE') handleClickDelete(rowData);
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
                  setdialID(rowData?._id);
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
        onClose={handleClose}
        open={openform}
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
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Special Employee</h1>
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
        onClose={handleClose}
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
              <h1 style={{marginTop: '1.5rem'}}>Special Employee Details</h1>
              <CloseIcon
                onClick={handlecloseDialoge}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '2rem', marginTop: '1.5rem'}}>
              <DetailPage close={handlecloseDialoge} id={id} />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Special Employee?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the Special Employee?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Special Employee Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
    </>
  );
};
export default Table;
