import React, {useState, useEffect} from 'react';
import SmartForm from '@smart-form';
import Api from '@api';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import moment from 'moment';
import {AssignmentIndOutlined} from '@mui/icons-material';
import {toast} from 'react-toastify';
import {getFormData} from '@hoc';
const CreateTicket = ({close}) => {
  const [showbtn, setshowbtn] = useState(true);
  const [deptList, setdeptList] = useState();
  const [deptId, setDeptId] = useState('');
  const [employee, setEmployee] = useState();
  const [employeeId, setEmployeeId] = useState();
  const [employeeInfo, setEmployeeInfo] = useState();
  const [channelList, setChannelList] = useState();
  const [incident, setIncident] = useState();
  const [tripList, setTripList] = useState();
  const [agentList, setAgentList] = useState();
  const [teamList, setTeamList] = useState();
  const [sla, setSla] = useState();
  const {user} = useAuthUser();
  useEffect(() => {
    axios
      .get(`${Api?.dropdown?.department}`)
      .then((res) => {
        let temp = [];
        if (res?.data?.data?.length) {
          res?.data?.data?.map((e) => {
            temp.push({
              title: e.departmentName,
              value: e.id,
            });
          });
        }
        setdeptList(temp);
      })
      .catch((er) => {
        setdeptList([]);
      });
  }, []);

  useEffect(() => {
    if (deptId) {
      axios
        .get(
          Api.baseUri +
            '/user-reg/employee-reg/empListing?corporateId=' +
            user?.userList?.corporateId +
            '&departmentId=' +
            deptId,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            let temp_emp = [];
            res?.data?.data?.map((el) => {
              temp_emp?.push({title: el?.employeeFullName, value: el?.id});
            });
            setEmployee(temp_emp ?? []);
          }
        })
        .catch((err) => {
          setEmployee([]);
        });
    }
  }, [deptId, user?.userList?.corporateId]);

  useEffect(() => {
    if (employeeId) {
      axios
        .get(Api.baseUri + '/user-reg/employee-reg/' + employeeId)
        .then((res) => {
          if (res?.data?.status == '200') {
            setEmployeeInfo(res?.data?.data ?? {});
          }
        })
        .catch((err) => {
          setEmployeeInfo({});
        });
    }
  }, [employeeId]);

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/channel/getChannelByCorporateId/' +
          user?.userList?.corporateId,
      )
      .then((res) => {
        let temp = [];
        if (res?.data?.status == '200') {
          res?.data?.data?.map((el) => {
            temp.push({title: el?.channelName, value: el?.id});
          });
        }
        setChannelList(temp ?? []);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/incidentTeam/getAllByCorporateId/' +
          user?.userList?.corporateId,
      )
      .then((res) => {
        let temp = [];
        if (res?.data?.status == '200') {
          res?.data?.data?.map((el) => {
            temp.push({title: el?.teamName, value: el?.id});
          });
        }
        setTeamList(temp ?? []);
      })
      .catch((err) => {
        setTeamList([]);
      });
  }, [user?.userList?.corporateId]);

  function handleChange(val) {
    setDeptId(val?.departmentId?.value);
    setEmployeeId(val?.createTicketFor?.value);

    if (val?.createTicketFor?.value && val?.tripDate) {
      axios
        .get(
          Api.baseUri +
            '/user-reg/trip-route/get-trips-based-on-behalf-and-empId/' +
            val?.tripDate +
            '/' +
            val?.createTicketFor?.value,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            let temp = [];
            res?.data?.data?.map((el) => {
              temp.push({title: el?.tripCode, value: el?.id});
            });
            setTripList(temp ?? []);
          }
        })
        .catch((err) => {
          setTripList([]);
        });
    }

    if (val?.incidentType?.value) {
      axios
        .get(
          Api.baseUri +
            '/user-reg/sla/getAllByIncidentType/' +
            val?.incidentType?.value,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            setSla(res?.data?.data[0]?.slaName + '+' + res?.data?.data[0]?.id);
            // let temp = [];
            // res?.data?.data?.map((el) => {
            //   temp.push({title: el?.tripCode, value: el?.id});
            // });
            // setTripList(temp ?? []);
          }
        })
        .catch((err) => {
          // setTripList([]);
        });
    }
  }

  useEffect(() => {
    let postData = {
      page: '0',
      size: '10',
      role: 'AGENT',
      corporateId: user?.userList?.corporateId,
      roleCode: 'EMPLOYEE',
    };
    axios
      .post(Api.baseUri + '/userauth/user-account/getAllUserData', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];

          res?.data?.data?.body?.UserList?.map((el) => {
            temp.push({title: el?.userName, value: el?.id});
          });
          setAgentList(temp ?? []);
        }
      })
      .catch((err) => {
        setAgentList([]);
      });
  }, []);

  const incidentType = [
    {title: 'SOS', value: 'SOS'},
    {title: 'Feed Back', value: 'Feed Back'},
    {title: 'Support', value: 'Support'},
    {title: 'Safe Reach', value: 'Safe Reach'},
    {title: 'Application-technology', value: 'Application-technology'},
    {title: 'Over Speeding', value: 'Over Speeding'},
    {title: 'Other', value: 'Other'},
  ];

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Roster Setting',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Ticket Information',
        fields: [
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'autocomplete',
                name: 'departmentId',
                id: 'departmentId',
                title: 'Department',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                options: deptList ?? [],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'autocomplete',
                name: 'createTicketFor',
                id: 'createTicketFor',
                title: 'Create Ticket for',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                options: employee ?? [],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'emailId',
                id: 'emailId',
                disabled: true,
                title: 'Email Id',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },

              {
                type: 'text',
                name: 'mobileNo',
                id: 'mobileNo',
                title: 'Mobile No.',
                disabled: true,
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'date',
                name: 'tripDate',
                id: 'tripDate',
                title: 'Trip Date',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                
                // validationProps: {
                //   required: 'This is a mandatory field',
                // },
              },
              {
                type: 'autocomplete',
                name: 'tripId',
                id: 'tripId',
                title: 'Select Trip',
                options: tripList ?? [],
                validationProps: {
                  // required: 'This is a mandatory field',
                },
              },
            ],
          },
          {
            type: 'text',
            name: 'subject',
            id: 'subject',
            title: 'Subject',
            // infoMessage: ["Radio button is selectable", "e.g.: yes"],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'autocomplete',
                name: 'incidentType',
                id: 'incidentType',
                title: 'Incident Type',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                options: incidentType ?? [],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'priority',
                id: 'priority',
                defaultValue: sla ?? '',
                disabled: true,
                title: 'Priority/SLA',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'autocomplete',
                name: 'ticketOwner',
                id: 'ticketOwner',
                title: 'Assigned to Team',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                options: teamList ?? [],
                validationProps: {
                  // required: 'This is a mandatory field',
                },
              },
              {
                type: 'autocomplete',
                name: 'agentList',
                id: 'agentList',
                title: 'Assigned to Agent',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                options: agentList ?? [],
                validationProps: {
                  // required: 'This is a mandatory field',
                },
              },
            ],
          },
          {
            type: 'blank',
            name: 'allowDailyChanges',
            id: 'allowDailyChanges',
            title: 'Ticket Owner',
            // infoMessage: ["Radio button is selectable", "e.g.: yes"],
            // options: [
            //     { title: "Yes", value: "Yes" },
            //     { title: "No", value: "No" }
            // ],
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },
        ],
      },

      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Additional Information',
        fields: [
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'autocomplete',
                name: 'channelId',
                id: 'channelId',
                title: 'Channel',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                options: channelList ?? [],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'autocomplete',
                name: 'classification',
                id: 'classification',
                title: 'Classification',
                // infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Question', value: 'Question'},
                  {title: 'Problem', value: 'Problem'},
                  {title: 'Feature', value: 'Feature'},
                  {title: 'Others', value: 'Others'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'text',
                name: 'newClassification',
                id: 'newClassification',
                title: 'Classification',
                // infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                dynamic: {
                  field: 'classification',
                  value: 'Others',
                },
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'date',
                name: 'dueDate',
                id: 'dueDate',
                title: 'Due date',
                min: 'today',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'file',
                name: 'attachement',
                id: 'attachement',
                title: 'Add Attachement',
                // infoMessage: ["Radio button is selectable", "e.g.: yes"],
                validationProps: {
                  size: {
                    value: 5,
                    message: 'File size should not be more than 5 mb.',
                  },
                },
              },
            ],
          },

          {
            type: 'ckeditor',
            name: 'message',
            id: 'message',
            title: 'Message',
            // infoMessage: ["Radio button is selectable", "e.g.: yes"],
            options: [
              {title: 'Yes', value: 'Yes'},
              {title: 'No', value: 'No'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  function handleSubmit(val) {
    let dataSet = {};
    let allElem = {};

    let postData = {
      ticketForId: val?.data?.createTicketFor,
      // // "ticketForName":
      emailId: val?.data?.emailId,
      departmentId: val?.data?.departmentId,
      mobileNo: val?.data?.mobileNo,
      tripDate: val?.data?.tripDate,
      tripId: val?.data?.tripId,
      subject: val?.data?.subject,
      // priority: sla?.split('+')?.[1],
      incidentType: val?.data?.incidentType,
      // // ticketOwnerId: val?.data?.ticketOwnerId,
      channelId: val?.data?.channelId,
      dueDate: val?.data?.dueDate,
      addAttachement: val?.data?.attachement,
      message: val?.data?.message,
      // attachement: val?.data?.attachement,
      // status: 'OPEN',
    };
    if (!val?.data?.newClassification) {
      postData.classification = val?.data?.classification;
    } else {
      postData.classification = val?.data?.newClassification;
    }
    deptList?.map((el) => {
      if (el?.value == val?.data?.departmentId) {
        postData.departmentName = el?.title;
      }
    });
    employee?.map((el) => {
      if (el?.value == val?.data?.createTicketFor) {
        postData.ticketForName = el?.title;
      }
    });
    channelList?.map((el) => {
      if (el?.value == val?.data?.channelId) {
        postData.channelName = el?.title;
      }
    });

    console.log('postData', postData);

    Object.keys(postData).map((key) => {
      if (typeof postData[key]?.[0]?.name == 'string') {
        dataSet = {
          ...dataSet,
          [key]: postData[key][0],
        };
      } else {
        allElem = {
          ...allElem,
          [key]: postData[key],
        };
      }
    });
    dataSet = {
      ...dataSet,
      data: JSON.stringify(allElem),
    };

    console.log('dataSet', dataSet);

    axios({
      method: 'post',
      url: Api.baseUri + '/user-reg/incident-management/create-ticket',
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    })
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Ticket Raised Successfully');
          close();
        }
      })
      .catch((err) => {});
  }
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <SmartForm
        template={template}
        onSubmit={handleSubmit}
        setVal={[
          {name: 'emailId', value: employeeInfo?.emailId},
          {name: 'mobileNo', value: employeeInfo?.mobileNo},
          {name: 'priority', value: sla?.split('+')?.[0]},
        ]}
        onChange={handleChange}
        buttons={['submit']}
      />
    </>
  );
};

export default CreateTicket;
