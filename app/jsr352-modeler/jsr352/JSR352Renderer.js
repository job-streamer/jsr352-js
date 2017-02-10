'use strict';

var inherits = require('inherits'),
    isObject = require('lodash/lang/isObject'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;
;

var BaseRenderer = require('diagram-js/lib/draw/BaseRenderer');

var componentsToPath = require('diagram-js/lib/util/RenderUtil').componentsToPath,
    createLine = require('diagram-js/lib/util/RenderUtil').createLine,
    TextUtil = require('diagram-js/lib/util/Text');

var svgAppend = require('tiny-svg/lib/append'),
    svgAttr = require('tiny-svg/lib/attr'),
    svgCreate = require('tiny-svg/lib/create');

var LABEL_STYLE = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '12px'
};
function extractClassName(str) {
    if(!str) {
        return "";
    }
    var array = str.split(".");
    return array[array.length - 1];
}

/**
 * A renderer that knows how to render custom elements.
 */
function JSR352Renderer(eventBus, styles, bpmnRenderer) {

  BaseRenderer.call(this, eventBus, 2000);

  var computeStyle = styles.computeStyle;
  var textUtil = new TextUtil({
    style: LABEL_STYLE,
    size: { width: 100 }
  });

  this.renderLabel = function(p, label, options) {
    return textUtil.createText(p, label || '', options);
  }

  this.drawRect = function(parentGfx, width, height, r, offset, attrs) {
    if (isObject(offset)) {
      attrs = offset;
      offset = 0;
    }

    offset = offset || 0;

    attrs = computeStyle(attrs, {
      stroke: 'black',
      strokeWidth: 2,
      fill: 'white'
    });

    var rect = svgCreate('rect');
    svgAttr(rect, {
      x: offset,
      y: offset,
      width: width - offset * 2,
      height: height - offset * 2,
      rx: r,
      ry: r
    });
    svgAttr(rect, attrs);

    svgAppend(parentGfx, rect);

    return rect;
  }

  this.drawShapeByType = function(p, element, type) {
    var h = bpmnRenderer.handlers[type];
    return h(p, element);
  };

  this.getCustomConnectionPath = function(connection) {
    var waypoints = connection.waypoints.map(function(p) {
      return p.original || p;
    });

    var connectionPath = [
      ['M', waypoints[0].x, waypoints[0].y]
    ];

    waypoints.forEach(function(waypoint, index) {
      if (index !== 0) {
        connectionPath.push(['L', waypoint.x, waypoint.y]);
      }
    });

    return componentsToPath(connectionPath);
  };

  this.getRoundRectPath = function(shape, borderRadius) {

    var x = shape.x,
        y = shape.y,
        width = shape.width,
        height = shape.height;

    var roundRectPath = [
      ['M', x + borderRadius, y],
      ['l', width - borderRadius * 2, 0],
      ['a', borderRadius, borderRadius, 0, 0, 1, borderRadius, borderRadius],
      ['l', 0, height - borderRadius * 2],
      ['a', borderRadius, borderRadius, 0, 0, 1, -borderRadius, borderRadius],
      ['l', borderRadius * 2 - width, 0],
      ['a', borderRadius, borderRadius, 0, 0, 1, -borderRadius, -borderRadius],
      ['l', 0, borderRadius * 2 - height],
      ['a', borderRadius, borderRadius, 0, 0, 1, borderRadius, -borderRadius],
      ['z']
    ];

    return componentsToPath(roundRectPath);
  };
}

inherits(JSR352Renderer, BaseRenderer);

module.exports = JSR352Renderer;

JSR352Renderer.$inject = [ 'eventBus', 'styles', 'bpmnRenderer' ];


JSR352Renderer.prototype.canRender = function(element) {
  return /^jsr352\:/.test(element.type);
};

JSR352Renderer.prototype.drawShape = function(p, element) {
  var type = element.type;
  // temporary solution: Element.di.isExpanded should be set.
  if (/^jsr352\:/.test(type)) {
    element.collapsed = false;
  }
  if (is(element, 'jsr352:Step')) {
    var step = this.drawRect(p, element.width, element.height, 10, 0);
    this.drawRect(p, 40,20, 0, 0);
    this.renderLabel(p, "Step",
                     {
                       box: {width: 40, height: 20, x: 0, y: 0},
                       align: 'center-middle',
                       padding: 1,
                       style: {fill: '#000000'}});
    this.renderLabel(p, element.businessObject.name, { box: element, align: 'center-top', padding: 1});
    return step;
  }
  else if (type === 'jsr352:Batchlet') {
    var batchlet = this.drawRect(p, element.width, element.height, 0, 0);
    var batchletLabel = this.drawRect(p, 20, element.height, 0, 0, {
      fill: '#000000'
    });
    this.renderLabel(p, "B",
                     {
                       box: {width: 20, height: 20, x: 0, y: 0},
                       align: 'center-middle',
                       padding: 1,
                       style: {fill: '#ffffff'}});
    this.renderLabel(p,extractClassName(element.businessObject.ref),
                     {
                       box: {width: element.width - 20, height: element.height, x: 20, y: 0},
                       align: 'center-middle',
                       padding: {left:22},
                       style: {fill: '#000000'}});
    return batchlet;
  }
  else if (type === 'jsr352:Chunk') {
    return this.drawRect(p, element.width, element.height, 10, 0);
  }
  else if (type === 'jsr352:Reader') {

    var reader = this.drawRect(p, element.width, element.height, 0, 0);
    var readerLabel = this.drawRect(p, 20, element.height, 0, 0, {
      fill: '#fc9303'
    });
    this.renderLabel(p, "R",
                     {
                       box: {width: 20, height: 20, x: 0, y: 0},
                       align: 'center-middle',
                       padding: 1,
                       style: {fill: '#ffffff'}});
    this.renderLabel(p,extractClassName(element.businessObject.ref),
                     {
                       box: {width: element.width - 20, height: element.height, x: 20, y: 0},
                       align: 'center-middle',
                       padding: {left:22},
                       style: {fill: '#000000'}});
    return reader;
  }
  else if (type === 'jsr352:Processor') {
    var reader = this.drawRect(p, element.width, element.height, 0, 0);
    var readerLabel = this.drawRect(p, 20, element.height, 0, 0, {
      fill: '#b1d412'
    });
    this.renderLabel(p, "P",
                     {
                       box: {width: 20, height: 20, x: 0, y: 0},
                       align: 'center-middle',
                       padding: 1,
                       style: {fill: '#ffffff'}});
    this.renderLabel(p,extractClassName(element.businessObject.ref),
                     {
                       box: {width: element.width - 20, height: element.height, x: 20, y: 0},
                       align: 'center-middle',
                       padding: {left:22},
                       style: {fill: '#000000'}});
    return reader;
  }
  else if (type === 'jsr352:Writer') {
    var writer = this.drawRect(p, element.width, element.height, 0, 0);
    var writerLabel = this.drawRect(p, 20, element.height, 0, 0, {
      fill: '#a1e0fc'
    });
    this.renderLabel(p, "W",
                     {
                       box: {width: 20, height: 20, x: 0, y: 0},
                       align: 'center-middle',
                       padding: 1,
                       style: {fill: '#ffffff'}});
    this.renderLabel(p,extractClassName(element.businessObject.ref),
                     {
                       box: {width: element.width - 20, height: element.height, x: 20, y: 0},
                       align: 'center-middle',
                       padding: {left:22},
                       style: {fill: '#000000'}});
    return writer;
  }
  else if (type === 'jsr352:Listener') {
    var listener = this.drawRect(p, element.width, element.height, 0, 0);
    var listenerLabel = this.drawRect(p, 20, element.height, 0, 0, {
      fill: '#e8e7e0'
    });
    this.renderLabel(p, "L",
                     {
                       box: {width: 20, height: 20, x: 0, y: 0},
                       align: 'center-middle',
                       padding: 1,
                       style: {fill: '#ffffff'}});
                     
    this.renderLabel(p,extractClassName(element.businessObject.ref),
                     {
                       box: {width: element.width - 20, height: element.height, x: 20, y: 0},
                       align: 'center-middle',
                       padding: {left:22},
                       style: {fill: '#000000'}})
    return listener;
  }
  else if (type === 'jsr352:Flow') {
    var flow = this.drawShapeByType(p,element,'bpmn:Activity');
    this.drawRect(p, 40,20, 0, 0);
    this.renderLabel(p, "Flow",
                     {
                       box: {width: 40, height: 20, x: 0, y: 0},
                       align: 'center-middle',
                       padding: 1,
                       style: {fill: '#000000'}});
    this.renderLabel(p, element.businessObject.name, { box: element, align: 'center-top', padding: 1});
    return flow;
  }
  else if (type === 'jsr352:Split') {
    var split = this.drawShapeByType(p,element,'bpmn:Lane');
    this.drawRect(p, 40,20, 0, 0);
    this.renderLabel(p, "Split",
                     {
                       box: {width: 40, height: 20, x: 0, y: 0},
                       align: 'center-middle',
                       padding: 1,
                       style: {fill: '#000000'}});
    this.renderLabel(p, element.businessObject.name, { box: element, align: 'center-top', padding: 1});
    return split;
  }
  else if (type === 'jsr352:Start') {
    return this.drawShapeByType(p, element, 'bpmn:StartEvent');
  }
  else if (type === 'jsr352:End') {
    this.drawShapeByType(p, element, 'bpmn:EndEvent');
    return this.drawShapeByType(p, element, 'bpmn:TerminateEventDefinition');
  }
  else if (type === 'jsr352:Fail') {
    this.drawShapeByType(p, element, 'bpmn:EndEvent');
    return this.drawShapeByType(p, element, 'bpmn:ErrorEventDefinition');
  }
  else if (type === 'jsr352:Stop') {
    return this.drawShapeByType(p, element, 'bpmn:IntermediateEvent');
  }
};

JSR352Renderer.prototype.getShapePath = function(shape) {
  var type = shape.type;

  if (isAny['jsr352:Step', 'jsr352:Chunk', 'jsr352:Batchlet', 'jsr352:Reader', 'jsr352:Processor', 'jsr352:Writer']) {
    return this.getRoundRectPath(shape, 10);
  }
  else if (type === 'jsr352:Flow') {
    return this.getRoundRectPath(shape, 10);
  }
  else if (type === 'jsr352:Split') {
    return this.getRoundRectPath(shape, 10);
  }
  else if (type === 'jsr352:Start') {
    return this.getRoundRectPath(shape, 10);
  }
  else if (type === 'jsr352:End') {
    return this.getRoundRectPath(shape, 10);
  }
  else if (type === 'jsr352:Fail') {
    return this.getRoundRectPath(shape, 10);
  }
  else if (type === 'jsr352:Stop') {
    return this.getRoundRectPath(shape, 10);
  }
  else if (type === 'jsr352:Listener') {
    return this.getRoundRectPath(shape, 10);
  }
};

JSR352Renderer.prototype.drawConnection = function(p, element) {
  var type = element.type;

  if (type === 'jsr352:Transition') {
    var transition = this.drawShapeByType(p, element, 'bpmn:SequenceFlow');
    return transition;
  }
};


JSR352Renderer.prototype.getConnectionPath = function(connection) {

  var type = connection.type;

  if (type === 'jsr352:Transition') {
    return this.getCustomConnectionPath(connection);
  }
};
