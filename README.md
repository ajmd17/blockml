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