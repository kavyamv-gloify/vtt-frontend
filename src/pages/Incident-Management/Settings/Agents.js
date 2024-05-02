import React, {useState, useEffect} from 'react';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import {Grid} from '@mui/material';
import {Box} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ModeIcon from '@mui/icons-material/Mode';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import AppLoader from '@crema/core/AppLoader';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Confirm from '@confirmation-box';
import Api from '@api';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {toast} from 'react-toastify';

const Agents = () => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [showbtn, setshowbtn] = useState(true);
  const [agentList, setAgentList] = useState();
  const [employeeId, setEmployeeId] = useState();
  const [employeeInfo, setEmployeeInfo] = useState();
  const [deactive, setDeactive] = useState(false);
  const [flag, setFlag] = useState();
  const [selectedItem, setSelectedItem] = useState({});
  function handleChange(event, newValue) {
    setValue(newValue);
  }
  const {user} = useAuthUser();
  const myDataByStatus = [
    {title: 'Unassigned', value: '12', color: 'red'},
    {title: 'On Hold', value: '12', color: 'blue'},
    {title: 'Opened', value: '12', color: '#ADD8E6'},
    {title: 'Closed', value: '12', color: 'green'},
  ];
  useEffect(() => {
    getAll();
  }, []);

  function getAll() {
    let postData = {
      page: '0',
      size: '100',
      role: 'AGENT',
      corporateId: user?.userList?.corporateId,
      roleCode: 'EMPLOYEE',
    };
    console.log('postdtaa', postData);
    axios
      .post(Api.baseUri + '/userauth/user-account/getAllUserData', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          res?.data?.data?.body?.UserList?.map((el) => {
            el?.userRoles?.map((e) => {
              if (e?.userRoleName == 'AGENT') {
                el.userRole_agent = e?.userStatus;
                el.userRole_code = e?.userRole;
              }
            });
          });

          setAgentList(res?.data?.data?.body?.UserList ?? []);
        }
      })
      .catch((err) => {
        setAgentList([]);
      });
  }

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/employee-reg/' + employeeId)
      .then((res) => {
        if (res?.data?.status == '200') {
          setEmployeeInfo(res?.data?.data ?? {});
        }
      })
      .catch((err) => {
        setEmployeeInfo({});
      });
  }, [employeeId]);

  function deactivate(dd) {
    if (dd == 'YES') {
      let postData = {
        profileId: selectedItem?.profileId,
        roleCode: selectedItem?.userRole_code,
        userStatus: flag == 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
        roleName: 'AGENT',
      };
      console.log('postdtaa', postData);

      axios
        .post(
          Api.baseUri + '/userauth/user-account/deactive-user-role',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              flag == 'ACTIVE'
                ? 'Agent Activated successfully'
                : 'Agent Deactivated Successfully.',
            );
            setDeactive(false);
            getAll();
            setSelectedItem({});
          }
        })
        .catch((err) => {
          setDeactive(false);
          getAll();
          setSelectedItem({});
        });
    } else {
      setDeactive(false);
    }
  }
  function Card({values, index}) {
    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}
        >
          <div style={{display: 'flex', padding: '20px'}}>
            <div
              style={{
                width: '50px',
                height: '50px',
                // background: '#f1f1f1',
                borderRadius: '50%',
              }}
            ><img style={{
              width: '50px',
              height: '50px',
              background: '#f1f1f1',
              borderRadius: '50%',
            }} src={values?.profilePhoto || '/assets/images/title-icon/profile-change.svg'} alt='Agent image'/></div>
            <div
              style={{
                display: 'flex',
                marginLeft: '30px',
                flexDirection: 'column',
              }}
            >
              <h5 style={{fontWeight: '800'}}>{values?.userName}</h5>
              <h5 style={{fontSize: '12px'}}>{values?.emailId}</h5>

              {values?.userRoles?.map((el) => {
                return <h5 style={{fontSize: '12px'}}>{el?.userRoleName}</h5>;
              })}
            </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
         {/* {(value === 1 || value ===0) &&  <div>
              <AppTooltip title={'Edit'}>
                <ModeIcon
                  sx={{fontSize: '15px', color: '#656565', cursor: 'pointer'}}
                  onClick={() => {
                    setOpen(true);
                    setEmployeeId(values?.profileId);
                  }}
                />
              </AppTooltip>
            </div>} */}
            {value == 2 && (
              <div style={{marginLeft: '10px'}}>
                <AppTooltip title={'Reactivate'}>
                  <RotateLeftIcon
                    sx={{fontSize: '18px', color: '#656565', cursor: 'pointer'}}
                    onClick={() => {
                      setDeactive(true);
                      setSelectedItem(values);
                      setFlag('ACTIVE');
                    }}
                  />
                </AppTooltip>
              </div>
            )}
            {value == 1 && (
              <div style={{marginLeft: '10px'}}>
                <AppTooltip title={'Deactivate'}>
                  <NotInterestedIcon
                    sx={{fontSize: '15px', color: '#656565', cursor: 'pointer'}}
                    onClick={() => {
                      setDeactive(true);
                      setSelectedItem(values);
                      setFlag('DEACTIVE');
                    }}
                  />
                </AppTooltip>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Roster Setting',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Agent Information',
        fields: [
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'employeeFullName',
                id: 'employeeFullName',
                title: 'Name',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              //   {
              //     type: 'text',
              //     name: 'allowDailyChanges',
              //     id: 'allowDailyChanges',
              //     title: 'Last Name',
              //     // infoMessage: ["Radio button is selectable", "e.g.: yes"],
              //     validationProps: {
              //       required: 'This is a mandatory field',
              //     },
              //   },
              {
                type: 'text',
                name: 'employeeCode',
                id: 'employeeCode',
                title: 'Employee Code',
                disabled: true,
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],xs
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'emailId',
                id: 'emailId',
                title: 'Email Id',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'autocomplete',
                name: 'allowDailyChanges',
                id: 'allowDailyChanges',
                title: 'Status',
                options: [
                  {title: 'sos team', value: 'sos'},
                  {title: 'sos team', value: 'sos'},
                  {title: 'sos team', value: 'sos'},
                ],
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'mobileNo',
                id: 'mobileNo',
                title: 'Mobile Number',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },
        ],
      },

      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Role and Permission',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'radio',
                name: 'allowDailyChanges',
                id: 'allowDailyChanges',
                title: ' ',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                options: [
                  {title: 'Agent', value: 'agent'},
                  {title: 'Admin', value: 'admin'},
                  {title: 'Light Agent', value: 'light_agent'},
                  {title: 'Custom', value: 'custom'},
                ],
                // validationProps: {
                //   required: 'This is a mandatory field'
                // },
              },
              {
                type: 'section',
                layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
                fields: [
                  {
                    type: 'autocomplete',
                    name: 'allowDailyChanges',
                    id: 'allowDailyChanges',
                    title: 'Access',
                    // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                    options: [
                      {title: 'Yes', value: 'Yes'},
                      {title: 'No', value: 'No'},
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  function handleSubmit() {}
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6, padding: '30px 30px 0px 30px'}}>
        <Grid item xs={9}>
          <CustomLabel labelVal='Agents' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
      <Grid container sx={{padding: '0px 30px 0px 30px'}}>
        <Grid item xs={12}>
          <Box
            sx={{
              width: '100%',
              bgcolor: 'white',
              borderRadius: '20px 20px 0px 0px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              sx={{marginTop: '10px'}}
              TabIndicatorProps={{
                style: {background: '#03254c'},
              }}
            >
              <Tab label=' Agents' sx={{color: 'black'}} />
              <Tab label='Active Agents' sx={{color: 'black'}} />
              <Tab label='De-Active Agents' sx={{color: 'black'}} />
            </Tabs>
          </Box>
          <Grid container spacing={2} sx={{marginTop: '20px'}}>
            {agentList?.map((el, index) => {
              console.log('handleChange', value);
              if (value == 1 && el?.userRole_agent == 'INACTIVE') {
                return;
              }
              if (value == 2 && el?.userRole_agent == 'ACTIVE') {
                return;
              }
              return (
                <Grid
                  item
                  xs={12}
                  md={3.8}
                  sm={4}
                  sx={{
                    border: '1px solid #f1f1f1',
                    marginRight: '10px',
                    borderRadius: '10px',
                    padding: '20px',
                    marginBottom: '10px',
                  }}
                >
                  <Card values={el} index={index} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        style={{borderRadius: '4rem'}}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '800px',
          },
        }}
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
              <h1 style={{marginTop: '1.5rem'}}>Edit Agent</h1>
              <CloseIcon
                onClick={() => {
                  setOpen(false);
                  setEmployeeId('');
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              <>
                {!showbtn ? <AppLoader /> : null}
                {employeeInfo?.id ? (
                  <SmartForm
                    template={template}
                    defaultValues={employeeInfo}
                    onSubmit={handleSubmit}
                    buttons={['update']}
                  />
                ) : null}
              </>
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Confirm
        open={deactive}
        header={
          flag == 'ACTIVE'
            ? 'Confirm to  Activate Agent'
            : 'Confirm to  Deactivate Agent'
        }
        cnfMsg={
          flag == 'ACTIVE'
            ? 'Are you sure, You want to Activate the agent?'
            : 'Are you sure, You want to deactivate the agent?'
        }
        handleClose={deactivate}
        // reason={true}
      />
    </>
  );
};

export default Agents;
