import React from 'react';

import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export const ExportCSV = ({csvData, fileName}) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  const fileExtension = '.xlsx';

  const exportToCSV = (csvData, fileName) => {
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
  };

  return (
    <FileDownloadIcon
      className='pointer'
      onClick={(e) => exportToCSV(csvData, fileName)}
    />
  );
};
