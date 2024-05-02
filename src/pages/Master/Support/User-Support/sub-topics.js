import React, {useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {IoMdInformationCircleOutline} from 'react-icons/io';
import axios from 'axios';
import Api from '@api';
import {useNavigate} from 'react-router-dom';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Account = ({TabVal}) => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [topicList, settopicList] = React.useState();
  useEffect(() => {
    axios
      ?.get(Api?.support?.getSubtopicbyTopicid + TabVal?.id + '/helpid')
      .then((res) => {
        settopicList(res?.data?.data ?? []);
      })
      .catch((err) => {
        settopicList(res?.data?.data ?? []);
      });
  }, [TabVal]);
  // const tabs = [
  //   {id: 1, icon: <BiUser />, name: <IntlMessages id='common.personalInfo' />},
  //   {
  //     id: 2,
  //     icon: <AiOutlineLock />,
  //     name:"",
  //   },
  //   {
  //     id: 3,
  //     icon: <IoMdInformationCircleOutline />,
  //     name: <IntlMessages id='common.information' />,
  //   },
  //   {
  //     id: 4,
  //     icon: <IoShareSocialOutline />,
  //     name: <IntlMessages id='common.social' />,
  //   },
  //   {
  //     id: 5,
  //     icon: <NotificationsNoneIcon />,
  //     name: <IntlMessages id='healthCare.notification' />,
  //   },
  // ];

  const onTabsChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <h2 style={{padding: '4px 0px 13px 24px'}}>
        {TabVal?.name?.trim()?.length > 60
          ? TabVal?.name?.trim()?.slice(0, 60) + '...'
          : TabVal?.name}
      </h2>
      {topicList?.map((tab, index) => (
        <Tab
          className='account-tab'
          label={
            tab?.subTopicName?.trim()?.length > 60
              ? tab?.subTopicName?.trim()?.slice(0, 60) + '...'
              : tab?.subTopicName
          }
          icon={<ArrowRightIcon style={{position: 'relative', top: '-2px'}} />}
          onClick={() => {
            navigate('/user/support-faq/' + window.btoa(tab?.id + '>>OTHER'));
          }}
          key={index}
          {...a11yProps(index)}
        />
      ))}
    </>
  );
};

export default Account;
