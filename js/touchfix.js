/*

FILE NAME: Project/js/touchfix.js

WRITTEN BY: Stian Sørli

WHEN: 20. Oktober 2015

PURPOSE: Make touch more native to the browser on isTouchDevices. We will also add a hover class on non-touch devices because the css does not contain ":hover", just ".hover", because og this.

UPDATE: Since the toTop-button is fixed to the bottom, and forms will justify the screen to place the touch-keyboard, we will make the button disappear completely with display: none; while any input-element is focused.

UPDATE: There were some issues with our dropdown technique on mobile (more spesific, Safari on iOS). We solved it by adding som script to the click-event and preventing the default action.

*/

if (isTouchDevice === 'undefined') { // Hvis isTouchDevice er udefinert
    var isTouchDevice = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

var re = /(\s+|^)hover(\s+|$)/g, // Deklarerer et regulært uttrykk som matcher om klassen ".hover" finnes i elementet
    mouseOver = 'mouseover',
    mouseOut = 	'mouseout',
    mouseDown = 'mousedown',
    mouseUp = 	'mouseup',
    mouseMove = 'mousemove';

if (isTouchDevice) {
    mouseOver = 'touchstart';
    mouseOut = 	'touchleave';
    mouseDown = 'touchstart';
    mouseUp = 	'touchend';
    mouseMove = 'touchmove';
}

function addHoverClass (elem) {
    //elem.classList.add('hover');
	var re = new RegExp('(?:^|\\s+)hover(?!\\S)', 'g');
	elem.className =  elem.className.replace(re, '') + ' hover ';
}

function removeHoverClass (elem) {
    //elem.classList.remove('hover');
	var re = new RegExp('(?:^|\\s+)hover(?!\\S)', 'g');
	elem.className =  elem.className.replace(re, '');
}

function addHoverToElement(elem) {
    // Legge til '.hover'
    elem.addEventListener(mouseOver, function () {
        addHoverClass(this);
    });
    
    // Fjerne '.hover'
    if (isTouchDevice) {
        elem.addEventListener(mouseUp, function () {
            removeHoverClass(this);
        });
    }
    elem.addEventListener(mouseOut, function () {
        removeHoverClass(this);
    });
}

// Vi søker gjennom DOM (Document Object Model) etter den har lastet inn
document.addEventListener('DOMContentLoaded', function () {
    
    // Får tak i alle elementer med ".addhover"-klassen
    var elements = document.getElementsByClassName('addhover');
    
    // Gå gjennom alle elementene med ".addhover"
    for (var i = 0; i < elements.length; i++) {
        addHoverToElement(elements[i]);
    }
    
    // Det er også et problem med en rekke touch-enheter og input-checkbox med label, vi fikser det her
    if (isTouchDevice) {
        var menus = document.querySelectorAll('#head input[type="checkbox"] + label');
        
        for (var i = 0; i < menus.length; i++) {
            menus[i].addEventListener('click', function (e) {
                e.preventDefault();
                
                if (getClass(this, 'open')) {
                    removeClass(this, 'open');
                } else {
                    addClass(this, 'open');
                }
            });
        }
    }
    
    // Totop knapp er i veien når man skriver på små skjermer generelt. Vi Fjerner den
    // derfor når input-elementene er satt i fokus.
    var inputs = document.querySelectorAll('input, textarea, select');
    
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('focus', function () {
            document.getElementById('totop').style.display = 'none';
        });
        inputs[i].addEventListener('blur', function () {
            document.getElementById('totop').style.display = 'block';
        });
    }
});