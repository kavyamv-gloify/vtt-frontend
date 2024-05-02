import React, {useEffect, useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Dialog,
  DialogContent,
  Typography,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import {useAuthUser} from '@crema/utility/AuthHooks';
import DesignationTable from '../ManageDesignation/DesignationTable';
import Api from '@api';
import axios from 'axios';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import CustomLabel from 'pages/common/CustomLabel';
import BusinessUnit from './BussinessUnit';
import Confirm from '@confirmation-box';
import EditBusinessUnitForm from './Edit';
import Grid from '@mui/material/Grid';
import AppTooltip from '@crema/core/AppTooltip';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import _ from 'lodash';
import {toast} from 'react-toastify';
import QuickSearchPage from '@quick-search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
const CustomExpandIcon = ({opacity}) => {
  return (
    <Box
      sx={{
        opacity: opacity ?? 'none',
        '.Mui-expanded & > .collapsIconWrapper': {display: 'none'},
        '.expandIconWrapper': {display: 'none'},
        '.Mui-expanded & > .expandIconWrapper': {display: 'block'},
      }}
    >
      <div className='expandIconWrapper'>
        <IndeterminateCheckBoxOutlinedIcon style={{color: '#407999'}} />
      </div>
      <div className='collapsIconWrapper'>
        <AddBoxOutlinedIcon style={{color: '#407999'}} />
      </div>
    </Box>
  );
};
const BussinessUnitList = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [myActions, setMyActions] = useState([]);
  const [sortType, setSortType] = useState({createdOn: 'asc'});
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Business Unit') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);

  const [clickedParent, setClickedParent] = useState();
  const [myData, setMyData] = useState();
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const [delId, setDelId] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [filter, setFilter] = useState();
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);
  const [filterShow, setfilterShow] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const [filterRes, setFilterRes] = useState();
  const fieldList = [
    {title: 'Bussiness Unit Name', value: 'name'},
    {title: 'Status', value: 'status'},
    {title: 'Designation', value: 'designationList'},
  ];
  useEffect(() => {
    getFilterData();
  }, [filter]);
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };
  const getFilterData = () => {
    let url_ = Api.baseUri + '/api/dashboard/employee/filter';
    let post_ = {
      collection: 'BusineesUnitDto',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'BusineesUnitDto',
      pageNo: 1,
      pageSize: 1000,
    };
    axios
      .post(url_, !filter || _.isEmpty(filter) ? def_post : post_)
      .then((re_) => {
        console.log('re', re_);
        re_?.data?.data?.map((el) => {
          el.id = el?._id;
        });

        setFilterRes(re_?.data?.data);
      })
      .catch((err) => {
        setFilterRes([]);
      });
  };
  useEffect(() => {
    getFilterData();
  }, []);

  useEffect(() => {
    sortData(myData);
  }, [sortType]);
  function sortData(dd) {
    let ssArr = '';
    Object.keys(sortType)?.map((el) => {
      ssArr = el;
    });
    const sortedUsers = _.orderBy(
      dd,
      [(user) => user[ssArr]],
      [sortType[ssArr]],
    );
    setMyData([...sortedUsers]);
    setFilterRes([...sortedUsers]);
  }


  function getBusinessUnitList() {
    let url = `${Api.businessUnit.list}`;
    axios
      .get(url)
      .then((res) => {
        if (res?.data?.status == '200') {
          sortData(res?.data?.data);
          setMyData(res?.data?.data ?? []);
        }
        if (res?.data?.status == '500') {
          setMyData([]);
        }
      })
      .catch((err) => {
        setMyData([]);
      });
  }

  const closeConfirmBox = (dd, reason) => {
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/bussiness-unit/deActivateBU/${delId}/${
              reason?.length ? reason : null
            }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(`${response?.data?.data?.name} deactivated `);
            // toast.success('Bussiness Unit deactivated successfully');
            setOpenConfirmBox(false);
            getFilterData();
            setdialID(null);

            window.location.reload();
          }
        })
        .catch((err) => {});
    } else {
      setOpenConfirmBox(false);
    }
  };

  function closeConfirmBoxReactivate(dd, reason) {
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/bussiness-unit/reActivateBU/${delId}/${
              reason?.length ? reason : null
            }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(`${response?.data?.data?.name} reactivated `);
            // toast.success('Bussiness Unit re-activated successfully');
            setOpenConfirmBoxReactivate(false);
            getFilterData();
            setdialID(null);

            window.location.reload();
          }
        })
        .catch((err) => {});
    } else {
      setOpenConfirmBoxReactivate(false);
    }
  }
  function popBTNClick(val) {
    getFilterData();
    if (!val) {
      setopenDialog(false);
    }
  }
  const [designationId, setDesignationId] = useState('');
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8} md={4}>
          <CustomLabel labelVal='Business Units' variantVal='h3-underline' />
        </Grid>
        <Grid md={4}>
          <QuickSearchPage
            masterKey='name'
            module={'BusineesUnitDto'}
            getFilterData={getFilterData}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            masterFields={['name', 'designationName']}
            displayFields={['name']}
            // masterFields={['empCode', 'emailId', 'firstName']}
            filterRes={filterRes}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={4} md={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div>
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
            </div>
            <div className=''>
              {myActions?.includes('Create') && (
                <AppTooltip placement={'top'} title={'Add New Business Unit'}>
                  <img
                    src='/assets/images/title-icon/add-business-unit.svg'
                    className='title-icons-mui'
                    onClick={() => {
                      setOpenForm(true);
                    }}
                  />
                </AppTooltip>
              )}
            </div>
          </Box>
        </Grid>
      </Grid>

      <Accordion
        style={{padding: '10px', pointerEvents: 'none', background: '#f1f1f1'}}
      >
        <AccordionSummary
          className='mb-2'
          expandIcon={<CustomExpandIcon opacity={0} />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography
            className='sort-icon-view'
            style={{
              width: '35%',
              pointerEvents: 'initial',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={(event) => {
              event.stopPropagation();
              // setSortType({name: sortType?.name == 'desc' ? 'asc' : 'desc'});
            }}
          >
            {' '}
            Name{' '}
            {sortType?.name == 'desc' && (
              <ArrowUpwardIcon className='child' sx={{ml: 2}} />
            )}
            {sortType?.name == 'asc' && (
              <ArrowDownwardIcon sx={{ml: 2}} className='child' />
            )}
          </Typography>

          <Typography
            onClick={(event) => {
              event.stopPropagation();
              // setSortType({
              //   createdOn: sortType?.createdOn == 'desc' ? 'asc' : 'desc',
              // });
            }}
            style={{
              width: '20%',
              fontWeight: 600,
              pointerEvents: 'initial',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {' '}
            Created On{' '}
            {/* {sortType?.createdOn == 'desc' && (
              <ArrowUpwardIcon className='child' sx={{ml: 2}} />
            )} */}
            {/* {sortType?.createdOn == 'asc' && (
              <ArrowDownwardIcon sx={{ml: 2}} className='child' />
            )} */}
          </Typography>
          <Typography
            onClick={(event) => {
              event.stopPropagation();
              // setSortType({
              //   createdBy: sortType?.createdBy == 'desc' ? 'asc' : 'desc',
              // });
            }}
            style={{
              width: '20%',
              fontWeight: 600,
              pointerEvents: 'initial',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {' '}
            Created by
            {sortType?.createdBy == 'desc' && (
              <ArrowUpwardIcon className='child' sx={{ml: 2}} />
            )}
            {sortType?.createdBy == 'asc' && (
              <ArrowDownwardIcon sx={{ml: 2}} className='child' />
            )}
          </Typography>

          <Typography
            style={{width: '15%', textAlign: 'center', fontWeight: 600}}
          >
            {' '}
            Action{' '}
          </Typography>
        </AccordionSummary>
      </Accordion>
      {filterRes?.map((el) => {
        return (
          <Accordion
            style={{padding: '10px'}}
            onClick={() => setDesignationId(el?.id)}
          >
            <AccordionSummary
              onClick={() => {
                setClickedParent(el?.id);
              }}
              className='mb-2'
              expandIcon={<CustomExpandIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography style={{width: '35%'}}> {el?.name} </Typography>
              <Typography style={{width: '20%'}}>
                {' '}
                {moment(el?.createdOn).format('DD/MM/YYYY')}{' '}
              </Typography>
              <Typography style={{width: '20%'}}> {el?.createdBy} </Typography>
              <Typography
                style={{width: '15%', textAlign: 'center', color: '#0000EE'}}
                onClick={(eve) => {
                  eve.stopPropagation();
                }}
              >
                {myActions?.includes('Edit') && (
                  <u
                    style={{
                      marginRight: '30px',
                      opacity: el?.status == 'INACTIVE' ? '0.3' : ' ',
                    }}
                    onClick={() => {
                      if (el?.status == 'INACTIVE') {
                        return;
                      }
                      setDelId(el?._id);
                      setopenDialog(true);
                    }}
                  >
                    Edit
                  </u>
                )}
                {myActions?.includes('Deactivate') && (
                  <u
                    style={{opacity: el?.status == 'INACTIVE' ? '0.3' : ''}}
                    onClick={() => {
                      if (el?.status == 'INACTIVE') {
                        return;
                      }
                      setDelId(el?._id);
                      setOpenConfirmBox(true);
                    }}
                  >
                    Deactivate
                  </u>
                )}
                {myActions?.includes('Edit') && (
                  <u
                    style={{
                      marginLeft: '30px',
                      opacity: el?.status == 'ACTIVE' ? '0.3' : '',
                    }}
                    onClick={() => {
                      if (el?.status == 'ACTIVE') {
                        return;
                      }
                      setDelId(el?._id);
                      setOpenConfirmBoxReactivate(true);
                    }}
                  >
                    Reactivate
                  </u>
                )}
              </Typography>
              {/* <Typography style={{ width: "15%", textAlign: "center", color: "#0000EE" }} onClick={(eve) => { eve.stopPropagation(); }}>  </Typography> */}
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{border: '1px solid #efefef', borderRadius: '8px'}}
              >
                {console.log('AccorkdianList', designationId)}
                <DesignationTable
                  myActions={myActions}
                  designation={designationId}
                  // designation={el?.id}
                  designationList={el?.designationList ?? []}
                  reloadPage={getFilterData}
                  getFilterData={getFilterData}
                />
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}

      <Dialog
        open={openForm}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '30%',
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
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Business Unit Form</h1>
              <CloseIcon
                onClick={() => {
                  setOpenForm(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              <BusinessUnit
                close={() => {
                  setOpenForm(false);
                  getBusinessUnitList();
                }}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      {delId && openDialog && (
        <EditBusinessUnitForm
          openDialog={openDialog}
          id={delId}
          popBTNClick={popBTNClick}
        />
      )}

      {/* {openDialog && dialID != 'create' && <CreateForm openDialog={openDialog} id={dialID} popBTNClick={popBTNClick} />} */}
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Business Unit Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Business Unit?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the Bussiness Unit?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
    </div>
  );
};
export default BussinessUnitList;
