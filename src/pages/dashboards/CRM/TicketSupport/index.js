import React from 'react';
import TicketSupportTable from './TicketSupportTable';
import PropTypes from 'prop-types';
import AppCard from '@crema/core/AppCard';
import {useIntl} from 'react-intl';

const TicketSupport = (props) => {
  const {ticketSupportData} = props;
  const {messages} = useIntl();

  return (
    <AppCard
      contentStyle={{px: 0}}
      title={props.title}
      action={messages['common.viewAll']}
    >
      <TicketSupportTable ticketSupportData={ticketSupportData} />
    </AppCard>
  );
};

export default TicketSupport;

TicketSupport.defaultProps = {
  ticketSupportData: [],
};

TicketSupport.propTypes = {
  ticketSupportData: PropTypes.array,
};
