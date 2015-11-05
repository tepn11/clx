var CronJob = require('cron').CronJob;
var CL_extractor_worker = require('./lib/CL_extractor').CL_extractor_worker;

new CronJob('0 * * * *', function() { //every 30 mins
  console.log("Time: "+ new Date());
  console.log("checking feeds..");
  CL_extractor_worker(function(){
    return;
  });
}, null, true, 'America/Los_Angeles');
