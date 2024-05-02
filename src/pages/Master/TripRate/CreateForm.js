import {useAuthUser} from '@crema/utility/AuthHooks';
import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import axios from 'axios';
import Api from '@api';
import regex from '@regex';
import {toast} from 'react-toastify';
import {useNavigate, useParams} from 'react-router-dom';
import AppLoader from '@crema/core/AppLoader';
// import { useAuthUser } from '@crema/utility/AuthHooks';

const TripForm = () => {
  const {user} = useAuthUser();

  const [showbtn, setshowbtn] = useState(true);
  const [data, setData] = useState({});
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      // alert("fbhdsbfmds");
      const baseURL = `${Api.onBoardCorporate.changeRequest}/${id}`;
      let response = await axios.get(`${baseURL}`);

      setData(response?.data?.data);
    }
    fetchData();
  }, [id]);

  let template = {
    title: 'Trip Rate Form',
    layout: {
      coloum: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal information',
        fields: [
          // {
          //     type: 'hidden',
          //     name: 'tanentId',
          //     id: 'tanentId',
          //     title:'TanentId',
          //     default:true,
          //     defaultValue: data?.tenantId
          // },
          // {
          //     type: 'hidden',
          //     name: 'tanentCode',
          //     id: 'tanentCode',
          //     title: 'tanent Code',
          //     defaultValue: data?.tanentCode
          // },
          // {
          //     type: 'hidden',
          //     name: 'tanentName',
          //     id: 'tanentName',
          //     title: 'tanent Name',
          //     defaultValue: data?.tanentName
          // },

          {
            type: 'text',
            name: 'cardType',
            id: 'cardType',
            title: 'Card Type',
            pattern: {
              value: regex.onlyChar,
              message: 'Please enter valid Card type with max 50 characters',
            },
            validationProps: {
              required: 'This field is mandatory',
            },
          },

          {
            type: 'date',
            name: 'fromDate',
            id: 'fromDate',
            title: 'From Date',
            validationProps: {
              required: 'This field is mandatory',
            },
          },

          {
            type: 'date',
            name: 'toDate',
            id: 'toDate',
            title: 'To Date',
            validationProps: {
              required: 'This is a mandatory field',
              validate: [
                {
                  condition: 'fromDate < toDate',
                  message: 'From date should not be greater than To date.',
                },
              ],
            },
            // dynamic: {
            //   field: 'polutionStatus',
            //   value: 'Yes'
            // },
            // validationProps: {
            //   required: 'This is a mandatory field'
            // }
          },

          {
            type: 'radio',
            name: 'status',
            id: 'status',
            title: 'Status',
            options: [
              {title: 'ACTIVE', value: 'ACTIVE'},
              {title: 'INACTIVE', value: 'INACTIVE'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'array',
            name: 'slabs',
            id: 'slabs',
            layout: {
              column: 1,
              spacing: 2,
              size: 'small',
              label: 'blank',
              type: 'table',
            },
            columns: [
              'Fuel Type',
              'Vehicle Type',
              'Minimum Fuel Price',
              'Maximum Fuel Price',
              'Rate',
              'Rate Unit',
            ],
            subFields: [
              // {
              //     type: "hidden",
              //     name: "cardType",
              //     id: "cardType",
              //     title: "Card Type",
              //     // defaultValue: ""
              //     // pattern: {
              //     //     value: regex.onlyChar,
              //     //     message: 'Please enter valid name with max 50 characters'
              //     //   },
              //     // validationProps: {
              //     //     required: 'This is a mandatory field',
              //     //     maxLength: {
              //     //         value: 50,
              //     //         message: 'Maximum 50 characters are allowed.'
              //     //     }
              //     // }
              // },
              {
                type: 'text',
                name: 'fuelType',
                id: 'fuelType',
                title: 'Fuel Type',
                pattern: {
                  value: regex.char50,
                  message:
                    'Please enter valid Fuel type with max 50 characters',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                  maxLength: {
                    value: 50,
                    message: 'Maximum 50 characters are allowed.',
                  },
                },
              },
              {
                type: 'text',
                name: 'vehicleType',
                id: 'vehicleType',
                title: 'Vehicle Type',
                pattern: {
                  value: regex.char50,
                  message:
                    'Please enter valid Vehicle type with max 50 characters',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                  maxLength: {
                    value: 50,
                    message: 'Maximum 50 characters are allowed.',
                  },
                },
              },
              {
                type: 'text',
                name: 'minFuelPrice',
                id: 'minFuelPrice',
                title: 'Min. Fuel Price',
                pattern: {
                  value: regex.amountReg,
                  message: 'Please enter valid  Fuel Price',
                },

                validationProps: {
                  required: 'This is a mandatory field',
                  maxLength: {
                    value: 50,
                    message: 'Maximum 50 characters are allowed.',
                  },
                },
              },

              {
                type: 'text',
                name: 'maxFuelPrice',
                id: 'maxFuelPrice',
                title: 'Mix. Fuel Price',
                validationProps: {
                  required: 'This is a mandatory field',
                  validate: [
                    {
                      condition: 'minFuelPrice < maxFuelPrice',
                      mytype: 'number',
                      message:
                        'Minimum Fuel Price should not be greater than Maximum Fuel Price.',
                    },
                  ],
                },
              },
              {
                type: 'text',
                name: 'rate',
                id: 'rate',
                title: 'Rate',
                pattern: {
                  value: regex.amountReg,
                  message: 'Please enter valid Rate',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                  maxLength: {
                    value: 50,
                    message: 'Maximum 50 characters are allowed.',
                  },
                },
              },
              {
                type: 'text',
                name: 'rateUnit',
                id: 'rateUnit',
                title: 'Rate Unit',
                pattern: {
                  value: regex.onlyChar,
                  message:
                    'Please enter valid Rate per unit with max 50 characters',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                  maxLength: {
                    value: 50,
                    message: 'Maximum 50 characters are allowed.',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    //

    // return;
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      // let dataSet = {};
      // dataSet = values?.data;
      // dataSet.tenantId= values?.data?.tenantId
      let val = values?.data;
      // val.tenantId = data?.tanentId;
      // val.tenantCode = data?.tanentCode;
      // val.tenantName = data?.tanentName;

      let tem = values?.data;
      tem.corporateId = data?.corporateid;
      tem.corporateCode = data?.companyCode;
      tem.corporateName = data?.companyName;
      tem.tenantName = user?.userList?.tanentName;
      tem.tenantId = user?.userList?.tanentId;
      tem.tenantCode = user?.userList?.tanentCode;

      axios
        .post(Api.trip.saveRatecard, tem)
        .then((response) => {
          if (response?.data?.status == '200') {
            navigate(`/Master/TripRate/Table`);
            toast.success(
              response?.data?.message ??
                'Details has been successfully submitted.',
            );
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch((er) => {
          setshowbtn(true);
          toast.error('Something wenttttt wrong');
        });
    }
  };
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <SmartForm
        // defaultValue={data}
        template={template}
        buttons={['Submit']}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default TripForm;
