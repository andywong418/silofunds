var models = require('../models');

module.exports = {
  index: function(req, res) {
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      var funds = funds.map(function(fund) {
        var json = fund.toJSON();
        return json;
      });

      res.render('search', { funds: funds });
    });
  },

  search: function(req, res) {
    var searchString = req.body.tags;
    var age = req.body.age
    var amount = req.body.amount;
    console.log(age);
    if(age == ''){

      models.sequelize.query("SELECT * from funds WHERE ? % ANY(tags) AND maximumamount >= ? ;", {replacements: [searchString, amount], type: models.sequelize.QueryTypes.SELECT}
    
    ).then(function(funds) {
      
      res.render('search', { funds: funds });
    });

    }

    if(amount == ''){

      models.sequelize.query("SELECT * from funds WHERE ? % ANY(tags) AND minimumage >= ?  ;", {replacements: [searchString, age], type: models.sequelize.QueryTypes.SELECT}
    
    ).then(function(funds) {
      
      res.render('search', { funds: funds });
    });

    }
    if(amount == '' && age == ''){
       models.sequelize.query("SELECT * from funds WHERE ? % ANY(tags) ;", {replacements: [searchString], type: models.sequelize.QueryTypes.SELECT}
    
    ).then(function(funds) {
      
      res.render('search', { funds: funds });
    });

    }
    if(searchString == ''){
      res.render('error')
    }

      models.sequelize.query("SELECT * from funds WHERE ? % ANY(tags) AND minimumage >= ? AND maximumamount >= ? ;", {replacements: [searchString, age, amount], type: models.sequelize.QueryTypes.SELECT}
    
    ).then(function(funds) {
      
      res.render('search', { funds: funds });
    });
    
    
  }
}