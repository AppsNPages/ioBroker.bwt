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
        },
        native: {
           id: "AquaPerla_1"
        }
     }, function() {
        handleCurrentThroughput(data);
        handleCurrentThroughputPercent(data);
        handleThroughputToday(data);
        handleThroughputMonth(data);
        handleThroughputYear(data);
        handleFillupDays(data);
        handleCurrentLevel(data);

        var theDate = new Date();

        adapter.setObjectNotExists("AquaPerla.LastUpdate", {
           type: 'state',
           common: {
              name: "letzte Aktualisierung",
              type: "datetime",
              role: "indicator.date",
              read: true,
              write: false
           }
        });

        adapter.setState("AquaPerla.LastUpdate", {val: theDate.toString(), ack: true})
     });
  }

  /*
  RegeneriemittelVerbleibend
  */

  function handleCurrentThroughput(rawData) {
     var data = JSON.parse(rawData);
     var dataPointName = "AquaPerla.aktuellerDurchfluss";

     adapter.setObjectNotExists(dataPointName, {
        type: 'state',
        common: {
           name: 'aktueller Durchfluss',
           type: 'number',
           role: "value",
           read: true,
           write: false,
           unit: 'l'
        }
     });

     adapter.setState(dataPointName, {val: data.aktuellerDurchfluss, ack: true});
  }

  function handleCurrentThroughputPercent(rawData) {
      var data = JSON.parse(rawData);
      var dataPointName = "AquaPerla.aktuellerDurchflussProzent";

      adapter.setObjectNotExists(dataPointName, {
         type: 'state',
         common: {
            name: 'aktueller Durchfluss Prozent',
            type: 'number',
            role: "value",
            read: true,
            write: false,
            unit: '%'
         }
      });

      adapter.setState(dataPointName, {val: data.aktuellerDurchflussProzent, ack: true});
   }

   function handleThroughputToday(rawData) {
      var data = JSON.parse(rawData);
      var dataPointName = "AquaPerla.durchflussHeute";

      adapter.setObjectNotExists(dataPointName, {
         type: 'state',
         common: {
            name: 'Durchfluss heute',
            type: 'number',
            read: true,
            write: false,
            unit: 'l'
         }
      });

      adapter.setState(dataPointName, {val: data.durchflussHeute, ack: true});
   }

   function handleThroughputMonth(rawData) {
      var data = JSON.parse(rawData);
      var dataPointName = "AquaPerla.durchflussMonat";

      adapter.setObjectNotExists(dataPointName, {
         type: 'state',
         common: {
            name: 'Durchfluss in diesem Monat',
            type: 'number',
            role: "value",
            read: true,
            write: false,
            unit: 'l'
         }
      });

      adapter.setState(dataPointName, {val: data.durchflussMonat, ack: true});
   }

   function handleThroughputYear(rawData) {
      var data = JSON.parse(rawData);
      var dataPointName = "AquaPerla.durchflussJahr";

      adapter.setObjectNotExists(dataPointName, {
         type: 'state',
         common: {
            name: 'Durchfluss in diesem Jahr',
            type: 'number',
            role: "value",
            read: true,
            write: false,
            unit: 'l'
         }
      });

      adapter.setState(dataPointName, {val: data.durchflussJahr, ack: true});
   }

   function handleFillupDays(rawData) {
      var data = JSON.parse(rawData);
      var dataPointName = "AquaPerla.RegeneriermittelNachfuellenIn";

      adapter.setObjectNotExists(dataPointName, {
         type: 'state',
         common: {
            name: 'Regenerierungsmittel nachfüllen in',
            type: 'number',
            role: "value",
            read: true,
            write: false,
            unit: 'Tagen'
         }
      });

      adapter.setState(dataPointName, {val: data.RegeneriemittelNachfuellenIn, ack: true});
   }

   function handleCurrentLevel(rawData) {
      var data = JSON.parse(rawData);
      var dataPointName = "AquaPerla.RegeneriermittelVerbleibend";

      adapter.setObjectNotExists(dataPointName, {
         type: 'state',
         common: {
            name: 'Regeneriermittel verbleibend',
            type: 'number',
            role: "value",
            read: true,
            write: false,
            unit: '%'
         }
      });

      adapter.setState(dataPointName, {val: data.RegeneriemittelVerbleibend, ack: true});
   }
};