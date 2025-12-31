import { LayoutDashboard, Users2, Car, ShieldAlert,CalendarClock,MessageSquareText,Settings } from "lucide-react";

export const ADMIN_LINKS = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { title: "User Management", path: "/admin/users", icon: Users2 },
  { title: "Inventory", path: "/admin/cars", icon: Car },
  // { title: "Security Logs", path: "/admin/logs", icon: ShieldAlert },
  { title: "Settings", path: "/admin/settings", icon: Settings },
];


export const DEALER_LINKS = [
  { title: "Dashboard", path: "/dealer", icon: LayoutDashboard },
  { title: "View Inventory", path: "/dealer/cars", icon: Car },
  { title: "Test Drive Schedules", path: "/dealer/schedules", icon: CalendarClock },
  { title: "View Enquiries", path: "/dealer/enquiries", icon: MessageSquareText },
  { title: "Settings", path: "/dealer/settings", icon: Settings },
];