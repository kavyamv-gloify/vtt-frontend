import React, {useEffect} from 'react';
import {Box, Grid} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';
import CartTable from './CartTable';
import AppCard from '@crema/core/AppCard';
import IntlMessages from '@crema/utility/IntlMessages';
import {Fonts} from 'shared/constants/AppEnums';
import {getCartItems} from 'redux/actions';
import OrderSummary from '../OrderSummary';
import AppAnimate from '@crema/core/AppAnimate';
import AppGridContainer from '@crema/core/AppGridContainer';

const Carts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(({ecommerce}) => ecommerce.cartItems);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  return (
    <AppAnimate animation='transition.slideUpIn' delay={200}>
      <Box>
        <Box
          component='h2'
          sx={{
            color: 'text.primary',
            fontWeight: Fonts.BOLD,
            mb: 6,
            fontSize: 16,
          }}
        >
          <IntlMessages id='sidebar.ecommerce.cart' />
        </Box>
        <AppGridContainer>
          <Grid item xs={12} md={8}>
            <AppCard
              contentStyle={{px: 0}}
              footer={
                <Box
                  sx={{
                    mt: 4,
                    width: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    id='btnMui123'
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      navigate('/ecommerce/products');
                    }}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    id='btnMui123'
                    variant='contained'
                    color='secondary'
                    onClick={() => {
                      navigate('/ecommerce/checkout');
                    }}
                  >
                    Checkout
                  </Button>
                </Box>
              }
            >
              <CartTable cartItems={cartItems} />
            </AppCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <OrderSummary cartItems={cartItems} />
          </Grid>
        </AppGridContainer>
      </Box>
    </AppAnimate>
  );
};

export default Carts;
