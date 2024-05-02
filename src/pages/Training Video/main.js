import { Grid, Typography } from '@mui/material'
import React from 'react'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SummarizeIconOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import Trainingvideo from './trainingvideo';
import UserGuide from './userguide';

const Main = () => {
    const [tabSelected, setTabSelected] = React.useState(0);
    return (
        <div>
            <Grid container spacing={2} sx={{ mb: 6 }} className='page-header-second'>
                <Grid item xs={12} sm={3} md={3} sx={{ mb: 2 }}>
                    <Typography variant="h3" style={{ display: 'flex' }} className='cursor' >
                        <div onClick={() => { setTabSelected(0) }} style={{ borderBottom: (tabSelected == 0) ? '4px solid orange' : '', paddingBottom: '5px', paddingRight: '5px', marginRight: '15px', display: 'flex', alignItems: 'center' }}>
                            <SignalCellularAltIcon sx={{ mr: 2 }} /> <span>Training Video</span>
                        </div>
                        <div onClick={() => { setTabSelected(1) }} style={{ borderBottom: (tabSelected == 1) ? '4px solid orange' : '', paddingBottom: '5px', paddingRight: '5px', marginRight: '15px', display: 'flex', alignItems: 'center' }}>
                            <SummarizeIconOutlinedIcon sx={{ mr: 2 }} /> <span>User Guide</span>
                        </div>
                    </Typography>
                    {/* <hr style={styles.hr} /> */}
                </Grid>
            </Grid>
            {tabSelected == 0 && <Trainingvideo/> }
            {tabSelected == 1 && <UserGuide/> }
        </div>
    )
}

export default Main