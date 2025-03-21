import React, { useState, useEffect } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import RightSidebar from "Components/CommonForBoth/RightSidebar";
import withRouter from "../../Components/Common/withRouter";

import { useDispatch, useSelector } from "react-redux";
import { changeLayout, changeLayoutMode, changeTopbarTheme } from "slices/layouts/thunk";

const HorizontalLayout = (props: any) => {
  const dispatch: any = useDispatch();
  const { layoutTypes, layoutModeTypes, topbarThemeTypes } = useSelector((state: any) => ({
    layoutTypes: state.Layout.layoutTypes,
    layoutModeTypes: state.Layout.layoutModeTypes,
    layoutWidthTypes: state.Layout.layoutWidthTypes,
    topbarThemeTypes: state.Layout.topbarThemeTypes,
  }));

  useEffect(() => {
    if (layoutTypes || layoutModeTypes || topbarThemeTypes) {
      dispatch(changeLayout(layoutTypes));
      dispatch(changeLayoutMode(layoutModeTypes));
      dispatch(changeTopbarTheme(topbarThemeTypes));
    }
  }, [layoutTypes, layoutModeTypes, topbarThemeTypes, dispatch]);

  const [open, setOpen] = useState<any>(false);
  const [openColl, setOpenColl] = useState<any>(false);

  const toggleCanvas :any= () => setOpen(!open);

  const toggleLeftmenu = () => setOpenColl(!openColl);

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <Header toggleCanvas={toggleCanvas} toggleLeftmenu={toggleLeftmenu} />
        <Navbar leftMenu={openColl} />
        <div className="main-content">
          {props.children}
          <Footer />
          <RightSidebar show={open} toggleCanvas={toggleCanvas} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default withRouter(HorizontalLayout)
