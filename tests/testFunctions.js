var request = require('supertest');
var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
var app = require('../app.js')
var models = require('../models')
var data = require('./userData')
var sequelize = require('../models').sequelize;
var server = request.agent(app);
var expect = chai.expect;
var should = chai.should();
chai.use(sinonChai)

// NEW ROUTES MUST BE ADDED HERE!!!!
function userPassportRouteChecks(user) {
  fakeUserLogin(user.email)
  passportRoute('/user/create', 200);
  passportRoute('/user/dashboard', 200);
  passportRoute('/user/profile', 200);
  passportRoute('/user/settings', 200);
  passportRoute('/messages', 200);
}
function organisationPassportRouteChecks(user) {
  fakeOrganisationLogin(user.email)
  passportRoute('/organisation/dashboard', 200);
  passportRoute('/organisation/create', 200);
  passportRoute('/organisation/funding_creation', 200);
  passportRoute('/organisation/funding_creation/scholarship', 200);
  passportRoute('/organisation/funding_creation/bursary', 200);
  passportRoute('/organisation/funding_creation/grant', 200);
  passportRoute('/organisation/funding_creation/prize', 200);
  passportRoute('/organisation/options/' + user.id, 200)
  passportRoute('/organisation/options/' + user.id + '/edit', 200)
  // passportRoute('/organisation/options/' + user.id + '/tips', 200)
  passportRoute('/organisation/get-organisation-info', 200)
  passportRoute('/organisation/settings', 200)
  // passportRoute('/option_creation/' + user.id, 200)
  passportRoute('/messages', 200);
}

module.exports = {
  logSuppress: logSuppress,
  route: route,
  passportRoute: passportRoute,
  fakeUserLogin: fakeUserLogin,
  fakeOrganisationLogin: fakeOrganisationLogin,
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
  },

  minUser: function() {
    before(function() {
      return models.users.findOrCreate({where: {email: data.minUser.email}, defaults: data.minUser}).spread(function(user, created) {
        describe('Test the pages requiring user data', function() {
          logSuppress();
          userPassportRouteChecks(user)
        })
      })
    })
    testRunner();
  },

  fullUser: function() {
    before(function() {
      return models.users.findOrCreate({where: {email: data.fullUser.email}, defaults: data.fullUser}).spread(function(user, created) {
        describe('Test the pages requiring user data', function() {
          logSuppress();
          userPassportRouteChecks(user)
        })
      })
    })
    testRunner();
  },

  minOrganisation: function() {
    before(function() {
      return models.users.findOrCreate({where: {email: data.minOrganisation.email}, defaults: data.minOrganisation}).spread(function(user, created) {
        describe('Test the pages requiring user data', function() {
          logSuppress();
          organisationPassportRouteChecks(user)
        })
      })
    })
    testRunner();
  },

  fullOrganisation: function() {
    before(function() {
      return models.users.findOrCreate({where: {email: data.fullOrganisation.email}, defaults: data.fullOrganisation}).spread(function(user, created) {
        describe('Test the pages requiring user data', function() {
          logSuppress();
          organisationPassportRouteChecks(user)
        })
      })
    })
    testRunner();
  }
}




// Functions used more than once in testing
function passportRoute(route, status) {
  it(route + ' returns status ' + status, function(done) {
    server
      .get(route)
      .expect(status)
      .end(function(err, res) {
        if (err) return done(err);
        done()
    })
  })
}

function fakeUserLogin(email) {
  it('Login fake user', function(done) {
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
  })
}

function testRunner() {
  before(function() {
    sinon.stub(console, 'log')
  })
  after(function() {
    console.log.restore()
  })
  it('', function(done) {
    console.log('')
    done();
  })
}

function logSuppress() {
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
}

function fakeOrganisationLogin(email) {
  it('Login fake organisation', function(done) {
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
  })
}

function route(route) {
  it(route + ' returns status 200', function(done) {
    if (route === '/results') this.timeout(10000);
    request(app).get(route).end(function(err, res) {
      expect(res.status).to.equal(200);
      done(err);
    });
  });
}
