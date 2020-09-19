const Discord = require("discord.js");
const {
    Player
} = require("discord-player");

module.exports.run = async (bot, message, args) => {
    if (!message.member.voice.channel) return message.channel.send(new Discord.MessageEmbed().setDescription(`You're not in a voice channel`).setColor("RED"));

    let query = args.join(" ");
    if (!query) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(`Please enter a song name or a link`));

    const searchTracks = await bot.player.searchTracks(query).catch(e => {
        return message.channel.send(`No results found`)
    });

    if (searchTracks.length < 1) return message.channel.send(`No results found`)

    let track = searchTracks[0];

    const aTrackIsAlreadyPlaying = bot.player.isPlaying(message.guild.id);

    if (aTrackIsAlreadyPlaying) {
        const result = await bot.player.addToQueue(message.guild.id, track);

        if (!result) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(`This song provider is not supported or doesn't exist`));

        if (result.type === 'playlist') {
            await message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setTitle("Music Queue").setDescription(`\`${result.tracks.length}\` songs added to the queue :musical_note:`));
        } else {
            await message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setTitle("Music Queue").setDescription(`[${result.name}](${result.url}) added to the queue :musical_note:`).setThumbnail(`${result.thumbnail}`).setTimestamp());
        }
    } else {
        const result = await bot.player.play(message.member.voice.channel, track).catch(() => {});

        if (!result) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(`This song provider is not supported or doesn't exist`));

        if (result.type === 'playlist') {
            await message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setTitle("Music Queue").setDescription(`${result.tracks.length} songs added to the queue :musical_note:\nCurrently playing: \`${result.tracks[0].name}\` 🎵`));
        } else {
            await message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setTitle("Playing").setDescription(`[${result.name}](${result.url})`).setThumbnail(`${result.thumbnail}`).setTimestamp());
        }

        const queue = bot.player.getQueue(message.guild.id)

            .on('trackChanged', (oldTrack, newTrack) => {
                message.channel.send(new Discord.MessageEmbed().setColor("#2F3136").setTitle("Now playing").setDescription(`[${newTrack.name}](${newTrack.url})`).setThumbnail(`${newTrack.thumbnail}`).setTimestamp());
            })

            .on('end', () => {
                message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(`There is no more music in the queue`));
            })

            .on('channelEmpty', () => {
                message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(`Stop playing, there is no more member in the voice channel`));
            })
    }
};

module.exports.config = {
    name: "play",
    aliases: [],
    description: ''
}