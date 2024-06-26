import React from 'react';
import AppCard from '@crema/core/AppCard';
import {useIntl} from 'react-intl';
import AppSelect from '@crema/core/AppSelect';
import OrderTable from './OrderTable';
import PropTypes from 'prop-types';

const RecentOrders = ({recentOrders}) => {
  const {messages} = useIntl();
  const handleSelectionType = (data) => {};
  return (
    <AppCard
      contentStyle={{px: 0}}
      title={messages['eCommerce.recentOrders']}
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
      <OrderTable orderData={recentOrders} />
    </AppCard>
  );
};

export default RecentOrders;

RecentOrders.propTypes = {
  recentOrders: PropTypes.array,
};
