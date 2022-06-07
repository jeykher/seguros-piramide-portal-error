import react, { useContext, useEffect, useState } from 'react';
import backButton from "../../assets/icons8-back-48.png"
import './styles.scss';
//import ImageNotResult from "../../assets/magnifying-glass.png"


const NotResult = (props) => {

  const {setBack} = props
  useEffect(() => {
  }, []);

  return (
    <div className="image-not-result">
      {/* <img src={ImageNotResult}/> */}
      <img src="/gestionerror360/images/magnifying-glass.png"/>
      <h3>Error no Encontrado</h3>    
      <div className='backbutton' onClick={setBack}>
            <img src={backButton}/>
            Regresar
          </div>
    </div>
  );
};

export default NotResult;