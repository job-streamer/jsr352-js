'use strict';


var inherits = require('inherits');
var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
var eventProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps'),
    linkProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps'),
    documentationProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps'),
    properties = require('bpmn-js-properties-panel/lib/provider/camunda/parts/PropertiesProps'),
    nameProps = require('./parts/NameProps');


// Require your custom property entries.
var stepProps = require('./parts/StepProps'),
    listenerProps = require('./parts/ListenerProps'),
    restartbleProps = require('./parts/RestartableProps'),
    transitionProps = require('./parts/TransitionProps'),
    restartProps = require('./parts/RestartProps');

// The general tab contains all bpmn relevant properties.
// The properties are organized in groups.
function createGeneralTabGroups(element, bpmnFactory, elementRegistry) {
  var generalGroup = {
    id: 'general',
    label: 'General',
    entries: []
  };
  //idProps(generalGroup, element, elementRegistry);
  if (isAny(element, ['jsr352:BatchComponent', 'jsr352:Job'])) {
    nameProps(generalGroup, element);
  }
  stepProps(generalGroup, element, bpmnFactory);
  listenerProps(generalGroup, element, bpmnFactory);
  transitionProps(generalGroup, element);
  restartbleProps(generalGroup, element);
  restartProps(generalGroup, element);

  var detailsGroup = {
    id: 'details',
    label: 'Details',
    entries: []
  };
  linkProps(detailsGroup, element);
  eventProps(detailsGroup, element, bpmnFactory, elementRegistry);

  var documentationGroup = {
    id: 'documentation',
    label: 'Documentation',
    entries: []
  };

  documentationProps(documentationGroup, element, bpmnFactory);

  return[
    generalGroup,
    detailsGroup,
    documentationGroup
  ];
}

function createExtensionElementsGroups(element, bpmnFactory, elementRegistry) {

  var propertiesGroup = {
    id : 'extensionElements-properties',
    label: 'Properties',
    entries: [],
    enabled: function(element) {
      return isAny(element, ['jsr352:Job', 'jsr352:Step', 'jsr352:Listener', 'jsr352:Batchlet', 'jsr352:Reader', 'jsr352:Processor', 'jsr352:Writer']);
    }
  };
  properties(propertiesGroup, element, bpmnFactory);

  return [
    propertiesGroup
  ];
}

function CustomPropertiesProvider(eventBus, bpmnFactory, elementRegistry) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry)
    };

    var extensionsTab = {
      id: 'PropertyElements',
      label: 'Properties',
      groups: createExtensionElementsGroups(element, bpmnFactory, elementRegistry)
    };

    return [
      generalTab,
      extensionsTab
    ];
  };
}

inherits(CustomPropertiesProvider, PropertiesActivator);

module.exports = CustomPropertiesProvider;
