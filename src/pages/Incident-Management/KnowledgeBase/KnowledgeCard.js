import React, {useState} from 'react';
import {Grid, Box} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import parse from 'html-react-parser';
import AppTooltip from '@crema/core/AppTooltip';
import EditIcon from '@mui/icons-material/Edit';
import SmartForm from '@smart-form';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Api from '@api';
import {toast} from 'react-toastify';
const KnowledgeCard = ({content, getAllList}) => {
  const {user} = useAuthUser();
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
            type: 'text',
            name: 'category',
            id: 'category',
            title: 'Category',
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
  function handleSubmit(val) {
    let postData = {
      id: content?.id,
      title: val?.data?.title,
      solution: val?.data?.solution,
      category: val?.data?.category,
      corporateId: user?.userList?.corporateId,
      attachement: '',
    };

    axios
      .put(Api.baseUri + '/user-reg/knowledgeBase/update', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Article updated successfully');
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
  return (
    <div>
      <Grid container>
        <Grid item md={12}>
          <Box
            sx={{
              borderRadius: '8px',
              padding: '10px',
              background: 'white',
              border: '1px solid rgba(224, 224, 224, 1)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                // marginBottom: '20px',
              }}
            >
              <Avatar
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  // p: {xs: 3, xl: 4},
                  // mb: {xs: 4, md: 5},
                  m: '0',
                  mr: 2,
                  marginBottom: '10px',
                  height: 36,
                  width: 36,
                  //   backgroundColor: bgColor ?? 'pink',
                }}
              ></Avatar>

              <Box
                sx={{
                  marginBottom: '10px',
                  fontWeight: '900',
                  fontSize: '14px',
                }}
              >
                {content?.category}
              </Box>
            </Box>
            {/* <AppTooltip placement={'top'}> */}{' '}
            <Box sx={{marginTop: '10px', height: '250px', overflowY: 'auto'}}>
              {content?.solution?.length ? parse(content?.solution) : ' '}
            </Box>{' '}
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
              <EditIcon
                onClick={() => {
                  setOpen(true);
                }}
              />
            </Box>
            {/* </AppTooltip> */}
          </Box>
        </Grid>
      </Grid>

      <Dialog open={open} style={{borderRadius: '4rem'}}>
        <div>
          <DialogContent style={{padding: '0px', alignItems: 'center'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
              }}
            >
              <h1>Update Article</h1>
              <CloseIcon
                onClick={() => {
                  setOpen(false);
                }}
                style={{
                  // marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              <SmartForm
                template={template}
                defaultValues={content}
                onSubmit={handleSubmit}
                buttons={['update']}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default KnowledgeCard;
