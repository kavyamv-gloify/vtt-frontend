import React from 'react';
import { Grid } from '@mui/material';
import Notification from 'pages/dashboards/HealthCare/Notifications/index.js';
const Notifications = () => {
    const notification = [
        { title: "You confrirmed to dermatologist", time: "2days", color: "red" },
        { title: "You confrirmed to dermatologist", time: "2days", color: "blue" }
    ]
    return (
        <Grid container spacing={2} sx={{ marginTop: "20px" }}>
            <Grid item xs={12} md={12} sm={12}>
                <Notification data={notification} />
            </Grid>
        </Grid>
    )

}

export default Notifications