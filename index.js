if (typeof require === 'function') {
  var Token = require('./token');
  var Lexer = require('./lexer');
  var Parser = require('./parser');
  var BlockNode = require('./block-node');
}

/**
 * For use as a tagged template literal
 */
function blockml(str) {
  var raw = str.raw;
  var result = '';

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      result += raw[i - 1];
      result += (typeof arguments[i] === 'array' || arguments[i] instanceof Array)
        ? arguments[i].map(function (arg) {
            return arg;
          }).join('\n')
        : arguments[i];
    }
  }

  result += raw[raw.length - 1];
  return blockml.render(result);
}

blockml.registerCustomHandler = function (tagName, handlers) {
  BlockNode.registerCustomHandler(tagName, new BlockNode.Handler(handlers));
};

blockml.createDOMNodes = function (input, cb) {
  /** TODO */
};

/**
 * @param {String} input
 * @param {function(String[], String)} [cb]
 * @returns {String}
 */
blockml.render = function (input, cb) {
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

  var rendered = nodes.reduce(function (accum, el) {
    return accum + el.renderToString() + '\n';
  }, '');

  if (typeof cb === 'function') {
    cb(errors, rendered);
  } else {
    // if no callback supplied, throw any errors
    if (errors.length != 0) {
      throw new Error(errors.reduce(function (accum, el) {
        return el + '\n';
      }, ''));
    }
  }

  return rendered;
};

if (typeof module !== 'undefined') {
  module.exports = blockml;
}