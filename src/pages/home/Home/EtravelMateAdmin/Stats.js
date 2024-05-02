// import React from 'react';
// import {Grid} from '@mui/material';
// import {styled} from '@mui/material/styles';
// import Paper from '@mui/material/Paper';
// const Stats = () => {
//   // const { messages } = useIntl();
//   const Item = styled(Paper)(({theme}) => ({
//     backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//     ...theme.typography.body2,
//     padding: '10px',
//     // padding: theme.spacing(1),
//     borderRadius: '16px',
//     // textAlign: 'center',
//     boxShadow: '0px 10px 10px -2px rgba(0, 0, 0, 0.04)',
//     // color: theme.palette.text.secondary,
//   }));

//   const stats = [
//     {title: 'Ongoing Trips', color: '#00A2FF'},
//     {title: 'Completed  Trips', color: '#B745FF'},
//     {title: 'Scheduled trips', color: '#F49820'},
//     {title: 'Cancelled Trips', color: '#F04F47'},
//     {title: 'Absent Trips', color: '#00A2FF'},
//   ];
//   return (
//     <>
//       <Grid container spacing={6} sx={{marginTop: '10px'}}>
//         {stats?.map((el) => {
//           return (
//             <Grid item xs={6} md={2.4} sm={6}>
//               <Item sx={{background: 'white'}}>
//                 <Grid container spacing={{xs: 4, md: 0}}>
//                   <Grid item xs={12} sm={6} md={8} sx={{display: 'flex'}}>
//                     <div
//                       style={{
//                         width: '36px',
//                         height: '36px',
//                         borderRadius: '92px',
//                         background: el?.color,
//                       }}
//                     ></div>
//                     <div
//                       style={{
//                         displa: 'flex',
//                         flexDirection: 'column',
//                         paddingLeft: '12px',
//                       }}
//                     >
//                       <p style={{fontWeight: '500', fontSize: '16px'}}>2000</p>
//                       <p style={{fontSize: '11px', color: '#858585'}}>
//                         {el?.title}
//                       </p>
//                     </div>
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={4}>
//                     <div
//                       style={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         justifyContent: 'flex-end',
//                         padding: '0px',
//                       }}
//                     >
//                       <p style={{color: 'green'}}>+2.1%</p>
//                       <p style={{fontSize: '11px', color: '#858585'}}>
//                         vs last 5 days
//                       </p>
//                     </div>
//                   </Grid>
//                 </Grid>
//               </Item>
//             </Grid>
//           );
//         })}
//       </Grid>
//     </>
//   );
// };

// export default Stats;
import React, {useState} from 'react';
import {Box, Grid, IconButton} from '@mui/material';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {ReactComponent as Adhoc} from 'pages/SVG/Adhoc.svg';
import {ReactComponent as RouteMaster} from 'pages/SVG/Routes.svg';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Stats = ({stats}) => {
  console.log('stats', stats);
  const [selectedTripTypeMap, setSelectedTripTypeMap] = useState({});

  const handleTripTypeChange = (title, tripType) => {
    setSelectedTripTypeMap((prevMap) => {
      const updatedMap = {...prevMap};

      if (updatedMap[title]?.[tripType]) {
        delete updatedMap[title][tripType];
      } else {
        updatedMap[title] = {[tripType]: true};
      }
      if (Object.keys(updatedMap[title]).length === 0) {
        updatedMap[title] = null;
      }

      return updatedMap;
    });
  };

  const getSelectedTripType = (title) => {
    return selectedTripTypeMap[title] || {};
  };

  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: '10px',
    borderRadius: '16px',
    boxShadow: '0px 10px 10px -2px rgba(0, 0, 0, 0.04)',
  }));

  // const stats = [
  //   {
  //     title: 'Ongoing Trips',
  //     color: '#00A2FF',
  //     adocCount: 100,
  //     regularCount: 150,
  //   },
  //   {
  //     title: 'Completed  Trips',
  //     color: '#B745FF',
  //     adocCount: 50,
  //     regularCount: 75,
  //   },
  //   {
  //     title: 'Scheduled trips',
  //     color: '#F49820',
  //     adocCount: 30,
  //     regularCount: 40,
  //   },
  //   {
  //     title: 'Cancelled Trips',
  //     color: '#F04F47',
  //     adocCount: 20,
  //     regularCount: 25,
  //   },
  //   {title: 'Absent Trips', color: '#00A2FF', adocCount: 10, regularCount: 15},
  // ];

  return (
    <>
      <Grid container spacing={6} sx={{marginTop: '10px'}}>
        {stats?.map((el) => {
          const selectedTripType = getSelectedTripType(el.title);

          const totalCount =
            Object.keys(selectedTripType).length === 0
              ? Number(el.adocCount) + Number(el.regularCount)
              : selectedTripType?.adoc
              ? Number(el.adocCount)
              : selectedTripType?.regular
              ? Number(el.regularCount)
              : null;

          return (
            <Grid item xs={6} md={2.4} sm={6} key={el.title}>
              <Item sx={{background: 'white'}}>
                <Grid container spacing={{xs: 4, md: 0}}>
                  <Grid item xs={12} sm={6} md={8} sx={{display: 'flex'}}>
                    {/* <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '92px',
                        background: el?.color,
                      }}
                    ></div> */}

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <IconButton
                        sx={{
                          height: 30,
                          width: 30,
                          p: 0,
                        }}
                      >
                        <CalendarMonthIcon
                          style={{
                            color: selectedTripType?.regular ? 'green' : '',
                          }}
                          onClick={() =>
                            handleTripTypeChange(el.title, 'regular')
                          }
                        />
                      </IconButton>
                      <IconButton
                        sx={{
                          height: 30,
                          width: 30,
                          p: 0,
                        }}
                      >
                        <Adhoc
                          fill={selectedTripType?.adoc ? '#0E86D4' : 'black'}
                          height='0.7em'
                          width='0.7em'
                          onClick={() => handleTripTypeChange(el.title, 'adoc')}
                        />
                      </IconButton>
                    </Box>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        paddingLeft: '12px',
                      }}
                    >
                      <p style={{fontWeight: '500', fontSize: '16px'}}>
                        {totalCount !== null ? totalCount : ''}
                      </p>
                      <p style={{fontSize: '12px', color: '#858585'}}>
                        {el?.title}
                      </p>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '0px',
                      }}
                    >
                      <p style={{color: 'green'}}>+2.1%</p>
                      <p style={{fontSize: '11px', color: '#858585'}}>
                        vs last 5 days
                      </p>
                    </div>
                  </Grid>
                </Grid>

                {/* <div style={{display: 'flex', flexDirection: 'column'}}>
                  <IconButton
                    color={selectedTripType?.adoc ? 'primary' : 'default'}
                    onClick={() => handleTripTypeChange(el.title, 'adoc')}
                    // sx={{marginRight: '10px', marginTop: '10px'}}
                  >
                    {selectedTripType?.adoc ? (
                      <CheckCircleIcon />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )}
                  </IconButton>
                  <IconButton
                    color={selectedTripType?.regular ? 'primary' : 'default'}
                    onClick={() => handleTripTypeChange(el.title, 'regular')}
                    // sx={{marginTop: '10px'}}
                  >
                    {selectedTripType?.regular ? (
                      <CheckCircleIcon />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )}
                  </IconButton>
                </div> */}
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default Stats;
