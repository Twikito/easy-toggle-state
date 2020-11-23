<div class="example-tabs" role="tablist">
	<!--
	The data-toggle-class attribute tells this button
	to toggle the class `is-active` on itself and its target on click.

	The data-toggle-target attribute tells to look inside the whole page
	for a target element matching `#tabPanel_1_vken1R9t0e` selector.

	The data-toggle-radio-group attribute tells that this button
	is a part of the `tabsGroup_jWIl4` group: only one of them can be active at a time.
	Since it's a radio group, this group will always keep one of its triggers active.

	The data-toggle-arrows attribute allows you to navigate
	through the buttons of the `tabsGroup_jWIl4` group with the arrow keys.

	The data-toggle-is-active attribute on the first button tells that
	this one is active by default.

	As the aria-selected attribute is set, its value changes too.
	-->
	<button
		type="button"
		id="tab_1_KldSY"
		data-toggle-class
		data-toggle-target="#tabPanel_1_KldSY"
		data-toggle-radio-group="tabsGroup_jWIl4"
		data-toggle-arrows
		data-toggle-is-active
		role="tab"
		aria-selected="false"
		aria-controls="tabPanel_1_KldSY">
		tab 1
	</button>

	<!-- Other buttons -->
	<button
		type="button"
		id="tab_1_aKNv5"
		data-toggle-class
		data-toggle-target="#tabPanel_2_aKNv5"
		data-toggle-radio-group="tabsGroup_jWIl4"
		data-toggle-arrows
		role="tab"
		aria-selected="false"
		aria-controls="tabPanel_2_aKNv5">
		tab 2
	</button>
	<button
		type="button"
		id="tab_3_cUJnt"
		data-toggle-class
		data-toggle-target="#tabPanel_3_cUJnt"
		data-toggle-radio-group="tabsGroup_jWIl4"
		data-toggle-arrows
		role="tab"
		aria-selected="false"
		aria-controls="tabPanel_3_cUJnt">
		tab 3
	</button>
</div>

<!-- As the aria-hidden attribute is set on this target, its value changes too. -->
<div
	class="example-tab-panel"
	id="tabPanel_1_KldSY"
	role="tabpanel"
	aria-labelledby="tab_1_KldSY"
	aria-hidden="true">
	Panel 1<br>
	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper faucibus odio, vitae faucibus dui tempor in. Duis vitae luctus mi. Phasellus ultrices rhoncus lectus, non vehicula tortor sodales id.
</div>
<div
	class="example-tab-panel"
	id="tabPanel_2_aKNv5"
	role="tabpanel"
	aria-labelledby="tab_1_aKNv5"
	aria-hidden="true">
	Panel 2<br>
	In in erat blandit ante mollis tincidunt. Quisque ac tempus nisi, a ultricies metus. Suspendisse et quam nec mauris feugiat luctus. Curabitur porta sem vitae nulla congue malesuada.
</div>
<div
	class="example-tab-panel"
	id="tabPanel_3_cUJnt"
	role="tabpanel"
	aria-labelledby="tab_3_cUJnt"
	aria-hidden="true">
	Panel 3<br>
	Nam posuere tortor a augue vulputate, at blandit ipsum tincidunt. Donec dictum eros ligula, id congue justo porta eget. Aliquam vel erat venenatis, ornare nisi vel, convallis libero.
</div>
