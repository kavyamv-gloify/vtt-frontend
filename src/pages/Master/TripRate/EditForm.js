import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import regex from '@regex';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuthUser} from '@crema/utility/AuthHooks';
const EditForm = () => {
  const [showbtn, setshowbtn] = useState(true);
  const [data, setData] = useState();
  const navigate = useNavigate();
  //
  const {id} = useParams();

  const {user} = useAuthUser();

  useEffect(() => {
    async function fetchData() {
      // alert("dsgdjsg");
      // const baseURL = `http://180.151.3.104:9000//user-reg/rateCard-corp/62c2931ef710017c65de2837`;
      const baseURL = `${Api?.trip?.getsaveRatecard}/${id}`;
      //
      let response = await axios.get(`${baseURL}`);

      setData(response?.data?.data);
    }
    fetchData();
  }, [id]);

  let template = {
    title: 'Trip Rate Edit Details Form',
    layout: {coloum: 1, spacing: 1, size: 'small', label: 'fixed'},
    sections: [
      {
        layout: {column: 1, spacing: 1, size: 'small', label: 'fixed'},
        id: 'personal information',
        fields: [
          {
            type: 'hidden',
            name: 'corporateId',
            id: 'corporateId',
            title: 'Corporate Id',
            // defaultValue: data?.corporateid
          },
          {
            type: 'hidden',
            name: 'corporateName',
            id: 'corporateName',
            title: 'Corporate Name',
            // defaultValue:data?.companyName,
          },
          {
            type: 'hidden',
            name: 'corporateCode',
            id: 'corporateCode',
            title: 'Corporate Code',
            // disabled: true,
            // defaultValue: data?.corporateCode
          },
          {
            type: 'hidden',
            name: 'tenantId',
            id: 'tenantId',
            title: 'TanentId',
            // default:true,
            // defaultValue: data?.tenantId
          },
          {
            type: 'hidden',
            name: 'tenantCode',
            id: 'tenantCode',
            title: 'tanent Code',
            // defaultValue: data?.tanentCode
          },
          {
            type: 'hidden',
            name: 'tenantName',
            id: 'tenantName',
            title: 'tanent Name',
            // defaultValue: data?.tanentName
          },
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
            name: 'tempfromDate',
            id: 'tempfromDate',
            title: 'From Date',
            defaultValue: data?.fromDate,
            min: 'today',
            pattern: {
              value: regex.yearReg,
              message: 'Please enter valid format YYYY',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'date',
            name: 'temptoDate',
            id: 'temptoDate',
            title: 'To Date',

            defaultValue: data?.toDate,
            // min: 'today',
            //   pattern: {
            //       value: regex.yearReg,
            //       message: 'Please enter valid format YYYY'
            //   },

            validationProps: {
              required: 'This is a mandatory field',
              validate: [
                {
                  condition: 'tempfromDate < temptoDate',
                  message: 'From date should not be greater than To date.',
                },
              ],
            },
          },

          {
            type: 'radio',
            name: 'status',
            id: 'status',
            title: 'Status',
            options: [
              {title: 'Active', value: 'ACTIVE'},
              {title: 'Inactive', value: 'INACTIVE'},
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
              spacing: 1,
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
              //     type: "text",
              //     name: "cardType",
              //     id: "cardType",
              //     title: "Card Type",
              //     pattern: {
              //         value: regex.onlyChar,
              //         message: 'Please enter valid name with max 50 characters'
              //       },
              //     validationProps: {
              //         required: 'This is a mandatory field',
              //         maxLength: {
              //             value: 50,
              //             message: 'Maximum 50 characters are allowed.'
              //         }
              //     }
              // },
              {
                type: 'text',
                name: 'fuelType',
                id: 'fuelType',
                title: 'Fuel Type',
                pattern: {
                  value: regex.char50,
                  message: 'Please enter valid Fueltype',
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
                  message: 'Please enter valid Vahicle type',
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
                  message: 'Please enter valid Fuel Price',
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
                  message: 'Please enter Rate per unit with max 50 characters',
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
  const handleSubmit = (values) => {
    setshowbtn(false);

    if (values.button.toUpperCase() === 'UPDATE') {
      let tem = values?.data;
      tem.fromDate = values?.data?.tempfromDate;
      tem.toDate = values?.data?.temptoDate;
      tem.tenantName = user?.userList?.tanentName;
      tem.tenantCode = user?.userList?.tanentCode;
      tem.tenantId = user?.userList?.profileId;
      if (tem?.tempfromDate) delete tem?.tempfromDate;

      if (tem?.temptoDate) delete tem?.temptoDate;

      axios
        .put(Api.trip.getsaveRatecard, tem)
        .then((response) => {
          if (response?.data?.status == '200') {
            navigate(`/Master/TripRate/Table`);
            toast.success(
              response?.data?.message ??
                'Details has been successfully updated.',
            );
          } else {
            toast.error(response?.data?.message ?? 'something wrong');
          }
          setshowbtn(true);
        })
        .catch((err) => {
          toast.error('wrong');
          setshowbtn(true);
        });
    }
  };

  return (
    <>
      {data?.id && (
        <SmartForm
          template={template}
          defaultValues={data}
          showbtn={showbtn}
          buttons={['Update']}
          // setVal={[{ name: "tempfromDate", value: data?.fromDate }, { name: "toDate", value: data?.toDate }]}

          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};
export default EditForm;
