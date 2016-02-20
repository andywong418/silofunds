// https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/
var request = require('supertest');
require = require('really-need');
var expect = require('expect.js');
var should = require('should');

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

  it('404s everything else', function testPath(done) {
    request(server).get('/foo/bar').end(function(err, res) {
      res.status.should.equal(404);
      done(err);
    });
  });
});
