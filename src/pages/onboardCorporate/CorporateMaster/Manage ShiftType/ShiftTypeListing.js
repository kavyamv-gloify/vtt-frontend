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
import EditShiftType from './EditShiftType';
import NewShiftsType from './NewShiftsType';
import DetailPage from '../SpecialEmployee/Detail';
import CustomLabel from 'pages/common/CustomLabel';
import Confirm from '@confirmation-box';
const ShiftTypeTable = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({});
  const [opendetail, setOpenDetail] = useState(false);
  const {user} = useAuthUser();
  const tableRef = React.useRef();
  const [myData, setMyData] = useState([]);
  const [openDialog, setopenDialog] = useState(false);
  const [openform, setOpenForm] = useState(false);
  const [dialID, setdialID] = useState();
  const [id, setId] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState();
  popBTNClick, openDialog;

  function popBTNClick(val) {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
    if (!val) {
      setopenDialog(false);
    }
  }

  const tableTemplate = {
    columns: [
      {
        title: 'Shift Type',
        field: 'shiftType',
      },
      {
        title: 'PickUp Type',
        field: 'pickupType',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'date',
      },
      {
        title: 'Updated On',
        field: 'updatedOn',
        type: 'date',
      },
      {
        title: 'Updated By',
        field: 'updatedBy',
      },
    ],
  };

  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?.id);
  }

  const handleClickDelete = (rowData) => {
    setId(rowData.id);
    handleConfirmBox();
  };
  const handleDialogForm = () => {
    setOpenForm(true);
  };
  const handleClickView = (rowData) => {
    setId(rowData?.id);
    setOpenDetail(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };
  const handleCloseForm = (status) => {
    setOpenForm(status);
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  };
  const handlecloseDialoge = () => {
    setOpenDetail(false);
  };

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };

  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      axios
        .post(`${Api.specialEmployee.getbyId}/deactivatespecialemployee/${id}`)
        .then((response) => {
          if (response?.data?.status == '200') {
            // setTimeout(() => {
            //   tableRef.current && tableRef.current.onQueryChange()
            // }, 0);
            getAllSpecialEmp();
            setOpenConfirmBox(false);
            navigate(
              '/onboardCorporate/special-employee/specialemployee-listing',
            );
          }
        })
        .catch((err) => {});
    }

    if (dd == 'NO') {
      setOpenConfirmBox(false);
    }
  };

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <CustomLabel labelVal='Shift Type List' variantVal='h3-underline' />
        </div>
      </div>

      {openDialog && dialID && (
        <EditShiftType
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}
      <div
        style={{
          textAlign: 'right',
          paddingRight: '10px',
          backgroundColor: '',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        <Button
          id='btnMui123'
          variant='contained'
          style={{margin: '8px'}}
          onClick={handleDialogForm}
        >
          Add Shift Type
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
        columns={tableTemplate.columns}
        tableRef={tableRef}
        data={(query) =>
          new Promise((resolve, reject, values) => {
            let url = Api.shiftType.getAll,
              body = {
                pageSize: query.pageSize,
                pageNo: query.page,
              };

            // if (!_.isEmpty(filter)) {
            //   body = {
            //     ...body,
            //     ...filter
            //   }
            // }
            axios.get(url, body).then((result) => {
              resolve({
                data:
                  result?.data && result?.data?.data ? result?.data?.data : [],
                page:
                  result.data && result.data.currentPage
                    ? result.data.currentPage
                    : 0,
                totalCount:
                  result.data && result.data.totalItems
                    ? result.data.totalItems
                    : 0,
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
          {
            icon: () => <EditIcon color='primary' />,
            tooltip: 'edit',
            onClick: (event, rowData) => handleClickEdit(rowData),
          },
          // {
          //   icon: () => (<Delete color="primary" style={{ color: "#bc0805" }} />),
          //   tooltip: 'delete',
          //   onClick: (event, rowData) => handleClickDelete(rowData)
          // },
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
              <h1 style={{marginTop: '1.5rem'}}>Shift Type</h1>
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
              <NewShiftsType close={handleCloseForm} />
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
      />
    </>
  );
};
export default ShiftTypeTable;
