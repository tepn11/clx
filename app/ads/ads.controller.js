var express = require('express');
var router = express.Router();
var ads = require('./ads.model');
var clx = require('../../lib/CL_extractor');

/**
 * Get all ads
 * @param {Object} req
 * @param {Object} res
 */
var get_all_ads = function(req, res) {
  ads.get_all(function(e,d){
    /* istanbul ignore next */
    if(e){
      return res.json({'success': false, 'msg':'Error fetching ads from db. Please try again later.'});
    } else {
      var docs = d.map(function(r){return r.doc;});
      return res.json({'success': true, 'data':docs});
    }
  });
};

/**
 * Start CL extract script
 * @param {Object} req
 * @param {Object} res
 */
var run_script = function(req, res) {
  clx.init();
  return res.json({'success': true, 'msg':'Successfully ran extract script'});
};

/* RESTful routes V1 */
router.get('/list', get_all_ads);
router.get('/run_script', run_script);

module.exports = router;
