const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responde com 'Olá!'"),
    
    async execute(interection) {
        await interection.reply("'Olá!")
    }
}
