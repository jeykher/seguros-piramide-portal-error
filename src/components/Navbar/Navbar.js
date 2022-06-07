import react, { useState } from 'react';
import './Navbar.scss';
import Switch from 'react-switch';
import ImageLogin from '../../assets/iniciar-sesion.png';
import PiramideBrand from '../PiramideBrand/PiramideBrand';
import OceanicaBrand from '../../assets/Oceanica.png';
import ModalLogin from '../modal-login';

const insuranceCompany = sessionStorage.getItem('insuranceCompany');

const Navbar = (props) => {
  const [checkedCompany, setCheckedCompany] = useState(
    sessionStorage.getItem('insuranceCompany') === 'OCEANICA' ? false : true
  );
  const [checkedEnvironment, setCheckedEnvironment] = useState(
    sessionStorage.getItem('environment') === 'PRODUCCION' ? true : false
  );
  const { login, name, sesion, logout } = props;
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loginUser = (data) => {
    login(data, handleClose);
  };

  const handleChangeCompany = (nextChecked) => {
    setCheckedCompany(nextChecked);
    if (nextChecked === true) {
      sessionStorage.setItem('insuranceCompany', 'PIRAMIDE');
      window.location.replace('/gestionerror360/');
      //history.push('/gestionerror/');
    } else {
      sessionStorage.setItem('insuranceCompany', 'OCEANICA');
      window.location.replace('/gestionerror360/');
      //history.push('/gestionerror/');
    }
  };

  const handleChangeEnvironment = (nextChecked) => {
    setCheckedEnvironment(nextChecked);
    if (nextChecked === true) {
      sessionStorage.setItem('environment', 'PRODUCCION');
      window.location.replace('/gestionerror360/');
      //history.push('/gestionerror/');
    } else {
      sessionStorage.setItem('environment', 'CALIDAD');
      window.location.replace('/gestionerror360/');
      //history.push('/gestionerror/');
    }
  };

  return (
    <>
      <ModalLogin
        handleClickOpen={handleClickOpen}
        loginUser={loginUser}
        handleClose={handleClose}
        open={open}
      />
      <nav className="cap-navbar">
        <div className="cap-navbar-brands-container cap-navbar-piramide-container">
          {insuranceCompany === 'OCEANICA' ? (
            <img className="image-oceanica" src={OceanicaBrand} />
          ) : (
            <PiramideBrand width="140" height="7vh" />
          )}

          <div className="container-switchs">
            <Switch
              onChange={handleChangeCompany}
              checked={checkedCompany}
              width={110}
              className="react-switch"
              uncheckedIcon={false}
              checkedIcon={false}
              offColor="#47C1B6"
              onColor="#cc2229"
              uncheckedHandleIcon={
                <label
                  style={{
                    color: 'white',
                    marginLeft: 35,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}
                >
                  Océanica
                </label>
              }
              checkedIcon={
                <label
                  style={{
                    color: 'white',
                    marginLeft: 20,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}
                >
                  Pirámide
                </label>
              }
            />
            <Switch
              onChange={handleChangeEnvironment}
              checked={checkedEnvironment}
              width={110}
              className="react-switch"
              uncheckedIcon={false}
              checkedIcon={false}
              uncheckedHandleIcon={
                <label
                  style={{
                    color: 'white',
                    marginLeft: 40,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}
                >
                  Calidad
                </label>
              }
              checkedIcon={
                <label
                  style={{
                    color: 'white',
                    marginLeft: 10,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}
                >
                  Producción
                </label>
              }
            />

            <div
              className="container-login-button"
              onClick={
                sesion === 'loged'
                  ? () => setOpenMenu(!openMenu)
                  : handleClickOpen
              }
            >
              <img src={ImageLogin} />
              <label>{sesion === 'loged' ? name : 'LOGIN'}</label>
              {sesion === 'loged' && openMenu ? (
                <div className="menu-profile" onClick={logout}>
                  <label>Logout</label>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
