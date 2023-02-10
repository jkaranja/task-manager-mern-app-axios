import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useNavigate } from "react-router-dom";
import Notifications from "./Notifications";

const Nav = ({ arrow, toggler, changeArrow }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //sidebar toggler
  const handleToggleClick = () => {
    toggler((prev) => !prev);
    changeArrow((prev) => !prev);
  };

  //drawer
  const [drawerToggle, setDrawerToggle] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerToggle((prev) => !prev);
  };
  const drawerProps = { open: drawerToggle, handleToggle: handleDrawerToggle };

  return (
    <React.Fragment>
      <Box
        xs={12}
        sx={{
          display: "flex",
          borderBottom: 1,
          borderColor: "#EAECF0",
          alignItems: "center",
        }}
        py={1}
        px={2}
      >
        <IconButton sx={{ mr: "auto" }} onClick={handleToggleClick}>
          {arrow ? (
            <ChevronRightIcon color="primary" fontSize="medium" />
          ) : (
            <ChevronLeftIcon color="primary" fontSize="medium" />
          )}
        </IconButton>

        <Link sx={{ mx: 3 }} underline="none" onClick={handleDrawerToggle}>
          <Badge color="secondary" badgeContent={1000} max={999}>
            <MailIcon sx={{ color: "#bdbdbd", width: 30, height: 30 }} />
          </Badge>
        </Link>
        <Link sx={{ mx: 3 }} underline="none" onClick={handleDrawerToggle}>
          <Badge color="secondary" badgeContent={1000} max={999}>
            <NotificationsNoneIcon
              sx={{ color: "#bdbdbd", width: 30, height: 30 }}
            />
          </Badge>
        </Link>
        <Notifications {...drawerProps} />

        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 30, height: 30 }}></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Avatar>
            <ManageAccountsIcon />{" "}
          </Avatar>{" "}
          Subscriptions
        </MenuItem>
        <MenuItem>
          <Avatar /> Manage funds
        </MenuItem>
        <Divider />

        <MenuItem onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Account
        </MenuItem>
        <MenuItem onClick={() => navigate("/")}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default Nav;
