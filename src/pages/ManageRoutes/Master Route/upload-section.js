import {
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {Box} from '@mui/system';
import React, {useEffect, useState} from 'react';
import PIECHART from './piechart';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ManIcon from '@mui/icons-material/Man';
import GirlIcon from '@mui/icons-material/Girl';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';

const UploadSection = ({chartArr, getAllRoutes, fetchDistributionData}) => {
  const [fileName, setFileName] = useState('');
  const [totalSum, setTotalSum] = useState();
  const [upfileError, setUpfileError] = useState('');
  const [data, setData] = useState(chartArr);
  const labels = ['Male', 'Female', 'Escort'];
  const [chartdata, setChartData] = useState({});
  console.log('chartArr', chartArr);
  const graphvalues = chartArr;
  const graphData = [
    {
      percent: (
        (graphvalues[0] * 100) /
        (graphvalues[0] + graphvalues[1] + graphvalues[2])
      ).toFixed(2),
      count: graphvalues[0],
      color: '#2078b4',
    },
    {
      percent: (
        (graphvalues[1] * 100) /
        (graphvalues[0] + graphvalues[1] + graphvalues[2])
      ).toFixed(2),
      count: graphvalues[1],
      color: '#fe7f0c',
    },
    {
      percent: (
        (graphvalues[2] * 100) /
        (graphvalues[0] + graphvalues[1] + graphvalues[2])
      ).toFixed(2),
      count: graphvalues[2],
      color: '#f1736f',
    },
  ];
  const [errMsg, seterrMsg] = useState('');
  const [copied, setcopied] = useState(false);
  useEffect(() => {
    if (!chartArr?.length) return;
    const customLabels = labels.map((label, index) => `${label}`);
    setChartData({
      labels: customLabels,
      datasets: [
        {
          label: 'Markets Monitored',
          backgroundColor: ['#fe7f10', '#2078b4', '#f1736b'],
          data: chartArr,
        },
      ],
    });
  }, [chartArr]);
  const getFormData = (object) =>
    Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
    }, new FormData());

  const uploadMasterList = async (event) => {
    setFileName(event?.target?.files[0]?.name);
    if (!event?.target?.files[0]?.name) return;
    let file = event?.target?.files;
    let tem = {file: file};
    let dataSet = {file: file};
    let allElem = {};
    Object.keys(tem).map((key) => {
      if (typeof tem[key]?.[0]?.name == 'string') {
        dataSet = {
          ...dataSet,
          [key]: tem[key][0],
        };
      } else {
        allElem = {
          ...allElem,
          [key]: tem[key],
        };
      }
    });
    dataSet = {
      ...dataSet,
      data: JSON.stringify(allElem),
    };
    axios({
      method: 'post',
      url: Api?.baseUri + '/user-reg/master-route/import-excel',
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    })
      .then(function (response) {
        getAllRoutes();
        fetchDistributionData();
        setFileName('');
        if (response?.data?.status == '200') {
          setUpfileError('');
          // toast.success(
          //   response?.data?.message ?? 'Route created successfully.',
          // );
          toast.success('Master Route template uploaded successfully.');
          // let temTotalEmpCount = 0
          // let temMaleCount = 0
          // let temFemaleCount = 0
          // response?.data?.data?.map((el) => {
          //     el?.passengers?.map(elem => {
          //         temTotalEmpCount = ++temTotalEmpCount;
          //         if (elem?.gender?.toUpperCase() == 'MALE') { temMaleCount = ++temMaleCount }
          //         if (elem?.gender?.toUpperCase() == 'FEMALE') { temFemaleCount = ++temFemaleCount; }
          //     })
          // })
        } else {
          setUpfileError(response?.data?.message ?? 'Something went wrong.'); //toast.error(response?.data?.message ?? "Something went wrong.");
          seterrMsg(response?.data);
        }
      })
      .catch((err) => {
        setUpfileError('Something went wrong.');
        setFileName('');
        getAllRoutes();
        toast.error('Something went wrong.');
      });
  };
  useEffect(() => {
    let n = 0;
    chartdata?.datasets?.length &&
      chartdata?.datasets[0]?.data?.length &&
      chartdata?.datasets[0]?.data?.map((e) => {
        n = n + Number(e);
      });
    setTotalSum(n);
  }, [chartdata]);
  return (
    <>
      <div className='route-master-upload-div'>
        <Box sx={{flexGrow: 1}}>
          <Grid container spacing={2} className='route-master-upload-div-inner'>
            <Grid item xs={12} sm={4}>
              <div
                className='grid-container'
                style={{paddingLeft: '2%', marginTop: '40px'}}
              >
                <div>
                  <h4 sx={{mb: 2}} className='file4route-label'>
                    Upload Master Route List
                  </h4>
                </div>
                <div>
                  <span className='file4route' id='file4route00'>
                    <input
                      type='file'
                      accept='.xlsx, .xls'
                      className='route-master-input-file'
                      value={''}
                      onChange={(e) => {
                        uploadMasterList(e);
                      }}
                    />
                    <span
                      style={{color: '#d4d4d4'}}
                      className='file4route-custom'
                    >
                      {fileName || 'Please upload excel file'}
                    </span>
                  </span>
                  <span className='route-master-input-file-error'>
                    {upfileError}
                  </span>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={8}>
              <div className='grid-container' style={{paddingLeft: '2%'}}>
                <div style={{marginBottom: '28px'}}>
                  <h4 sx={{mb: 2}} className='file4route-label'>
                    Trips Distribution -{' '}
                    {graphvalues[0] + graphvalues[1] + graphvalues[2] ?? 0}
                  </h4>
                </div>
                <div>
                  <div
                    className='route-graph-upper-container'
                    style={{display: 'flex'}}
                  >
                    {graphData[0]?.count ? (
                      <span
                        className='route-master-graph-div'
                        style={{width: graphData[0]?.percent + '%'}}
                      >
                        <Button
                          id='btnMui123'
                          className='route-master-graph-div-btn'
                        >
                          <span>{graphData[0]?.percent + '%'}</span>
                          <span className='route-master-graph-inner-span'>
                            <span className='route-master-graph-inner-span-2'>
                              <img
                                className='route-graph-upper-img'
                                src='/assets/images/travelling.png'
                              />
                            </span>
                            <span style={{marginLeft: '2px'}}>
                              {graphData[0]?.count}
                            </span>
                          </span>
                          <ArrowDropDownIcon className='route-arrow-down-icon' />
                        </Button>
                      </span>
                    ) : null}
                    {graphData[1]?.count ? (
                      <span
                        className='route-master-graph-div'
                        style={{width: graphData[1]?.percent + '%'}}
                      >
                        <Button
                          id='btnMui123'
                          className='route-master-graph-div-btn'
                        >
                          <span>{graphData[1]?.percent + '%'}</span>
                          <span className='route-master-graph-inner-span'>
                            <span className='route-master-graph-inner-span-2'>
                              <img
                                className='route-graph-upper-img'
                                src='/assets/images/travelling.png'
                              />
                            </span>
                            <span style={{marginLeft: '2px'}}>
                              {graphData[1]?.count}
                            </span>
                          </span>
                          <ArrowDropDownIcon className='route-arrow-down-icon' />
                        </Button>
                      </span>
                    ) : null}
                    {graphData[2]?.count ? (
                      <span
                        className='route-master-graph-div'
                        style={{width: graphData[2]?.percent + '%'}}
                      >
                        <Button
                          id='btnMui123'
                          className='route-master-graph-div-btn'
                        >
                          <span>{graphData[2]?.percent + '%'}</span>
                          <span className='route-master-graph-inner-span'>
                            <span className='route-master-graph-inner-span-2'>
                              <img
                                className='route-graph-upper-img'
                                src='/assets/images/travelling.png'
                              />
                            </span>
                            <span style={{marginLeft: '2px'}}>
                              {graphData[2]?.count}
                            </span>
                          </span>
                          <ArrowDropDownIcon className='route-arrow-down-icon' />
                        </Button>
                      </span>
                    ) : null}
                  </div>
                  <div
                    className='route-master-graph-bar-head'
                    style={{display: 'flex'}}
                  >
                    <span
                      className='route-master-graph-bar-body-left'
                      style={{width: graphData[0]?.percent + '%'}}
                    >
                      <ManIcon style={{fontSize: '15px'}} />
                      <span className='route-graph-bar-count'>
                        {graphData[0]?.count}
                      </span>
                    </span>
                    <span
                      style={{width: graphData[1]?.percent + '%'}}
                      className='route-master-graph-bar-body-center'
                    >
                      <GirlIcon style={{fontSize: '15px'}} />
                      <span className='route-graph-bar-count'>
                        {graphData[1]?.count}
                      </span>
                    </span>
                    <span
                      className='route-master-graph-bar-body-right'
                      style={{width: graphData[2]?.percent + '%'}}
                    >
                      <ManIcon style={{fontSize: '15px'}} />
                      <GirlIcon style={{fontSize: '15px'}} />
                      <span className='route-graph-bar-count'>
                        {graphData[2]?.count}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </div>

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
          <DialogTitle className='route-upload-error-title'>
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
          <DialogContent className='route-dialog-content'>
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

export default UploadSection;
