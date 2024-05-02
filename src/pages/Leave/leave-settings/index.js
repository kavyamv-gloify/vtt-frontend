import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Box, Dialog, DialogContent, DialogTitle, Grid} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import LeaveSetting from './create';
import EditLeaveSetting from './edit';
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

const List = () => {
  const {user} = useAuthUser();
  const navigate = useNavigate();
  const [openAddDial, setOpenAddDial] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [settingList, setSettingList] = useState([]);
  const [editId, seteditId] = useState();
  const handleDialogForm = (val) => {
    setOpenAddDial(true);
  };

  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Leave Setting') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  // function popBTNClick(val) {
  //     setTimeout(() => {
  //         tableRef.current && tableRef.current.onQueryChange()
  //     }, 0);
  //     if (!val) { setopenDialog(false) }

  function getAllSettings() {
    setOpenAddDial(false);
    setOpenDialog(false);
    axios
      .get(api.leave.getAllLeaveSetting)
      .then((res) => {
        let tem = [];
        res?.data?.data?.map((el) => {
          let tempo = el;
          tempo.departmentName = tempo.departmentName?.join(', ');
          tem.push(tempo);
        });
        setSettingList(tem);
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAllSettings();
  }, []);
  const tableTemplate = {
    columns: [
      {
        title: 'Departments',
        field: 'departmentName',
      },
      {
        title: 'Cutoff Time to Apply (Days)',
        field: 'applyCutoffDays',
      },
      {
        title: 'Cutoff Time to Cancel (Days)',
        field: 'cancelCutoffDays',
      },
      {
        title: 'Allow Manager to Approve/Reject',
        field: 'managerApprovalReq',
      },
      {
        title: 'Allow Admin to Approve/Reject',
        field: 'corporateApprovalReq',
      },
    ],
  };

  function handleClickView(rowData) {}
  function handleClickEdit(rowData) {
    setOpenDialog(true);
    seteditId(rowData?.departments[0]);
  }

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal='Leave Settings' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className=''>
              {myActions?.includes('Create') && (
                <AppTooltip placement={'top'} title={'Add New Leave Setting'}>
                  <img
                    src='/assets/images/title-icon/add leave.svg'
                    className='title-icons-mui'
                    onClick={handleDialogForm}
                  />
                </AppTooltip>
              )}
            </div>
          </Box>
        </Grid>
      </Grid>
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
        title=''
        columns={tableTemplate.columns}
        data={settingList}
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          myActions?.includes('Edit') && {
            icon: () => <EditIcon color='primary' />,
            tooltip: 'edit',
            onClick: (event, rowData) => handleClickEdit(rowData),
          },
          // {
          //     icon: () => (<VisibilityIcon color="primary" />),
          //     tooltip: 'view',
          //     onClick: (event, rowData) => handleClickView(rowData)
          // }
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
        open={openAddDial}
        maxWidth='false'
      >
        <DialogTitle style={{background: 'rgb(245, 242, 242)'}}>
          <h1>Leave Setting</h1>
          <CloseIcon
            onClick={() => {
              setOpenAddDial(false);
            }}
            style={{position: 'absolute', right: '14px', top: '14px'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '20px', paddingTop: 0}}>
          <LeaveSetting
            setOpenAddDial={setOpenAddDial}
            getAllSettings={getAllSettings}
          />
        </DialogContent>
      </Dialog>
      {openDialog && (
        <EditLeaveSetting
          setOpenAddDial={setOpenAddDial}
          openDialog={openDialog}
          id={editId}
          getAllSettings={getAllSettings}
        />
      )}
    </>
  );
};

export default List;
