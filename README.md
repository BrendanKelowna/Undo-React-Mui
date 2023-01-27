# Undo React Mui

A react component, context, and state to give services the ability to undo and redo actions.

## Dependencies

- React
- Mui
- Mui icons

## Usage

Services must return an undo object and then added.

```
const undoObj = {
  undo: () => new Promise(),
  redo: () => new Promise(),
  undoDescription: "Undo Service";
  redoDescription: "Redo Service";
}
```

## License

MIT
