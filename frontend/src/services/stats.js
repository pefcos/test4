import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/stats';

async function fetchStatsFromAPI({ signal, query = '', limit = 100, page = 1 }) {
  const params = { q: query, limit, page };

  const response = await axios.get(BASE_URL);
  return response.data;
}

export { fetchStatsFromAPI };
