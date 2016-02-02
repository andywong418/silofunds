var request = require('superagent');
var expect = require('expect.js');

describe('Server', function(){
  it('should respond to post request', function(done){
    request.post('localhost:3000').end(function(res){
      //TODO check that response is okay
      expect(res.status).to.equal(200);
      expect(res.body).to.contain('world');
    });
    done();
  });
});
