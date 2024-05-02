import axios from 'axios';
import React, {useEffect} from 'react';
import {useState} from 'react';
import Api from '@api';
import AppTooltip from '@crema/core/AppTooltip';
import CustomLabel from 'pages/common/CustomLabel';
import SmartForm from '@smart-form';
import regex from '@regex';
import CloseIcon from '@mui/icons-material/Close';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useAuthUser} from '@crema/utility/AuthHooks';
import AllUserList from './allList';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import _ from 'lodash';
import {toast} from 'react-toastify';
const UserList = () => {
  const {user} = useAuthUser();
  const [openDial, setopenDial] = useState(false);
  const [openAddDial, setopenAddDial] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [userRolesDp, setUserRolesDp] = useState([]);
  const [success, setSuccess] = useState(true);
  const [formData, setFormData] = useState({});
  const [roleForAdmin, setRoleForAdmin] = useState([]);

  useEffect(() => {
    if (!user?.userList?.profileId) return;
    axios
      .get(
        Api.baseUri +
          '/user-reg/user-role/getUserRoleByCorporateId/' +
          user?.userList?.profileId,
      )
      .then((res) => {
        let arr = [];
        let arr2 = [];
        res?.data?.data?.map((el) => {
          arr.push({
            title: el.roleName,
            value: el.roleCode,
            roleFor: el.roleFor,
          });
          if (el.roleFor !== 'CORPORATEADMIN')
            arr2.push({
              title: el.roleName,
              value: el.roleCode,
              roleFor: el.roleFor,
            });
        });
        setRoleForAdmin(arr2);
        setUserRolesDp(arr || []);
      })
      .catch((err) => {
        setUserRolesDp([]);
      });
  }, [user?.userList?.profileId]);
  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'empId',
                id: 'empId',
                title: 'Employee Email Id',
                //   pattern: {
                //     value: regex.emailReg,
                //     message: 'Please enter valid Employee Email Id'
                //   },
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'button',
                name: 'verify',
                buttonFor: 'empId',
                id: 'verify ',
                title: 'Verify ',
                defaultValue: 'verify',
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'userName',
                field: 'userName',
                disabled: true,
                title: 'User Name',
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'mobileNo',
                field: 'mobileNo',
                disabled: true,
                title: 'Mobile Number',
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'applicationRole',
                field: 'applicationRole',
                title: 'Application Role',
                defaultValue: selectedRole?.title,
                disabled: true,
              },
            ],
          },
        ],
      },
    ],
  };
  let addTemplate = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'contactPersonFirstName',
                id: 'contactPersonFirstName',
                title: 'Contact Person First Name',
                pattern: {
                  value: regex.max50,
                  message: 'Please enter valid name with max 50 char.',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'contactPersonLastName',
                id: 'contactPersonLastName',
                title: 'Contact Person First Name',
                pattern: {
                  value: regex.max50,
                  message: 'Please enter valid name with max 50 char.',
                },
              },
              {
                type: 'text',
                name: 'emailId',
                id: 'emailId',
                title: 'Email Id',
                pattern: {
                  value: regex.emailReg,
                  message: 'Please enter valid email id',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'roleFor',
                id: 'roleFor',
                title: 'Role For',
                defaultValue: 'Corporate Admin',
                disabled: true,
              },
              {
                type: 'select',
                name: 'appRole',
                id: 'appRole',
                title: 'Application Role',
                options: roleForAdmin || [],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },
        ],
      },
    ],
  };
  //   tableRef.current && tableRef.current.onQueryChange()
  useEffect(() => {
    axios.get(
      Api.baseUri + '/userauth/user-account/getAllUserData?page=0&size=10',
    );
  }, []);
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={9}>
          <CustomLabel labelVal="User's List" variantVal='h3-underline' />
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add New User'}>
                <img
                  src='/assets/images/title-icon/add employee.svg'
                  className='title-icons-mui'
                  onClick={(e) => {
                    setopenAddDial(true);
                  }}
                />
              </AppTooltip>
              {/* <AppTooltip placement={'top'}
                                title={'Assign Role'}>
                                <img src='/assets/images/emp_setting.jpeg' className='title-icons-mui' onClick={(e) => { setopenDial(true); }} />
                            </AppTooltip> */}
            </div>
          </Box>
        </Grid>
      </Grid>
      <Accordion
        expanded={false}
        className='accordion-headings'
        sx={{background: '#f1f1f1'}}
      >
        <AccordionSummary
          style={{margin: 0}}
          expandIcon={<ExpandMoreIcon sx={{opacity: 0}} />}
          aria-controls='d-content'
          id={'d-header-top'}
        >
          <Typography className='permissions-acc-head'>
            Application Role
          </Typography>
          <Typography className='permissions-acc-head'>Role For</Typography>
          <Typography
            className='permissions-acc-head'
            style={{justifyContent: 'end'}}
          >
            <div
              style={{
                width: '120px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              Action
            </div>
          </Typography>
        </AccordionSummary>
      </Accordion>
      {userRolesDp?.map((row, _ind) => {
        return (
          row.value &&
          row.roleFor && (
            <Accordion
              expanded={expanded.includes(_ind)}
              onChange={() => {
                let array = expanded;
                if (!array?.includes(_ind)) array.push(_ind);
                else array.splice(array?.indexOf(_ind), 1);
                setExpanded([...array]);
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='d-content'
                id={'d-header' + _ind}
              >
                <Typography
                  style={{fontWeight: 400, fontSize: '14px'}}
                  className='permissions-acc-head'
                >
                  {row.title}
                </Typography>
                <Typography
                  style={{fontWeight: 400, fontSize: '14px'}}
                  className='permissions-acc-head'
                >
                  {row.roleFor == 'EMPLOYEE'
                    ? 'Employee'
                    : row.roleFor == 'VENDOR'
                    ? 'Vendor'
                    : row.roleFor == 'CORPORATEADMIN'
                    ? 'Corporate Admin'
                    : ''}
                </Typography>
                <Typography
                  style={{
                    fontWeight: 400,
                    fontSize: '14px',
                    justifyContent: 'end',
                  }}
                  className='permissions-acc-head'
                >
                  <div
                    style={{
                      width: '120px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <AppTooltip placement={'top'} title={'Assign Role'}>
                      <AssignmentIndIcon
                        color='primary'
                        sx={{mr: 4}}
                        onClick={(e) => {
                          setExpanded([]);
                          setSelectedRole({...row});
                          setopenDial(true);
                          e.stopPropagation();
                        }}
                      />
                    </AppTooltip>
                  </div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {expanded.includes(_ind) && <AllUserList appRole={row.value} />}
              </AccordionDetails>
            </Accordion>
          )
        );
      })}
      {openDial && !_.isEmpty(selectedRole) && (
        <Dialog
          open={openDial}
          onClose={() => {
            setopenDial(false);
            setSelectedRole({});
          }}
          style={{borderRadius: '4rem'}}
          PaperProps={{sx: {width: '500px'}}}
        >
          <DialogTitle
            style={{
              background: '#f5f2f2',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h1>Assign Roles</h1>
            <CloseIcon
              onClick={() => {
                setopenDial(false);
                setSelectedRole({});
              }}
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
            />
          </DialogTitle>
          <DialogContent style={{padding: '20px', paddingTop: '0px'}}>
            <div>
              <SmartForm
                template={template}
                onSubmit={(d) => {
                  setSuccess(false);
                  let postData = {
                    profileId: formData.id,
                    roleCode: selectedRole.value,
                    roleName: selectedRole.title,
                  };
                  axios
                    .post(
                      Api.baseUri + '/userauth/user-account/assign-user-role',
                      postData,
                    )
                    .then((res) => {
                      if (res?.data?.status == 200) {
                        toast.success('Assigned successfully.');
                        setopenDial(false);
                        setSelectedRole({});
                        setSuccess(true);
                      } else {
                        toast.error(
                          res?.data?.message || 'Something went wrong.',
                        );
                      }
                    })
                    .catch((err) => {
                      toast.error('Something went wrong.');
                    });
                }}
                buttons={['assign']}
                success={success}
                clearErr={[
                  {
                    name: 'empId',
                    value: formData?.userName && formData?.userName != 'NA',
                  },
                ]}
                seterrors={[
                  {
                    name: 'empId',
                    type: 'customized',
                    message: 'Please enter valid user details.',
                    error: formData?.userName == 'NA',
                  },
                ]}
                onChange={(e) => {}}
                setVal={[
                  {name: 'mobileNo', value: formData?.mobileNo},
                  {name: 'userName', value: formData?.userName},
                ]}
                SecretFun={(e, t) => {
                  let employee = {
                    key: t?.empId,
                  };
                  axios
                    .post(
                      Api?.baseUri +
                        '/userauth/user-account/getUserByMobileNoOrEmailId',
                      employee,
                    )
                    .then((r) => {
                      setFormData({
                        ...{
                          mobileNo: r?.data?.data?.mobileNo || 'NA',
                          userName: r?.data?.data?.userName || 'NA',
                          id: r?.data?.data?.profileId,
                        },
                      });
                    })
                    .catch((er) => {
                      setFormData({userName: 'NA', mobileNo: 'NA', id: null});
                    });
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      {openAddDial && (
        <Dialog
          open={openAddDial}
          onClose={() => {
            setopenAddDial(false);
          }}
          style={{borderRadius: '4rem'}}
          PaperProps={{sx: {width: '500px'}}}
        >
          <DialogTitle
            style={{
              background: '#f5f2f2',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h1>Add User</h1>
            <CloseIcon
              onClick={() => {
                setopenAddDial(false);
              }}
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
            />
          </DialogTitle>
          <DialogContent style={{padding: '20px', paddingTop: '0px'}}>
            <div>
              <SmartForm
                template={addTemplate}
                onSubmit={(d) => {}}
                buttons={['submit']}
                success={success}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserList;
