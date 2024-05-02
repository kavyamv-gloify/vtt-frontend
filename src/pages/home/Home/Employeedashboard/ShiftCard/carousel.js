import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {styled} from '@mui/material/styles';
import ShiftCard from './ShiftCard';
import {useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment';
// import EmployeeCard from './EmployeeCard';
// import './Slider.css';
const Slider = ({rosterChecked, data}) => {
  const [selectedIds, setSelectedIds] = useState(0);
  const [tripData, setTripData] = useState([]);

  const responsive = {
    desktop: {
      breakpoint: {max: 3000, min: 1024},
      items: 5,
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
      {data?.length ? (
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
          {data?.map((el, ind) => {
            return (
              <div
                style={{
                  cursor: 'pointer',
                  background: selectedIds == ind ? '' : 'white',
                  borderTop: selectedIds == ind ? '4px solid #0e6b8f' : '',
                  padding: '20px',
                }}
                onClick={() => {
                  setSelectedIds(ind);
                  rosterChecked(el);
                }}
              >
                <ShiftCard
                  tripStatus={el?.tripStatus}
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
                  // getSelected={getSelected}
                  selectedIds={selectedIds}
                />
              </div>
            );
          })}
        </Carousel>
      ) : null}
    </>
  );
};

export default Slider;
