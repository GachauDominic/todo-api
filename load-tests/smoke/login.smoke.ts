import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
  duration: '15s'
}

export default function () {
  const url = 'http://localhost:8080/auth/login';
  const payload  = JSON.stringify({
    email: 'dominicmgachau@gmail.com',
    password: 'dom@gmail.com'
  })
  
  const params = {
    headers:{ //be sure NOT to use the keyword 'Headeres'
      'Content-Type': 'application/json'
    },
  }

  const res = http.post(url, payload, params)

  check(res, {
    'status is 200': (r)=> r.status === 200,
    'response has a token': (r)=> {
      try {
        const body = JSON.parse(r.body as string)
        return typeof body.token === 'string'
      } catch (error) {
        return false
      }
    }
  })
}