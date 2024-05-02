import React, {useEffect, useState} from 'react';
import List from '@mui/material/List';
import routesConfig from '../../../../../pages/routesConfig';
import NavVerticalGroup from './VerticalNavGroup';
import VerticalCollapse from './VerticalCollapse';
import VerticalItem from './VerticalItem';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {useSelector} from 'react-redux';

const VerticalNav = () => {
  const {user} = useAuthUser();
  const clickedSOS = useSelector(({settings}) => settings.clickedSOS);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const [moduleArr, setModuleArr] = useState([]);
  const [subModuleArr, setSubModuleArr] = useState([]);
  useEffect(() => {
    let arr = [];
    let subarr = [];
    permissionCheck?.map((el) => {
      if (!arr.includes(el.moduleName)) arr.push(el.moduleName);
      if (!subarr.includes(el.subModuleName)) subarr.push(el.subModuleName);
    });
    setModuleArr([...arr]);
    setSubModuleArr([...subarr]);
  }, [permissionCheck]);
  return (
    <List
      sx={{
        position: 'relative',
        padding: 0,
      }}
      component='div'
    >
      {user?.userList?.userStatus != 'DEFAULT' &&
        routesConfig.map((item) => (
          <React.Fragment key={item.id}>
            {item.type === 'group' && (
              <NavVerticalGroup item={item} level={0} />
            )}
            {item.type === 'collapse' &&
              (item.permittedRole != 'ALL' ||
                (moduleArr.includes(item.module) &&
                  (user?.userList?.isImpersonate !== 'NO' ||
                    (user?.userList?.userRole != 'SUPERADMIN' &&
                      user?.userList?.userRole != 'TANENTADMIN')))) && (
                <VerticalCollapse
                  item={item}
                  level={0}
                  subModuleArr={subModuleArr}
                />
              )}
            {item.type === 'item' &&
              (item.messageId == 'Home' ||
                item.permittedRole != 'ALL' ||
                (moduleArr.includes(item.module) &&
                  user?.userList?.isImpersonate !== 'NO')) && (
                <>
                  {((user?.userList?.isImpersonate == 'TANENT' &&
                    item.id == 'onboardCorporates') ||
                    item.id != 'onboardCorporates' ||
                    user?.userList?.userRole == 'TANENTADMIN') && (
                    <VerticalItem item={item} level={0} />
                  )}
                </>
              )}
          </React.Fragment>
        ))}
    </List>
  );
};

export default VerticalNav;
