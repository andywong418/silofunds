var test = require('./testFunctions')



describe('Route tests', function() {
  test.logSuppress();
  describe('Non passport auth routes', function() {
    test.route('/');
    test.route('/login');
    test.route('/register');
    test.route('/results'); // Make sure elasticsearch is on, also this takes a few seconds before it will work after restarting
    test.route('/forgot');
    // test.route('/organisation/options/:id')
  });

  describe('Passport authenticated routes for user login', function() {
    test.fakeUserLogin();
    test.passportRoute('/user/create', 200);
    test.passportRoute('/user/dashboard', 200);
    test.passportRoute('/user/settings', 200);
  });

  describe('Passport authenticated routes for organisation login', function() {
    test.fakeOrganisationLogin();
    test.passportRoute('/organisation/create', 200);
    test.passportRoute('/organisation/dashboard', 200);
    test.passportRoute('/organisation/funding_creation', 200);
    test.passportRoute('/organisation/funding_creation/scholarship', 200);
    test.passportRoute('/organisation/funding_creation/bursary', 200);
    test.passportRoute('/organisation/funding_creation/grant', 200);
    test.passportRoute('/organisation/funding_creation/prize', 200);
  });

  describe('User blocker routes', function() {
    test.fakeUserLogin();
    test.passportRoute('/organisation/create', 500);
    test.passportRoute('/organisation/dashboard', 500);
    test.passportRoute('/organisation/funding_creation', 500);
    test.passportRoute('/organisation/funding_creation/scholarship', 500);
    test.passportRoute('/organisation/funding_creation/bursary', 500);
    test.passportRoute('/organisation/funding_creation/grant', 500);
    test.passportRoute('/organisation/funding_creation/prize', 500);
  });

  describe('Organisation blocker routes', function() {
    test.fakeOrganisationLogin();
    test.passportRoute('/user/create', 500);
    test.passportRoute('/user/dashboard', 500);
    test.passportRoute('/user/settings', 500);
  });

  describe('Make sure passport routes when not authenticated redirect to login', function() {
    test.loginRedirect('/user/dashboard');
    test.loginRedirect('/organisation/dashboard');
  });

  describe('Database checks', function() {
    test.postgres();
    test.userCreation();
  });
})

// test.passportRoute('/organisation/options/:id');
// describe('/organisation/options/:id', test.passportRoute('/organisation/options/:id'))
// describe('/organisation/options/:id/edit', test.passportRoute('/organisation/options/:id/edit'))
