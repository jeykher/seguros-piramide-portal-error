import React, { Component } from "react";
import { BrowserRouter as Router, Route, BrowserRouter } from "react-router-dom";
import routes from "./routes";
import { ServicesContext } from "./context/servicesContext/servicesContext";
import Layout from "./layout/Layout";
import { BackdropContextProvider } from "./context/Backdrop";

class App extends Component {
  
  render() {
    const routeComponents = routes.map(({ path, component }, key) => (
      <Route exact path={path} component={component} key={key} />
    ));
    return (
      <BrowserRouter>
          <BackdropContextProvider>          
                <ServicesContext>
                  <Layout>{routeComponents}</Layout>
                </ServicesContext>
          </BackdropContextProvider>      
      </BrowserRouter>
    );
  }
}

export default App;
