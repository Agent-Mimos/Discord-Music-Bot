const Discord = require("discord.js");
const {
    Player
} = require("discord-player");

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES", "ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("You don't have permissions"));

    if (!message.member.voice.channel) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(`You're not in a voice channel`));

    if (!bot.player.isPlaying(message.guild.id)) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(`There's no music playing in this server`));

    bot.player.stop(message.guild.id);

    message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setTitle(`Music stopped`));
};

module.exports.config = {
    name: "stop",
    aliases: [],
    description: ''
}