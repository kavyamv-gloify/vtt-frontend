import React, { useEffect, useState } from 'react';
import styles from './TicketContent.module.css';
import TextsmsIcon from '@mui/icons-material/Textsms';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import axios from 'axios';
import Api from '@api';
import { useAuthUser } from '@crema/utility/AuthHooks';
const TicketContent = () => {
    const [ticketStatus, setTicketStatus] = useState();
    const {user} = useAuthUser();
console.log("profile ID",user?.userList?.profileId)
    // https://uatapi.etravelmate.com/user-reg/incident-management/get-incident-management-by-pendingWith/65af8897f3c7413aefeaa477
    useEffect(() => {
        axios
          .get(`${Api.baseUri}/user-reg/incident-management/get-incident-management-by-pendingWith/${user?.userList?.profileId}`)
          .then((res) => {
            if (res?.data?.status == '200') {
              const filter = res.data?.data.filter((el) => !!el.statusType);
              setTicketStatus(filter);
            }
          })
          .catch((err) => {
            setTicketStatus([]);
          });
      }, [user?.userList?.profileId]);
console.log("ticketStatusqqqqqqqqqqqqq", ticketStatus)
    return (
        <>
            <div className={styles.ParentContainer}>
                <div className={styles.content}>
                    <TextsmsIcon />
                    <div className={styles.para}>
                        <div className={styles.paracontent}>
                            <h4>I had an issue with the cab quality
                                I had an issue with the cab quality
                                I had an issue with the cab quality
                                I had an issue with the cab quality
                            </h4>
                        </div>
                        <div className={styles.iconsdiv}>
                            <div className={styles.idicon}>
                                <div className={styles.bookIcon}>
                                    <ImportContactsIcon />
                                </div>
                                <span>T1D2215478</span>
                            </div>
                            <div className={styles.dateContent}>
                                <span>Sun,</span>
                                <span>Jul,</span>
                                <span>17</span>
                                <span>09:03 AM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TicketContent