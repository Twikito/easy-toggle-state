<!--
The data-toggle-class attribute tells this button
to toggle the class `is-checked` on itself and its target on click.

The data-toggle-target-self attribute tells to look inside itself
for a target element matching `.example-checkbox` selector.

As the aria-checked attribute is set, its value changes too.
-->
<button
	type="button"
	class="example-checkbox-container"
	data-toggle-class="is-checked"
	data-toggle-target-self=".example-checkbox"
	role="checkbox"
	aria-checked="false">

	<span class="example-checkbox"></span>
	Awesome checkbox

</button>
