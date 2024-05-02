import React from 'react'
import SmartTable from '@smart-table'
import EditIcon from '@mui/icons-material/Edit';
import Api from '../../../@api';
import axios from 'axios';

const Listing = () => {
    const tableRef = React.useRef();

    const tableTemplate = {
        columns: [
            {
                title: 'Application Role',
                field: "appRole",
                render: rowData => (
                    rowData?.appRole || 'NA'
                    //   (rowData.appRole == 'ACTIVE') ? (<span style={{ color: "green" }}>ACTIVE</span>) : (rowData.status == 'INACTIVE') ? <span style={{ color: "red" }}>INACTIVE</span> : rowData.status
                )
            },
            {
                title: 'User Name',
                field: "firstName",
                render: rd => (
                    rd.firstName+' '+rd.lastName
                )
            },
            {
                title: 'Mobile Number',
                field: "mobileNo"
            },
            {
                title: 'Email Id',
                field: "emailId"
            },
            // {
            //     title: 'Role For',
            //     field: "userRole",
            //     render: rd => (
            //         "Employee"
            //     )
            // },
        ]
    }
    // https://devapi.etravelmate.com/user-reg/associatevendor/getallassociatecorporateId
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
                data={query =>
                    new Promise((resolve, reject) => {
                        let url = `${Api.baseUri}/user-reg/employee-reg/corporate?page=${query.page}&size=${query.pageSize}&emailId=null&employeeCode=null&mobileNo=null`,
                            body = {
                                pageSize: query.pageSize,
                                pageNo: query.page
                            }
                        axios.get(url, body).then(result => {
                            resolve({
                                data: result?.data?.data?.body['EmployeeList'] ?? [],
                                page: result?.data?.data?.body?.currentPage || 0,
                                totalCount: result?.data?.data?.body?.totalItems || 0,
                            })
                        }).catch(err => {
                            resolve({
                                data: [],
                                page: 0,
                                totalCount: 0,
                            })
                        })
                    })}
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