import React, {useEffect, useState} from 'react';
import {Box, Grid} from '@mui/material';
import {alpha} from '@mui/material/styles';
import AppTooltip from '@crema/core/AppTooltip';
import RestoreIcon from '@mui/icons-material/Restore';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import {IconButton} from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Upload from './upload';
import {useAuthUser} from '@crema/utility/AuthHooks';
import ReactPlayer from 'react-player/lazy';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import Confirm from '@confirmation-box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import {makeStyles} from '@mui/styles';
import myImage from 'assets/icon/video.png'; // Import the image file

const useStyles = makeStyles((theme) => ({
  dialog: {
    borderRadius: '10px',
    backgroundColor: 'white',
  },
  dialogTitle: {
    background: theme.palette.primary.main,
    color: 'white',
    padding: '16px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogContent: {
    padding: '16px',
  },
}));

const Trainingvideo = () => {
  const classes = useStyles();
  const {user} = useAuthUser();
  const stakeHolder = null;
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState({});
  const [modules, setModules] = useState([]);
  const [myEditData, setMyEditData] = useState({});
  const [openConfirmbox, setOpenConfirmbox] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openEditBox, setOpenEditBox] = useState(false);
  useEffect(() => {
    if (!open) getData();
  }, [open]);

  function closeConfirmBox(d) {
    if (d == 'YES') {
      axios
        .put(Api.baseUri + '/user-reg/trainingVideos/update', {
          ...myEditData,
          status: myEditData.btn,
        })
        .then((res) => {
          setOpenConfirmbox(false);
          setMyEditData({});
          if (res?.data?.status == 200) {
            res?.data?.data?.status == 'INACTIVE'
              ? toast.success('Deactivated Successfully.')
              : toast.success('Restored Successfully.');
            getData();
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
          setOpenConfirmbox(false);
          setMyEditData({});
        });
    } else {
      setOpenConfirmbox(false);
      setMyEditData({});
    }
  }
  async function getNextPrevData(module, page, sh, pl) {
    let tempD = route;
    let resp = await axios.post(
      Api.baseUri + '/user-reg/trainingVideos/getAllByFilters',
      {
        stakeHolder: sh,
        module: module,
        platform: pl,
        page: page,
        size: 4,
      },
    );
    tempD[module + '---' + sh + '---' + pl] = {
      currentPage: resp?.data?.data?.body?.currentPage,
      totalPages: resp?.data?.data?.body?.totalPages,
      totalItems: resp?.data?.data?.body?.totalItems,
      data: resp?.data?.data?.body['UserGuide List'],
    };
    setRoute({...tempD});
  }
  async function getData() {
    let res = await axios.get(
      Api.baseUri +
        '/user-reg/trainingVideos/getAllByStakeHolder/' +
        (user?.userList?.userRole == 'SUPERADMIN'
          ? 'null'
          : user?.userList?.userRole),
    );
    let temArr = [];
    res?.data?.data?.map((el) => {
      if (user?.userList?.userRole == 'SUPERADMIN' || el.platform == 'WEB') {
        if (
          !temArr?.includes(
            el.module + '---' + el.stakeHolder + '---' + el.platform,
          )
        )
          temArr.push(el.module + '---' + el.stakeHolder + '---' + el.platform);
      }
    });
    let tempD = {};
    await Promise.all(
      temArr?.map(async (el) => {
        let resp = await axios.post(
          Api.baseUri + '/user-reg/trainingVideos/getAllByFilters',
          {
            module: el?.split('---')[0],
            stakeHolder: el?.split('---')[1],
            platform: el?.split('---')[2],
            page: 0,
            size: 4,
          },
        );
        tempD[el] = {
          currentPage: resp?.data?.data?.body?.currentPage,
          totalPages: resp?.data?.data?.body?.totalPages,
          totalItems: resp?.data?.data?.body?.totalItems,
          data: resp?.data?.data?.body['UserGuide List'],
        };
      }),
    );
    setRoute({...tempD});
    setModules([...temArr]);
  }
  let style = {
    borderRadius: '50%',
    width: 40,
    height: 40,
    color: (theme) => theme.palette.text.secondary,
    backgroundColor: (theme) => theme.palette.background.default,
    border: 1,
    borderColor: 'transparent',
    '&:hover, &:focus': {
      color: (theme) => theme.palette.text.primary,
      backgroundColor: (theme) => alpha(theme.palette.background.default, 0.9),
      borderColor: (theme) => alpha(theme.palette.text.secondary, 0.25),
    },
  };

  return (
    <div>
      {user?.userList?.userRole == 'SUPERADMIN' && (
        <AppTooltip placement={'top'} title={'Add Training Video '}>
          <LibraryAddIcon
            style={{
              position: 'fixed',
              top: '115px',
              zIndex: 801,
              right: '40px',
            }}
            className='cursor'
            onClick={() => {
              setOpen(true);
            }}
          />
        </AppTooltip>
      )}

      <div style={{background: 'white', padding: '30px'}}>
        {modules?.length > 0 &&
          modules?.map((mod) => {
            return (
              <div key={mod}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '900',
                      marginBottom: '10px',
                    }}
                  >
                    {mod?.split('---')[0]} ({route[mod].totalItems || 0})
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <p>
                      {'Page: ' +
                        (route[mod]?.totalPages
                          ? route[mod]?.currentPage + 1
                          : 0) +
                        ' / ' +
                        route[mod]?.totalPages}
                    </p>
                    <IconButton
                      className='icon-btn'
                      sx={{...style, ml: 2}}
                      size='large'
                      onClick={() => {
                        // console.log('=====');
                        if (route[mod]?.currentPage != 0)
                          getNextPrevData(
                            mod?.split('---')[0],
                            route[mod]?.currentPage - 1,
                            mod?.split('---')[1],
                            mod?.split('---')[2],
                          );
                      }}
                    >
                      <ArrowLeftIcon />
                    </IconButton>
                    <IconButton
                      className='icon-btn'
                      sx={style}
                      onClick={() => {
                        // console.log('000000=');
                        if (
                          route[mod]?.currentPage + 1 <
                          route[mod]?.totalPages
                        )
                          getNextPrevData(
                            mod?.split('---')[0],
                            route[mod]?.currentPage + 1,
                            mod?.split('---')[1],
                            mod?.split('---')[2],
                          );
                      }}
                      size='large'
                    >
                      <ArrowRightIcon />
                    </IconButton>
                  </div>
                </div>
                <hr style={{color: '1px solid #f1f1f1'}} />
                <Grid container spacing={2} sx={{mt: '20px', mb: '20px'}}>
                  {route[mod]?.data?.length > 0 &&
                    route[mod]?.data?.map((el, index) => {
                      return (
                        <Grid item xs={12} sm={12} md={3} key={el.id}>
                          <Card>
                            <div // Wrap the CardMedia in a div
                              onClick={() => {
                                setSelectedVideo(el);
                                setIsPopupOpen(true);
                              }}
                              style={{
                                cursor: 'pointer',
                                position: 'relative',
                                height: '200px',
                              }}
                            >
                              <CardMedia
                                component='img'
                                // alt={el.title}
                                height='250'
                                image={el.thumbnailURL} //||myImage
                                style={{position: 'relative'}} // Remove any absolute positioning on the CardMedia
                              />
                              {/* Video Icon */}
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  // zIndex: 1,
                                  // backgroundColor: 'white',
                                  // borderRadius: '50%', // Make it circular
                                  // padding: '6px', // Adjust the padding to control the size of the background
                                }}
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  x='0px'
                                  y='0px'
                                  width='100'
                                  height='100'
                                  viewBox='0 0 48 48'
                                >
                                  <path
                                    fill='#FF3D00'
                                    d='M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z'
                                  ></path>
                                  <path
                                    fill='#FFF'
                                    d='M20 31L20 17 32 24z'
                                  ></path>
                                </svg>
                              </div>
                            </div>

                            <CardContent>
                              <Typography
                                variant='subtitle1'
                                component='div'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div>{el.title}</div>
                                {user?.userList?.userRole == 'SUPERADMIN' && (
                                  <div>
                                    <AppTooltip title='Update'>
                                      <EditIcon
                                        color='primary'
                                        sx={{
                                          visibility:
                                            el?.status == 'ACTIVE'
                                              ? ' '
                                              : 'hidden',
                                        }}
                                        onClick={() => {
                                          // if (el?.status == 'INACTIVE') {
                                          //   return;
                                          // }
                                          // console.log('el', el);
                                          setMyEditData(el);
                                          setOpenEditBox(true);
                                        }}
                                      />
                                    </AppTooltip>
                                    <AppTooltip
                                      title={
                                        el?.status == 'ACTIVE'
                                          ? 'Delete'
                                          : 'Restore'
                                      }
                                    >
                                      {el.status == 'ACTIVE' ? (
                                        <DeleteForeverIcon
                                          className='pointer'
                                          sx={{
                                            color: '#ce1420',
                                            ml: 1,
                                            opacity:
                                              el.status == 'INACTIVE'
                                                ? '0.3'
                                                : '',
                                          }}
                                          onClick={() => {
                                            let ob = el;
                                            ob.btn = 'INACTIVE';
                                            setMyEditData(ob);
                                            setOpenConfirmbox(true);
                                          }}
                                        />
                                      ) : (
                                        <RestoreIcon
                                          className='pointer'
                                          color='primary'
                                          sx={{ml: 1}}
                                          onClick={() => {
                                            let ob = el;
                                            ob.btn = 'ACTIVE';
                                            setMyEditData(ob);
                                            setOpenConfirmbox(true);
                                          }}
                                        />
                                      )}
                                    </AppTooltip>
                                  </div>
                                )}
                                {/* {user?.userList?.userRole == 'SUPERADMIN' && (
                                  <div
                                    style={{
                                      // position: 'absolute',
                                      display: 'flex',
                                      // top: '-10px',
                                      // right: '0px',
                                    }}
                                  >
                                    <AppTooltip
                                      placement={'bottom'}
                                      title={
                                        el.status == 'ACTIVE'
                                          ? 'Deactivate'
                                          : 'Restore'
                                      }
                                    >
                                      {el.status == 'ACTIVE' ? (
                                        <DeleteForeverIcon
                                          className='pointer'
                                          sx={{
                                            color: '#ce1420',
                                            ml: 1,
                                            opacity:
                                              el.status == 'INACTIVE'
                                                ? '0.3'
                                                : '',
                                          }}
                                          onClick={() => {
                                            let ob = el;
                                            ob.btn = 'INACTIVE';
                                            setMyEditData(ob);
                                            setOpenConfirmbox(true);
                                          }}
                                        />
                                      ) : (
                                        <RestoreIcon
                                          className='pointer'
                                          color='primary'
                                          sx={{ml: 1}}
                                          onClick={() => {
                                            let ob = el;
                                            ob.btn = 'ACTIVE';
                                            setMyEditData(ob);
                                            setOpenConfirmbox(true);
                                          }}
                                        />
                                      )}
                                    </AppTooltip>
                                  </div>
                                )} */}
                              </Typography>

                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                {el.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                </Grid>
              </div>
            );
          })}
      </div>
      {open && <Upload setOpen={setOpen} getData={getData} />}
      {openEditBox && (
        <Upload setOpen={setOpenEditBox} data={myEditData} getData={getData} />
      )}
      {openConfirmbox && (
        <Confirm
          open={openConfirmbox}
          header={
            'Confirm to ' +
            (myEditData?.btn == 'ACTIVE' ? 'Restore' : 'Deactivate')
          }
          cnfMsg={`Are you sure, You want to ${
            myEditData?.btn == 'ACTIVE' ? 'restore ' : 'deactivate '
          } it?`}
          handleClose={closeConfirmBox}
        />
      )}
      {isPopupOpen && (
        <Dialog
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          fullWidth={'true'}
          maxWidth={'md'}
          PaperProps={{
            style: {
              width: '700px', // Set your desired width
              height: '500px', // Set your desired height
              display: 'flex',
              alignItems: 'center', // Center vertically
              justifyContent: 'center', // Center horizontally
            },
          }}
        >
          <DialogTitle>
            <h2> {selectedVideo?.title}</h2>
            <IconButton
              edge='end'
              color='inherit'
              className='icon-btn'
              onClick={() => setIsPopupOpen(false)}
              aria-label='close'
              sx={{
                position: 'absolute',
                right: 0,
                marginRight: '10px',
                top: 10,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <ReactPlayer
              url={selectedVideo?.youtubeURL}
              controls={true}
              // width='100%'
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Trainingvideo;

// {url: "https://youtu.be/V1Pl8CzNzCw"},
// {url: "https://youtu.be/-43HyVwAiuc"},
// {url: "https://youtu.be/908lTsjWADM"},
// {url: "https://youtu.be/dhYOPzcsbGM"},
// {url: "https://youtu.be/50VNCymT-Cs"},
// {url: "https://youtu.be/908lTsjWADMqHw"},
// {url: "https://youtu.be/euCqAq6BRa4"},
// {url: "https://youtu.be/50VNCymT-Cs"},
// {url: "https://youtu.be/euCqAq6BRa4"},
// {url: "https://youtu.be/50VNCymT-Cs"},
