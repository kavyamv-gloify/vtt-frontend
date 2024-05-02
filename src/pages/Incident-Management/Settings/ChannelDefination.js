import React, {useState, useEffect} from 'react';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import {Grid} from '@mui/material';
import {Box} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import AppLoader from '@crema/core/AppLoader';
import SmartForm from '@smart-form';
import Api from '@api';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
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
import Confirm from '@confirmation-box';
import RestoreIcon from '@mui/icons-material/Restore';
const ChannelDefination = () => {
  const [open, setOpen] = useState(false);
  const [showbtn, setshowbtn] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [getAllList, setGetAllList] = useState();
  const [data, setData] = useState();
  const header = ['Channel Name', 'Channel Description', 'Status', 'Action'];
  const [listObj, setListObj] = useState({});
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [openReactivateConfirmbox, setOpenReactivateConfirmbox] = useState(false);
  const {user} = useAuthUser();
  function getAll() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/channel/getChannelByCorporateId/' +
          user?.userList?.corporateId,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setGetAllList(res?.data?.data);
        }
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAll();
  }, []);
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'channelName',
            id: 'channelName',
            title: 'Channel Name',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'channelDescription',
            id: 'channelDescription',
            title: 'Channel Description',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  function handleSubmit(val) {
    if (val?.button == 'submit') {
      let postData = val?.data;
      postData.corporateId = user?.userList?.corporateId;
      postData.status = 'ACTIVE';
      axios
        .post(Api.baseUri + '/user-reg/channel/save-channel', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Channel Submitted Successfully');
            setOpen(false);
            getAll();
          }
        })
        .catch((err) => {});
    }

    if (val?.button == 'update') {
      let postData = val?.data;
      postData.corporateId = user?.userList?.corporateId;
      postData.status = 'ACTIVE';
      axios
        .put(Api.baseUri + '/user-reg/channel/update-channel', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Channel Updated Successfully');
            setOpenEdit(false);
            setData(null);
            getAll();
          }
        })
        .catch((err) => {});
    }
  };

  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      let postData = {...listObj};
      postData.status = 'INACTIVE';
      console.log("postData", postData)
      axios
      .put(
        Api.baseUri +
          '/user-reg/channel/update-channel',
          postData,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Channel Deactivated Successfully');
          getAll();
          setOpenConfirmBox(false);
        }
       else {
      setOpenConfirmBox(false);
    }})
  }else{
    setOpenConfirmBox(false);
  }
}

const closeConfirmBoxReactivate = (dd) =>{
  if (dd == 'YES') {
    let postData = {...listObj};
    postData.status = 'ACTIVE';
    console.log("postData", postData)
    axios
    .put(
      Api.baseUri +
        '/user-reg/channel/update-channel',
        postData,
    )
    .then((res) => {
      if (res?.data?.status == '200') {
        toast.success('Channel Reactivated Successfully');
        getAll();
        setOpenReactivateConfirmbox(false);
      }
     else {
    setOpenReactivateConfirmbox(false);
  }})
}else{
  setOpenReactivateConfirmbox(false);
}
}
  return (
    <>
            <Grid container spacing={2} sx={{padding: '30px'}}>
        <Grid item xs={9}>
          <CustomLabel
            labelVal='Channel Defination'
            variantVal='h3-underline'
          />
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' justifyContent='flex-end'>
            <div
              className='left-seperator'
              onClick={() => {
                setOpen(true);
              }}
            >
              <AppTooltip placement={'top'} title={'Add Channel'}>
                <img
                  src='/assets/images/channel-definition.svg'
                  className='title-icons-mui'
                />
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>
      <Grid container sx={{padding: '0px 20px 0px 20px'}}>
        <Grid item xs={12}>
          <TableContainer
            style={{
              boxShadow:
                'rgba(0, 0, 0, 0) 0px 2px 4px, rgba(0, 0, 0, 0) 0px 7px 13px -3px, rgb(0,102,133) 0px -3px 0px inset',
            }}
          >
            <Table sx={{minWidth: 650}} aria-label='simple table'>
              <TableHead style={{background: '#f1f1f1'}}>
                <TableRow>
                  {header?.map((el) => {
                    return <TableCell> {el} </TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {getAllList?.length ? (
                  getAllList?.map((el, i) => {
                    return (
                      <TableRow
                        style={{background: i % 2 == 0 ? '' : '#f5f7ff'}}
                      >
                        <TableCell> {el?.channelName} </TableCell>
                        <TableCell> {el?.channelDescription} </TableCell>
                        <TableCell
                          sx={{color: el?.status == 'ACTIVE' ? 'green' : 'red'}}
                        >
                          {' '}
                          {el?.status}{' '}
                        </TableCell>
                        <TableCell sx={{display: 'flex'}}>
                          <div title='Edit'>
                          <EditIcon
                          title='Edit'
                            color='primary'
                            style={{
                              cursor: 'pointer',
                              opacity: el?.status == 'INACTIVE' ? '0.3' : '',
                            }}
                            onClick={() => {
                              if (el?.status == 'INACTIVE') {
                                return;
                              }
                              setData(el);
                              setOpenEdit(true);
                            }}
                          />
                          </div>
                          {/* <div style={{marginLeft: '20px'}} title="Delete">
                            <Delete
                              style={{
                                color: '#bc0805',
                                cursor: 'pointer',
                                opacity: el?.status == 'INACTIVE' ? '0.3' : '',
                              }}
                              title= 'Delete'
                              onClick={() => {
                                if (el?.status == 'INACTIVE') {
                                  return;
                                }
                                let postData = el;
                                postData.status = 'INACTIVE';
                                axios
                                  .put(
                                    Api.baseUri +
                                      '/user-reg/channel/update-channel',
                                    postData,
                                  )
                                  .then((res) => {
                                    if (res?.data?.status == '200') {
                                      toast.success(
                                        'Ticket deleted Successfully',
                                      );
                                      // setOpenStatusForm(false);
                                      getAll();
                                    }
                                  });
                              }}
                              color='primary'
                            />
                          </div> */}
                          <div style={{marginLeft: '20px'}}>
                            <Delete
                              style={{
                                color: '#bc0805',
                                opacity: el?.status == 'INACTIVE' ? '0.3' : '',
                              }}
                              onClick={() => {
                                if (el?.status == 'ACTIVE') {
                                  setOpenConfirmBox(true);
                                  setListObj(el)
                                }
                              }}
                              color='primary'
                            />
                          </div>
                          <div>
                            <RestoreIcon
                              style={{
                                opacity: el?.status == 'ACTIVE' ? '0.3' : '',
                                marginLeft: '20px',
                              }}
                              onClick={() => {
                                if (el?.status == 'ACTIVE') {
                                  return;
                                }
                                setListObj(el)
                                setOpenReactivateConfirmbox(true);
                              }}
                              color='primary'
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={10}>
                      No Records Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter></TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        style={{borderRadius: '4rem'}}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '600px',
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
              <h1 style={{marginTop: '1.5rem'}}>Add Channel</h1>
              <CloseIcon
                onClick={() => {
                  setOpen(false);
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

                {
                  <SmartForm
                    template={template}
                    onSubmit={handleSubmit}
                    buttons={['submit']}
                  />
                }
              </>
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Dialog
        open={openEdit}
        style={{borderRadius: '4rem'}}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '600px',
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
              <h1 style={{marginTop: '1.5rem'}}>
                {/* {data?.id} */}
                Update Channel</h1>
              <CloseIcon
                onClick={() => {
                  setOpenEdit(false);
                  setData(null);
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

                {data?.id && (
                  <SmartForm
                    template={template}
                    defaultValues={data}
                    onSubmit={handleSubmit}
                    buttons={['update']}
                  />
                )}
              </>
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Channel?'}
        handleClose={closeConfirmBox}
      />
      <Confirm
        open={openReactivateConfirmbox}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the Channel?'}
        handleClose={closeConfirmBoxReactivate}
      />

    </>
  );
};

export default ChannelDefination;
