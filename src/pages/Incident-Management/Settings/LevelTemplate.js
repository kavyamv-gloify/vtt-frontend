import React, {useState, useEffect} from 'react';
import {Grid, Box} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Api from '@api';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import {GiKevlarVest} from 'react-icons/gi';
const LevelTemplate = ({title, levelContent, _edit}) => {
  const [agentList, setAgentList] = useState();
  const {user} = useAuthUser();
  const [levelValue, setLevelValue] = useState({
    escalteEmail: _edit?.agent || '',
    days: Math.trunc(_edit?.time / 1440) || 0,
    hrs: Math.trunc((_edit?.time % 1440) / 60) || 0,
    mins: Math.trunc((_edit?.time % 1440) % 60) || 0,
  });
  // console.log('_edit', _edit);

  // useEffect(() => {
  //   console.log('_edit?.agent', _edit?.agent);
  //   if (_edit) {
  //     setLevelValue({
  //       escalteEmail: _edit?.agent,
  //       days: Math.trunc(_edit?.time / 1440),
  //       hrs: Math.trunc((_edit?.time % 1440) / 60),
  //       mins: Math.trunc((_edit?.time % 1440) % 60),
  //     });
  //   }
  // }, [_edit, agentList]);
  useEffect(() => {
    let postData = {
      page: '0',
      size: '100',
      role: 'AGENT',
      corporateId: user?.userList?.corporateId,
      roleCode: 'EMPLOYEE',
    };
    axios
      .post(Api.baseUri + '/userauth/user-account/getAllUserData', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];

          res?.data?.data?.body?.UserList?.map((el) => {
            temp.push({
              title: el?.userName + '-(' + el?.emailId + ')',
              value: el?.profileId,
            });
          });
          setAgentList(temp ?? []);
        }
      })
      .catch((err) => {
        setAgentList([]);
      });
  }, []);

  useEffect(() => {
    levelContent(levelValue);
    // console.log('levelValue', levelValue);
  }, [levelValue]);

  return (
    <div>
      <Grid container>
        <Grid item md={12}>
          <Box
            component='h3'
            sx={{
              fontWeight: 600,
              fontSize: 14,
              textAlign: 'left',
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            {title}
          </Box>
        </Grid>
        <Grid item md={12}>
          <Box
            component='h3'
            sx={{
              fontWeight: 600,
              fontSize: 12,
              textAlign: 'left',
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            {'Whom to Escalate'}
            <Box sx={{display: 'flex'}}>
              <FormControl variant='standard' sx={{m: 1, minWidth: '200px'}}>
                <Select
                  labelId='demo-simple-select-standard-label'
                  id='demo-simple-select-standard'
                  value={levelValue?.escalteEmail}
                  onChange={(e) => {
                    console.log('e', e?.target?.value);
                    setLevelValue({
                      ...levelValue,
                      escalteEmail: e?.target?.value,
                    });
                  }}
                  label=' '
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {agentList?.map((el) => {
                    return <MenuItem value={el?.value}>{el?.title}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Grid>
        <Grid md={12}>
          <Box
            component='h3'
            sx={{
              fontWeight: 600,
              fontSize: 12,
              textAlign: 'left',
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            {'When to Escalate'}
          </Box>

          <Box sx={{display: 'flex'}}>
            {/* <FormControl
              variant='standard'
              sx={{m: 1, mt: 3, minWidth: '150px'}}
            >
              <Select
                labelId='demo-simple-select-standard-label'
                id='demo-simple-select-standard'
                // value={age}
                onChange={(e) => {
                  setLevelValue({
                    ...levelValue,
                    onTime: e?.target?.value,
                  });
                }}
                label=' '
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'onTime'}>onTime</MenuItem>
                <MenuItem value={'After'}>After</MenuItem>
                <MenuItem value={'Before'}>Before</MenuItem>
              </Select>
            </FormControl> */}
            <Box>
              <Box sx={{display: 'flex'}}>
                <Box sx={{display: 'flex'}}>
                  <FormControl
                    variant='standard'
                    sx={{m: 1, mt: 3, width: '10ch'}}
                  >
                    <Input
                      value={levelValue?.days}
                      id='standard-adornment-weight'
                      onChange={(e) => {
                        setLevelValue({
                          ...levelValue,
                          days: e?.target?.value,
                        });
                      }}
                      endAdornment={
                        <InputAdornment position='end'>Days</InputAdornment>
                      }
                      aria-describedby='standard-weight-helper-text'
                      inputProps={{
                        'aria-label': 'weight',
                      }}
                    />
                  </FormControl>
                  <FormControl
                    variant='standard'
                    sx={{m: 1, mt: 3, width: '10ch'}}
                  >
                    <Input
                      value={levelValue?.hrs}
                      id='standard-adornment-weight'
                      onChange={(e) => {
                        setLevelValue({
                          ...levelValue,
                          hrs: e?.target?.value,
                        });
                      }}
                      endAdornment={
                        <InputAdornment position='end'>Hrs</InputAdornment>
                      }
                      aria-describedby='standard-weight-helper-text'
                      inputProps={{
                        'aria-label': 'weight',
                      }}
                    />
                  </FormControl>
                  <FormControl
                    variant='standard'
                    sx={{m: 1, mt: 3, width: '10ch'}}
                  >
                    <Input
                      value={levelValue?.mins}
                      id='standard-adornment-weight'
                      onChange={(e) => {
                        setLevelValue({
                          ...levelValue,
                          mins: e?.target?.value,
                        });
                      }}
                      endAdornment={
                        <InputAdornment position='end'>Mins</InputAdornment>
                      }
                      aria-describedby='standard-weight-helper-text'
                      inputProps={{
                        'aria-label': 'weight',
                      }}
                    />
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default LevelTemplate;
