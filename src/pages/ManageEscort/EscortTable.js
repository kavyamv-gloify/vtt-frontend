import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import _ from 'lodash';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import api from '@api';
import {Box, Button, DialogTitle} from '@mui/material';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import EscortEdit from './EscortEditPage';
import EscortRegister from './EscortRegister';
import CloseIcon from '@mui/icons-material/Close';
import DetailPage from '../ManageEscort/EscortDetailPage';
import {Delete} from '@mui/icons-material';
import CustomLabel from 'pages/common/CustomLabel';
import ExcelContainer from '@excelupload';
import Confirm from '@confirmation-box';
import Grid from '@mui/material/Grid';
import AppTooltip from '@crema/core/AppTooltip';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import QuickSearchPage from '@quick-search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import RestoreIcon from '@mui/icons-material/Restore';
import moment from 'moment';
const fieldList = [
  {title: 'First Name', value: 'firstName'},
  {title: 'Last Name', value: 'lastName'},
  {title: 'Email Id', value: 'emailId'},
  {title: 'Mobile Number', value: 'mobileNo'},
  {title: 'Escort Id', value: 'escortCode'},
  {title: 'Gender', value: 'gender'},
  {title: 'Arm Licence No', value: 'armsLicence'},
  {title: 'Status', value: 'status'},
];

const List = () => {
  const [data, setData] = useState();
  const [openDialog, setopenDialog] = useState(false);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [dialID, setdialID] = useState();
  const [idd, setIdd] = useState();
  const tableRef = React.useRef();
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Escort') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  const [open, setOpen] = React.useState(false);
  const [openform, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const id = user.userList.tanentId;

  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [searchClicked, setsearchClicked] = useState(false);

  useEffect(() => {
    getFilterData();
  }, [filter]);
  const getFilterData = () => {
    let url_ = api.baseUri + '/api/dashboard/employee/filter';
    let post_ = {
      collection: 'EscortReg',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'EscortReg',
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
    //   tableRef.current && tableRef.current.onQueryChange();
    // }, 0);
    getFilterData();
    if (!val) {
      setopenDialog(false);
    }
  }
  // useEffect(() => {
  //   async function fetchData() {
  //     let temp = []
  //     const baseURL = `${api.escort.createform}/${id}/corporate`;
  //     let response = await axios.get(`${baseURL}`);
  //
  //     response?.data?.data?.map((e) => {
  //
  //       temp.push(e);
  //

  //     })
  //     setData(response.data.data)
  //   }
  //   fetchData();
  // }, [id]);

  const tableTemplate = {
    columns: [
      {
        title: 'First Name',
        field: 'firstName',
      },
      {
        title: ' Last Name',
        field: 'lastName',
      },
      {
        title: 'Arm licence No.',
        field: 'armsLicence',
      },
      {
        title: 'Address',
        field: 'address.addressName',
        render: (rowData) =>
          rowData?.address?.addressName?.split('++')?.[0] +
          ',' +
          rowData?.address?.addressName?.split('++')?.[1],
      },
      {
        title: 'Email',
        field: 'emailId',
      },
      {
        title: 'Mobile',
        field: 'mobileNo',
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
        title: 'Last Updated ',
        field: 'updatedOn',
        type: 'datetime',
      },
    ],
  };

  function handleClickView(rowData) {
    setIdd(rowData?._id);
    setOpenDetail(true);
  }
  function handleClickEdit(rowData) {
    // navigate('/onboardadmin/escort/editPage/' + rowData._id);
    setopenDialog(true);
    setdialID(rowData?._id);
  }

  function handleClickDelete(rowData) {
    setIdd(rowData?._id);
    handleConfirm();
  }

  const handleDialogForm = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };
  const handleCloseForm = (status) => {
    setOpenForm(status);
    getFilterData();
    // setTimeout(() => {
    //   tableRef.current && tableRef.current.onQueryChange();
    // }, 0);
  };

  const handlecloseDetail = () => {
    setOpenDetail(false);
  };

  const handleDetail = () => {
    setOpenDetail(false);
  };

  const handleConfirm = () => {
    setOpenConfirmBox(true);
  };

  const closeConfirmBox = (dd, reason) => {
    if (dd == 'YES') {
      axios
        .post(
          `${api.escort.createform}/deactivateescort/${idd}/${
            reason?.length ? reason : null
          }`,
        ) // REACTIVATE FEATURE ADDED
        .then((response) => {
          if (response?.data?.status == '200') {
            getFilterData();
            setOpenConfirmBox(false);
            toast.success(
              `${
                response?.data?.data?.firstName +
                ' ' +
                response?.data?.data?.lastName
              } deactivated`,
            );
            // toast.success('Escort deactivated successfully.');
          } else {
            toast.error(response?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    } else {
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
          api.baseUri +
            `/user-reg/escort-reg/activateEscort/${dialID}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              `${
                res?.data?.data?.firstName + ' ' + res?.data?.data?.lastName
              } reactivated`,
            );
            // toast.success('Escort  reactivated successfully');
            getFilterData();
          }
        });
    }
  };
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} md={4} sm={3}>
          <CustomLabel labelVal='Escorts' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} md={4} sm={3}>
          <QuickSearchPage
            masterKey='firstName'
            module={'EscortReg'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            displayFields={['firstName', 'lastName', 'mobileNo']}
            filterRes={filterRes}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={12} md={4} sm={3}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              {/* <AppTooltip placement={'top'} title={'Search Escorts'}>
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
                <AppTooltip placement={'top'} title={'Add New Escort'}>
                  <img
                    src='/assets/images/title-icon/add-escort.svg'
                    className='title-icons-mui'
                    onClick={handleDialogForm}
                  />
                </AppTooltip>
              )}
            </div>
            {myActions?.includes('Download And Upload') && (
              <ExcelContainer
                downloadFile={'Escort'}
                downloadURL={'/user-reg/escort-reg/download'}
                getHeadersUrl={'/user-reg/escort-reg/headerdata'}
                downloadTempURL={'/user-reg/escort-reg/download-template'}
                uploadURL={'/user-reg/escort-reg/import-excel'}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      {openDialog && dialID && (
        <EscortEdit
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}

      {/* <Button id='btnMui123's/> */}
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
        title='Escort Employee List'
        columns={tableTemplate.columns}
        // tableRef={tableRef}
        data={filterRes ?? []}
        options={{
          search: false,
          showTitle: false,
          selection: false,

          sorting: true,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
          color: 'primary',
        }}
        actions={[
          (rd) =>
            myActions?.includes('Edit') && {
              icon: () => (
                <EditIcon
                  color='primary'
                  style={{opacity: rd?.status == 'INACTIVE' ? '0.3' : ''}}
                />
              ),
              tooltip: 'Edit',
              onClick: (event, rowData) => {
                if (rowData.status == 'INACTIVE') {
                  return;
                }
                handleClickEdit(rowData);
              },
            },
          myActions?.includes('View') && {
            icon: () => <VisibilityIcon color='primary' />,
            tooltip: 'View',
            onClick: (event, rowData) => handleClickView(rowData),
          },
          (rd) => ({
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
          }),
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
        // onClose={handleClose}
        open={openform}
        style={{borderRadius: '4rem'}}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '88%',
          },
        }}
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
                position: 'fixed',
                width: '88%',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Escort Form</h1>
              <CloseIcon
                onClick={handleClose}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', marginTop: '60px'}}>
              <EscortRegister close={handleCloseForm} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <Dialog
        onClose={handlecloseDetail}
        open={openDetail}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '800px',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>Escort Details</h1>
          <CloseIcon
            onClick={handlecloseDetail}
            style={{
              position: 'absolute',
              right: '12px',
              top: '12px',
              color: '#4f4f4f',
            }}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '2rem', paddingTop: 0}}>
            <DetailPage idd={idd} close={handleDetail} />
          </div>
        </DialogContent>
      </Dialog>

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Escort?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the Escort Agency?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Escort Filter'}
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
