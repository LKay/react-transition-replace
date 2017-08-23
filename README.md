# react-transition-replace

[![npm](https://img.shields.io/npm/v/react-transition-replace.svg?style=flat-square)](https://www.npmjs.com/package/react-transition-replace)
[![npm dm](https://img.shields.io/npm/dm/react-transition-replace.svg?style=flat-square)](https://www.npmjs.com/package/react-transition-replace)

The `react-transition-replace` is a rewrite of widely used library [`react-css-transition-replace`](https://github.com/marnusw/react-css-transition-replace) so it is compatible with version **2.x.x** of the [`react-transition-group`](https://github.com/reactjs/react-transition-group).

While `react-transition-group` does a great job of animating changes to a list of components or a single component proper handling of the container height when animating single component replacement is not built in. This component is designed to do exactly that with an API closely following that of `TransitionGroup`.

Benefits of `react-transition-replace`:

* It automatically handles the positioning of the animated components, and allows changes in the height of container to be handled and animated with ease when various content heights differ, even when absolute positioning is used.

* Animations are fully configurable with CSS, including having the entering component wait to enter until the leaving component's animation completes. 

## Installation

To install via `npm` or `yarn`:

```bash
npm install react-transition-replace --save
# or
yarn add react-transition-replace
```

The component is intended to work with `reat-transition-group@2.x.x` and utilises some of its components: `Transition` and `CSSTransition`. Because it is a peer dependency you should add it to your project by yourself:

```bash
npm install react-transition-group --save
# or
yarn add react-transition-group
```

## Examples


### Note for NodeJS users

Because of differnt implementation of module importing in NodeJS and lack of default imports support to use `react-transiton-replace` NodeJS you need to do use Common JS import:

```javascript
var TransitionReplace  = require("react-transition-replace").default;
```


### Basic usage

By default `TransitionGroup` component will handle position of children automatically and inject inline CSS styles for animating components height. In this case you should define `timeout` property which tells the component how long takes to animate exiting and entering children. 

```jsx
import Transition from "react-transition-group/Transition";
import TransitionReplace from "react-transition-replace";

const Example = () => (
  <TransitionReplace timeout={ 500 }>
    <Transition>
      <div>{ "Example" }</div>
    </Transition>
  </TransitionReplace>
);
```

### Use with `CSSTransition`

To properly animate component using CSS classes you just need to use `CSSTransition` component and define CSS class name to animate container height during children transition. Let's say you have a `cross-fade` CSS animation defined and want to use the same name of the animation to transition you container height.

```jsx
import CSSTransition from "react-transition-group/CSSTransition";
import TransitionReplace from "react-transition-replace";

const Example = () => (
  <TransitionReplace 
    classNames="cross-fade"
  >
    <CSSTransition 
      timeout={ 500 }
      classNames="cross-fade"
    >
      <div>{ "Example" }</div>
    </CSSTransition>
  </TransitionReplace>
);
```

Additionally you need to have you animation defined as CSS styles:

```css
.cross-fade-exit {
  opacity: 1;
}
.cross-fade-exit.cross-fade-exit-active {
  opacity: 0;
  transition: opacity 1s ease-in;
}

.cross-fade-enter {
  opacity: 0;
}
.cross-fade-enter.cross-fade-enter-active {
  opacity: 1;
  transition: opacity 1s ease-in;
}

.cross-fade-height {
  transition: height .5s ease-in-out;
}
```

## Typescript

The library is written in Typescript and thus already contains its types definitions however you need to include types definitions for `react-transition-group` (they are defined as peer dependency). Please refer to the definitions from Definitely Typed published as [`@types/react-transition-group`](https://www.npmjs.com/package/@types/react-transition-group).


## API

### `<TransitionReplace>`

Properties that you can define on the component:

| Name | Type | Default Value | Note |
|---------------|------|-------|------|
| `childFactory`  | `function`  | `(child: ReactElement) => ReactElement`  | The same purpose as in [`TransactionGroup`](https://reactcommunity.org/react-transition-group/#TransitionGroup-prop-childFactory) component.  |
| `childWrapper`  | `function`  | `(child: ReactElement, props: object) => ReactElement`  | You can specify a wrapper function to for entering child. The `props` parameter will include object with CSS styles than are usualy set as inline styles on the outer element to position entering element absolutely to its parent container.  |
| `classNames`  | `string` <br> or <br>`{ height: string, heightActive: string }`  | `undefined`  | Can be either a string class name ie. `cross-fade` of object with specific class names for height transition ie. `{ height: "custom-height", heightActive: "some-height-active" }`  |
| `overflowHidden`  | `boolean`  | `false`  | If it's `true` the CSS `overflow: hidden` will be added to the wrapping container during transition. |
| `timeout` | `number` | `0` | Timout for height transition. Should be total time that it's necessary to exit old element and enter new.  |
