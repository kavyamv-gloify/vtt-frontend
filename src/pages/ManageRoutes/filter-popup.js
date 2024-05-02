import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import regex from '@regex';
import React from 'react';
import SmartForm from '@smart-form';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const FilterPop = ({open, handleClose, cnfMsg, header}) => {
  // const icon1 = () => {return(

  // )}
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    // filtertype:"POP",
    //  margin-top: -30px;
    // background: #31bc7b;
    // border-radius: 20px;
    // width: 113px;
    sections: [
      {
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'empid',
            id: 'empid',
            title: 'Employee ID',
            inputiconurl: '/assets/images/login_icon.png',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'empname',
            id: 'empname',
            inputiconurl: '/assets/images/login_icon.png',
            title: 'Employee Name',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'tripid',
            id: 'tripid',
            inputiconurl: '/assets/images/logout_icon.png',
            title: 'Trip ID',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'gender',
            id: 'gender',
            inputiconurl: '/assets/images/login_icon.png',
            title: 'Gender',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'emailid',
            id: 'emailid',
            inputiconurl: '/assets/images/login_icon.png',
            title: 'Email Id',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'code',
            id: 'code',
            inputiconurl: '/assets/images/login_icon.png',
            title: 'Mobile No',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
        ],
      },
    ],
  };
  return (
    <div>
      <Dialog
        className='yourClassName'
        fullWidth
        open={open}
        onClose={() => {
          handleClose('NO');
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{fontSize: '20px', background: '#ededed', color: '#343434'}}
        >
          Filters
        </DialogTitle>
        <DialogContent style={{padding: '10px 40px 25px 40px'}}>
          <DialogContentText
            id='alert-dialog-description'
            style={{display: 'flex'}}
          >
            <SmartForm
              template={template}
              onSubmit={(e) => {
                handleClose(e);
              }}
              buttons={['apply']}
              filterbtnStyle={{
                marginTop: '-30px',
                background: '#31bc7b',
                borderRadius: '20px',
                width: '113px',
              }}
            />
          </DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button id='btnMui123'  onClick={(e)=>{handleClose("YES")}} >Yes</Button>
          <Button id='btnMui123' onClick={(e)=>{handleClose("NO")}}>No</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
};

export default FilterPop;
