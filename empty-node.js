function EmptyNode() {
}

EmptyNode.prototype.parse = function () {
};

EmptyNode.prototype.createDOMNode = function () {
  return null;
};

EmptyNode.prototype.renderToString = function () {
  return '';
};

if (typeof module === 'object') {
  module.exports = EmptyNode;
}