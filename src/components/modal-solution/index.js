import react, { useContext, useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import moment from 'moment-with-locales-es6';
import { BlobProvider } from '@react-pdf/renderer';
import PdfDocument from '../pdfViewSolution/index';
import { useForm } from 'react-hook-form';
import Dropzone from '../drop-zone';

import './styles.scss';

const ModalSolution = (props) => {
  const {
    handleClose,
    open,
    InsertSolutionById,
    errorInfo,
    arrayDepartaments,
    currentDocuments,
    sendMail,
    handleGetDocuments,
  } = props;
  const { register, handleSubmit, reset } = useForm();
  const { areaSelect, setArealSelect } = useState('');
  const insuranceCompany = !sessionStorage.getItem('insuranceCompany')
    ? 'PIRAMIDE'
    : sessionStorage.getItem('insuranceCompany');
  const classModal =
    insuranceCompany === 'OCEANICA'
      ? 'modal-solution-oceanica '
      : 'modal-solution ';
  const envCompany = !sessionStorage.getItem('environment')
    ? 'CALIDAD'
    : sessionStorage.getItem('environment');
  let blobPDF = null;

  const validateInputs = () => {
    let simpleInputs = document.getElementsByClassName('info');
    for (let i = 0; i < simpleInputs.length; i++) {
      if (!simpleInputs[i].value) {
        simpleInputs[i].className += ' invalid';
      }
    }
  };

  const onSubmit = (params) => {
    const data = {
      idError: errorInfo?.ID_ERROR_LOG,
      solutions: params.solution,
      area: params.area,
      mail: params.area?.EMAIL,
      code: errorInfo.EXCEPTION_CODE,
      applicationMessage: errorInfo.APPLICATION_MESSAGE,
    };
    reset();
    if (params.area != 'FUNC') {
      sendMailSolution(arrayDepartaments[3].EMAIL);
    }
    InsertSolutionById(data, handleClose, currentDocuments, errorInfo);
  };

  const sendMailSolution = async (departamentFuntional) => {
    let UrlLink = sessionStorage.getItem('UrlLink');
    await Promise.all(
      Object.values(JSON.parse(departamentFuntional)).map(async (mail) => {
        const data = {
          Correo_destinatario: mail,
        };

        const dataForm = new FormData();
        const subject = `Solución de error`;
        const textBody = `Se ha solucionado el error Nro ${errorInfo?.ID_ERROR_LOG} de la aplicación "${errorInfo?.APPLICATION}".
Para revisar dicha solución acceda al siguiente link: ${UrlLink}${errorInfo?.ID_ERROR_LOG}/${insuranceCompany}/${envCompany}/ .
Se adjunta más detalles referentes a dicho error.`;
        dataForm.append(
          'pdfFile',
          blobPDF,
          `error${errorInfo?.ID_ERROR_LOG}.pdf`
        );
        dataForm.append(
          'email_info',
          JSON.stringify({ ...data, subject: subject, text: textBody })
        );
        await sendMail(dataForm);
      })
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={`${classModal}  modal-solution`}
    >
      <DialogTitle>Agregar Solución</DialogTitle>
      <DialogContent>
        <BlobProvider document={<PdfDocument errorInfo={errorInfo} />}>
          {({ blob, url, loading, error }) => {
            if (loading) {
              return <span>cargando...</span>;
            } else {
              blobPDF = blob;

              return (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <select
                    {...register('area')}
                    className="info"
                    value={areaSelect}
                    onChange={setArealSelect}
                    required
                  >
                    <option value="">Seleccione Área</option>
                    {arrayDepartaments?.map((departament, index) => {
                      return (
                        <option key={index} value={departament.COD_AREA}>
                          {departament.AREA_NAME}
                        </option>
                      );
                    })}
                  </select>

                  <textarea
                    {...register('solution')}
                    required
                    minLength="20"
                    className="info textAreaSolution"
                    placeholder="Solución"
                  />
                  <Dropzone handleGetDocuments={handleGetDocuments} />
                  <div className="container-options">
                    <button type="submit" onClick={validateInputs}>
                      Enviar
                    </button>
                    <div />
                  </div>
                </form>
              );
            }
          }}
        </BlobProvider>
        <div className="container-options container-out-form">
          <div />
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
        </div>
        <div />
      </DialogContent>
    </Dialog>
  );
};

export default ModalSolution;
