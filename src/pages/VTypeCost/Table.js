import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import {useAuthUser} from '@crema/utility/AuthHooks';
import EditIcon from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import _ from 'lodash';
import {useNavigate} from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import {Button} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditForm from './EditForm';
import CreateForm from './CreateForm';
import {FaLeaf} from 'react-icons/fa';
import CloseIcon from '@mui/icons-material/Close';
import DetailPage from '../VTypeCost/Detailpage';
const Table = () => {
  const {user} = useAuthUser();
  // const corporateId=user?.userList?.profileId;
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [openDialog, setopenDialog] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [dialID, setdialID] = useState();
  const tableRef = React.useRef();
  const [open, setOpen] = React.useState(false);
  const [openform, setOpenForm] = useState(false);

  function popBTNClick(val) {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
    if (!val) {
      setopenDialog(false);
    }
  }
  // useEffect(() => {
  //   async function fetchData() {
  //     const baseURL = `${Api.nodal.nodalpoint}/${id}`
  //     let response = await axios.get(`${baseURL}`);
  //     setData(response?.data?.data);
  //   }
  //   fetchData();
  // }, [id]);

  const tableTemplate = {
    columns: [
      {
        title: 'Vehicle Type',
        field: 'vehicleType',
      },
      {
        title: 'Capacity',
        field: 'capacity',
      },
      {
        title: 'Speed Limit',
        field: 'speed',
      },
      {
        title: 'Per KM Cost',
        field: 'costKM',
      },
      {
        title: 'Trip Cost',
        field: 'costTrip',
      },
      {
        title: 'Extra KM Charge',
        field: 'extraKMcharge',
      },
    ],
  };

  function handleCloseForm(status) {
    setOpenForm(status);
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  }
  function handleClosedialog() {
    setOpenDetail(false);
  }

  // const handleDialogForm = () => {
  //   setOpenForm(true);
  // }

  function handleClickEdit(rowData) {
    // navigate('/onbordTenent/NodelPoint/edit/' + rowData.id);
    setopenDialog(true);
    setdialID(rowData?.id);
  }
  const handleClickView = (rowData) => {
    // navigate('/onbordTenent/NodelPoint/edit/' + rowData.id);
    setOpenDetail(true);
    setdialID(rowData?.id);
  };

  function handleForm() {
    setOpenForm(true);
  }

  function handleClose() {
    setOpenForm(false);
  }

  return (
    <>
      {openDialog && dialID && (
        <EditForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}
      <div
        style={{textAlign: 'right', paddingRight: '0px', backgroundColor: ''}}
      >
        <Button
          id='btnMui123'
          variant='contained'
          style={{margin: '8px'}}
          onClick={handleForm}
        >
          Add Vehicle Cost
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
        title='Nodal Point List'
        columns={tableTemplate.columns}
        tableRef={tableRef}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url = `${Api.baseUri}/user-reg/vehicletypecost/getAll?page=1&size=10`,
              body = {
                pageSize: query.pageSize,
                pageNo: query.page,
              };
            if (!_.isEmpty(filter)) {
              body = {
                ...body,
                ...filter,
              };
            }
            axios
              .get(url, body)
              .then((result) => {
                resolve({
                  data:
                    result?.data && result?.data?.data
                      ? result?.data?.data
                      : [],
                  page:
                    result.data && result.data.currentPage
                      ? result.data.currentPage
                      : 0,
                  totalCount:
                    result.data && result.data.totalItems
                      ? result.data.totalItems
                      : 0,
                });
              })
              .catch(function (err) {
                toast.error('Something went wrong');
                resolve({
                  data: [],
                  page: 0,
                  totalCount: 0,
                });
                setshowbtn(true);
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
          color: 'primary',
        }}
        actions={[
          {
            icon: () => <EditIcon color='primary' />,
            tooltip: 'edit',
            onClick: (event, rowData) => handleClickEdit(rowData),
          },
          {
            icon: () => <Delete color='primary' />,
            tooltip: 'Deactivate',
            onClick: (event, rowData) => handleClickdelete(rowData),
          },
          {
            icon: () => <VisibilityIcon color='primary' />,
            tooltip: 'view',
            onClick: (event, rowData) => handleClickView(rowData),
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
                width: '41.7%',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Vehicle Type Cost</h1>
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
              <CreateForm close={handleCloseForm} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <Dialog
        onClose={handleClose}
        open={openDetail}
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
              <h1 style={{marginTop: '1.5rem'}}>VTypeCost Details</h1>
              {/* <CloseIcon onClick={handleClose} style={{ marginTop: "1.4rem", color: "#4f4f4f", fontWeight: "bold" }} /> */}
            </div>
            <div style={{padding: '2rem', marginTop: '1.5rem'}}>
              {dialID && <DetailPage close={handleClosedialog} id={dialID} />}
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default Table;
