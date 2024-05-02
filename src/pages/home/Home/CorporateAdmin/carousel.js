import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Api from '@api';
import {styled} from '@mui/material/styles';
import CarouselCard from './carouselcards';
import {useEffect, useState} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import moment from 'moment';
const Slider = ({rosterChecked, refresh, handleRefreshClose}) => {
  const [rosterList, setrosterList] = useState([]);
  const [selected, setSelectedId] = useState([]);
  const [selectedIds, setSelectedIds] = useState([0]);
  const {user} = useAuthUser();
  // const [selectedTrip, setSelectedTrip] = useState([]);
  // const [tripData, setTripData] = useState({});
  // const [lastUpdated, setLastUpdated] = useState(moment().format('HH:mm:ss'));
  // console.log('selectedTrip', selectedTrip);
  // useEffect(() => {
  //   const interval = window.setInterval(function () {
  //     getAllData();
  //     const currentTimestamp = moment().format('HH:mm:ss');
  //     setLastUpdated(currentTimestamp);
  //   }, 5000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [selectedTrip]);
  // async function getAllData() {
  //   let myTripObj = {};
  //   let tempArr = [];
  //   await Promise.all(
  //     selectedTrip?.map(async (d) => {
  //       tempArr.push(d);
  //       myTripObj[
  //         d?.tripDate +
  //           'T' +
  //           (d.tripType == 'UPTRIP' ? d.shiftStart : d.shiftEnd) +
  //           ':00Z'
  //       ] = await rosterChecked(d, '', d?.selectedIndex);
  //     }),
  //   );
  //   setSelectedTrip([...tempArr]);
  //   setTripData({...myTripObj});
  // }
  useEffect(() => {
    if (refresh) {
      // Update state within useEffect to avoid causing re-renders
      setSelectedIds([0]);
      rosterChecked(rosterList[0], 'ADD', 0);
      handleRefreshClose();
    }
  }, [refresh]);
  useEffect(() => {
    let post_data = {
      corporateId: user?.userList?.corporateId,
      fromDate: moment(new Date().setDate(new Date().getDate() - 5)).format(
        'YYYY-MM-DD',
      ),
      toDate: moment(new Date().setDate(new Date().getDate() + 3)).format(
        'YYYY-MM-DD',
      ),
      sort: -1,
    };
    axios
      // .post(Api.baseUri + '/api/dashboard/analytics/shifts', post_data)
      // post_data?.fromDate
      // post_data?.toDate
      .get(
        Api.baseUri +
          `/user-reg/trip-route/get-all-trips-shifts/${post_data?.corporateId}/${post_data?.fromDate}/${post_data?.toDate}`,
      )
      .then((res) => {
        // console.log('res', res);
        setrosterList(res?.data?.data);
        rosterChecked(res?.data?.data[0], 'ADD', 0);
      })
      .catch((err) => {});
  }, []);
  function getSelected(d) {
    let temArr = selectedIds;
    if (temArr?.includes(d.id)) {
      temArr.splice(temArr.indexOf(d.id), 1);
    } //{[d.id]: true, ['shiftdata']: d.shiftdata}
    else {
      temArr.push(d.id);
    }
    let shiftArr = [];
    temArr?.map((el) => {
      shiftArr.push(rosterList[Number(el)]);
    });
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

  const Services = styled(Paper)(({theme}) => ({
    borderRadius: '20px',
    background: 'white',
    // width:"30vh",
    // height:"30vh"
  }));

  const Item = styled(Paper)(({theme}) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    boxShadow: '0 8px 16px 0 rgb(0 0 0 / 25%)',
    borderRadius: '20px',
    background: 'white',
  }));
  // const responsive = {
  //     desktop: {
  //         breakpoint: { max: 3000, min: 1024 },
  //         items: 4,
  //         slidesToSlide: 3 // optional, default to 1.
  //     },
  //     tablet: {
  //         breakpoint: { max: 1024, min: 464 },
  //         items: 2,
  //         slidesToSlide: 2 // optional, default to 1.
  //     },
  //     mobile: {
  //         breakpoint: { max: 464, min: 0 },
  //         items: 1,
  //         slidesToSlide: 1 // optional, default to 1.
  //     }
  // };
  useEffect(() => {}, [selectedIds]);
  return (
    <>
      {rosterList?.length ? (
        <Carousel
          swipeable={true}
          draggable={true}
          // showDots={true}
          slidesToSlide={1}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={false}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          containerClass='carousel-container'
          removeArrowOnDeviceType={['tablet', 'mobile']}
          dotListClass='custom-dot-list-style'
          itemClass='carousel-item-padding-10-px'
        >
          {rosterList?.map((el, ind) => {
            return (
              <div
                style={{
                  cursor: 'pointer',
                  background: selectedIds?.includes(ind) ? '' : 'white',
                  borderTop: selectedIds?.includes(ind)
                    ? '4px solid #0e6b8f'
                    : '',
                  padding: '10px',
                }}
                onClick={() => {
                  if (selectedIds?.includes(ind)) {
                    if (selectedIds.length == 1) {
                      return;
                    }
                    let tem_ARR = selectedIds;
                    tem_ARR.splice(tem_ARR.indexOf(ind), 1);
                    setSelectedIds(tem_ARR);
                    // const updatedSelectedTrip = [
                    //   ...selectedTrip,
                    //   {...el, selectedType: 'REMOVE', selectedIndex: ind},
                    // ];
                    // setSelectedTrip(updatedSelectedTrip);
                    rosterChecked(el, 'REMOVE', ind);
                  } else {
                    setSelectedIds([...selectedIds, ind]);
                    // const updatedSelectedTrip = [
                    //   ...selectedTrip,
                    //   {...el, selectedType: 'ADD', selectedIndex: ind},
                    // ];
                    // setSelectedTrip(updatedSelectedTrip);
                    rosterChecked(el, 'ADD', ind);
                  }
                }}
              >
                <CarouselCard
                  tripStatus={el?.tripStatus=="EXPIRED" ? "COMPLETED" : el.tripStatus}
                  ind={ind}
                  tripType={el?.tripType}
                  tripCategory={el?.tripCategory}
                  tripTime={
                    el?.tripType == 'UPTRIP' ? el?.shiftStart : el?.shiftEnd
                  }
                  shiftdata={el}
                  // shiftName={el?.shiftName}
                  shiftName={
                    el?.tripCategory == 'ADHOCTRIP' ? 'ADHOC' : el?.shiftName
                  }
                  name={moment(new Date(el?.tripDate)).format('DD MMM')}
                  getSelected={getSelected}
                  selectedIds={selectedIds}
                />
              </div>
            );
          })}
          <div
            style={{cursor: 'pointer', background: 'white', padding: '10px'}}
            onClick={() => {
              setSelectedIds([rosterList?.length]);
            }}
          >
            <CarouselCard ind={rosterList?.length} name={'NEW'} />
          </div>
        </Carousel>
      ) : null}
    </>
  );
};

export default Slider;
