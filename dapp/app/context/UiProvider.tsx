"use client";

import { createContext, useContext, useState } from "react";

type UiContextType = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

const UiContext = createContext<UiContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export function UiProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <UiContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </UiContext.Provider>
  );
}

export function useUiProvider() {
  return useContext(UiContext);
}
