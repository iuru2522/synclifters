import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MenuOverlayContextValue = {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
};

const MenuOverlayContext = createContext<MenuOverlayContextValue | null>(null);

export function MenuOverlayProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      openMenu,
      closeMenu,
      toggleMenu,
    }),
    [closeMenu, isOpen, openMenu, toggleMenu],
  );

  return <MenuOverlayContext.Provider value={value}>{children}</MenuOverlayContext.Provider>;
}

export function useMenuOverlay() {
  const context = useContext(MenuOverlayContext);

  if (!context) {
    throw new Error("useMenuOverlay must be used within MenuOverlayProvider");
  }

  return context;
}
