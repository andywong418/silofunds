var elasticsearch = require('elasticsearch');
var esConnectionString = 'localhost:9200';
var elasticsearchModel = require('./model');
var sleep = require('sleep');

if (process.env.SEARCHBOX_URL) {
  // Heroku
  esConnectionString = process.env.SEARCHBOX_URL;
}

var es = new elasticsearch.Client({
  host: esConnectionString,
  log: [{
    type: 'stdio',
    levels: ['error', 'warning']
  }]
});

module.exports = es;
module.exports.checkConnection = checkConnection;
module.exports.indexExists = indexExists;
module.exports.deleteIndex = deleteIndex;
module.exports.createIndex = createIndex;




function checkConnection() {
  return es.ping({
    requestTimeout: 30000,

    // undocumented params are appended to the query string
    hello: "elasticsearch"
  }).catch(function(err) {
    Logger.error('elasticsearch cluster is down!');
  });
}

function indexExists(indexName, callback) {
  return es.indices.exists({
    index: indexName
  }).catch(function(err) {
    Logger.error("Error checking existence of " + indexName + " index:");
    Logger.error(err);
  }).then(function(resp) {
    Logger.info("Does the " + indexName + " index exist?:");
    Logger.info(resp);
    callback(resp);
  });
}

function deleteIndex(indexName) {
  return es.indices.delete({
    index: indexName,
    ignore: [404]
  }).catch(function(err) {
    Logger.error("Error deleting " + indexName + " index:");
    Logger.error(err);
  }).then(function(resp) {
    if (resp) {
      Logger.info("Deleted " + indexName + " index.");
    }

    if (process.env.NODE_ENV == "production") {
      sleep.sleep(10);
    }
  });
}

function createIndex(indexName) {
  var createOptions = {
    index: indexName
  };

  if (indexName === 'funds') {
    createOptions.body = elasticsearchModel.fundSettings;
  } else {
    createOptions.body = elasticsearchModel.userSettings;
  }

   return es.indices.create(createOptions).catch(function(err) {
    Logger.error("Couldn't create " + indexName + " index:");
    Logger.error(err);
  }).then(function(resp) {
    if (resp) {
      Logger.info("Created " + indexName + " index.");
      if (process.env.NODE_ENV == "production") {
        sleep.sleep(5);
      }
    }
  });
}
