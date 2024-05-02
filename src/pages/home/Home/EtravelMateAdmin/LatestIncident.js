import React from 'react'
import UpcomingAppointments from '../../../dashboards/HealthCare/UpcomingAppointments/index'
import { Grid } from '@mui/material';
const LatestIncident = () => {
    const data = [
        { profile_pic: "/assets/images/image 11.png", name: "UP4543145", speciality: "ACTIVE", scheduled: "Schedule", appointmentTime:"09:30", appointmentDate:"09/08/2023" },
        { profile_pic: "/assets/images/image 11.png", name: "UP4543145", speciality: "ACTIVE", scheduled: "Schedule", appointmentTime:"09:30", appointmentDate:"09/08/2023" }
    ]
    return (
        <div>
            <Grid container spacing={2} sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={12} sm={12}>
                    <UpcomingAppointments data={data} title={"Latest Incident"} />
                </Grid>
            </Grid>
        </div>
    )
}

export default LatestIncident;