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
import CarouselCard from './CarouselCard';
import {useEffect, useState} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import moment from 'moment';
// import EmployeeCard from './EmployeeCard';
// import './Slider.css';
const Slider = ({rosterChecked, refresh, handleRefreshClose}) => {
  const [rosterList, setrosterList] = useState([]);
  const [selected, setSelectedId] = useState([]);

  const [selectedIds, setSelectedIds] = useState([0]);
  const {user} = useAuthUser();
  useEffect(() => {
    if (refresh) {
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
      .post(Api.baseUri + '/api/dashboard/analytics/shifts', post_data)
      .then((res) => {
        setrosterList(res?.data?.data);
        rosterChecked(res?.data?.data[0], 'ADD', [0]);
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
                    rosterChecked(el, 'REMOVE', ind);
                  } else {
                    setSelectedIds([...selectedIds, ind]);
                    rosterChecked(el, 'ADD', ind);
                  }
                }}
              >
                <CarouselCard
                  tripStatus={el?.tripStatus}
                  tripTime={
                    el?.tripType == 'UPTRIP' ? el?.shiftStart : el?.shiftEnd
                  }
                  ind={ind}
                  tripType={el?.tripType}
                  tripCategory={el?.tripCategory}
                  shiftStart={
                    el?.tripType == 'UPTRIP' ? el?.shiftStart : el?.shiftEnd
                  }
                  shiftdata={el}
                  shiftName={el?.shiftName}
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
