import http from 'k6/http';
import {check, sleep} from 'k6'

const BASE_URL = 'http://localhost:8080';

export const options = {
  stages: [
        { duration: '20s', target: 500 },   // ramp-up to 500 users
        { duration: '1m', target: 6000 },  // ramp-up to 100 users
        { duration: '20s', target: 500 },  // ramp-up to 200 users
        // { duration: '1m', target: 100 },   // spike to 300 users
        // { duration: '30s', target: 0 },    // ramp-down to 0 users
   
  ],

  ext: {
    loadImpact: {
      name : 'Todos GET BreakPoint Test',
    },
  },
}

export default function () {
  const res = http.get(`${BASE_URL}/todos`, {
      headers: {
        'Content-Type': 'application/json',
        // 'Aurhorization': `Bearer ${token}
      },
  }) ;

  check(res, {
    'status is 200': (r)=> r.status === 200,
    'has data array': (r)=> {
      try {
        const body = JSON.parse(r.body as string)
        return Array.isArray(body.data);
      } catch {
        return false
      }
    }
  })  

  sleep(1);
}
