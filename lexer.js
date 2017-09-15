if (typeof require === 'function') {
  var Token = require('./token');
}

function isSpace(ch) {
  return ch == ' ' || ch == '\n' || ch == '\t';
}

function Lexer(input) {
  this.input = input;
  this.output = [];
  this._index = 0;
}

/**
 * @return {Token[]}
 */
Lexer.prototype.analyze = function () {
  this.skipWhitespace();

  while (this.hasNext()) {
    var token = this.nextToken();

    this.skipWhitespace();

    if (token != null) {
      this.addToken(token);
    }
  }

  return this.output;
};

/**
 * @return {Token}
 */
Lexer.prototype.nextToken = function () {
  var ch = this.peekChar();

  if (ch == '"' || ch == '\'') {
    return this.readStringLiteral();
  }

  if (/[_A-Za-z]/.test(ch)) {
    return this.readIdentifier();
  }

  if (ch == '/' && this.peekChar(1) == '*') {
    return this.readBlockComment();
  }

  switch (ch) {
    case ':':
      return new Token(Token.Type.COLON, this.readChar());
    case '{':
      return new Token(Token.Type.OPEN_BRACE, this.readChar());
    case '}':
      return new Token(Token.Type.CLOSE_BRACE, this.readChar());
    default:
      return new Token(Token.Type.ERROR, 'Unknown character, ' + this.readChar());
  }
};

Lexer.prototype.readStringLiteral = function () {
  var value = '';
  var delim = this.readChar();

  for (var ch = this.readChar(); ch != delim; ch = this.readChar()) {
    if (ch == '\n' || !this.hasNext()) {
      return new Token(Token.Type.ERROR, 'Unterminated string literal');
    }

    if (ch == '\\') {
      value += this.readEscapeSequence();
    } else {
      value += ch;
    }
  }

  return new Token(Token.Type.STRING, value);
};

Lexer.prototype.readEscapeSequence = function () {
  var ch = this.readChar();

  switch (ch) {
    case 't': return '\t';
    case 'b': return '\b';
    case 'n': return '\n';
    case 'r': return '\r';
    case 'f': return '\f';
    case '\'':
    case '\"':
    case '\\':
      return ch;
    default:
      this.addToken(new Token(Token.Type.ERROR, 'Unrecognized escape sequence `\\' + ch + '`'));
  }

  return '';
};

Lexer.prototype.readIdentifier = function () {
  var value = '';
  var ch = this.peekChar();

  while (ch != undefined && /[_\-0-9A-Za-z]/.test(ch)) {
    value += this.readChar();
    ch = this.peekChar();
  }

  return new Token(Token.Type.IDENTIFIER, value);
};

Lexer.prototype.readBlockComment = function () {
  var value = '';

  // read the '/' and '*' chars
  this.readChar();
  this.readChar();

  while (this.hasNext()) {
    if (this.peekChar() == '*' && this.peekChar(1) == '/') {
      this.readChar();
      this.readChar();
      break;
    } else {
      value += this.readChar();
    }
  }

  return new Token(Token.Type.COMMENT, value.trim());
};

Lexer.prototype.skipWhitespace = function () {
  var hadNewline = false;

  while (this.hasNext() && isSpace(this.peekChar())) {
    if (this.readChar() == '\n') {
      hadNewline = true;
    }
  }

  return hadNewline;
};

Lexer.prototype.hasNext = function () {
  return this._index < this.input.length;
};

/**
 * @param {Number} [skip]
 */
Lexer.prototype.peekChar = function (skip) {
  return this.input[this._index + (skip || 0)];
};

Lexer.prototype.readChar = function () {
  return this.input[this._index++];
};

Lexer.prototype.addToken = function (token) {
  this.output.push(token);
};

if (typeof module === 'object') {
  module.exports = Lexer;
}