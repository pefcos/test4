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

I chose the file watcher approach, so this way, we only recalculate stats when the relevant files have actually changed. This code quickly became too complex for the route file, so I've decided to implement a Service pattern by creating a module in `services/statsService.js`. This module is responsible for watching the files (in a non blocking way), and storing the latest stats calculation result. This service then uses the provided but previously unreferenced `utils/stats.js` function `mean`, to encapsulate the mean calculation.

The file watching is handled by `chokidar`, to ensure consistent behavior across platforms and reliability.

### Task 3: Testing

I've added Jest test to all routes, including happy paths and error cases, using mocking to mimic the behavior of other classes and utilities. I've configured GitHub Actions CI to run the test suite on pushing to main.

After the frontend interface was completed, I've implemented testing there as well, and added it to the CI. I've opted not to strictly test page contents because in the future, the layout may be subject to change and this may break the tests and make UI improvements and re-stylings more difficult. However, classes that have behavior such as displaying a spinner when loading or handling fetches and contents from the context provider, all have been tested.

## Frontend

### Task 1: Memory Leak

The memory leak was caused by the component unmounting before the fetch completed, triggering an update to an already unmounted component. To avoid this, I used a `AbortController` to abort a request if the component is no longer mounted.

### Task 2: Pagination and Searching

This task triggered a lot of refactors around my backend, as it introduced complex logic for filtering and querying. My `routes/items.js` file was no longer clean and idiomatic, this also broke the principle of single responsability. To address this I've moved data querying logic to a Repository class.

Validation was also implemented in a separate validator module, again, following SOLID principles. For searching, the basic and simple approach is to have a search field, where the user can first type a prompt and manually submit after they're done. This approach looks less interactive from a UI standpoint, but it is lighter on backend API usage. The React context makes this very easy to split into a separate component as well, since we don't need to worry about the data flow between components, which would make the code cluttered and hard to understand. The search will have a function associated with it in our `DataContext`, where it handles fetching data with the right query and sets the page to 1, after all, the page count is dependant on the number of results from the filter, so it wouldn't make sense to keep it from a previous search query.

To make code cleaner and make responsabilities clear in code, I've also split the functions that deal directly with data fetching from the backend into their own files, under the `services` directory. This approach allows us to properly setup parameter passing to our fetch in JS, without polluting our `DataContext`.

At this point, I had to make a decision regarding the way we fetch items from the backend. I decided to import `axios` as a library to make building the requests more maintainable and idiomatic. Using a `fetch` (as previously used on the initial state of this repository) wouldn't be a problem in this project, since it contains just 3 parameters to pass to the get request (`q`, `limit` and `page`), however, thinking in terms of scalability, I find axios to be the best approach to handle building requests with many parameters. If the application is to be scalable, it would probably be best to have a base already using axios, which is best suited for large and complex parametrized request building. Apart from that, axios also has native support for `AbortController` (which we use to prevent the React memory leak from resolve after unmount), and it is syntactically cleaner.

As consequence, the stats service (even though it has no complicated parameter building), has also been ported to use `axios`. This was made to ensure code consistency.

Pagination was made through a component and the state of pagination was kept in the `DataProvider` context. I've opted to make page count fixed, but the repository came with 500 items per page as a default, so in order to showcase the component working, I've reduced it to 200 (since I have 1000 rows of mock data). The Pagination component could be made generic and put under a shared `components` or `utils` directory, but for simplicity, I've decided to implement a `Items` specific pagination component, as there are currently no other places to use pagination in. In order to be able to paginate smoothly and stop the user from paginating further than the last page with results, I've changed the API to provide an object instead of an array, containing the total number of elements matching the query filter. This way, the pagination component can prevent the user from visiting pages without any content.

### Task 3: Performance

I've decided to use `react-window` to solve this problem. Since react-window doesn't integrate well with tables, I've refactored the components into a list, which can be made scrollable and integrates well with virtualization.

### Task 4: UI/UX

I've installed bootstrap in the frontend project, because it is a library I'm used to working with and it provides several mechanisms that are responsive by nature, while not being as complex and verbose as something like Tailwind. After that, I've restructured the application.

The Navbar was divided into its own component in order to make the code of `App.js` more concise, and the `LoadingSpinner.js` component was created, so it can be used by all the other components that might need to fetch data (now or in the future), if we decide to implement more components or other views. Apart from that, the bootstrap classes were applied to style the pages in the application.

For the `/` route, which displays the items, I've noticed that the API provided both `category`, `price` and `id` information, so I thought it was a good idea to display those to our user as well, so the user can quickly identify the category and prices of the items. I've also opted to only display the id in the `itemDetails` view, since those need to have a reason to be clicked as well, and the ID wouldn't look as good in the item list.

Since the `stats` endpoint of the API was not being used, I've implemented a small stats component in the item listing. Also, the `Items.js` component quickly became too big, so I've split it into three smaller components, one for the item list, another for the stats, and yet another one for the searching feature. Each of them will take care of their own behavior, without concerning about the features of the surrounding components. Within the context component, I've avoided exposing state mutations directly, instead opting for `useCallback`, as it encapsulates state change logic.

## Other Improvements

### Fetch call on Item List

The call to `fetch` in the `ItemDetail` component was fetching from the frontend URL. I've changed the fetch call to include the full URL for the backend, just like implemented in the `DataProvider`.

### Item listing

To adequately showcase the `react-window` working as well as justifying the use of pagination, I've expanded the dataset using (Mockaroo)[https://www.mockaroo.com/] to generate 1000 mock items in the desired format.

### Unused endpoints

Some of the backend endpoints weren't being used by the frontend, so I decided to give them an application. The unused endpoints that were given a role are:

1. `GET /api/stats` - The `pages/items/ItemsStats` component fetches from the stats api to display the stats on item listing.
2. `POST /api/items` - The `pages/NewItem` component adds a form for the user to register new items in the application.

### Component directory structuring

I've divided pages and components in two different directories. Pages are directly associated with routes in the frontend router, while components are parts that compose those pages. This makes the code more organized. Also, in a larger application, more pages would be contemplated in the router, so it makes sense to group pages in directories in relation to what kind of data they relate to. All the pages implemented relate to items, so I grouped them under the `pages/items` directory.
