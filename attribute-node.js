function AttributeNodeHandler(handlers) {
  for (var key in handlers) {
    this[key] = handlers[key];
  }
}

/**
 * @param {String} name 
 * @param {CodeNode} value 
 */
function AttributeNode(name, value) {
  this.name = name;
  this.value = value;
}

/** @type {function(AttributeNode)[]} */
AttributeNode.customHandlers = [];

AttributeNode.Handler = AttributeNodeHandler;

/**
 * @param {function(AttributeNode)} handler
 */
AttributeNode.registerCustomHandler = function (handler) {
  if (typeof handler !== 'function') {
    throw new TypeError('handler should be a function');
  }

  this.customHandlers.push(handler);
};

AttributeNode.prototype._runCustomHandlers = function () {
  var attrib = this;
  
  for (var i = 0; i < AttributeNode.customHandlers.length; i++) {
    attrib = AttributeNode.customHandlers[i](attrib);

    if (attrib == null) {
      return null;
    } else if (!(attrib instanceof AttributeNode)) {
      throw new TypeError('AttributeNode custom handler should return null or an AttributeNode instance');
    }
  }

  return attrib;
};

AttributeNode.prototype.parse = function () {
  this.value.parse();
};

AttributeNode.prototype.createDOMNode = function () {
  if (typeof document === 'undefined') {
    throw new Error('document is undefined. createDOMNode() should be used in a browser or headless environment.');
  }

  var attrib = this._runCustomHandlers();
  if (attrib == null) {
    return null;
  }

  var attribute = document.createAttribute(attrib.name);
  attribute.value = attrib.value.renderToString();
  return attribute;
};

AttributeNode.prototype.renderToString = function () {
  var attrib = this._runCustomHandlers();
  if (attrib == null) {
    return null;
  }

  return attrib.name + '="' + attrib.value.renderToString() + '"';
};

if (typeof module === 'object') {
  module.exports = AttributeNode;
}