var notifier = require('node-notifier');
var path = require('path');

function notify(message) {
  var icon = path.join(__dirname, 'analyevent.png');
  notifier.notify({
    icon: icon,
    title: 'Radium',
    message: message
  });
}

module.exports.notify = notify;
