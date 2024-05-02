import React from 'react'
import { useSelector } from 'react-redux';

const Raj = () => {
  const clickedSOS = useSelector(({settings}) => settings.clickedSOS);

  return clickedSOS
}

export default Raj