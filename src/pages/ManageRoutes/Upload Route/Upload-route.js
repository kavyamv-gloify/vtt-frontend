import React, {useState, useEffect} from 'react';
import {Button} from '@mui/material';
import SmartForm from '@smart-form';
import api from '@api';
import axios from 'axios';
import {DialogTitle} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import moment from 'moment';
import {getFormData} from '@hoc';
import {toast} from 'react-toastify';
import ExcelContainer from '@excelupload';
import AppLoader from '@crema/core/AppLoader';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AppTooltip from '@crema/core/AppTooltip';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
const UploadRoutes = () => {
  const [openForm, setOpenForm] = useState(false);
  const [showbtn, setshowbtn] = useState(true);
  const [holiday, setHoliday] = useState();
  const [holidayData, setHolidayData] = useState();
  const [filterData, setFilterData] = useState();
  const [downloadClick, setDownloadClick] = useState(false);
  const [copied, setcopied] = useState(false);
  const [dateArray, setDateArray] = useState();
  const [errMsg, seterrMsg] = useState();
  const weekAr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  function holidayList() {
    axios
      .get(`${api.holiday.holidayList}`)
      .then((res) => {
        let temp = [];
        res?.data?.data?.map((e) => {
          temp.push({title: e?.holidayName, value: e?.holidayDate});
        });
        setHoliday(temp);
      })
      .catch((err) => {});
  }
  useEffect(() => {
    holidayList();
  }, []);

  const weeks = [
    {title: 'Sunday', value: 'SUN'},
    {title: 'Monday', value: 'MON'},
    {title: 'Tuesday', value: 'TUE'},
    {title: 'Wednesday', value: 'WED'},
    {title: 'Thursday', value: 'THU'},
    {title: 'Friday', value: 'FRI'},
    {title: 'Saturday', value: 'SAT'},
  ];

  const CreateTrip = () => {
    setOpenForm(true);
  };

  function handlecloseDetail() {
    setOpenForm(false);
    seterrMsg('');
  }

  var getDaysArray = function (start, end) {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
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
                type: 'date',
                name: 'fromDate',
                id: 'fromDate',
                title: 'From Date',
                min: 'today',
                validationProps: {
                  required: 'This is a mandatory field',
                  manual: [
                    {
                      condition: `fromDate >= today`,
                      message: 'From date should not be less than today.',
                    },
                  ],
                },
              },
              {
                type: 'date',
                name: 'toDate',
                id: 'toDate',
                title: 'To Date',
                min: 'today',
                validationProps: {
                  required: 'This is a mandatory field',
                  validate: [
                    {
                      condition: 'fromDate <= toDate',
                      message:
                        'From date should not be greater than till date.',
                    },
                  ],
                },
              },
            ],
          },
          {
            type: 'multiSelect',
            name: 'weekOff',
            id: 'weekOff',
            title: 'Week Off',
            options: weeks,
          },
          {
            type: 'multiSelect',
            name: 'holidayList',
            id: 'holidayList',
            title: 'Holiday List',
            options: holiday ?? [],
          },
          {
            type: 'file',
            name: 'file',
            id: 'file',
            title: 'Upload Excel',
            // infoMessage: ["Should only accept PDF,JPEG files", "File should contain file extension", "e.g.:Shub.jpeg"],
            validationProps: {
              required: 'This is a mandatory field',
              size: {
                value: 5,
                message: 'File size should not be more than 5 mb.',
              },
            },
          },
          {
            type: 'switchToggle',
            name: 'regeration',
            id: 'regeration',
            title: 'Allow Re-Generation',
            defaultValue: 'NO',
            // infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
          },
          {
            type: 'switchToggle',
            name: 'regerationSkip',
            id: 'regerationSkip',
            title: 'Allow Skip Employee',
            defaultValue: 'NO',
            // infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
          },
        ],
      },
    ],
  };

  function getdate(startDate, endDate) {
    let arr = [];
    axios
      .get(`${api.holiday.holidayList}`)
      .then((res) => {
        res?.data?.data?.map((data) => {
          const start = Date.parse(startDate);
          const end = Date.parse(endDate);
          const d = Date.parse(data?.holidayDate);
          var result = d >= start && d <= end;

          if (result == true) {
            arr.push(data?.holidayDate);
            setHolidayData(arr);
          }
        });
      })
      .catch((err) => {});
  }
  useEffect(() => {
    if (holidayData?.length) {
      {
        toast.warning(
          'There ' +
            (holidayData?.length > 1
              ? 'are ' + holidayData?.length + ' holidays'
              : 'is ' + holidayData?.length + ' holiday') +
            ' in this date range Please select Holidays to enable.',
        );
      }
    }
  }, [holidayData?.length]);

  var getDaysArray = function (start, end) {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }

    return arr;
  };

  function getFinalDates(dateArr, holiday, weekOffs) {
    let temDateArr = [];
    dateArr?.map((el, ind) => {
      if (
        !weekOffs?.includes(weekAr[new Date(el).getDay()]) &&
        !holiday?.includes(el)
      ) {
        temDateArr.push(el);
      }
    });

    return temDateArr;
  }
  function getOnInput(val) {
    let temp = [];
    temp[0] = val.fromDate;
    temp[1] = val.toDate;
    getdate(val.fromDate, val.toDate);

    var daylist = getDaysArray(val.fromDate, val.toDate);
    let arr = [];
    daylist.map((v) => {
      arr.push(moment(v).format('YYYY-MM-DD'));
    });

    let finalarray = getFinalDates(
      arr,
      val?.data?.holidayList,
      val?.data?.weekOff,
    );

    setDateArray(finalarray);
  }

  const handleSubmit = async (values) => {
    console.log('values', values.data);
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let regeration = values?.data?.regeration;
      let regerationSkip = values?.data?.regerationSkip;
      console.log('regeration', regeration);
      let dataSet = {};
      let allElem = {};
      let tem = {};
      let datearray = [];
      dataSet = values.data;
      dataSet.dates = dateArray;
      delete dataSet.fromDate;
      delete dataSet.regeration;
      delete dataSet.regerationSkip;
      delete dataSet.toDate;
      delete dataSet.holidayList;
      delete dataSet.weekOff;

      Object.keys(dataSet).map((key) => {
        if (typeof dataSet[key]?.[0]?.name == 'string') {
          tem = {
            ...tem,
            [key]: dataSet[key][0],
          };
        } else {
          allElem = {
            ...allElem,
            [key]: dataSet[key],
          };
        }
      });
      tem = {
        ...tem,
        // dates: JSON.stringify(Object.values(allElem)[0]).join()
        dates: Object.values(allElem),
      };

      axios({
        method: 'post',
        url:
          api?.baseUri +
          `/user-reg/trip-route/import-excel/${regeration}/${regerationSkip}`,
        data: getFormData(tem),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            toast.success('Trip Uploaded successfully');
            setOpenForm(false);
            seterrMsg('');
          } else {
            // toast.error(response?.data?.message, "Something went wrong");
            setOpenForm(false);
            seterrMsg(response?.data);
          }
          setshowbtn(true);
        })
        .catch(function (err) {
          setshowbtn(true);
          toast.error(err?.data?.message, 'Something went wrong');
        });
    }
  };

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <ExcelContainer
          downloadTempURL={'/user-reg/trip-route/download-template'}
          downloadFile={'Trip-Route'}
        />

        {/* <Button id='btnMui123' variant="outlined"
                    component='span'
                    sx={{ borderRadius: "15px", mr: 2, border: '2px solid #5a879f', color: "black" }}
                    onClick={CreateTrip}
                >
                    Upload Trip
                </Button> */}

        <AppTooltip placement={'top'} title={'Upload Trip'}>
          <span
            className='title-icons-mui'
            style={{display: 'flex', alignItems: 'end', fontWeight: 600}}
          >
            <FileUploadIcon onClick={CreateTrip} />
            {/* <span style={{ fontSize: '12px' }}>{pendingRcount ?? 0}</span> */}
          </span>
        </AppTooltip>
      </div>

      <Dialog
        onClose={handlecloseDetail}
        open={openForm}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>Upload Trip</h1>
          <CloseIcon
            onClick={() => {
              setOpenForm(false);
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>
        <DialogContent>
          {!showbtn ? <AppLoader /> : null}
          <SmartForm
            defaultValues={{regeration: 'NO', regerationSkip: 'NO'}}
            template={template}
            getOnInput={getOnInput}
            onCancel={handlecloseDetail}
            onSubmit={handleSubmit}
            buttons={['submit', 'cancel']}
            mode='onTouched'
          />
        </DialogContent>
      </Dialog>

      {errMsg ? (
        <Dialog
          open={true}
          maxWidth='false'
          PaperProps={{
            sx: {
              width: '40%',
            },
          }}
          style={{borderRadius: '4rem'}}
        >
          <DialogTitle
            className='route-upload-error-title'
            sx={{background: '#e74b3c'}}
          >
            <span>
              Total number of error is {errMsg?.data?.length}
              <CopyToClipboard
                text={JSON.stringify(errMsg?.data)}
                onCopy={() => {
                  setcopied(true);
                  setTimeout(() => {
                    setcopied(false);
                  }, 5000);
                }}
              >
                {!copied ? (
                  <ContentCopyIcon className='route-upload-copy' />
                ) : (
                  <VerifiedIcon className='route-upload-verified' />
                )}
              </CopyToClipboard>
            </span>
            <CloseIcon
              className='header-close-btn'
              onClick={(e) => {
                seterrMsg('');
              }}
            />
          </DialogTitle>
          <DialogContent
            className='route-dialog-content'
            sx={{background: '#e74b3c'}}
          >
            {errMsg?.data?.map((el) => {
              return (
                <div>
                  Row: {el?.row}, message: {el?.errorMsg}{' '}
                </div>
              );
            })}
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export default UploadRoutes;
