import * as React from "react";
import { Outlet, Link, useLocation } from "@tanstack/react-router";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// ✅ Import Material UI Icons
import HomeIcon from "@mui/icons-material/Home";
import TableChartIcon from "@mui/icons-material/TableChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShareIcon from "@mui/icons-material/Share";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 200;

// ✅ Sidebar Items with Icons
const items = [
  {
    text: "Home",
    route: "/",
    icon: <HomeIcon />,
  },
  {
    text: "Visualize",
    icon: <BarChartIcon />,
    subItems: [
      { text: "Records", route: "/visualize/records", icon: <TableChartIcon /> },
      { text: "Charts", route: "/visualize/charts", icon: <BarChartIcon /> },
      { text: "Graphs", route: "/visualize/graphs", icon: <ShareIcon /> },
    ],
  },
  {
    text: "Classify",
    icon: <CategoryIcon />,
    subItems: [{ text: "Category", route: "/classify/classify", icon: <CategoryIcon /> }],
  },
];

export default function Sidebar() {
  const [isSidebarHidden, setIsSidebarHidden] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const location = useLocation(); // ✅ Get current path

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleSidebar = () => {
    setIsSidebarHidden((prev) => !prev);
  };

  const open = Boolean(anchorEl);
  const id = open ? "settings-popover" : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: isSidebarHidden ? "100%" : `calc(100% - ${drawerWidth}px)`,
          ml: isSidebarHidden ? 0 : `${drawerWidth}px`,
          backgroundColor: "white",
          color: "black",
          boxShadow: "none",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            Web Data Commons Analyzer
          </Typography>

          <Box>
            <IconButton onClick={handleOpen}>
              <img src="/assets/settings.svg" alt="Settings" width={24} height={24} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Settings Popover Menu */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 1 }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isSidebarHidden}
                onChange={handleToggleSidebar}
                color="primary"
              />
            }
            label="Hide sidebar"
          />
        </Box>
      </Popover>

      {/* Sidebar Drawer */}
      {!isSidebarHidden && (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Just Web
            </Typography>
          </Toolbar>
          <Divider />
          <List dense>
            {/* ✅ Home Item - Styled as Active When Selected */}
            <ListItem disablePadding sx={{ marginBottom: "4px" }}>
              <ListItemButton
                component={Link}
                to="/"
                sx={{
                  pl: 1,
                  py: "0px",
                  backgroundColor: location.pathname === "/" ? "#E3F2FD" : "inherit",
                  color: location.pathname === "/" ? "#007BFF" : "inherit",
                  "& .MuiListItemIcon-root": {
                    color: location.pathname === "/" ? "#007BFF" : "inherit",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <HomeIcon />
                </ListItemIcon>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  Home
                </Typography>
              </ListItemButton>
            </ListItem>

            {items
              .filter((item) => item.text !== "Home")
              .map(({ text, icon, subItems }) => (
                <React.Fragment key={text}>
                  {/* ❌ Non-clickable Main Category */}
                  <ListItem sx={{ marginBottom: "4px", padding: "4px 8px" }}>
                    <ListItemIcon sx={{ minWidth: "30px" }}>{icon}</ListItemIcon>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", fontSize: "14px" }}
                    >
                      {text}
                    </Typography>
                  </ListItem>

                  {/* ✅ Clickable Sub-items */}
                  {subItems.map(({ text: subText, route: subRoute, icon: subIcon }) => {
                    const isActive = location.pathname === subRoute; // ✅ Check if current page is active

                    return (
                      <ListItem key={subText} disablePadding sx={{ pl: 3, py: "2px" }}>
                        <ListItemButton
                          component={Link}
                          to={subRoute}
                          sx={{
                            backgroundColor: isActive ? "#E3F2FD" : "inherit",
                            color: isActive ? "#007BFF" : "inherit",
                            fontWeight: isActive ? "bold" : "normal",
                            "& .MuiListItemIcon-root": {
                              color: isActive ? "#007BFF" : "inherit",
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: "30px" }}>{subIcon}</ListItemIcon>
                          <ListItemText
                            primary={subText}
                            primaryTypographyProps={{
                              fontSize: "13px",
                              fontWeight: isActive ? "bold" : "normal",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </React.Fragment>
              ))}
          </List>
        </Drawer>
      )}
      <Outlet />
    </Box>
  );
}
