'use strict';

var edn = require('edn');
//　TODO: It must set false when controlBus return 404 or 503
var Control_bus_meta_data = document.querySelector("meta[name=control-bus-url]");
//  TODO:now,it does not get environment value from server 
var controlBusURL = Control_bus_meta_data ? document.querySelector("meta[name=control-bus-url]").getAttribute("content") : "http://localhost:45102";

var appName = "default";
if (Control_bus_meta_data) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  var componentJSON;
  xhr.addEventListener("load", function (ev) {
    componentJSON = edn.valueOf(edn.parse(xhr.responseText));
  });
  xhr.open("GET", controlBusURL + "/" + appName + "/batch-components");
  xhr.send();
}
function ComponentProvider() {
}

ComponentProvider.getBatchlets = function () {
    return Control_bus_meta_data ? componentJSON["batch-component/batchlet"] : [];
};
ComponentProvider.getItemReaders = function () {
    return Control_bus_meta_data ? componentJSON["batch-component/item-reader"] : [];
};
ComponentProvider.getItemProcessors = function () {
    return Control_bus_meta_data ? componentJSON["batch-component/item-processor"] : [];
};
ComponentProvider.getItemWriters = function () {
    return Control_bus_meta_data ? componentJSON["batch-component/item-writer"] : [];
};
ComponentProvider.getListeners = function () {
    return Control_bus_meta_data ? componentJSON["batch-component/listener"] : [];
};

module.exports = ComponentProvider;