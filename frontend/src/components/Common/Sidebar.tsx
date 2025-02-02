import * as React from "react";
import { Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
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
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const drawerWidth = 200;

const items = [
  {
    text: "Home",
    route: "/",
    subItems: [],
  },
  {
    text: "Visualize",
    subItems: [
      { text: "Records", route: "/visualize/records" },
      { text: "Charts", route: "/visualize/charts" },
      { text: "Graphs", route: "/visualize/graphs" },
    ],
  },
  {
    text: "Classify",
    subItems: [
      { text: "Category", route: "/classify/classify" },
    ],
  },
];

export default function Sidebar() {
  const [isSidebarHidden, setIsSidebarHidden] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

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
            Web data commons analyzer
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
          <List dense> {/* ✅ Reduced spacing in list */}
            {/* ✅ Home (Styled as a Category but Clickable) */}
            <ListItem disablePadding sx={{ marginBottom: "4px" }}>
              <ListItemButton component={Link} to="/" sx={{ pl: 3, py: "4px" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  Home
                </Typography>
              </ListItemButton>
            </ListItem>

            {items
              .filter((item) => item.text !== "Home") // Avoid duplicating "Home"
              .map(({ text, subItems }) => (
                <React.Fragment key={text}>
                  {/* ❌ Non-clickable Main Category */}
                  <ListItem sx={{ marginBottom: "4px", padding: "4px 8px" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", fontSize: "14px" }}
                    >
                      {text}
                    </Typography>
                  </ListItem>

                  {/* ✅ Clickable Sub-items */}
                  {subItems.map(({ text: subText, route: subRoute }) => (
                    <ListItem key={subText} disablePadding sx={{ pl: 3, py: "2px" }}>
                      <ListItemButton component={Link} to={subRoute}>
                        <ListItemText
                          primary={subText}
                          primaryTypographyProps={{ fontSize: "13px" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </React.Fragment>
              ))}
          </List>
        </Drawer>
      )}
      <Outlet />
    </Box>
  );
}
