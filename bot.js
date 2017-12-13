var telegram = require('node-telegram-bot-api');
var emoji = require('node-emoji');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test');
const usersStorageFile = 'users.json';
const token = '358469384:AAHYQ-NrDsfR6vbNf19pa1wflp56TIr4N_U';
var api = new telegram(token,{
    updates: {
        enabled: true,
        get_interval: 100
    },
    polling: true
});
const message = {
    error: emoji.emojify("Oh, no! :sob: An error has occured! Please, try again later... "),
    start: emoji.emojify("Please, enter /remind if you are ready to add event! :wink:")
};
var db =	mongoose.connection;
db.on('error',	function	(err)	{
    console.log('connection	error:',	err.message);
});
db.once('open',	function	callback	()	{
    console.log("Connected	to	DB!");
});
var userSchema = new Schema({
    id: String,
    events: [{
        event: String,
        time: Date
    }],
    state: Number
});
var UserModel = mongoose.model('UserModel',userSchema);
function userExists(id,callback){
    UserModel.findOne({id: id}, function (err, foundUser) {
        if (err) {
            callback(err, null);
            return;
        }
        if (foundUser) {
            callback(null, false);
        } else {
            callback(null, true);
        }
    });
}
function saveUser(id,callback){
    userExists(id,function(err,result){
        if(err){
            callback(err,null);
            return;
        }
        if(result){
            var newUser = new UserModel({
                id: id,
                events: [],
                state: 0
            });
            newUser.save(function(err){
                if(err){
                    callback(err,null);
                }else{
                    callback(null,true);
                }
            });
        }else{
            callback(null,false);
        }
    });
}
api.onText(/\/start/,function (message,match) {
    var userId = message.hasOwnProperty('chat') ? message.chat.id : message.from.id;
    saveUser(userId,function (err,reult){
        if(err){
            api.sendMessage()
        }
    });
});
api.onText(/\/remind/, function (message) {
    var clientId = message.hasOwnProperty('chat') ? message.chat.id : message.from.id;
    state=1;
    api.sendMessage(message.chat.id,emoji.emojify("Okay! Please, enter the name of the event :smile:"));
});
function checkTime(time){

}
api.on('message', function (message) {
    var clientId = message.hasOwnProperty('chat') ? message.chat.id : message.from.id;
    if(message.text.charAt(0)==='/')
        return;
    console.log(message);
    var text = message.text;
    var userId = message.chat.id;

    // It'd be good to check received message type here
    // And react accordingly
    // We consider that only text messages can be received here

    if (message.hasOwnProperty('text')) {
        switch(state) {
            case 0:
                api.sendMessage(userId, "Are you ready to create event? Please, enter /remind");
                break;
            case 1://event
                state = 2;
                api.sendMessage(userId, emoji.emojify("Great! Now enter the date :clock2: in this format YY-MM-DD-HH-MM"));
                event = text;
                break;
            case 2://time
                if (dateIsOkay(text)) {
                    state = 3;
                    time = text;
                    api.sendMessage(userId, emoji.emojify("Very nice! Now you can enter the number of repeats or /finish"));
                } else {
                    api.sendMessage(userId, emoji.emojify("The format is incorrect :sad: Please, enter the date like this YY-MM-DD-HH-MM"));
                }
                break;
            case 3://number and interval
                var str = text.split(" ");
                if(parseInt(str[0])<0&&dateIsOkay(str[1])){
                    state = 4;
                    if(number>1)
                        dublicateEvents(parseInt(str));
                }
                state = 4;
                break;
            case 4:
                break;

        }
    } else if (message.hasOwnProperty('sticker')) {
        //TODO send random sticker
        console.log('Sticker');
    }
});

function addToDB(events){
    //TODO
}

function dateIsOkay(text){
    /*var time = text.split("-").reverse();
    var date;
    var now = new Date();
    switch(time.length){
        case 1:
            if(!validateMinutes(time[0]))
                return false;
            hours+=(time[0]<now.getMinutes())?1:0;
            var days = now.get
            if(hours>23){
                hours-=24;

            }
            date = new Date(now.getYear(),now.getMonth(),now.getDate(),hours,time[0],0,0);
            break;
    }*/
    return true;
}
function validateMinutes(text){
    minutes = parseInt(text);
    if(minutes<0||minutes>59)
        return false;
    return true;
}
var fs = require('fs');

fs.readFile(usersStorageFile, 'utf8', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        var users = JSON.parse(data).users;
        users.forEach(function (t) {
            //sendTextMessage(t.id, t.username + ' - чистый пидор');
        })

    }
});

function addEvent(userId, eventInfo, startTime, endTime){
    fs.readFile(usersStorageFile, function(err, data){
        if(err){
            console.log("Event addition error:", err);
        } else{
            var json = JSON.parse(data);
            var user = json.filter(item => item.id === userId)[0];
            user.schedule.push({description: eventInfo, start: startTime, end: endTime});

        }
    })
}

function addNewUser(user) {
    fs.readFile(usersStorageFile, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var before = JSON.parse(data);
            var isNew = before.users.some(item => item.id === user.id);
            //console.log('some',before.users.some(item => item.id===user.id));
            if (!isNew) {
                before.users.push({id: user.id, username: user.username, schedule: []});
                fs.writeFile(usersStorageFile, JSON.stringify(before), function (err) {
                    console.log("json output error: ",err);
                })
            }
        }
    })
}

function sendTextMessage(receiverId, messageText) {
    try {
        api.sendMessage({
            chat_id: receiverId,
            text: messageText
        })
    } catch (err) {
        console.log(err);
    }
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

