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
import CardView from './CardView';
import TicketCardView from './TicketCard';
import _ from 'lodash';
const TeamQueue = () => {
  const {user} = useAuthUser();
  // const [getAllList, setGetAllList] = useState();
  const [agentId, setAgentId] = useState();
  const [ticketStatus, setTicketStatus] = useState();
  const [agentList, setAgentList] = useState();
  const [count, setCount] = useState();
  const [ticketListing, setTicketListing] = useState();
  const navigate = useNavigate();
  function getAllList() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/incident-management/get-All-incident-management/null',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let unassigned = _.groupBy(res?.data?.data, 'status');
          setCount({
            Total:
              (unassigned?.UNASSIGNED?.length || 0) +
              (unassigned?.PENDING?.length || 0) +
              (unassigned?.CLOSED?.length || 0) +
              (unassigned?.HOLD?.length || 0) +
              (unassigned?.OPEN?.length || 0) +
              (unassigned?.REOPEN?.length || 0),
            unassigned: unassigned?.UNASSIGNED?.length || 0,
            pending: unassigned?.PENDING?.length || 0,
            closed: unassigned?.CLOSED?.length || 0,
            hold: unassigned?.HOLD?.length || 0,
            open: unassigned?.OPEN?.length || 0,
            reopen: unassigned?.REOPEN?.length || 0,
          });
          setTicketListing(res?.data?.data);
        }
      })
      .catch((err) => {});
  }

  useEffect(() => {
    axios
      // .get(Api.baseUri + '/user-reg/ticketStatus/get-all-ticket-status')
      .get(Api.baseUri + '/user-reg/ticketStatus/getTicketByCorporateId/' + user?.userList?.profileId)
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
      return;
    }
    if (agentId) {
      getByAgentId(agentId?.value);
    }
  }, [agentId]);

  function getByAgentId(ag) {
    if (ag) {
      axios
        .get(
          Api.baseUri +
            '/user-reg/incident-management/get-all-incident-by-teamId/' +
            ag,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            setTicketListing(res?.data?.data);
          }
        })
        .catch((err) => {});
    }
  }

  const Items = styled(Paper)(({theme}) => ({}));

  useEffect(() => {
    let temp = [];
    axios
      .get(
        Api.baseUri +
          '/user-reg/incidentTeam/getAllByCorporateId/' +
          user?.userList?.corporateId,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          res?.data?.data?.map((el) => {
            temp.push({title: el?.teamName, value: el?.id});
          });
          setAgentList(temp ?? []);
        }
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <Grid container>
        <Grid item md={3}>
          <Autocomplete
            // value={}
            limitTags={1}
            disabled={user?.userList?.userRoleName == 'EMPLOYEE'}
            options={agentList ?? []}
            getOptionLabel={(option) => option.title}
            onChange={(e, data) => {
              setAgentId(data);
            }}
            disablePortal
            // size='small'
            id='combo-box-demo'
            sx={{width: '100%', maxWidth: '250px', background: 'white'}}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  id='outlined-error-helper-text'
                  label='Team'
                />
              );
            }}
          />
        </Grid>
        <Grid item md={9}>
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
                bgColor={'#F7DC6F'}
                number={count?.pending || 0}
              />
            </Grid>
            {/* <Grid item md={2}>
              <CardView
                title={'Hold'}
                bgColor={'#EDBB99'}
                number={count?.hold || 0}
              />
            </Grid> */}
            <Grid item md={2}>
              <CardView
                title={'Open'}
                bgColor={'#EDBB99'}
                number={count?.open || 0}
              />
            </Grid>
            <Grid item md={2}>
              <CardView
                title={'Reopen'}
                bgColor={'#EDBB99'}
                number={count?.reopen || 0}
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
                          // p: 0,
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
                                ticketCode={el?.ticketCode ? el?.ticketCode : "--"}
                                subject={el?.subject ? el?.subject : "--"}
                                name={el?.ticketForName ? el?.ticketForName : "--"}
                                date={el?.createdOn}
                                status={el?.status ? el?.status : '--'}
                                conversation = {el?.remarksHistory?.length ? el?.remarksHistory?.length + 1 : "1" }
                                channel = {el?.channelName ? el?.channelName : "--"}

                                // departMentName={el?.departmentName}
                              />
                            </div>
                            // </Items>

                            // <Box
                            //   item
                            //   md={12}
                            //   onClick={() => {
                            //     navigate('/ticket-view/' + el?.id);
                            //   }}
                            //   sx={{
                            //     // marginBottom: '10px',
                            //     borderBottom:
                            //       '1px solid rgba(224, 224, 224, 1)',
                            //     '&:last-of-type': {
                            //       mb: 0,
                            //       // borderBottom: 0,
                            //     },
                            //   }}
                            // >
                            //   <Box
                            //     sx={{
                            //       padding: '10px 20px',
                            //     }}
                            //   >
                            //     <div
                            //       style={{
                            //         display: 'flex',
                            //         justifyContent: 'space-between',
                            //       }}
                            //     >
                            //       <p
                            //         style={{
                            //           fontWeight: '600',
                            //           color: 'black',
                            //         }}
                            //       >
                            //         {el?.subject}
                            //       </p>
                            //       {el?.ticketOwner?.length == 0 ? (
                            //         <PersonAddAltIcon
                            //           onClick={() => {
                            //             setOpenDialog(true);
                            //             setId(el?.id);
                            //           }}
                            //         />
                            //       ) : (
                            //         ''
                            //       )}
                            //     </div>
                            //     <div
                            //       style={{
                            //         display: 'flex',
                            //         marginTop: '5px',
                            //       }}
                            //     >
                            //       <p>{'#' + el?.ticketCode}</p>
                            //       <p style={{marginLeft: '15px'}}>
                            //         {el?.ticketForName}
                            //       </p>
                            //     </div>
                            //     <div
                            //       style={{
                            //         display: 'flex',
                            //         marginTop: '5px',
                            //       }}
                            //     >
                            //       <img
                            //         src={'/assets/images/watch.svg'}
                            //         style={{
                            //           width: '16px',
                            //           height: '16px',
                            //           marginTop: '3px',
                            //         }}
                            //       />
                            //       <p style={{marginLeft: '15px'}}>4 days ago</p>
                            //     </div>
                            //     <div
                            //       style={{
                            //         marginTop: '8px',
                            //         display: 'flex',
                            //         flexDirection: 'initial',
                            //       }}
                            //     >
                            //       <p style={{marginRight: '10px'}}>
                            //         {el?.status ? el?.status : '--'}
                            //       </p>
                            //     </div>
                            //   </Box>
                            // </Box>
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
export default TeamQueue;
