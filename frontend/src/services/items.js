import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/items';

async function fetchItemsFromAPI({ signal, query, limit, page }) {
  const params = { q: query, limit, page };

  const response = await axios.get(BASE_URL, { params, signal });
  return response.data;
}

async function postItemToAPI(itemData) {
  try {
    const response = await axios.post(BASE_URL, itemData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { fetchItemsFromAPI, postItemToAPI };
