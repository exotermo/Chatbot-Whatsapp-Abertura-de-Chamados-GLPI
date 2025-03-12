const axios = require('axios');

// Configuração API do GLPI
const GLPI_URL = 'Exemplo: http://192.168.1.10/apirest.php/'; // URL do servidor onde o GLPI está hospedado.
const APP_TOKEN = 'Exemplo: 4pQ03DSdAyY7kbmOf0UGQ0CqGnUQjMqyyEuFr1JD';
const USER_TOKEN = 'Exemplo: 1Apui0x7gF9hGHlgYJfItoKm0vrG6kZVzzDeKbxO';
/*
APP_TOKEN e USER_TOKEN: Tokens usados para autenticação com a API do GLPI, garantindo que o bot tenha permissão para interagir com o sistema.
*/

/*
    IMPORTANTE: As informações acima (APP_TOKEN, USER_TOKEN) são sensíveis e devem ser mantidas em segurança.
    **Nunca** as armazene diretamente no código-fonte ou em repositórios públicos. 

    Recomendação: Encriptar esses tokens e armazená-los em variáveis de ambiente ou arquivos de configuração seguros
    que não sejam versionados no controle de código-fonte (como arquivos `.env` ou gerenciadores de segredos).

    **Falhas em proteger essas informações podem comprometer a segurança do seu sistema e permitir acesso não autorizado.**
*/

const GLPI_ENTITY_ID = 0; // Identifica a entidade (se estiver usando múltiplas empresas no GLPI, senão, usa 0)



// Função para obter um Token de Sessão no GLPI
async function getGlpiSession() {
    console.log("[INFO] Solicitando token de sessão do GLPI...");
    const startTime = Date.now();

    try {
        const response = await axios.get(`${GLPI_URL}/initSession`, {
            headers: {
                'App-Token': APP_TOKEN,
                'Authorization': `user_token ${USER_TOKEN}`
            }
        });

        const duration = Date.now() - startTime;
        console.log(`[SUCESSO] Token de sessão obtido em ${duration}ms.`);
        return response.data.session_token;
    } catch (error) {
        console.error("[ERRO] Falha ao iniciar sessão no GLPI:", error.response?.data || error.message);
        return null;
    }
}

// Função para criar um chamado no GLPI
async function createGlpiTicket(name, setor, descricao) {
    console.log(`[INFO] Criando chamado no GLPI para ${name}...`);

    const startTime = Date.now();

    const sessionToken = await getGlpiSession();
    if (!sessionToken) {
        console.error("[ERRO] Não foi possível obter o token de sessão.");
        return null;
    }

    try {
        const response = await axios.post(
            `${GLPI_URL}/Ticket`,
            {
                input: {
                    name: `Suporte TI | BOT - ${name}`,
                    content: `Setor: ${setor}\n\nDescrição: ${descricao}`,
                    entities_id: GLPI_ENTITY_ID,
                    status: 1 // Status: Novo
                }
            },
            {
                headers: {
                    'Session-Token': sessionToken,
                    'App-Token': APP_TOKEN,
                    'Authorization': `user_token ${USER_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const duration = Date.now() - startTime;

        console.log(`[SUCESSO] Chamado #${response.data.id} criado em ${duration}ms.`);

        return response.data.id;

    } catch (error) {
        console.error("[ERRO] Falha ao criar chamado no GLPI:", error.response?.data || error.message);
        return null;
    }
}

module.exports = {
    createGlpiTicket
};
