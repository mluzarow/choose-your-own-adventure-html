class EditorController {
	constructor () {
		/**
		 * @var {Element} elementTimeline container for page nodes
		 * @var {Element} elementDetails  container for selected page details
		 */
		this.elementTimeline = document.getElementById ("timeline");
		this.elementDetails = document.getElementById ("page_details");
		
		/**
		 * @type {Array} list of page data Page objects
		 */
		this.pages = [];
		
		// Dump the entire game into RAM
		this.requestRawGameData ();
	}
	
	drawNode (id) {
		var timelineNode = document.createElement ("div");
		timelineNode.classList.add ("page_container");
		
		var connector = document.createElement ("div");
		connector.classList.add ("connector");
		
		var choiceDropdown = document.createElement ("div");
		choiceDropdown.classList.add ("choice_dropdown");
		choiceDropdown.classList.add ("closed");
		
		for (let i = 0; i < this.pages[id].choices.length; i++) {
			let choiceItem = document.createElement ("div");
			choiceItem.classList.add ("choice");
			
			let choiceID = document.createElement ("div");
			choiceID.classList.add ("choice_id_link");
			choiceID.innerHTML = this.pages[id].choices[i].linkNumber;
			
			let choiceContent = document.createElement ("div");
			choiceContent.classList.add ("choice_content");
			choiceContent.innerHTML = this.pages[id].choices[i].text;
			
			choiceItem.append (choiceID);
			choiceItem.append (choiceContent);
			
			if (this.pages[this.pages[id].choices[i].linkNumber] === undefined) {
				choiceItem.classList.add ("deadend");
			} else {
				choiceItem.addEventListener ("click", function () {
					choiceDropdown.classList.add ("closed");
					choiceToggle.style.display = "none";
					timelineNode.classList.add ("connecting");
					this.drawNode(choiceID.innerHTML);
				}.bind (this), false);
			}
			
			choiceDropdown.append (choiceItem);
		}
		
		var choiceToggle = document.createElement ("div");
		choiceToggle.classList.add ("choice_expand");
		choiceToggle.innerHTML = "+";
		
		var pageID = document.createElement ("div");
		pageID.classList.add ("page_id");
		pageID.innerHTML = id;
		
		var pageTitle = document.createElement ("div");
		pageTitle.classList.add ("page_title");
		pageTitle.innerHTML = this.pages[id].title;
		
		timelineNode.append (connector);
		timelineNode.append (choiceDropdown);
		timelineNode.append (choiceToggle);
		timelineNode.append (pageID);
		timelineNode.append (pageTitle);
		
		choiceToggle.addEventListener ("click", function () {
			if (this.innerHTML === "+") {
				this.innerHTML = "-";
			} else {
				this.innerHTML = "+";
			}
			choiceDropdown.classList.toggle ("closed");
		}, false);
		
		this.elementTimeline.append (timelineNode);
	}
	
	/**
	 * Requests XML data from /data/bigData.xml containing game data for every page.
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
		
		this.drawNode ("01");
	}
}