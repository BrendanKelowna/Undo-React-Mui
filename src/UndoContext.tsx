import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import useUndo, { UndoObj, UseUndoProps } from "./useUndo";

export type UndoProviderProps = PropsWithChildren<UseUndoProps>;

//* State
export type UndoContextState = {
  undo: () => void;
  redo: () => void;
  undoDescription?: string;
  redoDescription?: string;
  undoDisabled: boolean;
  redoDisabled: boolean;
};

const defaultState: UndoContextState = {
  undo: () => {
    throw new Error("Undo provider not found");
  },
  redo: () => {
    throw new Error("Undo provider not found");
  },
  undoDescription: undefined,
  redoDescription: undefined,
  undoDisabled: true,
  redoDisabled: true,
};

const UndoContext = createContext<UndoContextState>(defaultState);

export function useUndoContext() {
  return useContext(UndoContext);
}

//* Add
export type UndoContextAdd = (undoObj: UndoObj) => void;

const defaultAdd: UndoContextAdd = () => {
  throw new Error("Undo provider not found");
};

const AddContext = createContext<UndoContextAdd>(defaultAdd);

export function useUndoAddContext() {
  return useContext(AddContext);
}

export function UndoProvider({ onSuccess, onError, children }: UndoProviderProps) {
  const {
    add,
    undo,
    redo,
    undoDescription,
    redoDescription,
    undoDisabled,
    redoDisabled,
  } = useUndo({ onSuccess, onError });

  const state = useMemo(
    () => ({
      undo,
      redo,
      undoDescription,
      redoDescription,
      undoDisabled,
      redoDisabled,
    }),
    [undo, redo, undoDescription, redoDescription, undoDisabled, redoDisabled]
  );

  return (
    <UndoContext.Provider value={state}>
      <AddContext.Provider value={add}>{children}</AddContext.Provider>
    </UndoContext.Provider>
  );
}
