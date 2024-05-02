import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SmartForm from '@smart-form';
import { useAuthUser } from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import { toast } from 'react-toastify';
import Api from '@api';

const Assign = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({});
    const [vendorList, setVendorList] = useState();
useEffect(()=>{
    // axios.get('http://180.151.3.104:9000/user-reg/vendor-reg').then(resp=>{
    //     res
    // })
    axios.get(`${Api?.routes?.create}/62fbaabc70e38741ca6abd92/id`).then((res)=>{
        let tem = res?.data?.data;
        tem.vehicleType = "Mini";
        // tem.totalEmpCount = employeeByVehicleTypeDto?.length;
        tem.escortName = "Yash";
        tem.totalEmpCount = 4;
        setFormData(res?.data?.data);
    })
},[id])
  const navigate=useNavigate()
  let template = {
    layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
    title: 'Assign to Vendor',
    description: 'Form for applying Job',
    sections: [
      {
        layout: { column: 3, spacing: 2, size: 'small', label: 'fixed' },
        id: 'personal_information',
        fields: [

          {
            type: 'autocomplete',
            name: 'vendor',
            id: 'vendor',
            title: 'Select Vendor',
            options:[{title:"Raj Tripathi", value:"RAJ"},{title:"Ramesh Raghvan", value:"RR"},{title:"Saurav", value:"SRR"}],
            validationProps: {
              required: 'This is a mandatory field'
            }
          },
          {
            type: 'text',
            name: 'siteOfficeName',
            id: 'siteOfficeName',
            title: "Site Office Name",
            disabled:true,
            // pattern: {
            //   value: regex.amountReg,
            //   message: 'Please enter number only'
            // },
            validationProps: {
              required: 'This is a mandatory field'
            }
          },
          {
            type: 'text',
            name: 'routeName',
            id: 'routeName',
            title: "Route Name",
            disabled:true,
            // pattern: {
            //   value: regex.amountReg,
            //   message: 'Please enter number only'
            // },
            validationProps: {
              required: 'This is a mandatory field'
            }
          },
          {
            type: 'text',
            name: 'vehicleType',
            id: 'vehicleType',
            title: "Vehicle Type",
            disabled:true,
            // pattern: {
            //   value: regex.amountReg,
            //   message: 'Please enter number only'
            // },
            validationProps: {
              required: 'This is a mandatory field'
            }
          },
          {
            type: 'text',
            name: 'totalEmpCount',
            id: 'totalEmpCount',
            title: "Seat Occupied",
            disabled:true,
            // pattern: {
            //   value: regex.amountReg,
            //   message: 'Please enter number only'
            // },
            validationProps: {
              required: 'This is a mandatory field'
            }
          },
          {
            type: 'text',
            name: 'isFemale',
            id: 'isFemale',
            title: "Female Available",
            disabled:true,
            // pattern: {
            //   value: regex.amountReg,
            //   message: 'Please enter number only'
            // },
            validationProps: {
              required: 'This is a mandatory field'
            }
          },
          {
            type: 'text',
            name: 'escortName',
            id: 'escortName',
            title: "Escort Name",
            disabled:true,
            // pattern: {
            //   value: regex.amountReg,
            //   message: 'Please enter number only'
            // },
            validationProps: {
              required: 'This is a mandatory field'
            }
          },
          {
            type: 'text',
            name: 'tripStartTime',
            id: 'tripStartTime',
            title: "Trip Start Time",
            disabled:true,
            // pattern: {
            //   value: regex.amountReg,
            //   message: 'Please enter number only'
            // },
            validationProps: {
              required: 'This is a mandatory field'
            }
          },
          {
            type: 'text',
            name: 'tripEndTime',
            id: 'tripEndTime',
            title: "Trip End Time",
            disabled:true,
            // pattern: {
            //   value: regex.amountReg,
            //   message: 'Please enter number only'
            // },
            validationProps: {
              required: 'This is a mandatory field'
            }
          },
        ]
      },
    ]
  };

  const handleSubmit = async (values) => {

  }

  return (
    <>
      {formData?.id && <SmartForm
        template={template}
        defaultValues={formData}
        onSubmit={handleSubmit}
        buttons={['Assign Trip']}
      />}
    </>
  );
};

export default Assign;