'use strict';

var JSR352Modeler = require('./jsr352-modeler');

var propertiesPanelModule = require('bpmn-js-properties-panel'),
    propertiesProviderModule = require('./jsr352-properties-panel/provider'),
    camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda'),
    jsr352ModdleDescriptor = require('./descriptors/jsr352'),
    minimapModule = require('./diagram-js-minimap'),
    copypateModule = require('./copy-paste');


var modeler = new JSR352Modeler({
  container: '#canvas',
  keyboard: { bindTo: document },
  propertiesPanel: {
    parent: '#js-properties-panel'
  },
  additionalModules: [
    propertiesPanelModule,
    propertiesProviderModule,
    minimapModule,
    copypateModule
  ],
  moddleExtensions: {
    jsr352: jsr352ModdleDescriptor,
    camunda: camundaModdleDescriptor
  }
});

window.bpmnjs = modeler;
