"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface HeaderState {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

interface HeaderContextType {
  state: HeaderState;
  setHeader: (state: HeaderState) => void;
  clearHeader: () => void;
  // Thêm slot cho portal
  tabsSlot: HTMLElement | null;
  setTabsSlot: (element: HTMLElement | null) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HeaderState>({});
  const [tabsSlot, setTabsSlot] = useState<HTMLElement | null>(null);

  const setHeader = useCallback((newState: HeaderState) => {
    setState(newState);
  }, []);

  const clearHeader = useCallback(() => {
    setState({});
  }, []);

  return (
    <HeaderContext.Provider
      value={{ state, setHeader, clearHeader, tabsSlot, setTabsSlot }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
