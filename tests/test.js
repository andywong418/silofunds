var test = require('./testFunctions')

// New routes must be added both below, and in the testfunctions file
// The test functions file also includes routes with :id

describe("Let's go!", function() {
  test.logSuppress()
  describe('Non passport authenticated routes', function() {
    test.route('/');
    test.route('/login');
    test.route('/register');
    test.route('/results'); // Make sure elasticsearch is on,
    test.route('/forgot');
  });

  describe('User data injection functions', function() {
    describe('minimum user data injected', test.minUser)
    describe('full user data injected', test.fullUser)
    describe('min organisation data injected', test.minOrganisation)
    describe('full organisation data injected', test.fullOrganisation)
  });

  describe('User blocker routes', function() {
    test.fakeUserLogin('testuser@silofunds.com');
    test.passportRoute('/organisation/create', 500);
    test.passportRoute('/organisation/dashboard', 500);
    test.passportRoute('/organisation/funding_creation', 500);
    test.passportRoute('/organisation/funding_creation/scholarship', 500);
    test.passportRoute('/organisation/funding_creation/bursary', 500);
    test.passportRoute('/organisation/funding_creation/grant', 500);
    test.passportRoute('/organisation/funding_creation/prize', 500);
  });

  describe('Organisation blocker routes', function() {
    test.fakeOrganisationLogin('testorganisation@silofunds.com');
    test.passportRoute('/user/create', 500);
    test.passportRoute('/user/dashboard', 500);
    test.passportRoute('/user/settings', 500);
  });

  describe('Make sure passport routes when not authenticated redirect to login', function() {
    test.loginRedirect('/user/dashboard');
    test.loginRedirect('/organisation/dashboard')
  });

  describe('Database checks', function() {
    test.postgres();
    test.userCreation();
  });
})
