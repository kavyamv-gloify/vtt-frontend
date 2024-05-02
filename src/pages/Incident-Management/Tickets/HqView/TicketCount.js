import React from 'react'
import { Grid } from '@mui/material'
const TicketCount = ({totalCount}) => {
    const myDataByStatus = [
        { title: 'Unassigned', value: totalCount?.unAssignIncident , color: 'red' },
        { title: 'On Hold', value: totalCount?.holdIncident , color: 'blue' },
        { title: 'Opened', value: totalCount?.openIncident , color: '#ADD8E6' },
        { title: 'Closed', value: totalCount?.closedIncident, color: 'green' },
    ];
    return (
        <div>
            <Grid container>
                <Grid item md={12} xs={12} sm={12}>
                    <Grid container>
                        <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                            <div>
                                <p style={{ fontWeight: "600", color: "#55555" }}>Tickets</p>
                            </div>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ display: 'flex' }}>
                                        <img
                                            src='/assets/images/watch.svg'
                                            style={{
                                                width: '20px',
                                                height: '15px',
                                                marginRight: '6px',
                                                marginTop: '6px',
                                            }}
                                        />
                                        <p
                                            style={{
                                                marginRight: '6px',
                                                color: 'black',
                                                fontWeigth: '800',
                                                fontSize:"20px"
                                            }}
                                        >
                                            0
                                        </p>
                                        <p style={{marginTop:"6px", fontWeight:"800", color:"black"}}>due in hours</p>
                                    </div>
                                    <div style={{ display: 'flex', marginLeft: "20px" }}>
                                        <img
                                            src='/assets/images/timer.svg'
                                            style={{
                                                width: '20px',
                                                height: '15px',
                                                marginRight: '6px',
                                                marginTop: '6px',
                                                
                                            }}
                                        />
                                        <p
                                            style={{
                                                marginRight: '6px',
                                                color: 'red',
                                                fontWeigth: '800',
                                                fontSize:"20px"
                                            }}
                                        >
                                            1
                                        </p>
                                        <p style={{marginTop:"6px", fontWeight:"800", color:"black"}}>Overdue</p>
                                    </div>

                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    <hr style={{ border: '1px solid #f1f1f1' }} />

                    <Grid container sx={{ padding: "10px", marginTop:"20px" }}>
                        <Grid item md={2.4} sm={3} xs={12} sx={{ display: "flex" }}>
                            <p style={{ fontSize: "20px" }}>{totalCount?.totalIncident}</p>
                            <p style={{ color: "blue", marginLeft: "10px", marginTop:"5px" }}>Total Tickets</p>
                        </Grid>
                        {myDataByStatus?.map((el) => {
                            return (
                                <Grid item md={2.4} sm={3} xs={12} sx={{ display: "flex", borderRight: "1px solid #989898", alignItems:"center", justifyContent:"center" }}>
                                    <p style={{ fontSize: "20px" }}>{el?.value}</p>
                                    <p style={{ color: el?.color, marginLeft: "10px",  marginTop:"5px" }}>{el?.title}</p>
                                </Grid>
                            )
                        })}

                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default TicketCount