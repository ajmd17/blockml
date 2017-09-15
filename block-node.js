/**
 * @typedef {{ parse: Function, transform: Function }} CodeNode
 */

/**
 * @param {String} tagName 
 * @param {AttributeNode[]} attributes 
 * @param {CodeNode[]} children 
 */
function BlockNode(tagName, attributes, children) {
  this.tagName = tagName;
  this.attributes = attributes;
  this.children = children;
}

BlockNode.prototype.parse = function () {
  for (var i = 0; i < this.children.length; i++) {
    this.children[i].parse();
  }
};

BlockNode.prototype.transform = function () {
  var str = '<' + this.tagName;
  if (this.attributes.length != 0) {
    str += this.attributes.reduce(function (accum, el) {
      return accum + ' '  + el.transform();
    }, '');
  }
  str += '>';
  str += '\n';

  str += this.children.reduce(function (accum, el) {
    var transformedString = el.transform().split('\n').map(function (x) {
      return '  ' + x;
    }).join('\n');
    return accum + transformedString + '\n';
  }, '');

  str += '</' + this.tagName + '>';

  return str;
};

if (typeof module === 'object') {
  module.exports = BlockNode;
}