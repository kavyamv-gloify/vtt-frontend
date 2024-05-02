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
import Api from '@api';
import PopEdit from '@editpopup';


const CreateForm = ({id,popBTNClick,openDialog}) => {
    const navigate = useNavigate();
    const [showbtn, setshowbtn] = React.useState(true);
    const [open, setOpen] = useState()
    const [defVal, setdefVal] = useState()
    const [vehicle, setVehicle] = useState();   
    const [snackbarMsg, setsnackBarMsg] = useState();
    const [vehicleList, setVehicleList]= useState();
    const {user}= useAuthUser();
    const tanentId = user?.userList?.tanentId
    // const [showbtn, setshowbtn] = useState(true);
    // useEffect(() => {
    //     async function fetchData() {
    //       // const baseURL = `http://180.151.3.104:9000/user-reg/vehicletype/getallvehicletype`;
    //       const baseURL= `${api.masterVehicletype.list}`
    //       let response = await axios.get(`${baseURL}`);
    //       let temp = []
    //     if (response?.data?.data?.length) {
    //         response.data.data?.map((id) =>{
    //         temp.push({ title: id?.vehicleType +'-' + id?.vehicleOccupancy, value: id?.vehicleType });
    //         // setOccupancy(id?.vehicleOccupancy)
    //       }        
    //       )
    //     }
    //     setVehicle(temp);
    
    //     }
    
    //     fetchData();
    //   }, []);

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

    
    useEffect(()=>{
        if(!id){return;}
        axios.get(Api?.baseUri+'/user-reg/vehicletypecost/'+id).then(res=>{
            setdefVal(res?.data?.data);
        }).catch(err=>{

        })
    },[id])
    // const [showbtn, setshowbtn] = useState(true);
    let template = {
        layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
        title: 'Vehicle Cost',
        description: 'Form for applying Job',
        // sections: [
        //     {
                layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
                id: 'personal_information',
                fields: [
    
                    {
                        type: 'autocomplete',
                        name: 'vehicleType',
                        id: 'vehicleType',
                        title: 'Vehicle Type',
                        validationProps: {
                          required: 'This is a mandatory field'
                        },
                        options: vehicleList??[],
                      },
                    {
                        type: 'text',
                        name: 'capacity',
                        id: 'capacity',
                        title: "Capacity",
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
                        pattern: {
                            value: regex.numReg,
                            message: 'Please enter  valid Cost/Km'
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
                        pattern: {
                            value: regex.numReg,
                            message: 'Please enter valid Extra Km Charge'
                        },
                        validationProps: {
                            required: 'This is a mandatory field'
                        }
                    },
    
                
                ]
        //     },
        // ]
    };
    


    const handleSubmit = async (values) => {
        if(values?.close){ popBTNClick(false); return }
        setshowbtn(false);
        setshowbtn(false)
        if (values.button.toUpperCase() === "UPDATE") {
            let dataSet = {};
            dataSet = values.data
            axios.put(api?.baseUri+'/user-reg/vehicletypecost/updatevehicletypecost', dataSet).then((response) => {
                if (response?.data?.status == "200") {
                    // navigate('/onboardCorporate/vehiclecost/vehiclecost-listing')`
                    toast.success(response?.data?.message ?? "Created successfully");
                    popBTNClick(false);
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
            {defVal?.id && vehicleList?.length && 
            <PopEdit
            title={defVal?.vehicleType}
            poptemplate={template}
            defaultValues={defVal}
            openDialog={openDialog}
            showbtn={showbtn}
            buttons={['Update']}
            popAction={handleSubmit}
            />}
            {/* <SnackbarCustom BooleanValue={boolean} open={open} onChange={handleChange}>{snackbarMsg}</SnackbarCustom> */}

        </>
    );
};

export default CreateForm;