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

const AssignToVehicle = ({
  selectedItems,
  setOpen,
  setAction,
  getAllList,
  selectedData,
  close,
}) => {
  const {user} = useAuthUser();
  const [vehicleList, setVehicleList] = useState([]);
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
            name: 'selectedVehicle',
            id: 'selectedVehicle',
            title: 'Select Vehicle',
            options: vehicleList ?? [],
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
      .get(
        // `${Api.vehicle.list}/${selectedData?.vendorId}/vendor/null/vehiclenumberplate`,
        Api.baseUri +
          `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${user?.userList?.corporateId}&vendorId=${selectedData?.vendorId}`,
      )
      .then((res) => {
        let temArr = [];
        console.log('res', res);
        res?.data?.data?.length &&
          res?.data?.data?.map((el) => {
            temArr.push({title: el?.vehicleNo, value: el?.vehicleId});
          });
        // let sortedProducts = temArr.sort((p1, p2) =>
        //   new Date(p1.createdOn) < new Date(p2.createdOn)
        //     ? 1
        //     : new Date(p1.createdOn) > new Date(p2.createdOn)
        //     ? -1
        //     : 0,
        // );
        setVehicleList(temArr ?? []);
      })
      .catch((err) => {
        setVehicleList([]);
      });
  }, []);

  // function handleSubmit(values) {
  //     let postDataassign = { "tripId": selectedItems?.[0], "vehicleId": values?.data?.selectedVehicle }
  //     let postDataReassign = { "id": selectedItems?.[0], "vehicleId": values?.data?.selectedVehicle }
  //
  //     vehicleList?.map(el => {
  //         //
  //         if (el?.value == postDataassign.vehicleId) { postDataassign.vehicleNo = el?.title }
  //     })

  //     vehicleList?.map(el => {
  //         //
  //         if (el?.value == postDataReassign.vehicleId) { postDataReassign.vehicleNo = el?.title }
  //     })
  //     // axios.post(setAction == "assign" ? Api.baseUri + '/user-reg/trip-route/assign-trips-to-driver' : Api.baseUri + '/user-reg/trip-route/reAllocate-vehicle', setAction == "assign" ? postDataassign : postDataReassign).then(res => {
  //     //     if (res?.data?.status == '200') { toast.success(res?.data?.message ?? "Success") }
  //     //     else { toast.error(res?.data?.message ?? "Failed") }
  //     //     getAllList();
  //     // }).catch(err => {
  //     //     toast.error("Something went wrong.");
  //     // })
  //     setOpen(false);
  // }

  function handleSubmit(values) {
    // if(values.buttons)

    let postDataassign = {
      tripId: selectedData?.id,
      vehicleId: values?.data?.selectedVehicle,
    };

    vehicleList?.map((el) => {
      if (el?.value == postDataassign.vehicleId) {
        postDataassign.vehicleNo = el?.title;
      }
    });
    let postDataReassign = {
      id: selectedData?.id,
      vehicleId: values?.data?.selectedVehicle,
    };

    vehicleList?.map((el) => {
      if (el?.value == postDataReassign.vehicleId) {
        postDataReassign.vehicleNo = el?.title;
      }
    });
    if (
      selectedData?.vehicleNo == 'Not Assigned' ||
      selectedData?.vehicleStatus == 'NONE'
    ) {
      axios
        .post(
          Api.baseUri + '/user-reg/trip-route/assign-trips-to-driver',
          postDataassign,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Vehicle Assigned Successfully');
          } else {
            toast.error(res?.data?.message ?? 'Failed');
          }
          getAllList();
          close();
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    }

    if (
      selectedData?.vehicleNo !== 'Not Assigned' ||
      selectedData?.vehicleStatus !== 'NONE'
    ) {
      axios
        .post(
          Api.baseUri + '/user-reg/trip-route/reAllocate-vehicle',
          postDataReassign,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Vehicle Reassigned Successfully');
          } else {
            toast.error(res?.data?.message ?? 'Failed');
          }
          getAllList();
          close();
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    }
  }
  return (
    <>
      <Dialog
        open={true}
        onClose={() => {
          close();
        }}
      >
        <DialogTitle
          style={{background: '#f5f2f2', padding: '20px 55px 13px 15px'}}
        >
          <Typography
            component='h2'
            variant='h2'
            sx={{mb: 3}}
            id='alert-dialog-title'
          >
            {selectedData?.vehicleNo == 'Not Assigned'
              ? 'Allocate Vehicle'
              : 'Re-allocate Vehicle'}
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
              close();
            }}
            buttons={['submit', 'cancel']}
          />
          {/* <p onCancel={() => {  setOpen(false); }}>Shreya</p> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignToVehicle;
