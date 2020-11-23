<!--
The data-toggle-class-on-target attribute tells this button
to toggle the class `is-visible` only on its target.

The data-toggle-target-self attribute tells to look inside itself
for a target element matching `.tooltip` selector.

The data-toggle-event attribute tells to use the `dblclick` event
instead of the click event.

The data-toggle-outside attribute, used with the data-toggle-outside-event attribute,
tells you can use the `click` event outside to toggle back off this trigger.
-->
<span
	class="example-tooltip"
	data-toggle-class-on-target="is-visible"
	data-toggle-target-self=".tooltip"
	data-toggle-event="dblclick"
	data-toggle-outside
	data-toggle-outside-event="click"
	aria-describedby="bywVkoZnxk">
	Click twice on me

	<!-- As the aria-hidden attribute is set on this target, its value changes too. -->
	<span
		class="tooltip"
		id="bywVkoZnxk"
		role="tooltip"
		aria-hidden="true">
		Awesome tooltip
	</span>

</span>
