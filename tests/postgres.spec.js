describe("Postgres", function() {
  it("is there a server running", function(next) {
    var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/potfund_development';
    var pg = require('pg');

    var client = new pg.Client(connectionString);
    client.connect(function(err) {
      expect(err).toBe(null);
      next();
    });
  });
});
