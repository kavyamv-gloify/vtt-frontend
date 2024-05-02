import React, { useEffect, useState } from 'react';
import SmartTable from '@smart-table';
import SmartForm from '@smart-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import _, { isNull, values } from 'lodash';
import Api from '@api';
import { useAuthUser } from '@crema/utility/AuthHooks';
import Button from '@mui/material/Button';
import { AccordionDetails, AccordionSummary, Box, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import SubModule from './subModule';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Confirm from '@confirmation-box';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const Module = () => {
    const [openDial, setopenDial] = useState(false);
    const [defVal, setDefVal] = useState({});
    const [editDial, setEditDial] = useState(false);
    const [success, setSuccess] = useState(true);
    const [moduleData, setModuleData] = useState([]);
    const [expanded, setExpanded] = React.useState();
    const [selectedData, setselectedData] = React.useState();
    const [clickedDel, setclickedDel] = React.useState(false);
    const [delText, setDelText] = React.useState('');
    const handleChange = (v) => {
        setExpanded(v || null);
    };

    const navigate = useNavigate();
    const { user } = useAuthUser();
    useEffect(() => {
        getAllModules();
    }, [])
    function getAllModules() {
        axios.get(Api.baseUri + '/user-reg/user-module/get-all-user-module').then(res => {
            setModuleData(res?.data?.data || []);
        }).catch(err => {
            setModuleData([]);
        })
    }
    function onSubmit(values) {
        setSuccess(false);
        axios.post(Api.baseUri + '/user-reg/user-module/save-user-module', { ...values?.data }).then(res => {
            setSuccess(true);
            if (res?.data?.status == '200') {
                setopenDial(false);
                getAllModules();
                toast.success("Module created successfully.");
            }
            else {
                toast.error(res?.data?.message || "Something went wrong.");
            }
        }).catch(err => {
            setSuccess(true);
            toast.error("Something went wrong.");
        })
    }
    function onEdit(values) {
        setSuccess(false);
        if (values?.type == "DELETE") {
            axios.put(Api.baseUri + '/user-reg/user-module/update-user-module', selectedData).then(res => {
                setSuccess(true);
                if (res?.data?.status == '200') {
                    setselectedData({});
                    setclickedDel(false);
                    setDelText('');
                    getAllModules();
                    toast.success("Module "+ delText +"d successfully.");
                }
                else {
                    toast.error(res?.data?.message || "Something went wrong.");
                }
            }).catch(err => {
                setSuccess(true);
                toast.error("Something went wrong.");
            })
            return;
        }
        axios.put(Api.baseUri + '/user-reg/user-module/update-user-module', { ...values?.data }).then(res => {
            setSuccess(true);
            if (res?.data?.status == '200') {
                setEditDial(false);
                setDefVal({});
                getAllModules();
                toast.success("Module updated successfully.");
            }
            else {
                toast.error(res?.data?.message || "Something went wrong.");
            }
        }).catch(err => {
            setSuccess(true);
            toast.error("Something went wrong.");
        })
    }
    let template = {
        layout: { column: 1, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
        sections: [
            {
                layout: { column: 1, spacing: 2, size: 'small', label: 'fixed', },
                id: 'personal_information',
                fields: [
                    {
                        type: 'text',
                        name: 'moduleName',
                        field: "moduleName",
                        title: 'Module Name',
                        validationProps: {
                            required: 'This is a mandatory field'
                        }
                    }
                ]
            }
        ]
    }

    function handleClick(rowData, type) {
        if (type == 'EDIT') {
            setDefVal({ id: rowData?.id, moduleName: rowData?.moduleName, status: rowData?.status, createdOn: rowData?.createdOn, createdBy: rowData?.createdBy })
            setEditDial(true);
        }
        if (type == 'INACTIVE' || type == 'ACTIVE'){
            let t_obj = ({ id: rowData?.id, moduleName: rowData?.moduleName, status: type, createdOn: rowData?.createdOn, createdBy: rowData?.createdBy })
            setselectedData(t_obj);
            setclickedDel(true);
            setDelText(type=='ACTIVE' ? "reactivate" : 'deactivate');
        }
    };

    return (
        <>
            <Grid container spacing={2} sx={{ mb: 6 }} className='page-header-second'>
                <Grid item xs={9}>
                    <CustomLabel labelVal="Modules' List" variantVal="h3-underline" />
                </Grid>
                <Grid item xs={3} >
                    <Box display="flex" justifyContent="flex-end">
                        <div className='left-seperator'>
                            <AppTooltip placement={'top'}
                                title={'Add New Module'}>
                                <img src='/assets/images/title-icon/add-driver.svg' className='title-icons-mui' onClick={(e) => { setopenDial(true); }} />
                            </AppTooltip>
                        </div>
                    </Box>
                </Grid>
            </Grid>

            <Accordion expanded={false} sx={{background:'#f1f1f1'}} >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ opacity: 0 }} />} aria-controls="d-content" id={"d-header-head"}>
                    <Typography sx={{ width: '70%', fontWeight: 600 }}>Module Name</Typography>
                    <Typography sx={{ width: '10%', textAlign:'center', fontWeight: 600 }}>Status</Typography>
                    <Typography sx={{ width: '20%', textAlign:'center', fontWeight: 600 }}>
                        Action
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                </AccordionDetails>
            </Accordion>

            {moduleData?.map((rd, ind) => {
                return (
                    <>
                        <Accordion expanded={expanded === ind + 1} onChange={() => { handleChange(((expanded == ind + 1) ? null : ind + 1)) }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="d-content" id={"d-header" + ind}>
                                <Typography sx={{width:'70%'}}>{rd?.moduleName}</Typography>
                                <Typography sx={{width:'10%', textAlign:'center'}}>{rd?.status}</Typography>
                                <Typography sx={{width: '20%', textAlign:'center' }}>
                                    <span onClick={(eve)=>{ eve.stopPropagation(); handleClick(rd, "EDIT"); }}>
                                        <EditIcon color='primary'/>
                                    </span>
                                    <span onClick={(eve)=>{ eve.stopPropagation(); if(rd?.status == 'ACTIVE') handleClick(rd, "INACTIVE"); }} style={{ color:'#bc0906', opacity: rd?.status == 'INACTIVE' ? '0.2' : '1' }}>
                                        <DeleteIcon/>
                                    </span> 
                                    <span onClick={(eve)=>{ eve.stopPropagation(); if(rd?.status == 'INACTIVE') handleClick(rd, "ACTIVE"); }} style={{ opacity: rd?.status == 'ACTIVE' ? '0.2' : '1' }}>
                                        <RestoreIcon color='primary'/>
                                    </span> 
                                    {/* , color:'#bc0906', textDecoration:'underline' */}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {expanded === ind + 1 ? <SubModule id={rd?.id} moduleName={rd?.moduleName}/> : null}
                            </AccordionDetails>
                        </Accordion>
                    </>)
            })}

            <Dialog
                open={openDial}
                onClose={() => { setopenDial(false); }}
                style={{ borderRadius: "4rem" }}
                PaperProps={{ sx: { width: "500px" } }}
            >
                <DialogTitle style={{ background: "#f5f2f2", display: "flex", justifyContent: "space-between" }}>
                    <h1>Create Module</h1>
                    <CloseIcon onClick={() => { setopenDial(false); }} style={{ color: "#4f4f4f", fontWeight: "bold" }} />
                </DialogTitle>
                <DialogContent style={{ padding: "20px", paddingTop: "0px" }}  >
                    <div>
                        <SmartForm
                            template={template}
                            onSubmit={onSubmit}
                            buttons={['submit']}
                            success={success}
                        />
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={editDial}
                onClose={() => { setEditDial(false); setDefVal({}) }}
                style={{ borderRadius: "4rem" }}
                PaperProps={{ sx: { width: "500px" } }}
            >
                <DialogTitle style={{ background: "#f5f2f2", display: "flex", justifyContent: "space-between" }}>
                    <h1>Edit Module</h1>
                    <CloseIcon onClick={() => { setEditDial(false); setDefVal({}) }} style={{ color: "#4f4f4f", fontWeight: "bold" }} />
                </DialogTitle>
                <DialogContent style={{ padding: "20px", paddingTop: "0px" }}  >
                    <div>
                        <SmartForm
                            defaultValues={defVal || {}}
                            template={template}
                            onSubmit={onEdit}
                            buttons={['update']}
                            success={success}
                        />
                    </div>
                </DialogContent>
            </Dialog>
            <Confirm open={clickedDel} header={"Confirm to " + delText} cnfMsg={"Are you sure, You want to "+ delText +" it?"} handleClose={(d)=>{ if(d=="YES") {onEdit({type:"DELETE"});} else {setclickedDel(false); setDelText('');}}} />
        </>
    );
};

export default Module;
