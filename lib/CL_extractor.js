var request = require("request"),
    cheerio = require("cheerio"),
    ads = require("../app/ads/ads.model");

var cl_link = 'https://losangeles.craigslist.org';

var init = exports.init = function(){
  var location = "losangeles";
  var type = "cto";
  var val = "";
  var resultsArray = [];

  // url used to search yql
  var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20craigslist.search" +
  "%20where%20location%3D%22"+location+"%22%20and%20type%3D%22"+type+"%22%20and%20query%3D%22" + val + "%22&format=" +
  "json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  // console.log(url);

  request(url, function(err, resp, body) {
    if (err) {
      console.log("Error: " + err);
      return;
    }
    body = JSON.parse(body);
    if (!body.query.results.RDF.item['about'] === false) {
      craig = "No results found. Try again.";
    } else {
      results = body.query.results.RDF.item;
      for (var i = 0; i < results.length; i++) {
        //resultsArray.push(
        //  results[i]["about"]
        //);
        console.log(results[i]["about"]);
        extract_details_and_save(results[i]["about"],  function(e,d){
          if(e){
            console.log(e);
            console.log(d);
          } else {
            console.log(d);
          }
        });
      };
    }
    console.log(resultsArray);

  });
};

var extract_details_and_save = exports.extract_details_and_save = function(url, callback){
  //check if exist, if not scrap
  //we are not going to care if there are any changes to the ad
  ads.find_one('link', url, function(e,d){
    /* istanbul ignore next */
    if(e){
      console.log(e);
      return callback('Error fetching ads from db. Please try again later. -'+url, null);
    } else if(d.message === 'No documents found') {
      request(url, function(err, resp, body) {
        if (!err) {
      		var $ = cheerio.load(body);

          var ad_details = {};
          ad_details.title = $('span.postingtitletext').text();
          ad_details.link = url;
          ad_details.datePosted = $('#display-date>time').attr('datetime');
          var images = [];
          $('#thumbs>a').each(function(){
            images.push($(this).attr('href'));
          });
          ad_details.imageHyperlinks = images;
          ad_details.description = $('#postingbody').text().replace('\n',' ');
          var extra_details = $('.attrgroup:last-of-type').html();
          var vin = extra_details.match(/VIN: <b>(.*?)<\/b>/g);
          if(vin){
            ad_details.vin = vin[0].replace('VIN: <b>','').replace('</b>','')
          }
          var mileage = extra_details.match(/odometer: <b>(.*?)<\/b>/g);
          if(mileage){
            ad_details.mileage = mileage[0].replace('odometer: <b>','').replace('</b>','')
          }
          ad_details.price = $('.price').text();

          var show_contact_link = $('.showcontact').attr('href');
          if(show_contact_link){
            request(cl_link+show_contact_link, function(err, resp, body) {
              if(err) {
                console.log(err);
              } else {
                var $ = cheerio.load(body);
                ad_details.description = $('#postingbody').text().replace('\n',' ');
                var phone = $('.posting_body').text().replace(/\s/g,'');
                phone = phone.match(/\(?\d{3}[-.)!(]*\d{3}[)-./(\s]*\d{4}[)]*/g);
                ad_details.phoneNumber = phone ? phone[0] : '';
                // s.replace(/[^0-9]/g, '') - to clear extra chars
              }
              console.log(ad_details);
              return save_to_db(ad_details, url,  callback);
            });
          } else {
            console.log(ad_details);
            return save_to_db(ad_details, url, callback);
          }
      	} else {
      		console.log("Error: " + err);
          return callback(err, null);
      	}
      });
    } else {
      //console.log('ad already exist');
      return callback(null, 'ad already exist: '+url);
    }
  });
};

var save_to_db = function(ad_details, url, callback){
  //save to db
  ads.add(ad_details, function(e,d){
    /* istanbul ignore next */
    if(e){
      console.log(e);
      //console.log('Error saving ad to db. Please try again later.');
      return callback('Error saving ad to db. Please try again later. -'+url, null);
    }
    else{
      //console.log('Successfully created new ad');
      return callback(null, 'Successfully created new ad: '+url);
    }
  });
}
