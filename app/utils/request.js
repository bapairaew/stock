import 'whatwg-fetch';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  if (response.status === 403) {
    window.location.assign('/');
    window.sessionStorage.removeItem('username');
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export default function request(url, options) {
  return fetch(url, Object.assign({ credentials: 'include' }, options))
    .then(checkStatus)
    .then(parseJSON);
}
