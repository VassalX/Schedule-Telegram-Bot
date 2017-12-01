var telegram = require('telegram-bot-api');
var api = new telegram({
    token: '358469384:AAHYQ-NrDsfR6vbNf19pa1wflp56TIr4N_U',
    updates: {
        enabled: true,
        get_interval: 500
    }
});

api.on('message', function(message)
{
    var chat_id = message.chat.id;

    // It'd be good to check received message type here
    // And react accordingly
    // We consider that only text messages can be received here

    api.sendMessage({
        chat_id: message.chat.id,
        text: message.text ? message.text : 'This message doesn\'t contain text'
    })
        .then(function(message)
        {
            console.log(message);
        })
        .catch(function(err)
        {
            console.log(err);
        });
});
