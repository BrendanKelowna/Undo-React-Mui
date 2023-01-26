import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Undo from "../Undo";
import {
  UndoContextAdd,
  UndoContextState,
  UndoProvider,
  useUndoAddContext,
  useUndoContext,
} from "../UndoContext";
import useUndo, { UndoObj, UndoState } from "../useUndo";

//* Mocks
type MockServices = {
  service: () => void;
  undoService: () => void;
  redoService: () => void;
};

function mockServices(services?: MockServices) {
  return {
    service: services?.service ?? jest.fn(),
    undoService: services?.undoService ?? jest.fn(),
    redoService: services?.redoService ?? jest.fn(),
  };
}

function mockUndoObj(
  { undoService, redoService }: MockServices = mockServices()
): UndoObj {
  return {
    undo: () => Promise.resolve(undoService()),
    undoDescription: `undo action`,
    redo: () => Promise.resolve(redoService()),
    redoDescription: `redo action`,
  };
}

function MockUndoWithState({ state }: { state: UndoState }) {
  const newState = useUndo();
  Object.assign(state, newState);

  return (
    <Undo
      undo={newState.undo}
      redo={newState.redo}
      undoDescription={newState.undoDescription}
      redoDescription={newState.redoDescription}
      undoDisabled={newState.undoDisabled}
      redoDisabled={newState.redoDisabled}
    />
  );
}

function MockUndoWithContext({
  state,
  service,
}: {
  state: UndoContextState;
  service: { add: UndoContextAdd };
}) {
  const newState = useUndoContext();
  Object.assign(state, newState);

  const newService = { add: useUndoAddContext() };
  Object.assign(service, newService);

  return <Undo {...newState} />;
}

describe("Undo tests", () => {
  test("Initial render state", () => {
    //* Setup
    const state = {} as UndoState;
    render(<MockUndoWithState state={state} />);

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

  describe("Undo state test", () => {
    test("Adding undos", async () => {
      //* Setup
      const state = {} as UndoState;
      render(<MockUndoWithState state={state} />);

      //* Elements
      const undoBtn = screen.getByRole("button", {
        name: "Undo",
      }) as HTMLButtonElement;

      const redoBtn = screen.getByRole("button", {
        name: "Redo",
      }) as HTMLButtonElement;

      act(() => state.add(mockUndoObj()));
      expect(undoBtn).toBeEnabled();
      expect(redoBtn).toBeDisabled();

      act(() => state.add(mockUndoObj()));
      expect(undoBtn).toBeEnabled();
      expect(redoBtn).toBeDisabled();

      act(() => state.add(mockUndoObj()));
      expect(undoBtn).toBeEnabled();
      expect(redoBtn).toBeDisabled();
    });

    test("Exec undos", async () => {
      //* Setup
      const services = [mockServices(), mockServices(), mockServices()];
      const state = {} as UndoState;
      render(<MockUndoWithState state={state} />);

      //* Elements
      const undoBtn = screen.getByRole("button", {
        name: "Undo",
      }) as HTMLButtonElement;

      const redoBtn = screen.getByRole("button", {
        name: "Redo",
      }) as HTMLButtonElement;

      act(() => state.add(mockUndoObj(services[0])));
      act(() => state.add(mockUndoObj(services[1])));
      act(() => state.add(mockUndoObj(services[2])));

      expect(undoBtn).toBeEnabled();
      expect(redoBtn).toBeDisabled();

      await userEvent.click(undoBtn);
      expect(services[2].undoService).toHaveBeenCalledTimes(1);
      expect(undoBtn).toBeEnabled();
      expect(redoBtn).toBeEnabled();

      await userEvent.click(undoBtn);
      expect(services[1].undoService).toHaveBeenCalledTimes(1);
      expect(undoBtn).toBeEnabled();
      expect(redoBtn).toBeEnabled();

      await userEvent.click(undoBtn);
      expect(services[0].undoService).toHaveBeenCalledTimes(1);
      expect(undoBtn).toBeDisabled();
      expect(redoBtn).toBeEnabled();
    });

    test("Exec redo", async () => {
      //* Setup
      const services = [mockServices(), mockServices(), mockServices()];
      const state = {} as UndoState;
      render(<MockUndoWithState state={state} />);

      //* Elements
      const undoBtn = screen.getByRole("button", {
        name: "Undo",
      }) as HTMLButtonElement;

      const redoBtn = screen.getByRole("button", {
        name: "Redo",
      }) as HTMLButtonElement;

      act(() => state.add(mockUndoObj(services[0])));
      act(() => state.add(mockUndoObj(services[1])));
      act(() => state.add(mockUndoObj(services[2])));

      expect(undoBtn).toBeEnabled();
      expect(redoBtn).toBeDisabled();

      await userEvent.click(undoBtn);
      await userEvent.click(undoBtn);
      await userEvent.click(undoBtn);
      expect(undoBtn).toBeDisabled();
      expect(redoBtn).toBeEnabled();

      await userEvent.click(redoBtn);
      expect(services[0].redoService).toHaveBeenCalledTimes(1);
      expect(undoBtn).toBeEnabled();
      expect(redoBtn).toBeEnabled();

      await userEvent.click(redoBtn);
      expect(services[1].redoService).toHaveBeenCalledTimes(1);
      expect(undoBtn).toBeEnabled();
      expect(redoBtn).toBeEnabled();

      await userEvent.click(redoBtn);
      expect(services[2].redoService).toHaveBeenCalledTimes(1);
      expect(undoBtn).toBeEnabled();
      expect(redoBtn).toBeDisabled();
    });
  });
  describe("Undo Context tests", () => {
    test("Make sure context works", async () => {
      //* Setup
      const services = mockServices();
      const contextServices = {} as { add: UndoContextAdd };
      const state = {} as UndoContextState;
      render(
        <UndoProvider>
          <MockUndoWithContext state={state} service={contextServices} />
        </UndoProvider>
      );

      //* Elements
      const undoBtn = screen.getByRole("button", {
        name: "Undo",
      }) as HTMLButtonElement;

      const redoBtn = screen.getByRole("button", {
        name: "Redo",
      }) as HTMLButtonElement;

      expect(undoBtn).toBeDisabled();
      expect(redoBtn).toBeDisabled();

      act(() => contextServices.add(mockUndoObj(services)));

      expect(undoBtn).toBeEnabled();
      expect(redoBtn).toBeDisabled();

      await userEvent.click(undoBtn);
      expect(services.undoService).toHaveBeenCalledTimes(1);
      expect(undoBtn).toBeDisabled();
      expect(redoBtn).toBeEnabled();

      await userEvent.click(redoBtn);
      expect(services.redoService).toHaveBeenCalledTimes(1);
      expect(undoBtn).toBeEnabled();
      expect(redoBtn).toBeDisabled();
    });
  });
});
