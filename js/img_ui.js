/*

FILE NAME: Project/js/img_ui.js

WRITTEN BY: Niklas Molnes Hole

WHEN: 16. Oktober 2015

PURPOSE: When pictures assigned with this feature is cliked, a pop-up window of the same picture in scaled-up version will be shown. The scaled-up version also contains the title-text on the top and will resize to fit inside the window, whether it is a mobile-device or a desktop.

*/

var elements, i, title, title, img, images = [], frame, d, x, y, w, e, g,
    w = window,
    d = document;

function pressedImg(elem) {
	var re = new RegExp('(\s*([^\w]|^)on([^\w]|$)\s*)', 'g');
	t = !re.test(elem.className);
	
	if (t) {
		for (i = 0; i < elements.length; i++) {
			removeClass(elements[i], 'on');
		}
		
		addClass(elem, 'on');
		
		title.innerHTML = elem.title;
		img.src = elem.src;
		img.alt = elem.alt;
		img.style.width = elem.style.width;
		img.style.height = elem.style.height;
		frame.className = 'frame';
		
		resizeImg(img);
		
		// Mobile fix
		var interval = setInterval(function () {
			resizeImg(img);
			clearInterval(interval);
		}, 20);
	} else {
		removeClass(elem, 'on');
	}
}

function resizeImg(elem) {
	if (elem.clientHeight > 0) {
		x = w.innerWidth || e.clientWidth || g.clientWidth;
		y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        y -= 64;
		var ratioFrame = (x > 0 ? y/x : 1);
		
		var wImg = elem.clientWidth;
		var hImg = elem.clientHeight;
		var ratioImg = (wImg > 0 ? hImg/wImg : 1);
		var scale = .9;
		
		if (ratioFrame > ratioImg) {
			elem.style.width = (scale*x) + 'px';
			elem.style.height = (scale*x*ratioImg) + 'px';
            title.style.paddingTop = ((y-64) - (scale*x*ratioImg))/2 + 'px';
		} else {
			elem.style.width = (scale*y/ratioImg) + 'px';
			elem.style.height = (scale*y) + 'px';
            title.style.paddingTop = 0;
		}
	}
}

function addResizeToImg(elem) {
    images.push(elem);
    
    if (elem.title != '') {
        fig = d.createElement('figcaption');
        fig.innerHTML = elem.title;
        elem.parentNode.insertBefore(fig, elem.nextSibling);
    }
    
    elem.addEventListener('click', function (e) {
        pressedImg(this);
    });
}

document.addEventListener('DOMContentLoaded', function () {
	e = d.documentElement;
	g = d.getElementsByTagName('body')[0];
	x = w.innerWidth || e.clientWidth || g.clientWidth;
	y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	
	elements = d.getElementsByClassName('showoff');
	
	id = d.getElementsByTagName('body')[0];
	
	if (id !== null) {
		frame = d.createElement('div');
		frame.className = 'frame hidden';
		id.appendChild(frame);
		
		title = d.createElement('h1');
		title.className = 'frame';
		frame.appendChild(title);
		
		img = d.createElement('img');
		img.className = 'frame';
		img.src = '/'+(window.location.hostname === 'localhost'? 'prosjekt' : ( window.location.hostname === 'org.ntnu.no' ? 'dreamteam2015' : 'niklasmh/Documents/Project'))+'/images/medlemmer.jpg';
		img.alt = 'Ingen bilde';
		frame.appendChild(img);
        
        for (i = 0; i < elements.length; i++) {
            addResizeToImg(elements[i]);
        }
        
        frame.addEventListener('click', function (e) {
            frame.className = 'frame hidden';
            
            for (i = 0; i < images.length; i++) {
                removeClass(images[i], 'on');
            }
        });
		
		window.addEventListener('resize', function (e) {
			resizeImg(img);
		});
	}
});