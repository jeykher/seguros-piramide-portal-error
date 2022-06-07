import react, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { useForm } from 'react-hook-form';
import moment from 'moment-with-locales-es6';
import './styles.scss';
import { DataServicesContext } from '../../context/servicesContext/servicesContext';
import NotResult from '../not-result';
import SolutionPage from '../solution';
import ModalSolution from '../modal-solution';
import ModalAsignation from '../modal-asignation';
import ModalAccept from '../modal-accept';
import ImageDownload from '../../assets/download.png';
import ImageDelete from '../../assets/iconsdelete.png';
import backButton from '../../assets/icons8-back-48.png';
import IconPlus from '../../assets/plus.png';
import TableListErrors from '../table-list-errors';
import { useParams, useLocation, useHistory } from 'react-router';

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [openAsignation, setOpenAsignation] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [nameFile, setNameFile] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState(null);
  const [currentDocuments, setCurrentDocument] = useState([]);
  const [statusFile, setStatusFile] = useState('');

  const {
    getErrorByID,
    errorInfo,
    arrayValues,
    arrayKeys,
    solutionInfo,
    getSolutionsById,
    InsertSolutionById,
    getDepartamentByArea,
    arrayDepartaments,
    getAllStatusErros,
    countErrors,
    cleanError,
    paramString,
    flagParams,
    getAllErrorsByStatus,
    listErrors,
    flagStatus,
    updateSolutionStatus,
    sendMail,
    documentsErrorsArray,
    deleteDocument,
    uploadDocument,
    updateAttention
  } = useContext(DataServicesContext);
  const { register, handleSubmit } = useForm();

  const insuranceCompany = sessionStorage.getItem('insuranceCompany');

  const colorSecondaryBackground =
    insuranceCompany === 'OCEANICA'
      ? 'button-pendientes-oceanica '
      : ' button-pendientes ';

  const colorBackground =
    insuranceCompany === 'OCEANICA'
      ? ' active-button-oceanica '
      : ' active-button';

  const colorPrimaryBackground =
    insuranceCompany === 'OCEANICA'
      ? ' button-solventados-oceanica '
      : ' button-solventados ';

  const colorTertiaryBackground =
    insuranceCompany === 'OCEANICA'
      ? ' button-terceario-oceanica '
      : ' button-terceario-piramide ';

  let history = useHistory();

  const { idError } = useParams();
  let location = useLocation();
  const validateInputs = () => {
    let simpleInputs = document.getElementsByClassName('info');
    for (let i = 0; i < simpleInputs.length; i++) {
      if (!simpleInputs[i].value) {
        simpleInputs[i].className += ' invalid';
      }
    }
  };

  const handleGetDocuments = (documentData) => {
    setCurrentDocument(documentData);
  };

  const handleAllErrorsByStatus = (type) => {
    setItemOffset(0)
    setCurrentItems(null)
    setPageCount(0)
    getAllErrorsByStatus(type)
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenAsingation = () => {
    setOpenAsignation(true);
  };

  const handleCloseAsignation = () => {
    setOpenAsignation(false);
  };

  const handleClickOpenAccept = (event) => {
    let filename = event.target.files[0]?.name;
    const auxArray = [];
    auxArray.push(event.target.files[0]);
    const label = 'Agregar documento ' + filename;
    if (window.confirm(label) == true) {
      uploadDocument(auxArray, errorInfo, event.target.name);
    } else {
      const text = 'You canceled!';
    }

    // setNameFile(filename)
    // setOpenAccept(true);
  };

  const handleCloseAccept = () => {
    document.getElementById('inputFileId').value = '';
    setOpenAccept(false);
  };

  const setBack = () => {
    if (idError) {
      history.push('/gestionerror360/');
    }
    cleanError();
  };

  const onSubmit = (data) => {
    validateInputs();
    getErrorByID(data.numberTicket);
  };

  useEffect(() => {
    moment.locale('es');
    getDepartamentByArea();
    getAllStatusErros();
    getAllErrorsByStatus('N');
    if (idError) {
      getErrorByID(idError);
    }
  }, []);

  const ontop = () => {
    window.scrollTo(0, 0);
  };

  const DeleteDocument = (document) => {
    const params = {
      p_id_document: document.ID_DOCUMENT,
      errorId: document.ID_ERROR,
      errorStrapiId: document.ID_DOCUMENT_STRAPI,
    };
    const label =
      'Esta seguro que desea eliminar el documento: ' + document.DOCUMENT_NAME;
    if (window.confirm(label) == true) {
      deleteDocument(params);
    } else {
      const text = 'You canceled!';
    }
  };  
  return (
    <div className="container-home">
      <a name="top" />
      <ModalSolution
        handleGetDocuments={handleGetDocuments}
        handleClickOpen={handleClickOpen}
        ontop={ontop}
        sendMail={sendMail}
        arrayDepartaments={arrayDepartaments}
        errorInfo={errorInfo}
        InsertSolutionById={InsertSolutionById}
        handleClose={handleClose}
        open={open}
        currentDocuments={currentDocuments}
      />

      <ModalAsignation
        handleGetDocuments={handleGetDocuments}
        handleClickOpen={handleClickOpenAsingation}
        ontop={ontop}
        arrayDepartaments={arrayDepartaments}
        errorInfo={errorInfo}
        handleClose={handleCloseAsignation}
        open={openAsignation}
        sendMail={sendMail}
        uploadDocument={uploadDocument}
        currentDocuments={currentDocuments}
      />

      <ModalAccept
        handleClickOpenAccept={handleClickOpenAccept}
        handleCloseAccept={handleCloseAccept}
        open={openAccept}
        title="Subir archivo"
        subtitle={
          '¿Está seguro que desea subir el archivo ' + nameFile + ' al caso?'
        }
      />

      <div className="header-options">
        <div className="container-header-buttons">
          <div
            className={
              flagStatus === 'N'
                ? ` ${colorSecondaryBackground} ${colorBackground} `
                : ` ${colorSecondaryBackground} ${colorBackground}`
            }
            onClick={() => handleAllErrorsByStatus('N')}
          >
            <label>Pendientes</label>
            <h1>{countErrors?.TOTAL_ERRORS_PEND}</h1>
          </div>
          <div
            className={
              flagStatus != 'N'
                ? ` ${colorPrimaryBackground}  `
                : ` ${colorPrimaryBackground} `
            }
            onClick={() => handleAllErrorsByStatus('R')}
          >
            <label>En Revisión</label>
            <h1>{countErrors?.TOTTAL_ERRORS_REVIEW}</h1>
          </div>
          <div
            className={
              flagStatus != 'N'
                ? ` ${colorTertiaryBackground}  `
                : ` ${colorTertiaryBackground} `
            }
            onClick={() => handleAllErrorsByStatus('S')}
          >
            <label>Solventados</label>
            <h1>{countErrors?.TOTTAL_ERRORS_SOLVED}</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register('numberTicket')}
            required
            className="info"
            placeholder="Número de Ticket"
            type="number"
          />
          <button
            type="submit"
            style={{
              backgroundColor:
                insuranceCompany === 'OCEANICA' ? '#47C0B6' : '#CC2229',
            }}
            onClick={validateInputs}
          >
            BUSCAR TICKET
          </button>
        </form>
      </div>
      
      {errorInfo === 'empty' ? (
        <NotResult setBack={setBack} />
      ) : (
        <>
          <div className="container-info-error">
            {errorInfo?.ERROR_DATE ? (
              <>
              {errorInfo?.REVIEW_STATUS==="S"?
                <div
                  className="info-error alert-info blink_me"
                  style={{
                    border:
                      insuranceCompany === 'OCEANICA'
                        ? 'solid 2px #47C0B6'
                        : 'solid 2px #CC2229',
                  }}
                >
                  <h1
                    style={{
                      color:
                        insuranceCompany === 'OCEANICA' ? '#47C0B6' : '#CC2229',
                    }}
                  >
                    En Revisión
                  </h1>
                  <p>
                    Este error esta siendo atendido por el usuario:{' '}
                    <label
                      style={{
                        color:
                          insuranceCompany === 'OCEANICA'
                            ? '#47C0B6'
                            : '#CC2229',
                      }}
                    >
                      {errorInfo?.COD_USER}
                    </label>
                  </p>
                </div>
                :null}
                <div className="info-error">
                  <div className="backbutton" onClick={setBack}>
                    <img src={backButton} />
                    Regresar
                  </div>
                  <label
                    className="title-container-info"
                    style={{
                      borderBottom:
                        insuranceCompany === 'OCEANICA'
                          ? 'solid 2px #47C0B6'
                          : 'solid 2px #CC2229',
                    }}
                  >
                    Fecha de Error:
                  </label>
                  <p>{moment(errorInfo?.ERROR_DATE).format('lll')}</p>
                </div>
                <div className="info-error">
                  <label
                    className="title-container-info"
                    style={{
                      borderBottom:
                        insuranceCompany === 'OCEANICA'
                          ? 'solid 2px #47C0B6'
                          : 'solid 2px #CC2229',
                    }}
                  >
                    #TICKET:
                  </label>
                  <p className="aplication-code">{errorInfo.ID_ERROR_LOG}</p>
                </div>
                <div className="info-error">
                  <label
                    className="title-container-info"
                    style={{
                      borderBottom:
                        insuranceCompany === 'OCEANICA'
                          ? 'solid 2px #47C0B6'
                          : 'solid 2px #CC2229',
                    }}
                  >
                    Usuario:
                  </label>
                  <p className="aplication-code">{errorInfo.ERROR_USER}</p>
                </div>
                <div className="info-error">
                  <label
                    className="title-container-info"
                    style={{
                      borderBottom:
                        insuranceCompany === 'OCEANICA'
                          ? 'solid 2px #47C0B6'
                          : 'solid 2px #CC2229',
                    }}
                  >
                    Aplicación:
                  </label>
                  <p className="aplication-code">{errorInfo.APPLICATION}</p>
                </div>
              </>
            ) : null}
            {errorInfo?.EXCEPTION_MESSAGE ? (
              <div className="info-error">
                <label
                  className="title-container-info"
                  style={{
                    borderBottom:
                      insuranceCompany === 'OCEANICA'
                        ? 'solid 2px #47C0B6'
                        : 'solid 2px #CC2229',
                  }}
                >
                  Mensaje de Error:
                </label>
                <p>{errorInfo?.EXCEPTION_MESSAGE}</p>
              </div>
            ) : null}
            {errorInfo?.JSON_PARAMS_TRANSACTION ? (
              <>
                <div className="info-error">
                  <label
                    className="title-container-info"
                    style={{
                      borderBottom:
                        insuranceCompany === 'OCEANICA'
                          ? 'solid 2px #47C0B6'
                          : 'solid 2px #CC2229',
                    }}
                  >
                    Parámetros de Entrada:
                  </label>
                  {flagParams === 'modeJson' ? (
                    arrayKeys.map((entrada, index) => {
                      return (
                        <div key={index} className="item-parametro">
                          <p className="name-param">{entrada}:</p>
                          {arrayValues[index] === '' ? (
                            <p className="value-param">""</p>
                          ) : (
                            <p className="value-param">{arrayValues[index]}</p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="item-parametro">
                      <p className="value-param-string">{paramString}</p>
                    </div>
                  )}
                </div>

                {documentsErrorsArray?.length > 0 ? (
                  <div className="info-error">
                    <label
                      className="title-container-info"
                      style={{
                        borderBottom:
                          insuranceCompany === 'OCEANICA'
                            ? 'solid 2px #47C0B6'
                            : 'solid 2px #CC2229',
                      }}
                    >
                      Evidencia de Error:
                    </label>
                    <div>
                      <div className="container-upload">
                        <h4>Archivos</h4>
                        <label class="custom-file-upload">
                          <input
                            id="inputFileId"
                            name="ASIG"
                            onChange={handleClickOpenAccept}
                            type="file"
                          />
                          <img src={IconPlus} />
                        </label>
                      </div>
                      <ul className="container-files-links">
                        {documentsErrorsArray?.map((document, index) => {
                          return (
                            <>
                              {document.STATUS === 'ASIG' && (
                                <li key={index}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      gridGap: '5px',
                                      marginBottom: '10px',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <a href={document.DOCUMENT} target="_blank">
                                      {document.DOCUMENT_NAME}
                                      <img
                                        className="icon-dowload"
                                        src={ImageDownload}
                                      />
                                    </a>
                                    <img
                                      className="image-delete"
                                      onClick={() => DeleteDocument(document)}
                                      src={ImageDelete}
                                    />
                                  </div>
                                </li>
                              )}
                            </>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ) : null}
                {documentsErrorsArray?.length > 0 ? (
                  <div className="info-error">
                    <label
                      className="title-container-info"
                      style={{
                        borderBottom:
                          insuranceCompany === 'OCEANICA'
                            ? 'solid 2px #47C0B6'
                            : 'solid 2px #CC2229',
                      }}
                    >
                      Evidencia de Solución:
                    </label>
                    <div>
                      <div className="container-upload">
                        <h4>Archivos</h4>
                        <label class="custom-file-upload">
                          <input
                            name="SOLUTION"
                            onChange={handleClickOpenAccept}
                            type="file"
                          />
                          <img src={IconPlus} />
                        </label>
                      </div>
                      <ul className="container-files-links">
                        {documentsErrorsArray?.map((document, index) => {
                          return (
                            <>
                              {document.STATUS === 'SOLUTION' && (
                                <li key={index}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      gridGap: '5px',
                                      marginBottom: '10px',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <a href={document.DOCUMENT} target="_blank">
                                      {document.DOCUMENT_NAME}
                                      <img
                                        className="icon-dowload"
                                        src={ImageDownload}
                                      />
                                    </a>
                                    <img
                                      className="image-delete"
                                      onClick={() => DeleteDocument(document)}
                                      src={ImageDelete}
                                    />
                                  </div>
                                </li>
                              )}
                            </>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}

            {solutionInfo != null ? (
              <SolutionPage
                handleClickOpen={handleClickOpen}
                getSolutionsById={getSolutionsById}
                solutionInfo={solutionInfo}
                handleClose={handleClose}
                updateSolutionStatus={updateSolutionStatus}
                id={errorInfo?.ID_ERROR_LOG}
                ontop={ontop}
                errorInfo={errorInfo}
                handleClickOpenAsingation={handleClickOpenAsingation}
                handleCloseAsignation={handleCloseAsignation}
                updateAttention={updateAttention}
              />
            ) : null}
          </div>
          {listErrors?.length > 0 && !errorInfo?.ERROR_DATE ? (
            <TableListErrors
              itemsPerPage={10}
              items={listErrors}
              getErrorByID={getErrorByID}
              getAllErrorsByStatus={getAllErrorsByStatus}
              pageCount={pageCount}
              setPageCount={setPageCount}
              itemOffset={itemOffset}
              setItemOffset={setItemOffset}
              currentItems={currentItems}
              setCurrentItems={setCurrentItems}
              ontop={ontop}
              flagStatus={flagStatus}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default HomePage;
