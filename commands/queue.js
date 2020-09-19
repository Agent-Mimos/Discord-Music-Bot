const Discord = require("discord.js");
const {
    Player
} = require("discord-player");

module.exports.run = async (bot, message, args) => {
    if (!message.member.voice.channel) return message.channel.send(new Discord.MessageEmbed().setDescription(`**You're not in a voice channel**`).setColor("RED"));

    const queue = bot.player.getQueue(message.guild.id);

    if (!queue) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(`No songs currently playing`));

    let q = queue.tracks.map((track, i) => {
        return `${i+1}) [${track.name}](${track.url}) __${track.duration}__`
    }).join('\n')

    message.channel.send(new Discord.MessageEmbed().setTimestamp().setColor("BLUE").setTitle("Server queue").setDescription([
        `${q}`,
    ]));
}

module.exports.config = {
    name: "queue",
    aliases: ["list"],
    description: ''
}