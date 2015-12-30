var notifier = require('node-notifier');

function notify(message) {
  var icon = path.join(__dirname, 'analyevent.png');
  notifier.notify({
    icon: icon,
    title: 'Radium',
    message: message
  });
}

module.exports.notify = notify;
