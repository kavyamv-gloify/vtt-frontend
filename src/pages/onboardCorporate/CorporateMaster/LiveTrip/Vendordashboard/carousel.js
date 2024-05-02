import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {styled} from '@mui/material/styles';
import CarouselCard from './carouselcards';
import {useEffect, useState} from 'react';
// import EmployeeCard from './EmployeeCard';
// import './Slider.css';
const Slider = ({rosterChecked, shiftData}) => {
  let sortedProducts = shiftData?.sort((p1, p2) =>
    new Date(p1.tripDate) > new Date(p2.tripDate)
      ? 1
      : new Date(p1.tripDate) < new Date(p2.tripDate)
      ? -1
      : 0,
  );
  const [selectedIds, setSelectedIds] = useState([0]);
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

  return (
    <>
      {sortedProducts?.length ? (
        <Carousel
          swipeable={true}
          draggable={true}
          slidesToSlide={1}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          containerClass='carousel-container'
          removeArrowOnDeviceType={['tablet', 'mobile']}
          dotListClass='custom-dot-list-style'
          itemClass='carousel-item-padding-10-px'
        >
          {sortedProducts?.map((el, ind) => {
            return (
              <div
                style={{
                  cursor: 'pointer',
                  background: selectedIds?.includes(ind) ? '' : 'white',
                  borderTop: selectedIds?.includes(ind)
                    ? '4px solid #0e6b8f'
                    : '',
                  padding: '5px',
                  backgroundColor: selectedIds?.includes(ind) ? '#f5f7fe' : '',
                }}
                onClick={() => {
                  rosterChecked(el);
                  if (selectedIds?.includes(ind)) {
                    if (selectedIds.length == 1) {
                      return;
                    }
                    let tem_ARR = selectedIds;
                    tem_ARR.splice(tem_ARR.indexOf(ind), 1);
                    setSelectedIds(tem_ARR);
                    rosterChecked(el);
                  } else {
                    setSelectedIds([...selectedIds, ind]);
                    // rosterChecked(el, "ADD", ind);
                  }
                }}
              >
                <CarouselCard
                  ind={ind}
                  tripTime={
                    el?.tripType == 'UPTRIP' ? el?.shiftStart : el?.shiftEnd
                  }
                  color={
                    el?.tripType == 'UPTRIP' ? 'rgb(30 140 186)' : '#feac4e'
                  }
                  background={
                    el?.tripType == 'UPTRIP' ? 'rgb(30 140 186)' : '#feac4e'
                  }
                  tripType={el?.tripType}
                  shiftName={
                    el?.tripCategory == 'ADHOCTRIP' ? 'ADHOC' : el?.shiftName
                  }
                  tripDate={el?.tripDate}
                  tripCategory={el?.tripCategory}
                  tripStatus={el?.status}
                  data={el}
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
