import React, { useContext, useEffect, useState } from 'react';
import SimpleBackdrop from '../components/Backdrop/Backdrop';
import Navbar from '../components/Navbar/Navbar';
import { DataServicesContext } from "../context/servicesContext/servicesContext"
import "./styles.scss"


const Layout = ({children}) => {
    const {login, name, sesion, logout} = useContext(DataServicesContext);
 
    return (
        <div className="container-layout">          
            <SimpleBackdrop />
            <Navbar login={login} name={name} sesion={sesion} logout={logout}/>
            {children}
        </div>
    );
};

export default Layout;