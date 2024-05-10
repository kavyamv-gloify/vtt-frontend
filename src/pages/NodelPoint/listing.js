import React, {useEffect, useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import {useAuthUser} from '@crema/utility/AuthHooks';
import List from './Table';
import Api from '@api';
import axios from 'axios';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateForm from './createOfcRoute';
import EditIcon from '@mui/icons-material/Edit';
import CustomLabel from 'pages/common/CustomLabel';
import {toast} from 'react-toastify';
import Grid from '@mui/material/Grid';
import AppTooltip from '@crema/core/AppTooltip';
import ExcelContainer from '@excelupload';
import Confirm from '@confirmation-box';
import {BsCloudHaze1} from 'react-icons/bs';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import QuickSearchPage from '@quick-search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import _ from 'lodash';
import EditNodalPoints from './Edit';


const fieldList = [
  {title: 'Route Name', value: 'routeShortName'},
  {title: 'Route Details', value: 'routeName'},
  {title: 'Status', value: 'status'},
];

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
const Topics = () => {
  const {user} = useAuthUser();
  const [clickedParent, setClickedParent] = useState();
  const [myData, setMyData] = useState();
  const [openDialog, setopenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const [delId, setDelId] = useState('');
  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [searchClicked, setsearchClicked] = useState(false);
  const [sortType, setSortType] = useState({createdOn: 'asc'});
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);

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
    // console.log(sortedUsers, '::::');
  }
  useEffect(() => {
    getFilterData();
  }, [filter]);
  const getFilterData = () => {
    let url_ = Api.baseUri + '/api/dashboard/employee/filter';
    let post_ = {
      collection: 'OfficeRoute',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'OfficeRoute',
      pageNo: 1,
      pageSize: 1000,
    };
    console.log("url_ - " + url_);
    axios
      .post(url_, !filter || _.isEmpty(filter) ? def_post : post_)
      .then((re_) => {
        setFilterRes(re_?.data?.data);
      })
      .catch((err) => {
        setFilterRes([]);
      });
  };
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };
  useEffect(() => {
    sortData(filterRes);
  }, [filterRes]);
  const navigate = useNavigate();
  const [myActions, setMyActions] = useState([]);
  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Nodal Point') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);

  const closeConfirmBoxReactivate = (dd, reason) => {
    setOpenConfirmBoxReactivate(false);
    setDelId(null);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/office-route/routeReActive/${delId?._id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(`${res?.data?.data?.routeShortName} reactivated`);
            // toast.success('Office Route reactivated successfully');
            getFilterData();
          }
        });
    }
  };

  const closeConfirmBox = (dd, reason) => {
    console.log('delId', delId);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/office-route/routeDeActive/${delId?._id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            console.log('respose', response);
            getFilterData();
            toast.success(
              `${response?.data?.data?.routeShortName} deactivated`,
            );
            // toast.success('Office Route deactivated successfully');
            setOpenConfirmBox(false);
          }
        })
        .catch((err) => {});
    } else {
      setOpenConfirmBox(false);
    }
  };

  function popBTNClick(val) {
    getFilterData();
    if (!val) {
      setopenDialog(false);
    }
  }
  function popEditBTNClick(val) {
    getFilterData();
    if (!val) {
      setOpenEditDialog(false);
    }
  }





  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={4} md={4} sm={3}>
          <CustomLabel labelVal='NodalPoints' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={4} md={4} sm={3}>
          <QuickSearchPage
            masterKey='routeShortName'
            module={'OfficeRoute'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            // masterFields={['empCode', 'emailId', 'firstName']}
            // displayFields={['_id', 'vendorName']}
            filterRes={filterRes}
            displayFields={['routeShortName']}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={8} md={4} sm={3}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              {/* <AppTooltip placement={'top'} title={'Search Nodal Point'}>
                <SearchOutlinedIcon
                  onClick={() => {
                    setsearchClicked(!searchClicked);
                  }}
                  sx={{ml: 2, mr: 4}}
                  className='pointer'
                />
              </AppTooltip> */}
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
                    setfilterShow(false);
                    setFilter({});
                    handleClosefilter({button: 'clear'});
                  }}
                  className='title-icons-mui'
                />
              </AppTooltip>
              {myActions?.includes('Create') && (
                <AppTooltip placement={'top'} title={'Create New Office Route'}>
                  <img
                    src='/assets/images/title-icon/create new nodal point.svg'
                    className='title-icons-mui'
                    onClick={() => {
                      setopenDialog(true);
                      setdialID('create');
                    }}
                  />
                </AppTooltip>
              )}
            </div>
            {myActions?.includes('Download And Upload') && (
              <ExcelContainer
                downloadFile={'NodalPoint'}
                downloadURL={'/user-reg/nodal-point/download'}
                getHeadersUrl={'/user-reg/nodal-point/headerdata'}
                downloadTempURL={'/user-reg/nodal-point/download-template'}
                uploadURL={'/user-reg/nodal-point/import-excel'}
              />
            )}
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
            style={{
              width: '25%',
              fontWeight: 600,
              pointerEvents: 'initial',
              display: 'flex',
              alignItems: 'center',
            }}
            className='sort-icon-view'
            onClick={(event) => {
              event.stopPropagation();
              setSortType({
                routeShortName:
                  sortType?.routeShortName == 'desc' ? 'asc' : 'desc',
              });
            }}
          >
            {' '}
            Route Name{' '}
            {sortType?.routeShortName == 'desc' && (
              <ArrowUpwardIcon className='child' sx={{ml: 2}} />
            )}
            {sortType?.routeShortName == 'asc' && (
              <ArrowDownwardIcon sx={{ml: 2}} className='child' />
            )}
          </Typography>
          <Typography
            style={{
              width: '30%',
              fontWeight: 600,
              pointerEvents: 'initial',
              display: 'flex',
              alignItems: 'center',
            }}
            className='sort-icon-view'
            onClick={(event) => {
              event.stopPropagation();
              setSortType({
                routeName: sortType?.routeName == 'desc' ? 'asc' : 'desc',
              });
            }}
          >
            {' '}
            Route Details{' '}
            {sortType?.routeName == 'desc' && (
              <ArrowUpwardIcon className='child' sx={{ml: 2}} />
            )}
            {sortType?.routeName == 'asc' && (
              <ArrowDownwardIcon sx={{ml: 2}} className='child' />
            )}
          </Typography>
          <Typography
            style={{
              width: '10%',
              fontWeight: 600,
              pointerEvents: 'initial',
              display: 'flex',
              alignItems: 'center',
            }}
            className='sort-icon-view'
            onClick={(event) => {
              event.stopPropagation();
              setSortType({
                createdOn: sortType?.createdOn == 'desc' ? 'asc' : 'desc',
              });
            }}
          >
            {' '}
            Created On{' '}
            {sortType?.createdOn == 'desc' && (
              <ArrowUpwardIcon className='child' sx={{ml: 2}} />
            )}
            {sortType?.createdOn == 'asc' && (
              <ArrowDownwardIcon sx={{ml: 2}} className='child' />
            )}
          </Typography>
          <Typography
            style={{
              width: '15%',
              fontWeight: 600,
              justifyContent: 'center',
              pointerEvents: 'initial',
              display: 'flex',
              alignItems: 'center',
            }}
            className='sort-icon-view'
            onClick={(event) => {
              event.stopPropagation();
              setSortType({
                status: sortType?.status == 'desc' ? 'asc' : 'desc',
              });
            }}
          >
            {' '}
            Status{' '}
            {sortType?.status == 'desc' && (
              <ArrowUpwardIcon className='child' sx={{ml: 2}} />
            )}
            {sortType?.status == 'asc' && (
              <ArrowDownwardIcon sx={{ml: 2}} className='child' />
            )}
          </Typography>
          <Typography
            style={{width: '25%', textAlign: 'center', fontWeight: 600}}
          >
            {' '}
            Action{' '}
          </Typography>
        </AccordionSummary>
      </Accordion>
      {myData?.map((el) => {
        return (
          <Accordion style={{padding: '10px'}}>
            <AccordionSummary
              onClick={() => {
                setClickedParent(el?._id);
              }}
              className='mb-2'
              expandIcon={<CustomExpandIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography style={{width: '25%'}}>
                {' '}
                {el?.routeShortName}{' '}
              </Typography>
              <Typography style={{width: '30%'}}> {el?.routeName} </Typography>
              <Typography style={{width: '10%'}}>
                {' '}
                {moment(el?.createdOn).format('DD/MM/YYYY')}{' '}
              </Typography>
              <Typography
                style={{
                  width: '15%',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  pointerEvents: 'initial',
                  color: el?.status == 'ACTIVE' ? 'green' : 'red',
                }}
              >
                {' '}
                {el?.status}{' '}
              </Typography>

              <Typography
                style={{width: '20%', textAlign: 'center', color: '#0000EE'}}
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
                      setOpenEditDialog(true);
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
                      setDelId(el);
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
                      setDelId(el);
                      setOpenConfirmBoxReactivate(true);
                    }}
                  >
                    Reactivate
                  </u>
                )}
              </Typography>
              {/* {myActions?.includes('Deactivate') ? (
                <Typography
                  style={{
                    width: '15%',
                    textAlign: 'center',
                    color: '#0000EE',
                    opacity: el.status == 'INACTIVE' ? '0.3' : '',
                  }}
                  onClick={(eve) => {
                    eve.stopPropagation();
                  }}
                >
                  {' '}
                  <u
                    onClick={() => {
                      if (el.status == 'ACTIVE') setDelId(el?._id);
                    }}
                  >
                    Deactivate
                  </u>{' '}
                </Typography>
              ) : (
                <Typography
                  style={{width: '15%', textAlign: 'center', color: '#0000EE'}}
                ></Typography>
              )} */}
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{border: '1px solid #efefef', borderRadius: '8px'}}
              >
                <List
                  myActions={myActions}
                  nodalList={el?.nodalList ?? []}
                  officeId={el?.officeId}
                  routeId={el?._id}
                  ReloadParent={getFilterData}
                />
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {openDialog && dialID == 'create' ? (
        <Dialog
          open={openDialog}
          onClose={() => {
            setopenDialog(false);
            setdialID('');
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title' style={{background: '#f5f2f2'}}>
            <h1>Office Route</h1>
            <div style={{position: 'absolute', top: '12px', right: '15px'}}>
              <span>
                <CloseIcon
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setopenDialog(false);
                    setOpenEditDialog(false);
                    setdialID('');
                  }}
                />
              </span>
            </div>
          </DialogTitle>
          <DialogContent>
            <CreateForm id='create' popBTNClick={popEditBTNClick} />
          </DialogContent>
        </Dialog>
      ) : null}
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the office Route?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the office Route?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />

      {openEditDialog && delId && (
        <EditNodalPoints
          openEditDialog={openEditDialog}
          id={delId}
          popBTNClick={popBTNClick}
          setOpenEditDialog={setOpenEditDialog}
        />
      )}

      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Nodal Point Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
      {/* {openDialog && dialID != 'create' && <CreateForm openDialog={openDialog} id={dialID} popBTNClick={popBTNClick} />} */}
    </div>
  );
};
export default Topics;
