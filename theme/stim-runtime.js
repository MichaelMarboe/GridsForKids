
/* --- SIDEMENU --- */

// Get sidemenu for later edits
const sideMenu = document.getElementById("section-tabs");

// Create home button and set attributes
const icon = document.createElement("img");
icon.id = "homeButton";
icon.src = "https://danes-online.dk/Sprogstimulering/assets/forsideIkon.png";
icon.setAttribute("onclick", "navigateTo('https://danes.instructure.com/courses/881')");

/* --- NAVIGATION FOOTER --- */

// -- Pull navigation space below main page content
const navSpace = document.getElementById("module_navigation_target");

// -- Create next/previous buttons & set attributes 
const nextButton = document.createElement("img");
nextButton.id = "nextButton";
nextButton.src = "https://danes-online.dk/Sprogstimulering/assets/nextButton.png";
$("#nextButton").css("float", "right");
nextButton.setAttribute("onclick", "");
nextButton.setAttribute("class", "homemadeButtons");

const prevButton = document.createElement("img");
prevButton.id = "prevButton";
prevButton.src = "https://danes-online.dk/Sprogstimulering/assets/prevButton.png";
$("#prevButton").css("float", "left");
prevButton.setAttribute("onclick", "");
prevButton.setAttribute("class", "homemadeButtons");

/* --- DETERMINE USER ROLE --- */
// ENV.current_user_roles: Contains an array with string items that describe a user's role(s). 
// If "teacher" is not found in the array, several objects are not shown in the DOM. 

let admin = (ENV.current_user_roles.includes("teacher") ? true : false);

/* --- HREF Jumper --- */

const navigateTo = href => {
    window.location = href;
}

// -- NEXT/PREVIOUS BUTTONS HELPER FUNCTIONS -- 

// API: Get current module id (needed to pull module_items list)
const getModuleIds = () => {
    const request = new XMLHttpRequest();
    request.open("GET", "https://danes.instructure.com/api/v1/courses/881/modules/", false); // Needs to load synchronously or it won't work - so last parameter = false
    request.send();
    return JSON.parse(request.responseText);
}

// API: Request moduleItems and return parsed JSON data as JS object --
const getModuleItems = url => {
    const request = new XMLHttpRequest();
    request.open("GET", url, false); // Needs to load synchronously or it won't work - so last parameter = false
    request.send();
    return JSON.parse(request.responseText);
}

// Determine current module item based on last 5 digits of HREF
const getModuleItemId = () => {
    let currentUrl = window.location.href;
    return currentUrl.slice(-5);
}

// Categories: Hard-coded list of all module ids. More can be added manually. Only way to pull them (or definetely the ligthest).
const categories = [{navn:"dyr", id:5795}, {navn:"biler", id: 5798}, {navn:"kroppen", id:5799}]; 
const determineModuleId = () => {
    for (let i = 0; i < categories.length; i++){ 
        if (document.getElementById(categories[i].navn) != null){
            return categories[i].id;
        }
    }
}

/* ADD AND REMOVE SOME ITEMS DEPENDING ON USER ROLE POST-LOAD */
$(".header-bar-outer-container").css("display", "none");

$( document ).ready(function() {
    // Remove side menu and replace with home button icon
    if (!admin) {
        if (window.location.href.includes("course")){
            let home = sideMenu.firstElementChild;
            sideMenu.removeChild(home);
            sideMenu.prepend(icon);
        }
        $("#sticky-container").css("display", "block");
        $("#right-side-wrapper").css("display", "none");
        $(".header-bar-outer-container").ccs("display", "block");
        // $(".page-title").css("display", "none"); tilføj igen til sidst
    }

    // Re-display modified/removed elements if user is admin
    if (admin) {
        $("#sticky-container").css("display", "block");
        $(".ic-app-nav-toggle-and-crumbs").css("display", "flex");
    }   
});

/* ---

-- PULL MODULE ID AND DISPLAY NAV BUTTONS -- 

1. Run determineModuleId() - must be run from window.bind funtion or results are inconsistent because of Canvas load order
2. Use returned moduleId to pull correct list of module items
3. Use module items.length to determine if Next/Previous should be added or not

--- */

let displayNextButton = true;
let displayPreviousButton = true;

$(window).bind("load", function() {
    if (window.location.href.includes("module_item")) { //entire script should only run if user is viewing a module item
        let moduleItems = getModuleItems(`https://danes.instructure.com/api/v1/courses/881/modules/${determineModuleId()}/items/`);
        let currentModuleItem = getModuleItemId();
        let nextModuleItemHref;
        let previousModuleItemHref;
    
        for (let i = 0; i < moduleItems.length; i++) {
            if (moduleItems[i].id.toString() === currentModuleItem) { //.id isn't a string so needs to parse
                
                // Determine next item URL & add to next button link
                if (moduleItems[i].position < moduleItems.length){
                    nextModuleItemHref = moduleItems[i+1].html_url;
                    nextButton.setAttribute("onclick", `navigateTo("${nextModuleItemHref.toString()}")`); //verbose, but it works 
                } else { 
                    displayNextButton = false;
                }
                
                // Determine previous item URL & add to previous button link
                if (moduleItems[i].position > 1){
                    previousModuleItemHref = moduleItems[i-1].html_url;
                    prevButton.setAttribute("onclick", `navigateTo("${previousModuleItemHref.toString()}")`);
                } else {
                    displayPreviousButton = false;
                }
            }
        }
    }

    // Append buttons if previous function checks out AND if a user is currently viewing a module_item (to avoid syntax error)
    if (displayNextButton === true && window.location.href.includes("module_item")) {
        navSpace.append(nextButton);
    }
    if (displayPreviousButton === true && window.location.href.includes("module_item")) {
        navSpace.append(prevButton);
    }
});