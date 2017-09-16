function CommentNode(value) {
  this.value = value;
}

CommentNode.prototype.parse = function () {
};

CommentNode.prototype.createDOMNode = function () {
  if (typeof document === 'undefined') {
    throw new Error('document is undefined. createDOMNode() should be used in a browser or headless environment.');
  }

  return document.createComment(this.value);
};

CommentNode.prototype.renderToString = function () {
  return '<!-- ' + this.value + ' -->';
};

if (typeof module === 'object') {
  module.exports = CommentNode;
}