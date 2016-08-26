module.exports = function() {
  var public = './public/';
  var migrations = './migrations/';
  var dist = './dist/';

  var config = {
    dist: dist,
    images: public + 'images/**/*.+(png|jpg|jpeg|gif|svg)',
    temp: './.tmp/',

    /**
    * File paths
    */

    // all js to vet
    alljs: [
      './**/*.js',
      './*.js',
      '!' + './node_modules/**/*.*',
      '!' + public + 'dist/**/*.*',
      '!' + public + 'javascript/lib/**/*.*',
      '!' + migrations + '**/*.*'
    ],

    scssDist: dist + 'stylesheets/',
    scss: public + 'stylesheets/**/*.scss'
  };

  return config;
};
