import React, {useEffect, useState} from 'react'
import PopEdit from '@editpopup';
import regex from '@regex';
import axios from 'axios';
import Api from '@api';
import {toast} from 'react-toastify';



const EditNodalPoints = ({
  openEditDialog,
  id,
  popBTNClick,
  setOpenEditDialog,
}) => {
  const [showbtn, setshowbtn] = useState(true);
  const [editRowData, setEditRowData] = useState([]);


  useEffect(() => {
    const fetchData = async() => {
       await axios.get(Api.baseUri + `/user-reg/office-route/getOfficeRouteById/${id}`)
       .then((res) => {
        setEditRowData(res.data.data);
      })
       .catch((err) => console.log(err))


    }

    fetchData();

  }, [])

  const handleEdit = (values) => {
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    setshowbtn(false);

     let postData = values?.data;
     postData.id = editRowData?.id;
     console.log('postData', postData);
     axios
       .put(
         Api.baseUri + '/user-reg/office-route/update-Office-Route',
         postData,
       )
       .then((res) => {
         if (res?.data?.status == '200') {
           console.log('response', res)
           toast.success('User updated successfully');
           setEditRowData(null);
         }
       })
       .catch((err) => {
         toast.error(err ?? 'Something went wrong');
       });


  };

  let EditTemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Route',
    description: 'Form for applying Job',

    fields: [
      {
        type: 'text',
        name: 'routeShortName',
        id: 'routeShortName',
        title: 'Route Name',
        pattern: {
          value: regex.maxSize50,
          message:
            'Please enter  valid code with alpha-numeric and below 50 characters',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },

      {
        type: 'text',
        name: 'routeName',
        id: 'routeName',
        title: 'Route Details',
        pattern: {
          value: regex.maxSize50,
          message:
            'Please enter  valid code with alpha-numeric and below 50 characters',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
    ],
  };

  return (
    <>
      {editRowData && editRowData.id && (
        <PopEdit
          poptemplate={EditTemplate}
          defaultValues={editRowData}
          openDialog={openEditDialog}
          showbtn={showbtn}
          buttons={['Update']}
          popAction={handleEdit}
          popBTNClick={popBTNClick}
          setopenDialog={setOpenEditDialog}
        />
      )}
    </>
  );
};

export default EditNodalPoints;