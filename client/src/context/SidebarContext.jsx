import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Shared open/closed state for the dashboard sidebar on small screens,
// so the Header's menu button and the SideBar stay in sync.
const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, toggle, close }), [isOpen, toggle, close]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};
