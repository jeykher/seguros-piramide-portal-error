import HomePage from '../components/home';

const baseURL = process.env.PUBLIC_URL || '/gestionerror360';

const routes = [
  {
    path: `${baseURL}/:idError/:insuranceCompanyPatch/:envCompanyPatch`,
    component: HomePage,
  },
  {
    path: `${baseURL}/`,
    component: HomePage,
  }
];

export default routes;
