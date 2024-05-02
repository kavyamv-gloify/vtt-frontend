import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartForm from '@smart-form';
import { useAuthUser } from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import { SettingsPowerRounded } from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import { toast } from 'react-toastify';
import { id } from 'date-fns/locale';


const CreateForm = ({ close }) => {
    const navigate = useNavigate();
    const [showbtn, setshowbtn] = React.useState(true);
    const [open, setOpen] = useState()
    const [vehicle, setVehicle] = useState();
    const [snackbarMsg, setsnackBarMsg] = useState();
    // const [showbtn, setshowbtn] = useState(true);
    const [vehicleList, setVehicleList] = useState();
    const { user } = useAuthUser();
    const tanentId = user?.userList?.tanentId

    useEffect(()=>{
        async function getvehicle() {
            let res = await axios.get(`${api.masterVehicletype.listbytanent}/${tanentId}/tanentId?page=0&size=1000`);
            let temp = [];
            res.data?.data?.body["VehicleTypeList"].map((e)=>{
                temp.push({title: e.vehicleType, value: e.vehicleType})
                setVehicleList(temp);
            })
          }
          getvehicle();
    }, [])
    
    

    let template = {
        layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
        // title: 'Vehicle Type Cost',
        description: 'Form for applying Job',
        sections: [
            {
                layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
                id: 'personal_information',
                fields: [

                    {
                        type: 'autocomplete',
                        name: 'vehicleType',
                        id: 'vehicleType',
                        title: 'Vehicle Type',
                        options: vehicleList ?? [],
                        infoMessage: ["Dropdown values are selectable", "e.g.: XUV"],
                        validationProps: {
                            required: 'This is a mandatory field'
                        },

                    },


                    {
                        type: 'text',
                        name: 'capacity',
                        id: 'capacity',
                        title: "Capacity",
                        infoMessage: ["Numeric Characters are allowed", "Maximum length should be 20 characters", "EX: 24"],
                        pattern: {
                            value: regex.numReg,
                            message: 'Please enter  valid Capacity'
                        },
                        validationProps: {
                            required: 'This is a mandatory field'
                        }
                    },
                    {
                        type: 'text',
                        name: 'speed',
                        id: 'speed',
                        title: "Speed",
                        infoMessage: ["Numeric Characters are allowed", "Maximum length should be 20 characters", "EX: 24"],
                        pattern: {
                            value: regex.numReg,
                            message: 'Please enter valid Speed'
                        },
                        validationProps: {
                            required: 'This is a mandatory field'
                        }
                    },

                    {
                        type: 'text',
                        name: 'costKM',
                        id: 'costKM',
                        title: "Cost/Km",
                        infoMessage: ["Numeric Characters are allowed", "Maximum length should be 20 characters", "EX: 24"],
                        pattern: {
                            value: regex.numReg,
                            message: 'Please enter  valid Cost/Km with max 20 characters'
                        },
                        validationProps: {
                            required: 'This is a mandatory field'
                        }
                    },

                    {
                        type: 'text',
                        name: 'costTrip',
                        id: 'costTrip',
                        title: "Trip Cost",
                        infoMessage: ["Numeric Characters are allowed", "Maximum length should be 20 characters", "EX: 24"],
                        pattern: {
                            value: regex.numReg,
                            message: 'Please enter  valid trip Cost'
                        },
                        validationProps: {
                            required: 'This is a mandatory field'
                        }
                    },
                    {
                        type: 'text',
                        name: 'extraKMcharge',
                        id: 'extraKMcharge',
                        title: "Extra Km Charge",
                        infoMessage: ["Numeric Characters are allowed", "Maximum length should be 20 characters", "EX: 24"],
                        pattern: {
                            value: regex.numReg,
                            message: 'Please enter valid Extra Km Charge'
                        },
                        validationProps: {
                            required: 'This is a mandatory field'
                        }
                    },


                ]
            },
        ]
    };



    const handleSubmit = async (values) => {
        setshowbtn(false);
        setshowbtn(false)
        if (values.button.toUpperCase() === "SUBMIT") {
            let dataSet = {};
            dataSet = values.data
            axios.post(api?.baseUri + "/user-reg/vehicletypecost/addvehicletypecost", dataSet).then((response) => {
                if (response?.data?.status == "200") {
                    navigate('/onboardCorporate/vehiclecost/vehiclecost-listing')
                    toast.success("Created successfully");
                    close(false);
                } else {
                    toast.error(response?.data?.message ?? "Something went wrong");
                };
                setshowbtn(true);
            }).catch((er) => {
                setshowbtn(true);
                toast.error("Something went wrong");
            })
        };

    }
    return (
        <>
            {!showbtn ?
                <AppLoader />
                : null}
            <SmartForm
                template={template}
                onSubmit={handleSubmit}
                buttons={['submit']}
            />
            {/* <SnackbarCustom BooleanValue={boolean} open={open} onChange={handleChange}>{snackbarMsg}</SnackbarCustom> */}

        </>
    );
};

export default CreateForm;