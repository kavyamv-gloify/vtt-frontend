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
import EditForm from '../NodelPoint/EditForm';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import CreateForm from '../NodelPoint/CreateForm';
import {Delete} from '@mui/icons-material';
import DetailForm from '../NodelPoint/DetailPage';
import ExcelContainer from '@excelupload';
import CustomLabel from 'pages/common/CustomLabel';
import Confirm from '@confirmation-box';
import {toast} from 'react-toastify';
import RestoreIcon from '@mui/icons-material/Restore';
const Table = ({myActions, nodalList, routeId, ReloadParent, officeId}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({});
  const {user} = useAuthUser();
  const tableRef = React.useRef();
  const [openDialog, setopenDialog] = useState(true);
  const [openform, setOpenForm] = useState(false);
  const [opendetail, setOpenDetail] = useState(false);
  const [dialID, setdialID] = useState();
  const [id, setId] = useState();
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);
  const [delId, setDelId] = useState('');
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  // const [ nodalList, setNodalList ] = useState();
  const closeConfirmBox = (dd, reason) => {
    console.log('delId', delId);
    setOpenConfirmBox(false);
    setDelId(null);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/office-route/nodalDeActive/${delId?._id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(`${res?.data?.data?.nodalStopName} deactivated`);
            // toast.success('nodal point deactivated successfully');
            ReloadParent();
          }
        });
    }
  };
  const closeConfirmBoxReactivate = (dd, reason) => {
    setOpenConfirmBoxReactivate(false);
    setDelId(null);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/office-route/nodalReActive/${delId?._id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(`${res?.data?.data?.nodalStopName} reactivated`);
            // toast.success('nodal point reactivated successfully');
            ReloadParent();
          }
        });
    }
  };

  function popBTNClick(val) {
    ReloadParent();
    if (!val) {
      setopenDialog(false);
    }
  }
  async function onSubmit(val) {
    //
    setFilters(val.data);
    setTimeout(() => {
      tableRef.current && table.Ref.current();
    }, 0);
  }

  const tableTemplate = {
    columns: [
      {
        title: 'Location',
        field: 'geoPoint.locName',
      },
      {
        title: 'Locality',
        field: 'geoPoint.locality',
      },
      // {
      //   title: 'TenentName',
      //   field: "tenentname"
      // }, 
      // {
      //   title: 'Landmark',
      //   field: "landmark"
      // },
      {
        title: 'Nodal Stop Name',
        field: 'nodalStopName',
      },
      {
        title: 'Latitude',
        field: 'geoPoint.latitude',
      },
      {
        title: 'Longitude',
        field: 'geoPoint.longitude',
      },
      {
        title: 'Distance(KM)',
        field: 'distancefromOffice',
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
    ],
  };

  const [geoPoint, setGeoPoint] = useState({
    locName: '',
    latitude: '',
    longitude: '',
  });

  let officeAdress = '';
  let officeLat = '';
  let officeLng = '';
  let completeOfficeAddress = '';
  function getGeo() {
    console.log('officeId', officeId);
    if (!officeId) {
      return;
    }
    axios
      .get(Api.siteOffice.list + '/' + officeId)
      .then((response) => {
        console.log('response', response);
        if (response?.data?.status == '200') {
          officeAdress = response?.data?.data?.location?.locName;
          officeLat = response?.data?.data?.location?.latitude;
          officeLng = response?.data?.data?.location?.longitude;
          setGeoPoint({
            ofclocName: officeAdress,
            ofclatitude: officeLat,
            ofclongitude: officeLng,
          });
        } else {
        }
      })
      .catch((er) => {});
  }

  function handleClickdelete(rowData) {
    setDelId(rowData);
    setOpenConfirmBox(true);
  }
  useEffect(() => {
    console.log('geoPoint', geoPoint);
  }, [geoPoint]);
  async function handleClickEdit(rowData) {
    getGeo();
    console.log('rowData', rowData);
    setopenDialog(true);
    setdialID(rowData?._id);
  }

  const handleDialogForm = async () => {
    getGeo();
    setOpenForm(true);
  };

  const handleDialogDetailForm = (rowData) => {
    setOpenDetail(true);
    setId(rowData.id);
  };

  const handleClose = () => {
    setOpenForm(false);
  };
  const handleCloseForm = (status) => {
    setOpenForm(status);
    setGeoPoint({
      locName: '',
      latitude: '',
      longitude: '',
    });
  };

  const closeDetailForm = () => {
    setOpenDetail(false);
  };
  const internalDetail = () => {
    setOpenDetail(false);
  };
  const nodalPointCreated = () => {
    setOpenForm(false);
    ReloadParent();
    // window.location.reload(false);
  };

  return (
    <>
      <div
        className='routeList'
        style={{display: 'flex', justifyContent: 'space-between'}}
      ></div>
      {openDialog == true && dialID && (
        <EditForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
          officeGeoPoint={geoPoint}
        />
      )}
      <div
        style={{textAlign: 'right', paddingRight: '10px', backgroundColor: ''}}
      >
        {myActions?.includes('Create') && (
          <Button
            id='btnMui123'
            variant='outlined'
            style={{margin: '8px'}}
            onClick={handleDialogForm}
          >
            Add Nodal Points
          </Button>
        )}
      </div>
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
        tableRef={tableRef}
        data={nodalList}
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
            myActions && {
              icon: () => (
                <EditIcon
                  color='primary'
                  style={{
                    opacity: rd?.status == 'INACTIVE' ? '0.3' : '',
                  }}
                />
              ),
              tooltip: 'edit',
              onClick: (event, rowData) => {
                // if (rowData?.status == 'INACTIVE') {
                //   return;
                // }
                handleClickEdit(rowData);
              },
            },
          (rd) =>
            myActions && {
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
                handleClickdelete(rowData);
              },
            },
          (rd) =>
            myActions && {
              icon: () => (
                <RestoreIcon
                  color='primary'
                  style={{opacity: rd?.status == 'INACTIVE' ? '' : '0.2'}}
                />
              ),
              tooltip: 'Reactivate',
              onClick: (event, rowData) => {
                if (rowData?.status == 'ACTIVE') {
                  return;
                }
                setDelId(rowData);
                setOpenConfirmBoxReactivate(true);
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
      {openform ? (
        <Dialog
          open={openform}
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
                }}
              >
                <h1 style={{marginTop: '1.5rem'}}>Nodal Point</h1>
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
                <CreateForm
                  close={handleCloseForm}
                  routeId={routeId}
                  geoPoint={geoPoint}
                  isSubmited={nodalPointCreated}
                />
              </div>
            </DialogContent>
          </div>
        </Dialog>
      ) : null}
      <Dialog
        onClose={closeDetailForm}
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
              <h1 style={{marginTop: '1.5rem'}}>Nodal Point Details</h1>
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
              <DetailForm close={internalDetail} id={id} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
      {delId ? (
        <Confirm
          open={openConfirmbox}
          header={'Confirm to Deactivate'}
          cnfMsg={'Are you sure, You want to deactivate the nodal point?'}
          handleClose={closeConfirmBox}
          reason={true}
        />
      ) : null}
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the nodal point?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
      ;
    </>
  );
};
export default Table;
