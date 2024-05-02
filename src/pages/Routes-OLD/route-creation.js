import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import Map from './testmap';
import {split} from 'lodash';
import Api from '@api';

const CreateForm = () => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const {user} = useAuthUser();
  const [open, setOpen] = useState();
  const [shiftList, setshiftList] = useState([]);
  const [vehicleList, setvehicleList] = useState([]);
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [formObj, setformObj] = useState({});
  const [assignedEmp, setAssignedEmp] = useState([]);
  useEffect(() => {
    axios
      .get(Api?.masters?.getallShift)
      .then((res) => {
        if (res?.data?.data?.length) {
          let tem = [];
          res?.data?.data?.map((n) => {
            tem.push({
              title: n.shiftName + ' - ' + n.shiftStart + ' to ' + n.shiftEnd,
              value: n.id,
            });
          });
          setshiftList(tem);
        } else {
          setshiftList([]);
        }
      })
      .catch((err) => {
        setshiftList([]);
      });
    axios
      .get(api.masterVehicletype.list)
      .then((res) => {
        if (res?.data?.data?.length) {
          let temarr = [];
          res?.data?.data?.map((r) => {
            temarr.push({title: r.vehicleType, value: r});
          });
          setVehicleTypeList(temarr);
        }
      })
      .catch((err) => {});
  }, []);
  useEffect(() => {
    axios
      .get(Api?.vehicle?.list)
      .then((res) => {
        if (res?.data?.data?.length) {
          let tem = [];
          res?.data?.data?.map((n) => {
            if (
              n.vehicleType?.toUpperCase() == formObj?.vehicleType.toUpperCase()
            ) {
              tem.push({
                title: `${n.vehicleBrand} (${n.vehicleColor}) - ${
                  n.vehicleNumberPlate ?? 'NA'
                }`,
                value: n.id + '==CONCAT==' + n.seatCapacity,
              });
            }
          });
          setvehicleList(tem);
        } else {
          setvehicleList([]);
        }
      })
      .catch((err) => {
        setvehicleList([]);
      });
  }, [formObj?.vehicleType]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Create Route',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'autocomplete',
            name: 'shiftId',
            id: 'shiftId',
            title: 'Shift',
            multilimit: 2,
            multiple: true,
            options: shiftList,
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          // {
          //     type: 'number',
          //     name: 'radius',
          //     id: 'radius',
          //     title: "Radius in KM",
          //     defaultValue:10,
          //     validationProps: {
          //         required: 'This is a mandatory field'
          //     }
          // },
          {
            type: 'text',
            name: 'corporateId',
            id: 'corporateId',
            title: 'Corporate Name',
            defaultValue: 'Velocis Systems Pvt. Ltd.',
            disabled: true,
          },
          {
            type: 'text',
            name: 'siteId',
            id: 'siteId',
            title: 'Site Office',
            defaultValue: 'A-25, Noida Sec-67',
            disabled: true,
          },
          {
            type: 'autocomplete',
            name: 'vehicleType',
            id: 'vehicleType',
            title: 'Vehicle Type',
            options: vehicleTypeList,
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          // {
          //     type: 'autocomplete',
          //     name: 'vehicle',
          //     id: 'vehicle',
          //     title: "Select Vehicle",
          //     options: vehicleList,
          //     // options: [{title:"Swift DZire - DL29R 6021", value:"CAR1034"}, {title:"Alto K10 - DL29R 0021", value:"CAR1234"}],
          //     validationProps: {
          //         required: 'This is a mandatory field'
          //     }
          // },
          {
            type: 'text',
            name: 'noOfSeat',
            id: 'noOfSeat',
            title: 'No of Seat',
            defaultValue: '0',
            disabled: true,
          },
          {
            type: 'text',
            name: 'countOfEmp',
            id: 'countOfEmp',
            title: 'Total Number of Employees',
            disabled: true,
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },
          {
            type: 'text',
            name: 'tripStartTime',
            id: 'tripStartTime',
            title: 'Trip Start Time',
            pattern: {
              value: regex.time12HR,
              message:
                'Please enter valid time in hh:mm format (e.g.: 09:30 AM, 09:30 am)',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'tripEndTime',
            id: 'tripEndTime',
            title: 'Trip End Time',
            pattern: {
              value: regex.time12HR,
              message:
                'Please enter valid time in hh:mm format (e.g.: 06:30 PM, 06:30 pm)',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    let empArr = [];
    assignedEmp?.map((n) => {
      if (n < formObj?.vehicleType?.vehicleOccupancy) {
        empArr.push(n);
      }
    });
    let postValue = {
      corporateId: '62fcc92af53dac044ce5376d',
      siteId: '62fcc797f53dac044ce5376c',
      employeeByVehicleTypeDto: [
        {
          empid: '62e8c55520093d498eed7315',
          employeename: 'suraj',
          latitude: '25.000',
          longitude: '25.00',
          locName: 'noida',
          index: '0',
        },
        {
          empid: '62e8c55520093d498eed7316',
          employeename: 'SR',
          latitude: '25.000',
          longitude: '25.00',
          locName: 'ABCD',
          index: '1',
        },
      ],
      isFemale: 'YES',
      vehicleTypeId: '62fcd185c8b07618cc873c01',
      tripEndTime: '06:30 PM',
      tripStartTime: '09:30 AM',
      shiftId: '62fb2c0cca4b8b5ce2c19805',
      escortId: '62fccc98f53dac044ce5376f',
    };

    axios
      .post(Api?.routes?.create + '/generateroutes', postValue)
      .then((res) => {
        if (res?.data?.status == 200) {
          toast.success('Route created Successully');
          navigate('/route-listing');
        }
      });
    // setshowbtn(false);
    // setshowbtn(false)
    // if (values.button.toUpperCase() === "SUBMIT") {
    //     let dataSet = {};
    //     dataSet = values.data
    //     axios.post(api.masterBank.createform, dataSet).then((response) => {
    //         if (response?.data?.status == "200") {
    //             navigate('/Master/bank/table')
    //             toast.success(response?.data?.message ?? "Created successfully");
    //         } else {
    //             toast.error(response?.data?.message ?? "Something went wrong");
    //         };
    //         setshowbtn(true);
    //     }).catch((er) => {
    //         setshowbtn(true);
    //         toast.error("Something went wrong");
    //     })
    // };
  };
  function myGetData(val) {
    if (
      val?.shiftId != formObj?.shiftId ||
      val?.vehicleType != formObj?.vehicleType ||
      val.radius != formObj.radius
    ) {
      setformObj({
        shiftId: val.shiftId,
        vehicleType: val.vehicleType,
        vehicle: val.vehicle,
        radius: val.radius,
      });
    }
  }
  function getAssignees(data) {
    // let tem = ''
    // if(data?.length){
    //     data?.map((d,ind)=>{
    //         tem.push(d)
    //     })
    // }
    setAssignedEmp(data);
  }
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <SmartForm
        template={template}
        onSubmit={handleSubmit}
        getOnInput={myGetData}
        buttons={['Create Route']}
        setVal={[
          {name: 'countOfEmp', value: assignedEmp?.length},
          {name: 'noOfSeat', value: formObj?.vehicleType?.vehicleOccupancy},
        ]}
      />
      {formObj.shiftId ? (
        <Map getAssignees={getAssignees} radius={formObj.radius} />
      ) : null}
      {/* <SnackbarCustom BooleanValue={boolean} open={open} onChange={handleChange}>{snackbarMsg}</SnackbarCustom> */}
    </>
  );
};

export default CreateForm;
