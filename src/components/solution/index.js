import react, { useContext, useEffect, useState } from 'react';
import ModalConfirm from '../modal-confirm';
import './styles.scss';

const SolutionPage = (props) => {
  const {
    handleClickOpen,
    ontop,
    solutionInfo,
    updateSolutionStatus,
    id,
    handleClickOpenAsingation,
    errorInfo,
    updateAttention
  } = props;
  const [open, setOpen] = useState(false);
  const insuranceCompany = sessionStorage.getItem('insuranceCompany');

  useEffect(() => {}, []);

  const handleClickOpenConfirm = () => {
    setOpen(true);
  };

  const handleUpdateAttention = () => {
    let profile = JSON.parse(sessionStorage.getItem('profile'));
    const status = errorInfo.REVIEW_STATUS==="N"?"S":"N"
    let params = {
      p_id_error_log : errorInfo.ID_ERROR_LOG,
      p_status : status,
      p_cod_user: profile.NOMBRE_USUARIO
    }
    updateAttention(params)
    ontop()
  };


  const handleCloseConfirm = () => {
    setOpen(false);
  };
  return (
    <div className="solution-container">
      <ModalConfirm
        handleClickOpenConfirm={handleClickOpenConfirm}
        handleCloseConfirm={handleCloseConfirm}
        open={open}
        title="Cerrar Caso"
        subtitle="¿Está seguro de cerrar el caso?"
        updateSolutionStatus={updateSolutionStatus}
        errorInfo={errorInfo}
        ontop={ontop}
      />
      <div className="info-error">
        {solutionInfo?.length !== 0 ? (
          <label
            className="title-container-info"
            style={{
              borderBottom:
                insuranceCompany === 'OCEANICA'
                  ? 'solid 2px #47C0B6'
                  : 'solid 2px #CC2229',
            }}
          >
            Solución:
          </label>
        ) : null}
        {solutionInfo?.map((solution, index) => {
          return (
            <div key={index} className="info-solution">
              <p>{solution.SOLUTIONS}</p>
              <p>
                <label>Área:</label> {solution?.AREA}.
              </p>
              <p>
                <label>Fecha:</label> {solution?.DATE_SOLUTION}.
              </p>
            </div>
          );
        })}
        {(errorInfo?.ATTENTION_STATUS === 'N' || errorInfo?.ATTENTION_STATUS === 'R') ? (
          sessionStorage.getItem('sesion') === 'loged' ? (
            <div className="container-options">
              <button
                style={{
                  backgroundColor:
                    insuranceCompany === 'OCEANICA' ? '#47C0B6' : '#CC2229',
                }}
                onClick={handleClickOpen}
              >
                Solucionar
              </button>
              <button
                style={{
                  backgroundColor:
                    insuranceCompany === 'OCEANICA' ? '#47C0B6' : '#CC2229',
                }}
                onClick={handleClickOpenConfirm}
              >
                Cerrar Caso
              </button>
              <button
                className={errorInfo.REVIEW_STATUS==="N"?"":" button-attention"}
                style={{
                  backgroundColor:
                    insuranceCompany === 'OCEANICA' ? '#47C0B6' : '#CC2229',
                }}
                onClick={handleUpdateAttention}
              >
                {errorInfo.REVIEW_STATUS==="N"?"Atender Caso":"Cancelar Atención"}
              </button>
              <button
                style={{
                  backgroundColor:
                    insuranceCompany === 'OCEANICA' ? '#47C0B6' : '#CC2229',
                }}
                onClick={handleClickOpenAsingation}
              >
                Reasignar
              </button>
            </div>
          ) : (
            <div className="container-options">
              <h4 style={{ color: 'gray' }}>Inicie Sesión</h4>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default SolutionPage;
