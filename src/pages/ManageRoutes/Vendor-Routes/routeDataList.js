import React, {useState, useEffect} from 'react';
import _ from 'lodash';
import AppTooltip from '@crema/core/AppTooltip';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Typography from '@mui/material/Typography';
import {Button, Checkbox, Tooltip} from '@mui/material';
import moment from 'moment';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Confirm from '@confirmation-box';
import {IconButton} from '@mui/material';
const RouteDataList = ({childdata, id}) => {
  return (
    <>
      {childdata[id]?.empList?.length ? (
        <tr style={{lineHeight: '40px', background: '#eff7ff'}}>
          <td className='tbl-border' style={{width: '15%'}}>
            Employee Code
          </td>
          <td className='tbl-border' style={{width: '15%'}}>
            Employee Name
          </td>
          <td className='tbl-border' style={{width: '5%'}}>
            Gender
          </td>
          <td className='tbl-border' style={{width: '20%'}}>
            Pickup
          </td>
          <td className='tbl-border' style={{width: '15%'}}>
            Locality
          </td>
          <td className='tbl-border' style={{width: '15%'}}>
            Office
          </td>
          {/* <td className='tbl-border' style={{ "width": "15%" }}>Shift Time</td> */}
          <td className='tbl-border' style={{width: '5%'}}>
            ETA
          </td>
          {}
        </tr>
      ) : null}

      {childdata[id]?.empList?.length
        ? childdata[id]['empList'].map((e, index) => {
            // {   }
            return (
              <>
                {e?.passType != 'ESCORT' && (
                  <tr style={{lineHeight: '40px'}}>
                    <td className='tbl-border' style={{width: '15%'}}>
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span>{e?.empCode}</span>
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
                        {/* <span style={{fontSize: '11px', marginTop: '-19px'}}>
                          {e?.status == 'CANCLED' ? 'CANCELLED' : e?.status}
                        </span> */}
                      </div>
                    </td>
                    <td className='tbl-border' style={{width: '15%'}}>
                      <div>
                        <span>{e?.name}</span>
                      </div>
                    </td>
                    <td className='tbl-border' style={{width: '5%'}}>
                      {e?.gender == 'Male' ? 'M' : 'F'}
                    </td>
                    <td className='tbl-border' style={{width: '20%'}}>
                      {e.location?.locName}
                    </td>
                    <td className='tbl-border' style={{width: '10%'}}>
                      {e?.location?.locality}
                    </td>
                    <td className='tbl-border' style={{width: '10%', alignItems: "center"}}>
                      {/* {e.officeLocation?.locName} */}
                      {e?.officeName}
                    </td>
                    {/* <td className='tbl-border' style={{ "width": "15%" }}>{e.shiftTiming}</td> */}
                    <td className='tbl-border' style={{width: '5%'}}>
                      {e?.eta?.split(' ')[1]}
                    </td>
                  </tr>
                )}
              </>
            );
          })
        : null}
    </>
  );
};

export default RouteDataList;
