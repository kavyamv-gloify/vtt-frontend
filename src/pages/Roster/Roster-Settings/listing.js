import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _, {values} from 'lodash';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Button from '@mui/material/Button';
import Api from '@api';
import CustomLabel from 'pages/common/CustomLabel';
import {Box, Dialog, DialogContent, DialogTitle, Grid} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppTooltip from '@crema/core/AppTooltip';
import CreateRosterSetting from './create';
import {useSelector} from 'react-redux';
const List = () => {
  const [rosterId, setrosterId] = useState();
  const [rosterList, setRosterList] = useState([]);
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Roster Setting') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  useEffect(() => {
    let url = `${Api.baseUri}/user-reg/Roaster-Setting/getbycorporateId/${
      user?.userList?.corporateId
    }?page=${0}&size=${1200}`;
    axios
      .get(url)
      .then((result) => {
        let myarr = [];
        result?.data?.data?.body['Corporate List']?.map((ele) => {
          let depart = '';
          ele?.deptList?.map((dep) => {
            depart = depart
              ? depart + ', ' + dep?.departmentName
              : dep?.departmentName;
          });
          let tem = ele;
          tem.tem_department = depart;
          myarr.push(tem);
        });
        setRosterList(myarr);
      })
      .catch((err) => {});
  }, [rosterId]);
  const tableTemplate = {
    columns: [
      {
        title: 'Departments',
        field: 'tem_department',
      },
      {
        title: 'Allowed Roster days',
        field: 'advanceRoaster',
      },
      // {
      //     title: 'Employee Category',
      //     field: "category"
      // },
      {
        title: 'Daily Changes Allowed',
        field: 'allowDailyChanges',
      },
      {
        title: 'Emp Manage Roster',
        field: 'empManageRoaster',
      },
      {
        title: 'Manager Manage Roster',
        field: 'managerManageEmpRoaster',
      },
      {
        title: 'Corp Admin Manage Roster',
        field: 'corpAdminManageEmpRoaster',
      },
    ],
  };

  function handleClickEdit(rowData) {
    setrosterId(rowData.id);
  }

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal='Schedule Settings' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className=''>
              {myActions?.includes('Create') && (
                <AppTooltip placement={'top'} title={'Add Roster Setting'}>
                  <img
                    src='/assets/images/title-icon/add roster setting.svg'
                    className='title-icons-mui'
                    onClick={(e) => {
                      setrosterId('NEW');
                    }}
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
        title='Bank Detail'
        columns={tableTemplate.columns}
        data={rosterList}
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
      {rosterId ? (
        <Dialog
          onClose={() => {
            setrosterId('');
          }}
          open={true}
          maxWidth='false'
          style={{borderRadius: '4rem'}}
        >
          <DialogTitle style={{background: '#f5f2f2'}}>
            <h1>Roster Setting</h1>
            <CloseIcon
              onClick={() => {
                setrosterId('');
              }}
              style={{
                top: '14px',
                cursor: 'pointer',
                position: 'absolute',
                right: '12px',
              }}
            />
          </DialogTitle>
          <DialogContent>
            <CreateRosterSetting
              rosterId={rosterId}
              setrosterId={setrosterId}
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export default List;
