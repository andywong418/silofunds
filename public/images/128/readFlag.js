var fs = require('fs');
var flagArray = [];
fs.readdirSync(__dirname).filter(function(file){
  return true;
}).forEach(function(flag){
  // Logger.info(flag);
  if(flag != 'readFlag.js'){
    var flagv = flag.split('.')[0];
    Logger.info(flagv);
    flagArray.push(flagv);
    Logger.info(flagArray.length);
  }
});

flagArray = JSON.stringify(flagArray);

fs.writeFile('helloworld.js', flagArray, function (err) {
  if (err) return Logger.info(err);
  Logger.info('flagArray > helloworld.txt');
});

// var file = fs.createWriteStream('helloworld.js');
// file.on('error', function(err) { Logger.info(err); });
// flagArray.forEach(function(country) { file.write(country.join("', '")); });
// file.end();

// var file = fs.createWriteStream('array.txt');
// file.on('error', function(err) { /* error handling */ });
// arr.forEach(function(v) { file.write(v.join(', ') + '\n'); });
// file.end();
