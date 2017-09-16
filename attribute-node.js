/**
 * @param {String} name 
 * @param {CodeNode} value 
 */
function AttributeNode(name, value) {
  this.name = name;
  this.value = value;
}

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