/**
 * Holds information regarding the content of the current page of the adventure.
 * This information includes the four key sections of the page.
 */
class Page {
	constructor (title="", scene="", action="", choices=false) {
		/**
		 * @var {String} title  large header of the page containing a short sentence
		 *                      denoting an action. I.E. "You [verb]."
		 * @var {String} scene  grey text below the header describing the scene and
		 *                      outlining any actions that pertained to carrying
		 *                      out the last choice chosen
		 * @var {String} action white text below the scene text which describes
		 *                      any actions or narrator quips immediately before
		 *                      the next action is chosen
		 * @var {Bool}  choices list of buttons containing possible choices
		 *                      (stored as Choice objects) which, when pressed,
		 *                      load the page for said choice.
		 */
		this.title = title;
		this.scene = scene;
		this.action = action;
		
		if (!choices) {
			this.choices = new Array ();
		} else {
			this.choices = choices;
		}
	}
}