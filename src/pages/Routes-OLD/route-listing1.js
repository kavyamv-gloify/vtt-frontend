import React, { useState, useEffect } from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import EditIcon from '@mui/icons-material/Edit';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import { useAuthUser } from '@crema/utility/AuthHooks';
import { Button, Dialog, DialogContent } from '@mui/material';
import PopupMap from './PopupMap'
const EmployeeUnderManagerList = ({ childdata, childdata2 }) => {
    const [filter, setFilter] = useState({})
    const [data, setData] = useState();
    const [open, setOpen] = useState();
    const navigate = useNavigate();
    const { user } = useAuthUser();
    const id = user?.userList.profileId;
    // useEffect(() => {
    //     async function fetchData() {
    //         const baseURL = `${api.employee.list}/${id}`;

    //         let response = await axios.get(baseURL);
    //         setData(response.data.data)
    //     }
    //     fetchData();
    // }, [id]);
    function myDial(status) {
        setOpen(status);
    }
    function handleClose() {
        setOpen(false);
    }
    const tableTemplate = {
        columns: [
            {
                title: 'Employee Name',
                field: "firstName"
            },
            {
                title: 'Employee Code',
                field: "employeeCode"
            },
              {
                title: 'Address',
                field: "residenceAddress",
                type:"objectmerge",
                // secondaryfields:"addressName,city"
                secondaryfields:"addressName"
              },
            {
                title: "Pickup Time",
                field: "vehicleTypeId",
            },
            {
                title: "ETA",
                field: "escortName",
            },
            {
                title: "Location",
                field: "location",
                type:"objectmerge",
                secondaryfields:"locName"
            },
        ]
    };

    function handleClickView(rowData) {
        navigate('/empolyee/detailPage/' + rowData.id);
    };
    function handleClickEdit(rowData) {
        navigate('/route-assign/' + rowData.id);
    };

    return (
        <>
            <SmartTable
                components={{
                    Toolbar: (props) => (
                        <>
                            <div
                                style={{
                                    height: "0px",
                                }}
                            >
                            </div>
                        </>
                    ),
                }}
                title="Onboard Tenants List"
                columns={tableTemplate.columns}
                data={childdata ?? []}
                // {query =>
                //     new Promise((resolve, reject) => {
                //         let url = `http://180.151.3.104:9000/trip/generate-routes/getallgeneratedroutes`,
                //             body = {
                //                 pageSize: query.pageSize,
                //                 pageNo: query.page
                //             }
                //         if (!_.isEmpty(filter)) {
                //             body = {
                //                 ...body,
                //                 ...filter
                //             }
                //         }
                //         axios.get(url, body).then(result => {
                //             resolve({
                //                 data: result?.data?.data,
                //                 page: (result.data && result.data.currentPage) ? result.data.currentPage : 0,
                //                 totalCount: (result.data && result.data.totalItems) ? result.data.totalItems : 0,
                //             })
                //         })
                //     })}
                options={{
                    search: false,
                    showTitle: false,
                    // filtering: true,
                    actionsColumnIndex: -1,
                    headerStyle: { position: "sticky", top: 0 },
                }}
                actions={[
                    {
                        icon: () => (<MoveDownIcon color="primary" />),
                        tooltip: 'Assign',
                        onClick: (event, rowData) => handleClickEdit(rowData)
                    },
                    {
                        icon: () => (<PersonRemoveIcon color="primary" />),
                        tooltip: 'view',
                        onClick: (event, rowData) => { myDial(true) }
                    }
                ]}
                localization={{
                    body: {
                        emptyDataSourceMessage: "No records to display",
                        filterRow: {
                            filterTooltip: "Filter",
                            filterPlaceHolder: "Filtaaer",
                        },
                    },
                }}
                style={{ borderRadius: 16, boxShadow: '0px 10px 10px 4px rgb(0 0 0 / 4%)' }}
            />
            <Dialog
                onClose={handleClose}
                height='500px'
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <PopupMap id={"driverId"} myDial={myDial} driverName={"driverName"} radius={8000}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EmployeeUnderManagerList;
