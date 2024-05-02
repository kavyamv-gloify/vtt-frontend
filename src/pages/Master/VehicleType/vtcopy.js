import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import SmartTable from '@smart-table';
import SmartForm from '@smart-form';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _, {values} from 'lodash';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Button from '@mui/material/Button';
import CreateForm from './CreateForm';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import EditForm from './EditPage';
import DetailPage from '../VehicleType/DetailPage';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomLabel from 'pages/common/CustomLabel';
import ExcelContainer from '@excelupload';
import AppTooltip from '@crema/core/AppTooltip';
import Confirm from '@confirmation-box';
import {Box, DialogTitle, Grid} from '@mui/material';
import {toast} from 'react-toastify';
import QuickSearchPage from '@quick-search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';

const fieldList = [
  {title: 'Vehicle Type', value: 'vehicleType'},
  {title: 'Vehicle Occupancy', value: 'vehicleOccupancy'},
  {title: 'Max Capacity Excluding Driver', value: 'maxCapacityExcludingDriver'},
  {title: 'Min Capacity Excluding Driver', value: 'minCapacityExcludingDriver'},
  {title: 'Status', value: 'status'},
];
const List = () => {
  const [userStatus, setuserStatus] = useState('Active');
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const tableRef = React.useRef();
  const [openform, setOpenForm] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const [id, setId] = useState();
  const [opendetail, setOpenDetail] = useState(false);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
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
      collection: 'VehicleType',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'VehicleType',
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
  const tanentId = user?.userList?.tanentId;
  function popBTNClick(val) {
    getFilterData();
    if (!val) {
      setopenDialog(false);
    }
  }
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Vehicle Variant') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);

  const tableTemplate = {
    columns: [
      {
        title: 'Vehicle Variant',
        field: 'vehicleType',
      },
      {
        title: 'Vehicle Occupancy',
        field: 'vehicleOccupancy',
      },
      {
        title: 'Min. Capacity Excluding Driver',
        field: 'minCapacityExcludingDriver',
      },
      {
        title: 'Max Capacity Excluding Driver',
        field: 'maxCapacityExcludingDriver',
      },
      {
        title: 'Max Capacity With Escort Excluding Driver',
        field: 'maxCapacitywithEscortExcludingdriver',
      },
      {
        title: 'Created by',
        field: 'createdBy',
        type: 'date',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'date',
      },
      {
        title: 'Last Updated on',
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
      // {
      //   title: 'Status',
      //   field: "status"
      // },
    ],
  };

  function handleClickView(rowData) {
    // navigate('/Master/vehicleType/detailpage/' + rowData.id);

    setId(rowData?.id);
    setOpenDetail(true);
  }
  function handleClickEdit(rowData) {
    // navigate('/Master/vehicleType/editpage/' + rowData.id);

    setopenDialog(true);
    setdialID(rowData?.id);
  }

  function handleDelete(rowData) {
    setId(rowData?.id);
    handleConfirmBox();
  }
  const handleDialogForm = () => {
    setOpenForm(true);
  };
  const handleCloseForm = (status) => {
    setOpenForm(status);
    getFilterData();
  };

  const handleClose = () => {
    setOpenForm(false);
  };
  const handleClosedialog = () => {
    setOpenDetail(false);
  };

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };

  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      axios
        .post(`${api.masterVehicletype.delete}/deactivatevehicletype/${id}`)
        .then((response) => {
          if (response?.data?.status == '200') {
            getFilterData();
            setOpenConfirmBox(false);
            toast.success('Vehicle variant deactivated successfully.');
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
        <Grid item xs={4}>
          <CustomLabel
            labelVal="Vehicle Variants' List"
            variantVal='h3-underline'
          />
        </Grid>
        <Grid item xs={8}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <QuickSearchPage
                masterKey='_id'
                module={'VehicleType'}
                searchClicked={searchClicked}
                searchUrl={'/employee-reg/filter'}
                masterFields={['empCode', 'emailId', 'firstName']}
                filterRes={filterRes}
                getFilterData={getFilterData}
                setFilterRes={setFilterRes}
              />
              <AppTooltip placement={'top'} title={'Search Employee'}>
                <SearchOutlinedIcon
                  onClick={() => {
                    setsearchClicked(!searchClicked);
                  }}
                  sx={{ml: 2, mr: 4}}
                  className='pointer'
                />
              </AppTooltip>
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
                <AppTooltip placement={'top'} title={'Add New Vehicle Variant'}>
                  <img
                    src='/assets/images/title-icon/add vehicle variant.svg'
                    className='title-icons-mui'
                    onClick={handleDialogForm}
                  />
                </AppTooltip>
              )}
            </div>
            {myActions?.includes('Download And Upload') && (
              <ExcelContainer
                downloadFile={'VehicleVariant'}
                downloadURL={'/user-reg/vehicletype/download'}
                getHeadersUrl={'/user-reg/vehicletype/headerdata'}
                downloadTempURL={'/user-reg/vehicletype/download-template'}
                uploadURL={'/user-reg/vehicletype/import-excel'}
              />
            )}
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
        data={filterRes || []}
        // tableRef={tableRef}
        // data={(query) =>
        //   new Promise((resolve, reject) => {
        //     let url = `${api.masterVehicletype.listbytanent}?page=${query.page}&size=${query.pageSize}&vehicleType=null`,
        //       body = {
        //         pageSize: query.pageSize,
        //         pageNo: query.page,
        //       };
        //     // if (!_.isEmpty(filter)) {
        //     //   body = {
        //     //     ...body,
        //     //     ...filter
        //     //   }
        //     // }
        //     axios
        //       .get(url, body)
        //       .then((result) => {
        //         resolve({
        //           data: result.data?.data?.body['VehicleTypeList'] ?? [],
        //           page: result?.data?.data?.body?.currentPage ?? 0,
        //           totalCount: result?.data?.data?.body?.totalItems ?? 0,
        //         });
        //         //
        //       })
        //       .catch((err) => {
        //         resolve({
        //           data: [],
        //           page: 0,
        //           totalCount: 0,
        //         });
        //       });
        //   })
        // }
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
                  style={{opacity: rd.status == 'INACTIVE' ? '0.3' : ''}}
                />
              ),
              tooltip: 'Edit',
              onClick: (event, rowData) => {
                if (rowData.status == 'ACTIVE') handleClickEdit(rowData);
              },
            },
          {
            icon: () => <VisibilityIcon color='primary' />,
            tooltip: 'View',
            onClick: (event, rowData) => handleClickView(rowData),
          },
          (rd) =>
            myActions?.includes('Deactivate') && {
              icon: () => (
                <DeleteIcon
                  color='primary'
                  style={{
                    color: '#bc0805',
                    opacity: rd.status == 'INACTIVE' ? '0.3' : '',
                  }}
                />
              ),
              tooltip: 'Deactivate',
              onClick: (event, rowData) => {
                if (rowData.status == 'ACTIVE') handleDelete(rowData);
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
        PaperProps={{
          sx: {
            width: '600px',
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
          <h1>Vehicle Variant</h1>
          <CloseIcon
            onClick={() => {
              setOpenForm(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent>
          <CreateForm close={handleCloseForm} />
        </DialogContent>
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
              <h1 style={{marginTop: '1.5rem'}}>Vehicle Variant Details</h1>
              <CloseIcon
                onClick={handleClosedialog}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: 0}}>
              <DetailPage close={handleClosedialog} id={id} />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Vehicle Variant?'}
        handleClose={closeConfirmBox}
      />
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Vehicle Variant Filter'}
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
