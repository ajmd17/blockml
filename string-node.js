/**
 * @param {String} value 
 */
function StringNode(value) {
  this.value = value;
}

StringNode.prototype.parse = function () {
};

StringNode.prototype.transform = function () {
  return this.value;
};

if (typeof module === 'object') {
  module.exports = StringNode;
}