/* eslint-disable */
import React, {useState} from 'react';
import {makeStyles} from '@mui/styles';
import _ from '../lodash';
import download from './download';

function getFileName(url) {
  let filename = url.substring(url.lastIndexOf('/') + 1);
  if (!(filename.indexOf('.') == -1)) {
    return {name: filename.split('.')[0], type: filename.split('.')[1]};
  } else {
    return null;
  }
}
const useStyles = makeStyles(() => ({
  link: {
    border: 0,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    justifyItems: 'center',
    borderRadius: '6px',
    height: '30px',
    padding: '0 10px',
    fontSize: '12px',
  },
}));
function Attachment({
  src,
  width,
  height,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  image,
  title,
  style,
  className,
}) {
  const classes = useStyles();
  const [filename, setFileName] = useState(getFileName(src));
  return (
    <div
      className='flex justify-left'
      style={{
        width,
        height,
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
        ...style,
      }}
    >
      {filename && (
        <button
          id='btnMui123'
          className={classes.link}
          onClick={(e) => download(src)}
        >
          {filename.name.replace(/%20/g, ' ')}
        </button>
      )}
    </div>
  );
}

export default Attachment;
