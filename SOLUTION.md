# Solution

Document describing approaches to the different tasks.

## Backend

### Task 1: Refactor blocking I/O

In order to refactor the blocking I/O, there were two operations that needed to be turned into async:

- Read a file through `fs.readFileSync()`;
- Write to a file with `fs.writeFileSync()`.

Solving this was relatively simple, as the `fs` module already provides async I/O through the `promises` component.

By changing the import to `const fs = require('fs').promises;`, the operations could be rewritten with the use of `fs.readFile()` and `fs.writeFile()`, combined with `await`. This requires that we make the functions `async`, so the route definitions (and the `readData` function) had to be changed to contain `async` in their definiton.

