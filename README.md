# Easy toggle state

A tiny JavaScript library to toggle the state of any HTML element in most of contexts with ease. Only set some HTML attributes, and code the rest with your CSS skills.


## Why?

A front-end developer often has to code scripts for interface componants. Componants like dropdowns, navigation buttons, tooltips, expandable panels, lightboxes, tabs, or others.

Well… Most of these components have the same behavior: a trigger element toggles the state of one or more target elements. So why don't code this behavior only once for all?

So here is the solution I propose: a simple script to toggle the state of a trigger element with a CSS class. Then, You can associate this element to another one, or several: the targets. By adding the right HTML attributes, it can adapt to most of contexts and behave like a chosen component.

Finally, only focus yourself on adjusting the rest with CSS and all Your creativity.


## Recommendation

It is not a restriction, but I recommend to set only buttons or links as trigger elements. If You prevent the default behaviour of a link, don't forget to add ``role="button"`` attribute.


## How to use


### Basics

```html
<foo data-toggle-class="class-to-toggle">
```
A CSS class to toggle when click on this trigger element. If empty, ``is-active`` as default.

```
data-toggle-target-all="selector"
```
Toggle the class on the trigger element and all selected targets in the whole page.

```
data-toggle-target-parent="selector"
```
Toggle the class on the trigger element and all selected targets in its parent element.

```
data-toggle-target-self="selector"
```
Toggle the class on the trigger element and all selected targets inside itself.


###	Advanced

```
data-toggle-is-active
```
Specify a trigger element and its targets toggled as default (set during the onload event). In this case, You should add the specified class name on each element.

```
data-toggle-group="groupName"
```
Add this attribute to specify if a trigger is a part of a group. Only one trigger of a group can be active at a time. It will actually behave like radio buttons or tabs component.
Note that a grouped trigger can’t have ``data-toggle-outside`` or ``data-toggle-escape`` behaviour.

```
data-toggle-event="event"
```
Specify another event to toggle the class, ``mouseover`` for example. ``click`` as default if not specified.

```
data-toggle-outside
```
Toggle off the class when reproducing the event outside the trigger element.

```
data-toggle-target-only
```
Toggle the class only on the target elements.

```
data-toggle-escape
```
Toggle the class when trigger element is active and when releasing <kbd>escape</kbd> key.

```
data-toggle-trigger-off
```
Add this attribute on an element __inside a target__ to enable this element to toggle off. For example, a close button in a popin box.


### More

If trigger element has ``aria-expanded`` or ``aria-selected`` attribute, its value will also change.

You can also change prefix ``PREFIX`` value to prevent conflict with another JS library. This prefix will be set to all attributes like ``data-[PREFIX]-class``, ``toggle`` as default.

Finally, for asynchronous needs, You can call ``window.initEasyToggleState()``.


## License

MIT. Copyright (c) [Matthieu Bué](https://twikito.com)
