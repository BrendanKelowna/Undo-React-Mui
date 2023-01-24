/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

//* Types
export type UndoState = ReturnType<typeof useUndoState>;

export type UseUndoStateProps = {
  onSuccess?: (message: string) => void;
  onError?: (error: any) => void;
};

export type UndoMessages = {
  message?: string;
  undoDescription?: string;
  redoDescription?: string;
};

export type UndoObj = UndoMessages & {
  undo: () => Promise<any>;
  redo: () => Promise<any>;
};

export default function useUndoState({ onSuccess, onError }: UseUndoStateProps = {}) {
  //* State
  const [undoList, setUndoList] = useState<UndoObj[]>([]);
  const [index, setIndex] = useState(0);

  const undoDescription = undoList[index - 1]?.undoDescription;
  const redoDescription = undoList[index]?.redoDescription;

  //* Handlers
  function add(item: UndoObj) {
    setUndoList((list) => [...list.slice(0, index), item]);
    setIndex((state) => state + 1);
  }

  function undo() {
    const undoIndex = index - 1;
    if (undoIndex < 0) throw new Error("No more undos");
    if (undoList.length < 1) throw new Error("No undo history");
    undoList[undoIndex]
      .undo()
      .then(() => onSuccess?.("Undo successfull"))
      .catch((error: any) => onError?.(error));
    setIndex(undoIndex);
  }

  function redo() {
    if (index >= undoList.length) throw new Error("No more redos");
    if (undoList.length < 1) throw new Error("No undo history");
    undoList[index]
      .redo()
      .then(() => onSuccess?.("Redo successfull"))
      .catch((error: any) => onError?.(error));
    setIndex(index + 1);
  }
  return {
    undoList,
    index,
    setIndex,
    setUndoList,
    add,
    undo,
    redo,
    length: undoList.length,
    undoDescription,
    redoDescription,
    undoDisabled: index <= 0,
    redoDisabled: index >= undoList.length,
  };
}
