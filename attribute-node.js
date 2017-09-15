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

AttributeNode.prototype.transform = function () {
  return this.name + '="' + this.value.transform() + '"';
};

if (typeof module === 'object') {
  module.exports = AttributeNode;
}