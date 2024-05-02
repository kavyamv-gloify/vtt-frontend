// import React from 'react';
// import './loader.css';

// const AppLoader = () => {
//   return (
//     <div className='app-loader'>
//       <div className='loader-spin'>
//         <span className='crema-dot crema-dot-spin'>
//           <i></i>
//           <i></i>
//           <i></i>
//           <i></i>
//           <i></i>
//         </span>
//       </div>
//     </div>
//   );
// };

// export default AppLoader;

import React from 'react';
// import CircularProgress from '@mui/material/CircularProgress';

const CircularProgressWithLabel = ({}) => {
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    opacity: 0.8,
  };

  return (
    <div style={containerStyle}>
      {/* <CircularProgress style={{zIndex: 1000}} /> */}
      <span className='crema-dot crema-dot-spin'>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
    </div>
  );
};

export default CircularProgressWithLabel;
