'use strict';

var assign = require('lodash/object/assign'),
    defaults = require('lodash/object/defaults'),
    inherits = require('inherits'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;


var BpmnElementFactory = require('bpmn-js/lib/features/modeling/ElementFactory'),
    LabelUtil = require('bpmn-js/lib/util/LabelUtil');


/**
 * A custom factory that knows how to create BPMN _and_ custom elements.
 */
function JSR352ElementFactory(bpmnFactory, moddle, translate) {
  BpmnElementFactory.call(this, bpmnFactory, moddle, translate);

  var self = this;

  /**
   * Create a diagram-js element with the given type (any of shape, connection, label).
   *
   * @param  {String} elementType
   * @param  {Object} attrs
   *
   * @return {djs.model.Base}
   */
  this.create = function(elementType, attrs) {
    var type = attrs.type;

    if (elementType === 'label') {
      return self.baseCreate(elementType, assign({ type: 'label' }, LabelUtil.DEFAULT_LABEL_SIZE, attrs));
    }

    // add type to businessObject if custom
    if (/^jsr352\:/.test(type)) {
      var businessObject = attrs.businessObject;
      if (!businessObject) {
        businessObject = this._bpmnFactory.create(type, attrs);

        if(attrs.id) {
          assign(businessObject, {
            id: attrs.id
          });
        }
      }

      // add width and height if shape
      if (!/\:Connection$/.test(type)) {
        defaults(attrs, self._getCustomElementSize(type));
      }

      attrs = assign({
        businessObject: businessObject,
        id: businessObject.id
      }, attrs);

      return self.createBpmnElement(elementType, attrs);
    }

    return self.createBpmnElement(elementType, attrs);
  };
}

inherits(JSR352ElementFactory, BpmnElementFactory);

module.exports = JSR352ElementFactory;

JSR352ElementFactory.$inject = [ 'bpmnFactory', 'moddle', 'translate' ];


/**
 * Returns the default size of custom shapes.
 *
 * The following example shows an interface on how
 * to setup the custom shapes's dimensions.
 *
 * @example
 *
 * var shapes = {
 *   triangle: { width: 40, height: 40 },
 *   rectangle: { width: 100, height: 20 }
 * };
 *
 * return shapes[type];
 *
 *
 * @param {String} type
 *
 * @return {Dimensions} a {width, height} object representing the size of the element
 */
JSR352ElementFactory.prototype._getCustomElementSize = function (type) {
  var shapes = {
    __default: { width: 100, height: 80 },
    'jsr352:Split': { width: 600, height: 400 },
    'jsr352:Flow': { width: 400, height: 240 },
    'jsr352:Step': { width: 120, height: 100 },
    'jsr352:Batchlet': { width: 220, height: 20 },
    'jsr352:Chunk': { width: 230, height: 80 },
    'jsr352:Reader': { width: 220, height: 20 },
    'jsr352:Processor': { width: 220, height: 20 },
    'jsr352:Writer': { width: 220, height: 20 },
    'jsr352:Start': { width: 40, height: 40 },
    'jsr352:End': { width: 40, height: 40 },
    'jsr352:Fail': { width: 40, height: 40 },
    'jsr352:Stop': { width: 40, height: 40 },
    'jsr352:Listener': {width: 220, height: 20}
  };

  return shapes[type] || shapes.__default;
};
