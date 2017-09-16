/**
 * @typedef {{ parse: Function, renderToString: Function, createDOMNode: Function }} CodeNode
 */

const VOID_ELEMENETS = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

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

BlockNode.prototype.isVoidElement = function () {
  return VOID_ELEMENETS.indexOf(this.tagName) !== -1;
};

BlockNode.prototype.parse = function () {
  for (var i = 0; i < this.children.length; i++) {
    this.children[i].parse();
  }
};

BlockNode.prototype.createDOMNode = function () {
  if (typeof document === 'undefined') {
    throw new Error('document is undefined. createDOMNode() should be used in a browser or headless environment.');
  }

  var element = document.createElement(this.tagName);

  for (var i = 0; i < this.attributes.length; i++) {
    var attributeNode = this.attributes[i].createDOMNode();
    element.setAttributeNode(attributeNode);
  }

  for (var i = 0; i < this.children.length; i++) {
    var childNode = this.children[i].createDOMNode();
    element.appendChild(childNode);
  }

  return element;
};

BlockNode.prototype.renderToString = function () {
  var str = '<' + this.tagName;
  if (this.attributes.length != 0) {
    str += this.attributes.reduce(function (accum, el) {
      return accum + ' '  + el.renderToString();
    }, '');
  }

  if (this.isVoidElement() && this.children.length == 0) {
    str += ' />';
    return str;
  } else {
    str += '>';
  }

  if (this.children.length != 0) {
    str += this.children.reduce(function (accum, el) {
      var transformedString = el.renderToString().split('\n').map(function (x) {
        return '  ' + x;
      }).join('\n');
      return accum + transformedString + '\n';
    }, '\n');
  }

  str += '</' + this.tagName + '>';

  return str;
};

if (typeof module === 'object') {
  module.exports = BlockNode;
}