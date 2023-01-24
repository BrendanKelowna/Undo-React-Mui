import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Undo, { UndoProps } from "../Undo";
import useUndoState, { UndoObj } from "../UndoState";

//* Mocks
function mockAction() {
  return jest.fn();
}

function mockUndoObj(): UndoObj {
  mockAction();
  return {
    undo: () => Promise.resolve(mockUndoObj()),
    undoDescription: `undo action`,
    redo: () => Promise.resolve(mockUndoObj()),
    redoDescription: `redo action`,
  };
}

function MockAddButton({ add }: { add: (item: UndoObj) => void }) {
  return (
    <button
      data-testid="addBtn"
      type="button"
      name="add"
      onClick={() => add(mockUndoObj())}
    >
      Add
    </button>
  );
}

function MockUndo({ test, ...props }: Partial<UndoProps> & { test: string }) {
  const {
    add,
    undoDescription,
    redoDescription,
    undoDisabled,
    redoDisabled,
    undo,
    redo,
  } = useUndoState();

  return (
    <div>
      <MockAddButton add={add} />
      <Undo
        undo={undo}
        redo={redo}
        redoDisabled={redoDisabled}
        undoDisabled={undoDisabled}
        undoDescription={undoDescription}
        redoDescription={redoDescription}
        {...props}
      />
    </div>
  );
}

describe("Undo tests", () => {
  test("Initial render state", () => {
    //* Setup
    render(<MockUndo test="initial" />);

    //* Elements
    const undoBtn = screen.getByRole("button", {
      name: "Undo",
    }) as HTMLButtonElement;

    const redoBtn = screen.getByRole("button", {
      name: "Redo",
    }) as HTMLButtonElement;

    expect(undoBtn).toBeDisabled();
    expect(redoBtn).toBeDisabled();
  });

  test("Adding undos", async () => {
    //* Setup
    render(<MockUndo test="add" />);

    //* Elements
    const addButton = screen.getByTestId("addBtn") as HTMLButtonElement;

    const undoBtn = screen.getByRole("button", {
      name: "Undo",
    }) as HTMLButtonElement;

    const redoBtn = screen.getByRole("button", {
      name: "Redo",
    }) as HTMLButtonElement;

    userEvent.click(addButton);
    await waitFor(() => expect(undoBtn).toBeEnabled(), { timeout: 500 });
    await waitFor(() => expect(redoBtn).toBeDisabled(), { timeout: 500 });

    userEvent.click(addButton);
    await waitFor(() => expect(undoBtn).toBeEnabled(), { timeout: 500 });
    await waitFor(() => expect(redoBtn).toBeDisabled(), { timeout: 500 });

    userEvent.click(addButton);
    await waitFor(() => expect(undoBtn).toBeEnabled(), { timeout: 500 });
    await waitFor(() => expect(redoBtn).toBeDisabled(), { timeout: 500 });
  });

  test("Exec undos", async () => {
    //* Setup
    render(<MockUndo test="exec" />);

    //* Elements
    const addButton = screen.getByTestId("addBtn") as HTMLButtonElement;

    const undoBtn = screen.getByRole("button", {
      name: "Undo",
    }) as HTMLButtonElement;

    const redoBtn = screen.getByRole("button", {
      name: "Redo",
    }) as HTMLButtonElement;

    userEvent.click(addButton);
    userEvent.click(addButton);
    userEvent.click(addButton);
    await waitFor(() => expect(undoBtn).toBeEnabled(), { timeout: 500 });
    await waitFor(() => expect(redoBtn).toBeDisabled(), { timeout: 500 });

    userEvent.click(undoBtn);
    await waitFor(() => expect(undoBtn).toBeEnabled(), { timeout: 500 });
    await waitFor(() => expect(redoBtn).toBeEnabled(), { timeout: 500 });

    userEvent.click(undoBtn);
    await waitFor(() => expect(undoBtn).toBeEnabled(), { timeout: 500 });
    await waitFor(() => expect(redoBtn).toBeEnabled(), { timeout: 500 });

    userEvent.click(undoBtn);
    await waitFor(() => expect(undoBtn).toBeDisabled(), { timeout: 500 });
    await waitFor(() => expect(redoBtn).toBeEnabled(), { timeout: 500 });
  });

  test("Exec redo", async () => {
    //* Setup
    render(<MockUndo test="redo" />);

    //* Elements
    const addButton = screen.getByTestId("addBtn") as HTMLButtonElement;

    const undoBtn = screen.getByRole("button", {
      name: "Undo",
    }) as HTMLButtonElement;

    const redoBtn = screen.getByRole("button", {
      name: "Redo",
    }) as HTMLButtonElement;

    userEvent.click(addButton);
    userEvent.click(addButton);
    userEvent.click(addButton);
    await waitFor(() => expect(undoBtn).toBeEnabled(), { timeout: 500 });
    await waitFor(() => expect(redoBtn).toBeDisabled(), { timeout: 500 });

    userEvent.click(undoBtn);
    userEvent.click(undoBtn);
    userEvent.click(undoBtn);
    await waitFor(() => expect(undoBtn).toBeDisabled(), { timeout: 500 });
    await waitFor(() => expect(redoBtn).toBeEnabled(), { timeout: 500 });

    userEvent.click(redoBtn);
    await waitFor(() => expect(undoBtn).toBeEnabled(), { timeout: 500 });
    await waitFor(() => expect(redoBtn).toBeEnabled(), { timeout: 500 });

    userEvent.click(redoBtn);
    await waitFor(() => expect(undoBtn).toBeEnabled(), { timeout: 500 });
    await waitFor(() => expect(redoBtn).toBeEnabled(), { timeout: 500 });

    userEvent.click(redoBtn);
    await waitFor(() => expect(undoBtn).toBeEnabled(), { timeout: 500 });
    await waitFor(() => expect(redoBtn).toBeDisabled(), { timeout: 500 });
  });
});
