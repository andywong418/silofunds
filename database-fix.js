var models = require('./models');
var async = require('async')

models.funds.findAll().then(function(funds){
//trim and turn to lower case
  async.each(funds, function(fund, callback){
    var id = fund.dataValues.id;
    var tags = fund.dataValues.tags;
    for (j = 0; j < tags.length; j++){
      tags[j] = tags[j].trim();
      tags[j] = tags[j].toLowerCase();
    }
    models.funds.findById(id).then(function(fund){
      fund.update({
        tags: tags
      }).then(function(fund){
        callback();
      })
    })
  })

  //Remove redundancies between tags and subject,degree,etc
//   async.each(funds, function(fund, callback){
//     var id = fund.dataValues.id;
//     var tags = fund.dataValues.tags;
//
//     if(fund.dataValues.subject){
//       var subject = fund.dataValues.subject.split(',');
//       for (i = 0; i < tags.length; i++){
//         for (j = 0; j < subject.length; j++){
//           if (tags[i] == subject[j]){
//             tags.splice( i, 1 );
//           }
//         }
//       }
//       models.funds.findById(id).then(function(fund){
//         fund.update({
//           tags: tags
//         }).then(function(){
//           callback();
//         })
//       })
//     }
//     else{
//       callback();
//     }
//
// //Turn single string into array
// async.each(funds, function(fund,callback){
//   var id = fund.dataValues.id;
//   var tags = fund.dataValues.tags;
//   var subject = fund.dataValues.university;
//
//   if(subject[0]) {
//     subject = subject[0].split(',');
//     models.funds.findById(id).then(function(fund){
//       fund.update({
//         university: subject
//       }).then(function(){
//         callback();
//       })
//     })
//   }
//   else {
//     callback()
//   }
// })

// var id = funds[10].dataValues.id;
// var tags = funds[10].dataValues.tags;
// var subject = funds[50].dataValues.subject;
// if(subject){
//   subject = subject[0].split(',');
//   console.log(subject)
// }

})
