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

const drawerWidth = 240;

const items = [
  {
    text: "Home",
    subItems: [
      { text: "Dashboard", route: "/home/dashboard" },
      { text: "Profile", route: "/home/profile" },
    ],
  },
  {
    text: "Visualize",
    subItems: [
      { text: "Records", route: "/visualize/records" },
      { text: "Graphs", route: "/visualize/graphs" },
      { text: "Charts", route: "/visualize/charts" },
    ],
  },
  {
    text: "Classify",
    subItems: [
      { text: "Category", route: "/classify/classify" },
      { text: "Category A", route: "/classify/category-a" },
      { text: "Category B", route: "/classify/category-b" },
    ],
  },
  {
    text: "Match",
    subItems: [
      { text: "Match 1", route: "/match/match-1" },
      { text: "Match 2", route: "/match/match-2" },
    ],
  },
];

export default function Sidebar() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar />
      </AppBar>
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
            WATR
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {items.map(({ text, subItems }) => (
            <React.Fragment key={text}>
              <ListItem>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", pl: 2 }}
                >
                  {text}
                </Typography>
              </ListItem>
              {subItems.map(({ text: subText, route: subRoute }) => (
                <ListItem key={subText} disablePadding sx={{ pl: 4 }}>
                  <ListItemButton component={Link} to={subRoute}>
                    <ListItemText primary={subText} />
                  </ListItemButton>
                </ListItem>
              ))}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      <Outlet />
    </Box>
  );
}
