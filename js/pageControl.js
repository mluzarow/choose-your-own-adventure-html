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
            choices = new Array ();
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
    
    // Load the first page of the adventure
    loadPage ("01");
}

function loadPage (pageNumber) {
    // Load page
    var requestedPage = pages [pageNumber];
    
    elementTitle.innerHTML = requestedPage.title;
    elementScene.innerHTML = requestedPage.scene;
    elementAction.innerHTML = requestedPage.action;
    
    for (var i = 0; i < requestedPage.choices.length; i++) {
        var fullLink = "https://mluzarow.github.io/choose-your-own-adventure/" + requestedPage.choices [i].linkNumber;
    
        elementChoices.innerHTML += "<div class=choice><a href=\"" + fullLink + "\">" + requestedPage.choices [i].text + "</a></div>";
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
            var choice = new Choice (rawChoices [j].text,
                                     rawChoices [j].linkNumber);
            
            choices.push (choice);
        }
    
        // Second, build the rest of the page class
        var page = new Page (rawPages [i].getElementsByTagName ("title") [0],
                             rawPages [i].getElementsByTagName ("scene") [0],
                             rawPages [i].getElementsByTagName ("action") [0],
                             choices);
        
        // Enter page into page dictionary
        pages [rawPages [i].id] = page;
    }
    //=========== Debug Stuff ============
    console.log (pages ["01"]);
    
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