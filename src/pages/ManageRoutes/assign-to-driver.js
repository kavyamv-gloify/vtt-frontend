import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import {useNavigate, useParams} from 'react-router-dom';
import moment from 'moment';
import Api from '@api';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import IntlMessages from '@crema/utility/IntlMessages';
import SmartForm from '@smart-form';
import {toast} from 'react-toastify';

const AssignToVendor = () => {
  const tableRef = React.useRef();
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({});
  const [driverList, setDriverList] = useState([]);
  const [myData, setMyData] = useState();
  const [selectedItems, setSelectedItems] = useState();
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Schedule Roster',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'autocomplete',
            name: 'selectedVendor',
            id: 'selectedVendor',
            title: 'Select Vehicle',
            options: driverList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };
  useEffect(() => {
    axios
      .get(
        `${Api.vehicle.list}/${user?.userList?.profileId}/vendor/null/vehiclenumberplate`,
      )
      .then((myel) => {
        let temVend = myel?.data?.data;
        let myTempArray = [];
        temVend?.map((elem) => {
          myTempArray.push({
            title: elem?.vehicleBrand + ' - ' + elem?.vehicleNumberPlate,
            value: elem?.id,
          });
        });
        setDriverList(myTempArray);
      });
    getAllList();
  }, []);
  function getAllList() {
    let url = `${Api.routes?.assignToDriverList}NONE`;
    axios
      .get(url)
      .then((result) => {
        let arr = [];
        result?.data?.data?.map((r) => {
          let tem = {};
          tem.id = r?.id;
          tem.routeDate = r?.date;
          tem.vendorStatus = r?.vendorStatus == 'NONE' ? 'No' : 'Yes';
          tem.vendorName = r?.vendorName ?? '-';
          tem.status = r?.status;
          tem.noOfStoppage = r?.stopList?.length;
          tem.actualStartTime = r?.actualStartTime;
          tem.startTime = r?.startTime;
          arr.push(tem);
        });
        setMyData(arr);
      })
      .catch((err) => {});
  }
  const tableTemplate = {
    columns: [
      {
        title: 'Roster Date',
        field: 'routeDate',
        type: 'date',
      },
      {
        title: 'Start Time',
        field: 'startTime',
      },
      {
        title: 'Number of Stoppage',
        field: 'noOfStoppage',
      },
      {
        title: 'Assigned to Vendor',
        field: 'vendorStatus',
      },
      {
        title: 'Vendor Name',
        field: 'vendorName',
      },
      {
        title: 'Status',
        field: 'status',
      },
    ],
  };
  function handleSubmit(values) {
    // let temarray = [];
    // selectedItems?.map(temel=>{
    //     temarray.push(temel.id)
    // })
    let postData = {
      tripId: selectedItems,
      vehicleId: values?.data?.selectedVendor,
    };

    axios
      .post(Api?.routes?.assignToDriver, postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success(res?.data?.message ?? 'Success');
        } else {
          toast.error(res?.data?.message ?? 'Failed');
        }
        getAllList();
      })
      .catch((err) => {
        toast.error('Something went wrong.');
        getAllList();
      });
    setOpen(false);
  }
  return (
    <>
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
        title='Nodal Point List'
        columns={tableTemplate.columns}
        tableRef={tableRef}
        data={myData}
        options={{
          search: false,
          // selection: true ,
          // selectionProps: rowData => ({
          //     disabled: false,
          //     color: 'primary'
          // }),
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (rowData) => ({
            icon: () => <EditIcon />,
            tooltip: 'Assign trip to vehicle',
            onClick: (event, rowData) => {
              //
              //  .format("YYYY-MM-DD") > moment(Date2).format("YYYY-MM-DD"))
              setOpen(true);
              setSelectedItems(rowData?.id);
            },
          }),
          // rowData => ({
          //     icon: () => (<CancelScheduleSendIcon color="primary" style={{ opacity: rowData?.status == "APPROVED" || rowData?.status == "REJECTED" ? "0.3" : '' }} />),
          //     tooltip: 'Reject',
          //     onClick: (event, rowData) => {
          //         if (rowData?.status != "APPROVED" && rowData?.status != "REJECTED") { setOpen(true); setThisObj({ rowData: rowData, buttonName: "REJECTED" }); }
          //     }
          // })
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle style={{padding: '20px 55px 13px 15px'}}>
          <Typography
            component='h4'
            variant='h4'
            sx={{mb: 3}}
            id='alert-dialog-title'
          >
            Assign Vehicle
          </Typography>
        </DialogTitle>
        {/* <Typography component='h4' variant='h4' sx={{ mb: 3, }} id='alert-dialog-title' >Are you sure you want to {thisObj?.buttonName=="APPROVED" ? 'approve' : 'reject'} roster ?</Typography></DialogTitle> */}
        <DialogContent
          sx={{color: 'text.secondary', fontSize: 14, minWidth: '500px'}}
          id='alert-dialog-description'
        >
          <SmartForm
            template={template}
            onSubmit={handleSubmit}
            onCancel={() => {
              setOpen(false);
            }}
            buttons={['submit', 'cancel']}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignToVendor;
