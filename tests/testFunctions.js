var request = require('supertest');
var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
var app = require('../app.js')
var models = require('../models')
var sequelize = require('../models').sequelize;
var server = request.agent(app);
var expect = chai.expect;
var should = chai.should();
chai.use(sinonChai)

module.exports = {
  logSuppress: function() {
    beforeEach(function() {
      // var stub = sinon.stub(console, 'log')
      var loggerInfo = sinon.stub(Logger, 'info')
      var loggerWarn = sinon.stub(Logger, 'warn')
      var loggerDebug = sinon.stub(Logger, 'debug')
      var loggerTime = sinon.stub(Logger, 'time')
      var loggerError = sinon.stub(Logger, 'error')
    });
    afterEach(function() {
      // console.log.restore();
      Logger.info.restore();
      Logger.warn.restore();
      Logger.debug.restore();
      Logger.time.restore();
      Logger.error.restore();
    });
  },

  route: function(route) {
    it(route + ' returns status 200', function(done) {
      if (route === '/results') this.timeout(10000);
      request(app).get(route).end(function(err, res) {
        expect(res.status).to.equal(200);
        done(err);
      });
    });
  },

  passportRoute: function(route, status) {
    it(route + ' returns status ' + status, function(done) {
      server
        .get(route)
        .expect(status)
        .end(function(err, res) {
          if (err) return done(err);
          done()
      })
    })
  },

  fakeUserLogin: function(email) {
    it('Login fake user', function() {
      return function(done) {
        server
          .post('/login')
          .send({email: email, password: 'password'})
          .expect('Location', 'loginSplit')
          .expect(302)
          .end(onResponse);
        function onResponse(err, res) {
          if(err) return done(err)
          return done();
        }
      }
    })
  },

  fakeOrganisationLogin: function() {
    it('Login fake organisation', loginOrganisation())
  },

  postgres: function() {
    it('should have access to postgres', function(done) {
      sequelize.authenticate().then(function(err, res) {
        if(err) return done(err);
        done();
      })
    });
  },

  loginRedirect: function(route) {
    it('should redirect to login', function(done) {
    request(app)
      .get(route)
      .expect(302)
      .expect('Location', '/login')
      .end(function(err, res) {
        if (err) return done(err);
        done();
      })
    })
  },

  userCreation: function() {
    it('should register a user', function(done) {
      this.timeout(3000);
      models.users.destroy({where: {email: 'test@silofunds.com'}}).then(function() {
      request(app)
        .post('/register')
        .send({firstName: 'Test',
          lastName: 'Test',
          fundName: '',
          email: 'test@silofunds.com',
          password: 'password',
          confirmPassword: 'password'
        })
        .expect(302)
        .expect('Location', '/signup/verify')
        .end(function(err, res) {
          if(err) return done(err)
          done()
        })
      })
    })
  }
}




// Functions used above


function loginOrganisation() {
  return function(done) {
    server
      .post('/login')
      .send({email: 'testorganisation@silofunds.com', password: 'password'})
      .expect(302) // We expect a 302 since we are actually going to loginSplit which renders nothing
      .expect('Location', 'loginSplit')
      .end(onResponse);
    function onResponse(err, res) {
      if(err) return done(err)
      return done();
    }
  }
}
