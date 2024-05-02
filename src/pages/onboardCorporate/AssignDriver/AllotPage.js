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
export default function MyDial(props) {
  const {user} = useAuthUser();
  const [shiftList, setShiftlist] = useState([]);
  const [driverList, setDriverlist] = useState([]);
  const [enable, setEnable] = useState(false);
  useEffect(() => {}, [props?.val]);

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
    title: 'Allot Driver',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'autocomplete',
            name: 'driverId',
            id: 'driverId',
            options: driverList,
            title: 'Select Driver',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'autocomplete',
            name: 'shiftName',
            id: 'shiftName',
            title: 'Shift Name',
            options: shiftList,
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'date',
            name: 'fromDate',
            id: 'fromDate',
            title: 'From Date',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'date',
            name: 'toDate',
            id: 'toDate',
            title: 'To Date',
            validationProps: {
              required: 'This is a mandatory field',
            },
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
    // handleClose();
    let tempReq = {};

    tempReq.driverId = values?.data?.driverId?.id;
    tempReq.driverName = values?.data?.driverId?.name;
    tempReq.shiftName = values?.data?.shiftName?.shiftName;
    tempReq.shiftName = values?.data?.shiftName?.shiftName;
    tempReq.fromTime = values?.data?.shiftName?.fromTime;
    tempReq.fromTimeHr = values?.data?.shiftName?.fromTimeHr;
    tempReq.fromTimeMin = values?.data?.shiftName?.fromTimeMin;
    tempReq.toTime = values?.data?.shiftName?.toTime;
    tempReq.toTimeHr = values?.data?.shiftName?.toTimeHr;
    tempReq.toTimeMin = values?.data?.shiftName?.toTimeMin;
    tempReq.status = 'Active';
    tempReq.vehicleId = props?.val?.id;
    tempReq.vehicleNumber = props?.val?.regNumber;
    tempReq.tanentId = user?.userList?.tanentId;
    tempReq.tanentCode = user?.userList?.tanentCode;
    tempReq.tanentName = user?.userList?.tanentName;
    tempReq.fromDate = user?.userList?.fromDate;
    tempReq.toDate = user?.userList?.toDate;

    let res = await axios.post(Api.driver.driverMap, tempReq);

    if (res?.status == 200) {
      handleClose();
    }
    enableButton();
  };
  const handleCancel = async (values) => {
    handleClose();
  };
  const [open, setOpen] = React.useState(false);

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
