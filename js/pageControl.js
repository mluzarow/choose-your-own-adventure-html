var elementTitle;
var elementScene;
var elementAction;
var elementChoices;
var choicesList = new Array ();
var pages = new Array ();

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

window.onload = function () {
    // Capture all important elements
    elementTitle = document.getElementsByClassName ("title")[0];
    elementScene = document.getElementsByClassName ("scene")[0];
    elementAction = document.getElementsByClassName ("action")[0];
    elementChoices = document.getElementsByClassName ("choices")[0];
    
    // Dump the entire game into RAM
    loadGameText ();
}

function loadPage (pageNumber) {
    // Load page
    var requestedPage = pages [pageNumber];
    
    elementTitle.innerHTML = requestedPage.title;
    elementScene.innerHTML = requestedPage.scene;
    elementAction.innerHTML = requestedPage.action;
    
    elementChoices.innerHTML = "";
    
    for (var i = 0; i < requestedPage.choices.length; i++) {
        var newChoice = document.createElement ("BUTTON");
        newChoice.innerHTML = requestedPage.choices [i].text;
        newChoice.id = requestedPage.choices [i].linkNumber;
        newChoice.addEventListener ("click", function () {loadPage (this.id.trim ());}, false);
        
        elementChoices.appendChild (newChoice);
    }
}

function processGameText (data) {
    var parser = new DOMParser ();
    var myXML = parser.parseFromString (data, "text/xml");
    
    var rawPages = myXML.getElementsByTagName ("page");
    
    for (var i = 0; i < rawPages.length; i++) {
        // First get all the choices
        var rawChoices = rawPages [i].getElementsByTagName ("choice");
        var choices = new Array ();
        
        // For each choice, make a new Choice class
        for (var j = 0; j < rawChoices.length; j++) {
            var choiceToken = new Choice (rawChoices [j].innerHTML,
                                          rawChoices [j].id.trim ());
            
            choices.push (choiceToken);
        }
    
        // Second, build the rest of the page class
        var pageToken = new Page (rawPages [i].getElementsByTagName ("title") [0].innerHTML,
                                  rawPages [i].getElementsByTagName ("scene") [0].innerHTML,
                                  rawPages [i].getElementsByTagName ("action") [0].innerHTML,
                                  choices);
        
        // Enter page into page dictionary
        pages [rawPages [i].id] = pageToken;
    }
    
    // Load the first page of the adventure
    loadPage ("01");
}

function loadGameText () {
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
                
                processGameText (resp.responseText);
            // Fail
            } else {
                console.error ("Error: HTTP request of data file unsuccessful.");
                return;
            }
        }
    };
    
    // Send request
    resp.open ("GET", "data/bigData.txt");
    resp.send ();
}