import React, {useState, useEffect} from 'react';
import Api from '@api';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import Create from '../Add Compliance';
import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import Accordion from '@mui/material/Accordion';
import Paper from '@mui/material/Paper';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SubTopicList from '../SubTopicLisiting';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {toast} from 'react-toastify';
import Confirm from '@confirmation-box';
import SmartForm from '@smart-form';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestoreIcon from '@mui/icons-material/Restore';
const ComplainceListing = () => {
  const [data, setData] = useState();
  const [childId, setchildId] = useState();
  const [childData, setChildData] = useState([]);
  const [openDialAddMore, setOpenDialAddMore] = useState(false);
  const [deleteCnf, setDeleteCnf] = useState(false);
  const [reactivateCnf, setReactivateCnf] = useState(false);
  const [actionContent, setActionContent] = useState({});
  const [editData, setEditData] = useState({});
  const [selData, setselData] = useState({});
  const [corporate, setCorporate] = useState();
  const [corporateId, setCorporateId] = useState([]);
  const [openDial, setOpenDial] = useState(false);
  const [showAssignBtn, setShowAssignBtn] = useState(false);
  function AssignFunc() {
    setShowAssignBtn(false);
    let tem_topics = [];
    let false_topics = [];
    childData?.map((el, _ind) => {
      if (selData[_ind] === true) {
        tem_topics.push(el?.id);
      } else {
        false_topics.push(el.id);
      }
    });
    let corpId = [];
    corporateId?.map((el) => {
      if (!corpId?.includes(el?.value)) corpId.push(el.value);
    });

    axios
      .post(
        `${
          Api.baseUri
        }/user-reg/compliance-topic/assign-compliance-topic-corporate?topicsId=${tem_topics?.join()}&corporate=${corpId?.join()}&removeTopicsId=${null}`,
        {},
      )
      .then((res) => {
        setCorporateId([]);
        setShowAssignBtn(true);
        if (res?.data?.status == '200') {
          toast.success('Assigned successfully.');
          setOpenDial(false);
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        setCorporateId([]);
        setShowAssignBtn(true);
        toast.error('Something went wrong.');
      });
  }

  useEffect(() => {
    let temBool = false;
    for (const [key, value] of Object.entries(selData)) {
      if (value === true) temBool = true;
    }
    setShowAssignBtn(temBool);
  }, [selData]);
  function selectClick(cid, mydata) {
    let is_avl = false;
    mydata.map((eb) => {
      if (eb?.applicableCorporate?.includes(cid)) {
        is_avl = true;
      }
    });
    let temp = {};
    mydata?.map((ele, index) => {
      if (is_avl) {
        if (ele?.applicableCorporate?.includes(cid)) {
          temp[index] = true;
        } else {
          temp[index] = false;
        }
      } else {
        temp[index] = false;
        childData?.map((sel_el) => {
          if (sel_el?.id == ele?.id) {
            temp[index] = true;
          }
        });
      }
    });
    setselData({...temp});
  }
  function getCorpLabel(d) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span style={{width: '40px', marginRight: '10px'}}>
          <img
            src={Api?.imgUrl + d?.companyRegDoc}
            style={{width: '40px', height: '20px'}}
            onError={(event) =>
              (event.target.src = '/assets/images/defcompany.png')
            }
          />
        </span>
        <span>
          {d.companyName +
            ' - ' +
            d?.companyAddress?.addressName?.split(',')[0]}
          , {d?.companyAddress?.addressName?.split(',')[1]},{' '}
          {d?.companyAddress?.city}
        </span>
      </div>
    );
  }
  useEffect(() => {
    if (corporateId?.value && childData)
      selectClick(corporateId?.value, childData);
  }, [childData, corporateId]);
  useEffect(() => {
    if (childData && corporate?.length && corporate[0]?.value)
      selectClick(corporate[0]?.value, childData);
  }, [childData, corporate]);
  async function fetchDataParent() {
    const baseURL = Api.baseUri + '/user-reg/corporate-reg?page=0&size=1000';
    let response = await axios.get(`${baseURL}`);
    let temp = [];
    response?.data?.data?.body?.['CorporateList']?.map((el) => {
      temp.push({title: getCorpLabel(el), value: el?.id});
    });
    setCorporate(temp);
    // setCorporateId([temp[0]]);
  }

  useEffect(() => {
    fetchDataParent();
  }, []);

  function getChildFunc() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/compliance-topic/get-compliance-topic-by-groupId/' +
          childId,
      )
      .then((res) => {
        let temp = res?.data?.data;
        let sortedProducts = temp?.sort((p1, p2) =>
          new Date(p1.createdOn) < new Date(p2.createdOn)
            ? 1
            : new Date(p1.createdOn) > new Date(p2.createdOn)
            ? -1
            : 0,
        );
        setChildData(sortedProducts);
      })
      .catch((err) => {
        setChildData([]);
      });
  }
  useEffect(() => {
    if (childId) {
      setChildData([]);
      getChildFunc();
    } else {
      setChildData([]);
    }
  }, [childId]);
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Bank Type',
    description: 'Form for verifying OTP',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'name',
            id: 'name',
            title: 'Name',
          },
          {
            type: 'autocomplete',
            name: 'complianceType',
            id: 'complianceType',
            options: [
              {title: 'Driver', value: 'DRIVER'},
              {title: 'Vehicle', value: 'VEHICLE'},
            ],
            disabled: actionContent?._type == 'edit' ? true : false,
            title: 'For',
          },
        ],
      },
    ],
  };
  function handleSubmitDial(v) {
    let postData = v?.data;
    if (v.button == 'Submit') {
      postData.status == 'ACTIVE';
      axios
        .post(Api.baseUri + '/user-reg/compliance/save-compliance', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            complianceList();
            setActionContent({});
            toast.success('Compliance group created successfully');
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    }
    if (v.button == 'Update') {
      axios
        .put(Api.baseUri + '/user-reg/compliance/update-compliance', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            setActionContent({});
            complianceList();
            toast.success('Compliance group updated successfully');
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    }
  }

  function deleteFun(d) {
    if (d == 'NO') {
      setDeleteCnf(false);
      return;
    }
    const {_id, _val, _type} = actionContent;
    if (_type == 'delete') {
      let putData = _val;
      putData.status = 'INACTIVE';
      axios
        .put(Api?.baseUri + '/user-reg/compliance/update-compliance', putData)
        .then((res) => {
          setDeleteCnf(false);
          setActionContent({});
          if (res?.data?.status == '200')
            toast.success('Compliance deactivated successfully.');
          else toast.error(res?.data?.message || 'Something went wrong.');
        })
        .catch((err) => {
          setActionContent({});
          setDeleteCnf(false);
          toast.error('Something went wrong.');
        });
    }
  }
  function reactivateFun(d) {
    if (d == 'NO') {
      setReactivateCnf(false);
      return;
    }
    const {_id, _val, _type} = actionContent;
    if (_type == 'reactivate') {
      let putData = _val;
      putData.status = 'ACTIVE';
      axios
        .put(Api?.baseUri + '/user-reg/compliance/update-compliance', putData)
        .then((res) => {
          setReactivateCnf(false);
          setActionContent({});
          if (res?.data?.status == '200') {
            if (res?.data?.data?.status == 'ACTIVE') {
              toast.success('Compliance re-activated successfully.');
            } else {
              toast.success('Compliance deactivated successfully.');
            }
          } else toast.error(res?.data?.message || 'Something went wrong.');
        })
        .catch((err) => {
          setActionContent({});
          setReactivateCnf(false);
          toast.error('Something went wrong.');
        });
    }
  }
  function editFunc(_id, _val, _type, _no) {
    if (_type == 'delete') setDeleteCnf(true);
    if (_type == 'reactivate') setReactivateCnf(true);
    setActionContent({_id: _id, _val: _val, _type: _type, count: _no});
  }

  const complianceList = () => {
    axios
      .get(Api.baseUri + '/user-reg/compliance/getAllByStatus/null')
      .then((res) => {
        let temp = [];
        res?.data?.data?.map((el) => {
          temp.push(el);
        });
        let sortedProducts = temp?.sort((p1, p2) =>
          new Date(p1.createdOn) < new Date(p2.createdOn)
            ? 1
            : new Date(p1.createdOn) > new Date(p2.createdOn)
            ? -1
            : 0,
        );
        setData(sortedProducts);
      })
      .catch((err) => {
        setData([]);
      });
  };

  useEffect(() => {
    complianceList();
  }, []);

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal='Compliance List' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add New Compliance Group'}>
                <img
                  src='/assets/images/title-icon/add penalty.svg'
                  className='title-icons-mui'
                  onClick={() => {
                    setActionContent({_type: 'create'});
                  }}
                />
                {/* // setOpenForm(true) }} /> */}
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>

      {/* {openDialog && id && <Edit openDialog={openDialog} id={id} popBTNClick={popBTNClick} />} */}
      {/* <Accordion> pointer-events: none;*/}
      <div style={{maxHeight: '80vh', overflowY: 'auto'}}>
        <div
          style={{
            position: 'sticky',
            top: '0',
            zIndex: '100',
            backgroundColor: '#f1f1f1',
          }}
        >
          <AccordionSummary
            style={{backgroundColor: '#f1f1f1',padding:'5px'}}
            expandIcon={<ExpandMoreIcon sx={{opacity: '0'}} />}
          >
            <Typography
              style={{width: '15%', fontWeight: 'bold', textAlign: 'left'}}
            >
              Group Name
            </Typography>
            <Typography
              style={{width: '10%', fontWeight: 'bold', textAlign: 'center'}}
            >
              Compliance For
            </Typography>
            <Typography
              style={{width: '10%', fontWeight: 'bold', textAlign: 'center'}}
            >
              No of Compliances
            </Typography>
            <Typography
              style={{width: '10%', fontWeight: 'bold', textAlign: 'center'}}
            >
              Created By
            </Typography>
            <Typography
              style={{width: '15%', fontWeight: 'bold', textAlign: 'center'}}
            >
              Created On
            </Typography>
            <Typography
              style={{width: '15%', fontWeight: 'bold', textAlign: 'center'}}
            >
              Updated On
            </Typography>
            <Typography
              style={{width: '10%', fontWeight: 'bold', textAlign: 'center'}}
            >
              Status
            </Typography>
            <Typography
              style={{width: '15%', fontWeight: 'bold', textAlign: 'center'}}
            >
              Actions
            </Typography>
          </AccordionSummary>
          {/* </Accordion> */}
        </div>
        <div>
          {data?.map((el, ind) => {
            return (
              <Accordion expanded={el?.id == childId ? true : false}>
                <AccordionSummary
                  style={{backgroundColor: 'white'}}
                  expandIcon={<ExpandMoreIcon />}
                  onClick={() => {
                    setchildId(el.id);
                    if (childId == el.id) setchildId(null);
                  }}
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                >
                  <Typography style={{width: '15%', textAlign: 'left'}}>
                    {el?.name}
                  </Typography>
                  <Typography style={{width: '10%', textAlign: 'center'}}>
                    {el?.complianceType[0]?.toUpperCase() +
                      el?.complianceType.slice(1)?.toLowerCase()}
                  </Typography>
                  <Typography style={{width: '10%', textAlign: 'center'}}>
                    {el?.noOfTopics}
                  </Typography>
                  <Typography style={{width: '10%', textAlign: 'center'}}>
                    {el?.createdBy || 'NA'}
                  </Typography>
                  <Typography style={{width: '15%', textAlign: 'center'}}>
                    {el?.createdOn
                      ? moment(new Date(el?.createdOn)).format('DD-MM-YYYY')
                      : 'NA'}
                  </Typography>
                  <Typography style={{width: '15%', textAlign: 'center'}}>
                    {el?.updatedOn
                      ? moment(new Date(el?.updatedOn)).format('DD-MM-YYYY')
                      : 'NA'}
                  </Typography>
                  <Typography
                    style={{
                      width: '10%',
                      textAlign: 'center',
                      color: el?.status == 'INACTIVE' ? 'red' : 'green',
                    }}
                  >
                    {el?.status || 'ACTIVE'}
                  </Typography>
                  <Typography style={{width: '15%', textAlign: 'center'}}>
                    <AppTooltip placement={'bottom'} title={'Edit'}>
                      <EditIcon
                        sx={{
                          color: '#0A8FDC',
                          opacity: el?.status == 'INACTIVE' ? '0.3' : '',
                        }}
                        onClick={(eve) => {
                          eve.stopPropagation();
                          if (el?.status == 'INACTIVE') return;
                          editFunc(el?.id, el, 'edit', el.noOfTopics);
                          setEditData(el);
                        }}
                      />
                    </AppTooltip>
                    <AppTooltip
                      placement={'bottom'}
                      title={'Add New Compliance'}
                    >
                      <AddBoxIcon
                        sx={{
                          ml: 4,
                          color: '#0A8FDC',
                          opacity: el?.status == 'INACTIVE' ? '0.3' : '',
                        }}
                        onClick={(eve) => {
                          eve.stopPropagation();
                          if (el?.status == 'INACTIVE') return;
                          setOpenDialAddMore(true);
                          setEditData(el);
                          setchildId(null);
                        }}
                      />
                    </AppTooltip>
                    {/* <AppTooltip
                    placement={'bottom'}
                    title={'Assign to Corporate'}
                  >
                    <AssignmentTurnedInIcon
                      sx={{
                        ml: 4,
                        color: '#0A8FDC',
                        opacity: el?.status == 'INACTIVE' ? '0.3' : '',
                      }}
                      onClick={(eve) => {
                        eve.stopPropagation();
                        if (el?.status == 'INACTIVE') return;
                        setOpenDial(true);
                        setchildId(el?.id);
                      }}
                    />
                  </AppTooltip> */}
                    {el?.status == 'INACTIVE' ? (
                      <AppTooltip placement={'bottom'} title={'Re-activate'}>
                        <RestoreIcon
                          sx={{ml: 4, color: '#0A8FDC'}}
                          onClick={(eve) => {
                            eve.stopPropagation();
                            if (el?.status !== 'INACTIVE') return;
                            editFunc(el?.id, el, 'reactivate', el.noOfTopics);
                          }}
                        />
                      </AppTooltip>
                    ) : (
                      <AppTooltip placement={'bottom'} title={'Deactivate'}>
                        <DeleteIcon
                          sx={{ml: 4, color: '#bc0906'}}
                          onClick={(eve) => {
                            eve.stopPropagation();
                            if (el?.status == 'INACTIVE') return;
                            editFunc(el?.id, el, 'delete', el.noOfTopics);
                          }}
                        />
                      </AppTooltip>
                    )}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {childId == el?.id ? (
                      <SubTopicList
                        getChildFunc={getChildFunc}
                        complianceList={complianceList}
                        currComp={el}
                        childData={childData}
                      />
                    ) : null}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      </div>
      <Dialog open={openDialAddMore} style={{borderRadius: '4rem'}}>
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Add New Compliance</h1>
          <CloseIcon
            onClick={() => {
              setOpenDialAddMore(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '20px', paddingTop: '0', marginTop: '0px'}}>
            <Create
              currComp={editData}
              close={() => {
                setOpenDialAddMore(false);
                complianceList();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={actionContent?._type == 'edit'}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Update Compliance</h1>
          <CloseIcon
            onClick={() => {
              setActionContent({});
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div
            style={{
              padding: '20px',
              marginTop: '0px',
              paddingTop: '0',
              width: '500px',
            }}
          >
            <SmartForm
              defaultValues={editData}
              template={template}
              onSubmit={handleSubmitDial}
              buttons={['Update']}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={actionContent?._type == 'create'}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Create Compliance Group</h1>
          <CloseIcon
            onClick={() => {
              setActionContent({});
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div
            style={{
              padding: '20px',
              marginTop: '0px',
              paddingTop: '0',
              width: '500px',
            }}
          >
            <SmartForm
              // defaultValues={data}
              template={template}
              onSubmit={handleSubmitDial}
              buttons={['Submit']}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Confirm
        open={deleteCnf}
        handleClose={deleteFun}
        cnfMsg={
          (actionContent.count
            ? `There ${
                actionContent.count == 1
                  ? 'is a subcompliance'
                  : 'are ' + actionContent.count + ' subcompliances'
              } under this compliance. Still you `
            : 'Are you sure, You ') + 'want to deactivate the compliance?'
        }
        header={'Confirm to Deactivate'}
      />
      <Confirm
        open={reactivateCnf}
        handleClose={reactivateFun}
        cnfMsg={'Are you sure, You want to re-activate the compliance?'}
        header={'Confirm to Re-activate'}
      />
      <Dialog
        // onClose={handleClose}
        open={openDial}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '70%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Assign to Corporate Admin</h1>
          <CloseIcon
            onClick={() => {
              setCorporateId([]);
              setOpenDial(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '20px', marginTop: '0px'}}>
            <label style={{fontSize: '13px', marginLeft: '4px'}}>
              Corporate name
            </label>
            <div style={{marginTop: '6px'}}>
              {corporate ? (
                <Autocomplete
                  multiple
                  // defaultValue={[corporate[0]]}
                  value={corporateId}
                  onChange={(e, v) => {
                    setCorporateId(v);
                  }} // setDeselect(false); setSelect(false); }}
                  options={corporate || []}
                  getOptionLabel={(option) => option.title}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={option.title} {...getTagProps({index})} />
                    ))
                  }
                  style={{width: '100%'}}
                  renderInput={(params) => <TextField {...params} />}
                />
              ) : null}
            </div>
            <TableContainer component={Paper} sx={{marginTop: '20px'}}>
              <Table sx={{minWidth: 50}} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>S.No.</TableCell>
                    <TableCell align='right' sx={{width: '10px'}}>
                      Compliance
                    </TableCell>
                    <TableCell align='right'>Select</TableCell>
                    <TableCell align='right'>Deselect</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {childData?.map((el, index) => (
                    <TableRow
                      key={index}
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                      <TableCell component='th' scope='row' sx={{width: '9px'}}>
                        {Number(index) + 1}
                      </TableCell>
                      <TableCell align='left'>{el?.topicName}</TableCell>
                      <TableCell align='right'>
                        <Tooltip title='select'>
                          <IconButton>
                            <CheckCircleIcon
                              sx={{
                                color: 'green',
                                opacity: selData[index] ? '0.3' : '',
                              }}
                              onClick={() => {
                                setselData({...selData, [index]: true});
                                // handleAdd(index)
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align='right'>
                        <Tooltip title='Deselect'>
                          <IconButton>
                            <CancelIcon
                              sx={{
                                color: '#900d09',
                                opacity: selData[index] ? '' : '0.3',
                              }}
                              onClick={() => {
                                setselData({...selData, [index]: false});
                                // handleRemove(index)
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div style={{margin: 'auto', width: '16%'}}>
              <Button
                id='btnMui123'
                disabled={
                  !corporate?.length || !corporateId?.length || !showAssignBtn
                }
                onClick={AssignFunc}
                variant='contained'
                sx={{marginTop: '30px'}}
              >
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComplainceListing;
