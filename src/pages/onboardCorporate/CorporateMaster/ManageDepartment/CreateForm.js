import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import Api from '@api';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';

const CreateForm = ({close}) => {
  const [showbtn, setshowbtn] = React.useState(true);
  const [shifts, setShifts] = useState();
  const {user} = useAuthUser();
  const [managerList, setManagerList] = useState();
  const id = user.userList.profileId;
  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  useEffect(() => {
    const baseURL = `${Api.manageshifts.getlistbyCorporate}corporateId?page=0&size=10000&shiftName=null`;
    let temAr = [];
    axios
      .get(baseURL)
      .then((response) => {
        response?.data?.data?.body['ShiftList']?.map((r) => {
          temAr.push({
            title: r.shiftName + '(' + r.shiftStart + '-' + r.shiftEnd + ')',
            value: r?.id,
          });
        });
        setShifts(temAr);
      })
      .catch((er) => {});
  }, [id]);

  useEffect(() => {
    getManager();
  }, []);

  async function getManager() {
    let res = await axios.get(
      `${Api.baseUri}/user-reg/employee-reg/fetch/` + id,
    );

    let temp = [];
    if (res?.data?.data?.length) {
      res?.data?.data?.map((e) => {
        temp.push({title: e.employeeFullName, value: e?.id});
      });
    }
    setManagerList(temp);
  }

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Department type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'hidden',
            name: 'corporateId',
            id: 'corporatedId',
            title: 'corporate Id',
            // defaultValue: user?.userList?.profileId
            defaultValue: CorpId,
          },
          {
            type: 'hidden',
            name: 'tenantId',
            id: 'tenantId',
            title: 'tenantId',
            defaultValue: user?.userList?.tanentId,
          },
          {
            type: 'text',
            name: 'departmentName',
            id: 'departmentName',
            title: 'Name',
            infoMessage: [
              'Alphanumerics are allowed',
              'Maximum length should be 50 characters',
              'e.g.: Software',
            ],
            pattern: {
              value: regex.maxSize50,
              message: 'Please enter alphabets with max 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'autocomplete',
            name: 'shifts',
            id: 'shifts',
            title: 'Shifts',
            multiple: true,
            infoMessage: ['Dropdown values are selectable', 'e.g.:Morning'],
            validationProps: {
              required: 'This is a mandatory field',
            },
            options: shifts ?? [],
          },
          {
            type: 'text',
            name: 'description',
            id: 'description',
            title: 'Description',
            infoMessage: [
              'Alphanumerics are allowed',
              'Maximum length should be 150 characters',
              'e.g.: We need to corporate this. etc.',
            ],
            pattern: {
              value: regex.maxSize150,
              message: 'Please enter valid description and below 50 characters',
            },
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);
    console.log('values', values);

    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;
      let temArr = [];
      dataSet?.shifts?.map((te) => {
        temArr.push(te?.value);
      });
      dataSet.shifts = temArr;
      managerList?.map((man) => {
        if (man?.value == dataSet?.managerId) {
          dataSet.managerName = man?.title;
        }
      });
      console.log('dataSet', dataSet);

      axios
        .post(Api.masters.getallDept, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(
              `${response?.data?.data?.departmentName} created successfully`,
            );
            // toast.success('Department created successfully');
            close(false);
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch((er) => {
          setshowbtn(true);
          toast.error('Something went wrong');
        });
    }
  };

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <SmartForm
        template={template}
        onSubmit={handleSubmit}
        buttons={['submit']}
        mode='onTouched'
      />
    </>
  );
};
export default CreateForm;
