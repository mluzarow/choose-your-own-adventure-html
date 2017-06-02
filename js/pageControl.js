var elementTitle;
var elementScene;
var elementAction;
var elementChoices;
var choicesList = new Array ();
var pages = new Array ();

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
    
    //=========== Debug Stuff ============
    for (var i = 0; i < rawPages.length; i++) {
        console.log (rawPages [i]);
    }
    
    for (var i = 0; i < rawPages.length; i++) {
        // First get all the choices
        var rawChoices = rawPages [i].getElementsByTagName ("choice");
        var choices = new Array ();
        
        // For each choice, make a new Choice class
        for (var j = 0; j < rawChoices.length; j++) {
            var choiceToken = new Choice (rawChoices [j].getElementsByTagName ("text") [0].innerHTML,
                                          rawChoices [j].getElementsByTagName ("linkNumber") [0].innerHTML);
            
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
    //=========== Debug Stuff ============
    console.log (pages ["01"]);
    
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
                    // Failure; exit
                    return;
                }
                
                processGameText (resp.responseText);
            // Fail
            } else {
                console.log ("We are doomed. File didn't load!");
            }
        }
    };
    
    // Send request
    resp.open ("GET", "data/bigData.txt");
    resp.send ();
}