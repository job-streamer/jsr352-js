'use strict';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var is = require('bpmn-js/lib/util/ModelUtil').is;

module.exports = function (group, element, bpmnFactory) {
  if (is(element, 'jsr352:Stop')) {
    group.entries.push(entryFactory.textField({
      id: 'restart',
      description: 'Specifies the job-level step, flow, or split at which to restart when the job is restarted.',
      label: 'restart',
      modelProperty: 'restart'
    }));
  }
};