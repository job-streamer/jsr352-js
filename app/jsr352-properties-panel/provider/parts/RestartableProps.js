'use strict';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var is = require('bpmn-js/lib/util/ModelUtil').is;

module.exports = function(group, element) {
  if (is(element, 'jsr352:Job')) {
    group.entries.push(entryFactory.checkbox({
      id : 'restartable',
      description : 'Specifies whether or not this job is restartable.',
      label : 'restartable',
      modelProperty : 'restartable'
    }));
  }
};
