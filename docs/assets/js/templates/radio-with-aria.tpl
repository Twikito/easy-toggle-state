<!-- Add this container for accessibility -->
<div role="radiogroup">

	<!--
	The data-toggle-class attribute tells this button
	to toggle the class `is-checked` on itself on click.

	The data-toggle-radio-group attribute tells that this button
	is a part of the `radioGroup3` radio group: only one of them can be active at a time.
	Since it's a radio group, this group will always keep one of its triggers active.

	The data-toggle-arrows attribute allows you to navigate
	through the buttons of the `radioGroup1` group with the arrow keys.

	As the aria-checked attribute is set, its value changes too.
	-->
	<button
		type="button"
		class="example-radio"
		id="P3xAVIJlE4"
		data-toggle-class="is-checked"
		data-toggle-radio-group="radioGroup3"
		data-toggle-arrows
		role="radio"
		aria-checked="false"
		title="Toggle this box">

		<!-- The class `sr-only` is for [hiding content for accessibility](https://snook.ca/archives/html_and_css/hiding-content-for-accessibility) -->
		<span class="sr-only">Toggle</span>

	</button>

	<!-- The label is associated to the trigger by the for attribute. -->
	<label for="P3xAVIJlE4">Option 1</label>

	<!-- Other radio buttons -->
	<br>
	<button
		type="button"
		class="example-radio"
		id="3w7E1K4ACa"
		data-toggle-class="is-checked"
		data-toggle-radio-group="radioGroup3"
		data-toggle-arrows
		role="radio"
		aria-checked="false"
		title="Toggle this box">
		<span class="sr-only">Toggle</span>
	</button>
	<label for="3w7E1K4ACa">Option 2</label>
	<br>
	<button
		type="button"
		class="example-radio"
		id="f573vOgHhL"
		data-toggle-class="is-checked"
		data-toggle-radio-group="radioGroup3"
		data-toggle-arrows
		role="radio"
		aria-checked="false"
		title="Toggle this box">
		<span class="sr-only">Toggle</span>
	</button>
	<label for="f573vOgHhL">Option 3</label>
</div>
