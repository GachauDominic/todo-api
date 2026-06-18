import http from 'k6/http';
import {check, sleep} from 'k6'

const BASE_URL = 'http://localhost:8080';

export const options = {
  stages: [
    {duration:'30s' , target: 500},
    {duration:'30s' , target: 1000},
    {duration:'50s' , target: 2000},
    {duration:'20s' 
      , target: 500},
    {duration:'10s' , target: 0}
  ],

  ext: {
    loadImpact: {
      name : 'Register a User',
    },
  },
}

function randomEmail(): string{
  return `user${Math.floor(Math.random()*1000000)}@example.com`
}

export default function () {
  const payload  = JSON.stringify({
    "firstName": "Ceo",
    "lastName": "Founder",
    "email": randomEmail(),
    "password": "ceo123",
    "role": "admin"
  });

  const token  = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwNCwidXNlci1pZCI6MTA0LCJmaXN0LW5hbWUiOiJkb20iLCJsYXN0LW5hbWUiOiIyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzc0NDUxMzcwLCJpYXQiOjE3NzQzNjQ5NzB9.oYbQXnIJwefOee5pt4x20Mqieat1dUdHa2AQaEBrt_U`;

  const res = http.get(`${BASE_URL}/auth/register`, {
  
    headers: {
      'Content-Type': 'application/json',
      'Aurhorization': `Bearer ${token}`
    },
  }) ;

  check(res, {
    'status is 201': (r)=> r.status === 201,
    'has data a message': (r)=> {
      try {
        const body = JSON.parse(r.body as string)
        return typeof body.message !== undefined
      } catch {
        return false
      }
    }
  })  
}
