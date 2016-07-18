var fs = require('fs');
var flagArray = [];
fs.readdirSync(__dirname).filter(function(file){
  return true;
}).forEach(function(flag){
  // console.log(flag);
  if(flag != 'readFlag.js'){
    var flagv = flag.split('.')[0];
    console.log(flagv);
    flagArray.push(flagv);
    console.log(flagArray.length);
  }
});

flagArray = JSON.stringify(flagArray);

fs.writeFile('helloworld.js', flagArray, function (err) {
  if (err) return console.log(err);
  console.log('flagArray > helloworld.txt');
});

// var file = fs.createWriteStream('helloworld.js');
// file.on('error', function(err) { console.log(err); });
// flagArray.forEach(function(country) { file.write(country.join("', '")); });
// file.end();

// var file = fs.createWriteStream('array.txt');
// file.on('error', function(err) { /* error handling */ });
// arr.forEach(function(v) { file.write(v.join(', ') + '\n'); });
// file.end();
