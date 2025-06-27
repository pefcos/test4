# Solution

Document describing approaches to the different tasks.

## Backend

### Task 1: Refactor blocking I/O

In order to refactor the blocking I/O, there were two operations that needed to be turned into async:

- Read a file through `fs.readFileSync()`;
- Write to a file with `fs.writeFileSync()`.

Solving this was relatively simple, as the `fs` module already provides async I/O through the `promises` component.

By changing the import to `const fs = require('fs').promises;`, the operations could be rewritten with the use of `fs.readFile()` and `fs.writeFile()`, combined with `await`. This requires that we make the functions `async`, so the route definitions (and the `readData` function) had to be changed to contain `async` in their definiton.

### Task 2: Performance

Firstly, I've normalized code layout to use a `try catch` block, just like the items routes. After that, I've added async file I/O to this file as well.

I chose the file watcher approach, so this way, we only recalculate stats when the relevant files have actually changed. This code quickly became too complex for the route file, so I've decided to implement a Service pattern by creating a Singleton in `services/statsService.js`. This class is responsible for watching the files (in a non blocking way), and storing the latest stats calculation result. This service class, in turn, uses the provided but previously unreferenced `utils/stats.js` function `mean`, to encapsulate the mean calculation.

### Task 3: Testing

I've added Jest test to all routes, including happy paths and error cases, using mocking to mimic the behavior of other classes and utilities.

## Frontend

### Task 1: Memory Leak

The memory leak was caused by the component unmounting before the fetch completed, triggering an update to an already unmounted component. To avoid this, I used a `AbortController` to abort a request if the component is no longer mounted.

## Other Problems

### Fetch call on Item List

The call to `fetch` in the `ItemDetail` component was fetching from the frontend URL. I've changed the fetch call to include the full URL for the backend, just like implemented in the `DataProvider`.