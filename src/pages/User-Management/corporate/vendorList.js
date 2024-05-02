import React, { useEffect, useState } from 'react'
import SmartTable from '@smart-table'
import EditIcon from '@mui/icons-material/Edit';
import Api from '../../../@api';
import axios from 'axios';

const Listing = () => {
    const tableRef = React.useRef();
    const [data, setData] = useState([])
    // https://devapi.etravelmate.com/user-reg/associatevendor/getallassociatecorporateId
    useEffect(()=>{
        axios.get(Api.baseUri+'/user-reg/associatevendor/getallassociatecorporateId').then(res=>{
            let arr = []
            res?.data?.data?.map(el=>{
                arr.push(el.vendor);
            })
            setData(arr || []);
        }).catch(err=>{
            setData([]);
        })
    },[])
    const tableTemplate = {
        columns: [
            {
                title: 'User Name',
                field: "vendorName"
            },
            {
                title: 'Mobile Number',
                field: "mobileNo"
            },
            {
                title: 'Email Id',
                field: "emailId"
            },
            {
                title: 'Role For',
                field: "userRole",
                render: rowData => (
                    (rowData?.userRole == 'CORPORATEADMIN') ? 'Corporate Admin' : (rowData?.userRole == 'EMPLOYEE') ? 'Employee' : (rowData?.userRole == 'VENDOR') ? 'Vendor' : rowData?.userRole
                    // (rowData?.userRole == 'CORPORATEADMIN') ? 'Corporate Admin' : (rowData?.userRole == 'TANENTADMIN') ? 'Super Admin' : (rowData?.userRole == 'SUPERADMIN') ? 'eTravelmate Admin' : (rowData?.userRole == 'EMPLOYEE') ? 'Employee' :
                    //   (rowData.appRole == 'ACTIVE') ? (<span style={{ color: "green" }}>ACTIVE</span>) : (rowData.status == 'INACTIVE') ? <span style={{ color: "red" }}>INACTIVE</span> : rowData.status
                )
            },
            {
                title: 'Application Role',
                field: "appRole",
                render: rowData => (
                    rowData?.appRole || 'NA'
                    //   (rowData.appRole == 'ACTIVE') ? (<span style={{ color: "green" }}>ACTIVE</span>) : (rowData.status == 'INACTIVE') ? <span style={{ color: "red" }}>INACTIVE</span> : rowData.status
                )
            },
        ]
    }
    return (
        <div>
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
                tableRef={tableRef}
                data={data || []}
                options={{
                    search: false,
                    showTitle: false,
                    actionsColumnIndex: -1,
                    headerStyle: { position: "sticky", top: 0 },
                }}
                // actions={[
                //     {
                //         icon: () => (<EditIcon color="primary" />),
                //         tooltip: 'edit',
                //         onClick: (event, rowData) => { }
                //     },
                //     //   {
                //     //     icon: () => (<DeleteIcon color="primary" style={{ color: "#bc0805" }} />),
                //     //     tooltip: 'Deactivate',
                //     //     onClick: (event, rowData) => handleDelete(rowData)
                //     //   }
                // ]}
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
        </div>
    )
}

export default Listing