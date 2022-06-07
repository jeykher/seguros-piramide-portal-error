import React, { createContext, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../routes/axiosConfig';
import { useBackdrop } from '../Backdrop';
import { useLocation } from 'react-router';

export const DataServicesContext = createContext();

export const ServicesContext = ({ children }) => {
  let location = useLocation();
  let insuranceCompanyPatch;
  let envCompanyPatch;

  switch (true) {
    //ROUTES PARAMS COMPANY
    case location.pathname.indexOf('PIRAMIDE') != -1:
      insuranceCompanyPatch = 'PIRAMIDE';
      sessionStorage.setItem('insuranceCompany', 'PIRAMIDE');
      break;
    case location.pathname.indexOf('OCEANICA') != -1:
      insuranceCompanyPatch = 'OCEANICA';
      sessionStorage.setItem('insuranceCompany', 'OCEANICA');
      break;
    case location.pathname.indexOf('OCEANICA') === -1 &&
      location.pathname.indexOf('PIRAMIDE') === -1:
      insuranceCompanyPatch = undefined;
      break;
  }

  switch (true) {
    //ROUTS ENV
    case location.pathname.indexOf('PRODUCCION') != -1:
      envCompanyPatch = 'PRODUCCION';
      sessionStorage.setItem('environment', 'PRODUCCION');

      break;
    case location.pathname.indexOf('CALIDAD') != -1:
      envCompanyPatch = 'CALIDAD';
      sessionStorage.setItem('environment', 'CALIDAD');

      break;
    case location.pathname.indexOf('PRODUCCION') === -1 &&
      location.pathname.indexOf('CALIDAD') === -1:
      envCompanyPatch = undefined;
      break;
  }

  let BaseUrl;

  let insuranceCompany;
  let envCompany;

  if (insuranceCompanyPatch == undefined && envCompanyPatch == undefined) {
    insuranceCompany =
      sessionStorage.getItem('insuranceCompany') === null
        ? 'PIRAMIDE'
        : sessionStorage.getItem('insuranceCompany');
    envCompany =
      sessionStorage.getItem('environment') === null
        ? 'CALIDAD'
        : sessionStorage.getItem('environment');
  } else {
    insuranceCompany = insuranceCompanyPatch;
    envCompany = envCompanyPatch;
  }

  switch (true) {
    case insuranceCompany === 'PIRAMIDE' && envCompany === 'PRODUCCION':
      BaseUrl = 'https://segurospiramide.com/asg-api/dbo/errors/';
      sessionStorage.setItem(
        'UrlLink',
        'https://asesores.segurospiramide.com/gestionerror360/'
      );
      break;
    case insuranceCompany == 'PIRAMIDE' && envCompany == 'CALIDAD':
      BaseUrl = 'https://asesores.segurospiramide.com/asg-api/dbo/errors/';
      sessionStorage.setItem(
        'UrlLink',
        'https://asesores.segurospiramide.com/gestionerror360/'
      );

      break;
    case insuranceCompany == 'OCEANICA' && envCompany == 'PRODUCCION':
      BaseUrl = 'https://oceanicadeseguros.com/asg-api/dbo/errors/';
      sessionStorage.setItem(
        'UrlLink',
        'https://asesores.segurospiramide.com/gestionerror360/'
      );
      break;
    case insuranceCompany == 'OCEANICA' && envCompany == 'CALIDAD':
      BaseUrl =
        'https://emergencia24horas.oceanicadeseguros.com/node/express/servicios/apiErrors360/';
      sessionStorage.setItem(
        'UrlLink',
        'https://asesores.segurospiramide.com/gestionerror360/'
      );
      break;
  }

  const [arrayValues, setArrayValues] = useState([]);
  const [arrayKeys, setArrayKeys] = useState([]);
  const [flagParams, setFlagParams] = useState('');
  const [flagStatus, setStatus] = useState('N');
  const [paramString, setParamString] = useState([]);
  const [listErrors, setListErrors] = useState([]);
  const [arrayDepartaments, setArrayDepartaments] = useState([]);
  const [documentsErrorsArray, setDocumentsErrorsArray] = useState([]);
  const [name, setName] = useState(
    sessionStorage.getItem('name') ? sessionStorage.getItem('name') : ''
  );
  const [sesion, setSesion] = useState(
    sessionStorage.getItem('sesion') === 'loged' ? 'loged' : ''
  );
  const [errorInfo, setErrorInfo] = useState(null);
  const [countErrors, setCountErrors] = useState(null);
  const [solutionInfo, setSolutioInfo] = useState(null);
  const [documentErrors, setDocumentErrors] = useState([]);
  const { setOpen } = useBackdrop();
  const sendMailRout = 'https://asesores.segurospiramide.com/asg-api/send_mail';

  const getErrorByID = async (numberTicket) => {
    setOpen(true);

    const params = {
      p_id_error_log: Number(numberTicket),
    };
    const response = await axiosInstance.post(
      BaseUrl + 'get_error_by_id',
      params
    );
    if (response?.data?.c_get_error_by_id?.length === 0) {
      setErrorInfo('empty');
    } else {
      getSolutionsById(
        response.data.c_get_error_by_id[0].EXCEPTION_CODE,
        response.data.c_get_error_by_id[0].APPLICATION_MESSAGE
      );
      setErrorInfo(response.data.c_get_error_by_id[0]);
      setFlagParams('modeString');
      setParamString(
        response.data.c_get_error_by_id[0].JSON_PARAMS_TRANSACTION
      );
      setDocumentsErrorsArray(response.data.c_get_document_error_by_id);
    }

    setOpen(false);
    return response;
  };

  const cleanError = async () => {
    setErrorInfo(null);
    setSolutioInfo(null);
    setArrayValues([]);
    setArrayKeys([]);
  };

  const getSolutionsById = async (code, applicationMessage) => {
    const params = {
      p_exception_code: code.toString(),
      p_application_message: applicationMessage,
    };
    const response = await axiosInstance.post(
      BaseUrl + 'get_all_solutions_by_error',
      params
    );
    setSolutioInfo(response.data.c_get_solutions_by_error);
    return response;
  };

  const uploadDocument = async (arrayDocuments, errorInfo, statusFile) => {
    setOpen(true);
    arrayDocuments.map(async (document, index) => {
      let form = new FormData();
      form.append('files', document);

      try {
        const resDoc = await axios.post(
          `https://asesores.segurospiramide.com/strapi/upload`,
          form,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        const userData = JSON.parse(sessionStorage.getItem('profile'));
        const data = {
          p_id_error: errorInfo.ID_ERROR_LOG,
          p_document:
            'https://asesores.segurospiramide.com/strapi/' + resDoc.data[0].url,
          p_document_name: resDoc.data[0].name,
          p_status: statusFile,
          p_cod_user: userData.CODIGO_USUARIO,
          p_area: userData.PLATAFORMA,
          p_id_document_strapi: resDoc.data[0].id,
        };

        const response = await axiosInstance.post(
          BaseUrl + 'upload_document',
          data
        );
        if (response.statusText === 'OK') {
          getErrorByID(errorInfo.ID_ERROR_LOG);
        }
      } catch (error) {
        alert('El archivo es muy pesado para poder ser agregado al Error.');
        setOpen(false);
      }
    });
    //getErrorByID(errorInfo.ID_ERROR_LOG);
    return true;
  };

  const deleteDocument = async (params) => {
    const data = {
      p_id_document: params.p_id_document,
    };
    const response = await axiosInstance.post(
      BaseUrl + 'delete_document',
      data
    );


    if (response.data.Resultado === 'OK') {
      const dataStrapi = {
        id: params.errorStrapiId,
      };

      const resStrapi = await axios.delete(
        `https://asesores.segurospiramide.com/strapi/upload/files/` +
          dataStrapi.id,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      getErrorByID(params.errorId);
    }
    return response;
  };

  const updateSolutionStatus = async (idError, status) => {
    setOpen(true);
    const params = {
      p_status_attention_status: status,
      p_id_error_log : idError
    };
    const response = await axiosInstance.post(
      BaseUrl + 'update_attetion_solutions',
      params
    );
    setSolutioInfo(response.data.result);
    setOpen(false);
    getAllStatusErros();
    return response;
  };

  const getDepartamentByArea = async () => {
    const response = await axiosInstance.post(
      BaseUrl + 'get_department_by_area'
    );
    setArrayDepartaments(response.data.v_cur_area);
    return response;
  };

  const getAllErrorsByStatus = async (type) => {
    cleanError()
    setOpen(true);
    setListErrors([]);
    setStatus(type);
    const params = {
      p_status_attention: type,
    };
    const response = await axiosInstance.post(
      BaseUrl + 'get_error_by_status_attention',
      params
    );
    setListErrors(response.data.v_cur_error_status_attention);
    setOpen(false);
    return response;
  };

  const getAllStatusErros = async () => {
    setOpen(true);
    const response = await axiosInstance.post(
      BaseUrl + 'get_all_total_status_attention'
    );
    if(2, response.statusText){
      setCountErrors(response.data.v_cur_errors[0]);
      setOpen(false);
    }
    return response;
  };

  const updateAttention = async (params) => {
    setOpen(true);
    const response = await axiosInstance.post(
      BaseUrl + 'update_attention_user',params
    );
    if(response.data.Resultado ==="OK"){
      const status =  params.p_status==="S"?"R":"N"
      updateSolutionStatus(params.p_id_error_log, status);
    }
    setOpen(false);
    getErrorByID(params.p_id_error_log);
    getAllErrorsByStatus("N")
    return response;
  };

  const InsertSolutionById = async (
    data,
    handleClose,
    arrayDocuments,
    errorInfo
  ) => {
    setOpen(true);
    const params = {
      p_id_error: data.idError,
      p_solutions: data.solutions,
      p_area: data.area,
      p_exception_code: data.code,
      p_application_message: data.applicationMessage,
    };
    const response = await axiosInstance.post(
      BaseUrl + 'insert_solutions_error_by_id',
      params
    );
    if (response.data.Resultado === 'OK') {
      uploadDocument(arrayDocuments, errorInfo, 'SOLUTION');
      updateSolutionStatus(data.idError, "S");
      getAllStatusErros();
      handleClose();
      setTimeout(() => {
        getErrorByID(data.idError);
        setOpen(false);
      }, 2000);
    }

    return response;
  };

  const sendMail = async (dataForm) => {
    setOpen(true);
    const response = await axios.post(sendMailRout, dataForm);
    setOpen(false);
    return response;
  };

  const login = async (data, handleClose) => {
    setOpen(true);
    const response = await axios.post(
      'https://emergencia24horas.segurospiramide.com/node/express/servicios/apiSucur/valida_user',
      data
    );

    if (response?.data?.c_cursor_valida_user[0]?.VALOR === 0) {
      alert('Usuario no encontrado');
    } else if (response?.data?.c_cursor_valida_user[0]?.VALOR === 1) {
      const params = {
        p_codigo_usuario: data.p_codigo_usuario,
      };
      const profile = await axios.post(
        'https://emergencia24horas.segurospiramide.com/node/express/servicios/apiSucur/autenticar_user',
        params
      );
      sessionStorage.setItem('sesion', 'loged');
      sessionStorage.setItem(
        'profile',
        JSON.stringify(profile.data.c_cursor_user[0])
      );

      sessionStorage.setItem(
        'name',
        profile.data.c_cursor_user[0].CODIGO_USUARIO
      );

      setName(profile.data.c_cursor_user[0].CODIGO_USUARIO);
      setSesion('loged');
      handleClose();
    }
    setOpen(false);
    return response;
  };

  const logout = () => {
    setOpen(true);
    sessionStorage.removeItem('sesion');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('profile');
    setName('');
    setSesion('');
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  return (
    <DataServicesContext.Provider
      value={{
        getErrorByID,
        errorInfo,
        arrayValues,
        arrayKeys,
        InsertSolutionById,
        getSolutionsById,
        solutionInfo,
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
        login,
        name,
        sesion,
        logout,
        uploadDocument,
        deleteDocument,
        documentErrors,
        documentsErrorsArray,
        updateAttention
      }}
    >
      {children}
    </DataServicesContext.Provider>
  );
};
