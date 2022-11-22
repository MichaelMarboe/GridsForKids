/* --- GLOBAL CONTROLS ---

buttons: Holder variable for every buttons (later an array, can't be defined before page has loaded)
animationPlayTime: How long the animation takes to complete its' loop (hard-coded to 5 seconds - DO NOT ALTER)
animationSeeds: Amount of animations to run at once (per animation cycle)
masterDelay: Delay between each animation seed (for example, play 3 at once with a 500ms delay between each to create cascading animation feel)
masterInterval: Interval between animation cascades (ie. 5 seconds + the delay times amount of animations).  

*/

let buttons;
const animationPlayTime = 5000; 
let masterDelay = 500; 
let animationSeeds = 4; 
const masterInterval = animationPlayTime + masterDelay * animationSeeds; 

/* --- DEV MODE --- 

Only used for testing. Can enable but not disable (just reload page to disable). 

*/

let intervalPlayId;
let devModeEnabled = false;
let devButton = document.getElementById("devModeButton");

// Call me from browser console
const toggleDevMode = () => {
    if (devModeEnabled == false){
        document.getElementById("devTools").style.display = "block";
        devModeEnabled = true;
        return("DevMode enabled");
    } else {
        document.getElementById("devTools").style.display = "none";
        devModeEnabled = false;
        return("DevMode disabled");
    } 
}

// Stops all animations and enables playOnClick function to be possible on each animation
const stopAnimation = () => {
    for (let i = 0; i < buttons.length; i++){
        buttons[i].stop();
        clearInterval(intervalPlayId);
        buttons[i].setAttribute("onclick", "playOnClick(event)");
    }
}

const pauseAnimation = () => {
    for (let i = 0; i < buttons.length; i++){
        buttons[i].pause();
        clearInterval(intervalPlayId);
    }
}

const playOnClick = event => {
    event.target.stop();
    event.target.play();
}

/* --- HELPER FUNCTIONS ---
    getRandomNumber: Returns one random number that can't be the same as the numbers in forbiddenNumbers array (second argument). Recurses if duplicate found.
    triggerPlay: Triggers play and resets animation ( .stop() ) once full animationPlayTime has been reached.
*/

const getRandomNumber = (max, forbiddenNumbers) => {
    let randomNumber = Math.floor(Math.random()*max);
    if (forbiddenNumbers.includes(randomNumber) !== false) {
        return getRandomNumber(max, forbiddenNumbers);
    } else {
        return randomNumber;
    } 
}

const triggerPlay = (seed, delay) => {
    setTimeout(() => {
        buttons[seed].play();   
    }, delay);

    setTimeout( () => {
        buttons[seed].stop();
    }, animationPlayTime+delay);    
}

let gapEnabled = false;
const gapToggler = () => {
    if (!gapEnabled) {
        document.getElementById("container").style.gap = "4px";
        gapEnabled = true;
    } else {
        document.getElementById("container").style.gap = "0px";
        gapEnabled = false;
    }
}

// helper function > return array of all grid elements as ids for later ease of reference
const getItemsAsIds = () => {
    let holder = [];
    let iterator = 1;
    let targetElement = document.getElementById("item" + iterator);
    while(targetElement !== null) {
        holder.push(targetElement);
        iterator += 1;
        targetElement = document.getElementById("item" + iterator);
    }
    return holder;
}
 
/* --- LAUNCH ---

1. Pauses animation (just because it looks sweet) and fades every grid element out except the one the user clicked (variable fadeException is passed in by the grid elements onclick). 
2. Then, redirects user to another page with a delay of 1 second so fading can complete before redirect occurs.

*/

const launch = fadeException => {  
    pauseAnimation();
    if (devModeEnabled == false) {
        fadeException = document.getElementById(fadeException);
        items = getItemsAsIds();
        items.forEach(element => {
            if (element != fadeException) {
                $(element).animate({ opacity: 0 })
            }
        })
        setTimeout(() => {
            //Set link dynemically somehow here...
            window.location.href = "empty.html";
        }, 1000)
    }
}

$( document ).ready(function() {
    buttons = document.getElementsByClassName("animBox");
    const maxAnimationSeeds = buttons.length - 1; 
    
    /* --- RUNTIME FUNCTIONS ---

    getRandomSeeds: Generates an array of random numbers without duplicates (ie. previousNumbers).
    triggerButtonAnimation: Calls getRandomSeeds() and triggers .play() on given seeds (amount of seeds defined globally - see variable animationSeeds).

    Both functions need to be defined post-load beecause they refer to maxAnimationSeeds (which in turn needs to refer the initialized buttons collection).

    */

    const getRandomSeeds = max => {
        let holder = [];
        let previousNumbers = []; 
        for (let i = 0; i < max; i++) {
            let randomNumber = getRandomNumber(maxAnimationSeeds, previousNumbers);
            holder.push(randomNumber);
            previousNumbers.push(randomNumber);
        }
        return holder;
    }
    
    const triggerButtonAnimation = () => {
        let delay = masterDelay; // pull from global control variable and iterate upon
        let seeds = getRandomSeeds(animationSeeds);
        seeds.forEach(seed => {
            triggerPlay(seed, delay);
            delay+=masterDelay;
        })
    }

    /* --- INITIALIZE:
    
    Call for a one-time play here to run immediately before interval countdown is reached. Or don't? Might feel smoother on initial load.   
    intervalPlayId is stored (setInterval returns an ID but it also launches in the code below). Required for devMode to stop animations.

    --- */

    triggerButtonAnimation();
    intervalPlayId = setInterval(triggerButtonAnimation, masterInterval); 
});