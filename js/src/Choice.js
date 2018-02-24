/*********************************************************************************
**
**  Choice class.
**
**  Holds information regarding the content of a choice, or any option given to
**  the player which will lead them to the choice's linked page. A choice is made
**  up of two items:
**  - text:       The text content of the choice (flavortext).
**  - linkNumber: The ID of the page to which this choice links. The chosen page
**                will then load as the currently displayed page.
**
**********************************************************************************/
class Choice {
	constructor (text="", linkNumber="") {
		this.text = text;
		this.linkNumber = linkNumber;
	}
}