const usersStorageFile = 'users.json';
var emoji = require('node-emoji');
var telegram = require('telegram-bot-api');
var api = new telegram({
    token: '358469384:AAHYQ-NrDsfR6vbNf19pa1wflp56TIr4N_U',
    updates: {
        enabled: true,
        get_interval: 100
    },
    polling: true
});
api.on('message', function (message) {
    console.log(message);

    // It'd be good to check received message type here
    // And react accordingly
    // We consider that only text messages can be received here

    if (message.hasOwnProperty('text')) {
        var chat_id = message.chat.id;
        /*api.sendMessage({
            chat_id: message.chat.id,
            text: message.text ? message.text : 'This message doesn\'t contain text'
        })
            .then(function (message) {
                //console.log(message);
                addNewUser(message.chat);
            })
            .catch(function (err) {
                console.log(err);
            });*/
        if(message.text==='/start'){
            setTimeout(function () {
                var welcome =  emoji.emojify("Hello, "+message.chat.first_name+" "+message.chat.last_name+"!\n"+
                    "I am your telegram bot! :grin:\n"+
                    "I want to help you to make shedules for your events :clock2:\n" +
                    "Moreover I can notify you :love_letter: so you would never miss your mother in law's birthday! ;3");
                sendTextMessage(message.chat.id,welcome);
            },1000);
            setTimeout(function () {
                api.sendMessage({
                    chat_id:message.chat.id,
                    text:"Would you like to start?",
                    reply_markup:JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'Create event', callback_data: 'start' }]
                        ]
                    })
                })
            },2000);

        }else{
            api.sendPhoto({
                chat_id: message.chat.id,
                caption: message.text ? message.text : 'This message doesn\'t contain text',
                photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Nativity_tree2011.jpg/1200px-Nativity_tree2011.jpg"
            });
        }
    } else if (message.hasOwnProperty('sticker')) {
        console.log('Sticker');
        /*api.sendMessage({
            chat_id:message.chat.id,
            sticker: message.sticker
        }).then(function (message) {
            console.log(message);
            addNewUser(message.chat);
        })
            .catch(function (err) {
                console.log(err);
            });*/
    }
});

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

