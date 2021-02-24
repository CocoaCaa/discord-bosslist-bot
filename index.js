require('dotenv').config();
const config = require('./config.json');

const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const PREFIX = config.prefix;
const bossChannelID = config.bossChannelID;

//'0 0 * * MON'
var CronJob = require('cron').CronJob;
var job = new CronJob('0 0 * * MON', function() {
  sendBossMessage();
}, null, true, 'Asia/Taipei');

job.start();
bot.login(TOKEN);

bot.on('ready', () => {
  console.info("Discord SiuMui online");
    fetchBossChannel()
    .then(()=>{
      console.log("Successful found channel");
    })
    .catch(()=>{
      console.log("Boss channel is not found! Fix your config.");
      bot.destroy();
    })
});

function fetchBossChannel(){
  return new Promise((resolve, reject) => {
      let bossChannel = bot.channels.cache.get(bossChannelID);
      (bossChannel !== undefined)? resolve(bossChannel) : reject(new Error());
  });
}

async function fetchBossMessage(){
  let bossChannel = await fetchBossChannel();
  await bossChannel.messages.fetchPinned()
  .then((messages)=>{
    return messages.filter(message => message.author === bot.user).first();
  })
  .catch(error=>{
    bossChannel.send("No old boss message found!");
    return error;
  })
}

async function fetchEmote(){
  let data = {
      "A":[],
      "B":[],
      "C":[],
      "D":[],
      "E":[],
      "F":[],
      "G":[],
  }

  let message = await fetchBossMessage()
  .then(async(message)=>{

   await message.reactions.resolve("🇦").users.fetch()
   .then(userList=>{
    data.A = userList.filter(user=>!user.bot).map(user=>user.username);
    })

   await message.reactions.resolve("🇧").users.fetch()
   .then(userList=>{
    data.B = userList.filter(user=>!user.bot).map(user=>user.username);
   })

   await message.reactions.resolve("🇨").users.fetch()
   .then(userList=>{
    data.C = userList.filter(user=>!user.bot).map(user=>user.username);
   })

   await message.reactions.resolve("🇩").users.fetch()
   .then(userList=>{
    data.D = userList.filter(user=>!user.bot).map(user=>user.username);
   })

  await message.reactions.resolve("🇪").users.fetch()
   .then(userList=>{
    data.E = userList.filter(user=>!user.bot).map(user=>user.username);
   })

   await message.reactions.resolve("🇫").users.fetch()
   .then(userList=>{
    data.F = userList.filter(user=>!user.bot).map(user=>user.username);
   })

   await message.reactions.resolve("🇬").users.fetch()
   .then(userList=>{
    data.G = userList.filter(user=>!user.bot).map(user=>user.username);
   })
 })
 .catch(error=>{
    return error;
 })

  return JSON.stringify(data);
}

async function sendBossMessage(){
  let bossChannel = await fetchBossChannel();
  let oldBossMessage = await fetchBossMessage();

  let bossMessage  = "@everyone 新的一周開始了!!\r\n";
      bossMessage += "請給反應你要哪隻boss~\r\n";
      bossMessage += "🇦 : 寒冰魔女\r\n";
      bossMessage += "🇧 : 森法王\r\n";
      bossMessage += "🇨 : 夢魘虛影\r\n";
      bossMessage += "🇩 : 淵海噬者\r\n";
      bossMessage += "🇪 : 元素魔方\r\n";
      bossMessage += "🇫 : 幻雪守衛\r\n";
      bossMessage += "🇬 : 荒漠亡靈\r\n";

    console.log(oldBossMessage.content);
    await oldBossMessage.unpin();
    await bossChannel.send(bossMessage)
      .then(async(newMessage)=>{
        await newMessage.pin();
        await newMessage.react("🇦");
        await newMessage.react("🇧");
        await newMessage.react("🇨");
        await newMessage.react("🇩");
        await newMessage.react("🇪");
        await newMessage.react("🇫");
        await newMessage.react("🇬");
      })         
}

bot.on('message', msg => {

  if(!msg.content.startsWith(PREFIX)){return;}
  if(msg.author.bot){return;}

  let command = msg.content.slice(PREFIX.length,msg.content.length);
    
  switch(command){

    case "boss":{
        fetchEmote()
        .then(ret => {
          msg.channel.send(ret);
        });
      break;
    }

    case "message":{
      if(msg.member.hasPermission('ADMINISTRATOR')){
        sendBossMessage();
      }
      else{
        msg.channel.send("No permission!");
      }
      break;
    }


  }
});

/*
const http = require("http");
const host = 'localhost';
const port = 8080;

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", process.env.ALLOW_DOMAIN);
    res.writeHead(200);

    fs.readFile('messageID.txt', function(err, data) {
        if(err){
            return console.log(err);
        }
        fetchEmote(data.toString())
        .then(ret => {
          res.end(ret);
        });
      });
    
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`HTTP Server is running on http://${host}:${port}`);
});

*/
