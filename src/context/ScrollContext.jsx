import { createContext, useContext } from "react";

const ScrollContext = createContext(null);

export function ScrollProvider({ children, value }) {
  return (
    <ScrollContext value={value}>
      {children}
    </ScrollContext>
  );
}

export function useLenisRef() {
  return useContext(ScrollContext);
}
