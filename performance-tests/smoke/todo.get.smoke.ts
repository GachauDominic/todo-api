import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,        // 1 virtual user for smoke test
    iterations: 1, // 1 iteration for quick health check
};

export default function () {
    const url = 'http://localhost:8080/todos';
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyNDgsInVzZXItaWQiOjEyNDgsImZpc3QtbmFtZSI6IkRvbSIsImxhc3QtbmFtZSI6Ik1haXNoIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzgxODE2MTI1LCJpYXQiOjE3ODE3Mjk3MjV9.sQBBs7pAXl0N7npZ-9vjeUIlEcqPZLcDAiKxVChogo0`
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'has data array': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return Array.isArray(body.data);
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}