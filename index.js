if (typeof require === 'function') {
  var Token = require('./token');
  var Lexer = require('./lexer');
  var Parser = require('./parser');
  var BlockNode = require('./block-node');
  var AttributeNode = require('./attribute-node');
}

/**
 * For use as a tagged template literal
 */
function blockml(str) {
  var raw = str.raw;
  var result = '';

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      result += raw[i - 1] + blockml._templateArgumentToString(arguments[i]);
    }
  }

  result += raw[raw.length - 1];
  return blockml.render(result);
}

blockml._templateMiddleware = [];

/**
 * Add another function to be called when iterating template items
 */
blockml.registerTemplateMiddleware = function (handler) {
  this._templateMiddleware.push(handler);
};

/**
 * @returns {String}
 */
blockml._templateArgumentToString = function (obj) {
  if (typeof obj === 'array' || obj instanceof Array) {
    return obj.reduce(function (accum, el) {
      return accum + blockml._templateArgumentToString(el);
    }, '');
  }

  var result = obj;

  for (var i = 0; i < blockml._templateMiddleware.length; i++) {
    result = blockml._templateMiddleware[i](result);
  }

  return String(result);
};

blockml.registerCustomAttributeHandler = function (tagName, handlers) {
  AttributeNode.registerCustomHandler(tagName, new AttributeNode.Handler(handlers));
};

blockml.registerCustomBlockHandler = function (tagName, handlers) {
  BlockNode.registerCustomHandler(tagName, new BlockNode.Handler(handlers));
};

blockml._parse = function (input) {
  var errors = [];

  var lexer = new Lexer(input);
  var tokens = lexer.analyze();

  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].type === Token.Type.ERROR) {
      errors.push(tokens[i].value);
    }
  }

  var parser = new Parser(tokens);
  var nodes = parser.parse();

  for (var i = 0; i < parser.errors.length; i++) {
    errors.push(parser.errors[i].message);
  }

  return {
    errors: errors,
    nodes: nodes
  };
};

blockml.createDOMNodes = function (input, cb) {
  if (typeof document === 'undefined') {
    throw new Error('document is undefined. createDOMNode() should be used in a browser or headless environment.');
  }

  var result = this._parse(input);
  var rootElement = document.createElement('div');

  for (var i = 0; i < result.nodes.length; i++) {
    var childNode = result.nodes[i].createDOMNode();
    rootElement.appendChild(childNode);
  }

  if (typeof cb === 'function') {
    cb(result.errors, rootElement);
  } else {
    // if no callback supplied, throw any errors
    if (result.errors.length != 0) {
      throw new Error(result.errors.reduce(function (accum, el) {
        return el + '\n';
      }, ''));
    }
  }

  return rootElement;
};

/**
 * @param {String} input
 * @param {function(String[], String)} [cb]
 * @returns {String}
 */
blockml.render = function (input, cb) {
  var result = this._parse(input);
  var rendered = result.nodes.reduce(function (accum, el) {
    return accum + el.renderToString() + '\n';
  }, '');

  if (typeof cb === 'function') {
    cb(result.errors, rendered);
  } else {
    // if no callback supplied, throw any errors
    if (result.errors.length != 0) {
      throw new Error(result.errors.reduce(function (accum, el) {
        return el + '\n';
      }, ''));
    }
  }

  return rendered;
};

if (typeof module !== 'undefined') {
  module.exports = blockml;
}