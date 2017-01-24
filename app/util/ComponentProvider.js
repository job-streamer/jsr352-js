'use strict';

var edn = require('edn');
var controlBusMetaData = document.querySelector("meta[name=control-bus-url]");
//  TODO:now,it does not get environment value from server 
var controlBusURL = controlBusMetaData ? document.querySelector("meta[name=control-bus-url]").getAttribute("content") : "http://localhost:45102";

var appName = "default";
var controlBusNotFound;
if (controlBusMetaData) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  var componentJSON;
  xhr.addEventListener("load", function (ev) {
    if(xhr.status === 404){
      controlBusNotFound = true;
      return;
    }
    componentJSON = edn.valueOf(edn.parse(xhr.responseText));
  });
  xhr.open("GET", controlBusURL + "/" + appName + "/batch-components");
  xhr.send();
}
function ComponentProvider() {
}

ComponentProvider.getBatchlets = function () {
    return controlBusMetaData &&  !controlBusNotFound ? componentJSON["batch-component/batchlet"] : [];
};
ComponentProvider.getItemReaders = function () {
    return controlBusMetaData &&  !controlBusNotFound ? componentJSON["batch-component/item-reader"] : [];
};
ComponentProvider.getItemProcessors = function () {
    return controlBusMetaData &&  !controlBusNotFound ? componentJSON["batch-component/item-processor"] : [];
};
ComponentProvider.getItemWriters = function () {
    return controlBusMetaData &&  !controlBusNotFound ? componentJSON["batch-component/item-writer"] : [];
};
ComponentProvider.getListeners = function () {
    return controlBusMetaData &&  !controlBusNotFound ? componentJSON["batch-component/listener"] : [];
};

module.exports = ComponentProvider;