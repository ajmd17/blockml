/**
 * @param {Number} type 
 * @param {String} value 
 * @param {{ line: Number, column: Number }} location 
 */
function Token(type, value, location) {
  this.type = type;
  this.value = value;
  this.location = location;
}

Token.prototype.isContinuationToken = function () {
  return this.type == Token.Type.COMMA ||
    this.type == Token.Type.OPEN_BRACE;
};

Token.Type = {
  ERROR: -1,
  NONE: 0,
  NEWLINE: 1,
  COMMENT: 2,
  STRING: 3,
  IDENTIFIER: 4,
  COMMA: 5,
  COLON: 6,
  SEMICOLON: 7,
  OPEN_BRACE: 8,
  CLOSE_BRACE: 9
};

if (typeof module === 'object') {
  module.exports = Token;
}