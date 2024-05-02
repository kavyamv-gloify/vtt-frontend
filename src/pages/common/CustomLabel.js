import React from 'react'
import { Typography } from '@mui/material';

const CustomLabel = (props) => {
  
  return (
    <>
    {props.variantVal?
      <>
        {props.variantVal === 'h3-underline'?
        <>
          <Typography variant="h3" className='service-label' gutterBottom >
            {props.labelVal}
          </Typography>
          <hr style={styles.hr} />
        </>
        : null
        }
        {props.variantVal === 'h3'?
        <Typography variant="h3" className='service-label' gutterBottom >
        {props.labelVal}
        </Typography>
        : null
        }
      </>
    :null
    }
    
       
    </>
  )
}
const styles = {
  h3underline:{
    fontWeight: "bold",
    marginBottom: "12px",
    marginTop: "4vh",
    paddingBottom: "3px",
    borderBottom: "4px solid orange",
    width: "fit-content"
  },
  h3:{
    fontWeight: "bold",
    marginBottom: "12px",
    marginTop: "4vh",
  },
  hr:{
    background: 'orange',
    color: 'orange',
    borderColor: 'orange',
    border: "2px solid orange",
    borderRadius: "5px",
    width: "38px",
  }
  
}

export default CustomLabel;