import React, {useState, useEffect} from 'react';
import {Grid, Box} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CardView from '../Tickets/CardView';
import SmartForm from '@smart-form';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import KnowledgeCard from './KnowledgeCard';
import axios from 'axios';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AppTooltip from '@crema/core/AppTooltip';
import {useSnackbar} from '@mui/material/node_modules/@mui/base';
import PendingList from './PendingList';
const KnowledgeBase = () => {
  const {user} = useAuthUser();
  const [data, setData] = useState();
  const [openPending, setOpenPending] = useState();
  function getAllList() {
    axios
      .get(Api.baseUri + '/user-reg/knowledgeBase/getAllByCorporate/APPROVE')
      .then((res) => {
        if (res?.data?.status == '200') {
          setData(res?.data?.data);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        setData([]);
      });
  }

  useEffect(() => {
    getAllList();
  }, []);
  const [open, setOpen] = useState(false);
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Bank Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'title',
            id: 'title',
            title: 'Title',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'ckeditor',
            name: 'solution',
            id: 'solution',
            title: 'Message',
            // infoMessage: ["Radio button is selectable", "e.g.: yes"],
            options: [
              {title: 'Yes', value: 'Yes'},
              {title: 'No', value: 'No'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'autocomplete',
            name: 'category',
            id: 'category',
            title: 'Category',
            options: [
              {title: "SOS", value: "sos"},
              {title: "Feed Back", value: "feed_back"},
              {title: "Support", value: "support"},
              {title: "Safe Reach", value: "sos"},
              {title: "Application-technology", value: "Application-technology"},
              {title: "Over Speeding", value: "over_speeding"},
              {title: "Other", value: "other"},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'file',
            name: 'attachement',
            id: 'attachement',
            title: 'Add Attachement',
            // infoMessage: ["Radio button is selectable", "e.g.: yes"],
            validationProps: {
              size: {
                value: 5,
                message: 'File size should not be more than 5 mb.',
              },
            },
          },
        ],
      },
    ],
  };

  const handleSubmit = (val) => {
    if (val?.button == 'submit') {
      let postData = {
        title: val?.data?.title,
        solution: val?.data?.solution,
        category: val?.data?.category,
        corporateId: user?.userList?.corporateId,
        attachement: '',
      };

      axios
        .post(Api.baseUri + '/user-reg/knowledgeBase/save', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Article added in pending requests successfully');
            getAllList();
            setOpen(false);
          } else {
            toast.success('Something went wrong');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong');
          setOpen(false);
        });
    }
  };
  return (
    <div>
      <Grid container sx={{marginTop: '10px'}}>
        <Grid
          md={12}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <AppTooltip placement={'top'} title={'Add Knowledge Base Article'}>
            <img
              src={'/assets/images/general-information.svg'}
              style={{width: '20px', height: '20px'}}
              onClick={() => {
                setOpen(true);
              }}
            />
          </AppTooltip>

          {/* <AddIcon
            onClick={() => {
              setOpen(true);
            }}
          /> */}

          <AppTooltip
            placement={'top'}
            title={'Pending Requests'}
            sx={{marginLeft: '10px'}}
          >
            <span
              className='title-icons-mui'
              style={{
                display: 'flex',
                alignItems: 'end',
                marginLeft: '10px',
                fontWeight: 600,
              }}
            >
              <PendingActionsIcon
                onClick={() => {
                  setOpenPending(true);
                }}
              />
            </span>
          </AppTooltip>
        </Grid>
        <Grid md={12} sx={{marginTop: '10px'}}>
          <Grid container>
            <Grid container spacing={2}>
              {data?.map((el) => {
                return (
                  <Grid item md={3}>
                    <KnowledgeCard content={el} getAllList={getAllList} />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={open} style={{borderRadius: '4rem'}}>
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                padding: '1.3rem',
              }}
            >
              <h1>Add Article</h1>
              <CloseIcon
                onClick={() => {
                  setOpen(false);
                }}
                style={{
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              <SmartForm
                template={template}
                onSubmit={handleSubmit}
                buttons={['submit']}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Dialog open={openPending} style={{borderRadius: '4rem'}}>
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '60px',
                alignItems: 'center',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
              }}
            >
              <h1>Pending Article</h1>
              <CloseIcon
                onClick={() => {
                  setOpenPending(false);
                }}
                style={{
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '10px'}}>
              <PendingList
                close={() => {
                  setOpenPending(false);
                  getAllList();
                }}
                getAllListApproved={getAllList}
                setOpenPending={setOpenPending}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default KnowledgeBase;
