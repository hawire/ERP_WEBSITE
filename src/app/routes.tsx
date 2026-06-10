import { createBrowserRouter } from "react-router";
import { MarketingSite } from "./MarketingSite";
import { AdminLayout } from "./admin/AdminLayout";
import { LoginPage } from "./admin/LoginPage";
import { SubmissionsPage } from "./admin/SubmissionsPage";
import { AnalyticsPage } from "./admin/AnalyticsPage";
import { ContactsPage } from "./admin/ContactsPage";
import { SettingsPage } from "./admin/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MarketingSite,
  },
  {
    path: "/admin/login",
    Component: LoginPage,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: SubmissionsPage },
      { path: "analytics", Component: AnalyticsPage },
      { path: "contacts", Component: ContactsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
