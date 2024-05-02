import React, {useState} from 'react';
import Box from '@mui/material/Box';
import AuthWrapper from '../AuthWrapper';
// import SigninFirebase from './SigninFirebase';
import SigninJwtAuth from './SigninJwtAuth';
import AppLogo from '@crema/core/AppLayout/components/AppLogo';

import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: '#00000000',
  // border: '2px solid #000',
  // boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Signin = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <link
        rel='stylesheet'
        href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css'
        integrity='sha384-Smlep5jCw/wG7hdkwQ/Z5nLIefveQRIY9nfy6xoR1uRYBtpZgI6339F5dgvm/e9B'
        crossorigin='anonymous'
      />
      <link
        rel='stylesheet'
        href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
      />
      <link rel='stylesheet' href='assets/pre-login/css/animate.css' />
      <link rel='stylesheet' href='assets/pre-login/css/main.css' />
      <section id='main-page'>
        <header>
          <div className='container'>
            <div className='row'>
              <div className='logo animated fadeIn'>
                <a href='#'>
                  <img
                    className='logo__img'
                    src='assets/pre-login/img/tm-logo.svg'
                    alt='Logotype'
                  />
                </a>
              </div>
              <nav id='main-menu'>
                <ul className='menu animated fadeIn'>
                  <li>
                    <a className='menu__link' href='#main-page'>
                      home
                    </a>
                  </li>
                  <li>
                    <a className='menu__link' href='#about'>
                      about
                    </a>
                  </li>
                  <li>
                    <a className='menu__link' href='#services'>
                      services
                    </a>
                  </li>
                  <li>
                    <a className='menu__link' href='#features'>
                      features
                    </a>
                  </li>
                  <li>
                    <a className='menu__link' href='#feedback'>
                      feedback
                    </a>
                  </li>
                  <li>
                    <a className='menu__link' href='#contacts'>
                      contacts
                    </a>
                  </li>
                  <li>
                    <Button
                      id='btnMui123'
                      style={{fontSize: 19}}
                      onClick={handleOpen}
                    >
                      LOGIN
                    </Button>
                    {/* <a className='menu__link' href='#contacts'>
                      login
                    </a> */}
                  </li>
                </ul>
                <div className='hamburger fa fa-bars'></div>
              </nav>
              <div className='navigation__mobile'>
                <div className='navigation__close'>&times;</div>
                <ul id='mobile-menu'>
                  <li>
                    <a className='mobile-menu-link' href='#main-page'>
                      home
                    </a>
                  </li>
                  <li>
                    <a className='mobile-menu-link' href='#about'>
                      about
                    </a>
                  </li>
                  <li>
                    <a className='mobile-menu-link' href='#services'>
                      services
                    </a>
                  </li>
                  <li>
                    <a className='mobile-menu-link' href='#features'>
                      features
                    </a>
                  </li>
                  <li>
                    <a className='mobile-menu-link' href='#feedback'>
                      feedback
                    </a>
                  </li>
                  <li>
                    <a className='mobile-menu-link' href='#contacts'>
                      contacts
                    </a>
                  </li>
                  <li>
                    <a className='mobile-menu-link' href='#login'>
                      login
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>
        <div className='title animated fadeIn'>
          <h4 className='title__text'>Avail Our services</h4>
          <a className='title__number' href='tel:+12345678900'>
            +123 4567 8900
          </a>
        </div>
        <div className='car'>
          <div className='car-img'></div>
        </div>
      </section>
      <section id='about'>
        <div className='container'>
          <div className='row'>
            <div className='about-service col-12 col-md-6'>
              <h3>best in city</h3>
              <h2>Trusted Cab Servise in India</h2>
              <p>
                Quisque sollicitudin feugiat risus, eu posuere ex euismod eu.
                Phasellus hendrerit, massa efficitur dapibus pulvinar, sapien
                eros sodales ante, euismod aliquet nulla metus a mauris.Quisque
                sollicitudin feugiat risus, eu posuere ex euismod eu. Phasellus
                hendrerit, massa efficitur dapibus pulvinar, sapien eros sodales
                ante, euismod aliquet nulla metus a mauris.
              </p>
              <a href='#' className='read-more-btn'>
                Read More{' '}
              </a>
            </div>
            <div className='book-a-cab col-12 col-md-6'>
              <img
                src='assets/pre-login/img/infograpic1.svg'
                className='info-graphic-01'
              />
            </div>
          </div>
        </div>
      </section>
      <section id='features'>
        <div className='container'>
          <h3>we do best</h3>
          <h2>than you wish</h2>
          <div className='row'>
            <div className='features'>
              <div className='features__col-one'>
                <div className='features__item'>
                  <div className='features__icon adv-icon-one'></div>
                  <div className='features__text-wrapper'>
                    <div className='features__name'>Home Pickup</div>
                    <div className='features__descr'>
                      Quisque sollicitudin feugiat risus, eu posuere ex euismod
                      eu. Phasellus hendrerit, massa efficitur.
                    </div>
                  </div>
                </div>
                <div className='features__item'>
                  <div className='features__icon adv-icon-two'></div>
                  <div className='features__text-wrapper'>
                    <div className='features__name'>Bonuses for ride</div>
                    <div className='features__descr'>
                      Quisque sollicitudin feugiat risus, eu posuere ex euismod
                      eu. Phasellus hendrerit, massa efficitur.
                    </div>
                  </div>
                </div>
              </div>
              <div className='features__col-two'>
                <div className='features__item'>
                  <div className='features__icon adv-icon-three'></div>
                  <div className='features__text-wrapper'>
                    <div className='features__name'>Fast booking</div>
                    <div className='features__descr'>
                      Quisque sollicitudin feugiat risus, eu posuere ex euismod
                      eu. Phasellus hendrerit, massa efficitur.
                    </div>
                  </div>
                </div>
                <div className='features__item'>
                  <div className='features__icon adv-icon-four'></div>
                  <div className='features__text-wrapper'>
                    <div className='features__name'>GPS searching</div>
                    <div className='features__descr'>
                      Quisque sollicitudin feugiat risus, eu posuere ex euismod
                      eu. Phasellus hendrerit, massa efficitur.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a className='read-more-btn' href='#'>
            read more
          </a>
        </div>
      </section>
      <section id='download'>
        <div className='container'>
          <h3>download</h3>
          <h2>best car services</h2>
          <div className='row'>
            <div className='download-left col-12 col-sm-9 col-md-6'>
              <h5>
                Downlaod the Cab voucher app free! Get Exciting New Offers
              </h5>
              <p>
                Quisque sollicitudin feugiat risus, eu posuere ex euismod eu.
                Phasellus hendrerit, massa efficitur.
              </p>
              <div className='download-links'>
                <div className='google-play'></div>
                <div className='app-store'></div>
              </div>
            </div>
            <div className='download-right'></div>
          </div>
        </div>
      </section>
      <section id='feedback'>
        <div className='container'>
          <h3>Happy Client's</h3>
          <h2>Testimonials</h2>
          <div className='row'>
            <div className='feedback-wrapper'>
              <div className='comment-one'>
                <p className='comment__text'>
                  Quisque sollicitudin feugiat risus, eu posuere ex euismod eu.
                  Phasellus hendrerit, massa efficitur. Quisque sollicitudin
                  feugiat risus.
                </p>
                <div className='comment__author'>
                  <div className='author__avatar'></div>
                  <div className='author__text'>
                    <h4 className='author__name'>John Doe</h4>
                    <h4 className='author__status'>Business man</h4>
                  </div>
                </div>
              </div>
              <div className='comment-two'>
                <p className='comment__text'>
                  Quisque sollicitudin feugiat risus, eu posuere ex euismod eu.
                  Phasellus hendrerit, massa efficitur. Quisque sollicitudin
                  feugiat risus.
                </p>
                <div className='comment__author'>
                  <div className='author__avatar'></div>
                  <div className='author__text'>
                    <h4 className='author__name'>John Doe</h4>
                    <h4 className='author__status'>Business man</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Modal
        // hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box sx={{...style, width: '60%'}}>
          <AuthWrapper>
            <Box sx={{width: '100%'}}>
              <Box sx={{mb: {xs: 6, xl: 8}}}>
                <Box
                  sx={{
                    mb: 5,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <AppLogo />
                </Box>
              </Box>

              <SigninJwtAuth />
            </Box>
          </AuthWrapper>

          {/* <Button id='btnMui123' onClick={handleClose}>Close Child Modal</Button> */}
        </Box>
      </Modal>
    </div>
  );
};

export default Signin;
