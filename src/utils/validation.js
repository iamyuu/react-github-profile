export function username(username) {
  if (!username) {
    return {
      isValid: false,
      error: new Error('Field username is required'),
    };
  }

  if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username)) {
    return {
      isValid: false,
      error: new Error('Invalid username'),
    };
  }

  return {
    isValid: true,
    error: undefined,
  };
}
