import React from 'react';
import Slider from 'react-slick';
import {Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EmployeeCard from './EmployeeCard';
export default function Carousels() {
  const SlickArrowLeft = ({currentSlide, slideCount, ...props}) => (
    // <Button id='btnMui123' Front {...props}/>
    <img
      src={'/assets/images/school_transport.jpg'}
      alt='prevArrow'
      {...props}
    />
  );

  const SlickArrowRight = ({currentSlide, slideCount, ...props}) => (
    <img
      src={'/assets/images/school_transport.jpg'}
      alt='nextArrow'
      {...props}
    />
  );

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
  };

  const Services = styled(Paper)(({theme}) => ({
    borderRadius: '20px',
    background: 'white',
  }));
  return (
    <Slider {...settings}>
      <div style={{marginTop: '20vh'}}>
        <Grid item xs={12}>
          <Services>
            <EmployeeCard />
          </Services>
        </Grid>
      </div>
      <div>
        <Services>
          <EmployeeCard />
        </Services>
      </div>
      <div>
        <Services>
          <EmployeeCard />
        </Services>
      </div>
      <div>
        <Services>
          <EmployeeCard />
        </Services>
      </div>
      <div>
        <Services>
          <EmployeeCard />
        </Services>
      </div>
    </Slider>
  );
}
