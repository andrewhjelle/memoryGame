// *VARIABLES*
var boxesCount = 16;
var boxVal = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
var boxState = [];
var clickedBoxVal;
var clickedBoxPlc;
var oldClickedBoxPlc;
var oldClickedBoxVal;
var oldBox;
var oldBoxNum;
var origBox;
var newBox;
var boxNum;
var matchedCount;
var clickCount = 0;
//var score = 0;
//var img = document.createElement("IMG");
var start = new Date;
var trophyWinLevel;
var trophyNames = ["D3", "Championship", "Premier"];
var trophyLevels = [40,35,25];
var trophyLevelsText = [trophyLevels[1] + "+", "<" + trophyLevels[1],"<" + trophyLevels[2]];
var highScore = 30;
var highScore = localStorage.getItem("highscore");
var currentLevel = trophyNames[2];

// *PAGE SETUP* 

// Shuffle boxes: Via https://stackoverflow.com/questions/2450954
boxVal.sort(() => Math.random() * 2 - 1); 

// Create html boxes for cards: Club logos via http://www.stickpng.com/
// Trophy logo By Jarke, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=2065872
for (let boxes = 0; boxes < boxesCount; boxes++) {
    $("<div class =" + boxes + "><img class=Img"+ boxes + "-" + boxVal[boxes] +" src=img/trophy.png></div>").appendTo($(".boxsection"));
    boxState.push("Closed");
};

// Add "closed" class
$(".boxsection").find("div").addClass("closed");

// Create high score
$("<div class=highScore>Fewest Clicks Ever: "+ highScore + "</div>").insertAfter($(".clicks"));

// Create html boxes for trophy tally
for (let trophies = 0; trophies < 3; trophies++) {
    $("<img class =img" + trophyNames[trophies] +  " src=img/trophy-full.png>").appendTo($(".trophies"));

    $("<p class=p"+ trophyNames[trophies] + ">"+trophyNames[trophies]+"</br>" + trophyLevelsText[trophies] + " Clicks</p>").appendTo($(".trophydesc"));
};

trophyWinLevel = trophyNames[2];


// *FUNCTIONS*
function open(){
    // Update counts + values
    boxState.splice(boxNum, 1, "Opened");
    oldClickedBoxVal = clickedBoxVal
    clickedBoxVal = boxVal[boxNum];
    oldBoxNum = clickedBoxPlc;
    oldClickedBoxPlc = clickedBoxPlc;
    clickedBoxPlc = boxNum;
    
    // Only increment counter if box clicked is different than last clicked
    if (oldBoxNum != boxNum){
        clickCount++;
    }    
    
    // Remember place of most last clicked box
    oldBox = origBox;
    origBox = newBox;
    
    // Switch classes + animate
    newBox.addClass("opened").removeClass("closed");
    
    // Reveal card
    show(boxNum, clickedBoxVal);
};

function show(boxorder, cboxval){
    $(".Img" + boxorder + "-" + cboxval).attr("src","img/"+ cboxval +".png");  
};

function hide(box, cBoxVal){
    $(".Img" + box + "-" + cBoxVal).attr("src","img/trophy.png"); 
};

function close(){
    // Reset box
    newBox.addClass("closed").removeClass("opened");
    
    // Update which boxes are "Unclicked" in the array
    boxState.splice(boxNum, 1, "Closed");
    
    // Hide card
    hide(boxNum, clickedBoxVal);
    
    // Update counts
    clickedBoxVal = "";
    
};

function match(){
    // Switch classes
    newBox.addClass("matched").removeClass("opened closed");
    origBox.addClass("matched").removeClass("opened closed");
    
    // Update which boxes are "Matched" in the array
    boxState.splice(boxNum, 1, "Matched");
    boxState.splice(clickedBoxPlc, 1, "Matched"); 
    
    // Reveal card  
    show(boxNum, clickedBoxVal);
    
    // Update counts
    clickedBoxVal = "";
    clickCount++;
    
    // Update Match count: Via https://stackoverflow.com/questions/9996727
    matchedCount = boxState.filter(function(item){return item === "Matched";}).length;
};

function noMatch(){
    $(".boxsection").find("div").off("click", clicker);
    
    // "No Match" animation
    setTimeout(function time() {
        //$(".boxsection").find("div").off("click", clicker);
        newBox.addClass("nomatch").removeClass("opened");
        oldBox.addClass("nomatch").removeClass("opened");
    }, 400);
    
    // Reset boxes    
    setTimeout(function time2() {
        newBox.addClass("closed").removeClass("nomatch");
        oldBox.addClass("closed").removeClass("nomatch opened");
        hide(boxNum, clickedBoxVal);
        hide(oldBoxNum, oldClickedBoxVal);
        
        // Update which boxes are "Closed" in the array
        boxState.splice(clickedBoxPlc, 1, "Closed");
        boxState.splice(oldClickedBoxPlc, 1, "Closed");
        $(".boxsection").find("div").on("click",clicker);  
    }, 1300);
};

function win(){
    match();
    
    // Show lightbox for win state
    setTimeout(function time3() {
        $(".winbox").css("display", "block");
    
    // Add score level
    $("<h4 class=scorelevel>You reached "+ currentLevel + " level!</h4>").insertAfter($(".mclicks"));
    }, 1000);
    
    // Stop timer
    $(".mtimer").text("Total Time: " + Math.round((new Date - start) / 1000, 0) + " Seconds");

};


// Timer via https://stackoverflow.com/questions/2604450/how-to-create-a-jquery-clock-timer
setInterval(function timer() {
    $(".timer").text("Total Time: " + Math.round((new Date - start) / 1000, 0) + " Seconds");
}, 1000);


// *EVENTS* to call functions

// On Restart click
$(".restart").click(function () {
    location.reload();
});

// On Close Winbox click
$(".closewinbox").click(function () {
    $(".winbox").css("display", "none");
});

// On Box click

function clicker() {
    newBox = $(this);
    boxNum = parseInt($(this).attr("class"));

    
    // Highscore advice via https://stackoverflow.com/questions/29370017/adding-a-high-score-to-local-storage
    if(highScore !== null){
        if (clickCount > parseInt(localStorage.getItem("highScore"))) {
            localStorage.setItem("highScore", clickCount);
            $(".highScore").text("Fewest Clicks Ever: " + clickCount);
        }
    } else{
        localStorage.setItem("highScore", clickCount);
    }
    
    // Update score
    if (clickCount == trophyLevels[2]){
        $( ".p"+trophyNames[2]).remove();
        $( ".img"+trophyNames[2]).remove();
        //win();
        trophyWinLevel = trophyNames[1];
        currentLevel = trophyNames[1];
    } else if (clickCount == trophyLevels[1]){
        $( ".p"+trophyNames[1]).remove();
        $( ".img"+trophyNames[1]).remove();
        trophyWinLevel = trophyNames[0];
        currentLevel = trophyNames[0];
    }; 
    
    // 1. If box is currently Unclicked...
    if (boxState[boxNum] == "Closed") {         
        // 1a. And no other boxes have been clicked
        if ($.inArray("Opened", boxState) == -1) {              
            // Then trigger OPEN function
            open();
        // 1b. Or if this is 2nd box to be clicked...
        } else { 
            // 1b1. And the 2 clicked boxes match...
            if (boxVal[boxNum] == clickedBoxVal) { 
                // 1b1a. And also if all the boxes already match 
                if (matchedCount == boxesCount - 2){ 
                    // Then trigger WIN function
                    win(); 
                // 1b1b. Or not all boxes match
                } else { 
                    // Then trigger MATCH function
                    match(); 
                }
            // 1b2. Or the 2 boxes don"t match    
            } else { 
                // Then trigger NOMATCH function       
                open();
                noMatch(); 
            }
        }
    // 2. Or if this box is has already been clicked
    } else if (boxState[boxNum] == "Opened") { 
        // Then trigger CLOSE function
        close(); 
    // 3. Or if box is already matched
    } else if (boxState[boxNum]== "Matched") {
        // Then do nothing
    // 4. Or for all other possibilities
    } else { 
       // Then trigger error alert
       alert("Error - please restart the game."); 
    }
    
    $(".clicks").text("Total Clicks: " + clickCount);
    $(".mclicks").text("Total Clicks: " + clickCount);
};

$(".boxsection").find("div").on("click",clicker);
