/**
 * Game controller for loading game data and dealing out page data.
 */
class PageController {
	constructor () {
		/**
		 * @var {Element} elementTitle   container for scene title
		 * @var {Element} elementScene   container for scene description
		 * @var {Element} elementAction  container for action text
		 * @var {Element} elementChoices container for choice buttons
		 */
		this.elementTitle = document.getElementsByClassName ("title")[0];
		this.elementScene = document.getElementsByClassName ("scene")[0];
		this.elementAction = document.getElementsByClassName ("action")[0];
		this.elementChoices = document.getElementsByClassName ("choices")[0];
		
		/**
		 * @type {Array} list of page data Page objects
		 */
		this.pages = [];
		
		// Dump the entire game into RAM
		this.requestRawGameData ();
	}
	
	/**
	 * Refreshes the text of page elements with the data in Page object of ID.
	 * 
	 * @param {String} pageID ID of the new Page object to use
	 */
	loadPage (pageID) {
		if (!this.pages.hasOwnProperty (pageID)) {
			console.warn ("Attempt at loading ID [%s] which does not exist.", pageID);
			return;
		}
		
		// Load page
		var requestedPage = this.pages [pageID];
		
		this.elementTitle.innerHTML = requestedPage.title;
		this.elementScene.innerHTML = requestedPage.scene;
		this.elementAction.innerHTML = requestedPage.action;
		
		this.elementChoices.innerHTML = "";
		
		for (var i = 0; i < requestedPage.choices.length; i++) {
			var newChoice = document.createElement ("BUTTON");
			newChoice.innerHTML = requestedPage.choices [i].text;
			newChoice.id = requestedPage.choices [i].linkNumber;
			newChoice.addEventListener (
				"click",
				function (id) {
					this.loadPage (id.trim ());
				}.bind (this, newChoice.id),
				false
			);
			
			this.elementChoices.appendChild (newChoice);
		}
	}
	
	/**
	 * Requests XML data from /data/bigData.txt containing game data for every page.
	 */
	requestRawGameData () {
		// Create new request
		var resp = new XMLHttpRequest ();
		
		// Event trigger on response answer received or timeout
		resp.onreadystatechange = function() {
			// Answer received 
			if (resp.readyState == 4) {
				// Success
				if (resp.status == 200) {
					// Check for null input
					if (!resp.responseText) {
						console.error ("Error: Could not load data file contents.");
						return;
					}
					
					this.processRawGameData (resp.responseText);
				// Fail
				} else {
					console.error ("Error: HTTP request of data file unsuccessful.");
					return;
				}
			}
		}.bind (this);
		
		// Send request
		resp.open ("GET", "data/bigData.xml");
		resp.send ();
	}
	
	/**
	 * Processes raw XML game data into Page and Choice objects sorted by included
	 * page IDs.
	 * 
	 * @param {String} data raw XML data
	 */
	processRawGameData (data) {
		var parser = new DOMParser ();
		var myXML = parser.parseFromString (data, "text/xml");
		
		var rawPages = myXML.getElementsByTagName ("page");
		
		for (var i = 0; i < rawPages.length; i++) {
			// First get all the choices
			var rawChoices = rawPages [i].getElementsByTagName ("choice");
			var choices = new Array ();
			
			// For each choice, make a new Choice class
			for (var j = 0; j < rawChoices.length; j++) {
				var choiceToken = new Choice (
					rawChoices [j].innerHTML,
					rawChoices [j].id.trim ()
				);
				
				choices.push (choiceToken);
			}
			
			// Second, build the rest of the page class
			var pageToken = new Page (
				rawPages [i].getElementsByTagName ("title") [0].innerHTML,
				rawPages [i].getElementsByTagName ("scene") [0].innerHTML,
				rawPages [i].getElementsByTagName ("action") [0].innerHTML,
				choices
			);
			
			// Enter page into page dictionary
			this.pages [rawPages [i].id] = pageToken;
		}
		
		this.loadPage ("01");
	}
}