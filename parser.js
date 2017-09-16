if (typeof require === 'function') {
  var Token = require('./token');
  var BlockNode = require('./block-node');
  var AttributeNode = require('./attribute-node');
  var StringNode = require('./string-node');
  var CommentNode = require('./comment-node');
  var EmptyNode = require('./empty-node');
}

/**
 * 
 * @param {String} message 
 * @param {{ line: Number, column: Number }} location 
 */
function ParseError(message, location) {
  this.message = message;
  this.location = location;
}

/**
 * @param {Token[]} tokens 
 */
function Parser(tokens) {
  this.tokens = tokens;
  this.index = 0;

  /** @type {ParseError[]} */
  this.errors = [];

  /** @type {CodeNode[]} */
  this.nodes = [];
}

Parser.prototype.hasNext = function () {
  return this.index < this.tokens.length;
};

Parser.prototype.peekToken = function () {
  return this.tokens[this.index];
};

Parser.prototype.readToken = function () {
  if (!this.hasNext()) {
    throw new Error('Out of bounds');
  }
  return this.tokens[this.index++];
};

/**
 * @param {Number} type
 * @param {Boolean} [read]
 * @param {String} [value]
 */
Parser.prototype.matchToken = function (type, read, value) {
  var peek = this.peekToken();

  if (peek != null && peek.type == type) {
    if (typeof value !== 'undefined') {
      if (peek.value != value) {
        return null;
      }
    }

    if (read) {
      return this.readToken();
    }

    return peek;
  }

  return null;
};

/**
 * @param {Number} type
 * @param {Boolean} [read]
 * @param {String} [value]
 */
Parser.prototype.expectToken = function (type, read, value) {
  var token = this.matchToken(type, read, value);

  if (token == null) {
    var error;

    if (typeof value === 'undefined') {
      error = new ParseError('Expected `' + value + '`');
    } else {
      error = new ParseError('Expected a ' + Object.keys(Token.Type)[type].toLowerCase());
    }
  }

  return token;
}

Parser.prototype.parse = function () {
  while (this.hasNext()) {
    var node = this.parseStatement();
    if (node != null) {
      this.nodes.push(node);
    } else {
      if (this.hasNext()) {
        var token = this.readToken();

        if (token.type != Token.Type.ERROR) {
          this.errors.push(new ParseError('Unexpected token `' + token.value + '`'));
        }
      } else {
        this.errors.push(new ParseError('Unexpected end of input'));
      }
    }
  }

  return this.nodes;
};

Parser.prototype.parseStatement = function () {
  if (this.matchToken(Token.Type.ERROR)) {
    return null;
  }

  if (this.matchToken(Token.Type.NONE)) {
    return null;
  }

  if (this.matchToken(Token.Type.SEMICOLON, true)) {
    return new EmptyNode();
  }

  if (this.matchToken(Token.Type.COMMENT)) {
    return this.parseComment();
  }

  if (this.matchToken(Token.Type.IDENTIFIER)) {
    return this.parseBlock();
  }

  return this.parseExpression();
};

Parser.prototype.parseExpression = function () {
  if (this.matchToken(Token.Type.STRING)) {
    return this.parseString();
  }

  return null;
};

Parser.prototype.parseComment = function () {
  var token = this.expectToken(Token.Type.COMMENT, true);
  return new CommentNode(token.value);
};

Parser.prototype.parseString = function () {
  var token = this.expectToken(Token.Type.STRING, true);
  return new StringNode(token.value);
};

Parser.prototype.parseBlock = function () {
  var ident = this.expectToken(Token.Type.IDENTIFIER, true);

  /** @type {AttributeNode[]} */
  var attributes = [];

  for (var token; token = this.matchToken(Token.Type.IDENTIFIER, true);) {
    if (!this.expectToken(Token.Type.COLON, true)) {
      return null;
    }

    var expr = this.parseExpression();
    if (expr == null) {
      return null;
    }

    attributes.push(new AttributeNode(token.value, expr));

    // read optional commas. used to avoid inserting a semicolon
    this.matchToken(Token.Type.COMMENT, true);
    this.matchToken(Token.Type.COMMA, true);
    this.matchToken(Token.Type.COMMENT, true);
  }

  /** @type {CodeNode[]} */
  var childStatements = [];

  // semi-colons at end of statements close elements right away.
  if (!this.matchToken(Token.Type.SEMICOLON, true)) {
    if (this.expectToken(Token.Type.OPEN_BRACE, true) == null) {
      return null;
    }

    while (!this.matchToken(Token.Type.CLOSE_BRACE, false)) {
      var stmt = this.parseStatement();
      if (stmt == null) {
        return null;
      }
      childStatements.push(stmt);
    }

    this.expectToken(Token.Type.CLOSE_BRACE, true);
  }

  return new BlockNode(ident.value, attributes, childStatements);
};

if (typeof module === 'object') {
  module.exports = Parser;
}