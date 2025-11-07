import { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  // ⬇️ Default: sidebar tertutup
  const [visible, setVisible] = useState(false);

  // ⬇️ Fungsi toggle sidebar (dipakai di Navbar)
  function toggleSidebar() {
    setVisible((prev) => !prev);
  }

  // ⬇️ Tutup sidebar otomatis kalau window di-resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setVisible(true); // buka otomatis di layar besar
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarContext.Provider value={{ visible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
