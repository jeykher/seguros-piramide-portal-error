import react, { useContext, useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';

const ModalConfirm = (props) => {
  const {
    handleCloseConfirm,
    open,
    ontop,
    title,
    subtitle,
    updateSolutionStatus,
    errorInfo,
  } = props;
  const insuranceCompany = sessionStorage.getItem('insuranceCompany');
  const classModal =
    insuranceCompany === 'OCEANICA'
      ? 'modal-solution-oceanica '
      : 'modal-solution ';

  const confirmUpdate = () => {
    updateSolutionStatus(
      errorInfo.ID_ERROR_LOG, "S"
    );
    ontop()
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseConfirm}
      className={`${classModal}  modal-confirm`}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{subtitle}</p>
        <div className="container-buttons">
          <button onClick={confirmUpdate}>Aceptar</button>
          <button className="cancel-button" onClick={handleCloseConfirm}>
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirm;
