import React, {useState} from 'react';
import SmartTable from '@smart-table';
import EditIcon from '@mui/icons-material/Edit';
import Api from '@api';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import {toast} from 'react-toastify';
import {te} from 'date-fns/locale';

const Listing = ({cid, role}) => {
  const tableRef = React.useRef();
  const [openAssign, setOpenAssign] = useState(false);
  const [roleVal, setRoleVal] = useState();
  const [selEmp, setselEmp] = useState();
  const [roleList, setRoleList] = useState([]);
  const [roleName, setRoleName] = useState([]);
  const [openUnAssign, setOpenUnAssign] = useState(false);
  const [roleNameVal, setRoleNameVal] = useState();
  const tableTemplate = {
    columns: [
      {
        title: 'Application Roles',
        field: 'appRole',
        render: (rowData) =>
          rowData?.userRoles.map((el, i) => {
            return rowData?.userRoles?.length > i + 1
              ? el.userRoleName + ', '
              : el.userRoleName;
          }),
        //   (rowData.appRole == 'ACTIVE') ? (<span style={{ color: "green" }}>ACTIVE</span>) : (rowData.status == 'INACTIVE') ? <span style={{ color: "red" }}>INACTIVE</span> : rowData.status
      },
      {
        title: 'User Name',
        field: 'userName',
      },
      {
        title: 'Mobile Number',
        field: 'mobileNo',
      },
      {
        title: 'Email Id',
        field: 'emailId',
      },
    ],
  };
  // https://devapi.etravelmate.com/user-reg/associatevendor/getallassociatecorporateId
  return (
    <div>
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
        title='Onboard Tenants List'
        columns={tableTemplate.columns}
        tableRef={tableRef}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url = `${Api.baseUri}/userauth/user-account/getAllUserData`,
              body = {
                page: query.page,
                size: query.pageSize,
                role: '',
                corporateId: cid,
                roleCode: 'EMPLOYEE',
              };
            axios
              .post(url, body)
              .then((result) => {
                resolve({
                  data: result?.data?.data?.body['UserList'] ?? [],
                  page: result?.data?.data?.body?.currentPage || 0,
                  totalCount: result?.data?.data?.body?.totalItems || 0,
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
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          {
            icon: () => <AssignmentTurnedInIcon color='primary' />,
            tooltip: 'edit',
            onClick: (event, rowData) => {
              setselEmp(rowData.profileId);
              axios
                .get(
                  Api.baseUri +
                    '/user-reg/user-role/getUserRoleByCorporateId/' +
                    cid,
                )
                .then((res) => {
                  let arr = [];
                  res?.data?.data?.map((el) => {
                    // console.log('el', el);
                    arr.push({
                      title: el.roleName,
                      value: el.id,
                      corporateIds: el?.corporateIds,
                      roleFor: el.roleFor,
                      roleCode: el.roleCode,
                    });
                  });
                  setRoleList(arr);
                })
                .catch((err) => {
                  setRoleList([]);
                });
              setOpenAssign(true);
            },
          },
          {
            icon: () => (
              <CancelIcon color='primary' style={{color: '#bc0805'}} />
            ),
            tooltip: 'Deactivate',
            onClick: (event, rowData) => {
              // console.log('rowData', rowData);
              setselEmp(rowData.profileId);
              let temp = [];
              rowData?.userRoles?.map((el) => {
                // console.log('el', el);
                if (
                  el?.userRoleName == 'ROSTERADMIN' ||
                  el?.userRoleName == 'EMPLOYEE'
                ) {
                  return;
                }
                temp.push({title: el?.userRoleName, value: el?.userRole});
              });
              // console.log('temp', temp);

              setRoleName(temp);
              setOpenUnAssign(true);
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

      {openAssign && (
        <Dialog
          onClose={() => {
            setRoleList([]);
            setOpenAssign(false);
            setselEmp(null);
            setRoleVal(null);
          }}
          open={true}
          style={{borderRadius: '4rem'}}
        >
          <DialogTitle sx={{background: '#f1f1f1'}}>
            <h2>Assign Role</h2>
            <CloseIcon
              onClick={() => {
                setRoleList([]);
                setOpenAssign(false);
                setselEmp(null);
                setRoleVal(null);
              }}
              style={{
                position: 'absolute',
                fontWeight: 'bold',
                top: '14px',
                right: '14px',
              }}
            />
          </DialogTitle>
          <DialogContent
            style={{padding: '30px 15px 30px 15px', width: '400px'}}
          >
            <Autocomplete
              id='tags-outlined'
              options={roleList || []}
              value={roleVal}
              onChange={(e, v, r) => {
                setRoleVal(v);
              }}
              getOptionLabel={(option) => option.title}
              sx={{width: '100%'}}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label={'Select Role'}
                  fullWidth
                />
              )}
            />
            <div
              style={{width: '100%', textAlign: 'center', marginTop: '20px'}}
            >
              <Button
                id='btnMui123'
                variant='contained'
                onClick={() => {
                  let postdata = {
                    profileId: selEmp,
                    roleCode: roleVal.roleCode,
                    roleName: roleVal.title,
                  };
                  axios
                    .post(
                      Api.baseUri + '/userauth/user-account/assign-user-role',
                      postdata,
                    )
                    .then((res) => {
                      if (res?.data?.status == 200) {
                        toast.success('Role assigned successfully.');
                        setRoleList([]);
                        setOpenAssign(false);
                        setselEmp(null);
                        setRoleVal(null);
                        setTimeout(() => {
                          tableRef.current && tableRef.current.onQueryChange();
                        }, 0);
                      } else {
                        toast.error(
                          res.data.message || 'Something went wrong.',
                        );
                      }
                    })
                    .catch((err) => {
                      toast.error('Something went wrong.');
                    });
                }}
              >
                Assign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {
        <Dialog
          onClose={() => {
            setRoleName([]);
            setOpenUnAssign(false);
          }}
          open={openUnAssign}
          style={{borderRadius: '4rem'}}
        >
          <DialogTitle sx={{background: '#f1f1f1'}}>
            <h2>Unassign Role</h2>
            <CloseIcon
              onClick={() => {
                setRoleName([]);
                setOpenUnAssign(false);
                // setselEmp(null);
                // setRoleVal(null);
              }}
              style={{
                position: 'absolute',
                fontWeight: 'bold',
                top: '14px',
                right: '14px',
              }}
            />
          </DialogTitle>
          <DialogContent
            style={{padding: '30px 15px 30px 15px', width: '400px'}}
          >
            <Autocomplete
              id='tags-outlined'
              options={roleName || []}
              value={roleNameVal}
              onChange={(e, v, r) => {
                setRoleNameVal(v);
              }}
              getOptionLabel={(option) => option.title}
              sx={{width: '100%'}}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label={'Select Role'}
                  fullWidth
                />
              )}
            />
            <div
              style={{width: '100%', textAlign: 'center', marginTop: '20px'}}
            >
              <Button
                id='btnMui123'
                variant='contained'
                onClick={() => {
                  let postdata = {
                    profileId: selEmp,
                    roleCode: roleNameVal.value,
                    roleName: roleNameVal.title,
                  };
                  // console.log('postData', postdata);

                  axios
                    .post(
                      Api.baseUri + '/userauth/user-account/unassign-user-role',
                      postdata,
                    )
                    .then((res) => {
                      if (res?.data?.status == 200) {
                        toast.success('Role unassigned successfully.');
                        setRoleName([]);
                        setOpenUnAssign(false);
                        setselEmp(null);
                        setRoleNameVal(null);
                        setTimeout(() => {
                          tableRef.current && tableRef.current.onQueryChange();
                        }, 0);
                      } else {
                        toast.error(
                          res.data.message || 'Something went wrong.',
                        );
                      }
                    })
                    .catch((err) => {
                      toast.error('Something went wrong.');
                    });
                }}
              >
                Unassign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    </div>
  );
};

export default Listing;
