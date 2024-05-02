import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import {useNavigate, useParams} from 'react-router-dom';
import Api from '@api';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import IntlMessages from '@crema/utility/IntlMessages';
import SmartForm from '@smart-form';
import {toast} from 'react-toastify';

const AssignToVendor = ({selectedItems, setOpen, setAction}) => {
  const {user} = useAuthUser();
  const [vendorList, setVendorList] = useState([]);

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
            name: 'selectedVendor',
            id: 'selectedVendor',
            title: 'Select Vendor',
            options: vendorList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };
  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/associatevendor/getallassociatecorporateId')
      .then((re) => {
        let temArr = [];
        re?.data?.data?.length &&
          re?.data?.data?.map((el) => {
            if (el?.vendor)
              temArr.push({
                title: el?.vendor?.vendorName,
                value: el?.vendor?.id,
              });
          });
        let sortedProducts = temArr.sort((p1, p2) =>
          new Date(p1.createdOn) < new Date(p2.createdOn)
            ? 1
            : new Date(p1.createdOn) > new Date(p2.createdOn)
            ? -1
            : 0,
        );

        setVendorList(sortedProducts ?? []);
      });
  }, []);

  function handleSubmit(values) {
    let postData = {
      tripIds: selectedItems,
      vendorId: values?.data?.selectedVendor,
    };

    let postDatareallocate = {
      id: selectedItems?.[0],
      vendorId: values?.data?.selectedVendor,
    };
    vendorList?.map((el) => {
      if (el?.value == postDatareallocate.vendorId) {
        postDatareallocate.vendorName = el?.title;
      }
    });

    axios
      .post(
        setAction == 'Assign Vendor'
          ? Api?.routes?.assignToVendor
          : Api.baseUri + '/user-reg/trip-route/reAllocate-vendor',
        setAction == 'Assign Vendor' ? postData : postDatareallocate,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setAction == 'Assign Vendor'
            ? toast.success('Vendor Assigned Successfully')
            : toast.success('Vendor Ressigned Successfully');
        } else {
          toast.error(res?.data?.message ?? 'Failed');
        }
        setOpen(false);
      })
      .catch((err) => {
        toast.error('Something went wrong.');
      });
    setOpen(false);
  }
  return (
    <>
      <Dialog open={true} onClose={() => setOpen(false)}>
        <DialogTitle
          style={{background: '#f5f2f2', padding: '20px 55px 13px 15px'}}
        >
          <Typography
            component='h4'
            variant='h4'
            sx={{mb: 3}}
            id='alert-dialog-title'
          >
            {setAction}
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{color: 'text.secondary', fontSize: 14, minWidth: '500px'}}
          id='alert-dialog-description'
        >
          <SmartForm
            template={template}
            onSubmit={handleSubmit}
            onCancel={() => {
              setOpen(false);
            }}
            buttons={['submit', 'cancel']}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignToVendor;
