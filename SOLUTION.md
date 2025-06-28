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

I chose the file watcher approach, so this way, we only recalculate stats when the relevant files have actually changed. This code quickly became too complex for the route file, so I've decided to implement a Service pattern by creating a module in `services/statsService.js`. This module is responsible for watching the files (in a non blocking way), and storing the latest stats calculation result. This service then uses the provided but previously unreferenced `utils/stats.js` function `mean`, to encapsulate the mean calculation.

### Task 3: Testing

I've added Jest test to all routes, including happy paths and error cases, using mocking to mimic the behavior of other classes and utilities.

## Frontend

### Task 1: Memory Leak

The memory leak was caused by the component unmounting before the fetch completed, triggering an update to an already unmounted component. To avoid this, I used a `AbortController` to abort a request if the component is no longer mounted.

### Task 2: Pagination and Searching

This task triggered a lot of refactors around my backend, as it introduced complex logic for filtering and querying. My `routes/items.js` file was no longer clean and idiomatic, this also broke the principle of single responsability. To address this I've moved data querying logic to a Repository class.

Validation was also implemented in a separate validator module, again, following SOLID principles. For searching, the basic and simple approach is to have a search field, where the user can first type a prompt and manually submit after they're done. This approach looks less interactive from a UI standpoint, but it is lighter on backend API usage. The React context makes this very easy to split into a separate component as well, since we don't need to worry about the data flow between components, which would make the code cluttered and hard to understand.

### Task 4: UI/UX

I've installed bootstrap in the frontend project, because it is a library I'm used to working with and it provides several mechanisms that are responsive by nature, while not being as complex and verbose as something like Tailwind. After that, I've restructured the application.

The Navbar was divided into its own component in order to make the code of `App.js` more concise, and the `LoadingSpinner.js` component was created, so it can be used by all the other components that might need to fetch data (now or in the future), if we decide to implement more components or other views. Apart from that, the bootstrap classes were applied to style the pages in the application.

For the `/` route, which displays the items, I've noticed that the API provided both `category`, `price` and `id` information, so I thought it was a good idea to display those to our user as well, so the user can quickly identify the category and prices of the items. I've also opted to only display the id in the `itemDetails` view, since those need to have a reason to be clicked as well, and the ID wouldn't look as good in the item list.

Since the `stats` endpoint of the API was not being used, I've implemented a small stats component in the item listing. Also, the `Items.js` component quickly became too big, so I've split it into three smaller components, one for the item list, another for the stats, and yet another one for the searching feature. Each of them will take care of their own behavior, without concerning about the features of the surrounding components.

## Other Improvements

### Fetch call on Item List

The call to `fetch` in the `ItemDetail` component was fetching from the frontend URL. I've changed the fetch call to include the full URL for the backend, just like implemented in the `DataProvider`.

### Item listing

To adequately showcase the `react-window` working as well as justifying the use of pagination, I've expanded the dataset using (Mockaroo)[https://www.mockaroo.com/] to generate 1000 mock items in the desired format.
