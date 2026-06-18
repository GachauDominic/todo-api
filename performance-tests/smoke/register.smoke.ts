import http from 'k6/http'
import { check, sleep} from 'k6'

export const options = {
  vus: 1,
  iterations: 3,
  duration: '15s'
}
function randomEmail(): string{
  return `user${Math.floor(Math.random()*1000000)}@example.com`
}

export default function () {
  const url = 'http://localhost:8080/auth/register';

  const payload  = JSON.stringify({
    "firstName": "Ceo",
    "lastName": "Founder",
    "email": randomEmail(),
    "password": "ceo123",
    "role": "admin"
  })
  
  const params = {
    headers:{ //be sure NOT to use the keyword 'Headeres'
      'Content-Type': 'application/json'
    }
  }

  const res = http.post(url, payload, params)

  check(res, {
    'status is 201': (r)=> r.status === 201,
    'response has a message': (r)=> {
      try {
        const body = JSON.parse(r.body as string)
        return typeof body.message !== undefined;
      } catch {
        return false
      }
    }
  });

  sleep(2)
}