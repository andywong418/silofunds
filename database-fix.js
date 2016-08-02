var models = require('./models');
var async = require('async')

models.funds.findAll().then(function(funds){
//trim and turn to lower case
  // async.each(funds, function(fund, callback){
  //   var id = fund.dataValues.id;
  //   var tags = fund.dataValues.tags;
  //   for (j = 0; j < tags.length; j++){
  //     tags[j] = tags[j].trim();
  //     tags[j] = tags[j].toLowerCase();
  //   }
  //   models.funds.findById(id).then(function(fund){
  //     fund.update({
  //       tags: tags
  //     }).then(function(fund){
  //       callback();
  //     })
  //   })
  // })

  //Remove redundancies between tags and subject,degree,etc
  // async.each(funds, function(fund, callback){
  //   var id = fund.dataValues.id;
  //   var tags = fund.dataValues.tags;
  //
  //   if(fund.dataValues.subject){
  //     var subject = fund.dataValues.subject;
  //     for (j = 0; j < subject.length; j++){
  //         tags.push(subject[j]);
  //     }
  //     models.funds.findById(id).then(function(fund){
  //       fund.update({
  //         tags: tags
  //       }).then(function(){
  //         callback();
  //       })
  //     })
  //   }
  //   else{
  //     callback();
  //   }
  // })
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

// async.each(funds, function(fund, callback){
//   var id = fund.dataValues.id;
//   var name = fund.dataValues.title.toLowerCase();
//   if(name.indexOf("scholarship") > -1){
//     models.funds.findById(id).then(function(fund){
//       fund.update({
//         support_type: "scholarship"
//       }).then(function(){
//         callback()
//       })
//     })
//   }
//   else if(name.indexOf("bursar") > -1){
//     models.funds.findById(id).then(function(fund){
//       fund.update({
//         support_type: "bursary"
//       }).then(function(){
//         callback();
//       })
//     })
//   }
//   else if(name.indexOf("grant") > -1){
//     models.funds.findById(id).then(function(fund){
//       fund.update({
//         support_type: "grant"
//       }).then(function(){
//         callback();
//       })
//     })
//   }
//   else if(name.indexOf("prize") > -1){
//     models.funds.findById(id).then(function(fund){
//       fund.update({
//         support_type: "prize"
//       }).then(function(){
//         callback();
//       })
//     })
//   }
//   else{
//     models.funds.findById(id).then(function(fund){
//       fund.update({
//         support_type: "grant"
//       }).then(function(){
//         callback()
//       })
//     })
//   }
// })

//get rid of religion
async.each(funds, function(fund,callback){
  fund = fund.get();
  var religion = fund.religion;
  var id = fund.id;

  if(religion) {
    models.funds.findById(id).then(function(fund){
      fund.update({
        religion: null
      }).then(function(){
        callback();
      })
    })
  }
  else {
    callback()
  }
})

})
