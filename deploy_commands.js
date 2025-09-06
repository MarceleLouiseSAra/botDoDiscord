// Roda uma vez só quando há novos comandos, algum é deletado ou atualizado

const { REST, Routes } = require('discord.js')

const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

// importação dos comandos 

const fs = require('node:fs'); // módulo nativo para manipulação de arquivos
const path = require('node:path'); // módulo nativação para navegar entre diretórios

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")); // garante que todos os arquivos manipulados sejam arquivos .js

const commands = [];

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// instância REST
const rest = new REST({version: "10"}).setToken(TOKEN);

// deploy
(async () => {

    try {
        console.log(`Resetando ${commands.length} comandos...`);
        
        // PUT
        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            {body: commands}
        );

        console.log("Comandos  registrados com sucesso!")
    } catch (error) {
        console.error(error)
    }
})();