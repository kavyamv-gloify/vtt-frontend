import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import SmartForm from '@smart-form';
import {toast} from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import regex from '@regex';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Button, DialogTitle} from '@mui/material';
import EditVendor from '../EditVehicles/index';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import RegisterVendor from '../RegisterVehicles/index';
import DetailForm from '../VehicleDetailPage';
import {Divider} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterPop from '@filter-pop';
import Confirm from '@confirmation-box';
import ExcelContainer from '@excelupload';
import Grid from '@mui/material/Grid';
import AppTooltip from '@crema/core/AppTooltip';
import {Box} from '@mui/material';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import Compliance from '../vehicleCompliance/index';
const List = () => {
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const tableRef = React.useRef();
  const {user} = useAuthUser();
  const [openform, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDriverShift, setOpenDriverShift] = useState(false);
  const [diverList, setDiverList] = useState([]);
  const [freeDiverList, setFreeDiverList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [vehicleId, setVehicleId] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [openFilter, setOpenFilter] = useState(false);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [id, setId] = useState();
  const [vehicleList, setVehicleList] = useState([]);
  const [openCompliance, setOpenCompliance] = useState(false);
  popBTNClick, openDialog;
  function popBTNClick(val) {
    setTimeout(() => {
      if (user?.role == 'VENDOR') {
        getAllDriver();
      } else tableRef.current && tableRef.current.onQueryChange();
    }, 0);
    if (!val) {
      setopenDialog(false);
    }
  }
  function getAllDriver() {
    axios
      .get(
        `${api.vehicle.list}/${user?.userList?.profileId}/vendor/null/vehiclenumberplate`,
      )
      .then((res) => {
        setVehicleList(res?.data?.data);
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAllDriver();
  }, []);

  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: '',
    description: 'Assign Driver',
    sections: [
      {
        layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
        id: 'assign_driver',
        fields: [
          // {
          //   type: 'select',
          //   name: 'selectShift',
          //   id: 'selectShift',
          //   disabled: false,
          //   title: 'Select Shift',
          //   options: shiftList,
          //   validationProps: {
          //     required: 'This is a mandatory field'
          //   }
          // },
          {
            type: 'select',
            name: 'selectDriver',
            id: 'selectDriver',
            disabled: false,
            title: 'Select Driver',
            options: freeDiverList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'fromTime',
            id: 'fromTime',
            disabled: false,
            title: 'Shift Start Time',
            input_type: 'time',
            // pattern: {
            //   value: regex.hhmmReg,
            //   message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
            dynamic: {
              field: 'selectDriver',
              isNotValue: ' ',
            },
          },
          {
            type: 'text',
            name: 'toTime',
            id: 'toTime',
            disabled: false,
            title: 'Shift To Time',
            input_type: 'time',
            // pattern: {
            //   value: regex.hhmmReg,
            //   message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
            dynamic: {
              field: 'selectDriver',
              isNotValue: ' ',
            },
          },
        ],
      },
    ],
  };
  const tableTemplate = {
    columns: [
      {
        title: 'Vehicle Brand',
        field: 'vehicleBrand',
      },
      {
        title: 'Vehicle Number',
        field: 'vehicleNumberPlate',
      },
      // {
      //   title: 'Vehicle Type',
      //   field: "vehicleType"
      // },

      // {
      //   title: 'Vehicle  registration Number',
      //   field: "regNumber"
      // },
      {
        title: 'Owner Name',
        field: 'ownerName',
      },
      {
        title: 'Email Id',
        field: 'ownerEmail',
      },
      {
        title: 'Mobile No.',
        field: 'ownerMobile',
      },
      {
        title: 'Created by',
        field: 'createdBy',
        type: 'date',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'date',
      },
      {
        title: 'Last Updated on',
        field: 'updatedOn',
        type: 'datetime',
      },
    ],
  };
  const driverTableTemplate = {
    columns: [
      {
        title: 'Driver Name',
        field: 'driverName',
      },
      // {
      //   title: 'Shift Name',
      //   field: "shiftName"
      // },
      {
        title: 'From Time',
        field: 'fromTime',
      },
      {
        title: 'To Time',
        field: 'toTime',
      },
      {
        title: 'Vehicle Number',
        field: 'vehicleNumber',
      },
    ],
  };

  let templateFilter = {
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
            type: 'text',
            name: 'vehicleNumberPlate',
            title: 'Vehicle Number plate',
            inputiconurl: '/assets/images/login_icon.png',
            field: 'vehicleNumberPlate',
          },
        ],
      },
    ],
  };

  useEffect(() => {
    setDiverList(diverList);
  }, [diverList]);

  function handleClickView(rowData) {
    // navigate('/onboardadmin/vehicle/detailPage/' + rowData.id);
    setId(rowData?.id);
    setOpenDetail(true);
  }
  function handleClickEdit(rowData) {
    // navigate('/onboardadmin/vehicle/editPage/' + rowData.id);
    setopenDialog(true);
    setdialID(rowData?.id);
  }

  function handleDelete(rowData) {
    setId(rowData?.id);
    handleConfirmBox();
  }

  function handleOpenform() {
    setOpenForm(true);
  }

  function handleClose() {
    setOpenForm(false);
  }

  function handleCloseForm(status) {
    setOpenForm(status);
    setTimeout(() => {
      if (user?.role == 'VENDOR') {
        getAllDriver();
      } else tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  }
  function handleCloseDriverShift(status) {
    setOpenDriverShift(false);
  }

  function handleDetailform() {
    setOpenDetail(false);
  }

  function handleinteranldialog() {
    setOpenDetail(false);
  }

  function handleDriverShift(rowData) {
    setVehicleName(rowData?.vehicleBrand);
    setVehicleNumber(rowData?.vehicleNumberPlate);
    setVehicleId(rowData.id);
    let url = `${api.driver.driverMap}/get-all-actvice-mapping-by-vehicleid/${rowData.id}`;

    if (url) {
      axios.get(url).then((result) => {
        setDiverList(result?.data?.data);
      });
    }
    let url1 = `${api.drivershift.list}/get-shift-list-by-vendor`;

    if (url1) {
      axios.get(url1).then((result) => {
        let s_arr = [];
        result?.data?.data?.map((re) => {
          s_arr.push({
            title: re?.shiftName + ' (' + re?.fromTime + ')',
            value: re?.id,
          });
        });
        setShiftList(s_arr);
      });
    }

    let url2 = `${api.driver.freeDriver}`;

    if (url2) {
      axios.get(url2).then((result) => {
        let arr = [];
        result?.data?.data?.map((re) => {
          arr.push({title: re?.firstName + ' ' + re?.lastName, value: re?.id});
        });
        setFreeDiverList(arr);
      });
    }
    setOpenDriverShift(true);
  }

  const removeDriverShift = async (data) => {
    let url = `${api.driver.driverMap}/remove-mapping-by-id/${data.id}`;
    axios
      .get(url)
      .then((result) => {
        toast.success(result?.data?.message);
        setOpenDriverShift(false);
      })
      .catch((err) => {});
  };

  const handleSubmit = async (values) => {
    let reqBody = {
      vehicleId: vehicleId,
      driverId: values?.data?.selectDriver,
      fromTime: values?.data?.fromTime,
      toTime: values?.data?.toTime,
    };

    let url = `${api.driver.driverMap}`;
    axios.post(url, reqBody).then((result) => {
      toast.success(result?.message);
      if (result?.status === 200) {
        setOpenDriverShift(false);
      }
    });
  };

  const handleClosefilter = (d) => {
    setFilter(d.data);
    if (d == 'NO') {
      setOpenFilter(false);
    }
    setTimeout(() => {
      if (user?.role == 'VENDOR') {
        getAllDriver();
      } else tableRef.current && tableRef.current.onQueryChange();
    }, 0);
    setOpenFilter(false);
  };

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };

  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      axios
        .post(`${api.vehicle.list}/deactivatevehicle/${id}`)
        .then((response) => {
          if (response?.data?.status == '200') {
            setTimeout(() => {
              if (user?.role == 'VENDOR') {
                getAllDriver();
              } else tableRef.current && tableRef.current.onQueryChange();
            }, 0);
            setOpenConfirmBox(false);
            navigate(`/onboardadmin/vehicle/vehicle-listing`);
          }
        })
        .catch((err) => {});
    } else {
      setOpenConfirmBox(false);
    }
  };

  function handleCompliance(r) {
    setOpenCompliance(true);
    setId(r?.id);
  }

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={9}>
          <CustomLabel labelVal="Vehicles' List" variantVal='h3-underline' />
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
      {openDialog && dialID && (
        <EditVendor
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}

      <Divider light className='mb-4' />

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
        tableRef={tableRef}
        data={
          user?.role == 'VENDOR'
            ? vehicleList
            : (query) =>
                new Promise((resolve, reject) => {
                  let url = `${api.vehicle.list}/corporateId?page=${
                      query.page
                    }&size=${query.pageSize}&vehicleNumberPlate=${
                      filter?.vehicleNumberPlate
                        ? filter?.vehicleNumberPlate
                        : null
                    }`,
                    body = {
                      pageSize: query.pageSize,
                      pageNo: query.page,
                    };
                  if (!_.isEmpty(filter)) {
                    body = {
                      ...body,
                      ...filter,
                    };
                  }

                  if (user?.role == 'CORPORATEADMIN') {
                    axios.get(url, body).then((result) => {
                      resolve({
                        data: result?.data?.data?.body['Corporate List'] ?? [],
                        page: result?.data?.data?.body?.currentPage || 0,
                        totalCount: result?.data?.data?.body?.totalItems || 0,
                      });
                    });
                  }

                  if (user?.role == 'VENDOR') {
                    axios
                      .get(url, body)
                      .then((result) => {
                        resolve({
                          data: result.data?.data ?? [],
                          page: result?.data?.data?.body?.currentPage ?? 0,
                          totalCount: result?.data?.data?.body?.totalItems ?? 0,
                        });
                      })
                      .catch((err) => {
                        resolve({
                          data: [],
                          page: 0,
                          totalCount: 0,
                        });
                      });
                  }
                })
        }
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          {
            icon: () => <ExpandCircleDownIcon color='primary' />,
            tooltip: 'Compliance',
            onClick: (event, rowData) => handleCompliance(rowData),
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

      <Dialog
        onClose={() => {
          setOpenCompliance(false);
        }}
        open={openCompliance}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '80%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            background: '#f4f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Vehicle Compliance</h1>
          <CloseIcon onClick={() => setOpenCompliance(false)} />
        </DialogTitle>

        <DialogContent style={{padding: '20px'}}>
          <Compliance vid={id} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default List;
