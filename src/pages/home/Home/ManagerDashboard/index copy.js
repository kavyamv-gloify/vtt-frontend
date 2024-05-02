import { defaultFormat } from 'moment';
import React, {useEffect} from 'react';
import { useAuthUser } from '@crema/utility/AuthHooks';
import TripBox from './TripBox/Trip';
import ServicesBox from '../Common Component/Services/Services';
import RequestBoxes from './Request Box/index'
import Slider from './ShiftCard/carousel';
import { useNavigate } from 'react-router-dom';
const Employeedashboard=()=>{
    const {user}= useAuthUser();
    const navigate = useNavigate()
    useEffect(() => { if (user?.userList?.userStatus == "DEFAULT") { navigate('/my-profile'); } }, [user?.userList?.userStatus])
    function rosterChecked(d) { }
    return(
        <>
        <Slider rosterChecked={rosterChecked} />
        <TripBox/>
        {/* <ServicesBox/> */}
        <RequestBoxes/>
        </>
    )
}

export default Employeedashboard;