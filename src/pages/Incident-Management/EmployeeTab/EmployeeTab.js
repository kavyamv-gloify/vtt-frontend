import React, {useState, useEffect} from 'react';
import {Box, Grid} from '@mui/material';
import AppSelect from '@crema/core/AppSelect';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ScheduleIcon from '@mui/icons-material/Schedule';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Api from '@api';
import axios from 'axios';

import {useAuthUser} from '@crema/utility/AuthHooks';
import {useNavigate} from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {resolveBreakpointValues} from '@mui/system/breakpoints';
import CardView from './CardCopy';
import _ from 'lodash';
import TicketCardView from '../Tickets/TicketCard';
const EmployeeTab = () => {
  const {user} = useAuthUser();
  // const [getAllList, setGetAllList] = useState();
  const [agentId, setAgentId] = useState();
  const [ticketStatus, setTicketStatus] = useState();
  const [agentList, setAgentList] = useState();
  const [ticketListing, setTicketListing] = useState();
  const [count, setCount] = useState();
  const navigate = useNavigate();
  function handleSelectionType(data) {
    setName(data);
  }

  console.log('user', user?.userList?.corporateId);
  function getAllList() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/incident-management/get-All-incident-management/null',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res>>>>', res?.data?.data);
          let unassigned = _.groupBy(res?.data?.data, 'status');
          console.log('jjjj', unassigned);
          setCount({
            Total: res?.data?.data?.length,
            unassigned: unassigned?.UNASSIGNED?.length || 0,
            pending: unassigned?.PENDING?.length || 0,
            closed: unassigned?.CLOSED?.length || 0,
          });
          setTicketListing(res?.data?.data);
        }
      })
      .catch((err) => {});
  }

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/ticketStatus/get-all-ticket-status')
      .then((res) => {
        if (res?.data?.status == '200') {
          const filter = res.data?.data.filter((el) => !!el.statusType);
          setTicketStatus(filter);
        }
      })
      .catch((err) => {
        setTicketStatus([]);
      });
  }, []);

  useEffect(() => {
    if (!agentId || agentId == undefined) {
      getAllList();
      console.log('employeeListing');
      return;
    }
    if (agentId) {
      getByAgentId(agentId);
    }
  }, [agentId]);

  useEffect(() => {
    console.log('AGENTID', agentId);
  }, [agentId]);

  function getByAgentId(ag) {
    console.log(ag);
    if (ag) {
      axios
        .get(
          Api.baseUri +
            '/user-reg/incident-management/get-all-incident-by-empId/' +
            ag,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            console.log('shreya', res?.data?.data?.[0]?.incidentList);
            let unassigned = _.groupBy(
              res?.data?.data?.[0]?.incidentList,
              'status',
            );
            setCount({
              Total: res?.data?.data?.[0]?.incidentList?.length,
              unassigned: unassigned?.UNASSIGNED?.length || 0,
              pending: unassigned?.PENDING?.length || 0,
              closed: unassigned?.CLOSED?.length || 0,
            });
            setTicketListing(res?.data?.data?.[0]?.incidentList);
          }
        })
        .catch((err) => {});
    }
  }

  useEffect(() => {
    let temp = [];
    axios
      .get(
        Api.baseUri +
          '/user-reg/incident-management/get-all-empId-for-incident',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let userArray = [{corporateId: user?.userList?.corporateId}];
          let agentArray = res?.data?.data;
          let newUserAgent = agentArray?.filter(
            (item) => item.corporateId === user?.userList?.corporateId,
          );
          console.log('newUserAgent', newUserAgent);
          newUserAgent?.map((el) => {
            temp.push({title: el?.employeeFullName, value: el?.id});
          });
          console.log('temp', temp);
          setAgentList(temp ?? []);
        }
      })
      .catch((err) => {
        setAgentList([]);
      });
  }, []);

  console.log('emp id listing', agentList);
  console.log('ticket listing', ticketListing);
  const Items = styled(Paper)(({theme}) => ({}));

  return (
    <div>
      <Grid container sx={{mt: 2}}>
        <Grid item md={3}>
          <Autocomplete
            disablePortal
            // size='small'
            id='combo-box-demo'
            options={agentList ?? []}
            sx={{width: '100%', maxWidth: '250px', background: 'white'}}
            getOptionLabel={(option) => option.title}
            onChange={(e, v) => {
              // setFuelType(v?.value);

              setAgentId(v?.value);
            }}
            // sx={{width: 300}}
            renderInput={(params) => <TextField {...params} label='Employee' />}
          />
        </Grid>
        <Grid item md={9}>
          <Grid container spacing={2}>
            <Grid item md={2.4}>
              <CardView
                title={'Total'}
                bgColor={'#AED6F1'}
                number={count?.Total}
              />
            </Grid>
            <Grid item md={2.4}>
              <CardView
                title={'Unassigned'}
                bgColor={'#E6B0AA'}
                number={count?.unassigned}
              />
            </Grid>
            <Grid item md={2.4}>
              <CardView
                title={'Closed'}
                bgColor={'#ABEBC6'}
                number={count?.closed}
              />
            </Grid>
            <Grid item md={2.4}>
              <CardView
                title={'Pending'}
                bgColor={'#F7DC6F'}
                number={count?.pending}
              />
            </Grid>
            <Grid item md={2.4}>
              <CardView
                title={'Hold'}
                bgColor={'#EDBB99'}
                number={count?.hold}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <div style={{marginTop: '20px'}}>
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
          <TableContainer sx={{maxHeight: 600, height: '100%'}}>
            <Table
              stickyHeader
              aria-label='sticky table'
              sx={{
                tableLayout: 'fixed',
              }}
              // style={{maxWidth: (getAllList?.length || 1) * 280 + 'px'}}
            >
              <TableHead sx={{borderColor: '#e9ecf4'}}>
                <TableRow>
                  {ticketStatus?.map((el) => {
                    return (
                      <TableCell
                        sx={{
                          width: `${100 / ticketStatus.length}%`,
                          borderRight: '1px solid rgba(224, 224, 224, 1)',
                          borderColor: '#e9ecf4',
                        }}
                      >
                        {' '}
                        {
                          <p
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              fontWeight: '900',
                            }}
                          >
                            {el?.statusType}
                          </p>
                        }
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{
                    verticalAlign: 'top',
                  }}
                >
                  {ticketStatus?.map((el_) => {
                    return (
                      <TableCell
                        sx={{
                          width: `${100 / ticketStatus.length}%`,
                          borderRight: '1px solid rgba(224, 224, 224, 1) ',
                          padding: '10px',
                        }}
                      >
                        {ticketListing?.map((el) => {
                          if (el_?.statusType != el.status) {
                            return;
                          }
                          return (
                            <div
                              onClick={() => {
                                navigate('/view/' + el?.id);
                              }}
                            >
                              <TicketCardView
                                status={el?.status ? el?.status : '--'}
                                subject={el?.subject}
                                name={el?.ticketForName}
                                date={el?.createdOn}
                                ticketCode={el?.ticketCode}
                                departMentName={el?.departmentName}
                              />
                            </div>
                          );
                        })}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default EmployeeTab;
