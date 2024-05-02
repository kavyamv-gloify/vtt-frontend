import React from 'react';

function Icon({color, text}) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='100%'
      height='100%'
      x='0'
      y='0'
      version='1.1'
      viewBox='0 0 500 500'
      xmlSpace='preserve'
    >
      <circle
        cx='75.886'
        cy='121.642'
        r='40.206'
        fill='none'
        stroke={color ?? '#000'}
        strokeMiterlimit='10'
        strokeWidth='12'
        style={{strokeWidth: '15px'}}
      ></circle>
      <path
        fill='none'
        stroke={color ?? '#000'}
        strokeMiterlimit='10'
        strokeWidth='12'
        style={{strokeWidth: '15px'}}
        d='M10.856 223.264s-4.718-51.137 24.824-38.559c29.541 12.578 41.945 13.399 74.043-.122 32.099-13.519 26.366 38.681 26.366 38.681l.33 90.628h-15.701v85.684s-18.996 36.768-44.832 0c-8.347 14.501-36.028 34.274-49.211 0v-83.943H10.432l.424-92.369z'
      ></path>
      <path
        fill='none'
        stroke={color ?? '#000'}
        strokeMiterlimit='10'
        strokeWidth='12'
        style={{strokeWidth: '15px'}}
        d='M75.247 332.491L75.247 410.894'
      ></path>
      <path
        fill='none'
        stroke={color ?? '#000'}
        strokeMiterlimit='10'
        strokeWidth='12'
        style={{strokeWidth: '10px'}}
        d='M175.24 208.076L256.983 289.821'
      ></path>
      <path
        fill='none'
        stroke={color ?? '#000'}
        strokeMiterlimit='10'
        strokeWidth='12'
        style={{strokeWidth: '15px'}}
        d='M175.24 289.821L256.983 208.076'
      ></path>
      <text
        fontFamily="'ArialMT'"
        fontSize='128.173'
        transform='translate(284.745 289.823)'
        style={{fontSize: 150, fontWeight: 700, fill: color}}
      >
        {text <= 9 ? '0' + text : text}
      </text>
    </svg>
  );
}

export default Icon;
