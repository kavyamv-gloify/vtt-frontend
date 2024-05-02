import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import {useAuthUser} from '@crema/utility/AuthHooks';
import EditIcon from '@mui/icons-material/Edit';
// import Delete from '@mui/icons-material/Delete';
import _ from 'lodash';
import {useNavigate} from 'react-router-dom';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import {Box, Button, Grid} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import EditForm from './EditForm';
import CreateForm from './CreateForm';
import CloseIcon from '@mui/icons-material/Close';
import ExcelContainer from '@excelupload';
import {Delete} from '@mui/icons-material';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import Confirm from '@confirmation-box';
import {useSelector} from 'react-redux';
import QuickSearchPage from '@quick-search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import RestoreIcon from '@mui/icons-material/Restore';
import moment from 'moment';
const fieldList = [
  {title: 'Reason', value: 'reason'},
  {title: 'Amount', value: 'amount'},
  {title: 'Status', value: 'status'},
];
const Table = () => {
  const {user} = useAuthUser();
  //
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const tableRef = React.useRef();
  const [open, setOpen] = React.useState(false);
  const [openform, setOpenForm] = useState(false);
  const [disableDownload, setdisableDownload] = useState(false);
  const [myuploadedFile, setMyuploadedFile] = useState({});
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
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
      collection: 'PenaltyDto',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'PenaltyDto',
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

  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Penalty') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);

  function popBTNClick(val) {
    getFilterData();
    if (!val) {
      setopenDialog(false);
    }
  }

  const closeConfirmBoxReactivate = (dd, reason) => {
    setOpenConfirmBoxReactivate(false);
    setdialID(null);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/penalty-Service/activatePenalty/${dialID}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(`${res?.data?.data?.reason} reactivated`);
            // toast.success('Penalty reactivated successfully');
            getFilterData();
          }
        });
    }
  };

  const tableTemplate = {
    columns: [
      {
        title: 'Reason',
        field: 'reason',
      },
      {
        title: 'Amount',
        field: 'amount',
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
    // navigate('/onbordTenent/NodelPoint/edit/' + rowData._id);
    setopenDialog(true);
    setdialID(rowData?._id);
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
  };

  const handleClickdelete = (rowData) => {
    setdialID(rowData?._id);
    setOpenConfirmBox(true);
  };

  const closeConfirmBox = (dd, reason) => {
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/penalty-Service/delete/${dialID}/${
              reason?.length ? reason : null
            }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            getFilterData();
            setdialID(null);
            setOpenConfirmBox(false);
            toast.success(
              `${response?.data?.data?.reason} deactivated successfully`,
            );
            // toast.success('Penalty deactivated successfully.');
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
        <Grid item xs={4} md={4}>
          <CustomLabel labelVal='Penalties' variantVal='h3-underline' />
        </Grid>
        <Grid item md={4}>
          <QuickSearchPage
            masterKey='reason'
            module={'PenaltyDto'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            displayFields={['reason', 'amount']}
            filterRes={filterRes}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={8} md={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              {/* <AppTooltip placement={'top'} title={'Search Penalty'}>
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
                <AppTooltip placement={'top'} title={'Add New Penalty'}>
                  <img
                    src='/assets/images/title-icon/add penalty.svg'
                    className='title-icons-mui'
                    onClick={handleDialogForm}
                  />
                </AppTooltip>
              )}
            </div>
            {myActions?.includes('Download And Upload') && (
              <ExcelContainer
                downloadFile={'Penalty'}
                downloadURL={'/user-reg/penalty-Service/download'}
                getHeadersUrl={'/user-reg/penalty-Service/headerdata'}
                downloadTempURL={'/user-reg/penalty-Service/download-template'}
                uploadURL={'/user-reg/penalty-Service/import-excel'}
              />
            )}
          </Box>
        </Grid>
      </Grid>
      {/* <Excel api={'/user-reg/penalty-Service/download'} /> */}

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
        title='Nodal Point List'
        columns={tableTemplate.columns}
        data={filterRes || []}
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
          (rd_) =>
            myActions?.includes('Edit') && {
              icon: () => (
                <EditIcon
                  color='primary'
                  style={{opacity: rd_.status == 'DEACTIVE' ? '0.3' : ''}}
                />
              ),
              tooltip: 'Edit',
              onClick: (event, rowData) => handleClickEdit(rowData),
            },

          (rd_) =>
            myActions?.includes('Deactivate') && {
              icon: () => (
                <Delete
                  color='primary'
                  style={{
                    color: '#bc0805',
                    opacity: rd_.status == 'DEACTIVE' ? '0.3' : '',
                  }}
                />
              ),
              tooltip: 'Deactivate',
              onClick: (event, rowData) => {
                if (rd_.status == 'ACTIVE') handleClickdelete(rowData);
              },
            },
          (rd) =>
            myActions?.includes('Edit') && {
              icon: () => (
                <RestoreIcon
                  color='primary'
                  style={{opacity: rd?.status == 'DEACTIVE' ? '' : '0.2'}}
                />
              ),
              tooltip: 'Reactivate',
              onClick: (event, rowData) => {
                // console.log(rowData);
                if (rowData?.status == 'DEACTIVE') {
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
              <h1 style={{marginTop: '1.5rem'}}>Penalty Form</h1>
              <CloseIcon
                onClick={handleClose}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              <CreateForm close={handleCloseForm} />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Penalty?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the Penalty?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Penalty Filter'}
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
