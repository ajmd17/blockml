if (typeof require === 'function') {
  var blockml = require('./index');
}

function test() {
  // custom handlers
  /*blockml.registerCustomHandler('head', {
    renderToString: function (node) {
      return 'custom rendering';
    }
  });*/

  var input = `
    html {
      head {
        link
          rel: 'stylesheet'
          href: 'styles.css';
      }
      body {
        div {
          "I am a div"
        }

        input type: "text";

        a href: "https://google.com" {
          "I am a link!"
        }
      }
    }
  `;

  if (typeof document !== 'undefined') {
    var domNodes = blockml.createDOMNodes(input);
    document.body.appendChild(domNodes);
  } else {
    blockml.render(input, function (errors, result) {
      if (errors.length) {
        console.error('Errors: ', errors);
      } else {
        console.log('Rendered HTML:\n\n', result);
      }
    });
  }
}

test();