const moment = require('moment');
//organization of messages by components
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}
module.exports = formatMessage;