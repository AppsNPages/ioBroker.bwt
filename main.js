"use strict";

/*
 * Created with @iobroker/create-adapter v1.29.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
// @ts-ignore
var utils = require(__dirname + '/lib/utils');
var adapter = utils.Adapter('BWTDevice');

var BWTDevice = require("./BWTDevice");
var device = null;

var _deviceUpdateTimer;

adapter.on("ready", function() {
   var device = new BWTDevice(adapter);

   device.requestDataUpdate();

   _deviceUpdateTimer = setInterval(function() {
      device.requestDataUpdate();
   }, adapter.config.interval * 60 * 1000);
});