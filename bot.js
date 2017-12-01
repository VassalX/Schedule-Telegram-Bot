var telegram = require('telegram-bot-api');
var api = new telegram({
    token: '358469384:AAHYQ-NrDsfR6vbNf19pa1wflp56TIr4N_U',
    updates: {
        enabled: true,
        get_interval: 500
    }
});

api.on('message', function (message) {
    var chat_id = message.chat.id;

    // It'd be good to check received message type here
    // And react accordingly
    // We consider that only text messages can be received here

    api.sendMessage({
        chat_id: message.chat.id,
        text: message.text ? message.text : 'This message doesn\'t contain text'
    })
        .then(function (message) {
            console.log(message);
            addNewUser(message.chat);
        })
        .catch(function (err) {
            console.log(err);
        });
});

var fs = require('fs');

fs.readFile('users.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        var users = JSON.parse(data).users;
        /*users.forEach(function (t) {
            api.sendMessage({
                chat_id: t.id,
                text: t.username + ' - грязный пидор'
            })
        })*/

    }
})

function addNewUser(user) {
    fs.readFile('users.json', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var before = JSON.parse(data);
            var isNew = before.users.some(item => item.id === user.id);
            //console.log('some',before.users.some(item => item.id===user.id));
            if (!isNew) {
                before.users.push({id: user.id, username: user.username});
                fs.writeFile('users.json', JSON.stringify(before), function (err) {
                    throw err;
                })
            }
        }
    })
}



