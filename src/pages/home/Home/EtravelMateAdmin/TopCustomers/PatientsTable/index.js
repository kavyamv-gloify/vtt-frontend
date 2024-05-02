import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import PropTypes from 'prop-types';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import AppTableContainer from '@crema/core/AppTableContainer';

const CropheaderData = [
  {label: 'Customer'},
  {label: 'City'},
  {label: 'Regular Trips'},
  {label: 'Adhoc Trips'},
  {label: 'Billing Type'},
  {label: 'Net Revenue'},
  {label: 'Vendors'},
  {label: 'Employees'},
  {label: 'Status'},
];
const VendorheaderData = [
  {label: 'Vendor'},
  {label: 'City'},
  {label: 'No.Drivers'},
  {label: 'No.Vehicles'},
  {label: 'Trips'},
  {label: 'Customer Names'},
  {label: 'Earnings'},
  {label: 'Vendor rating'},
  {label: 'Status'},
];
const driverheaderData = [
  {label: 'Driver'},
  {label: 'City'},
  {label: 'Trips'},
  {label: 'Vendor'},
  {label: 'Corporate'},
  {label: 'avgRating'},
  {label: 'Status'},
];

const generateHeaderData = (tab) => {
  const headerDataMap = {
    one: CropheaderData,
    two: VendorheaderData,
    three: driverheaderData,
  };
  return headerDataMap[tab] || CropheaderData;
};

const PatientsTable = ({recentPatients = [], tab = 'one'}) => {
  let sortedPatients = [];
  let cellConfig = {};

  if (tab === 'one') {
    sortedPatients = [...recentPatients].sort((a, b) => {
      const totalTripsA =
        Number(a?.totalRegTripCount ?? 0) + Number(a?.totalAdhocTripCount ?? 0);
      const totalTripsB =
        Number(b?.totalRegTripCount ?? 0) + Number(b?.totalAdhocTripCount ?? 0);
      return totalTripsB - totalTripsA;
    });
    cellConfig = {
      name: 'name',
      cells: [
        {id: 'name'}, // {id: 'city', link: '/customer-page', style: {color: 'inherit'}},
        {id: 'city'},
        {id: 'totalRegTripCount'},
        {id: 'totalAdhocTripCount'},
        {id: 'billType'},
        {id: 'netRevenue'},
        {id: 'totalvendor'},
        {id: 'totalEmp'},
        {id: 'status', style: {color: 'inherit'}},
      ],
    };
  } else if (tab === 'two') {
    sortedPatients = [...recentPatients].sort((a, b) => {
      const totalTripsForVendorA = Number(a?.totalTripsForVendor ?? 0);
      const totalTripsForVendorB = Number(b?.totalTripsForVendor ?? 0);
      return totalTripsForVendorB - totalTripsForVendorA;
    });
    cellConfig = {
      name: 'vendorName',
      cells: [
        {id: 'vendorName'},
        {id: 'vendorCity'},
        {id: 'noOfDriverForVendor'},
        {id: 'noOfVehicleForVendor'},
        {id: 'totalTripsForVendor'},
        {id: 'customerNames'},
        {id: 'earnings'},
        {id: 'vendorRating'},
        {id: 'vendorStatus'},
      ],
    };
  } else if (tab === 'three') {
    sortedPatients = [...recentPatients].sort((a, b) => {
      const totalTripsForVendorA = Number(a?.totalTripCount ?? 0);
      const totalTripsForVendorB = Number(b?.totalTripCount ?? 0);
      return totalTripsForVendorB - totalTripsForVendorA;
    });
    cellConfig = {
      name: 'name',
      cells: [
        {id: 'driverName'},
        {id: 'city'},
        {id: 'totalTripCount'},
        {id: 'vendorName'},
        {id: 'corporateName'},
        {id: 'avgRating'},
        {id: 'status', style: {color: 'inherit'}},
      ],
    };
  }

  return (
    <AppTableContainer>
      <Table className='table'>
        <TableHead>
          <TableHeading headerData={generateHeaderData(tab)} />
        </TableHead>
        <TableBody>
          {sortedPatients.map((data) => (
            <TableItem data={data} key={data?.id} cellConfig={cellConfig} />
          ))}
        </TableBody>
      </Table>
    </AppTableContainer>
  );
};

PatientsTable.propTypes = {
  recentPatients: PropTypes.array,
  tab: PropTypes.string,
};

export default PatientsTable;
