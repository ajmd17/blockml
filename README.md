# blockml

blockml is a markup language that generates HTML. The purpose of blockml is to make writing HTML feel more consistent with the way we write JavaScript and CSS.

You can use blockml on the server, or in the browser.

For example, this blockml code:

```
html {
  body {
    h1 {
      "Welcome to blockml!"
    }

    a href: "http://example.com" {
      "This is a link."
    }
  }
}
```

Would generate the following HTML:
```
<!DOCTYPE html>
<html>
  <body>
    <h1>
      Welcome to blockml!
    </h1>
    <a href="http://example.com">
      This is a link.
    </a>
  </body>
</html>
```

### Usage
To render blockml to HTML from Node.js, use the `render()` method.

```
var blockml = require('blockml');

blockml.render('html { body { "Your document here" } }', function (errors, result) {
  if (errors.length != 0) {
    console.error('Rendering errors: ', errors);
  } else {
    // do something with the result
  }
});
```

The main `blockml` function can also be used as a template tag function.

Just note that any parsing or syntax errors will be thrown, rather than being passed as a callback parameter.

Here's an example showing the usage.

```
var myPageTitle = 'Your page title here';

var myPage = blockml`
  html {
    head {
      link rel: 'stylesheet'  /* comma is optional */
            href: 'styles.css'; /* semicolon indicates no element body */
    }
    body {
      h1 {
        "${myPageTitle}"
      }

      p {
        "Lorem ipsum dolor sit amet"
        hr;
      }
    }
  }
`;
```

This would output the following HTML:
```
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="styles.css"></link>
    <!-- semicolon indicates no element body -->
  </head>
  <body>
    <h1>
      Your page title here
    </h1>
    <p>
      Lorem ipsum dolor sit amet
      <hr />
    </p>
  </body>
</html>
```


### TODO:
 - Handle `<script>` and `<style>` tags properly instead of trying to handle them like markup.
 - A react/angular/vue.js type "plugin" that manages state/props and components.