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
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import {useAuthUser} from '@crema/utility/AuthHooks';
import DesignationTable from '../ManageDesignation/DesignationTable';
import Api from '@api';
import axios from 'axios';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import CustomLabel from 'pages/common/CustomLabel';
import {toast} from 'react-toastify';
import BusinessUnit from './BussinessUnit';
import Confirm from '@confirmation-box';
import EditBusinessUnitForm from './Edit';
import Grid from '@mui/material/Grid';
import AppTooltip from '@crema/core/AppTooltip';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import QuickSearchPage from '@quick-search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';

const fieldList = [
  {title: 'Name', value: 'name'},
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
const BussinessUnitList = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [myActions, setMyActions] = useState([]);
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
  const [delId, setDelId] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [searchClicked, setsearchClicked] = useState(false);

  // useEffect(() => {
  //   getFilterData();
  // }, []);
  // function popBTNClick(val) {
  //     if (!val) { setopenDialog(false) }
  // }

  // function getFilterData() {
  //   let url = `${Api.businessUnit.list}`;
  //   axios
  //     .get(url)
  //     .then((res) => {
  //       if (res?.data?.status == '200') {
  //         setMyData(res?.data?.data ?? []);
  //       }
  //       if (res?.data?.status == '500') {
  //         setMyData([]);
  //       }
  //     })
  //     .catch((err) => {
  //       setMyData([]);
  //     });
  // }

  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      axios
        .delete(`${Api.businessUnit.deletebU}/${delId}`)
        .then((response) => {
          if (response?.data?.status == '200') {
            setOpenConfirmBox(false);
            getFilterData();
            navigate(`/onbordTenent/BussinessUnit/table`);
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

  useEffect(() => {
    getFilterData();
  }, [filter]);
  const getFilterData = () => {
    let url_ = Api.baseUri + '/api/dashboard/employee/filter';
    let post_ = {
      collection: 'BusinessUnitDto',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'BusinessUnitDto',
      pageNo: 1,
      pageSize: 1000,
    };
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
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={4}>
          <CustomLabel labelVal='Business Unit' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={8}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <QuickSearchPage
                masterKey='_id'
                module={'BusinessUnitDto'}
                searchClicked={searchClicked}
                searchUrl={'/employee-reg/filter'}
                masterFields={['empCode', 'emailId', 'firstName']}
                filterRes={filterRes}
                getFilterData={getFilterData}
                setFilterRes={setFilterRes}
              />
              <AppTooltip placement={'top'} title={'Search Employee'}>
                <SearchOutlinedIcon
                  onClick={() => {
                    setsearchClicked(!searchClicked);
                  }}
                  sx={{ml: 2, mr: 4}}
                  className='pointer'
                />
              </AppTooltip>
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
          <Typography style={{width: '35%', fontWeight: 600}}>
            {' '}
            Name{' '}
          </Typography>

          <Typography style={{width: '20%', fontWeight: 600}}>
            {' '}
            Created On{' '}
          </Typography>
          <Typography style={{width: '20%', fontWeight: 600}}>
            {' '}
            Created by
          </Typography>

          <Typography
            style={{width: '15%', textAlign: 'center', fontWeight: 600}}
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
                    style={{marginRight: '10px'}}
                    onClick={() => {
                      setDelId(el?.id);
                      setopenDialog(true);
                    }}
                  >
                    Edit
                  </u>
                )}
                {myActions?.includes('Deactivate') && (
                  <u
                    onClick={() => {
                      setDelId(el?.id);
                      setOpenConfirmBox(true);
                    }}
                  >
                    Deactivate
                  </u>
                )}
              </Typography>
              {/* <Typography style={{ width: "15%", textAlign: "center", color: "#0000EE" }} onClick={(eve) => { eve.stopPropagation(); }}>  </Typography> */}
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{border: '1px solid #efefef', borderRadius: '8px'}}
              >
                <DesignationTable
                  myActions={myActions}
                  designation={el?.id ?? []}
                  designationList={el?.designationList ?? []}
                  reloadPage={getFilterData}
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
                  getFilterData();
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
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Business Unit?'}
        handleClose={closeConfirmBox}
      />
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
    </div>
  );
};
export default BussinessUnitList;
