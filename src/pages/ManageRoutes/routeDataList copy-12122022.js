import React, {useState, useEffect} from 'react';
import Typography from '@mui/material/Typography';
import {Button, Checkbox, Tooltip} from '@mui/material';
import _ from 'lodash';

const RouteDataList = ({
  childdata,
  id,
  selectedAccord,
  selectParentData,
  selectChildData,
  remInput,
  searchAction,
  deleteEmpFromTrip,
}) => {
  return (
    <>
      <tr style={{lineHeight: '40px', background: '#eff7ff'}}>
        {searchAction != 'ASSIGN_TO_VENDOR' ? (
          <td className='tbl-border' style={{width: '5%', paddingLeft: '5px'}}>
            <Typography>
              <Checkbox
                disabled={!searchAction}
                checked={selectedAccord?.includes(id)}
                color='success'
                onChange={(e) => {
                  selectParentData(e?.target?.checked, id);
                }}
              />
            </Typography>
          </td>
        ) : null}
        <td className='tbl-border' style={{width: '15%'}}>
          Employee No
        </td>
        <td className='tbl-border' style={{width: '15%'}}>
          Employee Name
        </td>
        <td className='tbl-border' style={{width: '15%'}}>
          Gender
        </td>
        <td className='tbl-border' style={{width: '15%'}}>
          Pickup
        </td>
        <td className='tbl-border' style={{width: '15%'}}>
          Locality
        </td>
        <td className='tbl-border' style={{width: '15%'}}>
          Office
        </td>
        {/* <td className='tbl-border' style={{ "width": "10%" }}>Remarks</td> */}
        <td className='tbl-border' style={{width: '10%', textAlign: 'center'}}>
          Action
        </td>
      </tr>
      {childdata[id]?.empList?.length
        ? childdata[id]['empList'].map((e, index) => {
            {
            }
            return (
              <>
                <tr style={{lineHeight: '40px'}}>
                  {searchAction != 'ASSIGN_TO_VENDOR' ? (
                    <td
                      className='tbl-border'
                      style={{width: '5%', paddingLeft: '5px'}}
                    >
                      <Typography>
                        {e.checked ? (
                          <Checkbox
                            // disabled={!searchAction}
                            color='success'
                            checked={true}
                            onChange={(ev) => {
                              selectChildData(ev?.target?.checked, id, e?.id);
                            }}
                          />
                        ) : (
                          <Checkbox
                            disabled={!searchAction}
                            color='success'
                            checked={false}
                            onChange={(ev) => {
                              selectChildData(ev?.target?.checked, id, e?.id);
                            }}
                          />
                        )}
                      </Typography>
                    </td>
                  ) : null}
                  <td className='tbl-border' style={{width: '15%'}}>
                    {e.empCode}
                  </td>
                  <td className='tbl-border' style={{width: '15%'}}>
                    {e.name}
                  </td>
                  <td className='tbl-border' style={{width: '15%'}}>
                    {e.gender}
                  </td>
                  <td className='tbl-border' style={{width: '10%'}}>
                    {e.location.locName}
                  </td>
                  <td className='tbl-border' style={{width: '10%'}}>
                    {e.location.locName}
                  </td>
                  <td className='tbl-border' style={{width: '10%'}}>
                    {e.officeLocation?.locName}
                  </td>
                  {/* <td className='tbl-border' style={{ "width": "10%" }}>
                                <Typography><input type="text" id={index + "REM"} className="route-emp-remarks"
                                    value={e?.remarks}
                                    onInput={(event) => {
                                        remInput(event?.target?.value, e.id, id);
                                    }} /></Typography>
                            </td> */}
                  <td
                    className='tbl-border'
                    style={{width: '10%', textAlign: 'center'}}
                  >
                    <img
                      className='icon-pointer'
                      src='/assets/images/route_page_icon/employee.png'
                      style={{marginRight: '5px'}}
                      onClick={(eve) => {
                        deleteEmpFromTrip(e);
                      }}
                    />
                    <img
                      className=''
                      src='/assets/images/route_page_icon/employee.png'
                    />
                  </td>
                  <td style={{width: '10%'}}>
                    <img
                      className=''
                      src='/assets/images/route_page_icon/employee.png'
                    />
                    {/* Not in use */}
                  </td>
                </tr>
              </>
            );
          })
        : null}
    </>
  );
};

export default RouteDataList;
