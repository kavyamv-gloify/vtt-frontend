import React, {useState, useEffect, useRef} from 'react';
import {Grid, Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import AppTooltip from '@crema/core/AppTooltip';
import Api from '@api';
import axios from 'axios';
import CustomLabel from 'pages/common/CustomLabel';
import {useNavigate, useParams} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import EditForm from '../../pages/onboardCorporate/EditPage/index';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DetailForm from '../../pages/onboardCorporate/DetailPage/index';
import Confirm from '@confirmation-box';
import CorporateForm from '../../pages/onboardCorporate/CorporateForm/index';
import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import {toast} from 'react-toastify';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import QuickSearchPage from '@quick-search';
import SmartFilter from '@smart-filter';
import RestoreIcon from '@mui/icons-material/Restore';
const CorporatePage = () => {
  const [list, setList] = useState();
  const [isHover, setIsHover] = useState(false);
  const [index, setIndex] = useState();
  const {id, logo} = useParams();
  const [compLogo, setCompLogo] = useState('');
  const [openNavigation, setOpenNavigation] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const [openDetail, setOpenDetail] = useState(false);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [openform, setOpenForm] = useState(false);
  // const [index, setIndex] = useState();
  const [menuIndex, setMenuIndex] = useState();
  const [isEmailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailBody, setEmailBody] = useState({});
  const [isSMSDialogOpen, setSMSDialogOpen] = useState(false);
  const [smsBody, setSmsBody] = useState({});
  const [filterRes, setFilterRes] = useState();
  const [filter, setFilter] = useState();
  const [filterShow, setfilterShow] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [tenantInfo, setTenantInfo] = useState();
  const [openReactiveConfirmbox, setOpenReactiveConfirmbox] = useState(false);
  const fieldList = [
    {title: 'Company Name', value: 'companyName'},
    {title: 'Email Id', value: 'emailId'},
    {title: 'Mob No', value: 'mobileNo'},
    {title: 'Code', value: 'companyCode'},
    {title: 'PAN', value: 'companyPAN'},
  ];
  useEffect(() => {
    if (logo) setCompLogo(window.atob(logo));
  }, [logo]);
  const navigate = useNavigate();

  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    height: 'auto',
    // textAlign: 'center',
    color: theme.palette.text.secondary,
    // background: 'white',
    // backgroundColor: isHover ? '#f5f5f5' : 'white',
    borderRadius: '12px',
    boxShadow: '0px 0px 10px -2px rgba(0, 0, 0, 0.07)',
    border: '1px solid #ECECEC',
  }));

  useEffect(() => {
    getAllList();
  }, []);

  function getAllList() {
    axios
      .get(Api.baseUri + '/user-reg/corporate-reg/getCorporateByTanentId/' + id)
      .then((res) => {
        if (res?.data?.status == '200') {
          setList(res?.data?.data ?? []);
        }
      })
      .catch((err) => {});
  }
  function getTenantInfo() {
    axios
      .get(Api.baseUri + `/user-reg/tenant-reg/${id}`)
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res===', res?.data);
          setTenantInfo(res?.data?.data);
        } else {
          setTenantInfo({});
        }
      })
      .catch((err) => {
        console.log('Err', err);
      });
  }

  useEffect(() => {
    getTenantInfo();
  }, []);

  const getFilterData = () => {
    let url_ = Api.baseUri + '/api/dashboard/employee/filter';
    let post_ = {
      collection: 'CorporateReg',
      filterType: 'filter',
      filters: filter,
      tanentId: id,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'CorporateReg',
      pageNo: 1,
      pageSize: 1000,
      tanentId: id,
    };
    axios
      .post(url_, !filter || _.isEmpty(filter) ? def_post : post_)
      .then((re_) => {
        const list = [];
        re_?.data?.data?.map((el) => {
          el.id = el?._id;
          list.push(el);
        });

        let sortedProducts = list.sort((p1, p2) =>
          p1?.status > p2?.status ? 1 : p1?.status < p2?.status ? -1 : 0,
        );
        setFilterRes(sortedProducts);
      })
      .catch((err) => {
        setFilterRes([]);
      });
  };

  useEffect(() => {
    if (!id || !filter) {
      return;
    }
    getFilterData();
  }, [filter, id]);
  function handleMouseEnter(ind) {
    if (index == ind) {
      setIsHover(true);
    }
  }
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };
  function handleMouseLeave() {
    //
    setIsHover(false);
  }
  // function handleImpersonate() {
  //   window.location.href = `/customer-page/masterpage/corporate`;
  // }

  function handleMenuBar(ind) {
    setMenuIndex(ind);
    setOpenNavigation(!openNavigation);
  }

  const ref = useRef(null);
  useOutsideAlerter(ref);
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setTimeout(() => {
            setOpenNavigation(false);
          }, 100);
        }
      }
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?.id);
  }
  function popBTNClick(val) {
    getAllList();
    getFilterData();
    if (!val) {
      setopenDialog(false);
    }
  }
  function handleClickView(rowData) {
    setdialID(rowData?.id);
    setOpenDetail(true);
  }

  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      axios
        .post(`${Api.onBoardCorporate.list}/deactivatecorporate/${dialID}`)
        .then((response) => {
          if (response?.data?.status == '200') {
            setOpenConfirmBox(false);
            getAllList();
            toast.success('Corporate Deactivated successfully');
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        })
        .catch((err) => {});
    } else {
      setOpenConfirmBox(false);
    }
  };

  function handleImpersonate(el) {
    let postData = {
      authToken: localStorage.getItem('token'),
      userRole: 'CORPORATEADMIN',
      corporateId: el?.id,
      tanentId: el.tanentId,
      tanentName: el.tanentName,
      tenentCode: el.tanentCode,
      isImpersonate: 'CORPORATE',
    };
    axios
      .post(Api.baseUri + '/userauth/switchUserRoleTest1', postData)
      .then((resp) => {
        if (resp?.status == '200') {
          localStorage.setItem('token', resp?.data?.data?.authToken);
          if (compLogo)
            localStorage.setItem('COMPANY_LOGO', Api.imgUrl + compLogo);
          window.location.href = `/dashboard`;
        }
      })
      .catch((err) => {});
  }

  function handleNavigation(el) {
    let postData = {
      authToken: localStorage.getItem('token'),
      userRole: 'CORPORATEADMIN',
      corporateId: el?.id,
      tanentId: '',
      tanentName: '',
      tenentCode: '',
      isImpersonate: 'NO',
    };
    axios
      .post(Api.baseUri + '/userauth/switchUserRoleTest1', postData)
      .then((resp) => {
        if (resp?.status == '200') {
          localStorage.setItem('token', resp?.data?.data?.authToken);
          if (compLogo)
            localStorage.setItem('COMPANY_LOGO', Api.imgUrl + compLogo);
          window.location.href = `/customer-page/corporate/corporate-modules`;
        }
      })
      .catch((err) => {});
  }
  const handleSendMail = (e) => {
    if (e == 'YES') {
      const postData = [
        {
          emailid: emailBody?.emailid,
          name: emailBody?.name,
        },
      ];
      setEmailDialogOpen(false);
      axios
        .post(
          Api.baseUri +
            // '/usernotify/email/sendMailForProfileCreationForCorporate',
            '/user-reg/corporate-reg/sendMailForProfileCreationCorporate',
          postData,
        )
        .then((res) => {
          if (res?.status === 200) {
            toast.success('Email sent successfully.');
            setEmailBody({});
            getAllList();
          } else {
            toast.error('Failed to send request.');
            setEmailBody({});
          }
        })
        .catch(() => {
          toast.error('Error sending request.');
          setEmailBody({});
        });
    } else {
      setEmailDialogOpen(false);
      setEmailBody({});
    }
  };
  const closeReactiveConfirmBox = (d, reActivationRemark) => {
    if (d == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/corporate-reg/activateCorporate/${dialID}/${
              reActivationRemark?.length ? reActivationRemark : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Corporate Reactivated successfully');
            setOpenReactiveConfirmbox(false);
            window.location.reload();
          }
        });
    } else {
      setOpenReactiveConfirmbox(false);
    }
  };
  const handleSendSms = (e) => {
    if (e == 'YES') {
      const postData = [
        {
          mobileNo: smsBody?.mobileNo,
          name: smsBody?.name,
        },
      ];
      setSMSDialogOpen(false);
      axios
        .post(
          Api.baseUri +
            '/user-reg/corporate-reg/sendSmsForProfileCreationCorporate',
          postData,
        )
        .then((res) => {
          if (res?.status == 200) {
            toast.success('SMS sent successfully.');
            setSmsBody({});
            getAllList();
          } else {
            toast.error('Failed to send request.');
            setSmsBody({});
          }
        })
        .catch(() => {
          toast.error('Error sending request.');
          setSmsBody({});
        });
    } else {
      setSMSDialogOpen(false);
      setSmsBody({});
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={9} md={4}>
          <CustomLabel labelVal="Corporates' List" variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <QuickSearchPage
            masterKey='mobileNo'
            module={'CorporateReg'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            // masterFields={['emailId', 'firstName', 'lastName']}
            displayFields={['companyName', 'mobileNo']}
            getFilterData={getFilterData}
            role={'CORPORATE'}
            tenantId={id}
            filterRes={filterRes}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={3} md={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add Filter'}>
                <FilterAltOutlinedIcon
                  className='title-icons-mui'
                  style={{color: _.isEmpty(filter) ? '' : '#ff9800'}}
                  onClick={() => {
                    setfilterShow(true);
                    setOpenFilter(true);
                  }}
                />
              </AppTooltip>
              <AppTooltip placement={'top'} title={'Clear Filter'}>
                <img
                  src='/assets/images/clear-filter.png'
                  onClick={() => {
                    setFilterRes(null);
                    setfilterShow(false);
                    setFilter({});
                    handleClosefilter({button: 'clear'});
                  }}
                  className='title-icons-mui'
                />
              </AppTooltip>
              <AppTooltip placement={'top'} title={'Add New Corporate'}>
                <img
                  src='/assets/images/title-icon/add-site-office.svg'
                  className='title-icons-mui'
                  onClick={() => {
                    if (tenantInfo?.status == 'INACTIVE') {
                      return;
                    }
                    setdialID(id);
                    setOpenForm(true);
                  }}
                />
              </AppTooltip>
              <AppTooltip placement={'top'} title={'Profile Update Request'}>
                <div style={{display: 'flex'}}>
                  <img
                    src='/assets/images/title-icon/profile-change.svg'
                    className='title-icons-mui'
                    onClick={(e) => {
                      if (tenantInfo?.status == 'INACTIVE') {
                        return;
                      }
                      navigate('/onbordCorporate/pending-list/' + id);
                    }}
                  />
                  {/* <p className='pending-count'>{pendingCount}</p> */}
                </div>
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>
      {openDialog && dialID && (
        <EditForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}

      <Grid
        container
        spacing={6}
        style={{background: 'white', padding: '20px'}}
      >
        {filterRes?.map((el, ind) => {
          return (
            <Grid
              item
              md={4}
              sm={6}
              xs={12}
              onMouseEnter={() => {
                setIndex(ind);
                handleMouseEnter(ind);
              }}
              onMouseLeave={handleMouseLeave}
              style={{
                height: 'auto',

                position: 'relative',
              }}
            >
              <Item
                sx={{
                  height: '100%',
                  paddingBottom: '55px',
                  paddingTop: '10px',
                  paddingRight: '10px',
                  borderLeft:
                    el?.status == 'ACTIVE'
                      ? '6px solid green'
                      : '6px solid red',
                  backgroundColor:
                    index == ind && isHover ? '#f5f5f5' : 'white',
                }}
              >
                <Grid container>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sm={12}
                    sx={{
                      display: 'flex',
                      justifyContent: 'end',
                    }}
                  >
                    <IconButton
                      sx={{
                        height: 30,
                        width: 30,
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                        // flexDirection: 'column',
                      }}
                      aria-label='more'
                      aria-controls='long-menu'
                      aria-haspopup='true'
                    >
                      <MoreVertIcon
                        onClick={() => {
                          handleMenuBar(ind);
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          marginTop: '200px',
                          zIndex: '1',
                        }}
                      >
                        {menuIndex == ind && openNavigation && (
                          <Paper>
                            <MenuList ref={ref}>
                              <MenuItem>
                                <AppTooltip title={'Edit'}>
                                  <EditIcon
                                    color='primary'
                                    style={{
                                      opacity:
                                        el?.status == 'INACTIVE' ? '0.3' : '',
                                      fontSize: '18px',
                                    }}
                                    onClick={() => {
                                      if (el?.status == 'INACTIVE') {
                                        return;
                                      }

                                      setOpenNavigation(false);
                                      handleClickEdit(el);
                                    }}
                                  />
                                </AppTooltip>
                              </MenuItem>
                              <MenuItem>
                                <AppTooltip title={'View'}>
                                  <VisibilityIcon
                                    color='primary'
                                    sx={{fontSize: '18px'}}
                                    onClick={() => {
                                      setOpenNavigation(false);
                                      handleClickView(el);
                                    }}
                                  />
                                </AppTooltip>
                              </MenuItem>
                              <MenuItem>
                                <AppTooltip title={'Roles & Permissions'}>
                                  <SettingsIcon
                                    color='primary'
                                    sx={{
                                      fontSize: '18px',
                                      opacity:
                                        el?.status == 'INACTIVE' ? '0.3' : '',
                                      fontSize: '18px',
                                    }}
                                    onClick={() => {
                                      if (el?.status == 'INACTIVE') {
                                        return;
                                      }
                                      navigate(`/role/permissions/${el?.id}`);
                                    }}
                                  />
                                </AppTooltip>
                              </MenuItem>
                              <MenuItem>
                                <AppTooltip title={'Delete'}>
                                  <DeleteIcon
                                    color='primary'
                                    style={{
                                      color: '#bc0805',
                                      opacity:
                                        el?.status == 'INACTIVE' ? '0.3' : '',
                                      fontSize: '18px',
                                    }}
                                    onClick={() => {
                                      if (el?.status == 'INACTIVE') {
                                        return;
                                      }
                                      setOpenNavigation(false);
                                      setdialID(el?.id);
                                      setOpenConfirmBox(true);
                                    }}
                                  />
                                </AppTooltip>
                              </MenuItem>
                              <MenuItem>
                                <AppTooltip title={'Restore'}>
                                  <RestoreIcon
                                    color='primary'
                                    style={{
                                      opacity:
                                        el?.status == 'ACTIVE' ? '0.3' : '',
                                      fontSize: '18px',
                                    }}
                                    onClick={() => {
                                      if (el?.status == 'ACTIVE') {
                                        return;
                                      }
                                      setOpenNavigation(false);
                                      setdialID(el?.id);
                                      setOpenReactiveConfirmbox(true);
                                    }}
                                  />
                                </AppTooltip>
                              </MenuItem>
                              <MenuItem>
                                <AppTooltip title={'Impersonate'}>
                                  <LabelImportantIcon
                                    color='primary'
                                    style={{
                                      opacity:
                                        el?.status == 'INACTIVE' ? '0.3' : '',
                                      fontSize: '18px',
                                    }}
                                    onClick={() => {
                                      if (el?.status == 'INACTIVE') {
                                        return;
                                      }
                                      handleImpersonate(el);
                                    }}
                                  />
                                </AppTooltip>
                              </MenuItem>
                            </MenuList>
                          </Paper>
                        )}
                      </div>
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid
                  container
                  className='cursor'
                  spacing={1}
                  onClick={() => {
                    console.log('222', el);
                    if (el?.status == 'INACTIVE') {
                      toast.error('Corporate is deactive');
                    } else {
                      handleNavigation(el);
                    }
                  }}
                >
                  <Grid
                    item
                    md={3}
                    sm={12}
                    style={{
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <img
                        src={Api.imgUrl + compLogo}
                        style={{
                          // height: '200px',
                          height: '80px',
                          aspectRatio: '1 / 1',
                          border: '1px solid grey',
                          borderRadius: '50%',
                          // border: '1px solid black',
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item md={9} sm={12}>
                    <div>
                      <h4
                        style={{
                          fontSize: '21px',
                          color: '#212121',
                        }}
                      >
                        {el?.siteOfficeDto?.officeName}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '5px',
                        }}
                      >
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <img
                            src='/assets/images/companyId 3.svg'
                            style={{
                              width: '17px',
                              marginTop: '4px',
                              height: '21px',
                            }}
                          />
                          <h5
                            style={{
                              fontSize: '11px',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              marginLeft: '5px',
                            }}
                          >
                            {el?.companyCode}
                          </h5>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '15px',
                          }}
                        >
                          <img
                            src='/assets/images/CalenderVector.svg'
                            style={{
                              width: '13px',
                              height: '13px',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                          />
                          <h5 style={{fontSize: '11px', marginLeft: '5px'}}>
                            {/* 10-07-2023 */}
                            {moment(el?.updatedOn)?.format('DD-MM-YYYY')}
                          </h5>
                        </div>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <img
                          src='/assets/images/MapVector.svg'
                          style={{
                            width: '17px',
                            height: '21px',
                            marginTop: '3px',
                          }}
                        />
                        <h5
                          style={{
                            color: 'black',
                            fontSize: '11px',
                            marginLeft: '6px',
                            marginTop: '3px',
                            overflowWrap: 'anywhere',
                          }}
                        >
                          <AppTooltip
                            title={el?.siteOfficeDto?.location?.locName}
                            // title={
                            //   el?.companyAddress?.addressName?.split(
                            //     '++',
                            //   )?.[0] +
                            //   ',' +
                            //   el?.companyAddress?.addressName?.split(
                            //     '++',
                            //   )?.[1] +
                            //   ',' +
                            //   el?.companyAddress?.city +
                            //   ',' +
                            //   el?.companyAddress?.state +
                            //   ',' +
                            //   el?.companyAddress?.pinCode
                            // }
                            placement={'bottom'}
                          >
                            <div>
                              {el?.siteOfficeDto?.location?.locName}
                              {/* {(
                                el?.companyAddress?.addressName?.split(
                                  '++',
                                )?.[0] +
                                ',' +
                                el?.companyAddress?.addressName?.split(
                                  '++',
                                )?.[1] +
                                ',' +
                                el?.companyAddress?.city +
                                ',' +
                                el?.companyAddress?.state +
                                ',' +
                                el?.companyAddress?.pinCode
                              )?.slice(0, 90)} */}
                              {(
                                el?.companyAddress?.addressName?.split(
                                  '++',
                                )?.[0] +
                                ',' +
                                el?.companyAddress?.addressName?.split(
                                  '++',
                                )?.[1] +
                                ',' +
                                el?.companyAddress?.city +
                                ',' +
                                el?.companyAddress?.state +
                                ',' +
                                el?.companyAddress?.pinCode
                              )?.length > 90
                                ? '...'
                                : ''}
                            </div>
                          </AppTooltip>
                        </h5>
                      </div>
                    </div>
                  </Grid>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{
                    background: '#F8F8F8',
                    borderRadius: '0px 0px 12px 12px',
                    width: 'calc(100% - 31px)',
                    padding: '15px',
                    position: 'absolute',
                    bottom: '0',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '10px',
                  }}
                >
                  <Grid container>
                    <Grid
                      item
                      md={3}
                      sm={4}
                      xs={4}
                      className='cursor'
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <AppTooltip
                        className='cursor'
                        placement={'bottom'}
                        title={'Send Email'}
                      >
                        {/* <img
                          src='/assets/images/Message.svg'
                          style={{
                            width: '20px',
                            height: '20px',
                            marginRight: '5px',
                          }}
                        /> */}
                        <EmailIcon
                          onClick={() => {
                            if (el?.status == 'INACTIVE') {
                              return;
                            }
                            setEmailDialogOpen(true);
                            setEmailBody({
                              emailid: el?.emailId,
                              name: el?.companyName,
                            });
                          }}
                          style={{
                            width: '20px',
                            height: '20px',
                            marginRight: '5px',
                            color: el?.emailStatus == 'SENT' ? 'green' : null,
                          }}
                        />
                      </AppTooltip>
                      <AppTooltip placement={'bottom'} title={el?.emailId}>
                        <div
                          style={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {el?.emailId}
                        </div>
                      </AppTooltip>
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={4}
                      xs={4}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {/* <img
                        src='/assets/images/call.svg'
                        style={{
                          width: '15px',
                          height: '15px',
                          marginRight: '5px',
                        }}

                      /> */}
                      <AppTooltip placement={'bottom'} title={'Send SMS'}>
                        <MessageIcon
                          className='cursor'
                          onClick={() => {
                            if (el?.status == 'INACTIVE') {
                              return;
                            }
                            setSMSDialogOpen(true);
                            setSmsBody({
                              mobileNo: el?.mobileNo,
                              name: el?.companyName,
                            });
                          }}
                          style={{
                            width: '20px',
                            height: '20px',
                            marginRight: '5px',
                            color: el?.emailStatus == 'SENT' ? '#0E86D4' : null,
                          }}
                        />
                      </AppTooltip>
                      <div
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {el?.mobileNo}
                      </div>
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={4}
                      xs={4}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src='/assets/images/companyBuilding.svg'
                        style={{
                          width: '14px',
                          height: '13px',
                          marginRight: '5px',
                          marginTop: '-3px',
                        }}
                      />
                      <div
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {el?.companyAddress?.city}
                      </div>
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={4}
                      xs={4}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    ></Grid>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
          );
        })}
      </Grid>

      {/* <Dialog
        // onClose={handleClose}
        open={openform}
        maxWidth='false'
        PaperProps={{
          sx: {width: '90%'},
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>Corporate Onboarding Form</h1>
          <CloseIcon
            onClick={handleClose}
            style={{
              position: 'absolute',
              right: '12px',
              top: '12px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '2rem'}}>
            <CorporateForm close={handleCloseForm} />
          </div>
        </DialogContent>
      </Dialog> */}
      <Dialog
        // onClose={closeDetailPage}
        open={openDetail}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '80%',
          },
        }}
        style={{borderRadius: '4rem'}}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
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
                width: '80%',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Corporate Details</h1>
              <CloseIcon
                onClick={() => {
                  setOpenDetail(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '1rem', marginTop: '2.5rem'}}>
              <DetailForm id={dialID} />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Corporate Admin?'}
        handleClose={closeConfirmBox}
      />
      <Confirm
        open={openReactiveConfirmbox}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to Reactivate the Corporate Admin?'}
        handleClose={closeReactiveConfirmBox}
        reason={true}
      />
      <Dialog
        // onClose={handleClose}
        open={openform}
        maxWidth='false'
        PaperProps={{
          sx: {width: '90%'},
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>Corporate Onboarding Form</h1>
          <CloseIcon
            onClick={() => {
              setOpenForm(false);
            }}
            style={{
              position: 'absolute',
              right: '12px',
              top: '12px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '2rem'}}>
            <CorporateForm
              tenantId={dialID}
              close={() => {
                setOpenForm(false);
                getAllList();
                getFilterData();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Confirm
        open={isEmailDialogOpen}
        header={'Send Email'}
        cnfMsg={'Are you sure, You want to send an email?'}
        handleClose={handleSendMail}
      />
      <Confirm
        open={isSMSDialogOpen}
        header={'Send SMS'}
        cnfMsg={'Are you sure, You want to send an SMS?'}
        handleClose={handleSendSms}
      />
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Corporate Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
    </>
  );
};

export default CorporatePage;
