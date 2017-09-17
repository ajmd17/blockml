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

function BlockNodeHandler(handlers) {
  for (var key in handlers) {
    this[key] = handlers[key];
  }
}

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

BlockNode.Handler = BlockNodeHandler;

/** @type {{ [tagName: string]: BlockNodeHandler }[]} */
BlockNode.customHandlers = {};

/**
 * @param {String} tagName
 * @param {BlockNodeHandler} handler
 */
BlockNode.registerCustomHandler = function (tagName, handler) {
  if (typeof this.customHandlers[tagName] !== 'undefined') {
    throw new Error('Custom handler for tag `' + tagName + '` already registered');
  }

  if (!(handler instanceof BlockNodeHandler)) {
    throw new TypeError('handler should be an instanceof BlockNodeHandler');
  }

  this.customHandlers[tagName] = handler;
};

BlockNode.prototype.isVoidElement = function () {
  return VOID_ELEMENETS.indexOf(this.tagName) !== -1;
};

BlockNode.prototype.parse = function () {
  for (var i = 0; i < this.children.length; i++) {
    this.children[i].parse();
  }
};

BlockNode.prototype.createDOMNode = function () {
  var customHandler = BlockNode.customHandlers[this.tagName];
  if (typeof customHandler !== 'undefined' && customHandler.createDOMNode !== undefined) {
    return customHandler.createDOMNode(this);
  }

  if (typeof document === 'undefined') {
    throw new Error('document is undefined. createDOMNode() should be used in a browser or headless environment.');
  }

  var element = document.createElement(this.tagName);

  for (var i = 0; i < this.attributes.length; i++) {
    var attributeNode = this.attributes[i].createDOMNode();
    if (attributeNode != null) {
      element.setAttributeNode(attributeNode);
    }
  }

  for (var i = 0; i < this.children.length; i++) {
    var childNode = this.children[i].createDOMNode();

    if (typeof childNode === 'array' || childNode instanceof Array) {
      childNode.forEach(function (el) {
        element.appendChild(el);
      });
    } else {
      element.appendChild(childNode);
    }
  }

  return element;
};

BlockNode.prototype.renderToString = function () {
  var customHandler = BlockNode.customHandlers[this.tagName];
  if (typeof customHandler !== 'undefined' && customHandler.renderToString !== undefined) {
    return customHandler.renderToString(this);
  }

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