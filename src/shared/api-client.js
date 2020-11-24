const API_URL = process.env.REACT_APP_API_URL;

export function client(endpoint, customConfig = {}) {
  const config = {
    method: 'GET',
    ...customConfig,
  };

  return window.fetch(`${API_URL}${endpoint}`, config).then(async response => {
    const result = await response.json();
    return response.ok ? result : Promise.reject(result);
  });
}
