'use strict';

var edn = require('edn');
//  TODO:now,it does not get environment value from server 
var controlBusURL = document.querySelector("meta[name=control-bus-url]").getAttribute("content");
var appName = "default";
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
var componentJSON;
xhr.addEventListener("load", function (ev) {
    componentJSON = edn.valueOf(edn.parse(xhr.responseText));
});
xhr.open("GET", controlBusURL + "/" + appName + "/batch-components");
xhr.send();

function ComponentProvider() {
}

ComponentProvider.getBatchlets = function () {
    return componentJSON["batch-component/batchlet"];
};
ComponentProvider.getItemReaders = function () {
    return componentJSON["batch-component/item-reader"];
};
ComponentProvider.getItemProcessors = function () {
    return componentJSON["batch-component/item-processor"];
};
ComponentProvider.getItemWriters = function () {
    return componentJSON["batch-component/item-writer"];
};

module.exports = ComponentProvider;