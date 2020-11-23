<!--
The data-toggle-class-on-target attribute tells this button
to toggle the class `is-visible` only on its target.

The data-toggle-target-self attribute tells to look inside itself
for a target element matching `.tooltip` selector.

The data-toggle-event attribute tells to use the `mouseover` event
instead of the click event.

The data-toggle-outside attribute tells to use the same `mouseover` event
outside to toggle back off this trigger.
-->
<span
	class="example-tooltip"
	data-toggle-class-on-target="is-visible"
	data-toggle-target-self=".tooltip"
	data-toggle-event="mouseover"
	data-toggle-outside
	aria-describedby="wvrk7BpJVI">
	Hover me

	<!-- As the aria-hidden attribute is set on this target, its value changes too. -->
	<span
		class="tooltip"
		id="wvrk7BpJVI"
		role="tooltip"
		aria-hidden="true">
		Awesome tooltip
	</span>

</span>
