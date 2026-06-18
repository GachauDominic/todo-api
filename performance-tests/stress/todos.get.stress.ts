import http from 'k6/http';
import {check, sleep} from 'k6'

const BASE_URL = 'http://localhost:8080';

export const options = {
  stages: [
    {duration:'30s' , target: 500},
    {duration:'30s' , target: 1000},
    {duration:'50s' , target: 2000},
    {duration:'20s' , target: 500},
    {duration:'10s' , target: 0}
  ],

  ext: {
    loadImpact: {
      name : 'Todos GET Stress Test',
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
