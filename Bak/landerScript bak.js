const getAnimationSeeds = max => {
    let firstSeed = Math.floor(Math.random() * max);
    let secondSeed = Math.floor(Math.random() * max); 
    let thirdSeed = Math.floor(Math.random() * max);
    let holder = [];
    if (firstSeed !== secondSeed && firstSeed !== thirdSeed && secondSeed !== thirdSeed){ //rewrite if more than 3 seeds
        holder.push(firstSeed, secondSeed, thirdSeed);
        return holder;
    } else {
        // recurse if duplicates exist in array
        // might not be needed, could be fun that sometimes it's just 2 or 1 buttons jumping
        return getAnimationSeeds(max);
    }
}

$( document ).ready(function() {
    const buttons = document.getElementsByClassName("animBox");
    // buttons[3].play();
    // setInterval(() => {
    //     buttons[3].stop();
    //     buttons[3].play();
    // }, 5100);

    // triggerPlay() & triggerButtonAnimation() must be declared here because they reference the buttons HTML collection array
    const triggerPlay = (seed, delay) => {
        setTimeout(() => {
            buttons[seed].play();
        }, delay);
        
        setTimeout( () => {
            buttons[seed].stop();
        }, 5000+delay);
    }

    const triggerButtonAnimation = () => {

        let animationSeeds = getAnimationSeeds(buttons.length);
        animationSeeds.forEach(seed => {
            triggerPlay(seed, delay);
            delay+=500;
            console.log(delay);
        })
    }

    // call for a one-time play here to run immediately before interval countdown is reached
    
    /* --- Initializer ---
    Initialize animations here. Call for a one-time play immediately then let setInterval handle the rest.
    Delay here MUST follow math below 

    animation play time (5 seconds) PLUS delay amount TIMES numbers of animations to play at once () 

    Control variables below...
    */

    const animationPlayTime = 5000; 
    let delay = 500;
    let animationSeeds = 3;
    
    setInterval(triggerButtonAnimation, 6700); 
}); 