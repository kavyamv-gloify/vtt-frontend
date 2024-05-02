import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuthUser} from '@crema/utility/AuthHooks';
import PopEdit from '@editpopup';
import regex from '@regex';

const EditForm = ({id, popBTNClick, openDialog}) => {
  const [showbtn, setshowbtn] = useState(true);
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [shifts, setShifts] = useState();
  const {user} = useAuthUser();
  const [manager, setManagerList] = useState();
  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  const profileId = user.userList.profileId;
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
        setShifts(temAr ?? []);
      })
      .catch((er) => {
        setShifts([]);
      });

    async function fetchData() {
      const baseURL = `${Api.department.list}/${id}`;
      let response = await axios.get(`${baseURL}`);

      if (response?.data?.data?.length) {
        let temObj = response?.data?.data[0];
        // temObj.shifts = temObj.shifts.toString();
        setData(temObj);
      }
    }
    fetchData();
  }, [id]);

  // useEffect(() => {
  //   async function getManager() {
  //     //
  //     axios
  //       .get(`${Api.baseUri}/user-reg/employee-reg/fetch/` + profileId)
  //       .then((res) => {
  //         let temp = [];
  //         if (res?.data?.data?.length) {
  //           res?.data?.data?.map((e) => {
  //             temp.push({title: e.employeeFullName, value: e?.id});
  //           });
  //         }
  //         setManagerList(temp ?? []);
  //       })
  //       .catch((err) => {
  //         setManagerList([]);
  //       });
  //   }
  //   getManager();
  // }, [id]);

  let template = {
    title: 'Update Department Details',
    layout: {
      coloum: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // sections: [
    //   {
    //     layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
    //     id: 'personal information',
    fields: [
      {
        type: 'hidden',
        name: 'corporateId',
        id: 'corporatedId',
        title: 'corporate Id',
        defaultValue: CorpId,
      },

      {
        type: 'hidden',
        name: 'tenantId',
        id: 'tenantId',
        title: 'tenantId',
      },
      {
        type: 'text',
        name: 'departmentName',
        id: 'departmentName',
        title: 'Name',
        pattern: {
          value: regex.maxSize50,
          message: 'Please enter alphabets with max 50 characters',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
        // disabled: true,
      },

      {
        type: 'multiSelect',
        name: 'shifts',
        id: 'shifts',
        options: shifts ?? [],
        title: 'Shifts',
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'text',
        name: 'description',
        id: 'description',
        title: 'Description',
        // disabled: true,
      },
      // {
      //   type: 'autocomplete',
      //   name: 'managerId',
      //   id: 'managerId',
      //   title: 'Manager Name',
      //   // multiple: true,
      //   // validationProps: {
      //   //     required: 'This is a mandatory field'
      //   // },
      //   options: manager

      // },
    ],
    // },
    // ],
  };

  const handleSubmit = (values) => {
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    setshowbtn(false);

    if (values.button.toUpperCase() === 'UPDATE') {
      let tem = values?.data;
      manager?.map((man) => {
        if (man?.value == tem?.managerId) {
          tem.managerName = man?.title;
        }
      });
      tem.status = 'ACTIVE';

      axios
        .put(Api.department.list, tem)
        .then((response) => {
          popBTNClick(false);

          if (response?.data?.status == '200') {
            toast.success(
              `${response?.data?.data?.departmentName} details updated successfully`,
            );
            // toast.success('Department updated sucessfully ');
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
      {/* {data?.id && shifts && manager && openDialog && ( */}
      {data?.id && shifts && (
        <PopEdit
          title={data?.departmentName}
          poptemplate={template}
          defaultValues={data}
          showbtn={showbtn}
          openDialog={openDialog}
          buttons={['Update']}
          popAction={handleSubmit}
          // setVal={[{name:"managerId", value:data?.managerId}]}
        />
      )}
    </>
  );
};

export default EditForm;
