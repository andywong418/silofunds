// https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/
var request = require('supertest');
// var expect = require('expect.js');
var expect = require('chai').expect;
var should = require('should');
var sequelize = require('../models').sequelize;

describe('environment', function() {
  it('should have access to postgres', function() {
    return sequelize.authenticate();
  });
});

describe('loading express', function() {
  var server;

  beforeEach(function() {
    server = require('../app.js', { bustCache: true });
  });

  it('responds to /', function testSlash(done) {
    request(server).get('/').end(function(err, res) {
      res.status.should.equal(200);
      done(err);
    });
  });

  it('responds to /results', function() {
    request(server).get('/results').end(function(err, res) {
      res.status.should.equal(200);
      done(err);
    })
  })

  it('404s everything else', function testPath(done) {
    request(server).get('/foo/bar').end(function(err, res) {
      res.status.should.equal(404);
      done(err);
    });
  });
});
