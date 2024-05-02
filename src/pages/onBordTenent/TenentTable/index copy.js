import React, {useEffect, useState} from 'react';
import OrderTable from './TenentTable';
import AppsContainer from '@crema/core/AppsContainer';
// import { useIntl } from 'react-intl';
import {useDispatch} from 'react-redux';
import {getRecentOrders} from 'redux/actions';
import {Hidden} from '@mui/material';
import _ from '@lodash';
// import AppsHeader from '@crema/core/AppsContainer/AppsHeader';
import AppsContent from '@crema/core/AppsContainer/AppsContent';
import AppsPagination from '@crema/core/AppsPagination';
import Box from '@mui/material/Box';
import AppInfoView from '@crema/core/AppInfoView';
import AppsFooter from '@crema/core/AppsContainer/AppsFooter';
// import AppSearchBar from '@crema/core/AppSearchBar';

const Orders = () => {
  // const { messages } = useIntl();
  const dispatch = useDispatch();
  const recentOrders = [];
  // [
  //   { "id": 1, "first_name": "Eilis", "last_name": "Warbeys", "email": "ewarbeys0@ucsd.edu", "gender": "Genderqueer", "ip_address": "179.104.25.43" },
  //   { "id": 2, "first_name": "Billy", "last_name": "Wylam", "email": "bwylam1@wunderground.com", "gender": "Genderfluid", "ip_address": "169.2.179.25" },
  //   { "id": 3, "first_name": "Jamima", "last_name": "Fraczek", "email": "jfraczek2@dyndns.org", "gender": "Genderqueer", "ip_address": "243.27.54.231" },
  //   { "id": 4, "first_name": "Flinn", "last_name": "O'Looney", "email": "folooney3@xrea.com", "gender": "Agender", "ip_address": "142.59.33.239" },
  //   { "id": 5, "first_name": "Gran", "last_name": "Clague", "email": "gclague4@apple.com", "gender": "Agender", "ip_address": "209.164.225.157" },
  //   { "id": 6, "first_name": "Ludovico", "last_name": "Piesing", "email": "lpiesing5@tuttocitta.it", "gender": "Male", "ip_address": "7.14.75.176" },
  //   { "id": 7, "first_name": "Durante", "last_name": "Daft", "email": "ddaft6@netscape.com", "gender": "Genderqueer", "ip_address": "14.92.223.133" },
  //   { "id": 8, "first_name": "Aggi", "last_name": "Glandfield", "email": "aglandfield7@istockphoto.com", "gender": "Female", "ip_address": "103.208.128.36" },
  //   { "id": 9, "first_name": "Conan", "last_name": "D'Avaux", "email": "cdavaux8@stanford.edu", "gender": "Genderfluid", "ip_address": "90.141.44.134" }
  // ];
  // useSelector(({ ecommerce }) => ecommerce.recentOrders);
  const orderCount = recentOrders.length;

  const [page, setPage] = useState(0);
  // const [search, setSearchQuery] = useState('');

  const onPageChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    dispatch(getRecentOrders('', page));
  }, [dispatch, page]);

  // const onSearchOrder = (e) => {
  //   setSearchQuery(e.target.value);
  //   setPage(0);
  // };
  return (
    <>
      <AppsContainer
        title={_.isEmpty(recentOrders) ? 'No Records Found' : 'Records Found'}
        fullView
      >
        {/* <AppsHeader>
          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            width={1}
            justifyContent='space-between'
          >
            {setSearchQuery('')}
            <AppSearchBar
              iconPosition='right'
              overlap={false}
              onChange={(event) => onSearchOrder(event.target.value)}
              placeholder={messages['common.searchHere']}
            />
            <Box display='flex' flexDirection='row' alignItems='center'>
              <Button id='btnMui123' variant='contained' color='primary'>
                Add Order
              </Button>

              <Hidden smDown>
                <AppsPagination
                  rowsPerPage={10}
                  count={orderCount}
                  page={page}
                  onPageChange={onPageChange}
                />
              </Hidden>
            </Box>
          </Box>
        </AppsHeader> */}

        <AppsContent
          sx={{
            paddingTop: 2.5,
            paddingBottom: 2.5,
          }}
        >
          <OrderTable orderData={recentOrders} />
        </AppsContent>
        <AppsFooter>
          <Box display='flex' flexDirection='row' alignItems='center'>
            <Hidden smDown>
              <AppsPagination
                rowsPerPage={10}
                count={orderCount}
                page={page}
                onPageChange={onPageChange}
              />
            </Hidden>
          </Box>
        </AppsFooter>
      </AppsContainer>
      <AppInfoView />
    </>
  );
};

export default Orders;
