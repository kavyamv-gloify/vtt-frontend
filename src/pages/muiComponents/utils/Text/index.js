import React from 'react';
import AppComponentHeader from '@crema/core/AppComponentHeader';
import AppGridContainer from '@crema/core/AppGridContainer';
import Grid from '@mui/material/Grid';
import AppComponentCard from '@crema/core/AppComponentCard';

import EmptyTextarea from './EmptyTextarea';
import EmptyTextareaSource from '!raw-loader!./EmptyTextarea';

import MinHeightTextarea from './MinHeightTextarea';
import MinHeightTextareaSource from '!raw-loader!./MinHeightTextarea';

import MaxHeightTextarea from './MaxHeightTextarea';
import MaxHeightTextareaSource from '!raw-loader!./MaxHeightTextarea';

const Text = () => {
  return (
    <>
      <AppComponentHeader
        title='Text'
        description='A textarea component for React which grows with content.'
        refUrl='https://mui.com/components/textarea-autosize/'
      />

      <AppGridContainer>
        <Grid item xs={12} md={6}>
          <AppComponentCard
            title='Empty Text area'
            component={EmptyTextarea}
            source={EmptyTextareaSource}
            noScrollbar
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppComponentCard
            title='MinHeightTextarea'
            component={MinHeightTextarea}
            source={MinHeightTextareaSource}
            noScrollbar
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppComponentCard
            title='MaxHeightTextarea'
            component={MaxHeightTextarea}
            source={MaxHeightTextareaSource}
            noScrollbar
          />
        </Grid>
      </AppGridContainer>
    </>
  );
};

export default Text;
