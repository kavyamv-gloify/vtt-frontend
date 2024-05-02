import React from 'react';
import AppCard from '@crema/core/AppCard';
import {useIntl} from 'react-intl';
import AppSelect from '@crema/core/AppSelect';
import PatientsTable from './PatientsTable';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
const RecentPatients = ({recentPatients, topHeader, title}) => {
  const {messages} = useIntl();
  const [value, setValue] = React.useState('one');

  const handleSelectionType = (data) => {};

  return (
    <>
      {/* <Box sx={{ width: '100%' }}>

      </Box> */}
      <AppCard
        contentStyle={{px: 0}}
        title={
          topHeader == true ? (
            <Tabs
              value={value}
              textColor='secondary'
              indicatorColor='secondary'
              aria-label='secondary tabs example'
            >
              <Tab
                value='one'
                label='Top Customers'
                onClick={() => {
                  setValue('one');
                }}
              />
              <Tab
                value='two'
                label='Top Vendors'
                onClick={() => {
                  setValue('two');
                }}
              />
              <Tab
                value='three'
                label='Top Drivers'
                onClick={() => {
                  setValue('three');
                }}
              />
            </Tabs>
          ) : (
            title
          )
        }
        action={
          <AppSelect
            menus={[
              messages['dashboard.thisWeek'],
              messages['dashboard.lastWeeks'],
              messages['dashboard.lastMonth'],
            ]}
            defaultValue={messages['dashboard.thisWeek']}
            onChange={handleSelectionType}
          />
        }
      >
        <PatientsTable recentPatients={recentPatients} />
      </AppCard>
    </>
  );
};

export default RecentPatients;
RecentPatients.propTypes = {
  recentPatients: PropTypes.array,
};
