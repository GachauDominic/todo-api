import http from 'k6/http';
import {check, sleep} from 'k6'

const BASE_URL = 'http://localhost:8080';

export const options = {
  stages: [
    {duration:'20s' , target: 15}, //ramp-up to 40 users over 30 sec
    {duration:'30s' , target: 25}, //stay at 50 users over 40 sec
    {duration:'10s' , target: 0} //ramp-down to 0 users over the last 10 sec
  ],

  ext: { //ext=extensions
    loadImpact: {
      name : 'Todos GET Load Test',
    }
  }
}

export default function (){
  //If verification is required add a valid Token here
  // const token  = ``;
  const res = http.get(`${BASE_URL}/todos`, {
    headers: {
      'Content-Type': 'application/json',
      // 'Aurhorization': `Bearer ${token}`,
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

}