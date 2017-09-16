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

/** @type {function(String, *)[]} */
AttributeNode.customHandlers = [];

AttributeNode.Handler = AttributeNodeHandler;

/**
 * @param {function(String, *)} handler
 */
AttributeNode.registerCustomHandler = function (handler) {
  if (typeof handler !== 'function') {
    throw new TypeError('handler should be a function');
  }

  this.customHandlers.push(handler);
};

AttributeNode.prototype.parse = function () {
  this.value.parse();
};

AttributeNode.prototype.createDOMNode = function () {
  if (typeof document === 'undefined') {
    throw new Error('document is undefined. createDOMNode() should be used in a browser or headless environment.');
  }

  var attribute = document.createAttribute(this.name);
  attribute.value = this.value;
  return attribute;
};

AttributeNode.prototype.renderToString = function () {
  return this.name + '="' + this.value.renderToString() + '"';
};

if (typeof module === 'object') {
  module.exports = AttributeNode;
}