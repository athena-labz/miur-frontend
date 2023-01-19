// import
import Dashboard from "views/Dashboard/Dashboard";
import Tables from "views/Dashboard/Tables";
import Billing from "views/Dashboard/Billing";
import RTLPage from "views/Dashboard/RTL";
import Profile from "views/Dashboard/Profile";
import ProjectView from "views/Dashboard/ProjectView";
import { ArrowBackIcon, AtSignIcon } from "@chakra-ui/icons";

import Questions from "views/Questions";
import UserContainer from "views/Users/UserContainer";

const users = [
  {
    email: "johndoe@example.com",
    address:
      "addr_test1qr4s08jelnhu0wkm4at6gd90mmad57zhg5nsrj9sx0mxjhnkrezryq3ydtmkg0e7e2jvzg443h0ffzfwd09wpcxy2fuq9st4xz",
    numberOfProjects: 3,
  },
  {
    email: "janedoe@example.com",
    address:
      "addr_test1wpf87gv0xuf4wdlqqgtspv2xy3ugdpds0al3u56za0ekrxcwm6rse",
    numberOfProjects: 5,
  },
  {
    email: "bob@example.com",
    address:
      "addr_test1qrk4gq4mxp9lzfat9u5rf5rc4tuam6rh3vwrayvcm29aljgqlp2uxwttayehyv35adnu5leyqslr2a9wzzy9wxfrctpsw099v0",
    numberOfProjects: 2,
  },
  {
    email: "alice@example.com",
    address:
      "addr_test1vpkzncl826jlw728jg6qh993gf46hxkkrkrsvx5vx60jqzgms9fyk",
    numberOfProjects: 1,
  },
  {
    email: "chris@example.com",
    address:
      "addr_test1qr4s08jelnhu0wkm4at6gd90mmad57zhg5nsrj9sx0mxjhnkrezryq3ydtmkg0e7e2jvzg443h0ffzfwd09wpcxy2fuq9st4xz",
    numberOfProjects: 4,
  },
];

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  RocketIcon,
} from "components/Icons/Icons";
import CreateProject from "views/Dashboard/CreateProject";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users",
    icon: <AtSignIcon color="inherit" />,
    component: UserContainer,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: <PersonIcon color="inherit" />,
    secondaryNavbar: true,
    component: Profile,
    layout: "/admin",
  },
  {
    path: null,
    name: "Logout",
    rtlName: "",
    icon: <ArrowBackIcon color="inherit" />,
    secondaryNavbar: true,
    component: Profile,
    layout: "/admin",
    isLogout: true,
  },
  {
    path: "/projects/create-project",
    name: "create",
    notSideBar: true,
    icon: <ArrowBackIcon color="inherit" />,
    secondaryNavbar: true,
    component: CreateProject,
    layout: "/admin",
  },
  {
    path: "/projects/:project_id",
    name: "project",
    notSideBar: true,
    icon: <ArrowBackIcon color="inherit" />,
    secondaryNavbar: true,
    component: ProjectView,
    layout: "/admin",
  },
  {
    path: "/questions/:question_id",
    name: "question",
    notSideBar: true,
    icon: <ArrowBackIcon color="inherit" />,
    secondaryNavbar: true,
    component: Questions,
    layout: "/admin",
  },
];
export default dashRoutes;
