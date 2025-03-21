import React from "react";
import "./App.css";
import { authProtectedRoutes, publicRoutes } from "./Routes/allRoutes";
import { Route, Routes } from "react-router-dom";
import VerticalLayout from "./Layouts/VerticalLayout";
import HorizotanlLayout from "./Layouts/HorizotanlLayout";
import "./assets/scss/theme.scss";
import NonAuthLayout from "./Layouts/NonLayout";

//constants
import {
  LAYOUT_TYPES,
} from "./Components/constants/layout";

import fakeBackend from "./helpers/AuthType/fakeBackend";
import { useSelector } from "react-redux";
import AuthProtected from "Routes/AuthProtected";

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper";

// const firebaseConfig = {
// apiKey: process.env.REACT_APP_APIKEY,
// authDomain: process.env.REACT_APP_AUTHDOMAIN,
// databaseURL: process.env.REACT_APP_DATABASEURL,
// projectId: process.env.REACT_APP_PROJECTID,
// storageBucket: process.env.REACT_APP_STORAGEBUCKET,
// messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
// appId: process.env.REACT_APP_APPID,
// measurementId: process.env.REACT_APP_MEASUREMENTID,
// };

// init firebase backend
// initFirebaseBackend(firebaseConfig);

// Activating fake backend
fakeBackend();

const getLayout = (layoutType: any) => {
  let Layout = VerticalLayout;
  switch (layoutType) {
    case LAYOUT_TYPES.VERTICAL:
      Layout = VerticalLayout;
      break;
    case LAYOUT_TYPES.HORIZONTAL:
      Layout = HorizotanlLayout;
      break;
    default:
      break;
  }
  return Layout;
};

function App() {
  const { layoutTypes } = useSelector((state: any) => ({
    layoutTypes: state.Layout.layoutTypes,
  }));

  const Layout = getLayout(layoutTypes);
  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route path={route.path} key={idx}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>} />
        ))}
        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            key={idx}
            element={
              <React.Fragment>
                <AuthProtected>
                  <Layout>{route.component}</Layout>
                </AuthProtected>
              </React.Fragment>
            }
          />
        ))}
      </Routes>
    </React.Fragment>
  );
}

export default App;
