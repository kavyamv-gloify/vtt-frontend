import React from 'react';
import ReactDOM from 'react-dom';
import {useForm} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {useEffect, useState} from 'react';
import axios from 'axios';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SmartTable from '@smart-table';
import EditIcon from '@mui/icons-material/Edit';
import EditForm from './EditForm';
import {setISODay} from 'date-fns';
export default function PerTrip() {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();

  const styles = {
    ml: {
      marginLeft: '1rem',
    },
    textwidth: {
      width: '8rem',
    },
    h1: {
      color: 'black',
      // marginBottom: "0.5rem"
    },
    button: {
      width: '1rem',
      height: '2.5rem',
      marginTop: '1.5rem',
      marginLeft: '1rem',
    },
    p: {
      color: 'red',
      fontSize: '13px',
      marginTop: '0.5rem',
    },
    input: {
      width: '10rem',
      alignItem: 'center',
      borderRadius: '20rem',
      height: '1.5rem',
      padding: '0.5rem',
      borderColor: '#e9e9f0',
      fontSize: '14px',
    },
  };

  const {user} = useAuthUser();

  const [vendorList, setVendorList] = useState();
  const [vendorId, setVendorId] = useState();
  const [data, setData] = useState();
  const [filterData, setFilterData] = useState();
  const [openEdit, setOpenEdit] = useState(false);
  const [id, setId] = useState();
  const tableRef = React.useRef();

  useEffect(() => {
    async function getvendorlist() {
      const baseURL = `${api.vendor.list}/corporateId?page=0&size=1000&companyPAN=null&emailId=null&mobileNo=null`;
      let response = await axios.get(`${baseURL}`);
      //
      let temp = [];
      response?.data?.data?.body['Corporate List']?.map((e) => {
        //
        temp.push({
          title:
            e.vendorName +
            ' (' +
            'vendor code ' +
            '-' +
            ' ' +
            e.vendorCode +
            ')',
          name: e.vendorName,
          code: e.vendorCode,
          value: e.id,
        });

        setVendorList(temp);
      });
    }
    getvendorlist();
  }, []);

  async function getData() {
    const baseURL = `${api.ratecard.getlist}/vendor/${vendorId}/status/ACTIVE`;
    let res = await axios.get(`${baseURL}`);

    setData(res?.data?.data);
  }

  useEffect(() => {
    getData();
  }, [vendorId]);

  useEffect(() => {
    var newArray = data?.filter(function (el) {
      return el?.cardType?.trim() == 'PER TRIP';
    });

    setFilterData(newArray);
  }, [data]);

  function handleCloseForm(status) {
    setOpenEdit(status);
    getData();
  }

  function handleEdit(rowData) {
    setOpenEdit(true);
    setId(rowData?.id);
  }
  const tableTemplate = {
    columns: [
      {
        title: 'Card Type',
        field: 'cardType',
      },
      // {
      //     title: 'Company Id',
      //     field: "companyId"
      // },
      {
        title: 'Fuel Type',
        field: 'fuelType',
      },

      {
        title: 'Vehicle Type ',
        field: 'vehicleTypeName',
      },
      {
        title: 'Max Range ',
        field: 'maxRange',
      },
      {
        title: 'Min Range ',
        field: 'minRange',
      },
      {
        title: 'Rate',
        field: 'rate',
      },
    ],
  };

  return (
    <>
      <Box sx={{minWidth: 150}}>
        <FormControl style={{width: '300px'}}>
          <InputLabel id='demo-simple-select-label'>Vendor</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={vendorId}
            label='Vendor'
            onChange={(e) => {
              setVendorId(e.target.value);
            }}
          >
            {vendorList?.map((e) => {
              return <MenuItem value={e.value}>{e?.title}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </Box>

      <div style={{marginTop: '14px'}}>
        <SmartTable
          components={{
            Toolbar: (props) => (
              <>
                <div
                  style={{
                    height: '0px',
                  }}
                ></div>
              </>
            ),
          }}
          title='Onboard Tenants List'
          columns={tableTemplate.columns}
          // tableRef={tableRef}
          data={filterData ?? []}
          options={{
            search: false,
            showTitle: false,

            actionsColumnIndex: -1,
            headerStyle: {position: 'sticky', top: 0},
          }}
          actions={[
            {
              icon: () => <EditIcon color='primary' />,
              tooltip: 'Edit',
              onClick: (event, rowData) => handleEdit(rowData),
            },
          ]}
          localization={{
            body: {
              emptyDataSourceMessage: 'No records to display',
              filterRow: {
                filterTooltip: 'Filter',
                filterPlaceHolder: 'Filtaaer',
              },
            },
          }}
          style={{
            borderRadius: 16,
            boxShadow: '0px 10px 10px 4px rgb(0 0 0 / 4%)',
          }}
        />
      </div>

      <Dialog
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' style={{fontSize: '2.5vh'}}>
          Rate Card
        </DialogTitle>
        <DialogContent>
          <EditForm id={id} close={handleCloseForm} />
        </DialogContent>
      </Dialog>
    </>
  );
}
