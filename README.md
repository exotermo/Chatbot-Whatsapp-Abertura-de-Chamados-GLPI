# 😌 WhatsApp Chatbot - Abertura de Chamados GLPI

Este projeto é um chatbot integrado ao WhatsApp que tem como objetivo automatizar o processo de criação de chamados no sistema GLPI (Gestão de Chamados) para a equipe de suporte técnico de acordo com a sua necessidade específica.

## 🔧 Funcionalidades

- 🤖 O bot interage com os usuários do WhatsApp, oferecendo suporte técnico em diferentes áreas. Ex: Wi-Fi, login, impressoras e mais.
- 📝 Criação de chamados no sistema GLPI diretamente via WhatsApp.
- 🧑‍💻 Interface simples e intuitiva, onde o usuário pode interagir com o bot para reportar problemas ou solicitar suporte.
- 🔗 Integração com o GLPI utilizando tokens de sessão para criar tickets com informações detalhadas fornecidas pelos usuários.

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Plataforma de execução para o chatbot.
- **whatsapp-web.js**: Biblioteca para integração com o WhatsApp.
- **axios**: Biblioteca para fazer requisições HTTP para o GLPI.
- **GLPI API**: Sistema de gerenciamento de chamados que o bot utiliza para criar tickets.
- **qrcode-terminal**: Para gerar o QR code de autenticação do WhatsApp Web.

## 📝 Requisitos

Antes de rodar o bot, é necessário ter o Node.js instalado em sua máquina.

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- 📱 Conta no WhatsApp (para escanear o QR code)
- 🔑 Acesso ao servidor GLPI (com a API habilitada) e os dados de configuração (token de aplicação, token de usuário, URL do GLPI)

## ⚙️ Configuração

1. Clone o repositório ou baixe os arquivos do projeto.

   ```bash
   git clone https://github.com/exotermo/Chatbot-Whatsapp-Abertura-de-Chamados-GLPI.git
   cd whatsapp-glpi-chatbot
   npm install
    ```
2. Configure os dados do GLPI no arquivo bot.js:
  ```bash
    -GLPI_URL: URL do servidor GLPI.  
    -APP_TOKEN: Token da aplicação para autenticação na API do GLPI.  
    -USER_TOKEN: Token do usuário para autenticação na API do GLPI.  
    -GLPI_ENTITY_ID: ID da entidade no GLPI (geralmente 0 se não houver multiempresas).
  ```
### ⚠️ Atente-se que se você precisa de uma segurnaça rígida, precisará criptografar essas variaveis...

# 📸 Preparação da Imagem e Execução do Bot

Este guia explica como preparar a imagem que será enviada no comando `/suporte` e como iniciar o bot.

## 🖼️ Preparação da Imagem

O bot enviará uma imagem (logo da empresa) quando o usuário digitar o comando `/suporte`. Para que isso funcione corretamente, siga as etapas abaixo:

1. **Obtenha ou crie a imagem do logo**: A imagem será enviada ao usuário como parte da interação do bot. Ela deve ser salva no formato `.png`.

2. **Renomeie a imagem para `logo.png`**: Para garantir que o bot consiga localizá-la, salve o arquivo de logo com o nome `logo.png`.

3. **Coloque a imagem na raiz do projeto**: Após renomear a imagem, mova o arquivo `logo.png` para a raiz do diretório do seu projeto. Isso é necessário para garantir que o bot consiga acessar e enviar a imagem corretamente.

    O diretório do seu projeto deve ter a seguinte estrutura:

    ```
    /whatsapp-glpi-chatbot
    ├── bot.js
    ├── logo.png
    ├── package.json
    └── node_modules/
    ```

## 🚀 Iniciando o Bot

Agora que a imagem está pronta, você pode iniciar o bot. Siga as etapas abaixo:

1. **Instale as dependências**: Certifique-se de que todas as dependências do projeto estejam instaladas. Se ainda não fez isso, execute o seguinte comando no terminal:

   ```bash
   npm install
2. Inicie o bot: Após a instalação das dependências e preparação da imagem, inicie o bot com o seguinte comando:
   ```bash
   node bot.js

4. Escaneie o QR Code: Ao iniciar o bot, um QR code será gerado no terminal. Abra o WhatsApp no seu celular, vá para "WhatsApp Web" e escaneie o QR code exibido para autenticar o bot.

5. Bot em funcionamento: Depois que a autenticação for concluída com sucesso, o bot estará pronto para interagir com os usuários. Agora, ele pode responder às solicitações de suporte com a imagem de logo e criar chamados no GLPI conforme necessário.

## 💡Melhorias a fazer 

1. 🔒 Adicionar cripografia nas variaveis citadas.
2. 🍪 Gerar cookies da sessão, excluindo a necessidade de relogar toda hora.
3. 🐳 Servidor em docker/container rodando para consumir o minimo do hardware para essa aplicação.

# Previsão de suporte!
## 6 meses, o script todo depende da biblioteca https://wwebjs.dev/, caso a meta atualize o zap, precisará refatorar o codigo.
