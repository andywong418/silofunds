var Logger = require('js-logger');

Logger.useDefaults();

var timestampHandler = Logger.createDefaultHandler({
  formatter: function(messages, context) {
    // prefix each log message with a timestamp.
    var timeNow = new Date().toISOString();
    timeNow = timeNow.split('T')[1].slice(0, -2);
    messages.unshift('[ ' + timeNow + ' ]');
  }
});

Logger.setHandler(function (messages, context) {
    timestampHandler(messages, context);
});

if (process.env.NODE_ENV === 'production') {
  Logger.setLevel(Logger.WARN);
}

module.exports = Logger;
