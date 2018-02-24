/**
 * Holds information regarding the content of a choice, or any option given to
 * the player which will lead them to the choice's linked page.
 */
class Choice {
	constructor (text="", linkNumber="") {
		/**
		 * @var {String} text       text content of the choice (flavortext)
		 * @var {String} linkNumber ID of the page to which this choice links.
		 *                          The chosen page will then load as the currently
		 *                          displayed page.
		 */
		this.text = text;
		this.linkNumber = linkNumber;
	}
}