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
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import {Delete} from '@mui/icons-material';
import CustomLabel from 'pages/common/CustomLabel';
import Confirm from '@confirmation-box';
import AppTooltip from '@crema/core/AppTooltip';
import {Box, Grid} from '@mui/material';
import CreateForm from './CreateForm';
import EditForm from './EditEscort';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import QuickSearchPage from '@quick-search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import RestoreIcon from '@mui/icons-material/Restore';
import moment from 'moment';
import {useAuthUser} from '@crema/utility/AuthHooks';
const fieldList = [
  {title: 'Agency Name', value: 'agencyName'},
  {title: 'Status', value: 'status'},
];
const Table = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [openform, setOpenForm] = useState(false);
  const [dialID, setdialID] = useState();
  const [delData, setDeldata] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState();
  const [agencyLists, setAgencyLists] = useState();
  const [openDialog, setopenDialog] = useState(false);
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Escort Agency') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);

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
      collection: 'AgencyDto',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'AgencyDto',
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
    let temp = filterRes?.sort((p1, p2) =>
      new Date(p1.createdOn) < new Date(p2.createdOn)
        ? 1
        : new Date(p1.createdOn) > new Date(p2.createdOn)
        ? -1
        : 0,
    );
    setAgencyLists(temp ?? []);
  }, [filterRes]);
  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      axios
        .put(Api.baseUri + '/user-reg/Agency-Service/update-agency', delData)
        .then((response) => {
          getFilterData();
          setDeldata('');
          setOpenConfirmBox(false);
          if (response?.data?.status == '200') {
            toast.success(`${response?.data?.data?.agencyName} deactivated`);
            // toast.success('Agency deactivated successfully.');
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
  function popBTNClick(val) {
    getFilterData;
    if (!val) {
      setopenDialog(false);
    }
  }

  const closeConfirmBoxReactivate = (dd, reason) => {
    console.log('reason', reason);
    setOpenConfirmBoxReactivate(false);
    setdialID(null);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/Agency-Service/activateAgency/${dialID}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(`${res?.data?.data?.agencyName} reactivated`);
            // toast.success('Escort Agency reactivated successfully');
            getFilterData();
          }
        });
    }
  };
  const tableTemplate = {
    columns: [
      {
        title: 'Category Name',
        field: 'agencyName',
      },

      {
        title: 'Status',
        field: 'status',
        render: (rd) => {
          return (
            <span style={{color: rd?.status == 'ACTIVE' ? 'green' : 'red'}}>
              {rd?.status == 'ACTIVE' ? 'Active' : 'Inactive'}
            </span>
          );
        },
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
        field: 'createdOn',
        type: 'datetime',
      },
    ],
  };

  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?._id);
  }
  const handleClickDelete = (rd) => {
    setDeldata({
      id: rd._id,
      agencyName: rd?.agencyName,
      tenantId: rd?.tenantId,
      status: 'INACTIVE',
      createdBy: rd?.createdBy,
      // updatedBy: rd?.updatedBy,
      createdOn: rd?.createdOn,
      // updatedOn: rd?.updatedOn,
      corporateId: rd?.corporateId,
    });
    setOpenConfirmBox(true);
    // handleConfirmBox();
  };
  const handleDialogForm = () => {
    setOpenForm(true);
  };
  const handleClose = () => {
    setOpenForm(false);
  };
  const handleCloseForm = (status) => {
    setOpenForm(status);
    getFilterData;
  };

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} md={4} sm={3}>
          <CustomLabel labelVal='Escort Agency' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} md={4} sm={3}>
          <QuickSearchPage
            masterKey='agencyName'
            module={'AgencyDto'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            displayFields={['agencyName']}
            filterRes={filterRes}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={12} md={4} sm={3}>
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
                <AppTooltip placement={'top'} title={'Escort Agency'}>
                  <img
                    src='/assets/images/title-icon/Add special employees.svg'
                    className='title-icons-mui'
                    onClick={handleDialogForm}
                  />
                </AppTooltip>
              )}
            </div>
          </Box>
        </Grid>
      </Grid>

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
        data={agencyLists}
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
                  style={{opacity: rd.status == 'INACTIVE' ? '0.2' : ''}}
                />
              ),
              tooltip: 'Edit',
              onClick: (event, rowData) => {
                if (rowData.status == 'ACTIVE') handleClickEdit(rowData);
              },
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
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '500px',
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
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Escort Agency</h1>
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
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the agency?'}
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
          title={'Escort Agency Filter'}
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
