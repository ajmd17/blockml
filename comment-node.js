function CommentNode(value) {
  this.value = value;
}

CommentNode.prototype.parse = function () {
};

CommentNode.prototype.transform = function () {
  return '<!-- ' + this.value + ' -->';
};

if (typeof module === 'object') {
  module.exports = CommentNode;
}