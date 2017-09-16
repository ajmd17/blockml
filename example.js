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

  var input = blockml`
    html {
      head {
        link
          rel: 'stylesheet'
          href: 'styles.css';
      }
      body @click: "${function () {
        console.log('Hello World!');
      }}" {
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

  console.log(input)
  
  /*blockml.render(input, function (errors, result) {
    if (errors.length) {
      console.error('Errors: ', errors);
    } else {
      if (typeof document !== 'undefined') {
        document.body.innerHTML = result;
      } else {
        console.log('Rendered HTML:\n\n', result);
      }
    }
  });*/
}

test();