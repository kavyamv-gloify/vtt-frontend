import React, {useEffect, useState} from 'react';
import {useThemeContext} from '../../../../utility/AppContextProvider/ThemeContextProvider';
import {alpha, Box} from '@mui/material';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {useSelector} from 'react-redux';
const AppLogo = () => {
  const {user} = useAuthUser();
  const [compLogo, setCompLogo] = useState('');
  const companyName = useSelector(({settings}) => settings.company_name);
  useEffect(() => {
    const dd = setInterval(() => {
      let tem = localStorage.getItem('COMPANY_LOGO');
      if (tem) {
        setCompLogo(tem);
        clearInterval(dd);
      }
    }, 1000);
  }, [companyName]);

  return (
    <Box
      sx={{
        height: {xs: 56, sm: 70},
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
          height: {xs: 40, sm: 45},
        },
      }}
      className='app-logo'
    >
      {compLogo && companyName && companyName?.split('++')?.[0] != 'undefined' && (
        <>
          {(user?.userList?.tanentId || user?.userList?.corporateId) &&
          compLogo ? (
            <img src={compLogo} alt='CORP_LOGO' style={{maxHeight: '50px'}} />
          ) : null}
          {/* {(user?.userList?.tanentId || user?.userList?.corporateId) && (
            <div style={{marginLeft: '15px'}}>
              <p style={{fontSize: '18px', fontWeight: 600}}>
                {companyName?.split('++')?.[0]}
              </p>
              <p>{companyName?.split('++')?.[1]}</p>
            </div>
          )} */}
        </>
      )}
    </Box>
  );
};

export default AppLogo;
