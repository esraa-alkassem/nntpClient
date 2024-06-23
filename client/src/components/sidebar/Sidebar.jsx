import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { MdOutlineFileUpload } from "react-icons/md";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { MdLiveHelp } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/themeReducer";
import { Link } from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import "./Sidebar.css";
const drawerWidth = 240;
const useStyledComponents = (themes) => {
  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    color: "transparent",
    ...theme.mixins.toolbar,
  }));
  const StyledDrawer = styled(MuiDrawer)(({ theme }) => ({
    "& .MuiDrawer-paper": {
      backgroundColor: themes === "dark" ? "#424242" : "#f5f5f5",
      color: themes === "dark" ? "#ffffff" : theme.palette.text.primary,
    },
  }));
  const StyledList = styled(List)(({ theme }) => ({
    "& .MuiListItem-root": {
      color:
        theme.palette.mode === "dark" ? "#ffffff" : theme.palette.text.primary,
    },
  }));
  const AppBarStyled = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    backgroundColor: "transparent",
    boxShadow: "none",
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));
  return { DrawerHeader, AppBarStyled, Drawer };
};

export default function Sidebar({ children }) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const themes = useSelector((state) => state.theme);
  const { DrawerHeader, AppBarStyled, Drawer } = useStyledComponents(themes);
  const handleToggle = () => {
    dispatch(toggleTheme());
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarStyled
        position="fixed"
        open={open}
        sx={{ ...(open && { display: "none" }) }}
      >
        {/* <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            App Name
          </Typography>
        </Toolbar> */}
      </AppBarStyled>
      <Drawer variant="permanent" open={open}>
        {open ? (
          <DrawerHeader sx={{ ...(!open && { display: "none" }) }}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
        ) : (
          <DrawerHeader sx={{ ...(open && { display: "none" }) }}>
            <IconButton onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
          </DrawerHeader>
        )}

        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to="/messages"
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MdOutlineFileUpload />
              </ListItemIcon>
              <ListItemText primary="Messages" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to="/settings"
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MdOutlineSettingsSuggest />
              </ListItemIcon>
              <ListItemText primary="Settings" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to="/help"
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MdLiveHelp />
              </ListItemIcon>
              <ListItemText primary="Help" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <IconButton
          onClick={handleToggle}
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {themes === "light" ? (
            <LightModeIcon style={{ color: "#e0ff7a" }} />
          ) : (
            <DarkModeIcon />
          )}
        </IconButton>
      </Drawer>
      <Box sx={{ width: "100%" }}>{children}</Box>
    </Box>
  );
}
