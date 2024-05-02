import React, {useEffect} from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Api from '@api';

const BottomPannel = ({
  type,
  currFilter,
  setCurrFilter,
  filterType,
  setFilterType,
  tripCounts,
}) => {
  return (
    <div>
      <div className='section-bottom' style={{marginLeft: '18px'}}>
        <div
          className='live-tracking-header-btns'
          style={{
            marginLeft: type == 'full-window' ? '-64px' : '',
            width: type == 'full-window' ? 'auto' : '',
          }}
        >
          <div
            style={{
              textAlign: 'left',
              width: '5%',
              opacity: currFilter == 0 ? '0.3' : '',
            }}
          >
            <ArrowBackIosNewIcon
              className='arr-btns'
              onClick={() => {
                if (currFilter > 0) setCurrFilter(currFilter - 1);
              }}
            />
          </div>
          {currFilter == 0 ? (
            <>
              <div
                className={
                  filterType == 'GEOFENCE_VIOLATION'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'GEOFENCE_VIOLATION') setFilterType('');
                  else setFilterType('GEOFENCE_VIOLATION');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'GEOFENCE_VIOLATION' ? 'center' : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/Geofence Violation.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{
                      top: filterType == 'GEOFENCE_VIOLATION' ? '-22px' : '8px',
                    }}
                  >
                    {tripCounts?.geofence_violation?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>Geofence Violation</div>
                </div>
              </div>
              <div
                className={
                  filterType == 'ESCORT_TRIP'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'ESCORT_TRIP') setFilterType('');
                  else setFilterType('ESCORT_TRIP');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'ESCORT_TRIP' ? 'center' : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/female.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{top: filterType == 'ESCORT_TRIP' ? '-22px' : '8px'}}
                  >
                    {tripCounts?.escortTrip?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>Escort Trip</div>
                </div>
              </div>
              {/* setSiteOfficeLocation({latitude: "28.606924551706342",longitude: "78.38007251094488"}); */}
              <div
                className={
                  filterType == 'FEMALE_TRAVELING'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'FEMALE_TRAVELING') setFilterType('');
                  else setFilterType('FEMALE_TRAVELING');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'FEMALE_TRAVELING' ? 'center' : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/Female Traveling.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{
                      top: filterType == 'FEMALE_TRAVELING' ? '-22px' : '8px',
                    }}
                  >
                    {tripCounts?.female?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>Female Traveling</div>
                </div>
              </div>

              <div
                className={
                  filterType == 'SOS_ALERT'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'SOS_ALERT') setFilterType('');
                  else setFilterType('SOS_ALERT');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'SOS_ALERT' ? 'center' : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/sos.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{top: filterType == 'SOS_ALERT' ? '-22px' : '8px'}}
                  >
                    {tripCounts?.sos?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>SOS Alert</div>
                </div>
              </div>
              <div
                className={
                  filterType == 'VEHICLE_NEAR_OFC_2KM'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'VEHICLE_NEAR_OFC_2KM') setFilterType('');
                  else setFilterType('VEHICLE_NEAR_OFC_2KM');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'VEHICLE_NEAR_OFC_2KM'
                          ? 'center'
                          : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/vehicle_in_office.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{
                      top:
                        filterType == 'VEHICLE_NEAR_OFC_2KM' ? '-22px' : '8px',
                    }}
                  >
                    {tripCounts?.nearOfc?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>
                    Vehicle Near Office (2KM)
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {currFilter == 1 ? (
            <>
              <div
                className={
                  filterType == 'EXPECTED_DELAYED_DROP'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'EXPECTED_DELAYED_DROP') setFilterType('');
                  else setFilterType('EXPECTED_DELAYED_DROP');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'EXPECTED_DELAYED_DROP'
                          ? 'center'
                          : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/expected_delayed_drop.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{
                      top:
                        filterType == 'EXPECTED_DELAYED_DROP' ? '-22px' : '8px',
                    }}
                  >
                    {tripCounts?.expecteddelayedTrip?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>
                    Expected Delayed Pickup / Drop
                  </div>
                </div>
              </div>
              <div
                className={
                  filterType == 'EXPECTED_FIRST_PICKUP_DELAYED'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'EXPECTED_FIRST_PICKUP_DELAYED')
                    setFilterType('');
                  else setFilterType('EXPECTED_FIRST_PICKUP_DELAYED');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'EXPECTED_FIRST_PICKUP_DELAYED'
                          ? 'center'
                          : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/expected first pickup delayed.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{
                      top:
                        filterType == 'EXPECTED_FIRST_PICKUP_DELAYED'
                          ? '-22px'
                          : '8px',
                    }}
                  >
                    {tripCounts?.expected_fpd?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>
                    Expected First Pickup Delayed
                  </div>
                </div>
              </div>

              {/* <div className={filterType == 'NON_COMPLIANT_VEHICLE' ? 'carousel-item-5 highlighted-filter' : 'carousel-item-5'} onClick={() => { if (filterType == 'NON_COMPLIANT_VEHICLE') setFilterType(''); else setFilterType('NON_COMPLIANT_VEHICLE') }}>
                            <div style={{ padding: '10px', position: 'relative' }} >
                                <span className='icon-span' style={{ justifyContent: filterType == 'NON_COMPLIANT_VEHICLE' ? 'center' : 'start' }}>
                                    <img src="/assets/images/live-tracking/non_compliant_vehicle.svg" className='icon' />
                                </span>
                                <span className='count' style={{ top: filterType == 'NON_COMPLIANT_VEHICLE' ? '-22px' : '8px' }}>{0}</span>
                                <div style={{whiteSpace:'nowrap'}}>Non Compliant Vehicle</div>
                            </div>
                        </div> */}

              <div
                className={
                  filterType == 'DELAYED_BOARDING_DEBOARDING'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'DELAYED_BOARDING_DEBOARDING')
                    setFilterType('');
                  else setFilterType('DELAYED_BOARDING_DEBOARDING');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'DELAYED_BOARDING_DEBOARDING'
                          ? 'center'
                          : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/sos.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{
                      top:
                        filterType == 'DELAYED_BOARDING_DEBOARDING'
                          ? '-22px'
                          : '8px',
                    }}
                  >
                    {tripCounts?.delayedTrip?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>
                    Delayed Boarding / Deboarding
                  </div>
                </div>
              </div>
              <div
                className={
                  filterType == 'FIRST_PICKUP_DELAYED'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'FIRST_PICKUP_DELAYED') setFilterType('');
                  else setFilterType('FIRST_PICKUP_DELAYED');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'FIRST_PICKUP_DELAYED'
                          ? 'center'
                          : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/special employee trip.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{
                      top:
                        filterType == 'FIRST_PICKUP_DELAYED' ? '-22px' : '8px',
                    }}
                  >
                    {tripCounts?.fpd?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>First Pickup Delayed</div>
                </div>
              </div>
            </>
          ) : null}

          {currFilter == 2 ? (
            <>
              <div
                className={
                  filterType == 'VEHICLE_STOPPAGE_MORE_THAN_5_MINS'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'VEHICLE_STOPPAGE_MORE_THAN_5_MINS')
                    setFilterType('');
                  else setFilterType('VEHICLE_STOPPAGE_MORE_THAN_5_MINS');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'VEHICLE_STOPPAGE_MORE_THAN_5_MINS'
                          ? 'center'
                          : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/vehicle_stoppage_more_than_5.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{
                      top:
                        filterType == 'VEHICLE_STOPPAGE_MORE_THAN_5_MINS'
                          ? '-22px'
                          : '8px',
                    }}
                  >
                    {tripCounts?.stop_morethan_5?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>
                    Vehicle Stop More Than 5 Mins
                  </div>
                </div>
              </div>
              <div
                className={
                  filterType == 'GPS_SIGNAL_LOST'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'GPS_SIGNAL_LOST') setFilterType('');
                  else setFilterType('GPS_SIGNAL_LOST');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'GPS_SIGNAL_LOST' ? 'center' : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/GPS Signal Lost.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{
                      top: filterType == 'GPS_SIGNAL_LOST' ? '-22px' : '8px',
                    }}
                  >
                    {tripCounts?.gps_lost?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>GPS Signal Lost</div>
                </div>
              </div>

              <div
                className={
                  filterType == 'OVER_SPEEDING'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'OVER_SPEEDING') setFilterType('');
                  else setFilterType('OVER_SPEEDING');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'OVER_SPEEDING' ? 'center' : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/Over Speeding.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{
                      top: filterType == 'OVER_SPEEDING' ? '-22px' : '8px',
                    }}
                  >
                    {tripCounts?.over_speeding?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>Over Speeding</div>
                </div>
              </div>

              <div
                className={
                  filterType == 'SPECIAL_EMP_TRIP'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'SPECIAL_EMP_TRIP') setFilterType('');
                  else setFilterType('SPECIAL_EMP_TRIP');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'SPECIAL_EMP_TRIP' ? 'center' : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/special employee trip.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{
                      top: filterType == 'SPECIAL_EMP_TRIP' ? '-22px' : '8px',
                    }}
                  >
                    {tripCounts?.special_employee?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>
                    Special Employee Trip
                  </div>
                </div>
              </div>

              <div
                className={
                  filterType == 'ADHOC_TRIP'
                    ? 'carousel-item-5 highlighted-filter'
                    : 'carousel-item-5'
                }
                onClick={() => {
                  if (filterType == 'ADHOC_TRIP') setFilterType('');
                  else setFilterType('ADHOC_TRIP');
                }}
              >
                <div style={{padding: '10px', position: 'relative'}}>
                  <span
                    className='icon-span'
                    style={{
                      justifyContent:
                        filterType == 'ADHOC_TRIP' ? 'center' : 'start',
                    }}
                  >
                    <img
                      src='/assets/images/live-tracking/adhoc.svg'
                      className='icon'
                    />
                  </span>
                  <span
                    className='count'
                    style={{top: filterType == 'ADHOC_TRIP' ? '-22px' : '8px'}}
                  >
                    {tripCounts?.adhoc?.length || 0}
                  </span>
                  <div style={{whiteSpace: 'nowrap'}}>Adhoc Trip</div>
                </div>
              </div>
            </>
          ) : null}
          {/* <div className='carousel-item-5'>
                            <div onClick={() => { if(filterType=='GEOFENCE_VIOLATION') setFilterType(''); else setFilterType('') }}>Clear Filter</div>
                        </div> */}
          {type == 'DEFAULT' && (
            <div
              className='carousel-item-5'
              style={{display: 'flex', alignItems: 'center'}}
            >
              <div
                sx={{textAlign: 'center', mr: 2}}
                onClick={() => {
                  setOpen(true);
                }}
              >
                <a
                  style={{color: 'red', textDecoration: 'none'}}
                  href={
                    Api.mycurrentServer +
                    '/test-live-tracking-dashboard/full-window'
                  }
                  target='_blank'
                >
                  Open in Full Tab
                </a>
              </div>
            </div>
          )}
          <div
            style={{
              textAlign: 'right',
              width: '5%',
              opacity: currFilter == 2 ? '0.3' : '',
            }}
          >
            <ArrowForwardIosIcon
              className='arr-btns'
              onClick={() => {
                if (currFilter < 2) setCurrFilter(currFilter + 1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomPannel;
