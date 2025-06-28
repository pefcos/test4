import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/items';

async function fetchItemsFromAPI({ signal, query = '', limit = 100, page = 1 }) {
  console.log(query);
  const params = { q: query, limit, page };

  const response = await axios.get(BASE_URL, { params, signal });
  return response.data;
}

export { fetchItemsFromAPI };
