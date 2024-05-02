// import {Dialog, DialogContent, DialogTitle, Typography} from '@mui/material';
// import React, {useState} from 'react';
// import CloseIcon from '@mui/icons-material/Close';
// import Api from '@api';
// import {Document, Page, pdfjs} from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const Upload = ({setOpenView, obj}) => {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   function onDocumentLoadSuccess({numPages}) {
//     setNumPages(numPages);
//   }

//   return (
//     <div>
//       <Dialog
//         open={true}
//         onClose={() => {
//           setOpenView(false);
//         }}
//       >
//         <DialogTitle
//           style={{background: '#f5f2f2', padding: '20px 55px 13px 15px'}}
//         >
//           <Typography
//             component='h2'
//             variant='h2'
//             sx={{mb: 3, fontWeight: 600}}
//             id='alert-dialog-title'
//           >
//             {obj.title}
//           </Typography>
//           <CloseIcon
//             onClick={() => {
//               setOpenView(false);
//             }}
//             style={{position: 'absolute', right: '12px', top: '14px'}}
//           />
//         </DialogTitle>
//         <DialogContent
//           sx={{color: 'text.secondary', fontSize: 14, width: '800px'}}
//           id='alert-dialog-description'
//         >
//           <iframe
//             title='PDF Viewer'
//             src={Api.imgUrl + obj.doc}
//             width='100%'
//             height='600px' // Set the height as needed
//             style={{border: 'none'}}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Upload;

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
} from '@mui/material';
import React, {useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Api from '@api';
import {Document, Page, pdfjs} from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Upload = ({setOpenView, obj}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  function onDocumentLoadSuccess({numPages}) {
    setNumPages(numPages);
  }

  function showButtons() {
    setIsHovered(true);
  }

  function hideButtons() {
    setIsHovered(false);
  }

  function prevPage() {
    setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
  }

  function nextPage() {
    setPageNumber((prevPage) => Math.min(prevPage + 1, numPages));
  }

  return (
    <div>
      <Dialog
        open={true}
        maxWidth='false'
        PaperProps={{sx: {width: 'auto'}}}
        onClose={() => {
          setOpenView(false);
        }}
      >
        <DialogTitle
          style={{background: '#f5f2f2', padding: '10px 51px 0px 15px'}}
        >
          <Typography
            component='h2'
            variant='h2'
            sx={{mb: 3, fontWeight: 600}}
            id='alert-dialog-title'
          >
            {obj.title}
          </Typography>
          <CloseIcon
            onClick={() => {
              setOpenView(false);
            }}
            style={{position: 'absolute', right: '12px', top: '14px'}}
          />
        </DialogTitle>
        <DialogContent
          sx={{
            color: 'text.secondary',
            fontSize: 14,
            width: '100%',
            // height: '800px', // Set a fixed height for the container
            overflow: 'hidden', // Hide overflow content
            position: 'relative',
          }}
          id='alert-dialog-description'
        >
          <div onMouseEnter={showButtons} onMouseLeave={hideButtons}>
            <Document
              file={Api.imgUrl + obj.doc}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div>Loading...</div>}
            >
              <Page pageNumber={pageNumber} height={1000}  />
            </Document>
            {isHovered && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  width:"80%"
                }}
              >
                <IconButton onClick={prevPage}>
                  <ArrowBackIcon />
                </IconButton>
                <IconButton onClick={nextPage}>
                  <ArrowForwardIcon />
                </IconButton>
                <Typography variant='body2'>
                  Page {pageNumber} of {numPages}
                </Typography>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Upload;
