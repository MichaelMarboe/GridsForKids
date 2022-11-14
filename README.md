# GridsForKids

GridsForKids is an animated and automated grid design that creates a living and fun landing page for an online kids website. Each grid element links to another subpage with content in the category. 

**Stack**
HTML, CSS, JS, jQuery, After Effects, Lottie Player.

**Animation**
Animations were developed in After Effects based on edited stock vector graphics, formatted for the web using the Lottie Player plug-in for After Effects. Because they are vector-based, the animations can scale infinitely without any quality loss or pixelation. They run smoothly on any modern device (albeit my testing options were severely limited). 

In the demo, all animations are of identical length and use only 3 size formats, 300x300, 300x600 or 600x300. Content-wise, they all end the exact same way as they start and so can be looped infinitely without any jittering or apparent frame jumps.

**Technical description:**
GridsForKids is basically a simple CSS grid with a media file in each grid slot. The grid slots vary in sizes and the grid is hard-coded in CSS to achieve the most visually pleasing layout. Each animation is totally pre-baked and can be initiated at any time without any loading requirements after full page load is complete.

JS/jQuery is utilised to control the animations. It's fully automated, and the script handles animation cycles like so:

1. animation cycle is initiated 
2. animation cycle is set to last X amount of seconds
3. X amount of animations are randomly selected to play in the cycle
4. each animation is triggered to play with X amount of brief delay between each
5. animations play and complete one loop
6. animations are reset (invisibly) so they can be re-triggered later
7. cycle ends
8. new cycle begins

**Code**


**animationControl.js**
