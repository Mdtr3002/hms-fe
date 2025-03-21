import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import RightSidebar from "Components/CommonForBoth/RightSidebar";
import withRouter from "../../Components/Common/withRouter";
import { useDispatch, useSelector } from "react-redux";
import { changeLayout, changeLayoutMode, changeTopbarTheme, changeLeftSidebarType, changeLeftSidebarTheme, changeSidebarImageType } from "slices/layouts/thunk";

const VerticalLayout = (props: any) => {

  const dispatch: any = useDispatch();
  const { layoutTypes,
    layoutModeTypes,
    topbarThemeTypes,
    leftSidebarTypes,
    leftSideBarThemeTypes,
    leftSidebarImageTypes } = useSelector((state: any) => ({
      layoutTypes: state.Layout.layoutTypes,
      layoutModeTypes: state.Layout.layoutModeTypes,
      layoutWidthTypes: state.Layout.layoutWidthTypes,
      topbarThemeTypes: state.Layout.topbarThemeTypes,
      leftSidebarTypes: state.Layout.leftSidebarTypes,
      leftSideBarThemeTypes: state.Layout.leftSideBarThemeTypes,
      leftSidebarImageTypes: state.Layout.leftSidebarImageTypes
    }));

  const [open, setOpen] = useState<boolean>(false);
  const toggleCanvas :any= () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (layoutTypes ||
      layoutModeTypes ||
      topbarThemeTypes ||
      leftSidebarTypes ||
      leftSideBarThemeTypes ||
      leftSidebarImageTypes) {
      dispatch(changeLayout(layoutTypes));
      dispatch(changeLayoutMode(layoutModeTypes));
      dispatch(changeTopbarTheme(topbarThemeTypes));
      dispatch(changeLeftSidebarType(leftSidebarTypes));
      dispatch(changeLeftSidebarTheme(leftSideBarThemeTypes));
      dispatch(changeSidebarImageType(leftSidebarImageTypes))
    }
  }, [
    dispatch,
    layoutTypes,
    layoutModeTypes,
    topbarThemeTypes,
    leftSidebarTypes,
    leftSideBarThemeTypes,
    leftSidebarImageTypes]);

  return (

    <React.Fragment>
      <div id="layout-wrapper">
        <Header toggleCanvas={toggleCanvas} />
        <Sidebar />
        <div className="main-content">
          {props.children}
          <Footer />
          <RightSidebar show={open} toggleCanvas={toggleCanvas} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(VerticalLayout);
