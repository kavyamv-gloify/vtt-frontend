import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {styled} from '@mui/material/styles';
import ShiftCard from './ShiftCard';
import {useEffect, useState} from 'react';
// import EmployeeCard from './EmployeeCard';
// import './Slider.css';
const Slider = ({rosterChecked, data}) => {
  const [selectedIds, setSelectedIds] = useState([0]);

  useEffect(() => {}, [selectedIds]);

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
                  background: selectedIds?.includes(ind) ? '' : 'white',
                  borderTop: selectedIds?.includes(ind)
                    ? '4px solid #0e6b8f'
                    : '',
                  padding: '20px',
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
                  // rosterChecked(el, ind);
                  // if (selectedIds?.includes(ind)) {
                  //   if (selectedIds.length == 1) {
                  //     return;
                  //   }
                  //   let tem_ARR = selectedIds;
                  //   tem_ARR.splice(tem_ARR.indexOf(ind), 1);
                  //   setSelectedIds(tem_ARR);
                  // } else {
                  //   setSelectedIds([...selectedIds, ind]);
                  // }
                }}
              >
                <ShiftCard
                  // ind={ind}
                  shiftName={el?.shiftName}
                  shiftStart={
                    el?.tripType == 'UPTRIP' ? el?.shiftStart : el?.shiftEnd
                  }
                  tripCategory={el.tripCategory}
                  color={
                    el?.tripType == 'UPTRIP' ? 'rgb(30 140 186)' : '#feac4e'
                  }
                  background={
                    el?.tripType == 'UPTRIP' ? 'rgb(30 140 186)' : '#feac4e'
                  }
                  // // getSelected={getSelected}
                  // selectedIds={selectedIds}
                  tripType={el?.tripType}
                  tripStatus={el?.tripStatus}
                  tripDate={el?.tripDate
                    ?.toString()
                    ?.split('-')
                    ?.reverse()
                    ?.join('-')}
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
