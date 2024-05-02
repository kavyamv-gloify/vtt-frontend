/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useDispatch, useSelector} from 'react-redux';
import {onAddNewTenent} from 'redux/actions';
import regex from '@regex';
import api from '@api';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import Api from '@api';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {useAuthUser} from '@crema/utility/AuthHooks';
import SmartForm from '@smart-form';
// import {setInitialPath} from 'redux/actions';
const HelpForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams();
  const {user} = useAuthUser();

  // const boardList = useSelector(({ OnboardTenent }) => OnboardTenent.tenentBoardList);
  const [data, setData] = useState({});
  const [showbtn, setshowbtn] = React.useState(true);
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();

  useEffect(() => {
    // alert("hjgk");
    async function fetchData() {
      const baseURL = `${api.onBoardTenant.changeRequest}/${user?.userList?.profileId}`;
      let response = await axios.get(`${baseURL}`);

      setData(response.data.data);
    }
    fetchData();
  }, [user.userList.profileId]);

  //
  // const temp = { "companyName": "My Dummy", "companyCode": "dummy7", "companyAddress": "A25 sector 67 noida", "companyRegNo": "AFDSDAFS412431234", "companyGSTN": "18AABCU9603R1ZM", "companyPAN": "CAXPR4876E", "contactPersonName": "Raj Ranjan", "emailId": "raj@velocis.co.in", "mobileNo": "7290807691", "landLineNo": "8987897987", "accountName": "TEST ", "accountNumber": "8977879879", "bankName": "jlkkljlk", "bankCode": "Sksfld", "branchName": "fklsdjflk sdfhjksal", "ifscCode": "SBIN0002980" }
  let stepperTemplate = {
    layout: {
      type: 'horizontal',
      position: 'center',
      labelPos: 'top',
      maxWidth: '80%',
      margin: '10px 20px',
    },
    description: 'query page',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'autocomplete',
            name: 'query',
            id: 'query',
            title: 'Query',
            disabled: true,
            options: [
              {
                value: {
                  locName: 'Website Issue',
                },
                title: 'Website Issue',
              },
              {
                value: {
                  locName: 'Bangalore',
                },
                title: 'Contact Issue',
              },
              {
                value: {
                  locName: 'Contact Issue',
                },
                title: 'Driver ',
              },
              {
                value: {
                  locName: 'Driver',
                },
                title: 'XYZ',
              },
              {
                value: {
                  locName: 'XYZ Raj',
                },
                title: 'XYZ Raj Raj',
              },
            ],
          },
          {
            type: 'file',
            name: 'logodoc',
            id: 'logodoc',
            title: 'Screen Capture',
            accept: 'image/*,.pdf,.doc,.docx',
            tempFilename: data?.companyLogoDoc?.split('/')[2],
            validationProps: data?.companyLogoDoc
              ? {
                  // required: 'This is a mandatory field',
                  size: {
                    value: 5,
                    message: 'File size should not be more than 5 mb.',
                  },
                }
              : {
                  required: 'This is a mandatory field',
                  size: {
                    value: 5,
                    message: 'File size should not be more than 5 mb.',
                  },
                },
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
        id: 'personal_information1',
        fields: [
          {
            type: 'textarea',
            name: 'material_desc',
            id: 'material_desc',
            title: ' Description',
            validationProps: {
              required: 'This is a mandatory field',
              maxLength: {
                value: 255,
                message: 'Maximum 255 characters are allowed.',
              },
            },
          },
        ],
      },
    ],
  };

  //

  const getFormData = (object) =>
    Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
    }, new FormData());

  const handleChange = (values) => {
    // let dataSet = {};
    // let allElem = {};
    // Object.keys(values).map((key)=>{
    //
    //   if(typeof values[key]?.name == 'string'){
    //     dataSet = {
    //       ...dataSet,
    //       [key]: values[key]
    //     }
    //   }else{
    //     allElem = {
    //       ...allElem,
    //       [key]: values[key]
    //     }
    //   }
    // })
    // dataSet = {
    //   ...dataSet,
    //   data: allElem
    // }
    //
  };
  const handleSubmit = async (values) => {
    //
    setshowbtn(false);
    //  )
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      let allElem = {};
      let tem = values?.data;
      if (tem?.bankNameTemp) delete tem.bankNameTemp;
      if (!tem?.logodoc?.length) delete tem.logodoc;
      if (!tem?.regdoc?.length) delete tem.regdoc;
      if (!tem?.gstndoc?.length) delete tem.gstndoc;
      if (!tem?.pandoc?.length) delete tem.pandoc;
      Object.keys(tem).map((key) => {
        if (typeof tem[key]?.[0]?.name == 'string') {
          dataSet = {
            ...dataSet,
            [key]: tem[key][0],
          };
        } else {
          allElem = {
            ...allElem,
            [key]: tem[key],
          };
        }
      });

      dataSet = {
        ...dataSet,
        data: JSON.stringify(allElem),
      };

      axios({
        method: 'post',
        url: api.onBoardTenant.changeRequest, //will get change after getting API
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == '200') {
            toast.success(
              response?.data?.message ?? 'User updated successfully',
            );
            setshowbtn(true);
            navigate(`/superadmin/table`);
          } else {
            setshowbtn(true);
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
        })
        .catch(function (response) {
          toast.error(response?.data?.message ?? 'Something went wrong');
          setshowbtn(true);
          //handle error
        });
    }
  };

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {/* {data && data.id && ( */}
      <SmartForm
        // defaultValues={data}
        template={stepperTemplate}
        afterSubmit={handleSubmit}
        // buttons={['submit']}
        onChange={handleChange}
        buttons={['Submit']}
      />
      {/* )}  */}
    </>
  );
};

export default HelpForm;
