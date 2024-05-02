import React, {useState, useEffect} from 'react';
import {Button, Grid, Box, Avatar} from '@mui/material';
import Textarea from '@mui/joy/Textarea';
import {TextField} from '@mui/material';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AppTooltip from '@crema/core/AppTooltip';
import SmartForm from '@smart-form';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {DialogTitle} from '@mui/material';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import axios from 'axios';
import Api from '@api';
import Confirm from '@confirmation-box';
import {getFormData} from '@hoc';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { GiConsoleController } from 'react-icons/gi';
const Comment = ({ticketInfo, close, copyContent}) => {
  console.log('ticketInfo', ticketInfo);
  const [open, setOpen] = useState(false);
  const [agent, setAgent] = useState([]);
  const [team, setTeam] = useState([]);
  const [selectedRule, setSelectedRule] = useState('YES');
  const [comment, setComment] = useState();
  const {user} = useAuthUser();
  const [tripDetail, setTripDetail]=useState();
  const [newFileName, setNewFileName] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
useEffect(()=>{
  axios.get(Api.baseUri + `/user-reg/trip-route/get-trip-by-id?tripId=${ticketInfo?.tripId}`).then((res)=>{
    if(res?.data?.status=="200"){
      console.log("tripDetail", res?.data?.data)
      setTripDetail(res?.data?.data?.[0])
    }
  }).catch((err)=>{
    console.log("err", err)
  })
},[ticketInfo])
  useEffect(() => {
    let postData = {
      page: '0',
      size: '10',
      role: 'AGENT',
      corporateId: user?.userList?.corporateId,
      roleCode: 'EMPLOYEE',
    };
    axios
      .post(Api.baseUri + '/userauth/user-account/getAllUserData', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];

          res?.data?.data?.body?.UserList?.map((el) => {
            temp.push({title: el?.userName, value: el?.profileId});
          });

          setAgent(temp ?? []);
        }
      })
      .catch((err) => {
        setAgent([]);
      });
  }, []);


  const getFileName = async (val) => {
    let tem = {
      photo: val,
    };
    let dataSet;

    Object.keys(tem).map((key) => {
      dataSet = {
        ...dataSet,
        [key]: tem[key][0],
      };
    });

    console.log('dataSet', dataSet);
    let temp = await axios({
      method: 'post',
      url: Api.baseUri + '/user-reg/compliance/save-file',
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    });
    console.log('temp', temp);
    return temp?.data?.data?.documentName;
  };
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/incidentTeam/getAllByCorporateId/' +
          user?.userList?.corporateId,
      )
      .then((res) => {
        let temp = [];
        if (res?.data?.status == '200') {
          res?.data?.data?.map((el) => {
            temp.push({title: el?.teamName, value: el?.id});
          });
        }
        setTeam(temp ?? []);
      })
      .catch((err) => {
        setTeam([]);
      });
  }, [user?.userList?.corporateId]);
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
            type: 'autocomplete',
            name: 'teamId',
            id: 'teamId',
            title: 'Team',
            options: team ?? [],
            // validationProps: {
            //   required: 'This is a mandatory field',
            // },
          },

          {
            type: 'autocomplete',
            name: 'pendingWith',
            id: 'pendingWith',
            title: 'Select Agent',
            options: agent ?? [],
            validationProps: {
              // required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };
  let pending_template = {
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
            type: 'autocomplete',
            name: 'teamId',
            id: 'teamId',
            title: 'Team',
            options: team ?? [],
            validationProps: {
              // required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

 const getListData = ()=>{
      if (ticketInfo?.id) {
        axios.get(
            Api.baseUri +
              '/user-reg/incident-management/get-incident-management-by-id/' +
              ticketInfo?.id,
          )
          .then((res) => {
            if (res?.data?.status == '200') {
              return res?.data?.data;
            }
          });
      }
  };

  async function handleSubmit(val) {
    console.log('shreya');
    let postData = {};
    postData.id = ticketInfo?.id;
    
    if (val?.data?.teamId?.length) {
      postData.teamId = val?.data?.teamId;
    }
    if (val?.data?.pendingWith?.length) {
      postData.pendingWith = val?.data?.pendingWith;
    }
    postData.remarksHistory = [
      {
        remarks: comment,
        remarksGivenById: user?.userList?.profileId,
        remarksGivenByName: user?.userList?.userName,
        isPrivate: selectedRule,
      },
    ];
    console.log('postData', postData);

    axios
      .post(
        Api.baseUri + '/user-reg/incident-management/forward-incident',
        postData,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Ticket forwarded successfully');
          getListData();
          setOpen(false);
          close();
          window.location.reload();
          // navigate('/incident-view');
        }
      })
      .catch((err) => {});
  }

  function closeConfirmBox(d) {
    if (d == 'YES') {
      let postData = {
        id: ticketInfo?.id,
        vendorId: tripDetail?.vendorId,
        // vendorAttachement: '',
        vendorComment: comment,
        
      };
      console.log("postDta", postData)

      axios
        .post(
          Api.baseUri +
            '/user-reg/incident-management/forward-incident-for-vendor',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Ticket forwarded to Vendor Successfully');
            setOpen(false);
            close();
            // window.location.reload();
          }
        });
    } else {
      setOpenConfirmBox(false);
    }
  }
  async function handlePendingTemplate(val) {
    let postData = {};
    postData.id = ticketInfo?.id;
    postData.isPrivate = selectedRule;
    if (val?.data?.teamId?.length) {
      postData.teamId = val?.data?.teamId;
    }
    // let myfileName = await getFileName(newFileName);
    // console.log('myfileName', myfileName);
    postData.remarksHistory = [
      {
        remarks: comment,
        remarksGivenById: user?.userList?.profileId,
        remarksGivenByName: user?.userList?.userName,
        isPrivate: selectedRule,
        // remarksAttachement: myfileName,
      },
    ];

    axios
      .post(
        Api.baseUri + '/user-reg/incident-management/forward-incident',
        postData,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Pending Ticket Forwarded Successfully');
          setOpen(false);
          getListData();
          close();
          window.location.reload();
          // navigate('/incident-view');
        }
      });
  }
  return (
    <div>
      <Grid container>
        <Grid md={12}>
          <TextField
            id='standard-basic'
            label='Type here...'
            value={copyContent}
            variant='standard'
            onChange={(e) => {
              setComment(e?.target?.value);
              // console.log('eeee', e?.target?.value);
            }}
            multiline
            rows={10}
            sx={{width: '100%', border: 'none'}}
            maxRows={20}
          />
        </Grid>
        <Grid
          md={12}
          sx={{
            marginTop: '10px',
            // borderBottom: '1px solid #D7DBDD',
          }}
        >
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            {/* <Box sx={{display: 'flex', alignItems: 'center'}}>
              <AppTooltip placement={'top'} title={'Add Attachement'}>
                <Button variant='contained'>
                  <AttachmentOutlinedIcon sx={{marginRight: '10px'}} />
                  <p>{<UploadFileOutlinedIcon/> ?? newFileName[0]?.name}</p>
                  <input
                    // hidden
                    accept='image/*,.pdf,.doc,.docx'
                    multiple
                    type='file'
                    onChange={(e) => {
                      // setFileName('');
                      setNewFileName(e?.target?.files);

                      // var image2 = document.getElementById(
                      //   'image' + 'image_round3',
                      // );
                      // image2.href = URL.createObjectURL(e.target.files[0]);
                    }}
                  />
                </Button>
              </AppTooltip>

            </Box> */}
              <FormControl>
                <RadioGroup
                  aria-labelledby='demo-radio-buttons-group-label'
                  defaultValue='YES'
                  name='radio-buttons-group'
                  onClick={(e) => {
                    console.log(e.target.value);
                    setSelectedRule(e.target.value);
                  }}
                  sx={{display: 'flex', flexDirection: 'row'}}
                >
                  <FormControlLabel
                    value='YES'
                    control={<Radio />}
                    label='Private'
                  />
                  <FormControlLabel
                    value='NO'
                    control={<Radio />}
                    label='Public'
                  />
                </RadioGroup>
              </FormControl>
            <Box sx={{display: 'flex'}}>
              {/* <Button variant='contained'>Save</Button> */}
              {
                <Button
                color='info'
                  sx={{marginLeft: '10px'}}
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <AppTooltip placement={'top'} title={'Comment and Assign to'}>
                    <InsertCommentOutlinedIcon/>
                  </AppTooltip>
                </Button>
              }
              {user?.userList?.userRoleName == 'CORPORATEADMIN' && ticketInfo?.tripId && ticketInfo?.status!=="CLOSED" && (
                <Button
                  sx={{marginLeft: '10px'}}
                  onClick={() => {
                    setOpenConfirmBox(true);
                  }}
                >
                  <AppTooltip placement={'top'} title={'Forward to Vendor'}>
                  <ForwardToInboxOutlinedIcon/>
                  </AppTooltip>
                </Button>
              )}
              {user?.userList?.userRoleName == 'VENDOR' && (
                <Button
                  sx={{marginLeft: '10px'}}
                  onClick={() => {
                    setOpenConfirmBox(true);
                  }}
                >
                  <AppTooltip placement={'top'} title={'Forward to Corporate'}>
                  <ForwardToInboxOutlinedIcon/>
                  </AppTooltip>
                </Button>
              )}
              <Button
                sx={{marginLeft: '10px'}}
                onClick={() => {
                  close();
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Dialog
        // onClose={closeDetailPage}
        open={open}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f4f2f2'}}>
          <h1>Forward To</h1>
          <CloseIcon
            onClick={() => {
              setOpen(false);
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>
        <DialogContent style={{padding: '10px'}}>
          {ticketInfo?.status == 'UNASSIGNED' ? (
            <SmartForm
              template={template}
              onSubmit={handleSubmit}
              buttons={['submit']}
            />
          ) : (
            <SmartForm
              template={pending_template}
              onSubmit={handlePendingTemplate}
              buttons={['submit']}
            />
          )}
        </DialogContent>
      </Dialog>

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Forward'}
        cnfMsg={'Are you sure, You want to forward the ticket'}
        handleClose={closeConfirmBox}
      />
    </div>
  );
};

export default Comment;
