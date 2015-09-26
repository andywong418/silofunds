var models = require('../models');

module.exports = {
  index: function(req, res) {
    models.funds.findAll({attributes: ['tags']}).then(function(funds) {
      //store search string in variable
    
     
      var searchString = req.body.tags;
      console.log(searchString);
      var funds = funds.map(function(fund) {
        var json = fund.toJSON();
        
        return json;
      });
      
      var fundTags = [];
      
      for(var i = 0; i<funds.length; i++)
      {
           fundTags.push(funds[i].tags);
       
      }
     
       
     
      
      //filter down to common tags between search string and funds
     var filteredFunds = fundTags.filter(function(value) {
       return value.indexOf(searchString) != -1;
      });
      
      //Select the fund objects from filtered down array
      models.sequelize.query("SELECT * FROM (SELECT * FROM funds WHERE tags in #{filteredFunds}) AS subtable").then(function(funds) {
      // convert funds to arr of JSON objects
      return funds;
   
    });
  

      res.render('search', { funds: funds });
    
    });
  }
};
