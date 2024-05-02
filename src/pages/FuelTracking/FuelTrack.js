import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Api from '@api';
import _ from 'lodash';
import SmartTable from '@smart-table';
import {useAuthUser} from '@crema/utility/AuthHooks';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {Box, DialogTitle, Grid, DialogContent, Dialog} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import SmartForm from '@smart-form';
import {toast} from 'react-toastify';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {getFormData} from '@hoc';
import regex from '@regex';
import downDoc from '@common/fileDownload';
import QuickSearchPage from '@quick-search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PendingList from './PendingList';
import {useSelector} from 'react-redux';
import FuelCorporate from './FuelCorporate';
import {useNavigate} from 'react-router-dom';
import FuelVendor from './FuelVendor';
import EditFuelTracking from './Edit';
const fieldList = [
  {title: 'Vehicle No', value: 'vehicleNo'},
  {title: 'Vehicle Type', value: 'vehicleType'},
  {title: 'Vehicle Model', value: 'vehicleModel'},
  {title: 'Fuel Station', value: 'fuelStation'},
  {title: 'Fuel Volume', value: 'fuelVolume'},
  {title: 'Fuel Price', value: 'fuelPrice'},
  {title: 'Status', value: 'status'},
];

const FuelTrack = () => {
  const {user} = useAuthUser();
  const [data, setData] = useState();
  const [openForm, setOpenForm] = useState(false);
  const [driver, setDriver] = useState();
  const [vehicleList, setVehicleList] = useState();
  const [driverList, setDriverList] = useState();
  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [searchClicked, setsearchClicked] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogView, setOpenDialogView] = useState(false);
  const [documentView, setDocumentView] = useState(false);
  const [myActions, setMyActions] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [vendorOptions, setVendorOptions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const tableRef = useRef();
  const [dialID, setdialID] = useState();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Fuel Tracking') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  useEffect(() => {
    getFilterData();
  }, [filter]);
  const getFilterData = () => {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  };
  function popBTNClick(val) {
    getFilterData();
    if (!val) {
      setOpenEditDialog(false);
    }
  }
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/associatevendor/getallassociatecorporateId')
      .then((re) => {
        let ar = [];
        re?.data?.data?.map((el) => {
          ar.push({title: el?.vendorName, value: el?.vendorId});
        });
        setVendorOptions(ar);
      });
  }, []);

  function getAllList() {
    axios
      .get(Api.baseUri + '/user-reg/fuelTracking/getAllApprovedRejected')
      .then((res) => {
        if (res?.data?.status == '200') {
          setData(res?.data?.data ?? []);
        }
      })
      .catch((err) => {
        setData([]);
      });
  }
  useEffect(() => {
    getAllList();
  }, []);
  function dataDownload(d) {
    if (typeof d == 'string') downDoc?.downloadDoc(d);
    else {
      d?.map((el) => {
        downDoc?.downloadDoc(el);
      });
    }
  }

  const tableTemplate = {
    columns: [
      {
        title: 'Vendor Name',
        field: 'vendorName',
      },
      {
        title: 'Vehicle Type',
        field: 'vehicleType',
      },
      {
        title: 'Vehicle Number',
        field: 'vehicleNo',
      },
      {
        title: 'Vehicle Model',
        field: 'vehicleModel',
      },
      {
        title: 'Driver Name',
        field: 'driverName',
      },
      {
        title: 'Fuel Station',
        field: 'fuelStation',
      },
      {
        title: 'Fuel Volume',
        field: 'fuelVolume',
      },
      {
        title: 'Fuel Price',
        field: 'fuelPrice',
      },
      // {
      //   title: 'Mileage',
      //   field: 'mileage',
      // },
      {
        title: 'Odometer Reading',
        field: 'odoMeterReadin',
      },
      {
        title: 'Generated On',
        field: 'createdOn',
        type: 'datetime',
      },
      {
        title: 'Status',
        field: 'status',
      },
    ],
  };
  const VendortableTemplate = {
    columns: [
      {
        title: 'Vehicle Type',
        field: 'vehicleType',
      },
      {
        title: 'Vehicle Number',
        field: 'vehicleNo',
      },
      {
        title: 'Vehicle Model',
        field: 'vehicleModel',
      },
      {
        title: 'Driver Name',
        field: 'driverName',
      },
      {
        title: 'Fuel Station',
        field: 'fuelStation',
      },
      {
        title: 'Fuel Volume',
        field: 'fuelVolume',
      },
      {
        title: 'Fuel Price',
        field: 'fuelPrice',
      },
      // {
      //   title: 'Mileage',
      //   field: 'mileage',
      // },
      {
        title: 'Odometer Reading',
        field: 'odoMeterReadin',
      },
      {
        title: 'Generated On',
        field: 'createdOn',
        type: 'datetime',
      },
      {
        title: 'Status',
        field: 'status',
      },
    ],
  };

  function handleDownload(data) {
    dataDownload([data?.odoMeterDoc, data?.invoiceDoc, data?.indentDoc]);
  }
  function handleClickView(rowData) {
    if (!rowData?.odoMeterDoc && !rowData?.invoiceDoc && !rowData?.indentDoc) {
      return;
    }
    setDocumentView(rowData);
    setOpenDialogView(true);
  }

  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} sm={3} md={3} sx={{mb: 2}}>
          <CustomLabel labelVal='Fuel Tracking' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} sm={3} md={3.5}>
          <QuickSearchPage
            masterKey='vehicleNo'
            module={'FuelTracking'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            // masterFields={['empCode', 'emailId', 'firstName']}
            displayFields={[
              'vehicleType',
              'vehicleNo',
              'vehicleModel',
              'driverName',
            ]}
            filterRes={filterRes}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={5.5} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
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
                    setfilterShow(false);
                    setFilter({});
                    handleClosefilter({button: 'clear'});
                  }}
                  className='title-icons-mui'
                />
              </AppTooltip>
              {myActions?.includes('Create') && (
                <AppTooltip placement={'top'} title={'Add New Fuel Track'}>
                  <img
                    src='/assets/images/title-icon/add-driver.svg'
                    className='title-icons-mui'
                    onClick={() => {
                      setOpenForm(true);
                    }}
                  />
                </AppTooltip>
              )}
              {myActions?.includes('Approve Or Reject') && (
                <AppTooltip placement={'top'} title={'Pending Requests'}>
                  <span
                    className='title-icons-mui'
                    style={{
                      display: 'flex',
                      alignItems: 'end',
                      fontWeight: 600,
                    }}
                  >
                    <PendingActionsIcon
                      onClick={() => {
                        setOpenDialog(true);
                      }}
                    />
                    {/* <span style={{fontSize: '12px'}}>{pendingRcount ?? 0}</span> */}
                  </span>
                </AppTooltip>
              )}
            </div>
          </Box>
        </Grid>
      </Grid>

      {!filterRes ? (
        <SmartTable
          tableRef={tableRef}
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
          columns={
            user?.userList?.userRole == 'VENDOR'
              ? VendortableTemplate.columns
              : tableTemplate.columns
          }
          // data={data || []}
          data={(query) =>
            new Promise((resolve, reject) => {
              let url_ = Api.baseUri + '/api/dashboard/employee/filter',
                body =
                  !filter || _.isEmpty(filter)
                    ? {
                        collection: 'FuelTracking',
                        pageSize: query.pageSize,
                        pageNo: query.page + 1,
                      }
                    : {
                        collection: 'FuelTracking',
                        filterType: 'filter',
                        filters: filter,
                        pageSize: query.pageSize,
                        pageNo: query.page + 1,
                      };
              if (!_.isEmpty(filter)) {
                body = {
                  ...body,
                  ...filter,
                };
              }
              axios
                .post(url_, body)
                .then((result) => {
                  resolve({
                    data: result?.data?.data ?? [],
                    page: (result?.data?.currentPage || 0) - 1,
                    totalCount: result?.data?.totalItems ?? 0,
                  });
                })
                .catch((err) => {
                  resolve({
                    data: [],
                    page: 0,
                    totalCount: 0,
                  });
                });
            })
          }
          options={{
            search: false,
            showTitle: false,
            selection: false,

            sorting: true,
            actionsColumnIndex: -1,
            headerStyle: {position: 'sticky', top: 0},
          }}
          actions={[
            (rd) => ({
              icon: () => (
                <FileDownloadIcon
                  color='primary'
                  style={{
                    opacity:
                      !rd?.odoMeterDoc && !rd?.invoiceDoc && !rd?.indentDoc
                        ? '0.3'
                        : '',
                  }}
                />
              ),
              tooltip: 'Download File',
              onClick: (event, rowData) => handleDownload(rowData),
            }),
            (rd) => ({
              icon: () => (
                <VisibilityIcon
                  color='primary'
                  style={{
                    opacity:
                      !rd?.odoMeterDoc && !rd?.invoiceDoc && !rd?.indentDoc
                        ? '0.3'
                        : '',
                  }}
                />
              ),
              tooltip: 'view documents',
              onClick: (event, rowData) => handleClickView(rowData),
            }),
            (rd) => ({
              icon: () => <EditIcon color='primary' />,
              tooltip: 'EDIT',
              onClick: (event, rowData) => {
                console.log('shreya');
                setdialID(rowData);
                setOpenEditDialog(true);
              },
            }),
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
      ) : (
        <SmartTable
          tableRef={tableRef}
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
          columns={
            user?.userList?.userRole == 'VENDOR'
              ? VendortableTemplate.columns
              : tableTemplate.columns
          }
          data={filterRes || []}
          options={{
            search: false,
            showTitle: false,
            selection: false,
            sorting: true,
            actionsColumnIndex: -1,
            headerStyle: {position: 'sticky', top: 0},
            pageSize: pageSize,
            pageSizeOptions: [10, 25, 50],
          }}
          onChangeRowsPerPage={(pageSize) => {
            setPageSize(pageSize);
          }}
          actions={[
            (rd) => ({
              icon: () => (
                <FileDownloadIcon
                  color='primary'
                  style={{
                    opacity:
                      !rd?.odoMeterDoc && !rd?.invoiceDoc && !rd?.indentDoc
                        ? '0.3'
                        : '',
                  }}
                />
              ),
              tooltip: 'Download File',
              onClick: (event, rowData) => handleDownload(rowData),
            }),
            (rd) => ({
              icon: () => (
                <VisibilityIcon
                  color='primary'
                  style={{
                    opacity:
                      !rd?.odoMeterDoc && !rd?.invoiceDoc && !rd?.indentDoc
                        ? '0.3'
                        : '',
                  }}
                />
              ),
              tooltip: 'view documents',
              onClick: (event, rowData) => handleClickView(rowData),
            }),
            (rd) => ({
              icon: () => <EditIcon color='primary' />,
              tooltip: 'EDIT',
              onClick: (event, rowData) => {
                console.log('shreya');
                setdialID(rowData);
                setOpenEditDialog(true);
              },
            }),
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
      )}

      <Dialog
        onClose={() => {
          setOpenForm(false);
        }}
        open={openForm}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '900px',
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
                width: '900px',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Add Fuel Track</h1>
              <CloseIcon
                onClick={() => {
                  setOpenForm(false);
                  getAllList();
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '1rem', marginTop: '60px'}}>
              {user?.userList?.userRole == 'VENDOR' ? (
                <FuelVendor
                  close={() => {
                    getFilterData();
                    setOpenForm(false);
                  }}
                />
              ) : (
                <FuelCorporate
                  close={() => {
                    getFilterData();
                    setOpenForm(false);
                  }}
                />
              )}
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <Dialog
        onClose={() => {
          setOpenDialog(false);
        }}
        open={openDialog}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '1200px',
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
                width: '1200px',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Pending Request</h1>
              <CloseIcon
                onClick={() => {
                  setOpenDialog(false);
                  getAllList();
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '1rem', marginTop: '60px'}}>
              <PendingList
                close={() => {
                  setOpenDialog(false);
                  getAllList();
                }}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <Dialog
        onClose={() => {
          setOpenDialogView(false);
        }}
        open={openDialogView}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '70%',
          },
        }}
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
                display: 'flex',
                alignItems: 'center', // Center items vertically
                justifyContent: 'space-between',
              }}
            >
              <h1
                style={{
                  margin: '0',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                Fuel Tracking
              </h1>
              <CloseIcon
                onClick={() => {
                  setOpenDialogView(false);
                  getAllList();
                }}
                style={{
                  color: '#4f4f4f',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%', // Full width
                paddingLeft: '10%',
                paddingRight: '10%',
              }}
            >
              {/* {console.log('documentView', documentView)} */}

              {/* Render indentDoc if present */}
              {documentView?.indentDoc && (
                <div style={{marginBottom: '20px', width: '100%'}}>
                  <h2
                    style={{
                      fontSize: '1.5rem',
                      marginBottom: '10px',
                      color: '#333',
                      fontWeight: 'bold',
                      borderBottom: '2px solid #333', // Underline effect
                      paddingBottom: '5px', // Spacing between text and underline
                    }}
                  >
                    Indent Document
                  </h2>
                  {/* Check if the document is an image or PDF */}
                  {documentView.indentDoc.endsWith('.pdf') ? (
                    <iframe
                      src={`${Api.imgUrl}${documentView.indentDoc}`}
                      title='Indent Document'
                      style={{
                        width: '100%',
                        height: '500px',
                        border: 'none',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <img
                      src={Api.imgUrl + documentView.indentDoc}
                      alt='Indent Document'
                      style={{
                        width: '100%',
                        height: '500px',
                        objectFit: 'contain',
                      }}
                    />
                  )}
                </div>
              )}

              {/* Render invoiceDoc if present */}
              {documentView?.invoiceDoc && (
                <div style={{marginBottom: '20px', width: '100%'}}>
                  <h2
                    style={{
                      fontSize: '1.5rem',
                      marginBottom: '10px',
                      color: '#333',
                      fontWeight: 'bold',
                      borderBottom: '2px solid #333', // Underline effect
                      paddingBottom: '5px', // Spacing between text and underline
                    }}
                  >
                    Invoice Document
                  </h2>
                  {documentView.invoiceDoc.endsWith('.pdf') ? (
                    <iframe
                      src={`${Api.imgUrl}${documentView.invoiceDoc}`}
                      title='Invoice Document'
                      style={{
                        width: '100%',
                        height: '500px',
                        border: 'none',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <img
                      src={Api.imgUrl + documentView.invoiceDoc}
                      alt='Invoice Document'
                      style={{
                        width: '100%',
                        height: '500px',
                        objectFit: 'contain',
                      }}
                    />
                  )}
                </div>
              )}

              {/* Render odoMeterDoc if present */}
              {documentView?.odoMeterDoc && (
                <div style={{marginBottom: '20px', width: '100%'}}>
                  <h2
                    style={{
                      fontSize: '1.5rem',
                      marginBottom: '10px',
                      color: '#333',
                      fontWeight: 'bold',
                      borderBottom: '2px solid #333', // Underline effect
                      paddingBottom: '5px', // Spacing between text and underline
                    }}
                  >
                    Odometer Document
                  </h2>
                  {documentView.odoMeterDoc.endsWith('.pdf') ? (
                    <iframe
                      src={`${Api.imgUrl}${documentView.odoMeterDoc}`}
                      title='Odometer Document'
                      style={{
                        width: '100%',
                        height: '500px',
                        border: 'none',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <img
                      src={Api.imgUrl + documentView.odoMeterDoc}
                      alt='Odometer Document'
                      style={{
                        width: '100%',
                        height: '500px',
                        objectFit: 'contain',
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </div>
      </Dialog>

      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Fuel Track Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}

      {dialID && openEditDialog && (
        <EditFuelTracking
          openDialog={openEditDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}
    </div>
  );
};

export default FuelTrack;
