import {useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import PiramideBrand from '../PiramideBrand/PiramideBrand';
import OceanicaBrand from '../../assets/Oceanica.png';
import { useForm } from 'react-hook-form';

import "./styles.scss"


const ModalLogin = (props) => {
  const {handleClose, open, loginUser} = props
  const { register, handleSubmit, reset  } = useForm();
  const insuranceCompany = sessionStorage.getItem('insuranceCompany');
  const classModal = insuranceCompany === 'OCEANICA' ?  "modal-login-oceanica " : "modal-login ";

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
   const data ={
      p_codigo_usuario: params.user,
      p_password:params.password
    }
    loginUser(data)

  };
  return (
    <Dialog open={open} onClose={handleClose} className={classModal}>
      <DialogContent>
                <div>  
                  {insuranceCompany==="OCEANICA"?               
                      <img className='image-oceanica' src={OceanicaBrand}/>
                  :                
                      <PiramideBrand 
                      width="140"
                      height="7vh"
                  />
                  }            
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Introduzca su Usuario y Contraseña</label>
                    <input
                      {...register('user')}
                      required
                      className="info"
                      placeholder="Usuario"
                      type="text"
                    />
                    <input
                      {...register('password')}
                      className="info"
                      placeholder="Contraseña"
                      type="password"
                    />
                    <div className='container-options'>
                        <button type="submit" onClick={validateInputs}>Ingresar</button>
                    </div>
                  </form>
               </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalLogin;