// ------------------------------------------------------------------------
// Nome do Projeto: WhatsApp Chatbot - Abertura de Chamados GLPI
//
// Texto Do Autor:
console.log("%cCódigo escrito por: Alexandre - EXOTERMO", "color: green");
console.log("Favor não remover o log!")
//
// Licença: MIT
//
// A permissão é concedida, gratuitamente, para qualquer pessoa que obtenha uma
// cópia deste software e dos arquivos de documentação associados (o "Software"),
// para usar o Software sem restrições, incluindo, sem limitação, os direitos
// de usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e/ou
// vender cópias do Software, e para permitir que as pessoas a quem o Software
// é fornecido o façam, sujeito às seguintes condições:
//
// A cópia do Software deve conter o aviso de copyright acima e esta lista de
// condições, e a seguinte declaração de isenção de responsabilidade:
// ------------------------------------------------------------------------
//
// Código escrito por: Ale
// Data de criação: 01/03/25
// Última modificação: 11/03/25
// Descrição de modificações feitas: Comentários, possibilitando melhor visualização do codigo, e foi subido no github para uso da comunidade.
/* Descrição: 
Este código cria um bot para o WhatsApp que:

    1. Gera um QR code para autenticação no WhatsApp Web.
    2. Oferece um menu de opções para o usuário, que inclui suporte técnico.
    3. Coleta informações do usuário, como nome, setor, e descrição do problema.
    4. Cria um chamado no GLPI para o suporte técnico.
    5. Envia mensagens para o usuário com instruções ou confirmações de criação de chamados.
*/
// ------------------------------------------------------------------------


const qrcode = require('qrcode-terminal'); // define a variavel qrcode, requirindo a biblioteca 'qrcode-terminal' para gerar o QR code de autenticação do WhatsApp Web.
const { Client, MessageMedia } = require('whatsapp-web.js');
/*
Explicação dessa linha 'const { Client, MessageMedia } = require('whatsapp-web.js');' 

'Client' é a classe principal da biblioteca whatsapp-web.js. Ela é responsável por iniciar e gerenciar a conexão com o whatsapp web.
'MessageMedia' é uma classe usada para enviar mídia (imagens, vídeos, áudios) através da biblioteca whatsapp-web.js.

*/

const axios = require('axios'); // define a variavel axios requirindo a biblioteca 'axios' possiblitando fazer requisições HTTP para o GLPI.
/*
axios, possibilita fazer 4 tipos de requisições como:

GET: Para obter dados.
POST: Para enviar dados.
PUT: Para atualizar dados.
DELETE: Para excluir.

*/

const glpi = require('./GLPI');  // Importando as funções do glpi.js

console.log("[INFO] Inicializando o bot..."); // log no terminal

/* caso seja necessario, encaminhe esse console.log para um arquivo.txt em uma pasta estruturada, usando rsyslog
*/

const client = new Client(); // passa a classe client da biblioteca do whats.js que gerenciar a conexão com o whats web
/*
new Client(), está criando um novo objeto que agora pode ser usado para iniciar a comunicação com o WhatsApp.
*/

const userRequests = {}; // Array vazia para armazenar as interações de cada usuário enquanto ele passa pelas etapas de abertura de chamados.

client.on('qr', qr => { 
//  .on('qr', ...) é um ouvinte de evento, ele está esperando um evento específico chamado qr. Esse evento é disparado sempre que um novo QR Code é gerado pelo WhatsApp Web para a autenticação.
    console.log("[INFO] QR Code gerado, escaneie com o WhatsApp."); // log no terminal
    qrcode.generate(qr, { small: true }); 
    /*
    qrcode.generate recebe o conteúdo do QR Code (qr) 
    e o exibe no terminal. O parâmetro { small: true } faz com que o QR Code seja gerado em um formato menor, para que se ajuste melhor ao terminal
    */
});

client.on('ready', () => {
    /*
    .on('ready', ...) 
    configura o bot para ouvir quando a conexão com o WhatsApp foi feita com sucesso. 
    Quando isso ocorre, a função fornecida dentro do () => {} é executada.
    */
    console.log("[INFO] Tudo certo! WhatsApp conectado."); // log no terminal de confirmação
});

client.initialize(); // inicializa a instancia do whatsapp

// Delay para simular digitação
const delay = ms => new Promise(res => setTimeout(res, ms));

client.on('message', async msg => {

    console.log(`[DEBUG] Mensagem recebida: "${msg.body}" de ${msg.from}`); // log de depuração no terminal

    if (!msg.from.endsWith('@c.us')) {
        console.log(`[IGNORADO] Mensagem de grupo de ${msg.from}`);
        return;
    }

    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const name = contact.pushname || "Usuário";
    const userId = msg.from;
    const userMessage = msg.body.trim();

    console.log(`[DEBUG] Mensagem processada: "${userMessage}"`);


    // Mensagem do menu com a logo
    if (/^\/?suporte\s*$/i.test(userMessage)) {

        console.log(`[MATCH] Reconhecido como comando de menu por ${userId}`); // logo no terminal

        const logo = MessageMedia.fromFilePath('logo.png'); // Envia a logo.png no corpo da mensagem

        console.log(`[DEBUG] Sessão 1 do código - *Menu principal*`);
        await client.sendMessage(msg.from, logo, { caption: `🌍 *Seu nome ** - Suporte de TI* 🛠️\n\nOlá, ${name}! Sou o seu assistente virtual do suporte técnico. Como posso te ajudar hoje? Digite uma opção:\n\n1️⃣ - Problemas com Wi-Fi\n2️⃣ - Problemas com login\n3️⃣ - Impressora não imprime\n4️⃣ - Solicitar suporte técnico` });
        
        console.log(`[ENVIADO] Menu enviado para ${userId}`);

        return;

    } else if (userMessage === '1') {
        await responder(chat, msg.from, `📡 *Problemas com Wi-Fi*\n\n1. Verifique se o roteador está ligado.\n2. Reinicie seu dispositivo.\n3. Caso o problema persista, entre em contato com o suporte blablabalabla....`);
    
    } else if (userMessage === '2') {
        await responder(chat, msg.from, `🔐 *Problemas com login*\n\n1. Verifique se o CAPS LOCK está ativado.\n2. Tente redefinir sua senha.\n3. Caso o problema continue, abra um chamado com o suporte blablabalabla....`);
   
    } else if (userMessage === '3') {
        await responder(chat, msg.from, `🖨️ *Impressora não imprime*\n\n1. Verifique se há papel e tinta no equipamento.\n2. Reinicie a impressora e tente novamente.\n3. Caso continue com erro, entre em contato com o suporte blablabalabla....`);
   
    } else if (userMessage === '4') {
        console.log(`[INFO] Iniciando processo de suporte para ${msg.from}.`);
        console.log('Sessão 2 do código - iniciando suporte de abertura de chamado')
        await delay(50);
        await chat.sendStateTyping();
        /*
        Aguarda 50 milisegundos para 'fingir' escrever.
        */ 
        await delay(50);
        // Aguarda mais 50 milisegundos para enviar.
        await client.sendMessage(msg.from, "🔧 Olá! Bem-vindo ao Suporte TI da *seu nome* 🏗️\n\nPor favor, informe seu *nome* para prosseguir."); 
        console.log('Mensagem de suporte')
        userRequests[msg.from] = { step: 1 };
        return;
    }

    // Coleta nome
    if (userRequests[msg.from]?.step === 1) {
        userRequests[msg.from].name = msg.body;
        userRequests[msg.from].step = 2;
        console.log(`[INFO] Nome coletado: ${msg.body}`);
        await delay(50);
        await chat.sendStateTyping();
        await client.sendMessage(msg.from, "Agora informe o *setor* onde você trabalha.");
        return;
    }

    // Coleta setor
    if (userRequests[msg.from]?.step === 2) {
        userRequests[msg.from].setor = msg.body;
        userRequests[msg.from].step = 3;
        console.log(`[INFO] Setor coletado: ${msg.body}`);
        await delay(50);
        await chat.sendStateTyping();
        await client.sendMessage(msg.from, "Por último, descreva o problema que está enfrentando.");
        return;
    }

    // Coleta descrição do problema e cria o chamado
    if (userRequests[msg.from]?.step === 3) {
        userRequests[msg.from].descricao = msg.body;
        console.log(`[INFO] Descrição coletada: ${msg.body}`);
        await delay(50);
        await chat.sendStateTyping();
        await client.sendMessage(msg.from, "⏳ Criando seu chamado no sistema... Aguarde um momento.");

        // Envia os dados para o GLPI
        const ticketId = await createGlpiTicket(
            userRequests[msg.from].name,
            userRequests[msg.from].setor,
            userRequests[msg.from].descricao
        );

        if (ticketId) {
            console.log(`[SUCESSO] Chamado criado com ID #${ticketId} para ${msg.from}.`);
            await client.sendMessage(msg.from, `✅ Seu chamado foi aberto com sucesso! Número do ticket: *#${ticketId}* 🎫\n\nNossa equipe entrará em contato em breve.`);
        } else {
            console.error("[ERRO] Falha ao criar o chamado no GLPI.");
            await client.sendMessage(msg.from, "❌ Ocorreu um erro ao criar seu chamado. Por favor, tente novamente mais tarde.");
        }

        delete userRequests[msg.from];
        return;
    
    } else {
        console.log(`[DEBUG] Mensagem não reconhecida: "${userMessage}"`);
        await responder(chat, msg.from, `❓ Não entendi sua solicitação. Digite 'menu' para ver as opções.`);
    }
});


async function responder(chat, user, text) {
    await delay(30);
    await chat.sendStateTyping();
    await delay(30);
    await client.sendMessage(user, text);
}
    