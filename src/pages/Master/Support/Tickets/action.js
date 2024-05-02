import regex from '@regex';
import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import axios from 'axios';
import Api from '@api';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

const Account = ({TabVal}) => {
  const {user} = useAuthUser();
  const {id} = useParams();
  const [formData, setFormData] = useState();
  const [managerList, setManagerList] = useState();
  useEffect(() => {
    if (id) {
      axios
        .get(Api?.support?.getTicketById + id)
        .then((res) => {
          setFormData(res?.data?.data);
        })
        .catch((err) => {});
    }

    axios
      .get(Api?.employee?.getAllManager + user?.userList?.profileId)
      .then((res) => {
        let tem = [];
        res?.data?.data?.map((n) => {
          tem.push({title: n.firstName + ' ' + n?.lastName, value: n.id});
        });
        setManagerList(tem ?? []);
      })
      .catch((err) => {
        setManagerList([]);
      });
  }, [id]);

  const navigate = useNavigate();
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
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'subject',
            id: 'subject',
            title: 'Subject ',
            disabled: true,
            // pattern: {
            //     value: regex.maxSize250,
            //     message: 'Please enter valid subject with max 250 characters'
            // },
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },

          {
            type: 'text',
            name: 'personContactno',
            id: 'personContactno',
            title: 'Contact No ',
            disabled: true,
            // pattern: {
            //     value: regex.phoneReg,
            //     message: 'Please enter valid mobile number'
            // },
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },

          {
            type: 'text',
            name: 'personEmailId',
            id: 'personEmailId',
            title: 'Email Id',
            disabled: true,
            // pattern: {
            //     value: regex.emailReg,
            //     message: 'Please enter valid email id'
            // },
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },
          {
            type: 'text',
            name: 'requestMsg',
            id: 'requestMsg',
            title: 'Topic Details ',
            disabled: true,
            // pattern: {
            //     value: regex.maxSize250,
            //     message: 'Please enter valid topic details with max 250 characters'
            // },
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },
          {
            type: 'autocomplete',
            name: 'assignedTo',
            id: 'assignedTo',
            title: 'Select Approver',
            options: managerList,
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },
          {
            type: 'text',
            name: 'remarks',
            id: 'remarks',
            title: 'Remarks',
            pattern: {
              value: regex.maxSize250,
              message:
                'Please enter valid topic details with max 250 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  function handleSubmit(val) {
    if (
      val?.button?.toUpperCase() == 'CLOSE' ||
      val?.button?.toUpperCase() == 'TRANSFER'
    ) {
      let postData = {
        userrole: user?.userList?.userRole,
        assignedTo:
          val?.button?.toUpperCase() == 'TRANSFER'
            ? val?.data?.assignedTo
            : null,
        raisedBy: user?.userList?.profileId,
        roaster: {},
        tripId: null,
        employeeId: user?.userList?.profileId,
        subject: val?.data?.subject,
        // "requestMsg": formData.requestMsg,
        responceMsg: [val?.data?.responceMsg],
        tanentId: user?.userList?.tanentId,
        corporateId: user?.userList?.corporateId,
        personContactno: val?.data?.personContactno,
        personEmailId: val?.data?.personEmailId,
        status: val?.button?.toUpperCase() == 'TRANSFER' ? 'PENDING' : 'CLOSED',
      };
      axios
        .post(Api?.support?.raiseTicket, postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(res?.data?.message);
            navigate('/user/complaints-tickets');
            localStorage.setItem('Tab', 'CREATE');
          } else {
            toast.error(res?.data?.message ?? 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    }
  }
  return (
    <>
      <h2 style={{padding: '4px 0px 0px 0px'}}>{TabVal?.name}</h2>
      {formData?.id && managerList && (
        <SmartForm
          template={template}
          defaultValues={formData}
          onSubmit={handleSubmit}
          onCancel={() => {
            navigate('/user/complaints-tickets');
          }}
          buttons={['close', 'Transfer', 'cancel']}
        />
      )}
      {/* <Tab
          className='account-tab'
          label={tab.subTopicName}
          icon={<IoMdInformationCircleOutline />}
          onClick={() => { navigate('/user/support-faq/' + tab?.id) }}
          key={index}
          {...a11yProps(index)}
        /> */}
    </>
  );
};

export default Account;
