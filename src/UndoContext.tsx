import { createContext, PropsWithChildren, useContext } from "react";
import useUndoState, { UndoState, UseUndoStateProps } from "./UndoState";

//* Types
type UseUndoContextProps = PropsWithChildren<UseUndoStateProps>;

const UndoContext = createContext(null as null | UndoState);

export function useUndo() {
  return useContext(UndoContext);
}

export function UndoProvider({ onSuccess, onError, children }: UseUndoContextProps) {
  const state = useUndoState({ onSuccess, onError });

  return <UndoContext.Provider value={state}>{children}</UndoContext.Provider>;
}
