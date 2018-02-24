class PageController {
	constructor () {
		// Capture all important elements
		this.elementTitle = document.getElementsByClassName ("title")[0];
		this.elementScene = document.getElementsByClassName ("scene")[0];
		this.elementAction = document.getElementsByClassName ("action")[0];
		this.elementChoices = document.getElementsByClassName ("choices")[0];
		
		this.pages = [];
		
		// Dump the entire game into RAM
		this.requestRawGameData ();
	}
	
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
		resp.open ("GET", "data/bigData.txt");
		resp.send ();
	}
	
	processRawGameData () {
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
	}
}