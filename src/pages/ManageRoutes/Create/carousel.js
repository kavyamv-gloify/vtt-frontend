import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import CarouselCard from './carouselcards';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Api from '@api';
import moment from 'moment';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Grid, TextField} from '@mui/material';

const Slider = ({rosterChecked}) => {
  const {user} = useAuthUser();
  const [rosterShiftList, setrosterShiftList] = useState([]);
  const [ShiftList, setShiftList] = useState();
  const [transError, setTransError] = useState({});
  const [formDates, setFormDates] = useState({
    trxFromDate: `${moment().format('YYYY-MM-DD')}`,
    trxToDate: `${moment().format('YYYY-MM-DD')}`,
  });
  console.log('formDates', formDates);
  const handleFromDateChange = (event) => {
    const fromDate = event.target.value;
    setFormDates((prevDates) => ({
      ...prevDates,
      trxFromDate: fromDate,
    }));

    // Validate and set error
    if (
      formDates?.trxToDate &&
      new Date(fromDate) > new Date(formDates?.trxToDate)
    ) {
      setTransError({trans_error: true});
    } else {
      setTransError({});
    }
  };
  const handleToDateChange = (event) => {
    const toDate = event.target.value;
    setFormDates((prevDates) => ({
      ...prevDates,
      trxToDate: toDate,
    }));

    // Validate and set error
    if (
      formDates?.trxFromDate &&
      new Date(toDate) < new Date(formDates?.trxFromDate)
    ) {
      setTransError({trans_error: true});
    } else {
      setTransError({});
    }
  };
  useEffect(() => {}, [ShiftList]);
  useEffect(() => {
    if (rosterShiftList) rosterChecked(rosterShiftList);
  }, [rosterShiftList]);
  useEffect(() => {
    const storedSelectedIds =
      JSON.parse(localStorage.getItem('selectedIds')) || [];
    let url = `${Api.manageshifts.getlistbyCorporate}corporateId?page=0&size=1000&shiftName=null`;
    // let url =
    //   Api.baseUri +
    //   `/user-reg/trip-route/get-all-roster-shifts/${user?.userList?.corporateId}/2024-02-02/2024-02-09`;
    axios
      .get(url)
      .then((res) => {
        console.log('res', res);
        let tempo = [];
        res?.data?.data?.body?.ShiftList?.map((el, i) => {
          const todayDate = new Date();
          const tomorrowDate = new Date();
          tomorrowDate.setDate(tomorrowDate.getDate() + 1);
          let tem_dates = [];
          // tem_dates.push(moment(todayDate).format('YYYY-MM-DD'));
          tem_dates.push(moment(tomorrowDate).format('YYYY-MM-DD'));
          tem_dates.map((et) => {
            let login_elem = {};
            login_elem.isSelected = storedSelectedIds?.includes(
              res?.data?.data?.body?.ShiftList[i]?.id + '__LOGIN' + '__' + et,
            )
              ? true
              : false;
            login_elem.pickupType =
              res?.data?.data?.body?.ShiftList[i]?.pickupType;
            login_elem.shiftName =
              res?.data?.data?.body?.ShiftList[i]?.shiftName;
            login_elem.time = res?.data?.data?.body?.ShiftList[i]?.shiftStart;
            login_elem.date = et;
            login_elem.shiftName =
              res?.data?.data?.body?.ShiftList[i]?.shiftName;
            login_elem.id =
              res?.data?.data?.body?.ShiftList[i]?.id + '__LOGIN' + '__' + et;
            tempo.push(login_elem);

            let logout_elem = {};
            logout_elem.date = et;
            logout_elem.pickupType =
              res?.data?.data?.body?.ShiftList[i]?.pickupType;
            logout_elem.shiftName =
              res?.data?.data?.body?.ShiftList[i]?.shiftName;
            logout_elem.time = res?.data?.data?.body?.ShiftList[i]?.shiftEnd;
            logout_elem.shiftName =
              res?.data?.data?.body?.ShiftList[i]?.shiftName;
            logout_elem.isSelected = false;
            logout_elem.id =
              res?.data?.data?.body?.ShiftList[i]?.id + '__LOGOUT' + '__' + et;
            tempo.push(logout_elem);
          });
        });

        // console.log('tempo', tempo);
        tempo.sort(function (a, b) {
          return (
            new Date(a.date + 'T' + a.time + ':00Z') -
            new Date(b.date + 'T' + b.time + ':00Z')
          );
        }); //
        let t_ = [];
        tempo?.map((el) => {
          if (new Date(el.date + 'T' + el.time) > new Date()) {
            t_.push(el);
          }
        });

        setrosterShiftList([...t_]);
      })
      .catch((err) => {});
  }, []);
  // useEffect(() => {
  //   const storedSelectedIds =
  //     JSON.parse(localStorage.getItem('selectedIds')) || [];
  //   // let url = `${Api.manageshifts.getlistbyCorporate}corporateId?page=0&size=1000&shiftName=null`;
  //   if (formDates.trxFromDate && formDates.trxToDate) {
  //     let url =
  //       Api.baseUri +
  //       `/user-reg/trip-route/get-all-roster-shifts/${user?.userList?.corporateId}/${formDates.trxFromDate}/${formDates.trxToDate}`;
  //     axios
  //       .get(url)
  //       .then((res) => {
  //         console.log('res', res);
  //         let tempo = [];
  //         res?.data?.data?.map((el, i) => {
  //           if (el?.tripType == 'UPTRIP') {
  //             let login_elem = {};
  //             login_elem.isSelected = storedSelectedIds?.includes(
  //               el?.shiftId + '__LOGIN' + '__' + el?.date,
  //             )
  //               ? true
  //               : false;
  //             login_elem.pickupType = el?.pickupType;
  //             login_elem.shiftName = el?.shiftName;
  //             login_elem.time = el?.shiftStart;
  //             login_elem.date = el?.date;
  //             login_elem.shiftName = el?.shiftName;
  //             login_elem.id = el?.shiftId + '__LOGIN' + '__' + el?.date;
  //             tempo.push(login_elem);
  //           } else if (el?.tripType == 'DOWNTRIP') {
  //             let logout_elem = {};
  //             logout_elem.date = el?.date;
  //             logout_elem.pickupType = el?.pickupType;
  //             logout_elem.shiftName = el?.shiftName;
  //             logout_elem.time = el?.shiftEnd;
  //             logout_elem.shiftName = el?.shiftName;
  //             logout_elem.isSelected = storedSelectedIds?.includes(
  //               el?.shiftId + '__LOGOUT' + '__' + el?.date,
  //             )
  //               ? true
  //               : false;
  //             logout_elem.id = el?.shiftId + '__LOGOUT' + '__' + el?.date;
  //             tempo.push(logout_elem);
  //           }
  //         });

  //         console.log('tempo', tempo);
  //         // tempo.sort(function (a, b) {
  //         //   return (
  //         //     new Date(a.date + 'T' + a.time + ':00Z') -
  //         //     new Date(b.date + 'T' + b.time + ':00Z')
  //         //   );
  //         // }); //
  //         // let t_ = [];
  //         // tempo?.map((el) => {
  //         //   if (new Date(el.date + 'T' + el.time) > new Date()) {
  //         //     t_.push(el);
  //         //   }
  //         // });

  //         setrosterShiftList(tempo);
  //       })
  //       .catch((err) => {});
  //   }
  // }, [formDates, user?.userList?.corporateId]);

  // useEffect(() => {
  //   axios
  //     .get(
  //       Api.baseUri +
  //         '/user-reg/trip-route/get-all-roster-shifts/645caf975115e85968471fcf/2024-02-01/2024-02-02',
  //     )
  //     .then((res) => {
  //       if (res?.data?.status == '200') {
  //         console.log('res', res?.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('err', err);
  //     });
  // }, []);

  function getSelected(selid) {
    let tem = [];
    rosterShiftList.map((el) => {
      let elem = el;
      if (selid == el.id) {
        elem.isSelected = !elem.isSelected; //!elem.isSelected;
      }
      // else{
      //     elem.isSelected = false;  //!elem.isSelected;
      // }
      tem.push(elem);
    });
    const selectedIds = tem.filter((el) => el.isSelected).map((el) => el.id);
    localStorage.setItem('selectedIds', JSON.stringify(selectedIds));
    rosterChecked(tem);
    setrosterShiftList([...tem]);
  }
  const responsive = {
    desktop: {
      breakpoint: {max: 3000, min: 1024},
      items: 6,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: {max: 1024, min: 464},
      items: 4,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: {max: 464, min: 0},
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <>
      {/* <div className='route-list'>
        <div className='route-search'> */}
      {/* <div
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 999,
          paddingTop: '100px', 
          height: 'fit-content', 
          overflow: 'auto', 
        }}
      >
        <Grid
          container
          spacing={3}
          alignItems='center'
          style={{paddingTop: '10px'}}
        >
          <Grid item>
            <TextField
              type='date'
              InputProps={{disableUnderline: true}}
              InputLabelProps={{shrink: true}}
              value={formDates?.trxFromDate}
              onChange={handleFromDateChange}
              label='From Date'
              size='small'
              inputProps={{min: moment().format('YYYY-MM-DD')}}
            />
            <div style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
              {transError?.trans_error && 'Not Valid!'}
            </div>
          </Grid>
          <Grid item>
            <TextField
              type='date'
              InputProps={{disableUnderline: true}}
              InputLabelProps={{shrink: true}}
              value={formDates?.trxToDate}
              onChange={handleToDateChange}
              label='To Date'
              size='small'
            />
            <div style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
              {transError?.trans_error && 'Not Valid!'}
            </div>
          </Grid>
        </Grid>
      </div> */}
      {/* </div>
      </div> */}
      <Carousel
        swipeable={true}
        draggable={true}
        // showDots={true}
        slidesToSlide={1}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        //   autoPlay={this.props.deviceType !== "mobile" ? true : false}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        // transitionDuration={500}
        // focusOnSelect={true}
        // renderDotsOutside={true}
        containerClass='carousel-container'
        removeArrowOnDeviceType={['tablet', 'mobile']}
        //   deviceType={this.props.deviceType}
        dotListClass='custom-dot-list-style'
        itemClass='carousel-item-padding-10-px'
      >
        {rosterShiftList?.map((el, ind) => {
          return (
            <div
              style={{
                borderTop: el.isSelected
                  ? '4px solid #0e6b8f'
                  : '4px solid white',
                background: el.isSelected ? '' : 'white',
                padding: '10px',
              }}
            >
              <CarouselCard
                ind={ind}
                shiftdata={el}
                shiftName={el?.shiftName}
                name={moment(el?.date).format('DD MMM')}
                color={'#757c88'}
                getSelected={getSelected}
                rosterList={el}
              />
            </div>
          );
        })}
      </Carousel>
    </>
  );
};

export default Slider;
