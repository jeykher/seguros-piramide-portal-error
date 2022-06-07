import react, { useContext, useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';

const ModalAccept = (props) => {
  const {
    handleClickOpenAccept,
    handleCloseAccept,
    handleCloseConfirm,
    open,
    title,
    subtitle
  } = props;
  const insuranceCompany = sessionStorage.getItem('insuranceCompany');
  const classModal =
    insuranceCompany === 'OCEANICA'
      ? 'modal-solution-oceanica '
      : 'modal-solution ';


  return (
    <Dialog
      open={open}
      onClose={handleCloseAccept}
      className={`${classModal}  modal-confirm modal-accept`}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{subtitle}</p>
        <div className="container-buttons">
          <button onClick={handleCloseConfirm}>Aceptar</button>
          <button className="cancel-button" onClick={handleCloseAccept}>
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAccept;
