const axios = require('axios');

module.exports = ({ method, baseURL, path, body, query, headers }) => {
  return axios({
    method,
    baseURL,
    url: path,
    data: body,
    headers,
    params: query,
  });
};
