const Discord = require('discord.js')
const fs = require("fs")
const {
    Player
} = require("discord-player");
const {
    token,
    prefix
} = require("./config.json")
const bot = new Discord.Client({
    disableEveryone: true
});

const player = new Player(bot)
bot.player = player;
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        return console.log("[LOGS] Couldn't Find Commands!");
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`✅ ${f} is succesfully loaded.`);
        bot.commands.set(props.config.name, props);
        let pull = require(`./commands/${f}`);
        bot.commands.set(pull.config.name, pull);
        pull.config.aliases.forEach(alias => {
            bot.aliases.set(alias, pull.config.name)
        });
    });
});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`✅ Succesfully Loaded ${eventName} event.`);
        bot.on(eventName, event.bind(null, bot));
    });
});

bot.on("message", async message => {
    if (message.author.bot || message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    if (!message.content.startsWith(prefix)) return;

    try {
        let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));
        if (commandfile) commandfile.run(bot, message, args);
        if (!commandfile) return;
        console.log(`Server: ${message.guild.name} | Channel: #${message.channel.name} | ${message.author.tag} used ${cmd}`)
    } catch (err) {
        return message.channel.send("**Something is going on.**");
    }
});

bot.login(token)