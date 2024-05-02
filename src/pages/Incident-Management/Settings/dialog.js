import { Dialog } from '@mui/material';
import React from 'react'

export default function SLAForm({setdaysInput, daysInput}) {
    return (
      <>
        <Grid container spacing={2}>
          <Grid
            item
            md={6}
            sx={{display: 'flex', flexDirection: 'column', alignItem: 'center'}}
          >
            <h5 style={{marginBottom: '10px'}}>SLA Name</h5>
            <TextField fullWidth />
          </Grid>
          <Grid
            item
            md={6}
            sx={{display: 'flex', flexDirection: 'column', alignItem: 'center'}}
          >
            <h5 style={{marginBottom: '10px'}}>Incident Type</h5>
            <TextField fullWidth />
          </Grid>
          <Grid md={12} sx={{marginTop: '10px'}}>
            <TableContainer component={Paper}>
              <Table size='small' aria-label='a dense table'>
                <TableHead>
                  <TableRow>
                    <TableCell align='center' style={{minWidth: '140px'}}>Levels</TableCell>
                    <TableCell align='center'>Response Time</TableCell>
                    <TableCell align='center'>Respond Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {level?.map((el, ind) => {
                    return (
                      <TableRow>
                        <TableCell align='center'>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={CheckBox[ind]}
                                  onChange={(e) => {
                                    setCheckBox({...CheckBox, [ind]: e.target.checked})
                                  }}
                                />
                              }
                              label={el}
                            />
                          </FormGroup>
                        </TableCell>
                        <TableCell align='center'>
                          <Grid container spacing={2}>
                            <Grid item md={3.5}>
                              <TextField
                                fullWidth
                                value={daysInput[ind]}
                                size='small'
                                onInput={(e)=>{
                                  // if(!_.isNaN(Number(e.target.value)) && Number(e.target.value) <= 365){
                                    setdaysInput({...daysInput, [ind]: e.target.value})
                                  // }
                                }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position='start'
                                      sx={{
                                        padding: '2px',
                                        marginRight: '-10px',
                                      }}
                                    >
                                      days
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item md={3.5}>
                              <TextField
                                fullWidth
                                size='small'
                                value={hoursInput[ind]}
                                onInput={(e)=>{
                                  if(!_.isNaN(Number(e.target.value)) && Number(e.target.value) <= 23){
                                    sethoursInput({...hoursInput, [ind]: e.target.value})
                                  }
                                }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position='start'
                                      sx={{
                                        padding: '2px',
                                        marginRight: '-10px',
                                      }}
                                    >
                                      hrs
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item md={3.5}>
                              <TextField
                                fullWidth
                                size='small'
                                value={minsInput[ind]}
                                onInput={(e)=>{
                                  if(!_.isNaN(Number(e.target.value)) && Number(e.target.value) <= 59){
                                    setminsInput({...minsInput, [ind]: e.target.value})
                                  }
                                }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position='start'
                                      sx={{
                                        padding: '2px',
                                        marginRight: '-10px',
                                      }}
                                    >
                                      mins
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell align='center'>
                          <Grid container spacing={2}>
                            <Grid item md={3.5}>
                              <TextField
                                fullWidth
                                size='small'
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position='start'
                                      sx={{
                                        padding: '2px',
                                        marginRight: '-10px',
                                      }}
                                    >
                                      days
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item md={3.5}>
                              <TextField
                                fullWidth
                                size='small'
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position='start'
                                      sx={{
                                        padding: '2px',
                                        marginRight: '-10px',
                                      }}
                                    >
                                      hrs
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item md={3.5}>
                              <TextField
                                fullWidth
                                size='small'
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position='start'
                                      sx={{
                                        padding: '2px',
                                        marginRight: '-10px',
                                      }}
                                    >
                                      mins
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </>
    );
  }