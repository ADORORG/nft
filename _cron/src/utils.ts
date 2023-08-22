import axios from 'axios';
import * as qs from 'qs';

type MakeApiRequest = {
	url: string,
	method: string,
	body?: any,
	headers?: any,
}

export function makeApiRequest({url, method = 'post', body = {}, headers = {}}: MakeApiRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    let fetchOption = {
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      method,
      url
    } as any;

    const isFormEncoded = fetchOption.headers['Content-Type'] === 'application/x-www-form-urlencoded';
    const isPost = method.toLowerCase() === 'post';
    const isGet = method.toLowerCase() === 'get';

    if (isGet) {
      fetchOption.params = body;
    }
     
    if (isPost && isFormEncoded) {
      fetchOption.data = qs.stringify(body);
   
    } else if (isPost) {
      fetchOption.data = {...body};
    }

    axios(fetchOption)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}