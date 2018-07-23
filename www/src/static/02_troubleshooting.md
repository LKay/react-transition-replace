---
title: "Troubleshooting"
link: "Troubleshooting"
---

#### Old NodeJS

Because of different implementation of module importing in NodeJS and
lack of default imports support to use `react-transiton-replace` NodeJS
you need to do use Common JS import:

```javascript
var TransitionReplace  = require('react-transition-replace').default;
```

#### Components containing images

There is know issue with correctly transitioning components that contain
responsive images. The problem comes from incorrect height of elements
calculated at the time or component update. Images might not be yet loaded
and the time the component that needs to be transitioned and thus can't
correctly calculate the height of the whole element. Thay happens because
images are being loaded after the element is inserted into the DOM tree
and before that have initial height of `0`.

There are few workarounds for this:
* You can specify the `width` and/or `height` attributes on `<img/>` element.
* You can preload the images and render component when that is completed. Some technique is explained [here](http://www.thonky.com/javascript-and-css-guide/javascript-image-preload).
* If you're dealing with responsive images which have `height: auto` CSS property and you know the width/height ratio, you can use [this](http://andyshora.com/css-image-container-padding-hack.html) workaround.
Otherwise there is a way to use media queries for `srcset` attribute on `<img/>`, which is explained [here](https://bitsofco.de/the-srcset-and-sizes-attributes/)

#### Typescript

The library is written in Typescript and thus already contains its types
definitions however you need to include types definitions for
`react-transition-group` (they are defined as peer dependency).
Please refer to the definitions from Definitely Typed published as
[`@types/react-transition-group`](https://www.npmjs.com/package/@types/react-transition-group).
