<!--
The data-toggle-class attribute tells this button
to toggle the class `is-open` on itself and its target on click.

The data-toggle-target-parent attribute tells to look inside its parent element
for a target element matching `#panel_1` selector.

The data-toggle-group attribute tells that this button
is a part of the `accordion` group: only one of them can be active at a time.

The data-toggle-escape attribute tells that you can use
the escape key to toggle back off this trigger.

The data-toggle-arrows attribute allows you to navigate
through the buttons of the `accordion` group with the arrow keys.

The data-toggle-is-active attribute on the first button tells that
this one is active by default.

As the aria-expanded attribute is set, its value changes too.
-->
<button
	type="button"
	class="example-collapsible-button"
	id="buttonForPanel_1"
	data-toggle-class="is-open"
	data-toggle-target-parent="#panel_1"
	data-toggle-group="accordion"
	data-toggle-escape
	data-toggle-arrows
	data-toggle-is-active
	aria-controls="panel_1"
	aria-expanded="false">
	Click here
</button>

<!-- As the aria-hidden attribute is set on this target, its value changes too. -->
<div
	class="example-collapsible-panel"
	id="panel_1"
	role="region"
	aria-labelledby="buttonForPanel_1"
	aria-hidden="true">
	<div class="example-collapsible-panel-content">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper faucibus odio, vitae faucibus dui tempor in. Duis vitae luctus mi. Phasellus ultrices rhoncus lectus, non vehicula tortor sodales id.
	</div>
</div>

<!-- Other panels -->
<button
	type="button"
	class="example-collapsible-button"
	id="buttonForPanel_2"
	data-toggle-class="is-open"
	data-toggle-target-parent="#panel_2"
	data-toggle-group="accordion"
	data-toggle-escape
	data-toggle-arrows
	aria-controls="panel_2"
	aria-expanded="false">
	Click here
</button>

<div
	class="example-collapsible-panel"
	id="panel_2"
	role="region"
	aria-labelledby="buttonForPanel_2"
	aria-hidden="true">
	<div class="example-collapsible-panel-content">
		In in erat blandit ante mollis tincidunt. Quisque ac tempus nisi, a ultricies metus. Suspendisse et quam nec mauris feugiat luctus. Curabitur porta sem vitae nulla congue malesuada.
	</div>
</div>

<button
	type="button"
	class="example-collapsible-button"
	id="buttonForPanel_3"
	data-toggle-class="is-open"
	data-toggle-target-parent="#panel_3"
	data-toggle-group="accordion"
	data-toggle-escape
	data-toggle-arrows
	aria-controls="panel_3"
	aria-expanded="false">
	Click here
</button>

<div
	class="example-collapsible-panel"
	id="panel_3"
	role="region"
	aria-labelledby="buttonForPanel_3"
	aria-hidden="true">
	<div class="example-collapsible-panel-content">
		Nam posuere tortor a augue vulputate, at blandit ipsum tincidunt. Donec dictum eros ligula, id congue justo porta eget. Aliquam vel erat venenatis, ornare nisi vel, convallis libero.
	</div>
</div>
