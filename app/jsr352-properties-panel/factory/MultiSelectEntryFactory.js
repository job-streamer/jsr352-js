'use strict';

var forEach = require('lodash/collection/forEach');

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    entryFieldDescription = require('bpmn-js-properties-panel/lib/factory/EntryFieldDescription'),
    factory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

var multiselectbox = function(options) {
  return factory.table(options);
};

module.exports = multiselectbox;
