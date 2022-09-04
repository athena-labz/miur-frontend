// import
import Dashboard from "views/Dashboard/Dashboard";
import Tables from "views/Dashboard/Tables";
import Billing from "views/Dashboard/Billing";
import RTLPage from "views/Dashboard/RTL";
import Profile from "views/Dashboard/Profile";
import ProjectView from "views/Dashboard/ProjectView";
import { ArrowBackIcon } from "@chakra-ui/icons";

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
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color="inherit" />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/billing",
    name: "Billing",
    rtlName: "لوحة القيادة",
    icon: <CreditIcon color="inherit" />,
    component: Billing,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    rtlName: "لوحة القيادة",
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
];
export default dashRoutes;
