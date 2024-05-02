import React, {useEffect, useState} from 'react';
import orange from '@mui/material/colors/orange';
import {useAuthMethod, useAuthUser} from '../../../../utility/AuthHooks';
import {Box} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Fonts} from 'shared/constants/AppEnums';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Button} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Api from '@api';
import axios from 'axios';

const UserInfo = (props) => {
  const {color} = props;
  const {logout} = useAuthMethod();
  const {user} = useAuthUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [profileImg, setprofileImg] = React.useState('');
  const [showSwitch, setShowSwitch] = React.useState(false);

  function getRoleName() {
    let te = '';
    user?.userList?.userRoles?.map((el) => {
      if (el.userRole == user?.userList?.userRole) te = el.userRoleName;
    });
    return te;
  }
  useEffect(() => {
    if (user?.userList?.userRoleName == 'EMPLOYEE') {
      axios
        .get(`${Api.employee.list}/${user?.userList?.profileId}`)
        .then((re) => {
          setprofileImg(re?.data?.data?.photo);
        })
        .catch((err) => {});
    }
  }, [user?.userList?.userRoleName]);
  useEffect(() => {
    user?.userList?.userRoles?.map((el) => {
      if (el?.userRole == 'ROSTERADMIN' || el?.userRole == 'EMPLOYEE')
        setShowSwitch(true);
    });
  }, [user?.userList?.userRoles]);
  function switchRole(val) {
    localStorage.setItem('switched', val);
    window.location.href = '/';
  }
  // useEffect(()=>{

  //   let temrole = !checked ? "Manager" : "Employee";
  //
  //  localStorage.setItem("emplRole",temrole);
  //   if(temrole=="Manager"){
  //
  //     setManager('Manager')
  //   }
  //   if(temrole=="Employee"){
  //
  //     setEmployee("Employee")

  //   }
  // },[checked])

  const handleClick = (event) => {
    props.setCollapsedFun(false);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getUserAvatar = () => {
    if (user?.userList?.userName) {
      return (user?.userList?.contactName || user?.userList?.userName)
        ?.charAt(0)
        .toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  return (
    <>
      <Box
        sx={{
          py: 3,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        className='user-info-view'
      >
        <Box sx={{py: 0.5}}>
          {profileImg ? (
            <Avatar
              sx={{
                height: 40,
                width: 40,
                fontSize: 24,
                backgroundColor: orange[500],
              }}
              src={Api?.imgUrl + profileImg}
            />
          ) : (
            <Avatar
              sx={{
                height: 40,
                width: 40,
                fontSize: 24,
                backgroundColor: orange[500],
              }}
            >
              {getUserAvatar()}
            </Avatar>
          )}
        </Box>
        <Box
          sx={{
            width: {xs: 'calc(100% - 62px)', xl: 'calc(100% - 72px)'},
            ml: 4,
            color: color,
          }}
          className='user-info'
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                mb: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: 16,
                fontWeight: Fonts.MEDIUM,
                color: user?.userList?.theme?.fontColor || 'white',
              }}
              component='span'
            >
              {user?.userList?.userRole == 'CORPORATEADMIN'
                ? user?.userList?.contactName
                : user?.userList?.userName ?? 'Admin User '}
              {/* Please Check USER NAME HERE */}
            </Box>
            <Box
              sx={{
                ml: 3,
                color: user?.userList?.theme?.fontColor || 'white',
                display: 'flex',
              }}
            >
              <ExpandMoreIcon
                sx={{color: user?.userList?.theme?.fontColor || 'white'}}
                onClick={handleClick}
              />
            </Box>
          </Box>
          <Box
            sx={{
              mt: -0.5,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: user?.userList?.theme?.fontColor || 'white',
            }}
          >
            {user?.role == 'MANAGER'
              ? 'Manager'
              : user?.role == 'EMPLOYEE'
              ? 'Employee'
              : user?.role == 'TANENTADMIN'
              ? 'Super Admin'
              : user?.role == 'SUPERADMIN'
              ? 'TravelMate Admin'
              : user?.userList?.userRoleName == 'EMPLOYEE'
              ? getRoleName()
              : user?.role ?? 'N/A'}
          </Box>
        </Box>
      </Box>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {user?.userList?.userRole != 'SUPERADMIN' &&
        (user?.userList?.userRole == 'CORPORATEADMIN' ||
          user?.userList?.userRole == 'MANAGER' ||
          user?.userList?.userRole == 'DRIVER' ||
          user?.userList?.userRole == 'EMPLOYEE' ||
          user?.userList?.userRole == 'VENDOR' ||
          user?.userList?.userRole == 'TANENTADMIN') ? (
          <MenuItem
            onClick={() => {
              handleClose();
              if (user?.userList?.userStatus == 'DEFAULT') {
                navigate('/my-profile');
              } else {
                navigate('/my-profile-update-req');
              }
            }}
          >
            My account
          </MenuItem>
        ) : null}

        {showSwitch && user?.userList?.userRoleName == 'EMPLOYEE' ? (
          <>
            {user?.userList?.userRole != 'EMPLOYEE' ? (
              <MenuItem
                onClick={() => {
                  switchRole('EMPLOYEE');
                }}
              >
                Switch To Employee
              </MenuItem>
            ) : null}
            {user?.userList?.userRoles?.map((e) => {
              return (
                <>
                  {e.userRole != 'EMPLOYEE' &&
                  e.userRole !=
                    (user?.userList?.userRole == 'MANAGER'
                      ? 'ROSTERADMIN'
                      : user?.userList?.userRole) ? (
                    <MenuItem
                      onClick={() => {
                        switchRole(
                          e.userRole == 'ROSTERADMIN' ? 'MANAGER' : e.userRole,
                        );
                      }}
                    >
                      Switch To{' '}
                      {e.userRoleName == 'ROSTERADMIN'
                        ? 'Manager'
                        : e.userRoleName}
                    </MenuItem>
                  ) : null}
                </>
              );
            })}
          </>
        ) : null}
        {/* <MenuItem onClick={switchRole}>
          Switch To Travel Admin
        </MenuItem> */}

        <MenuItem onClick={handleOpenDialog}>Log Out</MenuItem>
      </Menu>

      <Dialog
        className='yourClassName'
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{
            fontSize: '16px',
            background: '#e0e1e4',
            marginTop: '-2px',
            marginLeft: '-5px',
            paddingBottom: '7px',
          }}
        >
          {'Confirm Logout'}
        </DialogTitle>
        <DialogContent style={{paddingTop: '14px', paddingBottom: '0px'}}>
          <DialogContentText
            id='alert-dialog-description'
            style={{display: 'flex'}}
          >
            <img
              src='/assets/images/logout_.png'
              style={{maxWidth: '45px', marginRight: '15px'}}
            />
            {/* <LogoutIcon style={{ fontSize: '46px', marginRight: '15px' }}/> */}
            <p style={{fontSize: '15px'}}>Are you sure, You want to Logout?</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{paddingRight: '15px', paddingBottom: '15px'}}>
          {/* <Button id='btnMui123' variant="contained" style={{float:"left"}} >Yes </Button> */}
          {/* <Button id='btnMui123' variant="contained" >No </Button> */}
          <Button
            id='btnMui123'
            style={{
              background: '#0e5d7f',
              color: 'white',
              borderRadius: '20px',
              height: '30px',
            }}
            onClick={
              logout
              // () => {
              //   if (user?.userList?.profileId) {
              //     axios
              //       .post(
              //         Api.baseUri +
              //           `/userauth/logOut/${user?.userList?.profileId}`,
              //       )
              //       .then((res) => {
              //         if (res?.data?.status == '200') {
              //           logout();
              //         } else {
              //           toast.error('Something went wrong');
              //         }
              //       })
              //       .catch((err) => {
              //         console.log('err', err);
              //         toast.error('Something went wrong');
              //       });
              //   } else {
              //     logout();
              //   }
              // }
            }
          >
            {' '}
            Yes{' '}
          </Button>
          <Button
            id='btnMui123'
            style={{
              border: '1px solid #0e5d7f',
              color: '#0e5d7f',
              borderRadius: '20px',
              height: '30px',
            }}
            onClick={handleCloseDialog}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserInfo;

UserInfo.defaultProps = {
  color: 'text.secondary',
};

UserInfo.propTypes = {
  color: PropTypes.string,
  setCollapsedFun: PropTypes.func,
};
