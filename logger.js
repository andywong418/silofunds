/*************
NOTE:
Consider using winston!
https://github.com/winstonjs/winston
https://medium.com/@garychambers108/better-logging-in-node-js-b3cc6fd0dafd#.d2j3lm3kh
NOTE:
**************/

var Logger = require('js-logger');
var colors = require('colors/safe');

Logger.useDefaults();

var timestampPrepender = Logger.createDefaultHandler({
  formatter: function(messages, context) {
    // prefix each log message with a timestamp.
    var timeNow = new Date().toISOString();
    timeNow = timeNow.split('T')[1].slice(0, -2);

    switch (context.level.name) {
      case 'DEBUG':
        timeNow = colors.blue(timeNow);
        break;
      case 'INFO':
        timeNow = colors.cyan(timeNow);
        break;
      case 'WARN':
        timeNow = colors.yellow(timeNow);
        break;
      case 'ERROR':
        timeNow = colors.red.inverse(timeNow);
        break;
      default:
        timeNow = colors.cyan(timeNow);
    }

    messages.unshift(colors.green('[ ') + timeNow + colors.green(' ]'));
    messages = colors.green(messages[0]);
  }
});

Logger.setHandler(function (messages, context) {
    timestampPrepender(messages, context);
});

if (process.env.NODE_ENV === 'production') {
  Logger.setLevel(Logger.WARN);
}

module.exports = Logger;
