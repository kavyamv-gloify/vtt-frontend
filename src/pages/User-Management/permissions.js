import * as React from 'react';
import PropTypes from 'prop-types';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import AppTooltip from '@crema/core/AppTooltip';
import Checkbox from '@mui/material/Checkbox';
import CustomLabel from 'pages/common/CustomLabel';
import IconButton from '@mui/material/IconButton';
import {visuallyHidden} from '@mui/utils';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Grid,
  TextField,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import Api from '../../@api';
import _ from 'lodash';
import {toast} from 'react-toastify';
import {useParams} from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import EmpList from './empList';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'calories';
const DEFAULT_ROWS_PER_PAGE = 100;

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
    moduleName,
    selModuleBased,
    listByModule,
  } = props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };

  return (
    <TableHead sx={{background: '#f1f1f1'}}>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={
              selModuleBased[moduleName]?.length > 0 &&
              selModuleBased[moduleName]?.length <
                listByModule[moduleName]?.length
            }
            checked={
              listByModule[moduleName]?.length > 0 &&
              listByModule[moduleName]?.length ===
                selModuleBased[moduleName]?.length
            }
            onChange={(e) => {
              onSelectAllClick(e, moduleName);
            }}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    rows,
    selected,
    numSelected,
    roleList,
    roleVal,
    setRoleVal,
    selectedActions,
    id,
  } = props;

  return (
    <Toolbar
      sx={{
        pl: {sm: 2},
        textAlign: 'right',
        pr: {xs: 1, sm: 1},
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
      <Grid
        container
        spacing={2}
        className='sticky-container'
        style={{background: 'transparent'}}
      >
        <Grid item xs={6}>
          <Autocomplete
            id='tags-outlined'
            options={roleList || []}
            value={roleVal}
            onChange={(e, v, r) => {
              setRoleVal(v);
            }}
            getOptionLabel={(option) => option.title}
            sx={{width: '100%'}}
            // value={driverVal || null}
            // onChange={(event, value) => setDriverVal(value)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label={'Select Role'}
                fullWidth
              />
            )}
          />
        </Grid>
      </Grid>
      {numSelected > 0 ? (
        <Typography
          sx={{flex: '1 1 100%'}}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{flex: '1 1 100%'}}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          {/* Nutrition */}
        </Typography>
      )}

      {numSelected > 0 ? (
        <AppTooltip title='Save'>
          <IconButton disabled={_.isEmpty(selectedActions) || !roleVal?.value}>
            <SaveIcon
              onClick={() => {
                // let t_d = [{moduleId:'', moduleName:'', subModuleId:'', subModuleName: '', actions: [{'action1' : 'YES', 'action4': 'NO'}]}]
                let arr = [];
                rows?.map((el) => {
                  if (selected?.includes(el?.id)) {
                    arr.push({
                      moduleId: el?.moduleId,
                      moduleName: el?.moduleName,
                      subModuleId: el.id,
                      subModuleName: el.subModuleName,
                      actions: selectedActions[el.subModuleName],
                    });
                  }
                });
                let postData = {
                  roleId: roleVal?.value,
                  roleCode: roleVal?.roleCode,
                  roleName: roleVal?.title,
                  roleFor: roleVal?.roleFor,
                  corporateId: id, //Write here
                  permissions: arr,
                };
                axios
                  .post(
                    Api.baseUri +
                      '/user-reg/user-permission/save-user-permission',
                    postData,
                  )
                  .then((res) => {
                    if (res?.data?.status == 200) {
                      toast.success('Permission saved successfully.');
                    } else {
                      toast.error(
                        res?.data?.message || 'Something went wrong.',
                      );
                    }
                  })
                  .catch((er) => {
                    toast.error('Something went wrong.');
                  });
              }}
            />
            {/* <Button id='btnMui123' sx={{display:'flex', alignItem:'center', justifyContent: 'center'}}>
                            <SaveIcon/> Save
                        </Button> */}
          </IconButton>
        </AppTooltip>
      ) : (
        <AppTooltip title='Filter list'>
          <IconButton>{/* <FilterListIcon /> */}</IconButton>
        </AppTooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [selModuleBased, setSelModuleBased] = React.useState({});
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [visibleRows, setVisibleRows] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = React.useState(0);
  const [roleList, setRoleList] = React.useState([]);
  const [expanded, setExpanded] = React.useState([]);
  const [roleVal, setRoleVal] = React.useState();
  const [rows, setRows] = React.useState([]);
  const [myActions, setMyActions] = React.useState([]);
  const [listByModule, setListByModule] = React.useState({});
  const [myModule, setMyModule] = React.useState([]);
  const [selectedActions, setselectedActions] = React.useState({});
  const [tabVal, setTabVal] = React.useState(0);
  const {id} = useParams();
  // console.log('roleVal', roleVal);
  const tem_heads = [
    {
      id: 'moduleName',
      numeric: false,
      disablePadding: true,
      label: 'Module Name',
    },
    {
      id: 'subModuleName',
      numeric: false,
      disablePadding: false,
      label: 'Sub-Module Name',
    },
  ];
  const [headCells, setHeadCells] = React.useState(tem_heads);
  React.useEffect(() => {
    if (!roleVal?.roleCode) return;
    axios
      .get(
        Api.baseUri +
          '/user-reg/user-permission/get-all-user-permission-by-corpId/' +
          id +
          '/' +
          roleVal?.roleCode,
      )
      .then((res) => {
        let subMod_arr = [];
        let action_obj = {};
        let modWise_obj = {};
        res?.data?.data?.permissions?.map((el) => {
          modWise_obj[el.moduleName] = modWise_obj[el.moduleName] || [];
          subMod_arr.push(el.subModuleId);
          action_obj[el.subModuleName] = el.actions;
          modWise_obj[el.moduleName].push(el.subModuleId);
        });
        setSelected([...subMod_arr]);
        setselectedActions({...action_obj});
        setSelModuleBased({...modWise_obj});
      })
      .catch((err) => {
        setSelected([]);
      });
  }, [roleVal]);
  React.useEffect(() => {
    let action_arr = [];
    let module_arr = [];
    let action_heads = [];
    axios
      .get(Api.baseUri + '/user-reg/user-sub-module/get-all-user-sub-module')
      .then((res) => {
        setRows(res?.data?.data || []);
        setListByModule({..._.groupBy(res?.data?.data, 'moduleName')});
        res?.data?.data?.map((el) => {
          if (!module_arr?.includes(el?.moduleName)) {
            module_arr.push(el?.moduleName);
          }
          el?.actions?.map((act) => {
            if (!action_arr?.includes(act)) {
              action_arr.push(act);
              action_heads.push({
                id: act,
                numeric: true,
                disablePadding: false,
                label: act,
              });
            }
          });
        });
        setMyActions(action_arr || []);
        setMyModule(module_arr || []);
        setHeadCells([...tem_heads, ...action_heads]);
      })
      .catch((err) => {
        setRows([]);
        setMyActions([]);
      });
  }, []);
  React.useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/user-permission/get-all-user-permission')
      .then((r) => {})
      .catch((e) => {});
    axios
      .get(Api.baseUri + '/user-reg/user-role/getUserRoleByCorporateId/' + id)
      .then((res) => {
        let arr = [
          {
            title: 'CORPORATEADMIN',
            value: 'CORPORATEADMIN',
            roleFor: 'CORPORATEADMIN',
            roleCode: 'CORPORATEADMIN',
          },
          {
            title: 'VENDOR',
            value: 'VENDOR',
            roleFor: 'VENDOR',
            roleCode: 'VENDOR',
          },
          {
            title: 'DRIVER',
            value: 'DRIVER',
            roleFor: 'DRIVER',
            roleCode: 'DRIVER',
          },
          {
            title: 'EMPLOYEE',
            value: 'EMPLOYEE',
            roleFor: 'EMPLOYEE',
            roleCode: 'EMPLOYEE',
          },
          {
            title: 'MANAGER',
            value: 'ROSTERADMIN',
            roleFor: 'ROSTERADMIN',
            roleCode: 'ROSTERADMIN',
          },
        ];
        res?.data?.data?.map((el) => {
          arr.push({
            title: el.roleName,
            value: el.roleName,
            corporateIds: el?.corporateIds,
            roleFor: el.roleFor,
            roleCode: el.roleCode,
          });
        });
        setRoleList(arr);
      })
      .catch((err) => {
        setRoleList([]);
      });
  }, []);

  const driverPermissionArry = [
    'Toll And Parking',
    'Support',
    'Compliance',
    'Driver Attendance',
    'Fuel Tracking',
    'Feedback',
    'Your Rides',
    'Stats',
  ];
  const comnMod = [
    'Compliance',
    'Driver Attendance',
    'Fuel Tracking',
    'Feedback',
    'Leave Management',
  ];
  const employeePermissionArry = [
    'Adhoc TripEmployee',
    'Support',
    'RosterEmployee',
    'Your Rides',
    'Manage Leaves',
    'Training Videos',
  ];
  const ManagerPermissionArry = [
    'Your Rides',
    'RosterManager',
    'Leave Management',
    'Adhoc TripManager',
    'Training Videos',
  ];
  const corporateAdminPermissionArry = [
    'Active Trips',
    'Dashboard',
    'Live Tracking',
    'Master',
    'Adhoc Trip',
    'Roster',
    'Routes',
    'Leave Management',
    'Driver Attendance',
    'Training Videos',
    'Rate Card',
    'Compliance',
    'Reports',
    'Billing',
    'IVR',
    'Invoicing',
    'Feedback',
    'Announcements',
    'Setting',
    'Incident Management',
    'Driver Attandance',
    'Fuel Tracking',
  ];
  const venderPermissionArry = [
    'Active Trips',
    'Taxes',
    'Dashboard',
    // 'Driver Shift',
    'Corporates Billing',
    'Live Tracking',
    'Master',
    'Adhoc Trip',
    'Roster',
    'RoutesVendor',
    'Leave Management',
    'Training Videos',
    'Driver Attendance',
    'Rate Card',
    'Compliance',
    'Reports',
    'IVR',
    'Invoicing',
    'Feedback',
    'Announcements',
    'Setting',
    'Incident Management',
    'Driver Attandance',
    'Fuel Tracking',
  ];
  // const excludedRoles = ['CORPORATEADMIN', 'VENDOR', 'DRIVER', 'EMPLOYEE'];

  React.useEffect(() => {
    let rowsOnMount = stableSort(
      rows,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
    );

    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
    );

    setVisibleRows(rowsOnMount);
  }, [rows]);

  const handleRequestSort = React.useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === 'asc';
      const toggledOrder = isAsc ? 'desc' : 'asc';
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);
      const sortedRows = stableSort(
        rows,
        getComparator(toggledOrder, newOrderBy),
      );
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );
      setVisibleRows(updatedRows);
    },
    [order, orderBy, page, rowsPerPage],
  );

  const handleSelectAllClick = (event, module) => {
    if (module != '-ALL-') {
      let newSelected = [];
      let newSelectedModuleBased = {};
      newSelected = [...selected];
      newSelectedModuleBased = {...selModuleBased};
      if (!newSelectedModuleBased[module]) newSelectedModuleBased[module] = [];
      rows.map((n) => {
        if (event.target.checked) {
          if (n.moduleName == module) {
            if (!newSelectedModuleBased[module]?.includes(n.id))
              newSelectedModuleBased[module] = [
                ...newSelectedModuleBased[module],
                n.id,
              ];
            if (!newSelected.includes(n.id)) newSelected.push(n.id);
          }
        } else {
          if (n.moduleName == module) {
            delete newSelectedModuleBased[module];
            newSelected.splice(newSelected.indexOf(n.id), 1);
          }
        }
      });
      setSelModuleBased(newSelectedModuleBased);
      setSelected(newSelected);
      return;
    }
    // console.log('event.target.checked', event.target.checked);
    if (event.target.checked) {
      const newSelected = [];
      let newSelectedModuleBased = {};
      // console.log('rows', rows);
      rows.map((n) => {
        if (newSelectedModuleBased[n.moduleName])
          newSelectedModuleBased[n.moduleName] = [
            ...newSelectedModuleBased[n.moduleName],
            n.id,
          ];
        else newSelectedModuleBased[n.moduleName] = [n.id];
        if (roleVal?.value == 'EMPLOYEE') {
          if (employeePermissionArry?.includes(n.moduleName)) {
            const exactMatch = employeePermissionArry.some(
              (item) => item === n.moduleName,
            );

            if (exactMatch) {
              newSelected.push(n.id);
            }
            // newSelected.push(n.id);
          }
        } else if (roleVal?.value == 'DRIVER') {
          if (driverPermissionArry?.includes(n.moduleName)) {
            newSelected.push(n.id);
          }
        } else if (roleVal?.value == 'VENDOR') {
          if (venderPermissionArry?.includes(n.moduleName)) {
            newSelected.push(n.id);
          }
        } else if (roleVal?.value == 'ROSTERADMIN') {
          if (ManagerPermissionArry?.includes(n.moduleName)) {
            // const exactMatch = ManagerPermissionArry.some(
            //   (item) => item == n.moduleName,
            // );

            // if (exactMatch) {
            //   newSelected.push(n.id);
            // }
            newSelected.push(n.id);
          }
        } else {
          if (corporateAdminPermissionArry?.includes(n.moduleName)) {
            newSelected.push(n.id);
          }
          // newSelected.push(n.id);
        }
      });
      setSelModuleBased(newSelectedModuleBased);
      setSelected(newSelected);
      return;
    }
    setSelModuleBased({});
    setSelected([]);
  };

  const handleClick = (event, tid, moduleName) => {
    let temp = selected || [];
    let temp_obj = selModuleBased || {};
    temp_obj[moduleName] = temp_obj[moduleName] || [];
    if (temp_obj[moduleName]?.includes(tid))
      temp_obj[moduleName]?.splice(temp_obj[moduleName]?.indexOf(tid), 1);
    else temp_obj[moduleName].push(tid);
    if (temp.includes(tid)) temp.splice(temp.indexOf(tid), 1);
    else temp.push(tid);
    setSelModuleBased({...temp_obj});
    setSelected([...temp]);
  };

  const handleChangePage = React.useCallback(
    (event, newPage) => {
      setPage(newPage);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage,
      );

      setVisibleRows(updatedRows);

      // Avoid a layout jump when reaching the last page with empty rows.
      const numEmptyRows =
        newPage > 0
          ? Math.max(0, (1 + newPage) * rowsPerPage - rows.length)
          : 0;

      const newPaddingHeight = 53 * numEmptyRows;
      setPaddingHeight(newPaddingHeight);
    },
    [order, orderBy, rowsPerPage],
  );

  const handleChangeRowsPerPage = React.useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);

      setPage(0);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage,
      );

      setVisibleRows(updatedRows);

      // There is no layout jump to handle on the first page.
      setPaddingHeight(0);
    },
    [order, orderBy],
  );

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <>
      {/* <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={9}>
          <CustomLabel labelVal='Permissions' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' justifyContent='flex-end'></Box>
        </Grid>
      </Grid> */}
      <Box sx={{width: '100%'}}>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <Tabs
            value={tabVal}
            onChange={(n, v) => {
              setTabVal(v);
            }}
            aria-label='basic tabs example'
          >
            <Tab label='Permissions' value={0} />
            <Tab label='Assign Role' value={1} />
          </Tabs>
        </Box>
        {tabVal === 0 ? (
          <Paper sx={{width: '100%', mb: 2, marginTop: '20px'}}>
            <EnhancedTableToolbar
              rows={rows}
              selected={selected}
              numSelected={selected.length}
              roleList={roleList}
              setRoleVal={setRoleVal}
              roleVal={roleVal}
              selectedActions={selectedActions}
              id={id}
            />
            <Accordion
              expanded={false}
              className='accordion-headings'
              sx={{background: '#f1f1f1'}}
            >
              <AccordionSummary
                style={{margin: 0}}
                expandIcon={<ExpandMoreIcon sx={{opacity: 0}} />}
                aria-controls='d-content'
                id={'d-header-top'}
              >
                <Typography className='permissions-acc-head'>
                  <div>Module Name</div>
                  <div style={{fontSize: '12px', fontWeight: 400}}>
                    {' '}
                    Select All
                    <Checkbox
                      color='primary'
                      indeterminate={
                        selected.length > 0 && selected.length < rows.length
                      }
                      // checked={selected.length === rows.length}
                      onChange={(e) => {
                        handleSelectAllClick(e, '-ALL-');
                      }}
                      inputProps={{
                        'aria-label': 'select all desserts',
                      }}
                    />
                  </div>
                </Typography>
              </AccordionSummary>
            </Accordion>
            {myModule?.map((elm, _ind) => {
              // const isDriver = roleVal?.value === 'DRIVER';
              // const isEmployee = roleVal?.value === 'EMPLOYEE';
              // const isManager = roleVal?.value === 'MANAGER';

              // const commonPermissions = comnMod?.includes(elm);
              // const driverPermissions = driverPermissionArry?.includes(elm);
              // const employeePermissions = employeePermissionArry?.includes(elm);
              // const managerPermissions = ManagerPermissionArry?.includes(elm);

              // const isAllowed =
              //   (commonPermissions && !isEmployee && !isManager && !isDriver) ||
              //   (isDriver && driverPermissions) ||
              //   (!isDriver &&
              //     !isEmployee &&
              //     !isManager &&
              //     !driverPermissions &&
              //     !managerPermissions &&
              //     !employeePermissions) ||
              //   (employeePermissions && isEmployee) ||
              //   (managerPermissions && isManager);
              const isDriver = roleVal?.value === 'DRIVER';
              const isEmployee = roleVal?.value === 'EMPLOYEE';
              const isManager = roleVal?.value === 'ROSTERADMIN';
              const isVendor = roleVal?.value === 'VENDOR';

              let rolePermissions;
              switch (true) {
                case isDriver:
                  rolePermissions = driverPermissionArry;
                  break;
                case isEmployee:
                  rolePermissions = employeePermissionArry;
                  break;
                case isManager:
                  rolePermissions = ManagerPermissionArry;
                  break;
                case isVendor:
                  rolePermissions = venderPermissionArry;
                  break;
                default:
                  rolePermissions = corporateAdminPermissionArry;
              }

              const hasPermission = rolePermissions?.some(
                (item) => item == elm,
              );
              return (
                <>
                  {/* !excludedRoles.includes(roleVal?.value) &&
                    roleList.some((role) => role?.value === roleVal?.value)) ||
                  !roleVal?.value  */}
                  {hasPermission ? (
                    <Accordion
                      expanded={expanded.includes(_ind + 1)}
                      onChange={() => {
                        let array = expanded;
                        if (!array?.includes(_ind + 1)) array.push(_ind + 1);
                        else array.splice(array?.indexOf(_ind + 1), 1);
                        setExpanded([...array]);
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='d-content'
                        id={'d-header' + _ind}
                      >
                        <Typography sx={{width: '70%'}}>{elm}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <>
                          <TableContainer>
                            <Table
                              sx={{minWidth: 750}}
                              aria-labelledby='tableTitle'
                              size={'medium'}
                            >
                              <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                moduleName={elm}
                                selModuleBased={selModuleBased}
                                orderBy={orderBy}
                                headCells={headCells}
                                listByModule={listByModule}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={listByModule[elm]?.length}
                              />
                              <TableBody>
                                {listByModule[elm]?.map((row, index) => {
                                  const isItemSelected = isSelected(row.id);
                                  const labelId = `enhanced-table-checkbox-${index}`;
                                  if (row?.moduleName == elm)
                                    return (
                                      <TableRow
                                        hover
                                        role='checkbox'
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{cursor: 'pointer'}}
                                      >
                                        <TableCell padding='checkbox'>
                                          <Checkbox
                                            color='primary'
                                            onClick={(event) =>
                                              handleClick(event, row.id, elm)
                                            }
                                            checked={isItemSelected}
                                            inputProps={{
                                              'aria-labelledby': labelId,
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell
                                          component='th'
                                          id={labelId}
                                          scope='row'
                                          padding='none'
                                        >
                                          {row.moduleName}
                                        </TableCell>
                                        <TableCell align='left'>
                                          {row.subModuleName}
                                        </TableCell>
                                        {myActions?.map((ele, inde) => {
                                          return (
                                            <TableCell align='left'>
                                              <Checkbox
                                                color='primary'
                                                disabled={
                                                  !row?.actions?.includes(ele)
                                                }
                                                checked={
                                                  selectedActions[
                                                    row.subModuleName
                                                  ]?.includes(ele) == true
                                                    ? true
                                                    : false
                                                }
                                                onChange={(e) => {
                                                  let t_ac =
                                                    selectedActions[
                                                      row.subModuleName
                                                    ] || [];
                                                  if (!t_ac?.includes(ele))
                                                    t_ac.push(ele);
                                                  else
                                                    t_ac.splice(
                                                      t_ac.indexOf(ele),
                                                      1,
                                                    );
                                                  setselectedActions({
                                                    ...selectedActions,
                                                    [row.subModuleName]: t_ac,
                                                  });
                                                }}
                                                inputProps={{
                                                  'aria-labelledby':
                                                    labelId + 'create' + inde,
                                                }}
                                              />
                                            </TableCell>
                                          );
                                        })}
                                      </TableRow>
                                    );
                                })}
                                {paddingHeight > 0 && (
                                  <TableRow
                                    style={{
                                      height: paddingHeight,
                                    }}
                                  >
                                    <TableCell colSpan={6} />
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          {/* <TablePagination
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                                component="div"
                                                count={listByModule[elm]?.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            /> */}
                        </>
                      </AccordionDetails>
                    </Accordion>
                  ) : null}
                </>
              );
            })}
          </Paper>
        ) : (
          <div style={{marginTop: '20px'}}>
            <EmpList cid={id} role='EMPLOYEE' />
          </div>
        )}
      </Box>
    </>
  );
}
