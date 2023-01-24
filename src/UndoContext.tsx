import { createContext, PropsWithChildren, useContext } from "react";
import useUndo, { UndoState, UseUndoProps } from "./useUndo";

//* Types
export type UndoProviderProps = PropsWithChildren<UseUndoProps>;

const UndoContext = createContext<null | UndoState>(null);

export function useUndoContext() {
  return useContext(UndoContext);
}

export function UndoProvider({ onSuccess, onError, children }: UndoProviderProps) {
  const state = useUndo({ onSuccess, onError });

  return <UndoContext.Provider value={state}>{children}</UndoContext.Provider>;
}
