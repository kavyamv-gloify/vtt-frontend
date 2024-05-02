import React, {useState} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _, {isNumber} from 'lodash';
import api from '@api';
import regex from '@regex';
import SmartForm from '@smart-form';
import {Divider} from '@mui/material';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Button} from '@mui/material';
import EditForm from '../EditShift';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DetailForm from '../ShiftListingDetailPage';
import moment from 'moment';
import {toast} from 'react-toastify';
import {useEffect} from 'react';
const List = () => {
  const [filter, setFilter] = useState({});
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const tableRef = React.useRef();
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [openDetail, setOpenDetail] = useState(false);
  const [id, setId] = useState();

  const tanents = user?.userList?.tanentId;
  const vendorId = user?.userList?.profileId;

  const [openform, setOpenForm] = useState();
  const [shiftDurationVal, setShiftDurationVal] = useState({});
  const [myData, setMyData] = useState([]);
  useEffect(() => {
    let url = `${api.driver.shift}/get-shift-list-by-vendor`;
    axios.get(url).then((res) => {
      let tem = [];
      res?.data?.data?.map((el) => {
        let temobj = el;
        temobj.totaltime =
          el?.durationHr +
          (Number(el?.durationHr ?? 0) > 1 ? ' hours ' : ' hour ') +
          el?.durationMin +
          (Number(el?.durationMin ?? 0) > 1 ? ' minutes ' : ' minute ');
        tem.push(temobj);
      });
      setMyData(tem);
    });
  }, []);
  popBTNClick, openDialog;
  function popBTNClick(val) {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
    if (!val) {
      setopenDialog(false);
    }
  }

  const tableTemplate = {
    columns: [
      {
        title: 'Shift Name',
        field: 'shiftName',
      },
      {
        title: 'From Time',
        field: 'fromTime',
      },
      {
        title: 'To Time',
        field: 'toTime',
      },
      {
        title: 'Duration',
        field: 'totaltime',
      },
    ],
  };
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: '',
    description: 'Add Shift',
    sections: [
      {
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'add_shift',
        fields: [
          {
            type: 'text',
            name: 'shiftName',
            id: 'shiftName',
            title: 'Shift Name',
            // pattern: {
            //     value: regex.maxSize50,
            //     message: 'Please enter valid routing(%)'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'shiftDuration',
            id: 'shiftDuration',
            title: 'Shift Duration',
            disabled: true,
          },
          {
            type: 'text',
            name: 'fromTime',
            id: 'fromTime',
            disabled: false,
            title: 'From Time',
            input_type: 'time',
            // pattern: {
            //   value: regex.hhmmReg,
            //   message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'toTime',
            id: 'toTime',
            disabled: false,
            input_type: 'time',
            title: 'To Time',
            // pattern: {
            //   value: regex.hhmmReg,
            //   message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  function handleClickEdit(rowData) {
    // navigate('/onboardadmin/driver/editPage/' + rowData.id);
    // setopenDialog(true);
    setdialID(rowData?.id);
  }

  const handleForm = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };
  const handleCloseform = (status) => {
    setOpenForm(status);
  };

  const CloseDetailPage = () => {
    setOpenDetail(false);
  };

  const closeInternalDialog = () => {
    setOpenDetail(false);
  };

  const handleChange = async (values) => {
    if (values?.fromTime && values?.toTime) {
      var a = moment(values?.toTime, 'HH:mm');
      var b = moment(values?.fromTime, 'HH:mm');
      let aaa = a.diff(b, 'minutes', true);
      let abc = aaa < 0 ? 1440 + aaa : aaa;
      let hrs = Number((abc / 60).toString().split('.')[0]);
      let mins = abc % 60;

      setShiftDurationVal({
        concat:
          hrs +
          (hrs > 1 ? ' hours ' : ' hour ') +
          mins +
          (mins > 1 ? ' minutes' : ' minute'),
        hrs: hrs,
        mins: mins,
      });
    } else {
    }
  };

  const handleSubmit = async (values) => {
    // setShiftDurationVal()
    let reqBody = {
      shiftName: values?.data?.shiftName,
      fromTime: values?.data?.fromTime,
      toTime: values?.data?.toTime,
      durationHr: shiftDurationVal?.hrs,
      durationMin: shiftDurationVal?.mins,
    };
    axios
      .post(api.driver.shift, reqBody)
      .then((response) => {
        if (response?.data?.status == '200') {
          toast.success(response?.data?.message ?? 'Shift saved successfully');
          setOpenForm(false);
        } else {
          toast.error(response?.data?.message ?? 'Something went wrong');
        }
      })
      .catch((er) => {
        setshowbtn(true);
        toast.error('Something went wrong');
      });
  };

  return (
    <>
      {openDialog && dialID && (
        <EditForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}
      >
        <div
          style={{textAlign: 'right', paddingRight: '0px', backgroundColor: ''}}
        >
          <Button
            id='btnMui123'
            variant='contained'
            style={{margin: '8px'}}
            onClick={handleForm}
          >
            Add Shift
          </Button>
        </div>
        {/* <div style={{ textAlign: 'right', paddingRight: "0px", backgroundColor: "" }}><Button id='btnMui123' variant="contained" style={{ margin: "8px" }} onClick={(e) => { navigate('/onboardadmin/pending-driver/driver-listing') }}>Drivers' Pending request</Button></div> */}
      </div>

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
        data={myData}
        options={{
          search: false,
          showTitle: false,
          // filtering:true,
          // selection: true,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          {
            icon: () => <EditIcon color='primary' />,
            tooltip: 'edit',
            onClick: (event, rowData) => handleClickEdit(rowData),
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
        onClose={handleClose}
        open={openform}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '80%',
          },
        }}
        style={{borderRadius: '4rem'}}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
                position: 'fixed',
                width: '80%',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Add Shift</h1>
              <CloseIcon
                onClick={handleClose}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '1rem', marginTop: '60px'}}>
              {/* <RegisterShift close={handleCloseform}  /> */}
              <SmartForm
                template={template}
                // defaultValues={{shiftDuration:0}}
                onSubmit={handleSubmit}
                onChange={handleChange}
                buttons={['submit']}
                setVal={[
                  {name: 'shiftDuration', value: shiftDurationVal?.concat},
                ]}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Dialog
        // onClose={CloseDetailPage}
        open={openDetail}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '80%',
          },
        }}
        style={{borderRadius: '4rem'}}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Register Driver</h1>
              <CloseIcon
                onClick={CloseDetailPage}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '1rem'}}>
              <DetailForm id={id} close={closeInternalDialog} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default List;
