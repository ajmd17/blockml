if (typeof require === 'function') {
  var Lexer = require('./lexer');
  var Parser = require('./parser');
}

function test() {
  var input = `
    html {
      body {
        div {
          "I am a div!"
        }
        a href: "https://google.com" {
          "I am a link!"
        }
      }
    }
  `;

  var lexer = new Lexer(input);
  var tokens = lexer.analyze();

  var parser = new Parser(tokens);
  var nodes = parser.parse();

  var html = nodes.reduce(function (accum, el) {
    return accum + el.transform() + '\n';
  }, '');

  if (typeof document !== 'undefined') {
    document.body.innerHTML = html;
  } else {
    console.log('Rendered HTML:\n\n', html);
  }
}

test();