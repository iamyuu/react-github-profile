const API_URL = process.env.REACT_APP_API_URL;

export default function client(
  endpoint,
  { data, headers: customHeaders, ...customConfig } = {}
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  };

  return window.fetch(`${API_URL}${endpoint}`, config).then(async response => {
    const data = await response.json();
    return response.ok ? data : Promise.reject(data);
  });
}
