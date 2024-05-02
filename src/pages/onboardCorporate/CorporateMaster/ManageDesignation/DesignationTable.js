import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import SmartForm from '@smart-form';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {Navigate, useNavigate} from 'react-router-dom';
import axios from 'axios';
import _, {values} from 'lodash';
import Api from '@api';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';
import DesignationForm from './Form';
import Button from '@mui/material/Button';
import {setFilters} from 'redux/actions';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import EditDesignationForm from './Edit';
import {Delete} from '@mui/icons-material';
import Excel from '@excelupload';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomLabel from 'pages/common/CustomLabel';
import Confirm from '@confirmation-box';
import ExcelContainer from '@excelupload';
import RestoreIcon from '@mui/icons-material/Restore';
import moment from 'moment';
const DesignationTable = ({
  myActions,
  designation,
  designationList,
  reloadPage,
  getFilterData,
}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const corporateId = user?.userList?.profileId;
  const [opendetail, setOpenDetail] = useState(false);
  const tableRef = React.useRef();
  const [openDialog, setopenDialog] = useState(false);
  const [openform, setOpenForm] = useState(false);
  const [dialID, setdialID] = useState();
  const [id, setId] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [businessId, setBussinessId] = useState();
  const [businessname, setBusinessName] = useState();
  const [button, setButton] = useState();
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);
  function popBTNClick(val) {
    if (!val) {
      setopenDialog(false);
      reloadPage();
    }
  }

  useEffect(() => {
    getbusinesss();
  }, [designation]);

  async function getbusinesss() {
    await axios
      .get(`${Api.businessUnit.getbyId}/${designation}`)
      .then((res) => {
        console.log('gggggg', res);
        setBussinessId(res?.data?.data?.id);
        setBusinessName(res?.data?.data?.name);
      })
      .catch((er) => {});
  }

  const tableTemplate = {
    columns: [
      {
        title: 'Designation Name',
        field: 'designationName',
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
    setdialID(rowData?._id);
    setopenDialog(true);
  }

  function handleClickDelete(rowData) {
    setId(rowData?._id);
    setOpenConfirmBox(true);
  }

  const handleClose = () => {
    //
    setOpenForm(false);
    // getbusinesss();
    reloadPage();
  };

  const handleCloseForm = (status) => {
    setOpenForm(status);
    reloadPage();
    // getbusinesss();
  };

  const closeConfirmBox = (dd, reason) => {
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/bussiness-unit/deActivatedesig/${id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(
              `${response?.data?.data?.designationName} deactivated`,
            );
            setOpenConfirmBox(false);
            setId(null);
            getFilterData();
            reloadPage();
            //   navigate('/onboardCorporate/department/department-listing');
          }
        })
        .catch((err) => {});
    }
    if (dd == 'NO') {
      setOpenConfirmBox(false);
    }
  };

  function closeConfirmBoxReactivate(dd, reason) {
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/bussiness-unit/reActivatedesig/${id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(
              `${response?.data?.data?.designationName} reactivated`,
            );
            setOpenConfirmBoxReactivate(false);
            setId(null);
            getFilterData();
            reloadPage();
            //   navigate('/onboardCorporate/department/department-listing');
          }
        })
        .catch((err) => {});
    }
    if (dd == 'NO') {
      setOpenConfirmBoxReactivate(false);
    }
  }
  return (
    <>
      {dialID && openDialog && (
        <EditDesignationForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
          getFilterData={getFilterData}
        />
      )}
      <div
        style={{textAlign: 'right', paddingRight: '10px', backgroundColor: ''}}
      >
        <Button
          id='btnMui123'
          variant='contained'
          style={{margin: '8px'}}
          onClick={() => {
            setButton('submit');
            setOpenForm(true);
          }}
        >
          Add Designation
        </Button>
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
        title='Department Details'
        columns={tableTemplate.columns}
        tableRef={tableRef}
        data={designationList}
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          myActions?.includes('Edit') && {
            icon: () => <EditIcon color='primary' />,
            tooltip: 'Edit',
            onClick: (event, rowData) => handleClickEdit(rowData),
          },
          (rd) =>
            myActions?.includes('Deactivate') && {
              icon: () => (
                <DeleteIcon
                  style={{
                    color: '#CC0000',
                    opacity: rd?.status == 'ACTIVE' ? '' : '0.2',
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
        open={button == 'submit' ? openform : null}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '30%',
          },
        }}
        // style={{ borderRadius: "4rem" }}
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
              <h1 style={{marginTop: '1.5rem'}}>Designation</h1>
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
              <DesignationForm
                close={handleCloseForm}
                bussinessId={businessId}
                businessname={businessname}
                getFilterData={getFilterData}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      {/* <Dialog
        open={opendetail}
        maxWidth="false"
        PaperProps={{
          sx: {
            width: "60%"

          }
        }}
        style={{ borderRadius: "4rem" }}>
        <div >
          <DialogContent style={{ padding: "0px", }}  >
            <div style={{ display: "flex", justifyContent: "space-between", background: "#f5f2f2", height: "4rem", paddingRight: "1.5rem", paddingLeft: "1.5rem", position: "fixed", width: "60%", zIndex: "9", borderRadius: "5px 5px 0px 0px" }}>
              <h1 style={{ marginTop: '1.5rem' }}>Department Detail</h1>
              <CloseIcon onClick={closeDetailForm} style={{ marginTop: "1.4rem", color: "#4f4f4f", fontWeight: "bold" }} />
            </div>
            <div style={{ padding: "2rem", marginTop: '1.5rem' }}>
              {dialID && <DetailPage close={internaldialogs} id={dialID} />}
            </div>

          </DialogContent>
        </div>

      </Dialog> */}
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Designation?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the Designation?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
    </>
  );
};
export default DesignationTable;
