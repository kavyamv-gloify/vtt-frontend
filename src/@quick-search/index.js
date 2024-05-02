import {TextField, CircularProgress} from '@mui/material';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Api from '@api';
import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';

const QuickSearchPage = ({
  searchClicked,
  setFilterRes,
  masterKey,
  filterRes,
  displayFields,
  module,
  getFilterData,
  role,
  tenantId,
}) => {
  const wrapperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [myDropDown, setMyDropDown] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [searchedDataByObj, setSearchedDataByObj] = useState({});
  const [loading, setLoading] = useState(false);

  const debounceOnChange = useRef(_.debounce(onChange, 500)).current;
  const getFinalDataDebounce = useRef(_.debounce(getFinalData, 500)).current;

  useEffect(() => {
    if (!filterRes) setInputVal('');
  }, [filterRes]);

  useEffect(() => {
    if (!inputVal) {
      setTimeout(() => {
        getFilterData();
      }, 2000);
    }
  }, [inputVal]);
  async function getFinalData(dd) {
    let _t = dd?.trim()?.split(',');
    if (!dd) {
      getFilterData();
    }
    if (!_t.length) return;
    // let api_url = 'http://localhost:3000/api/dashboard/employee/search';
    let api_url = '/api/dashboard/employee/search';
    let tem_obj = searchedDataByObj;
    await Promise.all(
      _t?.map(async (_ele) => {
        if (_ele && !tem_obj[_ele]) {
          let post_obj = {
            collection: module,
            search: _ele,
            pageNo: 1,
            pageSize: 50,
          };
          let post_obj_role = {
            collection: module,
            search: _ele,
            tenantId: tenantId,
            pageNo: 1,
            pageSize: 50,
          };
          // let res = await axios.post(api_url, post_obj);
          let res = await axios.post(
            // api_url,
            Api.baseUri + api_url,
            role == 'CORPORATE' ? post_obj_role : post_obj,
          );
          if (res?.data?.data?.length) {
            res?.data?.data?.map((_elm) => {
              tem_obj[_elm[masterKey]] = _elm;
            });
          }
        }
      }),
    );
    let t_arr = [];
    setSearchedDataByObj(tem_obj);

    _t?.map((_el, ind) => {
      if (tem_obj[_el]) t_arr.push(tem_obj[_el]);
    });
    setFilterRes(t_arr?.length ? [...t_arr] : null);
  }

  function onChange(keyWord) {
    const trimmedValues = keyWord?.trim()?.split(',');

    if (!trimmedValues.length) return;

    // const api_url = 'http://localhost:3000/api/dashboard/employee/search';
    const api_url = '/api/dashboard/employee/search';
    const post_obj_role = {
      search: trimmedValues[trimmedValues.length - 1],
      collection: module,
      tenantId: tenantId,
      pageNo: 1,
      pageSize: 20,
    };
    const post_obj = {
      search: trimmedValues[trimmedValues.length - 1],
      collection: module,
      pageNo: 1,
      pageSize: 20,
    };

    setLoading(true);

    axios
      .post(
        // api_url,
        Api.baseUri + api_url,
        role == 'CORPORATE' ? post_obj_role : post_obj,
      )
      // .post(api_url, post_obj)
      .then((res) => {
        setMyDropDown(res?.data.data || []);
      })
      .catch(() => {
        setMyDropDown([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  return (
    <div style={{width: '100%', position: 'relative'}} ref={wrapperRef}>
      {searchClicked && (
        <>
          <TextField
            style={{marginTop: '5px'}}
            onClick={() => {
              setIsVisible(true);
            }}
            id='full-width-text-field'
            placeholder='Please type here'
            margin='normal'
            size='small'
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);

              if (e.target.value?.at(-1) === ',') {
                getFinalDataDebounce(e.target.value);
              }

              if (!e.target.value) {
                setFilterRes(null);
              }

              const t_arr = [];
              e.target.value?.split(',')?.forEach((el, i) => {
                if (
                  i + 1 === e.target.value?.split(',')?.length &&
                  el?.trim()
                ) {
                  t_arr.push(el);
                  debounceOnChange(el);
                } else {
                  setMyDropDown(null);
                }
              });
            }}
            fullWidth
            InputProps={{
              autoComplete: 'off',
              endAdornment: (
                <CloseIcon
                  className='pointer'
                  style={{fontSize: '14px'}}
                  onClick={() => {
                    // getFilterData();
                    setFilterRes(null);
                    setInputVal('');
                    setMyDropDown(null);
                  }}
                />
              ),
            }}
          />
          {isVisible && (
            <div className='quick-suggestions-parent'>
              {loading ? (
                <div className='child' style={{textAlign: 'center'}}>
                  {/* <CircularProgress size={20} /> */}
                  Loading...
                </div>
              ) : myDropDown && myDropDown?.length ? (
                myDropDown.map((ele) => (
                  <div
                    key={ele[masterKey]}
                    className='child'
                    // onClick={() => {
                    //   const tem = inputVal?.split(',');
                    //   if (!tem.includes(ele[masterKey]))
                    //     tem.push(ele[masterKey]);

                    //   setInputVal(tem.join(','));
                    //   getFinalDataDebounce(tem.join(','));
                    //   setMyDropDown(null);
                    //   setIsVisible(false);
                    // }}
                    onClick={() => {
                      let tem = inputVal?.split(',');
                      tem.splice(-1);
                      if (!tem.includes(ele[masterKey]))
                        tem.push(ele[masterKey]);
                      setInputVal(tem.join(','));
                      getFinalDataDebounce(tem.join(','));
                      setMyDropDown(null);
                      setIsVisible(false);
                    }}
                  >
                    {displayFields ? (
                      <>
                        {displayFields?.map((el, ind) => (
                          <span key={ind}>
                            {(ind === 0 || el === 'lastName' ? '' : ' - ') +
                              ele[el] +
                              ' '}
                          </span>
                        ))}
                      </>
                    ) : (
                      <span>{ele?.employeeCode + ' - ' + ele[masterKey]}</span>
                    )}
                  </div>
                ))
              ) : (
                myDropDown !== null && (
                  <div className='child'>No Record Found</div>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuickSearchPage;
