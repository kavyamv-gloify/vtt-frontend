/* eslint-disable */
import React from "react";

import Fields from './Fields';
import TopWrapper from './TopWrapper';

export default function Section(props) {
  return (
    <TopWrapper type={layout && layout.type} spacing={2}>
        <Fields {...props}/>
    </TopWrapper>
  );
}
