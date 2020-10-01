"use strict";

/*
 * Created with @iobroker/create-adapter v1.29.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
let request;
let adapter;

adapter.on("ready", function() {
	main();
});

function main() {
	adapter.log.info("IP: " + adapter.config.ipaddress);
	adapter.log.info("Passwort: " + adapter.config.password);
}