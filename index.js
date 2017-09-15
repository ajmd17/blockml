if (typeof require === 'function') {
  var Token = require('./token');
  var Lexer = require('./lexer');
  var Parser = require('./parser');
}

/**
 * @param {{}} [opts] 
 */
function BlockML(opts) {
  this.opts = opts || {};
}

/**
 * @param {String} input
 * @param {function(String[], String)} [cb]
 * @returns {String}
 */
BlockML.prototype.render = function (input, cb) {
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

  var header = '<!DOCTYPE html>\n';

  var rendered = header + nodes.reduce(function (accum, el) {
    return accum + el.transform() + '\n';
  }, '');

  if (typeof cb === 'function') {
    cb(errors, rendered);
  }

  return rendered;
};

var blockml = new BlockML();

if (typeof module !== 'undefined') {
  module.exports = blockml;
}