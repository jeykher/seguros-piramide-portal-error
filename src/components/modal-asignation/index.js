import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { BlobProvider } from '@react-pdf/renderer';
import PdfDocument from '../pdfView/index';
import { useForm } from 'react-hook-form';
import Dropzone from '../drop-zone';

import './styles.scss';

const ModalAsignation = (props) => {
  const {
    handleClose,
    open,
    errorInfo,
    arrayDepartaments,
    sendMail,
    uploadDocument,
    currentDocuments,
    handleGetDocuments,
  } = props;
  const { register, handleSubmit, reset } = useForm();
  const { areaSelect, setArealSelect } = useState('');
  let blobPDF = null;
  const insuranceCompany = !sessionStorage.getItem('insuranceCompany')
    ? 'PIRAMIDE'
    : sessionStorage.getItem('insuranceCompany');
  const envCompany = !sessionStorage.getItem('environment')
    ? 'CALIDAD'
    : sessionStorage.getItem('environment');
  const classModal =
    insuranceCompany === 'OCEANICA'
      ? 'modal-solution-oceanica '
      : 'modal-solution ';

  const validateInputs = () => {
    let simpleInputs = document.getElementsByClassName('info');
    for (let i = 0; i < simpleInputs.length; i++) {
      if (!simpleInputs[i].value) {
        simpleInputs[i].className += ' invalid';
      }
    }
  };

  const onSubmit = async (params) => {
    validateInputs();
    let UrlLink = sessionStorage.getItem('UrlLink');
    let profile = JSON.parse(sessionStorage.getItem('profile'));
    await Promise.all(
      Object.values(JSON.parse(params.area)).map(async (mail) => {
        const data = {
          Correo_destinatario: mail,
        };

        const dataForm = new FormData();
        const subject = `Asignación de Revisión de error por ${profile.NOMBRE_USUARIO} con el ticket Nro ${errorInfo?.ID_ERROR_LOG}  `;
        const textBody = `${profile.NOMBRE_USUARIO} de ${profile.DEPARTAMENTO} ha Solicitado la revisión del error Nro ${errorInfo?.ID_ERROR_LOG} de la aplicación "${errorInfo?.APPLICATION}".
Para agregar una solución ingrese al siguiente link: ${UrlLink}${errorInfo?.ID_ERROR_LOG}/${insuranceCompany}/${envCompany}/ .
Correo de usuario que asigna Revisión: ${profile.EMAIL_USUARIO}.
Código de usuario: ${profile.CODIGO_USUARIO}
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
        handleClose();
      })
    );

    const upload = await uploadDocument(currentDocuments, errorInfo, 'ASIG');
    if (upload) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className={classModal}>
      <DialogTitle>Asignación Para Revisión</DialogTitle>
      <DialogContent>
        <BlobProvider document={<PdfDocument errorInfo={errorInfo} />}>
          {({ blob, url, loading, error }) => {
            if (loading) {
              return <span>cargando...</span>;
            } else {
              blobPDF = blob;

              return (
                <>
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
                          <option key={index} value={departament.EMAIL}>
                            {departament.AREA_NAME}
                          </option>
                        );
                      })}
                    </select>
                    <textarea
                      {...register('solution')}
                      className="info textAreaSolution"
                      placeholder="Nota"
                    />
                    <Dropzone handleGetDocuments={handleGetDocuments} />
                    <div className="container-options">
                      <button type="submit" onClick={validateInputs}>
                        Enviar
                      </button>
                      <div />
                    </div>
                  </form>
                  <div className="container-options container-out-form">
                    <div />
                    <button className="cancel-button" onClick={handleClose}>
                      Cancel
                    </button>
                  </div>
                  <div />
                </>
              );
            }
          }}
        </BlobProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAsignation;
