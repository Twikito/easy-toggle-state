# easy-toggle-state

Tiny JavaScript plugin to toggle the state of any element in any context. Only set some HTML attributes, and let all the things to your CSS skills.

## How to use

### Basic

```html
<foo data-toggle-class="class-to-toggle">
```
A CSS class that will be toggled on click on this trigger element.

###	Advanced

```
data-toggle-target-all="selector"
```
Add this attribute to toggle the class on the trigger element and all selected targets in the whole page.

```
data-toggle-target-parent="selector"
```
Add this attribute to toggle the class on the trigger element and all selected targets in trigger's parent element.

```
data-toggle-target-self="selector"
```
Add this attribute to toggle the class on the trigger element and all the selected targets inside the trigger element.

```
data-toggle-is-active
```
Add this attribute to specify if a trigger element and its targets has to be toggled by default (onLoad). You should add the specified class name on each element.

```
data-toggle-event="event"
```
Add this attribute to specify another event to toggle the class, ``mouseover`` for example. ``click`` as default if not specified.

```
data-toggle-outside
```
Add this attribute to toggle off the class when reproducing the event outside the trigger element.

```
data-toggle-target-only
```
Add this attribute to toggle the class only on the target elements.

```
data-toggle-escape
```
Add this attribute to toggle the class when trigger element was already triggered and escape key is released.

```
data-toggle-trigger-off
```
Add this attribute on an element *inside a target element* (typically button or link) to enable this element to toggle off.

### More

If ``aria-expanded`` or ``aria-selected`` attribute is set on the trigger element, its value will also be changed.

You can also specify another prefix ``TOGGLE_CLASS_PREFIX`` value to avoid any conflict with other JavaScript feature. This prefix will be set to all attributes like ``data-[prefix]class``.

For single page application, You can call ``window.initEasyToggleState()`` when You need it.

## License

MIT. Copyright (c) [Matthieu Bué](https://twikito.com)
