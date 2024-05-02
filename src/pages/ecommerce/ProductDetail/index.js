import React, {useEffect} from 'react';
import ProductImageSlide from './ProductImageSlide';
import {useDispatch, useSelector} from 'react-redux';
import AppCard from '@crema/core/AppCard';
import Header from './Header';
import ProductView from './ProductView/index';
import AppGridContainer from '@crema/core/AppGridContainer';
import SimilarProduct from './SimilarProduct';

import AppAnimate from '@crema/core/AppAnimate';
import PropTypes from 'prop-types';
import {getProductDetail} from 'redux/actions';
import {useParams} from 'react-router-dom';
import AppInfoView from '@crema/core/AppInfoView';

const ProductDetail = () => {
  const dispatch = useDispatch();
  const {id} = useParams();
  const currentProduct = useSelector(({ecommerce}) => ecommerce.currentProduct);
  useEffect(() => {
    dispatch(getProductDetail(id));
  }, [dispatch, id]);

  return (
    <>
      {currentProduct ? (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <AppCard>
            <Header product={currentProduct} />
            <AppGridContainer>
              <ProductImageSlide product={currentProduct} />
              <ProductView product={currentProduct} />
            </AppGridContainer>
            <SimilarProduct />
          </AppCard>
        </AppAnimate>
      ) : null}
      <AppInfoView />
    </>
  );
};

export default ProductDetail;

ProductDetail.propTypes = {
  match: PropTypes.object,
};
