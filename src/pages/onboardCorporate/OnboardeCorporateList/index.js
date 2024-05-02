import React, {useState, useEffect} from 'react';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SiteList from './table';
import {SecurityUpdateWarningRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {Autocomplete, Box, TextField} from '@mui/material';
import {makeStyles} from '@mui/styles';
import TablePagination from '@mui/material/TablePagination';
import Pagination from '@mui/material/Pagination';
import {Link} from 'react-router-dom';
import {Button, DialogTitle, Grid} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import {useAuthUser} from '@crema/utility/AuthHooks';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import CorporateForm from '../CorporateForm/index';
import DeleteIcon from '@mui/icons-material/Delete';
import ExcelContainer from '@excelupload';
import CustomLabel from 'pages/common/CustomLabel';
import EditForm from '../EditPage/index';
import Confirm from '@confirmation-box';
import AppTooltip from '@crema/core/AppTooltip';
import DetailForm from '../DetailPage/index';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
const List = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [dataid, setDataid] = useState(null);
  const [childdata, setChildData] = useState([]);
  const itemsPerPage = 10;
  const [page, setPage] = React.useState(1);
  const [totalCount, settotalCount] = React.useState(0);
  const [openform, setOpenForm] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState();
  const [openDetail, setOpenDetail] = useState();
  const [openAssign, setOpenAssign] = useState(false);
  const [id, setId] = useState();
  const [roleList, setRoleList] = useState([]);
  const {user} = useAuthUser();
  const [pendingCount, setPendingCount] = useState();

  const tanents = user?.userList?.tanentId;

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  const classes = useStyles();

  const handlethisChange = (event, value) => {
    setPage(value);
  };
  async function fetchDataChild() {
    const baseURL = `${api.siteOffice.list}?page=0&size=100`;
    let response = await axios.get(`${baseURL}`);

    setChildData(response.data.data?.body?.['SiteOffice List']);
  }
  async function fetchDataParent() {
    const baseURL = `${api.onBoardCorporate.list}/tanent?page=${
      page - 1
    }&size=${itemsPerPage}&mobileNo=null&emailId=null&companyCode=null&accountNumber=null`;
    let response = await axios.get(`${baseURL}`);

    settotalCount(response?.data?.data?.body?.totalItems ?? 0);
    setData(response?.data?.data?.body?.['Corporate List'] ?? []);
  }
  useEffect(() => {
    fetchDataChild();
    fetchDataParent();
  }, [page]);
  function popBTNClick(val) {
    // setTimeout(() => {
    //   tableRef.current && tableRef.current.onQueryChange()
    // }, 0);
    fetchDataParent();
    fetchDataChild();
    if (!val) {
      setopenDialog(false);
    }
  }

  const onBoardCorporateform = () => {
    setOpenForm(true);
  };
  const handleCloseForm = (status) => {
    setOpenForm(status);
    fetchDataParent();
    fetchDataChild();
  };
  const handleClose = () => {
    setOpenForm(false);
  };

  const handleConfirm = () => {
    setOpenConfirmBox(true);
  };

  const closeDetailPage = () => {
    setOpenDetail(false);
  };

  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      axios
        .post(`${api.onBoardCorporate.list}/deactivatecorporate/${id}`)
        .then((response) => {
          if (response?.data?.status == '200') {
            setOpenConfirmBox(false);
            fetchDataParent();
            fetchDataChild();
            navigate(`/onbordCorporate/list`);
          }
        })
        .catch((err) => {});
    } else {
      setOpenConfirmBox(false);
    }
  };

  useEffect(() => {
    let temp_url = `${
      api?.onBoardCorporate?.pendingCorp + user?.userList?.tanentId
    }/tanent/PENDING/status`;
    axios
      .get(temp_url)
      .then((res) => {
        if (res?.data?.status == '200') {
          setPendingCount(res?.data?.data?.length);
        }
      })
      .catch((err) => {});
  }, [user?.userList?.tanentId]);
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={9}>
          <CustomLabel labelVal="Corporates' List" variantVal='h3-underline' />
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add New Corporate'}>
                <img
                  src='/assets/images/title-icon/add-site-office.svg'
                  className='title-icons-mui'
                  onClick={onBoardCorporateform}
                />
              </AppTooltip>
              <AppTooltip placement={'top'} title={'Profile Update Request'}>
                <div style={{display: 'flex'}}>
                  <img
                    src='/assets/images/title-icon/profile-change.svg'
                    className='title-icons-mui'
                    onClick={(e) => {
                      navigate('/onbordCorporate/pending-list');
                    }}
                  />
                  <p className='pending-count'>{pendingCount}</p>
                </div>
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        {openDialog && dialID && (
          <EditForm
            openDialog={openDialog}
            id={dialID}
            popBTNClick={popBTNClick}
          />
        )}
        {/* <div>
          <CustomLabel labelVal="Corporate List" variantVal="h3-underline" />
        </div> */}
        {/* <div> 
          <ExcelContainer
            downloadFile={"Corporate Admin"}
            downloadURL={"/user-reg/corporate-reg/download"}
            getHeadersUrl={'/user-reg/corporate-reg/headerdata'}
            downloadTempURL={'/user-reg/corporate-reg/download-template'}
            uploadURL={"/user-reg/corporate-reg/import-excel"} />
        </div>  */}
      </div>
      {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", marginTop:"20px", marginBottom:"20px"}}>
        <div style={{ textAlign: 'right', paddingRight: "0px", backgroundColor: "" }}><Button variant="contained" style={{ margin: "8px" }} onClick={onBoardCorporateform}>Add Corporates</Button></div>
        <div style={{ textAlign: 'right', paddingRight: "0px", backgroundColor: "" }}><Button variant="contained" style={{ margin: "8px" }} onClick={(e) => { navigate('/onbordCorporate/pending-list') }}>Profile Update Request</Button></div>
      </div> */}

      <div>
        <AccordionSummary
          style={{
            padding: '10px',
            backgroundColor: 'white',
            border: 'solid 1px #dcdcdc',
            background: '#f1f1f1',
          }}
        >
          <Typography style={{width: '25%', fontWeight: 'bold'}}>
            Company Name
          </Typography>
          <Typography style={{width: '25%', fontWeight: 'bold'}}>
            Company Code
          </Typography>
          <Typography style={{width: '25%', fontWeight: 'bold'}}>
            Mobile No
          </Typography>
          <Typography style={{width: '25%', fontWeight: 'bold'}}>
            Email ID
          </Typography>
          <Typography style={{width: '25%', fontWeight: 'bold'}}>
            Company Address
          </Typography>
          <Typography
            style={{width: '25%', fontWeight: 'bold', paddingLeft: '2rem'}}
          >
            Actions
          </Typography>
        </AccordionSummary>

        {data?.length ? (
          data
            // ? data.slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((e) => {
              return (
                <Accordion style={{padding: '10px'}}>
                  <AccordionSummary
                    // style={{position :"relative"}}
                    className='mb-2'
                    expandIcon={
                      <>
                        <ExpandMoreIcon />
                      </>
                    }
                    onClick={() => {
                      setDataid(e.id);
                    }}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    <Typography style={{width: '25%'}}>
                      {e.companyName}
                    </Typography>
                    <Typography style={{width: '25%'}}>
                      {e.companyCode}
                    </Typography>
                    <Typography style={{width: '25%'}}>{e.mobileNo}</Typography>
                    <Typography style={{width: '25%'}}>{e.emailId}</Typography>
                    <Typography style={{width: '25%', paddingLeft: '2rem'}}>
                      {e.companyAddress.addressName}
                    </Typography>
                    <Typography style={{width: '25%', paddingLeft: '2rem'}}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginRight: '1rem',
                        }}
                      >
                        <AppTooltip placement={'top'} title={'Edit'}>
                          <EditIcon
                            color='primary'
                            onClick={(eve) => {
                              eve.stopPropagation();
                              setdialID(e.id);
                              setopenDialog(true);
                            }}
                          />
                        </AppTooltip>
                        <AppTooltip placement={'top'} title={'View'}>
                          <VisibilityIcon
                            color='primary'
                            onClick={(eve) => {
                              eve.stopPropagation();
                              setId(e.id);
                              setOpenDetail(true);
                            }}
                          />
                        </AppTooltip>
                        {/* <AppTooltip placement={'top'}
                      title={'Assign New Role'}>
                      <AssignmentTurnedInIcon color='primary' onClick={(eve) => { 
                        axios.get(api.baseUri + '/user-reg/user-role/getUserRoleByCorporateId/'+ e.id).then(res => {
                          let arr = [];
                          res?.data?.data?.map(el => {
                              arr.push({ title: el.roleName, value: el.id, corporateIds: el?.corporateIds, roleFor: el.roleFor, roleCode: el.roleCode })
                          })
                          setRoleList(arr);
                      }).catch(err => {
                          setRoleList([]);
                      })
                        eve.stopPropagation(); 
                        setOpenAssign(true); 
                        }} />
                    </AppTooltip> */}
                        {/* <AppTooltip
                          placement={'top'}
                          title={"Role's Permission Setting"}
                        >
                          <SettingsIcon
                            color='primary'
                            onClick={(eve) => {
                              eve.stopPropagation();
                              navigate('/role/permissions/' + e.id);
                            }}
                          />
                        </AppTooltip> */}
                        <AppTooltip placement={'top'} title={'Delete'}>
                          <DeleteIcon
                            style={{color: '#bc0805'}}
                            onClick={(eve) => {
                              eve.stopPropagation();

                              setId(e.id);
                              handleConfirm();
                            }}
                          />
                        </AppTooltip>
                      </div>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <SiteList childdata={childdata} id={dataid} />
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })
        ) : !data ? (
          <p
            style={{
              fontSize: '12px',
              paddingLeft: '45%',
              margin: '20% 0 20% 0',
            }}
          >
            No records to display
          </p>
        ) : (
          <p
            style={{
              fontSize: '12px',
              paddingLeft: '45%',
              margin: '20% 0 20% 0',
            }}
          >
            No records to display
          </p>
        )}
        <div
          className={classes.root}
          style={{display: 'flex', justifyContent: 'center'}}
        >
          <Pagination
            count={Math.ceil(totalCount / itemsPerPage)}
            page={page}
            defaultPage={0}
            // color="primary"
            size='large'
            showFirstButton
            showLastButton
            onChange={handlethisChange}
          />
        </div>
      </div>

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
            <CorporateForm
              close={handleCloseForm}
              tenantId={user?.userList?.tanentId}
            />
          </div>
        </DialogContent>
      </Dialog>
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
                onClick={closeDetailPage}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '1rem', marginTop: '2.5rem'}}>
              <DetailForm id={id} />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Corporate?'}
        handleClose={closeConfirmBox}
      />
    </>
  );
};

export default List;
