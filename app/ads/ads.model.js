var db = require('../db');
var validate = require('validate.js');

//@TODO: Database name - should be dynamically changed from env
var database_name = 'ads';

// ad schema here, always validate before saving/updating
AdSchema = {
  // "rss_url": {
  //   presence: true
  // },
  // "trigger_criteria": {
  //   presence: true,
  //   inclusion: ['NEW', 'KEYWORD']
  // },
  // "callback_url": {
  //   presence: true
  // },
  // "active": {
  //   presence: true
  // }
};

/**
 * Adds a new ad to our database
 * @param ad {object} ad object
 * @param callback {function} callback
 */
exports.add = function(ad, callback) {
  var validationErrors = validate(ad, AdSchema);
  if (validationErrors)
    return callback(validationErrors, null);
  else {
    db.add(database_name, ad, function(err, body){
      return callback(err, body);
    });
  }
};

/**
 * Edit an ad in our database
 * @param id {string} id
 * @param rev {string} rev
 * @param ad {object} ad object
 * @param callback {function} callback
 */
exports.edit = function(id, rev, ad, callback) {
  var validationErrors = validate(ad, AdSchema);
  if (validationErrors)
    return callback(validationErrors, null);
  else {
    db.edit(database_name, id, rev, ad, function(err, body){
      return callback(err, body);
    });
  }
};

/**
 * Get all ads in our database
 * @param key {string} key
 * @param value {any} value
 * @param callback {function} callback
 */
exports.get_all = function(callback) {
  db.get_all(database_name, function(err, body){
    return callback(err, body);
  });
};

/**
 * Find an ad in our database matching a key value pair
 * @param key {string} key
 * @param value {any} value
 * @param callback {function} callback
 */
exports.find_one = function(key, value, callback) {
  db.find_one(database_name, key, value, function(err, body){
    return callback(err, body);
  });
};

/**
 * Find all ads in our database matching a key value pair
 * @param key {string} key
 * @param value {any} value
 * @param callback {function} callback
 */
exports.find_all = function(key, value, callback) {
  db.find_all(database_name, key, value, function(err, body){
    return callback(err, body);
  });
};

/**
 * Delete an ad in the database
 * @param id {string} id
 * @param rev {any} rev
 * @param callback {function} callback
 */
exports.delete = function(id, rev, callback) {
  db.delete(database_name, id, rev, function(err, body){
    return callback(err, body);
  });
};
