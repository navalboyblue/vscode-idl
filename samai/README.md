<p><a href="https://nodei.co/npm/samai/"><img src="https://nodei.co/npm/samai.png"></a></p>

# Samai

Pseudo-randomly generated patterns inspired by the Kente cloth tradition of Ghana.

## Example

```js
var options = {
    date: new Date('01-18-2018'),
    width: 400,
    dark_colors: ['#900', '#072'],
    light_colors: ['#AA6', '#990', '#222'],
    fabric_enabled: true,
    n: 37
};
var samai = new Samai(options);
var body = document.querySelector('body');
samai.getPNG().then(src => {
    body.style.backgroundSize = samai.width + 'px';
    body.style.background = "url('" + src + "')";
});
```

This code produces the following pattern:

![pattern example](http://www.niiyeboah.com/img/sama.example.png)

## Dependencies

[SVG.js](http://svgjs.com/) ([npm](https://www.npmjs.com/package/svgjs)) ([cdnjs](https://cdnjs.com/libraries/svg.js))

## Documentation

Check the [jsdoc](http://www.niiyeboah.com/samai/doc) for more information.
