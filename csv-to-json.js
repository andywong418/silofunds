var fs = require('fs');
var csv = require('fast-csv');
var arr = [];
fs.createReadStream("goran-funds.csv")
    .pipe(csv())
    .on("data", function(data){
        console.log(data);
        // data = JSON.stringify(data);
        arr.push(data[0]);
    })
    .on("end", function(){
        console.log("done");


        arr = JSON.stringify(arr);

        fs.writeFile("goran-funds.js", arr, function(err) {
          if(err) {
            return console.log(err);
          }

          console.log("The file was saved!");
        });

        console.log(arr.length);
    });
