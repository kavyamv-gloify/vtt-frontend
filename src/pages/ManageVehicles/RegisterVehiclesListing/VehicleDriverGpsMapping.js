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
import RestoreIcon from '@mui/icons-material/Restore';
import _ from 'lodash';
import api from '@api';
import regex from '@regex';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Button, DialogTitle, Tab} from '@mui/material';
import EditVendor from '../EditVehicles/index';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
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
// import {Box} from '@mui/material';
import Box from '@mui/material/Box';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import Compliance from '../vehicleCompliance/index';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import {useSelector} from 'react-redux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import QuickSearchPage from '@quick-search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import Api from '@api';
import moment from 'moment';
import AddchartIcon from '@mui/icons-material/Addchart';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CopyToClipboard from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {useParams} from 'react-router-dom';
import {TabContext, TabList, TabPanel} from '@mui/lab';
const fieldList = [
  {title: 'Vehicle Number Plate', value: 'vehicleNumberPlate'},
  {title: 'Owner Name', value: 'ownerName'},
  {title: 'Owner Email Id', value: 'ownerEmail'},
  {title: 'Owner Mob No', value: 'ownerMobile'},
  {title: 'Brand Name', value: 'vehicleBrand'},
  {title: 'Colour', value: 'vehicleColor'},
  {title: 'Fuel Type', value: 'fuelType'},
  {title: 'Model Name', value: 'modelNo'},
  {title: 'Status', value: 'status'},
];
const VehicleDriverGpsMapping = () => {
  const [filter, setFilter] = useState({});
  const params = useParams();
  console.log('params', params);
  const navigate = useNavigate();
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Vehicles') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (!sub_mod || !sub_mod?.actions?.includes('View'))
      navigate('/error-pages/error-404');
  }, [permissionCheck]);
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  // const tableRef = React.useRef();
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
  const [vendorIds, setVendorIds] = useState('');
  const [filterRes, setFilterRes] = useState([]);
  const [searchClicked, setsearchClicked] = useState(false);
  const [filterShow, setfilterShow] = useState(false);
  const [gpsID, setGpsID] = useState('');
  const [openGpsDialog, setOpenGpsDialog] = useState(false);
  const [openGpsDialogData, setOpenGpsDialogData] = useState(false);
  const [openGpsUpdateDialog, setOpenGpsUpdateDialog] = useState('');
  const [backendGpsKey, setBackendGpsKey] = useState('');
  const [backendGpsUpdateKey, setBackendGpsUpdateKey] = useState('');
  const [gpsVehicle, setGpsVehicle] = useState([]);
  // const [gpsVehicleDetail, setGpsVehicleDetail] = useState([]);
  const [vehicleNo, setVehicleNo] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [gpsProviderId, setGpsProviderId] = useState([]);
  const [toggleAddScreen, setToggleAddScreen] = useState(null);
  const [vehicleGpsId, setVehicleGpsId] = useState({});
  const [openAssociate, setOpenAssociate] = useState(false);
  const [vehicleData, setVehicleData] = useState();
  const [showbtn, setshowbtn] = useState(true);
  const [openAddBox, setOpenAddBox] = useState(false);
  const [penaltyOption, setPenaltyOption] = useState(0);
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);

  const [textToCopy, setTextToCopy] = useState('Text to copy');
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const [value, setValue] = React.useState('1');
  const [updateClick, setUpdateClick] = useState(true);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const closeConfirmBoxReactivate = (dd, reason) => {
    setOpenConfirmBoxReactivate(false);
    setId(null);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/vehicle-reg/activateVehicle/${id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              `${res?.data?.data?.vehicleNumberPlate}'s reactivated`,
            );
            // toast.success('vehicle reactivated successfully');
            getFilterData();
          }
        });
    }
  };
  useEffect(() => {
    getFilterData();
    // getGpsProviderList();
  }, [filter]);

  const getFilterData = () => {
    let url_ = Api.baseUri + '/api/dashboard/employee/filter';
    let post_ = {
      collection: 'AssociateVehicle',
      // user?.userList?.userRole == 'VENDOR'
      //   ? 'AssociateVehicleVendor'
      //   : 'AssociateVehicleCorporate',
      // collection: 'VehicleReg',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'AssociateVehicle',
      // user?.userList?.userRole == 'VENDOR'
      //   ? 'AssociateVehicleVendor'
      //   : 'AssociateVehicleCorporate',
      // collection: 'VehicleReg',
      pageNo: 1,
      pageSize: 1000,
    };
    axios
      .post(url_, !filter || _.isEmpty(filter) ? def_post : post_)
      .then((re_) => {
        axios
          .get(Api.baseUri + '/user-reg/gps-vehicle/get-AllGpsVehicle')
          .then((res) => {
            if (res && res.data && res.data.data) {
              setGpsVehicle(res?.data?.data);
              let gpsVehicleData = res?.data?.data;
              let filterData = re_?.data?.data;
              let mapArr1 = gpsVehicleData.reduce((acc, obj) => {
                if (obj.vehicleNumberPlate)
                  acc[obj.vehicleNumberPlate] = obj.id;
                return acc;
              }, {});
              let updatedFilterRes = filterData.map((obj) => {
                if (mapArr1.hasOwnProperty(obj.vehicleNumberPlate))
                  return {...obj, gpsId: mapArr1[obj.vehicleNumberPlate]};
                return obj;
              });
              setFilterRes(updatedFilterRes);
            }
          });
        console.log('updatedFilterRes', updatedFilterRes);
      })
      .catch((err) => {
        setFilterRes([]);
      });
  };

  const getGpsProviderList = (corpId) => {
    // debugger
    let temAr = [];
    // /user-reg/vendor-reg/get-All-Vendor-By-CorporateId/645caf975115e85968471fcf
    // https://uatapi.etravelmate.com/user-reg/gps-provider/get-AllgpsVendorAssociateWithCorporate
    axios
      .get(
        `${Api.baseUri}/user-reg/gps-provider/get-AllgpsVendorAssociateWithCorporate`,
      )
      // .get(Api.baseUri + '/user-reg/gps-provider/get-AllgpsProvider')
      .then((re_) => {
        re_?.data['data']?.map((r) => {
          console.log('r', r);
          temAr.push({
            title: r?.gpsVendorName,
            value: r?.gpsVendorId,
          });
        });
        setGpsProviderId(temAr ?? []);
      })
      .catch((err) => {
        setGpsProviderId([]);
      });
  };

  const getGpsVehicleDetail = (ids) => {
    axios
      .get(`${Api.baseUri}/user-reg/gps-vehicle/get-gpsVehicle-by-id/${ids}`)
      .then((res) => {
        if (res && res.data && res.data.data) {
          console.log('res', res?.data?.data);
          setVehicleGpsId(res?.data?.data || {});
        }
      })
      .catch((err) => {
        setVehicleGpsId({});
        console.error('Error fetching GPS vehicles:', err);
      });
  };

  function popBTNClick(val) {
    getFilterData();
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

  let templateGps = {
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
        layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
        id: 'assign_driver',
        fields: [
          {
            type: 'text',
            name: 'imeiNO',
            id: 'imeiNO',
            title: 'Enter IMEI Number',

            validationProps: {
              required: 'This is a mandatory field',
            },
            pattern: {
              value: regex.imeiRegex,
              message:
                'Please enter valid IMEI (i.e.:  WW-XXXXXX-YYYYYY-Z) upto 15-17 character',
            },
          },
          {
            type: 'autocomplete',
            name: 'vendorId',
            id: 'vendorId',
            title: 'GPS Vendor List',
            // disabled: id,
            infoMessage: ['Dropdown values are selectable', 'e.g.: Drive'],
            options: gpsProviderId ?? [],
            // validationProps: {
            //   required: 'This is a mandatory field',
            // },
          },
          {
            type: 'hidden',
            name: 'vehicleNo',
            id: 'vehicleNo',
            title: 'vehicleNumber',
            defaultValue: vehicleNo,
          },
          {
            type: 'hidden',
            name: 'corporateName',
            id: 'corporateName',
            title: 'campanyName',
            defaultValue: corporateName,
          },
          // {
          //   type: 'hidden',
          //   name: 'vendorId',
          //   id: 'vendorId',
          //   title: 'vendorId',
          //   defaultValue: gpsProviderId ?? [],
          // },
        ],
      },
    ],
  };

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
          {
            type: 'autocomplete',
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
            title: 'Shift To Time',
            disabled: false,
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
            name: 'totalMinForPresent',
            id: 'totalMinForPresent',
            title: 'Minutes for full day',
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
            name: 'totalMinForHalfDay',
            id: 'totalMinForHalfDay',
            title: 'Minutes for half day',
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
      {
        title: 'Vendor Name',
        field: 'vendorName',
      },
      {
        title: 'Fuel Type',
        field: 'fuelType',
      },
      {
        title: 'Vehicle Type',
        field: 'vehicleTypeName',
      },
      {
        title: 'Model Name',
        field: 'modelName',
      },
      // {
      //   title: 'Vehicle  registration Number',
      //   field: "regNumber"
      // },
      // {
      //   title: 'Owner Name',
      //   field: 'ownerName',
      // },
      // {
      //   title: 'Email ',
      //   field: 'ownerEmail',
      // },
      // {
      //   title: 'Mobile ',
      //   field: 'ownerMobile',
      // },
      {
        title: 'Status',
        field: 'status',
        render: (rowData) =>
          rowData.status == 'ACTIVE' ? (
            <span style={{color: 'green'}}>ACTIVE</span>
          ) : rowData.status == 'INACTIVE' ? (
            <span style={{color: 'red'}}>INACTIVE</span>
          ) : (
            rowData.status
          ),
      },
      {
        title: 'Created by',
        field: 'createdOn',
        render: (rd) => {
          return (
            rd.createdBy +
            '  ' +
            moment(rd.createdOn).format('DD/MM/YYYY HH:MM')
          );
        },
      },
      {
        title: 'Last Updated',
        field: 'updatedOn',
        type: 'datetime',
      },
    ],
  };
  const VendortableTemplate = {
    columns: [
      {
        title: 'Vehicle Brand',
        field: 'vehicleBrand',
      },
      {
        title: 'Vehicle Number',
        field: 'vehicleNumberPlate',
      },

      {
        title: 'Fuel Type',
        field: 'fuelType',
      },

      {
        title: 'Vehicle Type',
        field: 'vehicleTypeName',
      },

      // {
      //   title: 'Vehicle  registration Number',
      //   field: "regNumber"
      // },
      // {
      //   title: 'Owner Name',
      //   field: 'ownerName',
      // },
      // {
      //   title: 'Email ',
      //   field: 'ownerEmail',
      // },
      // {
      //   title: 'Mobile ',
      //   field: 'ownerMobile',
      // },
      {
        title: 'Status',
        field: 'status',
        render: (rowData) =>
          rowData.status == 'ACTIVE' ? (
            <span style={{color: 'green'}}>ACTIVE</span>
          ) : rowData.status == 'INACTIVE' ? (
            <span style={{color: 'red'}}>INACTIVE</span>
          ) : (
            rowData.status
          ),
      },
      {
        title: 'Created by',
        field: 'createdOn',
        render: (rd) => {
          return (
            rd.createdBy +
            '  ' +
            moment(rd.createdOn).format('DD/MM/YYYY HH:MM')
          );
        },
      },
      {
        title: 'Last Updated',
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

  function handleClickGps(rowData) {
    // debugger
    setGpsID(rowData?._id);
    setVehicleNo(rowData?.vehicleNumberPlate);
    setCorporateName(rowData?.corporateId);
    console.log('rowData', rowData);
    getGpsProviderList(rowData?.corporateId);
    setVehicleGpsId({});
    // if( rowData && !rowData?.gpsId){
    //     setOpenGpsDialog(true)
    // }
    // if(rowData?.gpsId){
    //   setOpenGpsUpdateDialog(true)
    //   getGpsVehicleDetail(rowData?.gpsId || "")
    // }
    // rowData?.gpsId ?  getGpsVehicleDetail(rowData?.gpsId || "") : "";
    // setOpenGpsDialog(true);
    const matchingEntry = gpsVehicle.find(
      (entry) => entry.vehicleNumberPlate === rowData.vehicleNumberPlate,
    );
    if (rowData?.gpsId || matchingEntry?.id) {
      getGpsVehicleDetail(rowData?.gpsId || matchingEntry?.id);
      setOpenGpsDialogData(true);
    } else {
      setOpenGpsDialog(true);
    }
  }

  console.log('filterRes', filterRes);
  function handleAddBoxIcon(rowData) {
    setOpenAddBox(true);
    getGpsProviderList(rowData?.corporateId);
    setVehicleNo(rowData?.vehicleNumberPlate);
    setCorporateName(rowData?.corporateId);
    handleDriverShift(rowData);
    const matchingEntry = gpsVehicle.find(
      (entry) => entry.vehicleNumberPlate === rowData.vehicleNumberPlate,
    );
    if (rowData?.gpsId || matchingEntry?.id) {
      getGpsVehicleDetail(rowData?.gpsId || matchingEntry?.id);
    }
  }

  function handleAddBoxIconClose() {
    setOpenAddBox(false);
    setBackendGpsKey('');
    setOpenGpsUpdateDialog('');
  }
  function handleGpsFormClose() {
    setOpenGpsDialog(false);
    setOpenGpsDialogData(false);
    setOpenGpsUpdateDialog(false);
  }
  function handleGpsSubmit(values) {
    // setOpenGpsDialog(false)
    console.log('valuess', values);
    let postData = {
      imeiNO: values?.data?.imeiNO,
      vendorId: values?.data?.vendorId,
      vehicleNumberPlate: values?.data?.vehicleNo,
      corporateName: values?.data?.corporateName,
    };
    gpsProviderId?.map((el) => {
      console.log('el', el);
      if (el?.value == values?.data?.vendorId) postData.vendorName = el?.title;
    });
    console.log('postData', postData);
    axios
      .post(`${Api.baseUri}/user-reg/gps-vehicle/save-gpsVehicle`, postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Vehicle GPS added successfully');
          setBackendGpsKey(res?.data?.data);
          setBackendGpsKey(res?.data?.data?.securityKey);
          getFilterData();
          handleGpsFormClose();
        } else {
          toast.error(res?.data?.message ?? 'Something went wrong');
        }
      })
      .catch((er) => {
        // handleClicked(false);
        toast.error(err ?? 'Something went wrong');
      });
  }
  const searchVehicle = (val) => {
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
    console.log('email', mob, email);
    axios
      .get(
        `${Api.baseUri}/user-reg/associateVehicle/search-vehicle?vehicleNo=${email}`,
      )
      .then((re) => {
        if (!re?.data?.data?.id) toast.error('No record found.');
        console.log('elll', re);
        setVehicleData({...re?.data?.data});
        // let tem_bool = true;
        // re?.data?.data?.id &&
        //   filterRes?.length &&
        //   filterRes?.map((ell) => {
        //     console.log("err", ell)
        //     if (re?.data?.data?.id == ell?._id) {
        //       toast.error('Already exists.');
        //       tem_bool = false;
        //     }
        //   }); //vendorList
        // if (tem_bool) setVendorData({...re?.data?.data});
      })
      .catch((err) => {
        setVehicleData({});
      });
  };
  function SecretFun(search, value) {
    if (search?.toUpperCase() == 'SEARCH') {
      searchVehicle(value);
    } else return;
  }

  function handleGpsUpdateSubmit(values) {
    console.log('values', values);
    if (values.button.toUpperCase() === 'UPDATE') {
      let postData = {
        imeiNO: values?.data?.imeiNO,
        vendorId: values?.data?.vendorId,
        vehicleNumberPlate: values?.data?.vehicleNumberPlate,
        corporateName: values?.data?.corporateName,
        id: values?.data?.id,
        securityKey: values?.data?.securityKey,
      };
      // debugger
      gpsProviderId?.map((el) => {
        if (el?.value == values?.data?.vendorId) {
          postData.vendorName = el?.title;
        }
      });
      console.log('postData', postData);
      axios
        .put(`${Api.baseUri}/user-reg/gps-vehicle/update-gpsVehicle`, postData)
        .then((response) => {
          // handleClicked(false);
          if (response?.data?.status == '200') {
            setBackendGpsKey(response?.data?.data || '');
            toast.success('Gps updated successfully.');
            getFilterData();
            setUpdateClick(true);
            setOpenAddBox(false);
            handleGpsFormClose();
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
        })
        .catch((er) => {
          // handleClicked(false);
          toast.error(err ?? 'Something went wrong');
        });

      // setBackendGpsUpdateKey("UNIQUE KEY UPDATE")
      console.log('data', data);
    }
  }
  console.log('setBackendGpsKey', backendGpsKey);
  function handleClickView(rowData) {
    // navigate('/onboardadmin/vehicle/detailPage/' + rowData._id);
    setId(rowData?._id);
    setOpenDetail(true);
  }
  function handleClickEdit(rowData) {
    // navigate('/onboardadmin/vehicle/editPage/' + rowData._id);
    setopenDialog(true);
    setdialID(rowData?._id);
  }

  function handleDelete(rowData) {
    setId(rowData?._id);
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
    getFilterData();
    // setTimeout(() => {
    //   if (user?.role == "VENDOR") {
    //     getAllDriver()
    //   }
    //   else tableRef.current && tableRef.current.onQueryChange()
    // }, 0);
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
                title: 'Vehicle Number plate',
                field: 'vendorId',
                // pattern: {
                //   value: regex.phoneORemailReg,
                //   message: 'Please enter valid Time',
                // },
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
                title: 'Vehicle Name',
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
  function handleDriverShift(rowData) {
    setVehicleName(rowData?.vehicleBrand);
    setVehicleNumber(rowData?.vehicleNumberPlate);
    setVehicleId(rowData._id);
    // setVendorIds(rowData?.vendorId)
    let url = `${api.driver.driverMap}/get-all-actvice-mapping-by-vehicleid/${rowData._id}`;
    let temp=[]
    if (url) {
      axios.get(url).then((result) => {
      result?.data?.data?.map((el)=>{
        temp.push(el?.driverId)
      })
     
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
            value: re?._id,
          });
        });
        setShiftList(s_arr);
      });
    }
    let url2 =
      user?.role == 'VENDOR'
        ? `${api.driver.freeDriver}`
        : api.baseUri +
          '/user-reg/driver-reg/get-all-free-driver-by-vendorid/' +
          rowData?.vendorId;
    if (url2) {
      axios.get(url2).then((result) => {
        let arr = [];
        result?.data?.data?.map((re) => {
          arr.push({title: re?.firstName + ' ' + re?.lastName, value: re?.id});
        });
        let newArr = arr.filter(driId => !temp.some(item => item === driId.value))
        setFreeDiverList(newArr);
        getFilterData();
      });
    }

    // setOpenDriverShift(true); //Temporarily, I commented because the design has changed.
  }
  const handleDialog = (val) => {
    setshowbtn(false);
    if (!vehicleData?.id) {
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
            `/user-reg/associateVehicle/associateVehicleToCorporate/vehicle/${vehicleData?.id}/corporate/${user?.userList?.corporateId}`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(res?.data?.message);
          } else if (res?.data?.status == '400') {
            toast.error(res?.data?.message);
          } else {
            toast.error('Something went wrong!!!!');
          }
          setVehicleData({});
          setOpenAssociate(false);
          getFilterData();
        })
        .catch((err) => {
          setVehicleData({});
          setOpenAssociate(false);
          toast.error('Something went wrong.');
        });
    }
  };
  const removeDriverShift = async (data) => {
    let url = `${api.driver.driverMap}/remove-mapping-by-id/${data.id}`;
    axios
      .get(url)
      .then((result) => {
        toast.success(
          `${result?.data?.data?.driverName} has been unassigned from ${result?.data?.data?.vehicleNumber}`,
        );
        // toast.success('Driver-Vehicle mapping is successfully deleted.');
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
      if (result?.data?.status == '200') {
        toast.success(
          `${result?.data?.data?.driverName} is successfully assigned to ${result?.data?.data?.vehicleNumber}`,
        );
        setOpenAddBox(false);
        getFilterData();
        // toast.success(
        //   result?.data?.message ?? 'Driver mapped successfully with vehicle.',
        // );
        setOpenDriverShift(false);
      }
    });
  };

  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };

  const closeConfirmBox = (dd, reason) => {
    if (dd == 'YES') {
      axios
        .post(
          `${api.vehicle.list}/deactivatevehicle/${id}/${
            reason?.length ? reason : null
          }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(
              `${response?.data?.data?.vehicleNumberPlate}'s deactivated`,
            );
            getFilterData();
            setOpenConfirmBox(false);
          }
        })
        .catch((err) => {});
    } else {
      setOpenConfirmBox(false);
    }
  };

  // console.log("filterRes",filterRes);
  // console.log("gpsVehicle",gpsVehicle);
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} sm={3} md={4} sx={{mb: 2}}>
          <CustomLabel
            labelVal='Vehicles Driver GPS Mapping'
            variantVal='h3-underline'
          />
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <QuickSearchPage
            masterKey='vehicleNumberPlate'
            module={
              'AssociateVehicle'
              // user?.userList?.userRole == 'VENDOR'
              //   ? 'AssociateVehicleVendor'
              //   : 'AssociateVehicleCorporate'
            }
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            displayFields={['vehicleNumberPlate', 'vehicleBrand', 'fuelType']}
            filterRes={filterRes}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={4} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add Filter'}>
                <FilterAltOutlinedIcon
                  className='title-icons-mui'
                  style={{color: _.isEmpty(filter) ? '' : '#ff9800'}}
                  onClick={() => {
                    setfilterShow(true);
                    setOpenFilter(true);
                  }}
                />
              </AppTooltip>
              <AppTooltip placement={'top'} title={'Clear Filter'}>
                <img
                  src='/assets/images/clear-filter.png'
                  onClick={() => {
                    setfilterShow(false);
                    setFilter({});
                    handleClosefilter({button: 'clear'});
                  }}
                  className='title-icons-mui'
                />
              </AppTooltip>
              {myActions?.includes('Create') && params?.id == 'Def' && (
                <AppTooltip placement={'top'} title={'Add New Vehicle'}>
                  <img
                    src='/assets/images/title-icon/add vehicles.svg'
                    className='title-icons-mui'
                    onClick={handleOpenform}
                  />
                </AppTooltip>
              )}
              {params?.id == 'associate' && (
                <AppTooltip placement={'top'} title={'Associate Vehicle'}>
                  <AddchartIcon
                    onClick={() => {
                      setOpenAssociate(true);
                    }}
                  />
                </AppTooltip>
              )}
            </div>
            {myActions?.includes('Download And Upload') && (
              <ExcelContainer
                downloadFile={'Vehicle'}
                downloadURL={'/user-reg/vehicle-driver-mapping/download'}
                getHeadersUrl={'/user-reg/vehicle-driver-mapping/headerdata'}
                downloadTempURL={
                  '/user-reg/vehicle-driver-mapping/download-template'
                }
                uploadURL={'/user-reg/vehicle-driver-mapping/import-excel'}
              />
            )}
          </Box>
        </Grid>
      </Grid>
      {console.log('dailIdeeeeeeee', dialID)}
      {openDialog && dialID && (
        <EditVendor
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}
      {/* <Button id='btnMui123' variant='outlined' sx={{ mb: 2, background: "#fdfdfd" }} onClick={(e) => { setOpenFilter(true) }}>
          <FilterAltIcon sx={{ fontSize: '18px', marginBottom: '3px' }} />
          Filter
        </Button> */}

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
        columns={
          user?.userList?.userRole == 'VENDOR'
            ? VendortableTemplate.columns
            : tableTemplate.columns
        }
        // tableRef={tableRef}
        data={filterRes || []}
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          // (rd) =>
          //   myActions?.includes('Assign') && {
          //     icon: () => (
          //       <GpsFixedIcon
          //         color='primary'
          //         style={{opacity: rd?.status == 'INACTIVE' ? '0.3' : ''}}
          //       />
          //     ),
          //     tooltip: 'GPS and Vehicle Mapping',
          //     onClick: (event, rowData) => {
          //       setBackendGpsKey('');
          //       if (rowData?.status == 'INACTIVE') {
          //         return;
          //       }
          //       handleAddBoxIcon(rowData);
          //       // handleClickGps(rowData);
          //     },
          //   },
          (rd) =>
            myActions?.includes('Assign') && {
              icon: () => (
                <GpsFixedIcon
                  color='primary'
                  style={{opacity: rd?.status == 'INACTIVE' ? '0.3' : ''}}
                />
              ),
              tooltip: 'Vehicles Driver GPS Mapping',
              onClick: (event, rowData) => {
                setBackendGpsKey('');
                if (rowData?.status == 'INACTIVE') {
                  return;
                }
                // handleClickGps(rowData);
                handleAddBoxIcon(rowData);
              },
            },
          //   (rd) =>
          //     myActions?.includes('Assign') && {
          //       icon: () => (
          //         <AssignmentTurnedInIcon
          //           color='primary'
          //           style={{opacity: rd?.status == 'INACTIVE' ? '0.3' : ''}}
          //         />
          //       ),
          //       tooltip: 'Associate Driver',
          //       onClick: (event, rowData) => {
          //         if (rowData?.status == 'INACTIVE') {
          //           return;
          //         }
          //         handleDriverShift(rowData);
          //       },
          //     },
          //   (rd) =>
          //     myActions?.includes('Edit') && {
          //       icon: () => (
          //         <EditIcon
          //           color='primary'
          //           style={{opacity: rd?.status == 'INACTIVE' ? '0.3' : ''}}
          //         />
          //       ),
          //       tooltip: 'Edit',
          //       onClick: (event, rowData) => {
          //         if (rowData?.status == 'INACTIVE') {
          //           return;
          //         }
          //         handleClickEdit(rowData);
          //       },
          //     },
          //   myActions?.includes('View') && {
          //     icon: () => <VisibilityIcon color='primary' />,
          //     tooltip: 'View',
          //     onClick: (event, rowData) => handleClickView(rowData),
          //   },
          //   (rd) =>
          //     myActions?.includes('Deactivate') && {
          //       icon: () => (
          //         <DeleteIcon
          //           color='primary'
          //           style={{
          //             opacity: rd?.status == 'INACTIVE' ? '0.3' : '',
          //             color: '#bc0805',
          //           }}
          //         />
          //       ),
          //       tooltip: 'Deactivate',
          //       onClick: (event, rowData) => {
          //         if (rowData?.status == 'INACTIVE') {
          //           return;
          //         }
          //         handleDelete(rowData);
          //       },
          //     },
          //   (rd) =>
          //     myActions?.includes('Edit') && {
          //       icon: () => (
          //         <RestoreIcon
          //           color='primary'
          //           style={{opacity: rd?.status == 'INACTIVE' ? '' : '0.2'}}
          //         />
          //       ),
          //       tooltip: 'Reactivate',
          //       onClick: (event, rowData) => {
          //         console.log(rowData);
          //         if (rowData?.status == 'INACTIVE') {
          //           setId(rowData?._id);
          //           setOpenConfirmBoxReactivate(true);
          //         }
          //       },
          //     },
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
        open={openAddBox}
        onClose={() => {
          handleAddBoxIconClose();
        }}
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '50%',
          },
        }}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Vehicles Driver GPS Mapping</h1>
          <CloseIcon
            onClick={() => {
              handleAddBoxIconClose();
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div>
            <Box style={{margin: '1.5rem'}}>
              <TabContext value={value}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                  <TabList
                    onChange={handleChange}
                    aria-label='lab API tabs example'
                  >
                    <Tab label='Map Driver' value='1' />
                    <Tab label='Update GPS' value='2' />
                  </TabList>
                </Box>
                <TabPanel value='1'>
                  <div>
                    <div
                      style={{
                        padding: '20px',
                        paddingBottom: '0',
                        marginTop: '10px',
                      }}
                    >
                      <span>
                        <b>Vehicle Brand: </b> {vehicleName}
                      </span>
                      <span>
                        &nbsp;&nbsp;&nbsp;<b>Vehicle Number: </b>{' '}
                        {vehicleNumber}
                      </span>
                    </div>
                    <div style={{padding: '20px', paddingTop: '0'}}>
                      <SmartForm
                        template={template}
                        // defaultValues={formData}
                        onSubmit={handleSubmit}
                        buttons={['submit']}
                      />
                      <br />
                      <div>
                        <CustomLabel
                          labelVal='Drivers Mapped With Vehicle'
                          variantVal='h3-underline'
                        />
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
                          title='Assigned Drivers'
                          columns={driverTableTemplate.columns}
                          // tableRef={tableRef}
                          data={diverList ?? []}
                          options={{
                            search: false,
                            showTitle: false,
                            actionsColumnIndex: -1,
                            headerStyle: {
                              position: 'sticky',
                              top: 0,
                              padding: '2px',
                            },
                          }}
                          actions={[
                            {
                              icon: () => (
                                <DeleteIcon
                                  color='primary'
                                  style={{color: '#bc0805'}}
                                />
                              ),
                              tooltip: 'Delete assigned driver',
                              onClick: (event, rowData) =>
                                removeDriverShift(rowData),
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
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value='2'>
                  <div>
                    {vehicleGpsId?.securityKey || backendGpsKey ? (
                      <DialogContent
                        style={{padding: '0px', marginTop: '10px'}}
                      >
                        {updateClick === true ? (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-around',
                              padding: '20px',
                              paddingTop: '0',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1rem',
                              }}
                            >
                              <div style={{display: 'flex'}}>
                                <h1>IMEI No. - </h1>
                                <h3 style={{padding: '4px 0px 0px 8px'}}>
                                  {vehicleGpsId?.imeiNO ||
                                    backendGpsKey?.imeiNO ||
                                    'NA'}
                                </h3>
                              </div>
                              <div style={{display: 'flex'}}>
                                <h1>Vendor Name - </h1>
                                <h3 style={{padding: '4px 0px 0px 8px'}}>
                                  {vehicleGpsId?.vendorName ||
                                    backendGpsKey?.vendorName ||
                                    'NA'}
                                </h3>
                              </div>
                            </div>
                            <Button
                              variant='contained'
                              onClick={() => {
                                // setOpenGpsDialog(false);
                                // setOpenAddBox(false);
                                // setOpenGpsUpdateDialog(true);
                                setUpdateClick(false);
                              }}
                            >
                              Update
                            </Button>
                          </div>
                        ) : (
                          <div
                            style={{
                              padding: '20px',
                              paddingTop: '0',
                              marginTop: '10px',
                            }}
                          >
                            {vehicleGpsId?.id && (
                              <SmartForm
                                template={templateGps}
                                defaultValues={vehicleGpsId}
                                onSubmit={handleGpsUpdateSubmit}
                                buttons={['Update']}
                              />
                            )}
                            <br />
                            {(vehicleGpsId?.securityKey ||
                              backendGpsKey?.imeiNO) && (
                              <div
                                style={{
                                  padding: '20px',
                                  paddingTop: '0',
                                  backgroundColor: 'rgb(245, 242, 242)',
                                  borderRadius: '10px',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '8rem',
                                    paddingTop: '21px',
                                  }}
                                >
                                  <div style={{display: 'flex'}}>
                                    <h1>IMEI No. - </h1>
                                    <h3 style={{padding: '4px 0px 0px 8px'}}>
                                      {vehicleGpsId?.imeiNO ||
                                        backendGpsKey?.imeiNO ||
                                        'NA'}
                                    </h3>
                                  </div>
                                  <div style={{display: 'flex'}}>
                                    <h1>Vendor Name - </h1>
                                    <h3 style={{padding: '4px 0px 0px 8px'}}>
                                      {vehicleGpsId?.vendorName ||
                                        backendGpsKey?.vendorName ||
                                        'NA'}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    ) : (
                      <DialogContent style={{padding: '0px'}}>
                        <div style={{padding: '20px', paddingTop: '0'}}>
                          <SmartForm
                            template={templateGps}
                            // defaultValues={formData}
                            onSubmit={handleGpsSubmit}
                            buttons={['submit']}
                          />
                          <br />
                        </div>
                      </DialogContent>
                    )}
                  </div>
                </TabPanel>
              </TabContext>
            </Box>
            {/* <Grid container spacing={2} sx={{padding: '0px'}}>
              <Grid item xs={9} style={{borderRight: '1px solid #efefef'}}>
                <div style={{padding: '10px'}}>
                  {penaltyOption == 0 ? (
                    <div>
                      <div
                        style={{
                          padding: '20px',
                          paddingBottom: '0',
                          marginTop: '10px',
                        }}
                      >
                        <span>
                          <b>Vehicle Brand: </b> {vehicleName}
                        </span>
                        <span>
                          &nbsp;&nbsp;&nbsp;<b>Vehicle Number: </b>{' '}
                          {vehicleNumber}
                        </span>
                      </div>
                      <div style={{padding: '20px', paddingTop: '0'}}>
                        <SmartForm
                          template={template}
                          // defaultValues={formData}
                          onSubmit={handleSubmit}
                          buttons={['submit']}
                        />
                        <br />
                        <div>
                          <CustomLabel
                            labelVal='Drivers Mapped With Vehicle'
                            variantVal='h3-underline'
                          />
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
                            title='Assigned Drivers'
                            columns={driverTableTemplate.columns}
                            // tableRef={tableRef}
                            data={diverList ?? []}
                            options={{
                              search: false,
                              showTitle: false,
                              actionsColumnIndex: -1,
                              headerStyle: {
                                position: 'sticky',
                                top: 0,
                                padding: '2px',
                              },
                            }}
                            actions={[
                              {
                                icon: () => (
                                  <DeleteIcon
                                    color='primary'
                                    style={{color: '#bc0805'}}
                                  />
                                ),
                                tooltip: 'Delete assigned driver',
                                onClick: (event, rowData) =>
                                  removeDriverShift(rowData),
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
                      </div>
                    </div>
                  ) : null}
                  {penaltyOption == 1 ? (
                    <div>
                      {vehicleGpsId?.securityKey || backendGpsKey ? (
                        <DialogContent style={{padding: '0px', marginTop: '10px'}}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            padding: '20px',
                            paddingTop: '0',
                          }}
                        >
                          <div
                            style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}
                          >
                            <div style={{display: 'flex'}}>
                              <h1>IMEI No. - </h1>
                              <h3 style={{padding: '4px 0px 0px 8px'}}>
                                {vehicleGpsId?.imeiNO || backendGpsKey?.imeiNO || 'NA'}
                              </h3>
                            </div>
                            <div style={{display: 'flex'}}>
                              <h1>Vendor Name - </h1>
                              <h3 style={{padding: '4px 0px 0px 8px'}}>
                                {vehicleGpsId?.vendorName ||
                                  backendGpsKey?.vendorName ||
                                  'NA'}
                              </h3>
                            </div>
                          </div>
                          <Button
                            variant='contained'
                            onClick={() => {
                              setOpenGpsDialog(false);
                              setOpenGpsUpdateDialog(true);
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      </DialogContent>
                      ) : (
                        <DialogContent style={{padding: '0px'}}>
                          <div style={{padding: '20px', paddingTop: '0'}}>
                            <SmartForm
                              template={templateGps}
                              // defaultValues={formData}
                              onSubmit={handleGpsSubmit}
                              buttons={['submit']}
                            />
                            <br />
                          </div>
                        </DialogContent>
                      )}
                    </div>
                  ) : null}
                </div>
              </Grid>
              <Grid item xs={3} style={{padding: '0'}}>
                <div className='sticky-container' style={{top: '0px'}}>
                  <div
                    className='penalty-compliance-right-option'
                    onClick={() => {
                      setPenaltyOption(0);
                      // setMySummary([]);
                    }}
                    style={{
                      marginBottom: '2px',
                      color: penaltyOption == 0 ? '#ffa500' : '',
                    }}
                  >
                    Driver Vehicle Mapping
                  </div>
                  <div
                    className='penalty-compliance-right-option'
                    onClick={() => {
                      setPenaltyOption(1);
                      // setOpenGpsDialogData(true)
                      // setMySummary([]);
                    }}
                    style={{
                      marginBottom: '2px',
                      color: penaltyOption == 1 ? '#ffa500' : '',
                    }}
                  >
                    Add GPS
                  </div>
                </div>
              </Grid>
            </Grid> */}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        // onClose={handleClose}
        open={openGpsDialog}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '50%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <>
          {
            <DialogTitle>
              <h1>
                {' '}
                {vehicleGpsId?.securityKey || backendGpsKey?.imeiNO
                  ? 'GPS Vendor'
                  : 'ADD GPS'}
              </h1>
              <CloseIcon
                onClick={handleGpsFormClose}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '14px',
                  cursor: 'pointer',
                }}
              />
            </DialogTitle>
          }
          {console.log('backendGpsKey', vehicleGpsId)}
          {vehicleGpsId?.securityKey || backendGpsKey?.imeiNO ? (
            // <DialogContent style={{padding: '0px', marginTop: '10px'}}>
            //   <div style={{padding: '20px', paddingTop: '0'}}>
            //     {(vehicleGpsId?.securityKey || backendGpsKey) && (
            //       <div
            //         style={{
            //           display: 'flex',
            //           justifyContent: 'center',
            //           gap: '1rem',
            //         }}
            //       >
            //         <h1>
            //           {vehicleGpsId?.securityKey || backendGpsKey || 'NA'}
            //         </h1>
            //         <CopyToClipboard
            //           text={vehicleGpsId?.securityKey || backendGpsKey || 'NA'}
            //           style={{cursor: 'pointer'}}
            //           onCopy={handleCopy}
            //         >
            //           <ContentCopyIcon />
            //         </CopyToClipboard>
            //         {isCopied && (
            //           <span style={{marginLeft: '5px'}}>Copied!</span>
            //         )}
            //         <br />
            //       </div>
            //     )}
            //   </div>
            // </DialogContent>
            <DialogContent style={{padding: '0px', marginTop: '10px'}}>
              <div style={{padding: '20px', paddingTop: '0'}}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                  }}
                >
                  <div style={{display: 'flex'}}>
                    <h1>IMEI No. - </h1>
                    <h3 style={{padding: '4px 0px 0px 8px'}}>
                      {vehicleGpsId?.imeiNO || backendGpsKey?.imeiNO || 'NA'}
                    </h3>
                  </div>
                  <div style={{display: 'flex'}}>
                    <h1>Vendor Name - </h1>
                    <h3 style={{padding: '4px 0px 0px 8px'}}>
                      {vehicleGpsId?.vendorName ||
                        backendGpsKey?.vendorName ||
                        'NA'}
                    </h3>
                  </div>
                </div>
                {console.log('lsdkfjdslfds', backendGpsKey)}
              </div>
            </DialogContent>
          ) : (
            <DialogContent style={{padding: '0px'}}>
              <div style={{padding: '20px', paddingTop: '0'}}>
                <SmartForm
                  template={templateGps}
                  // defaultValues={formData}
                  onSubmit={handleGpsSubmit}
                  buttons={['submit']}
                />
                <br />
              </div>
            </DialogContent>
          )}
        </>
      </Dialog>

      <Dialog
        // onClose={handleClose}
        open={openGpsDialogData}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '50%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <>
          <DialogTitle>
            <h1> GPS Vendor</h1>
            <CloseIcon
              onClick={handleGpsFormClose}
              style={{
                position: 'absolute',
                right: '12px',
                top: '14px',
                cursor: 'pointer',
              }}
            />
          </DialogTitle>
          {/* <DialogContent style={{padding: '0px', marginTop: '10px'}}>
            <div style={{padding: '20px', paddingTop: '0'}}>
              <div
                style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}
              >
                <h1>{vehicleGpsId?.securityKey || backendGpsKey || 'NA'}</h1>
                <CopyToClipboard
                  text={vehicleGpsId?.securityKey || backendGpsKey || 'NA'}
                  style={{cursor: 'pointer'}}
                  onCopy={handleCopy}
                >
                  <ContentCopyIcon />
                </CopyToClipboard>
                {isCopied && <span style={{marginLeft: '5px'}}>Copied!</span>}
                <br />
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpenGpsDialog(false);
                    setOpenGpsUpdateDialog(true);
                  }}
                >
                  Update
                </Button>
              </div>
            </div>
          </DialogContent> */}
          <DialogContent style={{padding: '0px', marginTop: '10px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '20px',
                paddingTop: '0',
              }}
            >
              <div
                style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}
              >
                <div style={{display: 'flex'}}>
                  <h1>IMEI No. - </h1>
                  <h3 style={{padding: '4px 0px 0px 8px'}}>
                    {vehicleGpsId?.imeiNO || backendGpsKey?.imeiNO || 'NA'}
                  </h3>
                </div>
                <div style={{display: 'flex'}}>
                  <h1>Vendor Name - </h1>
                  <h3 style={{padding: '4px 0px 0px 8px'}}>
                    {vehicleGpsId?.vendorName ||
                      backendGpsKey?.vendorName ||
                      'NA'}
                  </h3>
                </div>
              </div>
              <Button
                variant='contained'
                onClick={() => {
                  setOpenGpsDialog(false);
                  setOpenGpsUpdateDialog(true);
                }}
              >
                Update
              </Button>
            </div>
          </DialogContent>
        </>
      </Dialog>

      <Dialog
        // onClose={handleClose}
        open={openGpsUpdateDialog}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '50%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>Update GPS</h1>
          <CloseIcon
            onClick={handleGpsFormClose}
            style={{
              position: 'absolute',
              right: '12px',
              top: '14px',
              cursor: 'pointer',
            }}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          {console.log('vehicleGpsId', vehicleGpsId)}
          <div style={{padding: '20px', paddingTop: '0', marginTop: '10px'}}>
            {vehicleGpsId?.id && (
              <SmartForm
                template={templateGps}
                defaultValues={vehicleGpsId}
                onSubmit={handleGpsUpdateSubmit}
                buttons={['Update']}
              />
            )}
            <br />
            {(vehicleGpsId?.securityKey || backendGpsKey?.imeiNO) && (
              // (<div
              //     style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}
              //   >
              //     <h1>{vehicleGpsId?.securityKey || backendGpsKey}</h1>
              //     <CopyToClipboard
              //       text={vehicleGpsId?.securityKey || backendGpsKey}
              //       style={{cursor: 'pointer'}}
              //       onCopy={handleCopy}
              //     >
              //       <ContentCopyIcon />
              //     </CopyToClipboard>
              //     {isCopied && <span style={{marginLeft: '5px'}}>Copied!</span>}
              //   </div>)
              <div style={{padding: '20px', paddingTop: '0'}}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                  }}
                >
                  <div style={{display: 'flex'}}>
                    <h1>IMEI No. - </h1>
                    <h3 style={{padding: '4px 0px 0px 8px'}}>
                      {vehicleGpsId?.imeiNO || backendGpsKey?.imeiNO || 'NA'}
                    </h3>
                  </div>
                  <div style={{display: 'flex'}}>
                    <h1>Vendor Name - </h1>
                    <h3 style={{padding: '4px 0px 0px 8px'}}>
                      {vehicleGpsId?.vendorName ||
                        backendGpsKey?.vendorName ||
                        'NA'}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        // onClose={handleClose}
        open={openform}
        maxWidth='false'
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>Register Vehicle</h1>
          <CloseIcon
            onClick={handleClose}
            style={{
              position: 'absolute',
              right: '12px',
              top: '14px',
              cursor: 'pointer',
            }}
          />
        </DialogTitle>
        <DialogContent>
          <div style={{padding: '1rem'}}>
            <RegisterVendor close={handleCloseForm} handleClose={handleClose} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        // onClose={handleClose}
        open={openDetail}
        maxWidth='false'
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>Vehicle Details</h1>
          <CloseIcon
            onClick={handleDetailform}
            style={{
              position: 'absolute',
              right: '12px',
              top: '14px',
              cursor: 'pointer',
            }}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '1rem'}}>
            <DetailForm close={handleinteranldialog} id={id} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        // onClose={handleClose}
        open={openDriverShift}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '90%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Driver Vehicle Mapping</h1>
          <CloseIcon
            onClick={handleCloseDriverShift}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          {/* <div style={{ display: "flex", justifyContent: "space-between", background: "#f5f2f2", height: "4rem", paddingRight: "1.5rem", paddingLeft: "1.5rem", position: "fixed", width: "90%", zIndex: "9", borderRadius: "5px 5px 0px 0px" }}>
            </div> */}
          <div style={{padding: '20px', paddingBottom: '0', marginTop: '10px'}}>
            <span>
              <b>Vehicle Brand: </b> {vehicleName}
            </span>
            <span>
              &nbsp;&nbsp;&nbsp;<b>Vehicle Number: </b> {vehicleNumber}
            </span>
          </div>
          <div style={{padding: '20px', paddingTop: '0'}}>
            <SmartForm
              template={template}
              // defaultValues={formData}
              onSubmit={handleSubmit}
              buttons={['submit']}
            />
            <br />
            <div>
              <CustomLabel
                labelVal='Drivers Mapped With Vehicle'
                variantVal='h3-underline'
              />
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
                title='Assigned Drivers'
                columns={driverTableTemplate.columns}
                // tableRef={tableRef}
                data={diverList ?? []}
                options={{
                  search: false,
                  showTitle: false,
                  actionsColumnIndex: -1,
                  headerStyle: {position: 'sticky', top: 0, padding: '2px'},
                }}
                actions={[
                  {
                    icon: () => (
                      <DeleteIcon color='primary' style={{color: '#bc0805'}} />
                    ),
                    tooltip: 'Delete assigned driver',
                    onClick: (event, rowData) => removeDriverShift(rowData),
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
          </div>
        </DialogContent>
      </Dialog>

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
          <h1>Vehicle Complaince</h1>
          <CloseIcon onClick={() => setOpenCompliance(false)} />
        </DialogTitle>

        <DialogContent style={{padding: '20px'}}>
          <Compliance vid={id} />
        </DialogContent>
      </Dialog>

      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Vehicle Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
      {/* <FilterPop open={openFilter} handleClose={handleClosefilter} title={"Vehicle Filter"} template={templateFilter} cnfMsg={'cnfMsg'} header={"My Header"} /> */}

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the vehicle?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the vehicle?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />

      {openAssociate ? (
        <>
          <Dialog
            onClose={() => {
              setOpenAssociate(false);
            }}
            open={true}
            maxWidth='false'
            PaperProps={{sx: {width: '40%'}}}
          >
            <DialogTitle
              id='alert-dialog-title'
              style={{
                background: '#f5f2f2',
                fontSize: '24px',
                padding: '11px 0px 0px 20px',
              }}
            >
              {'Associate New Vehicle'}
              <CloseIcon
                style={{
                  position: 'absolute',
                  right: '12px',
                  cursor: 'pointer',
                  top: '14px',
                }}
                onClick={() => {
                  setOpenAssociate(false);
                }}
              />
            </DialogTitle>
            <DialogContent style={{padding: '5px 24px 13px'}}>
              <SmartForm
                template={templateAssociate}
                setVal={[
                  // {name: 'vendorCode', value: vendorData?.vendorCode ?? 'NA'},
                  {
                    name: 'vendorName',
                    value: vehicleData?.vehicleNumberPlate ?? 'NA',
                  },
                ]}
                // showbtn={showbtn}
                SecretFun={SecretFun}
                onSubmit={handleDialog}
                buttons={['Add']}
              />
            </DialogContent>
          </Dialog>
        </>
      ) : null}
    </>
  );
};

export default VehicleDriverGpsMapping;
