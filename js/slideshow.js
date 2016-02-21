/*

FILE NAME: Project/js/slideshow.js

WRITTEN BY: Ellen Bakksjø

WHEN: 13. November 2015

PURPOSE: We want to merge alle the data from each page into slides. Here we will parse everything async and use a timer to fetch random data.

*/

var d = document, xmlDoc, slides = [], xmlDocs = [], animTime = 3000;

d.addEventListener('DOMContentLoaded', function (e) {
    slides = d.getElementsByClassName('slideshow');
    
    if (typeof lastInnXML === 'function') {
        for (var i = 0; i < slides.length; i++) {
            lastInnXML('data/' + slides[i].getAttribute('data-src'), respons, i);
        }
    }
});

function respons(xml, id) {
    
    if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDocs[id] = parser.parseFromString(xml.responseText, "text/xml");
    } else {
        xmlDocs[id] = xml.responseXML;
    }
    
    if (typeof slides[id] !== 'undefined') {
        var slide = slides[id],
            slideDatas = xmlDocs[id].getElementsByTagName(slide.getAttribute('data-tag')),
            randomSlideLst = randomize(slideDatas.length), i = 0,
            slideData = slideDatas[randomSlideLst[i]],
            slidePic1 = d.createElement('div'),
            slidePic2 = d.createElement('div'),
            slideTextCon1 = d.createElement('div'),
            slideTextCon2 = d.createElement('div'),
            slideText1 = d.createElement('h3'),
            slideText2 = d.createElement('h3'),
            slideOverlay = d.createElement('a');
        
        slideOverlay.className = 'overlay';
        slideOverlay.href = (slide.getAttribute('data-tag') === 'article' ? 'articles/archive.php?a=' : 'discover/artist.php?g=') + slideData.getAttribute('id');
        
        var pic1Src = slideData.getElementsByTagName('picture')[0].getAttribute('src');
        slidePic1.style.backgroundImage = 'url(' + pic1Src + ')';
        slidePic1.className = 'slide-img';
        
        var txt1 = slide.getAttribute('data-title').split(':');
        
        if (txt1[0] === 'tag') {
            txt1 = slideData.getElementsByTagName(txt1[1])[0].textContent;
        } else {
            txt1 = slideData.getAttribute(txt1[1]);
        }
        
        slideText1.innerHTML = txt1;
        slideTextCon1.className = 'slide-txt';
        
        slideData = slideDatas[randomSlideLst[i + 1 % randomSlideLst.length]]; // Legger til en og får arrayen på rundgang om den passerer maks
        
        var pic2Src = slideData.getElementsByTagName('picture')[0].getAttribute('src');
        slidePic2.style.backgroundImage = 'url(' + pic2Src + ')';
        slidePic2.className = 'slide-img';
        
        var txt2 = slide.getAttribute('data-title').split(':');
        
        if (txt2[0] === 'tag') {
            txt2 = slideData.getElementsByTagName(txt2[1])[0].textContent;
        } else {
            txt2 = slideData.getAttribute(txt2[1]);
        }
        
        slideText2.innerHTML = txt2;
        slideTextCon2.className = 'slide-txt';
        
        slide.appendChild(slidePic1);
        slide.appendChild(slidePic2);
        slideTextCon1.appendChild(slideText1);
        slideTextCon2.appendChild(slideText2);
        slide.appendChild(slideTextCon1);
        slide.appendChild(slideTextCon2);
        slide.appendChild(slideOverlay);
        
        setInterval(function () {
            
            if (!toggleClass(slide, 'switch')) { // Både toggler klassen og fåt tak i om den er toggla
                
                setTimeout(function () {
                    slideOverlay.href = (slide.getAttribute('data-tag') === 'article' ? 'articles/archive.php?a=' : 'discover/artist.php?g=') + slideData.getAttribute('id');
                }, 1000);
            } else {
                
                i++;
                slideData = slideDatas[randomSlideLst[i % randomSlideLst.length]];
                
                var pic1Src = slideData.getElementsByTagName('picture')[0].getAttribute('src');
                slidePic1.style.backgroundImage = 'url(' + pic1Src + ')';

                var txt1 = slide.getAttribute('data-title').split(':');

                if (txt1[0] === 'tag') {
                    txt1 = slideData.getElementsByTagName(txt1[1])[0].textContent;
                } else {
                    txt1 = slideData.getAttribute(txt1[1]);
                }

                slideText1.innerHTML = txt1;
                
                slideData = slideDatas[randomSlideLst[(i + 1) % randomSlideLst.length]]; // Legger til en og får arrayen på rundgang om den passerer maks

                var pic2Src = slideData.getElementsByTagName('picture')[0].getAttribute('src');
                slidePic2.style.backgroundImage = 'url(' + pic2Src + ')';

                var txt2 = slide.getAttribute('data-title').split(':');

                if (txt2[0] === 'tag') {
                    txt2 = slideData.getElementsByTagName(txt2[1])[0].textContent;
                } else {
                    txt2 = slideData.getAttribute(txt2[1]);
                }

                slideText2.innerHTML = txt2;
            }
        }, animTime);
    }
}


// Vi trenger en funksjon som kan lage en liste med tall i tilfeldig rekkefølge
function randomize(count) {
    
    if (!isNaN(count)) {
        var arr = [], save, r, index = count;
        
        // Lager en rekke [0, 1, 2, 3, ... , count-1]
        for (var c = 0; c < count; c++) {
            arr.push(c);
        }
        
        while (index !== 0) {
            r = Math.floor(Math.random()*index);
            index -= 1;
            save = arr[index];
            arr[index] = arr[r];
            arr[r] = save;
        }
        
        return arr;
    }
    
    return [];
}