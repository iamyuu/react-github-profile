export function username(username) {
  const result = {
    isValid: true,
    error: undefined,
  };

  if (!username) {
    Object.assign(result, {
      isValid: false,
      error: new Error('Field username is required'),
    });
  }

  if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username)) {
    Object.assign(result, {
      isValid: false,
      error: new Error('Invalid username'),
    });
  }

  return result;
}
