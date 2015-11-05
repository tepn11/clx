var Cloudant = require('cloudant');
var settings = require('../settings');

/**
 * Get a connection to our Cloudant database
 * @param callback {function} callback
 */
exports.getConnection = function(callback) {
  Cloudant({
    account: settings.cloudant['account'],
    password: settings.cloudant['password']
  }, function(err, cloudant) {
    /* istanbul ignore next */
    if (err) {
      error = { message: 'Unable to connect to cloudant', details: err };
      console.log(err);
      return callback(error, null);
    }
    else {
      return callback(null, cloudant);
    }
  });
};

/**
 * Convenience function for getting databases
 * @param name {string} name of our database
 * @param callback {function} callback
 */
exports.getDatabase = function(name, callback) {
  this.getConnection(function(err, connection) {
    /* istanbul ignore next */
    if (err) {
      console.log(err);
      return callback(err, null);
    }
    else {
      return callback(null, connection.use(name));
    }
  });
};

/**
 * Send a ping to our database
 * @param callback {function} callback
 */
exports.ping = function(callback) {
  this.getConnection(function(err, res) {
    /* istanbul ignore next */
    if (err) {
      var error = { message: 'Unable to ping', details: err };
      console.log (error);
      return callback(error, null);
    }
    else
      return callback(null, true);
  });
};

/**
 * Add new document to the database
 * @param db_name {string} name of database
 * @param doc {hash} document to be added
 * @param callback {function} callback
 */
exports.add = function(db_name, doc, callback) {
  this.getDatabase(db_name, function(err, db) {
    /* istanbul ignore next */
    if (err)
      return callback({message: 'Unable to get '+ db_name +' database', details: err}, null);
    else {
      db.insert(doc, function(err, body) {
        /* istanbul ignore next */
        if (err)
          return callback({message: 'Unable to insert document', doc: doc}, null);
        else
          return callback(null, body);
      });
    }
  });
};

/**
 * Edit a document in the database
 * @param db_name {string} name of database
 * @param id {string} id
 * @param rev {string} rev
 * @param doc {hash} new document
 * @param callback {function} callback
 */
exports.edit = function(db_name, id, rev, doc, callback) {
  this.getDatabase(db_name, function(err, db) {
    /* istanbul ignore next */
    if (err)
      return callback({message: 'Unable to get '+ db_name +' database', details: err}, null);
    else {
      if(id) {
        if(rev) {
          doc._rev = rev;
          db.insert(doc, id, function(err, body) {
            /* istanbul ignore next */
            if (err)
              return callback({message: 'Unable to insert document', details: err.description}, null);
            else
              return callback(null, body);
          });
        } else {
          return callback({message: 'Unable to insert document. Missing rev'}, null);
        }
      } else {
        return callback({message: 'Unable to insert document. Missing id'}, null);
      }
    }
  });
};

/**
 * Fetch all documents in the database
 * @param db_name {string} name of database
 * @param callback {function} callback
 */
exports.get_all = function(db_name, callback){
  this.getDatabase(db_name, function(err, db) {
    /* istanbul ignore next */
    if (err)
      return callback({message: 'Unable to get '+ db_name +' database', details: err}, null);
    else {
      db.list({'include_docs':true}, function(err, body) {
        /* istanbul ignore next */
        if (err)
          return callback({message: 'Unable to fetch documents'}, null);
        else
          return callback(null, body.rows);
      });
    }
  });
};

/**
 * Fetch one document in the database by id
 * @param db_name {string} name of database
 * @param id {string} id of document to be fetched
 * @param callback {function} callback
 */
exports.get_one = function(db_name, id, callback){
  this.getDatabase(db_name, function(err, db) {
    /* istanbul ignore next */
    if (err)
      return callback({message: 'Unable to get '+ db_name +' database', details: err}, null);
    else {
      db.get(id, function(err, body) {
        /* istanbul ignore next */
        if (err)
          return callback({message: 'Unable to fetch document', id: id}, null);
        else
          return callback(null, body);
      });
    }
  });
};

/**
 * Fetch all documents in the database by key and value pair
 * @param db_name {string} name of database
 * @param key {string} key
 * @param value {any} value
 * @param callback {function} callback
 */
exports.find_all = function(db_name, key, value, callback){
  this.getDatabase(db_name, function(err, db) {
    /* istanbul ignore next */
    if (err)
      return callback({message: 'Unable to get '+ db_name +' database', details: err}, null);
    else {
      db.list({'include_docs':true}, function(err, body){
        /* istanbul ignore next */
        if (err)
          return callback({message: 'Unable to fetch documents', key: key, value: value}, null);
        else {
          var rows = body.rows;
          var items = [];
          var rec_found = false;
          rows.forEach(function(row){
            if(row.doc[key] === value){
              rec_found = true;
              items.push(row.doc);
            }
          });
          if(items.length === 0)
            return callback(null, {message: 'No documents found'});
          else
            return callback(null, items);
        }
      });
    }
  });
};

/**
 * Fetch one document in the database by key and value pair
 * @param db_name {string} name of database
 * @param key {string} key
 * @param value {any} value
 * @param callback {function} callback
 */
exports.find_one = function(db_name, key, value, callback){
  this.getDatabase(db_name, function(err, db) {
    /* istanbul ignore next */
    if (err)
      return callback({message: 'Unable to get '+ db_name +' database', details: err}, null);
    else {
      exports.find_all(db_name, key, value, function(err, items){
        /* istanbul ignore next */
        if (err)
          return callback({message: err.message, key: key, value: value}, null);
        else {
          if (items.message === 'No documents found')
            return callback(null, items);
          else
            return callback(null, items[0]);
        }
      });
    }
  });
};

/**
 * Delete a document in the database
 * @param db_name {string} name of database
 * @param id {string} id of document to be deleted
 * @param rev {string} rev of document to be deleted
 * @param callback {function} callback
 */
exports.delete = function(db_name, id, rev, callback){
  this.getDatabase(db_name, function(err, db) {
    /* istanbul ignore next */
    if (err)
      return callback({message: 'Unable to get '+ db_name +' database', details: err}, null);
    else {
      if(id) {
        if(rev) {
          db.destroy(id, rev, function(err, body) {
            /* istanbul ignore next */
            if (err)
              return callback({message: 'Unable to delete document', id: id, rev: rev}, null);
            else
              return callback(null, body);
          });
        } else {
          return callback({message: 'Unable to delete document. Missing rev'}, null);
        }
      } else {
        return callback({message: 'Unable to delete document. Missing id'}, null);
      }
    }
  });
};
