import React, {useState, useEffect} from 'react';
import Typography from '@mui/material/Typography';
import {Button, Checkbox, Tooltip} from '@mui/material';
import moment from 'moment';
import _ from 'lodash';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Confirm from '@confirmation-box';
import {IconButton} from '@mui/material';
import AppTooltip from '@crema/core/AppTooltip';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
const RouteDataList = ({
  dlinkData,
  childdata,
  id,
  selectedAccord,
  selectParentData,
  selectChildData,
  selectTripEmp,
  remInput,
  searchAction,
  deleteEmpFromTrip,
  moveEmpToOtherTrip,
  selectedDate,
  cancelOrNoshowTrip,
  pid,
}) => {
  const cutoffTime = 2;
  const [confirmCancel, setConfirmCancel] = useState({});
  const [myTripEmpDet, setmyTrip] = useState();
  function differencebetweenTime(d1, d2) {
    if (!d1 || !d2) return;
    // Declare dates
    let td1 = new Date(d1);
    let td2 = new Date(d2);
    let dif = td2 - td1;
    dif = Math.round(dif / 1000 / 60);
    return dif;
  }
  useEffect(() => {
    setmyTrip(childdata[id]?.stops);
    let temarr = [];
    childdata[id]?.stops?.map((el, i) => {
      if (
        childdata[id]?.tripType == 'UPTRIP' &&
        i + 1 < childdata[id]?.stops?.length
      ) {
        if (i == 0 && el.escortTrip == 'YES') return;
        el.onBoardPassengers?.map((e_) => {
          temarr.push({
            ...e_,
            delayBy: differencebetweenTime(
              e_.expectedArivalTime,
              e_.actualPickUpDateTime,
            ),
          });
        });
      }
      if (childdata[id]?.tripType == 'DOWNTRIP' && i > 0) {
        if (i + 1 >= childdata[id]?.stops?.length && el.escortTrip == 'YES')
          return;
        el.deBoardPassengers?.map((e_) => {
          temarr.push({
            ...e_,
            delayBy: differencebetweenTime(
              e_.expectedArivalTime,
              e_.actualDropDateTime,
            ),
          });
        });
      }
    });
    setmyTrip(temarr);
  }, [childdata[id]]);

  function subtractHours(date, hours) {
    date.setHours(date.getHours() - hours);
    return date;
  }
  async function handlePop(d) {
    if (d == 'NO') setConfirmCancel({});
    else {
      await cancelOrNoshowTrip(
        confirmCancel.e,
        confirmCancel.index,
        confirmCancel.type,
      );
    }
    setConfirmCancel({});
  }
  return (
    <>
      {childdata[id]?.empList?.length ? (
        <tr style={{lineHeight: '40px', background: '#eff7ff'}}>
          <div
            style={{
              position: 'absolute',
              height: '100%',
              display: 'flex',
              padding: '10px',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {' '}
          </div>
          {searchAction != 'ASSIGN_TO_VENDOR' ? (
            <td
              className='tbl-border'
              style={{width: '5%', paddingLeft: '5px', borderLeft: '0px'}}
            >
              <Typography>
                <Checkbox
                  // disabled={!searchAction}
                  // disabled={true}

                  checked={
                    selectedDate < moment(new Date()).format('YYYY-MM-DD')
                      ? false
                      : null || selectedAccord?.includes(id)
                  }
                  color='success'
                  style={{
                    display: childdata[id]?.status == 'CANCLED' ? 'none' : '',
                  }}
                  onChange={(e) => {
                    selectParentData(e?.target?.checked, id);
                  }}
                />
              </Typography>
            </td>
          ) : null}
          {/* <td className='tbl-border' style={{ "width": "5%" }}></td> */}
          <td className='tbl-border' style={{width: '5%'}}>
            Emp Code
          </td>
          <td className='tbl-border' style={{width: '10%'}}>
            Employee Name
          </td>
          <td className='tbl-border' style={{width: '5%'}}>
            Gender
          </td>
          {/* <td className='tbl-border' style={{ "width": "20%" }}>Pickup</td> */}

          <td className='tbl-border' style={{width: '20%'}}>
            {childdata[id].tripType == 'UPTRIP'
              ? 'Pickup'
              : childdata[id].tripType == 'DOWNTRIP'
              ? 'Drop'
              : 'PickUp/Drop'}
          </td>
          <td className='tbl-border' style={{width: '15%'}}>
            Locality
          </td>
          <td className='tbl-border' style={{width: '15%'}}>
            Office
          </td>
          {/* <td className='tbl-border' style={{ "width": "15%" }}>Shift Time</td> */}
          <td
            className='tbl-border'
            style={{
              width: childdata[id].tripCategory !== 'Adhoc' ? '5%' : '15%',
            }}
          >
            ETA
          </td>
          {childdata[id].tripCategory !== 'Adhoc' && (
            <td
              className='tbl-border'
              style={{width: '10%', textAlign: 'center'}}
            >
              Action + {childdata[id].tripCategory}
            </td>
          )}
        </tr>
      ) : null}

      {childdata[id]?.empList?.length
        ? childdata[id]['empList'].map((e, index) => {
            return (
              <>
                {e?.passType != 'ESCORT' && (
                  <tr
                    style={{
                      lineHeight: '40px',
                      position: 'relative',
                      // background:
                      //   e?.status == 'CANCLED'
                      //     ? '#fdf0f2'
                      //     : e?.status == 'ABSENT'
                      //     ? '#fff7f2'
                      //     : e?.status == 'NOSHOW'
                      //     ? '#fff5f5'
                      //     : '',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        height: '100%',
                        display: 'flex',
                        padding: '10px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                    >
                      {e?.status == 'CANCLED' && (
                        <img
                          style={{height: '60px', opacity: '0.2'}}
                          src='/assets/images/cancelled-bg.svg'
                        />
                      )}
                      {e?.status == 'NOSHOW' && (
                        <img
                          style={{height: '60px', opacity: '0.2'}}
                          src='/assets/images/noshow-bg.svg'
                        />
                      )}
                      {e?.status == 'ABSENT' && (
                        <img
                          style={{height: '60px', opacity: '0.2'}}
                          src='/assets/images/absentabsent-bg.svg'
                        />
                      )}
                    </div>
                    {searchAction != 'ASSIGN_TO_VENDOR' ? (
                      <td
                        className='tbl-border'
                        style={{
                          width: '5%',
                          paddingLeft: '5px',
                          height: '130px',
                          borderLeft: '0px',
                        }}
                      >
                        <Typography>
                          {e.checked ? (
                            <Checkbox
                              // disabled={!searchAction}
                              style={{
                                display: e?.status == 'CANCLED' ? 'none' : '',
                              }}
                              color='success'
                              checked={
                                selectedDate <
                                moment(new Date()).format('YYYY-MM-DD')
                                  ? false
                                  : null || true
                              }
                              onChange={(ev) => {
                                selectChildData(ev?.target?.checked, id, e?.id);
                                // selectTripEmp(ev?.target?.checked, id, e?.id)
                              }}
                            />
                          ) : (
                            <Checkbox
                              // disabled={!searchAction}
                              color='success'
                              checked={false}
                              onChange={(ev) => {
                                selectChildData(ev?.target?.checked, id, e?.id);
                                // selectTripEmp(ev?.target?.checked, id, e?.id)
                              }}
                            />
                          )}
                        </Typography>
                      </td>
                    ) : null}
                    <td
                      className='tbl-border'
                      style={{
                        width: '15%',
                        minWidth: '150px',
                        position: 'relative',
                      }}
                    >
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span>{e.empCode}</span>
                        <div>
                          <div
                            style={{
                              width: '100px',
                              height: '10px',
                              fontSize: '12px',
                            }}
                          >
                            <span
                              style={{
                                background:
                                  e.status == 'CANCLED' ||
                                  e.status == 'NOSHOW' ||
                                  e.status == 'ABSENT'
                                    ? 'orange'
                                    : e.status == 'SCHEDULE'
                                    ? 'red'
                                    : e.status == 'BOARDED'
                                    ? '#063f5b'
                                    : e.status == 'COMPLETED'
                                    ? 'green'
                                    : 'grey',
                                padding: '4px',
                                borderRadius: '5px',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '10px',
                              }}
                            >
                              {e.status == 'CANCLED' ? 'CANCELLED' : e.status}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: '11px',
                              marginTop: '-19px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {e.geoFenceViolation == 'YES' && (
                              <AppTooltip
                                title='Geofence Violation'
                                placement='bottom'
                              >
                                <WarningAmberIcon //geoFenceViolation
                                  style={{
                                    color: '#c24800',
                                    fontSize: '22px',
                                    marginLeft: '10px',
                                  }}
                                />
                              </AppTooltip>
                            )}
                          </span>
                        </div>

                        <div
                          style={{
                            position: 'absolute',
                            bottom: '-8px',
                            left: '8px',
                          }}
                        >
                          {myTripEmpDet?.length > index &&
                            myTripEmpDet[index]?.delayBy > 0 && (
                              <AppTooltip title='Delayed' placement='bottom'>
                                <span
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: '#e53835',
                                  }}
                                >
                                  <img
                                    src='/assets/images/delay-icon.svg'
                                    style={{height: '15px', marginRight: '3px'}}
                                  />{' '}
                                  <span>
                                    {myTripEmpDet[index]?.delayBy?.toFixed()}{' '}
                                    mins (ED)
                                  </span>
                                </span>
                              </AppTooltip>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className='tbl-border' style={{width: '10%'}}>
                      {e?.name}
                    </td>
                    <td
                      className='tbl-border'
                      style={{
                        width: '5%',
                      }}
                    >
                      {e?.gender == 'Male' ? 'M' : 'F'}
                    </td>
                    <td className='tbl-border' style={{width: '20%'}}>
                      {e?.location?.locName}
                    </td>
                    <td className='tbl-border' style={{width: '15%'}}>
                      {e?.location?.locality}
                    </td>
                    <td className='tbl-border' style={{width: '15%'}}>
                      {/* {e.officeLocation?.locName} */}
                      {e.officeName}
                    </td>
                    {/* <td className='tbl-border' style={{ "width": "15%" }}>{e.shiftTiming}</td> */}
                    <td className='tbl-border' style={{width: '5%'}}>
                      {e?.eta?.split(' ')[1]}
                    </td>
                    {e.tripCategory !== 'ADHOCTRIP' && (
                      <td
                        className='tbl-border'
                        style={{width: '10%', textAlign: 'center'}}
                      >
                        {
                          <>
                            <div
                              style={{
                                opacity:
                                  new Date(e?.date + 'T23:59') > new Date()
                                    ? ''
                                    : '0.3',
                              }}
                            >
                              <Tooltip
                                title={
                                  new Date(
                                    subtractHours(
                                      new Date(
                                        e?.date + 'T' + e?.shiftTime + ':00',
                                      ),
                                      cutoffTime,
                                    ),
                                  ) > new Date()
                                    ? 'Cancel'
                                    : 'No Show'
                                }
                              >
                                <div>
                                  <IconButton
                                    disabled={
                                      e?.startTime <
                                      new Date().toLocaleTimeString()
                                        ? true
                                        : false || e?.status !== 'SCHEDULE'
                                        ? true
                                        : false
                                    }
                                  >
                                    <HighlightOffIcon
                                      onClick={() => {
                                        if (e?.status !== 'SCHEDULE') {
                                          return;
                                        }
                                        // if (!(new Date(e?.date + 'T23:59') > new Date())) return;
                                        setConfirmCancel({
                                          e: e,
                                          index: index,
                                          type:
                                            new Date(
                                              subtractHours(
                                                new Date(
                                                  e?.date +
                                                    'T' +
                                                    e?.shiftTime +
                                                    ':00',
                                                ),
                                                cutoffTime,
                                              ),
                                            ) > new Date()
                                              ? 'CANCLED'
                                              : 'NOSHOW',
                                        });
                                      }}
                                    />
                                  </IconButton>
                                </div>
                              </Tooltip>
                              <IconButton
                                disabled={
                                  e.status == 'CANCLED' ||
                                  e.status == 'NOSHOW' ||
                                  e.status == 'ABSENT' ||
                                  e.status == 'EXPIRED'
                                    ? true
                                    : false
                                }
                              >
                                <Tooltip title='Remove Employee'>
                                  <img
                                    className='icon-pointer'
                                    src='/assets/images/route_page_icon/delete_user.png'
                                    style={{marginRight: '10px'}}
                                    onClick={(eve) => {
                                      if (
                                        !(
                                          new Date(e?.date + 'T23:59') >
                                          new Date()
                                        )
                                      )
                                        return;
                                      deleteEmpFromTrip({
                                        ...e,
                                        tripId: pid,
                                      });
                                    }}
                                  />
                                </Tooltip>
                              </IconButton>
                              <IconButton
                                disabled={
                                  e.status == 'CANCLED' ||
                                  e.status == 'NOSHOW' ||
                                  e.status == 'ABSENT' ||
                                  e.status == 'EXPIRED'
                                    ? true
                                    : false
                                }
                              >
                                <Tooltip title='Move Employee'>
                                  <img
                                    className='icon-pointer'
                                    src='/assets/images/route_page_icon/shift.png'
                                    onClick={(eve) => {
                                      if (
                                        !(
                                          new Date(e?.date + 'T23:59') >
                                          new Date()
                                        )
                                      )
                                        return;
                                      moveEmpToOtherTrip(e, pid);
                                    }}
                                  />
                                </Tooltip>
                              </IconButton>
                            </div>
                          </>
                        }
                      </td>
                    )}
                  </tr>
                )}
                {confirmCancel?.type && (
                  <Confirm
                    open={true}
                    header={
                      'Confirm to ' +
                      (confirmCancel?.type == 'CANCLED'
                        ? 'Cancel'
                        : 'No Show') +
                      ' Group'
                    }
                    cnfMsg={`Are you sure, You want to ${
                      confirmCancel?.type == 'CANCLED' ? 'cancel' : 'no show'
                    } employee?`}
                    handleClose={handlePop}
                  />
                )}
              </>
            );
          })
        : null}
    </>
  );
};

export default RouteDataList;
