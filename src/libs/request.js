export function requestData(url, callback){
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status === 200) {
        callback(JSON.parse(request.responseText));
    } else {
        console.warn(JSON.stringify(e));
        callback(e);
    }
  };
  request.open('GET', url);
  request.send();
}

export function requestDataPost(url, params, callback){
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status === 200) {
      callback(JSON.parse(request.responseText));
    } else {
      console.warn('posterror');
    }
  };
  request.open('POST', url);
  request.send(params);
}
