# Easy toggle state
[![npm version](https://badge.fury.io/js/easy-toggle-state.svg?style=flat-square)](https://badge.fury.io/js/easy-toggle-state)
[![dependencies Status](https://david-dm.org/Twikito/easy-toggle-state/status.svg?style=flat-square)](https://david-dm.org/Twikito/easy-toggle-state)
[![devDependencies Status](https://david-dm.org/Twikito/easy-toggle-state/dev-status.svg?style=flat-square)](https://david-dm.org/Twikito/easy-toggle-state?type=dev)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](https://github.com/Twikito/easy-toggle-state/issues)
[![GitHub license](https://img.shields.io/github/license/Twikito/easy-toggle-state.svg?style=flat-square)](https://github.com/Twikito/easy-toggle-state/blob/master/LICENSE)

A tiny JavaScript library to easily toggle the state of any HTML element. Only set a few HTML attributes, and code the rest with your CSS skills.

## Why?

A front-end developer often has to __code scripts for interface components__. Components such as drop-downs, navigation buttons, tooltips, expandable panels, lightboxes, tabs, etc.

The thing is… Most of these components expose a __recurrent behavior__: a trigger element toggles the state of one or more target elements. So why not code this behavior once and for all?

So here is a solution: __a simple script to toggle the state of a trigger element__ with a CSS class. You can then __associate this element__ with one or more others: let's call them targets. By adding the right HTML attributes, it can __adapt to any contexts__ and behave like a chosen component.

__Only focus on adjusting the rest with your CSS creativity__.

## Recommendation

Although it is conceivable, I recommend using only buttons or links as trigger elements. If You prevent the default behavior of a link, don't forget to add the `role="button"` attribute.

## How to use

### Basics

```html
<foo data-toggle-class="class-name">
```
A CSS class to toggle each time a click is triggered on this element. If empty, the `is-active` class is used.

```html
<foo data-toggle-class="class-name" data-toggle-target="selector">
```
Toggle the class on the trigger element and all the target elements — defined by the selector — in the page. This attribute has `data-toggle-target-all` as alias.

```html
<foo data-toggle-class="class-name" data-toggle-target-parent="selector">
```
Toggle the class on the trigger element and all the target elements — defined by the selector — belonging to its parent container.

```html
<foo data-toggle-class="class-name" data-toggle-target-self="selector">
```
Toggle the class on the trigger element and all the target elements — defined by the selector — within it.


###    Advanced

```
data-toggle-is-active
```
Specify a trigger element and its targets toggled as default — set during the `onload` event. In this case, you should add the specified class name on each element.

```
data-toggle-group="groupName"
```
Specify if a trigger is a part of a group. Only one trigger of a group can be active at a time. It will actually behave like radio buttons or tabs component.
Note that a grouped trigger can’t have `data-toggle-outside` or `data-toggle-escape` behavior.

```
data-toggle-event="event"
```
Specify the event that will toggle the class, `mouseover` for example. `click` by default if not specified.

```
data-toggle-outside
```
Toggle off the class when the event is triggered again outside the trigger element.

```
data-toggle-target-only
```
Toggle the class only on the target elements.

```
data-toggle-escape
```
Toggle the class when the trigger element is active and when the <kbd>escape</kbd> key is released.

```
data-toggle-trigger-off
```
Add this attribute to an element __inside a target__ to enable this element to toggle the behavior. For example, a close button in a modal.

### More

If a trigger element has the `aria-expanded` or `aria-selected` attribute, its value will also change.

You can also change the `PREFIX` value to prevent conflict with another JS library. This prefix will be set to all attributes like `data-[PREFIX]-class`, `toggle` as default.

Finally, for asynchronous needs, you can call `window.initEasyToggleState()`.

### Installation

You can [direct download](https://rawgit.com/Twikito/easy-toggle-state/master/dist/easy-toggle-state.es6.js) the script – [ES5 and ES6 available, minified or not](https://github.com/Twikito/easy-toggle-state/tree/master/dist) –, or use NPM command:
```
$ npm install easy-toggle-state
```
Add the script in your page, and it's done.

## Contribution

Install dependencies:
```
$ npm install
```

Development:
```
$ npm run build
```

## License

MIT. Copyright (c) [Matthieu Bué](https://twikito.com)
