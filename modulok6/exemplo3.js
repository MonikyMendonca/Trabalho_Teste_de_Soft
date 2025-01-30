import http from 'k6/http'; // Biblioteca para requisições HTTP
import { check, sleep } from 'k6'; // Funções para verificações e pausa

// Configuração do teste (opções de carga)
export const options = {
    stages: [{ duration: '10s', target: 10 }], // 10 usuários por 10 segundos
    thresholds: {
        checks: ['rate > 0.95'], // 95% de sucesso
        http_req_failed: ['rate < 0.01'], // Menos de 1% de falhas
        http_req_duration: ['p(95) < 500'] // 95% das requisições < 500ms
    }
}

export default function () {
    const USER = `${Math.random()}@mail.com`; // E-mail único
    const PASS = 'user123'; // Senha
    const BASE_URL = 'https://test-api.k6.io'; // URL da API

    console.log(USER + PASS); // Exibe o usuário e senha

    // Envia requisição POST para registrar usuário
    const res = http.post(`${BASE_URL}/user/register/`, {
        username: USER, first_name: 'crocrodilo', last_name: 'dino', email: USER, password: PASS
    });

    check(res, { 'sucesso ao registar': (r) => r.status === 201 }); // Verifica se status é 201

    sleep(1); // Pausa de 1 segundo
}
