/**
 * @param {String} value 
 */
function StringNode(value) {
  this.value = value;
}

StringNode.prototype.parse = function () {
};

StringNode.prototype.createDOMNode = function () {
  if (typeof document === 'undefined') {
    throw new Error('document is undefined. createDOMNode() should be used in a browser or headless environment.');
  }

  return document.createTextNode(this.value);
};

StringNode.prototype.renderToString = function () {
  return this.value;
};

if (typeof module === 'object') {
  module.exports = StringNode;
}