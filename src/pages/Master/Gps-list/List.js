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
// import CreateForm from './CreateForm';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
// import EditForm from './EditPage';
import DetailPage from '../VehicleType/DetailPage';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomLabel from 'pages/common/CustomLabel';
import ExcelContainer from '@excelupload';
import AppTooltip from '@crema/core/AppTooltip';
import Confirm from '@confirmation-box';
import {Box, DialogTitle, Grid} from '@mui/material';
import {toast} from 'react-toastify';
import RestoreIcon from '@mui/icons-material/Restore';
import moment from 'moment';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import QuickSearchPage from '@quick-search';
import Api from '@api';
const List = () => {
  const [userStatus, setuserStatus] = useState('Active');
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [gpsProviderId, setGpsProviderId] = useState([]);
  const [data, setData] = useState([]);
  const tableRef = React.useRef();
  const [openform, setOpenForm] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const [id, setId] = useState();
  const [opendetail, setOpenDetail] = useState(false);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [filter, setFilter] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const [filterRes, setFilterRes] = useState();
  const [filterShow, setfilterShow] = useState();
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);
  const tanentId = user?.userList?.tanentId;
  popBTNClick, openDialog;
  useEffect(() => {
    getGpsProviderList();
  }, [filter]);
  const getFilterData = () => {
    let url_ = api.baseUri + '';
    let post_ = {
      collection: '',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: '',
      pageNo: 1,
      pageSize: 1000,
    };
    axios
      .post(url_, !filter || _.isEmpty(filter) ? def_post : post_)
      .then((re_) => {
        console.log('re', re_?.data?.data);
        setFilterRes(re_?.data?.data);
      })
      .catch((err) => {
        setFilterRes([]);
      });
  };
  const fieldList = [
    {
      title: 'IMEI',
      value: 'imei',
    },
    {
      title: 'GPS Vendor',
      value: 'gpsVendor',
    },
  ];
  function popBTNClick(val) {
    getGpsProviderList();
    // setTimeout(() => {
    //   tableRef.current && tableRef.current.onQueryChange();
    // }, 0);
    if (!val) {
      setopenDialog(false);
    }
  }
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };
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

  // function getAll() {
  //   // axios
  //   //   .get(
  //   //     api.baseUri +
  //   //       '/user-reg/vehicletype/getAllvehicleTypeBytanentId?page=0&size=1000&vehicleType=null',
  //   //   )
  //   //   .then((res) => {
  //   //     if (res?.data?.status == '200') {
  //   //       setData(res.data?.data?.body['VehicleTypeList'] ?? []);
  //   //     }
  //   //   })
  //   //   .catch((err) => {});
  // }
  const getGpsProviderList = () => {
    axios
      .get(Api.baseUri + '/user-reg/gps-vehicle/get-AllGpsVehicle')
      .then((re_) => {
        setGpsProviderId(re_?.data?.data ?? []);
      })
      .catch((err) => {
        setGpsProviderId([]);
      });
  };

  const tableTemplate = {
    columns: [
      {
        title: 'IMEI',
        field: 'imeiNO',
      },
      {
        title: 'GPS Vendor',
        field: 'vendorName',
      },
      {
        title: 'Key',
        field: 'securityKey',
      },
      {
        title: 'Vehicle Number',
        field: 'vehicleNumberPlate',
      },
    ],
  };

  const handleClosedialog = () => {
    setOpenDetail(false);
  };

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} sm={3} md={3} sx={{mb: 2}}>
          <CustomLabel labelVal='GPS List' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} sm={3} md={3.5}>
          <QuickSearchPage
            masterKey='vehicleType'
            module={'VehicleType'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            // masterFields={['empCode', 'emailId', 'firstName']}
            displayFields={['vehicleType', 'vehicleOccupancy']}
            gpsProviderId={gpsProviderId}
            getGpsProviderList={getGpsProviderList}
            setGpsProviderId={setGpsProviderId}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={5.5}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
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
                    setFilterRes(null);
                    setfilterShow(false);
                    setFilter({});
                    handleClosefilter({button: 'clear'});
                  }}
                  className='title-icons-mui'
                />
              </AppTooltip>
              {/* {myActions?.includes('Create') && (
                <AppTooltip placement={'top'} title={'Add GPS Vendor'}>
                  <img
                    src='/assets/images/gps.svg'
                    className='title-icons-mui'
                    onClick={handleDialogForm}
                  />
                </AppTooltip>
              )} */}
            </div>
            {myActions?.includes('Download And Upload') && (
              <ExcelContainer
                downloadFile={'GPS Vendor Lists'}
                downloadURL={'/user-reg/gps-vehicle/download'}
                getHeadersUrl={'/user-reg/gps-vehicle/headerdataForDownload'}
                downloadTempURL={'/user-reg/gps-vehicle/download-template'}
                uploadURL={'/user-reg/gps-vehicle/import-excel'}
              />
            )}
          </Box>
        </Grid>
      </Grid>
      {/* {openDialog && dialID && (
        <EditForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )} */}
      {console.log('Prince', tableTemplate.columns)}
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
        data={gpsProviderId ?? []}
        options={{
          search: false,
          showTitle: false,
          selection: false,

          sorting: true,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        // actions={[
        //   (rd) =>
        //   myActions?.includes('Edit') && {
        //     icon: () => <EditIcon color='primary'
        //     style={{
        //       opacity: rd?.status == 'INACTIVE' ? '0.3' : '',
        //     }} />,
        //     tooltip: 'Edit',
        //     onClick: (event, rowData) => {
        //       if(rowData.status === "INACTIVE"){
        //         return;
        //       }
        //       handleClickEdit(rowData)},
        //   },
        //   {
        //     icon: () => <VisibilityIcon color='primary' />,
        //     tooltip: 'View',
        //     onClick: (event, rowData) => handleClickView(rowData),
        //   },

        //   (rd) =>
        //     myActions?.includes('Deactivate') && {
        //       icon: () => (
        //         <DeleteIcon
        //           color='primary'
        //           style={{
        //             opacity: rd?.status == 'INACTIVE' ? '0.3' : '',
        //             color: '#bc0805',
        //           }}
        //         />
        //       ),
        //       tooltip: 'Deactivate',
        //       onClick: (event, rowData) => {
        //         if(rd.status === "INACTIVE"){
        //           return;
        //         }
        //         handleDelete(rowData)},
        //     }
        // ]}
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
          <h1>Add GPS Vendor</h1>
          <CloseIcon
            onClick={() => {
              setOpenForm(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent>
          {/* <CreateForm close={handleCloseForm} /> */}
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
              <h1 style={{marginTop: '1.5rem'}}>GPS Vendor Details</h1>
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
