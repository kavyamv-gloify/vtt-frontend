import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import Api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import PopEdit from '@editpopup';

const EditForm = ({id, popBTNClick, openDialog}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const [data, setData] = useState();
  const [employee, setEmployee] = useState();
  const {user} = useAuthUser();

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/employee-reg/corporate?page=0&size=2000&emailId=null&employeeCode=null&mobileNo=null',
      )
      .then((res) => {
        let temp = [];
        res?.data?.data?.body?.EmployeeList?.map((el) => {
          temp.push({title: el?.employeeFullName, value: el?.id});
        });
        setEmployee(temp ?? []);
      })
      .catch((err) => {
        setEmployee([]);
      });
  }, []);
  useEffect(() => {
    async function fetchData() {
      const baseURL =
        Api.baseUri + '/user-reg/incident/get-incident-type-by-id/' + id;
      let response = await axios.get(`${baseURL}`);

      setData(response?.data?.data);
    }
    fetchData();
  }, [id]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Penalty',
    description: 'Form for applying Job',
    fields: [
      {
        type: 'text',
        name: 'name',
        id: 'name',
        title: 'Incident Type Name',
        // infoMessage: ["Alpha Numeric Characters are allowed", "Maximum length should be 150", "e.g.: OTA-Penalty1"],
        pattern: {
          value: regex.maxSize150,
          message: 'Please enter  valid amount',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },

      {
        type: 'text',
        name: 'code',
        id: 'code',
        title: 'Incident Type Code',
        // infoMessage: ["Numeric characters are allowed", "Maximum value should be 1,000,000", "e.g.: 2000"],
        validationProps: {
          required: 'This is a mandatory field',
        },
      },

      {
        type: 'multiSelect',
        name: 'workflow',
        id: 'workflow',
        title: 'Work Flow',
        options: employee ?? [],
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'autocomplete',
        name: 'priority',
        id: 'priority',
        title: 'Priority',
        options: [
          {title: 'Low', value: '1'},
          {title: 'Medium', value: '2'},
          {title: 'High', value: '3'},
        ],
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
    ],
    // },
    // ]
  };

  const handleSubmit = async (values) => {
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    setshowbtn(false);

    setshowbtn(false);
    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      dataSet = values.data;
      axios
        .put(Api.baseUri + '/user-reg/incident/update-incident-type', dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(response?.data?.message ?? 'Updated successfully');
            popBTNClick(false);
            // window.location.reload();
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
      {data && data.id && (
        <PopEdit
          title={data?.name}
          poptemplate={template}
          defaultValues={data}
          openDialog={openDialog}
          showbtn={showbtn}
          buttons={['Update']}
          popAction={handleSubmit}
        />
      )}
    </>
  );
};

export default EditForm;
