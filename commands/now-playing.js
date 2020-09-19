const Discord = require("discord.js");
const {
    Player
} = require("discord-player");

module.exports.run = async (bot, message, args) => {
    if (!message.member.voice.channel) return message.channel.send(new Discord.MessageEmbed().setDescription(`You're not in a voice channel`).setColor("RED"));

    if (!bot.player.isPlaying(message.guild.id)) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(`There's no music playing in this server`));

    const song = await bot.player.nowPlaying(message.guild.id);

    message.channel.send(new Discord.MessageEmbed().setColor("BLUE").setDescription([
        `Now Playing: [${song.name}](${song.url})\n`,
        `[${bot.player.createProgressBar(message.guild.id)} ${song.duration}]`,
    ]).setThumbnail(`${song.thumbnail}`));
}

module.exports.config = {
    name: "np",
    aliases: ["now-playing", "nowplaying", "now", "playing"],
    description: ''
}