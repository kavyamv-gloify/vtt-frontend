import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import SmartForm from '@smart-form';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _, {values} from 'lodash';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import {Grid} from '@mui/material';
import Api from '@api';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import {toast} from 'react-toastify';
import moment from 'moment';

import CustomLabel from 'pages/common/CustomLabel';

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
const List = () => {
  const [userStatus, setuserStatus] = useState('Active');
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const tableRef = React.useRef();
  const [complaintList, setComplaintList] = useState([]);
  const [topicList, settopicList] = useState();
  const [id, setId] = useState();
  const [data, setData] = useState();
  const [subTopicList, setSubTopicList] = useState();
  const [openDialog, setopenDialog] = useState();
  const [showTrip, setShowTrip] = useState(false);
  // const [openDialog, setOpenDialog] = useState(false);
  const [tripInfo, setTripInfo] = useState();
  const [likeButton, setLikeButton] = useState({
    upButton: true,
    downButton: false,
  });
  async function onSubmit(val) {
    setFilter(val.data);
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  }
  useEffect(() => {
    axios
      .get(
        api.baseUri +
          '/user-reg/helpmaster/getAll?page=0&size=900&topicName=null&type=EMPLOYEE',
      )
      .then((res) => {
        let temp = [];
        res?.data?.data?.body?.HelpTopicList?.map((el) => {
          temp.push({title: el?.topicName, value: el?.id});
        });
        settopicList(temp ?? []);
      })
      .catch((err) => {
        settopicList([]);
      });
  }, []);

  useEffect(() => {
    axios
      .get(api.baseUri + '/user-reg/ticket/getbyId/' + id)
      .then((res) => {
        setData(res?.data?.data);
      })
      .catch((err) => {});
  }, [id]);

  useEffect(() => {
    if (data?.isRide == 'YES') {
      setShowTrip(true);
    }
  }, [data?.isRide]);

  useEffect(() => {
    axios
      .get(
        api.baseUri +
          '/user-reg/subtopiccontroller/' +
          data?.topicId +
          '/helpid',
      )
      .then((res) => {
        let temp = [];
        res?.data?.data?.map((el) => {
          temp.push({title: el?.subTopicName, value: el?.id});
        });
        setSubTopicList(temp ?? []);
      })
      .catch((err) => {
        setSubTopicList([]);
      });
  }, [data?.topicId]);

  useEffect(() => {
    axios
      .get(
        api.baseUri +
          '/user-reg/trip-route/get-Trip-behalf-passenger/' +
          data?.tripId,
      )
      .then((res) => {
        setTripInfo(res?.data?.data);
      })
      .catch((err) => {});
  }, [data?.tripId]);

  useEffect(() => {
    getComplaintsList();
  }, []);

  const getComplaintsList = () => {
    axios
      .get(api.baseUri + '/user-reg/ticket/getTicketByEmployeeId')
      .then((res) => {
        setComplaintList(res?.data?.data);
      })
      .catch((err) => {});
  };

  const tableTemplate = {
    columns: [
      {
        title: 'Subject',
        field: 'subject',
      },
      {
        title: 'Contact Number',
        field: 'personContactno',
      },
      {
        title: 'Email Id',
        field: 'personEmailId',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'date',
      },
      {
        title: 'Status',
        field: 'status',
        render: (rowData) =>
          rowData.status == 'CLOSED' ? (
            <span style={{color: 'red'}}>CLOSED</span>
          ) : rowData.status == 'OPEN' ? (
            <span style={{color: 'green'}}>OPEN</span>
          ) : (
            rowData.status
          ),
      },
    ],
  };

  function handleClickEdit(rowData) {
    navigate('/Master/support/subtopics/' + rowData.id);
  }

  return (
    <>
      <Grid item xs={12} sm={3} md={3} sx={{mb: 2}}>
        <CustomLabel labelVal='My Complaints' variantVal='h3-underline' />
      </Grid>
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
        title='Bank Detail'
        columns={tableTemplate.columns}
        data={complaintList}
        // data={(query) =>
        //   new Promise((resolve, reject, values) => {
        //     let url = api.baseUri + '/user-reg/ticket/getTicketByEmployeeId',
        //       body = {
        //         pageSize: query.pageSize,
        //         pageNo: query.page,
        //       };

        //     // if (!_.isEmpty(filter)) {
        //     //   body = {
        //     //     ...body,
        //     //     ...filter
        //     //   }
        //     // }
        //     axios
        //       .get(url, body)
        //       .then((result) => {
        //         resolve({
        //           data: result?.data?.data ? result?.data?.data : [],
        //           page: result?.data?.currentPage ? result.data.currentPage : 0,
        //           totalCount: result?.data?.totalItems
        //             ? result.data.totalItems
        //             : 0,
        //         });
        //       })
        //       .catch((err) => {
        //         resolve({
        //           data: [],
        //           page: 0,
        //           totalCount: 0,
        //         });
        //       });
        //   })
        // }
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (complaintList) => ({
            icon: () => (
              <ConfirmationNumberIcon
                color='primary'
                style={{
                  opacity: complaintList?.status == 'CLOSED' ? '0.3' : ' ',
                }}
              />
            ),
            tooltip: 'view',
            onClick: (event, rowData) => {
              if (rowData?.status === 'CLOSED') {
                return;
              }
              setopenDialog(true);
              setId(rowData?.id);
            },
          }),
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
        open={openDialog}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '700px',
          },
        }}
        style={{borderRadius: '4rem'}}
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
                width: '700px',
                position: 'fixed',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Complain View</h1>
              <CloseIcon
                onClick={() => {
                  setopenDialog(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '1rem', paddingTop: '5rem'}}>
              <Grid container sx={{marginTop: '20px'}}>
                <Grid item md={6} sx={{paddingLeft: '30px'}}>
                  <h4 style={{fontSize: '15px', marginBottom: '10px'}}>
                    Topics
                  </h4>
                  {topicList ? (
                    <Autocomplete
                      options={topicList ?? []}
                      value={{title: data?.topicName, value: data?.topicId}}
                      disabled
                      sx={{width: '100%', marginBottom: '10px'}}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  ) : null}
                </Grid>
                <Grid item md={6} sx={{paddingLeft: '30px'}}>
                  <h4 style={{fontSize: '15px', marginBottom: '10px'}}>
                    Sub-Topics
                  </h4>
                  {subTopicList ? (
                    <Autocomplete
                      options={subTopicList ?? []}
                      value={{
                        title: data?.subTopicName,
                        value: data?.subTopicId,
                      }}
                      disabled
                      sx={{width: '100%', marginBottom: '10px'}}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  ) : null}
                </Grid>
                <Grid item md={6} sx={{paddingLeft: '30px'}}>
                  <h4 style={{fontSize: '15px', marginBottom: '10px'}}>
                    E-mail
                  </h4>
                  <TextField
                    id='outlined-basic'
                    value={user?.userList?.emailId}
                    sx={{width: '100%', marginBottom: '10px'}}
                    disabled
                  />
                </Grid>
                <Grid item md={6} sx={{paddingLeft: '30px'}}>
                  <h4 style={{fontSize: '15px', marginBottom: '10px'}}>
                    Phone-Number
                  </h4>
                  <TextField
                    id='outlined-basic'
                    value={user?.userList?.mobileNo}
                    sx={{width: '100%', marginBottom: '10px'}}
                    disabled
                  />
                </Grid>
                <Grid item md={6} sx={{paddingLeft: '30px'}}>
                  <h4 style={{fontSize: '15px', marginBottom: '10px'}}>
                    Subject
                  </h4>
                  <TextField
                    id='outlined-basic'
                    value={data?.subject}
                    sx={{width: '100%', marginBottom: '10px'}}
                    disabled
                  />
                </Grid>
                <Grid item md={12} sx={{paddingLeft: '30px'}}>
                  <h4 style={{fontSize: '15px', marginBottom: '10px'}}>
                    Details
                  </h4>

                  <div
                    style={{
                      height: '100px',
                      overflowY: 'auto',
                      borderRadius: '10px',
                      border: '1px solid #D7DBDD',
                      color: '#909497',
                      padding: '10px',
                    }}
                    dangerouslySetInnerHTML={{__html: data?.requestMsg[0]?.msg}}
                  ></div>
                </Grid>
                <Grid item xs={6} sx={{paddingLeft: '30px'}}>
                  <RadioGroup
                    aria-labelledby='demo-radio-buttons-group-label'
                    defaultValue={data?.isRide}
                    // onChange={(e, v) => { setVal({ ...val, isRide: v }) }}
                    name='radio-buttons-group'
                  >
                    {data?.isRide == 'YES' ? (
                      <FormControlLabel
                        value='YES'
                        control={<Radio checked={true} />}
                        label='I have an issue with a ride'
                      />
                    ) : null}
                    {data?.isRide == 'NO' ? (
                      <FormControlLabel
                        value='NO'
                        control={<Radio checked={true} />}
                        label='I have an issue not related to a ride'
                      />
                    ) : null}
                  </RadioGroup>
                </Grid>
                {showTrip && (
                  <Grid container sx={{marginTop: '10px'}}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        background: 'white',
                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          padding: '20px',
                        }}
                      >
                        <div
                          style={{
                            marginLeft: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <h5 style={{fontWeight: '700'}}>
                            {moment(tripInfo?.actualPickUpDateTimeStr).format(
                              'llll',
                            )}
                          </h5>
                          <h5>{tripInfo?.vehicleNumber}</h5>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              marginTop: '10px',
                            }}
                          >
                            <div
                              style={{
                                color: 'orange',
                                paddingLeft: '7px',
                                display: 'flex',
                                flexDirection: 'row',
                              }}
                            >
                              <div>
                                {' '}
                                <FiberManualRecordIcon
                                  sx={{fontSize: '10px'}}
                                />{' '}
                              </div>
                              <p style={{paddingLeft: '20px', color: 'grey'}}>
                                {tripInfo?.tripType == 'UPTRIP'
                                  ? tripInfo?.location?.locName
                                  : tripInfo?.officeLocation?.locName}
                              </p>
                            </div>
                            <div>
                              <MoreVertIcon />
                            </div>
                            <div
                              style={{
                                color: 'green',
                                paddingLeft: '7px',
                                display: 'flex',
                                flexDirection: 'row',
                              }}
                            >
                              <div>
                                <FiberManualRecordIcon
                                  sx={{fontSize: '10px'}}
                                />
                              </div>
                              <p style={{paddingLeft: '20px', color: 'grey'}}>
                                {tripInfo?.tripType == 'DOWNTRIP'
                                  ? tripInfo?.officeLocation?.locName
                                  : tripInfo?.location?.locName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                )}
                <Grid
                  md={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                  }}
                >
                  <Button
                    variant='contained'
                    onClick={() => {
                      let postData = {
                        id: id,
                      };
                      axios
                        .post(
                          Api.baseUri + '/user-reg/ticket/close-ticket-by-emp',
                          postData,
                        )
                        .then((res) => {
                          if (res?.data?.status == '200') {
                            setopenDialog(false);
                            toast.success('Ticket closed successfully');
                            getComplaintsList();
                          } else {
                            setopenDialog(false);
                            toast.error('Something went wrong');
                          }
                        })
                        .catch((err) => {
                          console.log('err', err);
                          setopenDialog(false);
                          toast.error('Something went wrong');
                        });
                    }}
                  >
                    Close Ticket
                  </Button>
                </Grid>
                {data?.status == 'CLOSED' && (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      border: '1px solid #f1f1f1',
                      borderRadius: '10px',
                      marginTop: '20px',
                      background: 'white',
                      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    }}
                  >
                    <div
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid #f1f1f1',
                        display: 'flex',
                      }}
                    >
                      <ThumbUpAltIcon
                        sx={{
                          color:
                            likeButton?.upButton == true ? '#42a5f5' : 'orange',
                        }}
                        onClick={() => {
                          setLikeButton({
                            ...likeButton,
                            upButton: !likeButton?.upButton,
                            downButton: !likeButton?.downButton,
                          });
                        }}
                      />
                      <p style={{marginLeft: '15px'}}>
                        Yes, My issue got resolved
                      </p>
                    </div>
                    <div
                      style={{
                        padding: '10px',
                        display: 'flex',
                        marginTop: '10px',
                      }}
                    >
                      <ThumbDownAltIcon
                        sx={{
                          color:
                            likeButton?.downButton == true
                              ? '#42a5f5'
                              : 'orange',
                        }}
                        onClick={() => {
                          setLikeButton({
                            ...likeButton,
                            downButton: !likeButton?.downButton,
                            upButton: !likeButton?.upButton,
                          });
                        }}
                      />
                      <p style={{marginLeft: '15px'}}>
                        No, My issue not get resolved
                      </p>
                    </div>
                  </Grid>
                )}
              </Grid>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default List;
