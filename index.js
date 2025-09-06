// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
// const { token } = require('./config.json');
const dotenv = require('dotenv');
dotenv.config();
const {TOKEN, CLIENT_ID, GUILD_ID} = process.env;

// importação dos comandos

const fs = require('node:fs'); // módulo nativo para manipulação de arquivos
const path = require('node:path'); // módulo nativação para navegar entre diretórios

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")); // garante que todos os arquivos manipulados sejam arquivos .js

// console.log(commandFiles)

// for (const file of commandFiles) {
//     const filePath = path.join(commandsPath, file);
//     const command = require(filePath);
//     console.log(command);
// }

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()

for (const file of commandFiles) {

    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log("Este comando em $(filepath) está com data ou...")
    }
}

// Login do bot

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Pronto! Login realizado como ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);

// Listener
client.on(Events.InteractionCreate, async interaction =>  {
	
    if (!interaction.isChatInputCommand()) {
        return;
    }

    // console.log(interaction);

    const command = interaction.client.commands.get(interaction.commandName);

    if(!command) {
        console.error("Comando não encontrado!");
        return;
    }

    try {

        await command.execute(interaction);

    } catch (error) {
        console.error(error);
        await interaction.reply("Houve um erro ao executar essse comando!")
    }

});
