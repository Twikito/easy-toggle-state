
<div class="example-tabs">
	<!--
	The data-toggle-class attribute tells this button
	to toggle the class `is-active` on itself and its target on click.

	The data-toggle-target attribute tells to look inside the whole page
	for a target element matching `#tabPanel_1_RZJA4` selector.

	The data-toggle-radio-group attribute tells that this button
	is a part of the `tabsGroup_VNhKR` group: only one of them can be active at a time.
	Since it's a radio group, this group will always keep one of its triggers active.

	The data-toggle-is-active attribute on the first button tells that
	this one is active by default.
	-->
	<button
		type="button"
		data-toggle-class
		data-toggle-target="#tabPanel_1_RZJA4"
		data-toggle-radio-group="tabsGroup_VNhKR"
		data-toggle-is-active>
		tab 1
	</button>

	<!-- Other buttons -->
	<button
		type="button"
		data-toggle-class
		data-toggle-target="#tabPanel_2_E5hxa"
		data-toggle-radio-group="tabsGroup_VNhKR">
		tab 2
	</button>
	<button
		type="button"
		data-toggle-class
		data-toggle-target="#tabPanel_3_47E6k"
		data-toggle-radio-group="tabsGroup_VNhKR">
		tab 3
	</button>
</div>

<div class="example-tab-panel" id="tabPanel_1_RZJA4">
	Panel 1<br>
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper faucibus odio, vitae faucibus dui tempor in. Duis vitae luctus mi. Phasellus ultrices rhoncus lectus, non vehicula tortor sodales id.
</div>
<div class="example-tab-panel" id="tabPanel_2_E5hxa">
	Panel 2<br>
	In in erat blandit ante mollis tincidunt. Quisque ac tempus nisi, a ultricies metus. Suspendisse et quam nec mauris feugiat luctus. Curabitur porta sem vitae nulla congue malesuada.
</div>
<div class="example-tab-panel" id="tabPanel_3_47E6k">
	Panel 3<br>
	Nam posuere tortor a augue vulputate, at blandit ipsum tincidunt. Donec dictum eros ligula, id congue justo porta eget. Aliquam vel erat venenatis, ornare nisi vel, convallis libero.
</div>
