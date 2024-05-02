import React, {useState, useEffect, useRef} from 'react';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import AppTooltip from '@crema/core/AppTooltip';
import Api from '@api';
import axios from 'axios';
import CustomLabel from 'pages/common/CustomLabel';
import CustomTheme from 'pages/onBordTenent/TenentTable/theme.js';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import {useNavigate} from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import EditForm from '../../pages/onBordTenent/EditPage';
import DetailPage from '../../pages/onBordTenent/DetailPage';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import CreateForm from '../../pages/onBordTenent/CreateForm';
import Confirm from '@confirmation-box';
import FilterPop from '@filter-pop';
import _ from 'lodash';
import QuickSearchPage from '@quick-search';
import {toast} from 'react-toastify';
import RestoreIcon from '@mui/icons-material/Restore';
import {Box, Button, Grid} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
const CustomerPage = () => {
  const [list, setList] = useState();
  const [isHover, setIsHover] = useState(false);
  const [index, setIndex] = useState();
  const [menuIndex, setMenuIndex] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const [openNavigation, setOpenNavigation] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [dialID, setdialID] = useState();
  const [openform, setOpenForm] = useState(false);
  const [pendingCount, setPendingCount] = useState();
  const [openDial, setOpenDial] = useState(false);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [openReactiveConfirmbox, setOpenReactiveConfirmbox] = useState(false);
  const [filterShow, setfilterShow] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filter, setFilter] = useState({});
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

  const ref = useRef(null);
  useOutsideAlerter(ref);
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setTimeout(() => {
            setOpenNavigation(false);
          }, 100);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }
  const closeReactiveConfirmBox = (d) => {
    if (d == 'YES') {
      axios
        .post(Api.baseUri + `/user-reg/tenant-reg/reActivatetanent/${dialID}`)
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

  const getFilterData = () => {
    let url_ = Api.baseUri + '/api/dashboard/employee/filter';
    let post_ = {
      collection: 'TanentReg',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'TanentReg',
      pageNo: 1,
      pageSize: 1000,
    };
    axios
      .post(url_, !filter || _.isEmpty(filter) ? def_post : post_)
      .then((re_) => {
        console.log('re', re_);
        let temp=[]
        re_?.data?.data?.map((el)=>{
         let postData={}
         postData=el;
         postData.id=el?._id;
         temp.push(postData);
        })
        setFilterRes(temp ?? []);
      })
      .catch((err) => {
        setFilterRes([]);
      });
  };

  useEffect(() => {
    getFilterData();
  }, [filter]);
  function getAllList() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/tenant-reg?page=0&size=1000&mobileNo=null&emailId=null&companyPAN=null&companyGSTN=null',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let sortedProducts = res?.data?.data?.body['Tanent List'].sort(
            (p1, p2) =>
              p1?.status > p2?.status ? 1 : p1?.status < p2?.status ? -1 : 0,
          );
          // setList(res?.data?.data?.body['Tanent List'] ?? []);
          setList(sortedProducts ?? []);
        }
      })
      .catch((err) => {});
  }

  useEffect(() => {
    if (openDial) return;
    getAllList();
  }, [openDial]);

  function popBTNClick(val) {
    getAllList();
    if (!val) {
      setopenDialog(false);
    }
  }
  function handleMouseEnter(ind) {
    if (index == ind) {
      setIsHover(true);
    }
  }

  function handleMouseLeave() {
    setIsHover(false);
  }

  function handleMenuBar(ind) {
    setMenuIndex(ind);
    setOpenNavigation(!openNavigation);
  }
  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?.id);
  }
  function handleClickView(rowData) {
    setdialID(rowData?.id);
    setOpenDetail(true);
  }
  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      axios
        .post(`${Api.onBoardTenant.list}/deactivatetanent/${dialID}`)
        .then((response) => {
          if (response?.data?.status == '200') {
            getAllList();
            setOpenConfirmBox(false);
            window.location.reload();
            // navigate(`/superadmin/table`);
          }
        })
        .catch((err) => {});
    }
    if (dd == 'NO') {
      setOpenConfirmBox(false);
    }
  };
  const handleClosefilter = (d) => {
    setOpenFilter(false);
    setfilterShow(false);
    setFilter(d.data);
    // if (d == "NO") {
    //   setOpenFilter(false);
    // }
    getAllList();
  };

  function handleImpersonate(el) {
    let postData = {
      authToken: localStorage.getItem('token'),
      userRole: 'SUPERADMIN',
      corporateId: '',
      tanentId: el?.id,
      tanentName: el?.companyName,
      tenentCode: el?.companyCode,
      isImpersonate: 'TANENT',
    };
    axios
      .post(Api.baseUri + '/userauth/switchUserRoleTest1', postData)
      .then((resp) => {
        if (resp?.status == '200') {
          localStorage.setItem('token', resp?.data?.data?.authToken);
          window.location.href = `/dashboard`;
        }
      })
      .catch((err) => {});
  }

  let templateFilter = {
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
            type: 'text',
            name: 'gstNumber',
            title: 'Company GST Number',
            inputiconurl: '/assets/images/login_icon.png',
            field: 'gstNumber',
          },

          {
            type: 'text',
            name: 'pannumber',
            title: 'Company PAN Number',
            inputiconurl: '/assets/images/login_icon.png',
            field: 'pannumber',
          },
          {
            type: 'text',
            name: 'emailId',
            title: 'Email Id',
            inputiconurl: '/assets/images/login_icon.png',
            field: 'emailId',
          },
          {
            type: 'text',
            name: 'mobileNo',
            title: 'Mobile No.',
            field: 'mobileNo',
            inputiconurl: '/assets/images/login_icon.png',
          },
        ],
      },
    ],
  };
  return (
    <>
      {openDialog && dialID && (
        <EditForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item md={4}>
          <CustomLabel labelVal='Customers' variantVal='h3-underline' />
        </Grid>

        <Grid item xs={12} sm={3} md={4}>
          <QuickSearchPage
            masterKey='accountName'
            module={'TanentReg'}
            searchClicked={true}
            // searchUrl={'/employee-reg/filter'}
            masterFields={['accountName', 'mobileNo']}
            displayFields={['accountName', 'mobileNo']}
            filterRes={filterRes}
            setFilterRes={setFilterRes}
            // getFilterData={getAllList}
          />
        </Grid>

        <Grid item md={4}>
          {/* <Grid container> */}
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add Filter'}>
                <FilterAltOutlinedIcon
                  className='title-icons-mui'
                  // style={{color: _.isEmpty(filter) ? '' : '#ff9800'}}
                  onClick={() => {
                    setfilterShow(true);
                    setOpenFilter(true);
                  }}
                />
              </AppTooltip>
              <AppTooltip placement={'top'} title={'Add New Super Admin'}>
                <img
                  src='/assets/images/title-icon/add-driver.svg'
                  className='title-icons-mui'
                  onClick={(e) => setOpenForm(true)}
                />
              </AppTooltip>
              <AppTooltip placement={'top'} title={'Profile Update Request'}>
                <div style={{display: 'flex'}}>
                  <img
                    src='/assets/images/title-icon/profile-change.svg'
                    className='title-icons-mui'
                    onClick={(e) => {
                      navigate('/onbordTenent/pending-list');
                    }}
                  />
                  <p className='pending-count'>{pendingCount}</p>
                </div>
              </AppTooltip>
            </div>
          </Box>
          {/* </Grid> */}
        </Grid>
      </Grid>

      <Grid
        container
        spacing={6}
        style={{background: 'white', marginTop: '10px'}}
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
              // onClick={() => { setIndex(ind) }}
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
                    sx={{display: 'flex', justifyContent: 'end'}}
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
                                <AppTooltip title={'App Theme'}>
                                  <SettingsIcon
                                    color='primary'
                                    sx={{
                                      opacity:
                                        el?.status == 'INACTIVE' ? '0.3' : '',
                                      fontSize: '18px',
                                    }}
                                    onClick={() => {
                                      if (el?.status == 'INACTIVE') {
                                        return;
                                      }
                                      setOpenDial(el);
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
                                    style={{
                                      opacity:
                                        el?.status == 'INACTIVE' ? '0.3' : '',
                                      fontSize: '18px',
                                    }}
                                    color='primary'
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
                  spacing={3}
                  onClick={() => {
                    navigate(
                      `/customer-page/corporatapage/${el?.id}/${window.btoa(
                        el.companyLogoDoc,
                      )}`,
                    );
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
                        src={Api.imgUrl + el?.companyLogoDoc}
                        style={{
                          height: '80px',
                          aspectRatio: '1 / 1',
                          border: '1px solid grey',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          // border: '1px solid black',
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item md={9} sm={12} sx={{paddingLeft: '10px'}}>
                    <div>
                      <h4
                        style={{
                          fontSize: '21px',
                          color: '#212121',
                        }}
                      >
                        {el?.companyName}
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
                            {moment(el?.createdOn)?.format('DD-MM-YYYY')}
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
                            title={
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
                            }
                            placement={'bottom'}
                          >
                            <div>
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
                              )?.slice(0, 90)}
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
                    width: 'calc(100% - 30px)',
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
                    <AppTooltip placement={'bottom'} title={el?.emailId}>
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
                        <img
                          src='/assets/images/Message.svg'
                          style={{
                            width: '20px',
                            height: '20px',
                            marginRight: '5px',
                          }}
                        />
                        <div
                          style={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {el?.emailId}
                        </div>
                      </Grid>
                    </AppTooltip>
                    <AppTooltip placement={'bottom'} title={el?.mobileNo}>
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
                          src='/assets/images/call.svg'
                          style={{
                            width: '15px',
                            height: '15px',
                            marginRight: '5px',
                          }}
                        />
                        <div
                          style={
                            {
                              // overflow: 'hidden',
                              // whiteSpace: 'nowrap',
                              // textOverflow: 'ellipsis',
                            }
                          }
                        >
                          {el?.mobileNo}
                        </div>
                      </Grid>
                    </AppTooltip>

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

      <Dialog
        // onClose={CloseDetailPage}
        open={openDetail}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '80%',
          },
        }}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>SuperAdmin Details</h1>
          <CloseIcon
            onClick={() => {
              setOpenDetail(false);
            }}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              top: '14px',
              right: '14px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>
        <DialogContent>
          <DetailPage
            id={dialID}
            close={() => {
              setOpenDetail(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Super Admin?'}
        handleClose={closeConfirmBox}
      />

      <FilterPop
        open={openFilter}
        handleClose={handleClosefilter}
        title={'SuperAdmin Filter'}
        template={templateFilter}
        cnfMsg={'cnfMsg'}
        header={'My Header'}
      />

      <Dialog
        // onClose={handleClose}
        open={openform}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '90%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>Register SuperAdmin</h1>
          <CloseIcon
            onClick={() => {
              setOpenForm(false);
            }}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              top: '14px',
              right: '14px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>
        <DialogContent>
          <div style={{padding: '1rem', marginTop: '20px'}}>
            <CreateForm
              close={() => {
                setOpenForm(false);
                getAllList();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {openDial && (
        <CustomTheme
          setOpenDial={setOpenDial}
          id={openDial?.id}
          themeData={openDial?.theme}
        />
      )}
      <Confirm
        open={openReactiveConfirmbox}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to Reactivate the Super Admin?'}
        handleClose={closeReactiveConfirmBox}
      />
    </>
  );
};

export default CustomerPage;
