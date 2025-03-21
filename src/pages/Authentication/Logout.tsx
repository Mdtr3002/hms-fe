import React, { useEffect } from "react"
import withRouter from "Components/Common/withRouter";
import { Navigate } from "react-router-dom";

import { logoutUser } from "../../slices/thunk";

//redux
import { useSelector, useDispatch } from "react-redux"

const Logout = () => {
  const dispatch = useDispatch<any>();

  const { isUserLogout } = useSelector((state: any) => ({
    isUserLogout: state.Login.isUserLogout,
  }));

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  if (isUserLogout) {
    return <Navigate to="/login" />;
  }

  return <></>;
}


export default withRouter(Logout)
