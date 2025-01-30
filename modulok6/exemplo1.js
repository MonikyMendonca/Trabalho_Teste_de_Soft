import http from 'k6/http'; // 1 - Importa módulo para requisições HTTP.
import { check } from 'k6'; // 2 - Importa função para validar respostas.

export const options = {  // 3 - Define configurações do teste.
    vus: 1,  // 4 - Define que o teste terá 1 usuário virtual (usuário simulando a requisição).
    duration: '3s', // 5 - Teste de 3 segundos.
    thresholds: { // 6 - Define metas de sucesso.
        checks: ['rate > 0.99'] // 7 - Define que pelo menos 99% das verificações (checks) devem passar para o teste ser bem-sucedido.
    }
}

export default function(){ // 10 - Função principal do teste.
    const BASE_URL = 'https://test-api.k6.io/public/crocodiles/';  // 11 - URL da API.

    const res = http.get(BASE_URL); // 12 - Faz requisição GET.

    check(res, { // 13 - Valida resposta.
        'status code 200': (r) => r.status === 200  // 14 - Verifica se o código de status da resposta é 200, o que indica sucesso.
    });
}