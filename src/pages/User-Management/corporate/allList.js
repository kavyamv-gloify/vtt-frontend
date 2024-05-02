import React from 'react'
import SmartTable from '@smart-table'
import EditIcon from '@mui/icons-material/Edit';
import Api from '../../../@api';
import axios from 'axios';

const Listing = ({appRole}) => {
    const tableRef = React.useRef();
    // https://devapi.etravelmate.com/user-reg/associatevendor/getallassociatecorporateId
    const tableTemplate = {
        columns: [
            {
                title: 'User Name',
                field: "userName"
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
            //     render: rowData => (
            //         (rowData?.userRole == 'CORPORATEADMIN') ? 'Corporate Admin' : (rowData?.userRole == 'EMPLOYEE') ? 'Employee' : (rowData?.userRole == 'VENDOR') ? 'Vendor' : rowData?.userRole
            //     )
            // },
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
                data={query =>
                    new Promise((resolve, reject) => {
                        let url = `${Api.baseUri}/userauth/user-account/getAllUserData?page=${query.page}&size=${query.pageSize}`,
                            body = {
                                pageSize: query.pageSize,
                                pageNo: query.page
                            }
                        axios.get(url, body).then(result => {
                            resolve({
                                data: result?.data?.data?.body['UserList'] ?? [],
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