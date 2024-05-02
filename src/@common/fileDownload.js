import {useRef} from 'react';
import axios from 'axios';
import api from '@api';
import _ from '@lodash';
import Api from '@api';
import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
class downDoc {
  static async downloadReport(csvData, fileName) {
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const fileExtension = '.xlsx';

    let sheetName = [];
    let xl_data = {};
    Object.keys(csvData)?.map((el) => {
      sheetName.push(el);
      xl_data[el] = XLSX.utils.json_to_sheet(csvData[el]);
    });

    const wb = {Sheets: xl_data, SheetNames: sheetName};

    const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});

    const data = new Blob([excelBuffer], {type: fileType});

    FileSaver.saveAs(data, fileName + fileExtension);
  }
  static async downloadDoc(ur) {
    if (!ur) {
      return;
    }
    axios
      .post(Api?.file?.filedownload, {fileurl: ur}, {responseType: 'blob'})
      .then((blob) => {
        const url = window.URL.createObjectURL(blob.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = ur;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
  static async openDoc(ur) {
    if (!ur) {
      return;
    }
    axios
      .post(Api?.file?.filedownload, {fileurl: ur}, {responseType: 'blob'})
      .then((blob) => {
        const url = window.URL.createObjectURL(blob.data);
        window.open(url, '_blank');
      });
  }
  static async compareTime(date, time, type) {
    let temp_date1 = date;
    temp_date1.setHours(0, 0, 0, 0);
    let temp_date2 = new Date();
    temp_date2.setHours(0, 0, 0, 0);
    if (temp_date2 < temp_date1) {
      return true;
    } else if (temp_date1?.toString() == temp_date2?.toString()) {
      if (!time || time?.toUpperCase()?.trim() == 'OFF') {
        return false;
      }
      function diff_minutes(dt2, dt1) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return diff;
      }
      let dt2 = new Date();
      let dt1 = date;
      dt1.setHours(time?.split(':')[0], time?.split(':')[1], 0, 0);
      if (type == 'LOGIN_MODIFY') {
        if (
          rosterSettings?.allowDailyChanges?.toUpperCase()?.trim() == 'YES' &&
          Number(rosterSettings?.loginModifyCutoffTimeinMinutes) <
            diff_minutes(dt1, dt2)
        ) {
          return true;
        } else {
          return false;
        }
      } else if (type == 'LOGOUT_MODIFY') {
        if (
          rosterSettings?.allowDailyChanges?.toUpperCase()?.trim() == 'YES' &&
          Number(rosterSettings?.logoutModifyCutoffTimeinMinutes) <
            diff_minutes(dt1, dt2)
        ) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }
}

export default downDoc;
