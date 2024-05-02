import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import Api from '@api';
import axios from 'axios';
const host = Api?.baseUri;
const socket = io(host, {path: '/api/socket.io/'});
import {useAuthUser} from '@crema/utility/AuthHooks';
import audiourl from '../assets/audio/hooter.mp3';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import SOSPOPUP from '../pages/SOSPOPUP/index';
import CloseIcon from '@mui/icons-material/Close';
import {IconButton} from '@mui/material';
import _ from 'lodash';
// import useSound from 'use-sound';
import {pl} from 'date-fns/locale';
const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(true);
  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);
  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);
  return [playing, toggle];
};

function SocketApp({getSSOPassengers, liveVehicles}) {
  const {user} = useAuthUser();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [empInfo, setEmpInfo] = useState(null);
  const [tripInfo, setTripInfo] = useState(null);
  const [sosTrg, setSosTrg] = useState({});
  const [playing, toggle] = useAudio(audiourl);
  const [openDialog, setopenDialog] = useState(false);
  const [flag, setFlag] = useState();
  // const [play, {stop}] = useSound(audiourl);
  console.log('Called....');
  useEffect(() => {
    let isMounted = true;

    const socket = io(Api?.baseUri, {path: '/api/socket.io/'});

    socket.on('welcome', function (data) {
      socket.emit('i am client', {data: 'foo!', id: data.id});
    });

    socket.emit('add-user', user?.userList?.profileId);

    socket.on('sos-trigger', (data) => {
      if (isMounted) {
        console.log('trigger', data);
        setSosTrg(data);
        playHooter();
        getSSOPassengers();
      }
    });

    return () => {
      isMounted = false;
      socket.disconnect();
    };
  }, [getSSOPassengers]);

  const playHooter = () => {
    toggle();
  };

  useEffect(() => {
    let key_word = Object?.keys(sosTrg);
    console.log('key_word', key_word);
    if (key_word?.includes('driverId')) {
      setFlag('driverId');
    }
    if (key_word?.includes('empId')) {
      setFlag('empId');
    }
  }, [sosTrg]);

  useEffect(() => {
    console.log('empId', sosTrg?.empId);
    console.log('driverId', sosTrg?.driverId);
    if (flag == 'empId') {
      if (sosTrg?.empId) {
        axios
          .get(Api.employee.list + '/' + sosTrg?.empId)
          .then((res) => {
            if (res?.data?.status == '200') {
              setEmpInfo(res?.data?.data);
            }
          })
          .catch((err) => {
            console.log('err', err);
          });
      }
    }

    if (flag == 'driverId') {
      if (sosTrg?.driverId) {
        axios
          .get(Api.driver.list + '/' + sosTrg?.driverId)
          .then((res) => {
            if (res?.data?.status == '200') {
              // console.log('fffff', res?.data?.data);
              setEmpInfo(res?.data?.data);
            }
          })
          .catch((err) => {
            console.log('err', err);
          });
      }
    }
  }, [flag, sosTrg]);

  useEffect(() => {
    if (sosTrg?.tripId) {
      axios
        .get(
          Api.baseUri +
            `/user-reg/trip-route/get-trip-by-id?tripId=${sosTrg?.tripId}`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            setTripInfo(res?.data?.data);
          }
        })
        .catch((err) => {});
    }
  }, [sosTrg?.tripId]);

  useEffect(() => {
    if (
      _.isArray(tripInfo) &&
      !_.isEmpty(tripInfo) &&
      _.isObject(empInfo) &&
      !openDialog
    ) {
      setopenDialog(true);
      // play;
    }
  }, [tripInfo, empInfo]);

  return (
    <>
      {openDialog && (
        <Dialog
          open={openDialog}
          maxWidth='false'
          PaperProps={{
            sx: {
              width: '500px',
            },
          }}
          style={{borderRadius: '4rem'}}
        >
          <div>
            <DialogContent style={{padding: '0px'}}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: '#f5f2f2',
                  height: '3rem',
                  paddingRight: '1.5rem',
                  paddingLeft: '1.5rem',
                  position: 'fixed',
                  width: '500px',
                  zIndex: '9',
                  borderRadius: '5px 5px 0px 0px',
                }}
              >
                <h1 style={{marginTop: '0.8rem'}}>SOS Details</h1>
                <IconButton
                  aria-label='close'
                  onClick={() => {
                    setopenDialog(false);
                    setSosTrg({});
                    setEmpInfo(null);
                    setTripInfo(null);
                  }} // Replace handleClose with your close function
                  style={{marginTop: '0.5rem'}}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <div style={{marginTop: '50px'}}>
                {/* <p>shreya</p> */}
                <SOSPOPUP
                  tripId={'6544e2a6539c41644574fe4c'}
                  sos_generatorId={'651e485f6ab5ce789d9d2086'}
                  tripInfo={tripInfo}
                  empInfo={empInfo}
                  keys={flag}
                  sosData={sosTrg}
                />
              </div>
            </DialogContent>
          </div>
        </Dialog>
      )}
    </>
  );
}

export default SocketApp;
// import React, {useState, useEffect} from 'react';
// import io from 'socket.io-client';
// import Api from '@api';
// import axios from 'axios';
// const host = Api?.baseUri;
// const socket = io(host, {path: '/api/socket.io/'});
// import {useAuthUser} from '@crema/utility/AuthHooks';
// import audiourl from '../assets/audio/hooter.mp3';
// import Dialog from '@mui/material/Dialog';
// import DialogContent from '@mui/material/DialogContent';
// import SOSPOPUP from '../pages/SOSPOPUP/index';
// import CloseIcon from '@mui/icons-material/Close';
// import {IconButton} from '@mui/material';
// import _ from 'lodash';
// // import useSound from 'use-sound';
// import {pl} from 'date-fns/locale';
// const useAudio = (url) => {
//   const [audio] = useState(new Audio(url));
//   const [playing, setPlaying] = useState(false);

//   const toggle = () => setPlaying(true);
//   useEffect(() => {
//     playing ? audio.play() : audio.pause();
//   }, [playing]);
//   useEffect(() => {
//     audio.addEventListener('ended', () => setPlaying(false));
//     return () => {
//       audio.removeEventListener('ended', () => setPlaying(false));
//     };
//   }, []);
//   return [playing, toggle];
// };

// function SocketApp({getSSOPassengers, liveVehicles}) {
//   const {user} = useAuthUser();
//   const [isConnected, setIsConnected] = useState(socket.connected);
//   const [empInfo, setEmpInfo] = useState();
//   const [tripInfo, setTripInfo] = useState();
//   const [sosTrg, setSosTrg] = useState({});
//   const [playing, toggle] = useAudio(audiourl);
//   const [openDialog, setopenDialog] = useState(false);
//   const [flag, setFlag] = useState();
//   // const [play, {stop}] = useSound(audiourl);
//   useEffect(() => {
//     socket.on('welcome', function (data) {
//       socket.emit('i am client', {data: 'foo!', id: data.id});
//     });
//     socket.emit('add-user', user?.userList?.profileId);
//     socket.on('sos-trigger', (data) => {
//       console.log('trigger', data);
//       setSosTrg(data);
//       // playHooter();
//       getSSOPassengers();
//     });
//   }, []);

//   const playHooter = () => {
//     toggle();
//   };

//   useEffect(() => {
//     let key_word = Object?.keys(sosTrg);
//     setFlag(key_word[1]);
//   }, [sosTrg]);

//   useEffect(() => {
//     console.log('empId', sosTrg?.empId);
//     console.log('driverId', sosTrg?.driverId);
//     if (flag == 'empId') {
//       axios
//         .get(Api.employee.list + '/' + sosTrg?.empId)
//         .then((res) => {
//           if (res?.data?.status == '200') {
//             setEmpInfo(res?.data?.data);
//           }
//         })
//         .catch((err) => {
//           console.log('err', err);
//         });
//     }

//     if (flag == 'driverId') {
//       axios
//         .get(Api.driver.list + '/' + sosTrg?.driverId)
//         .then((res) => {
//           if (res?.data?.status == '200') {
//             // console.log('fffff', res?.data?.data);
//             setEmpInfo(res?.data?.data);
//           }
//         })
//         .catch((err) => {
//           console.log('err', err);
//         });
//     }
//   }, [flag, sosTrg]);

//   useEffect(() => {
//     axios
//       .get(
//         Api.baseUri +
//           `/user-reg/trip-route/get-trip-by-id?tripId=${sosTrg?.tripId}`,
//       )
//       .then((res) => {
//         if (res?.data?.status == '200') {
//           setTripInfo(res?.data?.data);
//         }
//       })
//       .catch((err) => {});
//   }, [sosTrg?.tripId]);

//   useEffect(() => {
//     if (_.isArray(tripInfo) && !_.isEmpty(tripInfo) && _.isObject(empInfo)) {
//       setopenDialog(true);
//    // play;
//     }
//   }, [tripInfo, empInfo]);

//   return (
//     <>
//       {openDialog && (
//         <Dialog
//           open={openDialog}
//           maxWidth='false'
//           PaperProps={{
//             sx: {
//               width: '500px',
//             },
//           }}
//           style={{borderRadius: '4rem'}}
//         >
//           <div>
//             <DialogContent style={{padding: '0px'}}>
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   background: '#f5f2f2',
//                   height: '3rem',
//                   paddingRight: '1.5rem',
//                   paddingLeft: '1.5rem',
//                   position: 'fixed',
//                   width: '500px',
//                   zIndex: '9',
//                   borderRadius: '5px 5px 0px 0px',
//                 }}
//               >
//                 <h1 style={{marginTop: '0.8rem'}}>SOS Details</h1>
//                 <IconButton
//                   aria-label='close'
//                   onClick={() => {
//                     setopenDialog(false);
//                     setSosTrg({});
//                     setEmpInfo(null);
//                     setTripInfo(null);
//                   }} // Replace handleClose with your close function
//                   style={{marginTop: '0.5rem'}}
//                 >
//                   <CloseIcon />
//                 </IconButton>
//               </div>
//               <div style={{marginTop: '50px'}}>
//                 <SOSPOPUP
//                   tripId={'6544e2a6539c41644574fe4c'}
//                   sos_generatorId={'651e485f6ab5ce789d9d2086'}
//                   tripInfo={tripInfo}
//                   empInfo={empInfo}
//                   keys={flag}
//                   sosData={sosTrg}
//                 />
//               </div>
//             </DialogContent>
//           </div>
//         </Dialog>
//       )}
//     </>
//   );
// }

// export default SocketApp;

// import React, {useState, useEffect} from 'react';
// import io from 'socket.io-client';
// import Api from '@api';
// import {useAuthUser} from '@crema/utility/AuthHooks';
// import audiourl from '../assets/audio/hooter.mp3';

// const host = Api?.baseUri;
// const socket = io(host, {path: '/api/socket.io/'});

// const useAudio = (url) => {
//   const [audioContext, setAudioContext] = useState(null);

//   useEffect(() => {
//     const initializeAudioContext = () => {
//       const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//       setAudioContext(audioCtx);
//     };

//     if (!audioContext) {
//       initializeAudioContext();
//     }

//     return () => {
//       if (audioContext && audioContext.state === 'running') {
//         audioContext
//           .close()
//           .catch((error) =>
//             console.error('Failed to close AudioContext: ', error),
//           );
//       }
//     };
//   }, [audioContext]);

//   const play = () => {
//     if (!audioContext) {
//       console.error('Audio context not initialized');
//       return;
//     }

//     audioContext.resume().then(() => {
//       const source = audioContext.createBufferSource();
//       fetch(url)
//         .then((response) => response.arrayBuffer())
//         .then((buffer) => {
//           audioContext.decodeAudioData(buffer, (decodedData) => {
//             if (!decodedData) {
//               console.error('Error decoding audio data');
//               return;
//             }
//             source.buffer = decodedData;
//             source.connect(audioContext.destination);
//             source.start(0);
//           });
//         })
//         .catch((error) =>
//           console.error('Error fetching or decoding audio data: ', error),
//         );
//     });
//   };

//   return play;
// };

// const SocketApp = ({getSSOPassengers, liveVehicles}) => {
//   const {user} = useAuthUser();
//   const [sosTrg, setSosTrg] = useState(null);

//   const playHooter = useAudio(audiourl);

//   useEffect(() => {
//     socket.on('welcome', function (data) {
//       socket.emit('i am client', {data: 'foo!', id: data.id});
//     });

//     socket.emit('add-user', user?.userList?.profileId);

//     socket.on('sos-trigger', (data) => {
//       console.log('trigger', data);
//       playHooter();
//       getSSOPassengers();
//       setSosTrg(data);
//     });
//   }, [getSSOPassengers, user?.userList?.profileId, playHooter]);

//   return <></>;
// };

// export default SocketApp;

// import React, { useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import Api from '../@api';

// const SocketApp = ({ getSSOPassengers, liveVehicles }) => {
//   const host = Api?.baseUri;
//   const socket = useRef(io(host, { path: '/api/socket.io/' }));
//   const audioRef = useRef(new Audio('/assets/audio/hooter.mp3'));

//   const playHooter = () => {
//     audioRef.current.play().catch((error) => console.error('Error playing audio:', error));
//   };

//   useEffect(() => {
//     socket.current.on('connect', () => {
//       console.log('Connected to socket');
//     });

//     socket.current.on('welcome', (data) => {
//       socket.current.emit('i am client', { data: 'foo!', id: data.id });
//     });

//     socket.current.on('connect_error', (error) => {
//       console.error('Socket connection error: ', error);
//     });

//     socket.current.on('sos-trigger', (data) => {
//       console.log('trigger', data);
//       playHooter();
//       getSSOPassengers();
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, [getSSOPassengers]);

//   // Handle user gesture for sound play
//   // const handlePlayHooter = () => {
//   //   playHooter();
//   // };

//   return <></>
//   // <button onClick={handlePlayHooter}>Play Hooter</button>;
// };

// export default SocketApp;
