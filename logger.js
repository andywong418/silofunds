var Logger = require('js-logger');
var colors = require('colors/safe');

Logger.useDefaults();

var timestampHandler = Logger.createDefaultHandler({
  formatter: function(messages, context) {
    // prefix each log message with a timestamp.
    var timeNow = new Date().toISOString();
    timeNow = timeNow.split('T')[1].slice(0, -2);
    messages.unshift(colors.green('[ ') + colors.cyan(timeNow) + colors.green(' ]'));
  }
});

Logger.setHandler(function (messages, context) {
    timestampHandler(messages, context);
});

if (process.env.NODE_ENV === 'production') {
  Logger.setLevel(Logger.WARN);
}

module.exports = Logger;
