'use strict';

var initialDiagram =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                      'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                      'xmlns:jsr352="http://jsr352/" ' +
                      'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                      'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
                      'targetNamespace="http://bpmn.io/schema/bpmn" ' +
                      'id="Definitions_1">' +
      '<jsr352:Job id="Job_1" isExecutable="false">' +
        '<jsr352:Start id="Start_1"/>' +
      '</jsr352:Job>' +
      '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
        '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Job_1">' +
          '<bpmndi:BPMNShape id="_BPMNShape_Start_2" bpmnElement="Start_1">' +
            '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' +
          '</bpmndi:BPMNShape>' +
        '</bpmndi:BPMNPlane>' +
      '</bpmndi:BPMNDiagram>' +
    '</bpmn:definitions>';

var JSR352Modeler = require('./jsr352-modeler');
var $ = require('jquery');

var propertiesPanelModule = require('bpmn-js-properties-panel'),
    propertiesProviderModule = require('./jsr352-properties-panel/provider'),
    camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda'),
    jsr352ModdleDescriptor = require('./descriptors/jsr352'),
    minimapModule = require('./diagram-js-minimap'),
    copypasteModule = require('./copy-paste'),
    zoomScrollModule = require('./zoom-scroll');


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
    copypasteModule,
    zoomScrollModule
  ],
  moddleExtensions: {
    jsr352: jsr352ModdleDescriptor,
    camunda: camundaModdleDescriptor
  }
});

modeler.importXML(initialDiagram, function(err) {
  if (err) {
    console.error('something went wrong:', err);
  }

  modeler.get('canvas').zoom('fit-viewport');
});

function saveSVG(done) {
  modeler.saveSVG(done);
}

function saveDiagram(done) {

  modeler.saveXML({ format: true }, function(err, xml) {
    done(err, xml);
  });
}
$(document).on('ready', function() {

  $('#js-create-diagram').click(function(e) {
    e.stopPropagation();
    e.preventDefault();

    createNewDiagram();
  });

  var downloadLink = $('#js-download-diagram');
  var downloadSvgLink = $('#js-download-svg');

  $('.buttons a').click(function(e) {
    if (!$(this).is('.active')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  function setEncoded(link, name, data) {
    var encodedData = encodeURIComponent(data);

    if (data) {
      link.addClass('active').attr({
        'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
        'download': name
      });
    } else {
      link.removeClass('active');
    }
  }

  var _ = require('lodash');

  var exportArtifacts = _.debounce(function() {
    saveSVG(function(err, svg) {
      setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
    });

    saveDiagram(function(err, xml) {
      setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
    });
  }, 500);

  modeler.on('commandStack.changed', exportArtifacts);
});

// expose bpmnjs to window for debugging purposes
window.bpmnjs = modeler;
