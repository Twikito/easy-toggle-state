<!--
The data-toggle-class attribute tells this button
to toggle the class `is-pressed` on itself on click.
As `aria-pressed` attribute is set, its value changes too.
-->
<button
	type="button"
	class="example-switchbox"
	data-toggle-class="is-pressed"
	id="switchbox_V2VVB"
	aria-pressed="false"
	title="Toggle this box">

	<!--
	The words 'yes' and 'no' are here to add more sense and to make
	this component more accessible by not rendering each state with only colors.
	-->
	<span class="example-switchbox-yes">yes</span>
	<span class="example-switchbox-no">no</span>

	<!-- The class `sr-only` is for [hiding content for accessibility](https://snook.ca/archives/html_and_css/hiding-content-for-accessibility) -->
	<span class="sr-only">Toggle</span>

</button>

<!-- The label is associated to the trigger by the for attribute. -->
<label for="switchbox_V2VVB">Isn't this awesome?</label>
