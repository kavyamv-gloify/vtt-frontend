import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CustomLabel from 'pages/common/CustomLabel';
// import {useNavigate} from 'react-router-dom';
const MasterModule = () => {
  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    height: 'auto',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: '40px',
    // background: 'white',
    // backgroundColor: isHover ? '#f5f5f5' : 'white',
    borderRadius: '20px',
    boxShadow: '0px 4px 10px -2px rgba(0, 0, 0, 0.07);',
    border: '1px solid #ECECEC',
  }));
  const navigate = useNavigate();
  const data = [
    {title: 'Employees', image: '/assets/images/employee.svg'},
    {title: 'Shifts', image: '/assets/images/Shifts.svg'},
    {
      title: 'Departments',
      image: '/assets/images/Departments.svg',
    },
    {
      title: 'Business Unit',
      image: '/assets/images/BussinesUnit.svg',
    },
    {title: 'Vendors', image: '/assets/images/Vendors.svg'},
    {title: 'Drivers', image: '/assets/images/Drivers.svg'},
    {title: 'Vehicles', image: '/assets/images/Vehicle.svg'},
    {title: 'Vehicles Driver GPS Mapping', image: '/assets/images/Vehicle.svg'},
    {title: 'Manage Holidays', image: '/assets/images/Holidays.svg'},
    {title: 'Nodal Point', image: '/assets/images/NodalPoints.svg'},
    {title: 'Employee Category', image: '/assets/images/EmployeeCategory.svg'},
    {title: 'Escort', image: '/assets/images/Escortss.svg'},
    {title: 'Escort Agency', image: '/assets/images/EscortAgency.svg'},
    {title: 'Site Office', image: '/assets/images/Siteoffice.svg'},
    {title: 'Special Employee', image: '/assets/images/Special-employee.svg'},
    {title: 'Penalty', image: '/assets/images/Penalty.svg'},
    {title: 'Vehicle Variant', image: '/assets/images/VehicleVariant.svg'},
    // {title: 'GPS Vendors', image: '/assets/images//NodalPoints.svg'},
    // {title: 'GPS List', image: '/assets/images//NodalPoints.svg'},
    // {title: 'GPS Listsssss', image: '/assets/images//NodalPoints.svg'},
  ];
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={9}>
          <CustomLabel labelVal='Master' variantVal='h3-underline' />
        </Grid>
      </Grid>

      <Grid container spacing={6} sx={{padding: '20px', bcakground: 'white'}}>
        {data?.map((el) => {
          return (
            <Grid
              item
              md={2.4}
              sm={4}
              className='cursor'
              xs={6}
              onClick={() => {
                if (el?.title == 'Employees') {
                  navigate('/onboardCorporate/employee/employee-listing');
                }
                if (el?.title == 'Shifts') {
                  navigate('/onboardCorporate/shift/shift-listing');
                }
                if (el?.title == 'Departments') {
                  navigate('/onboardCorporate/department/department-listing');
                }
                if (el?.title == 'Business Unit') {
                  navigate('/onbordTenent/BussinessUnit/table');
                }
                if (el?.title == 'Vendors') {
                  navigate('/onboardadmin/vendor/vendor-listing/Def');
                }
                if (el?.title == 'Drivers') {
                  navigate('/onboardadmin/driver/driver-listing/Def');
                }
                if (el?.title == 'Vehicles') {
                  navigate('/onboardadmin/vehicle/vehicle-listing/Def');
                }
                if (el?.title == 'Vehicles Driver GPS Mapping') {
                  navigate('/onboardadmin/vehicle/vehicle-driver-gps-mapping');
                }
                if (el?.title == 'Manage Holidays') {
                  navigate('/onboardCorporate/holiday/holiday-listing');
                }
                if (el?.title == 'Nodal Point') {
                  navigate('/onbordTenent/NodelPoint/table');
                }
                if (el?.title == 'Employee Category') {
                  navigate(
                    '/onboardCorporate/employee-category/employee-category-table',
                  );
                }
                if (el?.title == 'Escort') {
                  navigate('/onboardadmin/escort/escort-listing');
                }
                if (el?.title == 'Escort Agency') {
                  navigate('/onboardCorporate/escort-agency/agency-listing');
                }
                if (el?.title == 'Site Office') {
                  navigate('/onbordCorporate/siteOffice/siteoffice-listing');
                }
                if (el?.title == 'Special Employee') {
                  navigate(
                    '/onboardCorporate/special-employee/specialemployee-listing',
                  );
                }
                if (el?.title == 'Penalty') {
                  navigate('/onboardCorporate/penalty/penalty-listing');
                }
                if (el?.title == 'Vehicle Variant') {
                  navigate('/Master/vehicleType/table');
                }
                // if (el?.title == 'GPS Vendors') {
                //   navigate('/Master/Gps-Vendor/list');
                // }
                if (el?.title == 'GPS List') {
                  navigate('/Master/Gps-list/list');
                }
              }}
            >
              <Item
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    background: '#f8f8f8',
                    width: '100px',
                    aspectRatio: '1 / 1',
                    // height: '100px',
                    borderRadius: '50%',
                    // width: '100%',
                    margin: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // position: 'relative',
                  }}
                >
                  {el?.image ? (
                    <img
                      src={el?.image}
                      style={
                        {
                          // position: 'absolute',
                          // marginLeft: '-26px',
                          // marginTop: '20px',
                        }
                      }
                    />
                  ) : (
                    el?.icon
                  )}
                </div>
                <p
                  style={{
                    fontSize: '18px',
                    fontFamily: 'Roboto',
                    color: '#000',
                    fontWeight: '600',
                    fontStyle: 'normal',
                    marginTop: '10px',
                  }}
                >
                  {el?.title}
                </p>
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default MasterModule;
