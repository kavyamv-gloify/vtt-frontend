import React, {useState, useEffect} from 'react';
import {Grid, TextField, Button} from '@mui/material';
import {useAuthUser} from '@crema/utility/AuthHooks';
import axios from 'axios';
import Api from '@api';
import SmartForm from '@smart-form';
import regex from '@regex';
import {toast} from 'react-toastify';
import SmartTable from '@smart-table';
const AssociateDriver = ({id}) => {
  const [searchValue, setSearchValue] = useState();
  const [showbtn, setshowbtn] = useState(true);
  const [driverData, setDriverData] = useState();
  const {user} = useAuthUser();

  const handleDialog = (val) => {
    setshowbtn(false);
    if (!driverData?.id) {
      toast.error('Please Enter Email or Mobile No.');
      setTimeout(() => {
        setshowbtn(true);
      }, 1000);
      return;
    }
    if (val?.button == 'Add') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/associateDriver/associateDriverToVendor/driver/${driverData?.id}/vendor/${id}`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(res?.data?.message);
          } else if (res?.data?.status == '400') {
            toast.error(res?.data?.message);
          } else {
            toast.error('Something went wrong');
          }
          // setTimeout(() => {
          //   tableRef.current && tableRef.current.onQueryChange()
          // }, 0);
        })
        .catch((err) => {
          setOpenAssociate(false);
          toast.error('Something went wrong.');
        });
    }
  };
  const searchDriver = (val) => {
    if (!val?.vendorId) {
      return;
    }
    let mob = null;
    let email = null;
    if (isNaN(Number(val?.vendorId))) {
      email = val?.vendorId;
    } else {
      mob = val?.vendorId;
    }

    axios
      .get(
        `${Api.baseUri}/user-reg/associateDriver/search-driver?emailId=${email}&mobileNo=${mob}`,
      )
      .then((re) => {
        if (!re?.data?.data?.id) toast.error('No record found.');
        console.log('elll', re);
        setDriverData({...re?.data?.data});
      })
      .catch((err) => {
        setDriverData({});
      });
  };

  let templateAssociate = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'vendorId',
                id: 'vendorId',
                title: 'Driver Email Id/Mobile No',
                field: 'vendorId',
                pattern: {
                  value: regex.phoneORemailReg,
                  message: 'Please enter valid Time',
                },
              },
              {
                type: 'button',
                name: 'searchVendor',
                id: 'searchVendor',
                title: 'Search',
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'vendorName',
                id: 'vendorName',
                title: 'Driver Name',
                disabled: true,
                field: 'vendorName',
              },
              // {
              //   type: 'text',
              //   name: 'vendorCode',
              //   id: 'vendorCode',
              //   disabled: true,
              //   title: 'Vendor Code',
              //   field: 'vendor Code',
              //   // validationProps: {
              //   //   required: 'This is a mandatory field',
              //   // },
              // },
            ],
          },
        ],
      },
    ],
  };
  function SecretFun(search, value) {
    if (search?.toUpperCase() == 'SEARCH') {
      searchDriver(value);
    } else return;
  }
  return (
    <div>
      <SmartForm
        template={templateAssociate}
        setVal={[
          // {name: 'vendorCode', value: vendorData?.vendorCode ?? 'NA'},
          {name: 'vendorName', value: driverData?.firstName ?? 'NA'},
        ]}
        showbtn={showbtn}
        SecretFun={SecretFun}
        onSubmit={handleDialog}
        buttons={['Add']}
      />
      <Grid container></Grid>
    </div>
  );
};

export default AssociateDriver;
