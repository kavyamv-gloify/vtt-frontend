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
// import TicketInformation from '../TicketInformation/index';
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
import TicketCardView from './TicketCard';
import CardView from './CardView';
const MyQueue = ({userId}) => {
  const {user} = useAuthUser();
  // const [getAllList, setGetAllList] = useState();
  const [agentId, setAgentId] = useState({});
  const [ticketStatus, setTicketStatus] = useState([]);
  const [agentList, setAgentList] = useState();
  const [ticketListing, setTicketListing] = useState();
  const [count, setCount] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getByAgentId();
  }, []);
  useEffect(() => {
    axios
      // .get(Api.baseUri + '/user-reg/ticketStatus/get-all-ticket-status')corporateId
      .get(Api.baseUri + '/user-reg/ticketStatus/getTicketByCorporateId/' + userId)
      .then((res) => {
        if (res?.data?.status == '200') {
          const filterData = res.data?.data.filter((el) => !!el.statusType);
          setTicketStatus(filterData);
        }
      })
      .catch((err) => {
        setTicketStatus([]);
      });
  }, [userId]);
 

  function getByAgentId() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/incident-management/get-incident-management-by-pendingWith/' +
          user?.userList?.profileId,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res);
          let unassigned = _.groupBy(res?.data?.data, 'status');
          setCount({
            // Total: res?.data?.data?.[0]?.incidentList?.length || 0,
            Total:
              (unassigned?.UNASSIGNED?.length || 0) +
              // (unassigned?.DUE?.length || 0) +
              (unassigned?.CLOSED?.length || 0) +
              (unassigned?.OPEN?.length || 0) +
              (unassigned?.REOPEN?.length || 0) +
              (unassigned?.PENDING?.length || 0) +
              (unassigned?.HOLD?.length || 0),
            unassigned: unassigned?.UNASSIGNED?.length || 0,
            // due: unassigned?.DUE?.length || 0,
            open: unassigned?.OPEN?.length || 0,
            reopen: unassigned?.REOPEN?.length || 0,
            closed: unassigned?.CLOSED?.length || 0,
            hold: unassigned?.HOLD?.length || 0,
            pending: unassigned?.PENDING?.length || 0,
          });
          setTicketListing(res?.data?.data);
        }
      })
      .catch((err) => {});
  }
  console.log('ticket listing', ticketListing);
  console.log('ticket queue', count);
  const Items = styled(Paper)(({theme}) => ({}));

  return (
    <>
      <Grid container>
        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item md={2}>
              <CardView
                title={'Total'}
                bgColor={'#AED6F1'}
                number={count?.Total || 0}
              />
            </Grid>
            <Grid item md={2}>
              <CardView
                title={'Unassigned'}
                bgColor={'#E6B0AA'}
                number={count?.unassigned || 0}
              />
            </Grid>
            <Grid item md={2}>
              <CardView
                title={'Closed'}
                bgColor={'#ABEBC6'}
                number={count?.closed || 0}
              />
            </Grid>
            <Grid item md={2}>
              <CardView
                title={'Pending'}
                bgColor={'#ABEBC6'}
                number={count?.pending || 0}
              />
            </Grid>
            {/* <Grid item md={2}>
              <CardView
                title={'Due'}
                bgColor={'#F7DC6F'}
                number={count?.due || 0}
              />
            </Grid> */}
            <Grid item md={2}>
              <CardView
                title={'Open'}
                bgColor={'#F7DC6F'}
                number={count?.open || 0}
              />
            </Grid>
            <Grid item md={2}>
              <CardView
                title={'Reopen'}
                bgColor={'#F7DC6F'}
                number={count?.reopen || 0}
              />
            </Grid>
            {/* <Grid item md={1.7}>
              <CardView
                title={'Hold'}
                bgColor={'#EDBB99'}
                number={count?.hold || 0}
              />
            </Grid> */}
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
    </>
  );
};
export default MyQueue;
