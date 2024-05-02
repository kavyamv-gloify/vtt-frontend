import React from 'react';
import { Grid } from '@mui/material';
import ReactSpeedometer from 'react-d3-speedometer';
const LiveTraffic = () => {
    return (
        <div>
            <Grid container>
                <Grid item md={12} sm={12} xs={12}>
                    <Grid container>
                        <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                            <p style={{ fontWeight: "600", color: "#55555" }}>Live Traffic</p>
                            <p style={{ fontWeight: "600", color: "#55555" }}>Last 1 hour responses</p>
                        </Grid>
                    </Grid>
                    <hr style={{ border: '1px solid #f1f1f1' }} />
                    <Grid container >
                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent:"center" }}>
                            <ReactSpeedometer
                                minValue={0}
                                maxValue={50}
                                needleHeightRatio={0.75}
                                // segments={4}
                                // width={150}
                                height={153}
                                ringWidth={10}
                                needleColor='#2a2a2a'
                                valueTextFontSize='12px'
                                labelFontSize='10px'
                                segmentColors={['#a4d1a2']}
                                currentValueText='${value} % Trips'
                                forceRender={true}
                                value={45}

                            />
                        </Grid>
                        <div style={{ display: "flex", flexDirection: "column", alignContent: "center", alignItems: "center", width: "50%", margin: "auto" }}>
                            <p style={{ fontWeight: "600", color: "#55555" }}>Incoming</p>
                            <p style={{ fontWeight: "600", color: "green", fontSize:"20px" }}>0</p>
                        </div>

                    </Grid>
                    <Grid container >
                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent:"center" }}>
                            <ReactSpeedometer
                                minValue={0}
                                maxValue={50}
                                needleHeightRatio={0.75}
                                // segments={4}
                                // width={150}
                                height={153}
                                ringWidth={10}
                                needleColor='#2a2a2a'
                                valueTextFontSize='12px'
                                labelFontSize='10px'
                                segmentColors={["#658cbb"]}
                                currentValueText='${value} % Trips'
                                forceRender={true}
                                value={45}

                            />
                        </Grid>
                        <div style={{ display: "flex", flexDirection: "column", alignContent: "center", alignItems: "center", width: "50%", margin: "auto" }}>
                            <p style={{ fontWeight: "600", color: "#55555" }}>Outgoing</p>
                            <p style={{ fontWeight: "600", color: "#658cbb", fontSize:"20px" }}>0</p>
                        </div>

                    </Grid>
                </Grid>
                </Grid>

        </div >
    )
}

export default LiveTraffic