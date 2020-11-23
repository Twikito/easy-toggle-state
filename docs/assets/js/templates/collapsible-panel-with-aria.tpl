<!--
The data-toggle-class attribute tells this button
to toggle the class `is-open` on itself and its target on click.

The data-toggle-target-parent attribute tells to look inside its parent element
for a target element matching `#panel` selector.

The data-toggle-escape attribute tells that you can use
the escape key to toggle back off this trigger.

As the aria-expanded attribute is set, its value changes too.
-->
<button
	type="button"
	class="example-collapsible-button"
	id="buttonForPanel"
	data-toggle-class="is-open"
	data-toggle-target-parent="#panel"
	data-toggle-escape
	aria-controls="panel"
	aria-expanded="false">
	Click here
</button>

<!-- As the aria-hidden attribute is set on this target, its value changes too. -->
<div
	class="example-collapsible-panel"
	id="panel"
	role="region"
	aria-labelledby="buttonForPanel"
	aria-hidden="true">

	<div class="example-collapsible-panel-content">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
	</div>
</div>
