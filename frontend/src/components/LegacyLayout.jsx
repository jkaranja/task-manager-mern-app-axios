import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import Nav from "./Nav";
import Sidebar from "./Sidebar";
import { purple } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";

const Layout = ({ children }) => {
  const [toggle, setToggle] = useState(false);
  const [arrow, setArrow] = useState(false);

  //set toggle to match auto hide in css based on device width
  const matches = useMediaQuery("(max-width: 992px)");
  // const matches = useMediaQuery(theme.breakpoints.up("sm"));//works too
  useEffect(() => {
    setToggle(false);
    matches ? setArrow(true) : setArrow(false);
  }, [matches]);

  //how toggling sidebar is working
  /**
   * before 992, when you add active class, sidebar will be hidden ie = -margin-left//and sidebar have 0 margin-left
   * after, sidebar will have -margin/HIDE while active will have 0 margin-left/SHOW so it's vice versa
   * with above media query, it will remove the active class while sidebar id hides sidebar//this apply no matter the prev state of sidebar
   * coming out of 992 max width, it also removes active class while sidebar id show sidebar//
   * i.e active is now only for toggling
   * for arrow toggling, if below 992, show right arrow(sidebar will collapse as sidebar -margin takes effect)
   * if below 992, show left arrow(sidebar will show as sidebar 0 margin takes effect)
   */

  return (
    <>
      <Nav arrow={arrow} toggler={setToggle} changeArrow={setArrow} />
      <Grid2
        noWrap //default//tries to stay in same row
        container //adds flex behavior//span 12 cols //row//display block
        direction="row"
        justifyContent="flex-start"
        alignItems="stretch"
        minHeight="90vh"
        // spacing={} //horizontal// rowSpacing for veritical
      >
        <Grid2 xs="auto" sx={{}} id="sidebar" className={toggle && "active"}>
          <Sidebar />
        </Grid2>
        {/* //default of grid is not occupy available space like BStrap//use xs/md */}
        <Grid2 xs sx={{}} p={7}>
          {children}
        </Grid2>
      </Grid2>
    </>
  );
};

export default Layout;
