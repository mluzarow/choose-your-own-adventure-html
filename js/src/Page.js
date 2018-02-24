/*********************************************************************************
**
**  Page class.
**
**  Holds information regarding the content of the current page of the
**  adventure. This information includes the four key sections of the
**  page:
**  - title:   The large header of the page containing a short sentence
**             denoting an action. I.E. "You [verb]."
**  - scene:   Grey text below the header describing the scene and outlining
**             any actions that pertained to carrying out the last choice
**             chosen.
**  - action:  White text below the scene text which describes any actions or
**             narrator quips immediately before the next action is chosen.
**  - choices: A list of buttons containing possible choices (stored as Choice
**             objects) which, when pressed, load the page for said choice.
**
**********************************************************************************/
class Page {
	constructor (title="", scene="", action="", choices=false) {
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