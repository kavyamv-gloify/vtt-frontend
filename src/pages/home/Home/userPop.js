import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import SmartForm from '@smart-form';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import regex from '@regex';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Api from '@api';
import axios from 'axios';
export default function UserPop(props) {
  //   const { user } = useAuthUser();
  const [shiftList, setShiftlist] = useState([]);
  const [driverList, setDriverlist] = useState([]);
  const [enable, setEnable] = useState(false);
  useEffect(() => {}, [props?.data]);

  useEffect(() => {
    if (!shiftList?.length) {
      let temp = [];
      axios.get(Api.driver.shift).then((res) => {
        res?.data?.data?.map((d) => {
          temp.push({title: d?.shiftName, value: d});
        });
        setShiftlist(temp);
      });
    }
    if (!driverList?.length) {
      let temp = [];
      axios.get(Api.driver.list).then((res) => {
        res?.data?.data?.map((d) => {
          temp.push({title: d?.name, value: d});
        });
        setDriverlist(temp);
      });
    }
  }, []);
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'My Profile',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'userName',
            id: 'userName',
            // options: driverList,
            title: 'User Name',
            defaultValue: props?.data?.userName,
            disabled: true,
          },
          {
            type: 'text',
            name: 'emailId',
            id: 'emailId',
            title: 'Email Id',
            defaultValue: props?.data?.emailId,
            disabled: true,
          },
          {
            type: 'text',
            name: 'mobileNo',
            id: 'mobileNo',
            title: 'Mobile No',
            defaultValue: props?.data?.mobileNo,
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'location',
            id: 'location',
            title: 'Location',
            // defaultValue: props?.data?.mobileNo,
          },
        ],
      },
    ],
  };

  async function enableButton() {
    setTimeout(() => {
      setEnable(null);
    }, 1000);
    setTimeout(() => {
      setEnable(true);
    }, 1000);
  }
  const handleSubmit = async (values) => {
    enableButton();
  };
  const handleCancel = async (values) => {
    handleClose();
  };
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
      >
        <DialogContent>
          <SmartForm
            template={template}
            defaultValues={props}
            success={enable}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            buttons={['submit', 'cancel']}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
