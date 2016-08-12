// https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/
var request = require('supertest');
var chai = require('chai')
var sequelize = require('../models').sequelize;
var expect = chai.expect;
var should = chai.should();

describe('environment', function() {
  it('should have access to postgres', function() {
    return sequelize.authenticate();
  });
});

describe('loading express', function() {
  var app;

  beforeEach(function() {
    app = require('../app.js', { bustCache: true });
  });

  it('responds to /', function testSlash(done) {
    request(app).get('/').end(function(err, res) {
      res.status.should.equal(200);
      done(err);
    });
  });

  // Route response
  it('/', routeTester('/'))

  it('404s everything else', function testPath(done) {
    request(app).get('/foo/bar').end(function(err, res) {
      expect(res.status).to.equal(404)
      done(err)
    })
  });


  // Reusable functions
  function routeTester(route) {
    it('returns status 200', function(done) {
      request(app).get(route).end(function(err, res) {
        expect(res.status).to.equal(200);
        console.log('hi')
        done(err);
      })
    })
  }
});
