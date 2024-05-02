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
import List from '../Sub-Topics/listing';
import Api from '@api';
import axios from 'axios';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateForm from './index';
import EditIcon from '@mui/icons-material/Edit';
import Pagination from '@mui/material/Pagination';
import {makeStyles} from '@mui/styles';
import {toast} from 'react-toastify';
import Confirm from '@confirmation-box';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';

const CustomExpandIcon = ({opacity}) => {
  // const useStyles = makeStyles((theme) => ({
  //   root: {
  //     '& > *': {
  //       marginTop: theme.spacing(2),
  //     },
  //   },
  // }));
  // const classstyle = useStyles()

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
  const [myData, setMyData] = useState();
  const [openDialog, setopenDialog] = useState(false);
  const [OpenAdd, setOpenAdd] = useState(false);
  const [dialID, setdialID] = useState();
  const [totalCount, settotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [delId, setDelId] = useState(false);
  const [addId, setAddId] = useState(false);
  const [id, setId] = useState();
  const [expanded, setExpanded] = useState(null);
  const tableRef = React.useRef();
  const itemsPerPage = 10;
  useEffect(() => {
    getallTopics();
  }, []);
  function handleChange(e) {
    setExpanded(e || null);
  }
  function getallTopics() {
    let url = `${Api.support.topicList}?page=0&size=1000&topicName=null&type=EMPLOYEE`;
    axios
      .get(url)
      .then((res) => {
        setMyData(res?.data?.data?.body?.HelpTopicList ?? []);
      })
      .catch((err) => {
        setMyData([]);
      });
  }
  const handlethisChange = (event, value) => {
    setPage(value);
  };

  function handleClickEdit(id) {
    setopenDialog(true);
    setdialID(id);
  }
  function closeConfirmBox(d) {
    if (d == 'YES') {
      axios
        .post(Api.support?.deleteTopic + id, {})
        .then((res) => {
          if (res?.data?.status == 200) {
            toast.success('Topic deactivate successfully.');
            setDelId(false);
            getallTopics();
          } else {
            toast.error(res?.data?.message ?? 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error(res?.data?.message ?? 'Something went wrong.');
        });
    } else {
      setDelId(false);
    }
  }
  function closeAddConfirmBox(d) {
    if (d == 'YES') {
      axios
        .post(Api.baseUri + '/user-reg/helpmaster/Activatehelptopic/' + id, {})
        .then((res) => {
          if (res?.data?.status == 200) {
            toast.success('Topic reactivate successfully.');
            setAddId(false);
            getallTopics();
          } else {
            toast.error(res?.data?.message ?? 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error(res?.data?.message ?? 'Something went wrong.');
        });
    } else {
      setAddId(false);
    }
  }

  function popBTNClick(val) {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 100);
    getallTopics();
    if (!val) {
      setopenDialog(false);
    }
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingBottom: '10px',
        }}
      >
        <Button
          id='btnMui123'
          variant='contained'
          onClick={() => {
            setdialID('create');
            // setopenDialog(true);
            setOpenAdd(true);
          }}
        >
          {/* Create New Topic */}
          {/* <AddToPhotosOutlinedIcon 
          style={{marginRight: '10px'}}
          
          className=''
          /> */}Add Topics
        </Button>
      </div>
      <Accordion
        style={{padding: '10px', background: '#eeeeee', pointerEvents: 'none'}}
      >
        <AccordionSummary
          className='mb-2'
          expandIcon={<CustomExpandIcon opacity={0} />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography style={{width: '25%', fontWeight: 600}}>
            {' '}
            Topic Name{' '}
          </Typography>
          <Typography style={{width: '40%', fontWeight: 600}}>
            {' '}
            Topic Details{' '}
          </Typography>
          <Typography style={{width: '20%', fontWeight: 600}}>
            {' '}
            Created On{' '}
          </Typography>
          <Typography
            style={{width: '15%', fontWeight: 600, textAlign: 'center'}}
          >
            {' '}
            Status{' '}
          </Typography>
          <Typography
            style={{width: '15%', textAlign: 'center', fontWeight: 600}}
          >
            {' '}
            Action{' '}
          </Typography>
        </AccordionSummary>
      </Accordion>
      {myData?.length ? (
        myData?.map((el, index) => {
          return (
            <Accordion
              style={{padding: '10px'}}
              expanded={expanded === index + 1}
              onChange={() => {
                handleChange(expanded == index + 1 ? null : index + 1);
              }}
            >
              <AccordionSummary
                className='mb-2'
                expandIcon={<CustomExpandIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography style={{width: '25%'}}>
                  {' '}
                  {el?.topicName}{' '}
                </Typography>
                <Typography style={{width: '40%'}}>
                  {' '}
                  {el?.topicDetails}{' '}
                </Typography>
                <Typography style={{width: '20%'}}>
                  {' '}
                  {moment(el?.createdOn).format('DD/MM/YYYY')}{' '}
                </Typography>
                <Typography
                  style={{
                    width: '15%',
                    textAlign: 'center',
                    color: el?.status == 'ACTIVE' ? 'green' : 'red',
                  }}
                >
                  {' '}
                  {el?.status}{' '}
                </Typography>
                <Typography
                  style={{width: '15%', textAlign: 'center', color: '#0000EE'}}
                  onClick={(eve) => {
                    eve.stopPropagation();
                  }}
                >
                  {el?.status != 'INACTIVE' ? (
                    <>
                      <u
                        onClick={() => {
                          handleClickEdit(el?.id);
                        }}
                      >
                        Edit
                      </u>
                      <u
                        style={{
                          marginLeft: '10px',
                          display: index == 0 ? 'none' : '',
                        }}
                        onClick={() => {
                          setDelId(true);
                          setId(el?.id);
                        }}
                      >
                        Deactivate
                      </u>
                    </>
                  ) : (
                    <u
                      style={{
                        marginLeft: '10px',
                        display: index == 0 ? 'none' : '',
                      }}
                      onClick={() => {
                        setAddId(true);
                        setId(el?.id);
                      }}
                    >
                      Reactivate
                    </u>
                  )}
                  {/* {el?.status=="INACTIVE"} */}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  sx={{border: '1px solid #efefef', borderRadius: '8px'}}
                >
                  {expanded === index + 1 ? (
                    <List topicId={el?.id} status={el?.status} />
                  ) : null}{' '}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <div
          style={{
            background: 'white',
            height: '400px',
            color: '#b3b3b3',
            width: '100%',
            fontWeight: 500,
            textAlign: 'center',
            paddingTop: '170px',
            boxShadow:
              '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
          }}
        >
          No records found.
        </div>
      )}

      {OpenAdd ? (
        <Dialog
          open={true}
          onClose={() => {
            setOpenAdd(false);
            setdialID('');
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle
            id='alert-dialog-title'
            style={{fontSize: '2.5vh', background: '#f1f1f1'}}
          >
            <h2>Support Topic</h2>
            <div style={{position: 'absolute', top: '12px', right: '15px'}}>
              <span>
                <CloseIcon
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setOpenAdd(false);
                    setdialID('');
                  }}
                />
              </span>
            </div>
          </DialogTitle>
          <DialogContent>
            <CreateForm
              id='create'
              popBTNClick={popBTNClick}
              close={() => {
                setOpenAdd(false);
              }}
              type={'EMPLOYEE'}
            />
          </DialogContent>
        </Dialog>
      ) : null}
      {openDialog && dialID != 'create' && (
        <CreateForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
          type={'EMPLOYEE'}
        />
      )}

      {delId ? (
        <Confirm
          open={delId}
          header={'Confirm to Deactivate'}
          cnfMsg={'Are you sure, You want to deactivate the Topic?'}
          handleClose={closeConfirmBox}
        />
      ) : null}
      {addId ? (
        <Confirm
          open={addId}
          header={'Confirm to Reactivate'}
          cnfMsg={'Are you sure, You want to Reactivate the Topic?'}
          handleClose={closeAddConfirmBox}
        />
      ) : null}
    </div>
  );
};
export default Topics;
