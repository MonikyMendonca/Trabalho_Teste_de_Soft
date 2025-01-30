import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [{ duration: '10s', target: 10 }],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 500']
    }
};

export default function () {
    const USER = 'testuser@mail.com';
    const WRONG_PASS = 'wrongpassword123'; // Senha incorreta
    const BASE_URL = 'https://test-api.k6.io';

    // Tentativa de login com senha incorreta
    const res = http.post(`${BASE_URL}/user/login/`, {
        email: USER,
        password: WRONG_PASS,
    });

    // Verifica se a resposta tem status 401 (erro de autenticação)
    const isLoginFailed = check(res, {
        'login falhou': (r) => r.status === 401,
    });

    // Se o login falhou (status 401), podemos tratar esse erro
    if (isLoginFailed) {
        // Registro de erro no console
        console.error(`Erro de login: Usuário com email ${USER} tentou fazer login com senha incorreta.`);
    } else {
        // Caso o login seja bem-sucedido (status 200), podemos confirmar
        console.log(`Login bem-sucedido para o usuário ${USER}.`);
    }

    // Caso o status seja diferente de 401, tomamos ações específicas
    if (res.status !== 401) {
        console.log(`Status recebido: ${res.status}. Detalhes da resposta:`, res.body);
        // Se o status for 403 ou 500, pode ser interessante logar essas informações também.
        if (res.status === 403) {
            console.error('Erro: Acesso proibido (403).');
        } else if (res.status === 500) {
            console.error('Erro: Problema interno do servidor (500).');
        }
    }

    sleep(1);
}
