const usersStorageFile = 'users.json';

var telegram = require('telegram-bot-api');
var api = new telegram({
    token: '358469384:AAHYQ-NrDsfR6vbNf19pa1wflp56TIr4N_U',
    updates: {
        enabled: true,
        get_interval: 500
    }
});

api.on('message', function (message) {
    console.log(message);
    var chat_id = message.chat.id;

    // It'd be good to check received message type here
    // And react accordingly
    // We consider that only text messages can be received here

    if (message.hasOwnProperty('text')) {
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
        api.sendPhoto({
            chat_id: message.chat.id,
            caption: message.text ? message.text : 'This message doesn\'t contain text',
            photo: "https://images.ua.prom.st/549282580_w640_h640_cid369720_pid39929267-cf203b20.jpg"
        });
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
})

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



