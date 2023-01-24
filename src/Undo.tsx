import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

//* Types
export type UndoProps = Omit<IconButtonProps, "iconName"> & {
  undo: () => void;
  redo: () => void;
  undoDescription?: string;
  redoDescription?: string;
  undoDisabled?: boolean;
  redoDisabled?: boolean;
};

export default function Undo({
  undo,
  redo,
  undoDescription,
  redoDescription,
  undoDisabled,
  redoDisabled,
  ...props
}: UndoProps) {
  const undoTitle = undoDescription ? `Undo: ${undoDescription}` : "Undo";
  const redoTitle = redoDescription ? `Redo: ${redoDescription}` : "Redo";

  return (
    <>
      <IconButton
        title={undoTitle}
        onClick={undo}
        disabled={undoDisabled}
        name="undo"
        {...props}
      >
        <UndoIcon />
      </IconButton>
      <IconButton
        title={redoTitle}
        onClick={redo}
        disabled={redoDisabled}
        name="redo"
        {...props}
      >
        <RedoIcon />
      </IconButton>
    </>
  );
}
Undo.defaultProps = {
  undoDescription: "",
  redoDescription: "",
  undoDisabled: true,
  redoDisabled: true,
};
