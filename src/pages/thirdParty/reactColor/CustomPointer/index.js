import React from 'react';

import MyPicker from './MyPicker';

const CustomPointer = () => {
  const handleColorChange = ({hex}) => {};

  return <MyPicker color='coral' onChangeComplete={handleColorChange} />;
};

export default CustomPointer;
