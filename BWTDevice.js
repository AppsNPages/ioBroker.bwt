module.exports = function(myadapter) {
   var adapter = myadapter;

   var request = require('request').defaults({jar: true});

   const formdata = {
       'STLoginPWField': adapter.config.password
   };

   const headers = {
       'USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (K HTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
   };

  this.requestDataUpdate = function() {
     var jar = request.jar();

     request.post( {
        'url': 'https://' + adapter.config.ipaddress + '/users/login',
        headers: headers,
        form: formdata,
        rejectUnauthorized: false,
        jar: jar
     }, (error, res, body) => {
        if(error) {
           adapter.log.error("BWT login error: " + error);
        } else {
           getDataFromBWT(jar);
        }
     });
  };

  function getDataFromBWT(jar) {
     request.get({
        'url': 'https://' + adapter.config.ipaddress + '/home/actualizedata',
        rejectUnauthorized: false,
        headers: headers,
        jar: jar
     }, (err, res, body) => {
        if(err) {
           adapter.log.error(err);
        } else {
           handleResponse(body);
        }
     });
  }

  function handleResponse(data) {
     adapter.setObject("AquaPerla", {
        type: 'device',
        common: {
           name: 'BWT-AquaPerla',
           type: 'Wasseraufbereitung',
           read: true,
           write: false
        }
     }, function() {
        handleCurrentThroughput(data);

     });
  }

  function handleCurrentThroughput(rawData) {
     var data = JSON.parse(rawData);
     var dataPointName = "AquaPerla.aktuellerDurchfluss";

     adapter.setObjectNotExists(dataPointName, {
        type: 'state',
        common: {
           name: 'aktueller Durchfluss',
           type: 'number',
           read: true,
           write: false,
           unit: 'l/h'
        }
     });

     adapter.setState(dataPointName, {val: data.aktuellerDurchfluss, ack: true});
  }
};