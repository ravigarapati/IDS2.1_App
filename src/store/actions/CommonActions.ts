import {API, Auth} from 'aws-amplify';
import {showToast} from '../../components/CustomToast';

export const pendingUrl = [];
export const getAccessToken = async () => {
  let token = (await Auth.currentSession()).getAccessToken().getJwtToken();
  return 'Bearer ' + token;
};
export const apiInterceptorForGet = async (
  dispatch,
  path,
  callback,
  errorCallback?,
  APIName?,
  noLoadingScreen?,
) => {
  let apiName = '';
  //const apiName = 'ttnacloudplatform-api';
  if (APIName === '' || APIName === undefined || APIName === null) {
    apiName = 'ttnacloudplatform-api-2.1';
  } else {
    apiName = APIName;
  }
  //const apiName = 'ttnacloudplatform-api-hcBCC';
  if (noLoadingScreen === undefined) {
    turnOnLoader(dispatch, path);
  }

  let accessToken = await getAccessToken();
  let content = {
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store',
      Accept: 'application/json',
    },
  };
  API.get(apiName, path, content)
    .then(response => {
      if (noLoadingScreen === undefined) {
        turnOffLoader(dispatch, path);
      }

      callback(response);
    })
    .catch(error => {
      if (noLoadingScreen === undefined) {
        turnOffLoader(dispatch, path);
      }
      if (errorCallback) {
        if (error.response && error.response.data.error.message) {
          errorCallback(error.response.data.error.message);
        } else {
          errorCallback(error.message);
        }
      } else {
        showToast(error.message, 'error');
      }
    });
};

export const apiInterceptorForGetIDS = async (
  dispatch,
  path,
  callback,
  errorCallback?,
  noLoadingScreen?,
) => {
  let baseurl = 'https://93wcx0em15.execute-api.us-east-1.amazonaws.com/dev'; //'https://tkhhujg681.execute-api.us-east-1.amazonaws.com/testing/';
  turnOnLoader(dispatch, path);
  //let accessToken = 'Bearer eyJraWQiOiJBTDNnVHc4bnFpTGxXVU5neGptcFZcL3RjVEttdU9kRWk1dExkZXdFTnV2ST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmMGY0ZTRhNi1mNTljLTRhOWItODFhNi1jNDAyM2QyYjQ5M2UiLCJjb2duaXRvOmdyb3VwcyI6WyJIb21lT3duZXIiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfWEJSWVAydEVpIiwidmVyc2lvbiI6MiwiY2xpZW50X2lkIjoiNWhwamlrbzBzMW1hNW1qaGRzajhmZjB0ZDciLCJvcmlnaW5fanRpIjoiNDA5MjY3MjUtMmQ4NS00YWNhLTlhZjEtOWE5NmM2MmIzYWE5IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiBwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTY4NjMzMzQzOSwiZXhwIjoxNjg2NDE5ODM5LCJpYXQiOjE2ODYzMzM0MzksImp0aSI6ImFlYjdhZjc0LTE1ZmQtNDE0ZC04YWIyLWE1ODQ4ZGI3OGI1OCIsInVzZXJuYW1lIjoiSURTLVRUTkFfN2ZkNDVlNDctYmM5Mi00MDVlLThiOWMtNWQ1YzMxMzM5NTQ2In0.amsOcuIPMfDmkbGgKnnuTNRcMBapMh9nQasYIWpuYvW0UHnoRqzlJh_wq-MZRDo-XkToxmiREncU10kVuduWHLaqrIl4BbYIVYfmj1OFYMqe9xMKopx0h-32yBH2k27uwZgt7-6tuI5JgW1Yv5Ty2qvLOloU8ZQ3Ruy4MTuaISnClDeixWQOvvsfP0_cf3jNlJtUeFtZckUe2Y9fOh3Bat15WyCjVSiNl0YzS1wvelWNV9bZbrgDfIW19bMkmXk1jC1tUDOeKCpp5IGF4MF1rl1sE4fbBo8zRy5pmtCJRMltYXIBZiuq7CaiRwxBHgCN52aK-vuEj666hClUtLO6lg';
  let accessToken = await getAccessToken();
  if (baseurl.includes('r9nzt6y3ui')) {
    baseurl = baseurl.replace('r9nzt6y3ui', '32q8g5g5sh');
    if (baseurl.includes('development')) {
      baseurl = baseurl.replace('development', 'testing');
    }
    if (path.includes('development')) {
      path = path.replace('development', 'testing');
    }
  }

  let content = {
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store',
      Accept: 'application/json',
    },
  };
  if (noLoadingScreen == undefined) {
    turnOnLoader(dispatch, path);
  }

  return fetch(baseurl + path, {
    method: 'GET',
    headers: content.headers,
  })
    .then(response => response.json())
    .then(json => {
      if (noLoadingScreen == undefined) {
        setTimeout(() => {
          turnOffLoader(dispatch, path);
        }, 1000);
      }
      callback(json);
      return json;
    });
};

export const apiInterceptorForPostIDS = async (
  dispatch,
  baseurl,
  path,
  body,
  callback,
  errorCallback?,
  noLoadingScreen?,
) => {
  //const apiName = 'ttnacloudplatform-api';
  let accessToken = await getAccessToken();
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Cache-Control', 'no-cache, no-store');
  headers.append(
    'Authorization',
    //`Bearer eyJraWQiOiJBTDNnVHc4bnFpTGxXVU5neGptcFZcL3RjVEttdU9kRWk1dExkZXdFTnV2ST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmMGY0ZTRhNi1mNTljLTRhOWItODFhNi1jNDAyM2QyYjQ5M2UiLCJjb2duaXRvOmdyb3VwcyI6WyJIb21lT3duZXIiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfWEJSWVAydEVpIiwidmVyc2lvbiI6MiwiY2xpZW50X2lkIjoiNWhwamlrbzBzMW1hNW1qaGRzajhmZjB0ZDciLCJvcmlnaW5fanRpIjoiNDA5MjY3MjUtMmQ4NS00YWNhLTlhZjEtOWE5NmM2MmIzYWE5IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiBwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTY4NjMzMzQzOSwiZXhwIjoxNjg2NDE5ODM5LCJpYXQiOjE2ODYzMzM0MzksImp0aSI6ImFlYjdhZjc0LTE1ZmQtNDE0ZC04YWIyLWE1ODQ4ZGI3OGI1OCIsInVzZXJuYW1lIjoiSURTLVRUTkFfN2ZkNDVlNDctYmM5Mi00MDVlLThiOWMtNWQ1YzMxMzM5NTQ2In0.amsOcuIPMfDmkbGgKnnuTNRcMBapMh9nQasYIWpuYvW0UHnoRqzlJh_wq-MZRDo-XkToxmiREncU10kVuduWHLaqrIl4BbYIVYfmj1OFYMqe9xMKopx0h-32yBH2k27uwZgt7-6tuI5JgW1Yv5Ty2qvLOloU8ZQ3Ruy4MTuaISnClDeixWQOvvsfP0_cf3jNlJtUeFtZckUe2Y9fOh3Bat15WyCjVSiNl0YzS1wvelWNV9bZbrgDfIW19bMkmXk1jC1tUDOeKCpp5IGF4MF1rl1sE4fbBo8zRy5pmtCJRMltYXIBZiuq7CaiRwxBHgCN52aK-vuEj666hClUtLO6lg`,
    `Bearer ${accessToken}`,
  );
  headers.append('Accept', 'application/json');
  let content = {
    body: body,
    headers: headers,
  };
  if (noLoadingScreen == undefined) {
    turnOnLoader(dispatch, path);
  }

  fetch(baseurl + path, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: headers,
  })
    .then(response => response.json())
    .then(json => {
      if (noLoadingScreen == undefined) {
        turnOffLoader(dispatch, path);
      }
      callback(json);
      return json;
    });
};

export const apiInterceptorForGetCustomApi = async (
  dispatch,
  baseurl,
  path,
  body,
  callback,
  errorCallback?,
  noLoadingScreen?,
) => {
  //const apiName = 'ttnacloudplatform-api';
  let accessToken = await getAccessToken();
  if (baseurl.includes('r9nzt6y3ui')) {
    baseurl = baseurl.replace('r9nzt6y3ui', '32q8g5g5sh');
    if (baseurl.includes('development')) {
      baseurl = baseurl.replace('development', 'testing');
    }
    if (path.includes('development')) {
      path = path.replace('development', 'testing');
    }
  }

  let content = {
    body: body,
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store',
      Accept: 'application/json',
    },
  };
  if (noLoadingScreen == undefined) {
    turnOnLoader(dispatch, path);
  }
  return fetch(baseurl + path, {
    method: 'GET',
    headers: content.headers,
  })
    .then(response => response.json())
    .then(json => {
      if (noLoadingScreen == undefined) {
        setTimeout(() => {
          turnOffLoader(dispatch, path);
        }, 1000);
      }

      callback(json);
      return json;
    });
};

export const apiInterceptorForPostCustomApi = async (
  dispatch,
  baseurl,
  path,
  body,
  callback,
  errorCallback?,
  noLoadingScreen?,
) => {
  //const apiName = 'ttnacloudplatform-api';
  let accessToken = await getAccessToken();

  if (baseurl.includes('r9nzt6y3ui')) {
    baseurl = baseurl.replace('r9nzt6y3ui', '32q8g5g5sh');
    if (baseurl.includes('development')) {
      baseurl = baseurl.replace('development', 'testing');
    }
    if (path.includes('development')) {
      path = path.replace('development', 'testing');
    }
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Cache-Control', 'no-cache, no-store');
  headers.append('Authorization', accessToken);
  headers.append('Accept', 'application/json');
  let content = {
    body: body,
    headers: headers,
  };
  if (noLoadingScreen == undefined) {
    turnOnLoader(dispatch, path);
  }
  console.log(baseurl + path);
  fetch(baseurl + path, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: headers,
  })
    .then(response => response.json())
    .then(json => {
      if (noLoadingScreen == undefined) {
        turnOffLoader(dispatch, path);
      }

      callback(json);
      return json;
    })
    .catch(err => {
      console.log('error', err);
      if (path === '/development/control/temp') {
        apiInterceptorForPostCustomApi(
          dispatch,
          baseurl,
          path,
          body,
          callback,
          null,
          noLoadingScreen,
        );
      }
    });
};

export const apiInterceptorForPost = async (
  dispatch,
  path,
  body,
  callback,
  errorCallback?,
  APIName?,
  noLoadingScreen?,
) => {
  let apiName = '';
  // const apiName = 'ttnacloudplatform-api';
  if (APIName === '' || APIName === undefined || APIName === null) {
    apiName = 'ttnacloudplatform-api-2.1';
  } else {
    apiName = APIName;
  }
  let accessToken = await getAccessToken();
  let content = {
    body: body,
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store',
      Accept: 'application/json',
    },
  };
  if (noLoadingScreen == undefined) {
    turnOnLoader(dispatch, path);
  }

  API.post(apiName, path, content)
    .then(response => {
      turnOffLoader(dispatch, path);
      callback(response);
    })
    .catch(error => {
      if (noLoadingScreen == undefined) {
        turnOffLoader(dispatch, path);
      }
      if (errorCallback) {
        if (error.response && error.response.data.error.message) {
          errorCallback(error.response.data.error.message);
        } else {
          errorCallback(error.message);
        }
      } else {
        showToast(error.message, 'error');
      }
    });
};
export const apiInterceptorForPut = async (
  dispatch,
  path,
  body,
  callback,
  errorCallback?,
  APIName?,
) => {
  // const apiName = 'ttnacloudplatform-api';
  let apiName = '';

  if (APIName === '' || APIName === undefined || APIName === null) {
    apiName = 'ttnacloudplatform-api-2.1';
  } else {
    apiName = APIName;
  }
  let accessToken = await getAccessToken();
  let content = {
    body: body,
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store',
      Accept: 'application/json',
    },
  };

  turnOnLoader(dispatch, path);
  API.put(apiName, path, content)
    .then(response => {
      turnOffLoader(dispatch, path);
      callback(response);
    })
    .catch(error => {
      turnOffLoader(dispatch, path);
      if (errorCallback) {
        if (error.response && error.response.data.error.message) {
          errorCallback(error.response.data.error.message);
        } else {
          errorCallback(error.message);
        }
      } else {
        showToast(error.message, 'error');
      }
    });
};

export const apiInterceptorForDelete = async (
  dispatch,
  path,
  body,
  callback,
  errorCallback?,
  APIName?,
) => {
  // const apiName = 'ttnacloudplatform-api';
  let apiName = '';

  if (APIName === '' || APIName === undefined || APIName === null) {
    apiName = 'ttnacloudplatform-api-2.1';
  } else {
    apiName = APIName;
  }
  turnOnLoader(dispatch, path);
  let accessToken = await getAccessToken();
  let content = {
    body: body,
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store',
      Accept: 'application/json',
    },
  };
  API.del(apiName, path, content)
    .then(response => {
      turnOffLoader(dispatch, path);
      callback(response);
    })
    .catch(error => {
      turnOffLoader(dispatch, path);
      if (errorCallback) {
        if (error.response && error.response.data.error.message) {
          errorCallback(error.response.data.error.message);
        } else {
          errorCallback(error.message);
        }
      } else {
        showToast(error.message, 'error');
      }
    });
};
export const notifyError = value => {
  return async dispatch => {
    dispatch({
      type: 'SHOW_NOTIFICATION',
      data: {type: 'error', text: value, visible: true},
    });
  };
};
const CheckLoader = dispatch => {
  // return async (dispatch) => {
  if (pendingUrl.length > 0) {
    dispatch({
      type: 'SHOW_LOADING',
      data: true,
    });
  } else {
    dispatch({
      type: 'SHOW_LOADING',
      data: false,
    });
  }
  // };
};

export const turnOnLoader = (dispatch, path) => {
  if (!pendingUrl.find(e => e === path)) {
    pendingUrl.push(path);
  }
  CheckLoader(dispatch);
};
export const turnOffLoader = (dispatch, path) => {
  if (pendingUrl.find(e => e === path)) {
    pendingUrl.splice(
      pendingUrl.findIndex(e => e === path),
      1,
    );
    CheckLoader(dispatch);
  }
};

export const openApiInterceptorForGet = async (
  dispatch,
  path,
  callback,
  errorCallback?,
) => {
  const apiName = 'ttnacloudplatform-api-2.1';
  turnOnLoader(dispatch, path);
  //let accessToken = await getAccessToken();
  let content = {
    headers: {
      // Authorization: '',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store',
      Accept: 'application/json',
    },
  };
  API.get(apiName, path, content)
    .then(response => {
      turnOffLoader(dispatch, path);
      callback(response);
    })
    .catch(error => {
      turnOffLoader(dispatch, path);
      if (errorCallback) {
        if (error.response && error.response.data.error.message) {
          errorCallback(error.response.data.error.message);
        } else {
          errorCallback(error.message);
        }
      } else {
        showToast(error.message, 'error');
      }
    });
};

export const apiInterceptorForGetPR = async (
  dispatch,
  path,
  callback,
  errorCallback?,
) => {
  const apiName = 'ttnacloudplatform-api-pr-dev';
  turnOnLoader(dispatch, path);
  let accessToken = await getAccessToken();
  let content = {
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store',
    },
  };
  API.get(apiName, path, content)
    .then(response => {
      turnOffLoader(dispatch, path);
      callback(response);
    })
    .catch(error => {
      turnOffLoader(dispatch, path);
      if (errorCallback) {
        if (error.response && error.response.data.error.message) {
          errorCallback(error.response.data.error.message);
        } else {
          errorCallback(error.message);
        }
      } else {
        showToast(error.message, 'error');
      }
    });
};
export const apiInterceptorForPostPR = async (
  dispatch,
  path,
  body,
  callback,
  errorCallback?,
) => {
  const apiName = 'ttnacloudplatform-api-pr-dev';
  let accessToken = await getAccessToken();
  let content = {
    body: body,
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store',
    },
  };
  turnOnLoader(dispatch, path);
  API.post(apiName, path, content)
    .then(response => {
      turnOffLoader(dispatch, path);
      callback(response);
    })
    .catch(error => {
      turnOffLoader(dispatch, path);
      if (errorCallback) {
        if (error.response && error.response.data.error.message) {
          errorCallback(error.response.data.error.message);
        } else {
          errorCallback(error.message);
        }
      } else {
        showToast(error.message, 'error');
      }
    });
};
