import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [{ duration: '10s', target: 10 }],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 500']
    }
}

export default function () {
    const USER = 'testuser@mail.com';
    const WRONG_PASS = 'wrongpassword123'; // Senha incorreta
    const BASE_URL = 'https://test-api.k6.io';
    
    // Tentativa de login com senha incorreta
    const res = http.post(`${BASE_URL}/user/login/`, {
        email: USER,
        password: WRONG_PASS,
    });

    // Verifica se a resposta tem status 401, que indica erro de autenticação
    check(res, {
        'login falhou': (r) => r.status === 401,
    });

    // Caso o erro de login ocorra, um log será impresso
    if (res.status === 401) {
        console.log(`Erro de login: Usuário com email ${USER} tentou fazer login com senha incorreta.`);
    }

    sleep(1);
}