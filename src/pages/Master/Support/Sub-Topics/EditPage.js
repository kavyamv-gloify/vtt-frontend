import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import PopEdit from '@editpopup';
const CreateForm = ({id, popBTNClick, openDialog, topicId}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const [data, setData] = useState();
  const [topicList, setTopicList] = useState();
  // const { id } = useParams();

  const subTopicDeatails = async () => {
    const baseURL = `${api.support.getsubtopicbyid}/${id}`;
    let response = await axios.get(`${baseURL}`);

    setData(response.data.data);
  };

  useEffect(() => {
    subTopicDeatails();
  }, [id]);

  // useEffect(() => {

  //     async function getTopicList() {
  //         let temp = []
  //         let res = await axios.get(`${api.support.topicList}`)
  //
  //         if (res?.data?.data?.length) {
  //             res?.data?.data?.map((e) => {
  //
  //                 temp.push({ title: e.topicName, value: e.id });
  //
  //             })
  //         }
  //         setTopicList(temp);
  //     }

  //     getTopicList();
  // }, [])

  let edittemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Penalty',
    description: 'Form for applying Job',
    // sections: [
    // {
    // layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
    // id: 'personal_information',
    fields: [
      // {
      //     type: 'autocomplete',
      //     name: 'helpTopicId',
      //     id: 'helpTopicId',
      //     title: "Select Topic",
      //     options: topicList ?? [],
      //     validationProps: {
      //         required: 'This is a mandatory field'
      //     }
      // },

      {
        type: 'text',
        name: 'subTopicName',
        id: 'subTopicName',
        title: 'Sub-Topic',
        validationProps: {
          required: 'This is a mandatory field',
        },
      },

      {
        type: 'text',
        name: 'subTopicDeatails',
        id: 'subTopicDeatails',
        title: 'Sub-Topic Detail',
        validationProps: {
          required: 'This is a mandatory field',
        },
      },

      // {
      //     type: 'radio',
      //     name: 'status',
      //     id: 'status',
      //     title: 'Status',
      //     options: [
      //         { title: 'Active', value: 'ACTIVE' },
      //         { title: 'Inactive', value: 'INACTIVE' }
      //     ],
      //     validationProps: {
      //         required: 'This is a mandatory field'
      //     }
      // },
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

    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      dataSet.id = data?.id;
      dataSet.helpTopicId = topicId;
      // topicList?.map(el=>{
      //     if(el?.value == values?.data?.helpTopicId) { dataSet.helpTopicName = el?.title }
      // })
      dataSet.subTopicName = values?.data?.subTopicName;
      dataSet.subTopicDeatails = values?.data?.subTopicDeatails;
      dataSet.status = values?.data?.status;
      dataSet.createdOn = data?.createdOn;

      axios
        .put(api.support.subtopicUpdate, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(response?.data?.message ?? 'Updated successfully');
            popBTNClick(false);
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

    //
  };

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {data && data.id && (
        <PopEdit
          defaultValues={data}
          poptemplate={edittemplate}
          popAction={handleSubmit}
          title={data?.subTopicName}
          openDialog={openDialog}
          buttons={['update']}
          showbtn={showbtn}
          setVal={[{name: 'helpTopicId', value: data?.helpTopicId}]}
        />
      )}
      {/* <SnackbarCustom BooleanValue={boolean} open={open} onChange={handleChange}>{snackbarMsg}</SnackbarCustom> */}
    </>
  );
};

export default CreateForm;
