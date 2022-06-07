import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useBackdrop } from '../../context/Backdrop';

export default function SimpleBackdrop() {

    const {open} = useBackdrop()

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex:  "999999999999 !important" }}
        open={open}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" sx={{ color: '#fff', zIndex:  "999999999999 !important" }}/>
      </Backdrop>
    </div>
  );
}
