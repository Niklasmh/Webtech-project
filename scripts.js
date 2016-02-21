/*

FILE NAME: Project/scripts.js

WRITTEN BY: Niklas Molnes Hole

WHEN: 20. Oktober 2015

PURPOSE: Declare basic variables and functions until later.

Låner kode ifra GitHub (Link: https://gist.github.com/waynegraham/5766565) fordi vi trenger et bedre utviklingsmiljø for mobile enheter uten et bra utviklingsmiljø.

*/


// Denne funksjonen sjekker om vi har støtt på IE, fordi den støtter ikke våres XML-håndtering
function isTheBrowserNotCool() {
    return /Trident/.test(navigator.userAgent);
}

var isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    notCoolBrowser = isTheBrowserNotCool(),
    isCookiesAllowed = /(;|^)\s*userWantCookies\s*=\s*true\s*(;|$)/i.test(document.cookie),
    acceptWindow;

function addClass(elem, classname) {
	//var re = new RegExp('(\s*([^\w]|^)'+classname+'([^\w]|$)\s*)', 'g');
    //elem.classList.add(classname);
	var re = new RegExp('(?:^|\\s+)'+classname+'(?!\\S)', 'g');
	elem.className =  elem.className.replace(re, '') + ' '+classname+' ';
}

function removeClass(elem, classname) {
	//var re = new RegExp('(\s*([^\w]|^)'+classname+'([^\w]|$)\s*)', 'g');
	//elem.classList.remove(classname);
	var re = new RegExp('(?:^|\\s+)'+classname+'(?!\\S)', 'g');
	elem.className =  elem.className.replace(re, '');
}

function getClass(elem, classname) {
    var re = new RegExp('(?:^|\\s+)'+classname+'(?!\\S)', 'g');
    return re.test(elem.className);
}

function toggleClass (elem, classname) {
    if (getClass(elem, classname)) {
        removeClass(elem, classname);
        return false;
    } else {
        addClass(elem, classname);
        return true;
    }
}

window.addEventListener('load', function () {
    var d = document;
    
    // Vi lager et pop-up-vindu om ingen cookies har blitt godtatt enda.
    if (!isCookiesAllowed) {
        acceptWindow = d.createElement('div');
        acceptWindow.className = 'accept-window';
        
        var centerBox = d.createElement('div');
        centerBox.className = 'box-centered';
        
        var title = d.createElement('h2');
        title.className = 'cookie-title';
        title.innerHTML = 'Cookies';
        
        var txt = d.createElement('p');
        txt.className = 'cookie-text';
        txt.innerHTML = 'Godtar du at vi lagrer informasjon med cookies (informasjonskapsler) ?';
        
        var acceptCookie = d.createElement('button');
        acceptCookie.className = 'accept-btn';
        acceptCookie.innerHTML = 'Godta';
        acceptCookie.onclick = function () {
            setCookie('userWantCookies', 'true');
            
            if (typeof acceptWindow !== 'undefined') {
                d.getElementsByTagName('body')[0].removeChild(acceptWindow);
            }
        };
        
        if (typeof addHoverToElement === 'function') {
            addHoverToElement(acceptCookie);
        }
        
        centerBox.appendChild(title);
        centerBox.appendChild(txt);
        centerBox.appendChild(acceptCookie);
        acceptWindow.appendChild(centerBox);
        d.getElementsByTagName('body')[0].appendChild(acceptWindow);
        
    }
	
	// Vi må lage en smooth scroll på navigasjonsknapper
	var btnScrolls = d.getElementsByClassName('smooth-scroll');
	
    for (var i = 0; i < btnScrolls.length; i++) {
        btnScrolls[i].addEventListener('click', function (evt) {
            evt.preventDefault();
            
            scrollTo(0, undefined, easeWithTan);
        });
    }
    
    // Vi må skjule totop-knappen hvis det ikke er noe mer å scrolle
    window.addEventListener('scroll', function () {
        var pos = document.getElementsByTagName('body')[0].scrollTop,
            toTop = document.getElementById('totop');
        
        if (pos > 100) {
            addClass(toTop, 'visible');
        } else {
            removeClass(toTop, 'visible');
        }
    });
	
	var sitemapElements = document.querySelectorAll('.sitemap-elem h4');
	
	for (var i = 0; i < sitemapElements.length; i++) {
		sitemapElements[i].addEventListener('click', function () {
			toggleClass(this, 'hidden');
		});
	}
}, false);

function scrollTo(to, from, func) {
    from = (typeof from === 'object' ? from.offsetTop : (typeof from !== 'undefined' ? from : document.getElementsByTagName('body')[0].scrollTop ));
    to = (typeof to === 'object' ? to.offsetTop : (typeof to !== 'undefined' ? to : 0 ));
    func = (typeof func !== 'undefined' ? func : function (x) { return x; } );
    var scrollBoard = document.getElementsByTagName('body')[0],
        scrollStartPos = from,
        scrollEndPos = to,
        diff = scrollStartPos - scrollEndPos,
        time = 1000, process = 0;

    var interval = setInterval(function () {
        process += 10/time;
        scrollBoard.scrollTop = scrollStartPos - diff*func(process, 8);

        if (process > 1) {
            clearInterval(interval);
            scrollBoard.scrollTop = scrollEndPos;
        }
    }, 1);
}

// Med følgende funksjoner kan vi hente ut cookies og lagre små data for å gjøre
// brukeropplevelsen hakket bedre.
function getCookie(cookie) {
    
    // Vi grupperer cookie-verdien med parantes i en regex og passer på mellomrom med \s*
    // Cookies er også nå case sensitive fordi vi ikke inkluderer flagget i (i for in-case sensetive). Når uttrykket finner en match går den ut fordi vi ikke inkluderer flagget g (g for global, finner alle, men vi trenger bare den første).
    var reResult = new RegExp('(?:;|^) ?' + cookie + ' *= *([^;]+) *(?:;|$)').exec(document.cookie);
    return (reResult && reResult.length > 1 ? reResult[1] : false);
}

function setCookie(cookie, val, days) {
    days = (typeof days === 'undefined' ? 10*365 : days); // Default er 10 år
    var d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = cookie + '=' + val + ';expires=' + d.toUTCString() + ';path=/';
}

function deleteCookie(cookie) {
    document.cookie = cookie + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
}

// Formatere datetime fra XML-dokumenter til vårt eget dd/mm/yyyy (hour:min)
function XMLDatetimeFormat (XMLDatetime) {
    if (typeof XMLDatetime === 'string') {
        var d = new Date(XMLDatetime.replace(/-/g, '/').replace(/T/g, ' ').replace(/Z/g, ''));

        return d.getUTCDate() + '/'
            + (d.getUTCMonth()+1) + '/'
            + d.getFullYear() + ' ('
            + d.getUTCHours() + ':'
            + d.getUTCMinutes() + ')';
    }
    
    return '';
}

// Her har vi en generell funksjon for å hente ut XML-data og kalle på en responsfunksjon som behandler dataene. Dette er også kalt en avsynkronisert prosess siden responen kan komme forsinket eller aldri - vi satser på alltid.
function lastInnXML(fil, reponsFunc, id) {
    
    if (window.XMLHttpRequest) {
        var xmlhttp = new XMLHttpRequest();
    } else {
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    if (typeof id !== 'undefined' && !isNaN(id)) {
        var aid = id;
        
        xmlhttp.onreadystatechange = function() {
            
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                reponsFunc(xmlhttp, aid);
            }
        }
    } else {
        xmlhttp.onreadystatechange = function() {
            
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                reponsFunc(xmlhttp);
            }
        }
    }
	
    xmlhttp.open('GET', fil, true);
    xmlhttp.send();
}

// Vi lager en funksjonsom returnerer noen easing-funksjoner. Vi har en x og skal ha y.
// Funksjonene er laget med hjelp av GeoGebra
function easeInOut (tid) {
    if (tid < .5) {
        return .5 - Math.pow(1 - 2*tid, 1/3)*.5;
    }
    return Math.pow(2*tid - 1, 1/3)*.5 + .5;
};
function easeWithTan (tid, smoothness) {
    smoothness = (typeof smoothness !== 'undefined' && smoothness > 0 ? smoothness : 2);
    return (Math.atan(smoothness*(tid - 1 / 2)) + Math.atan(smoothness*.5)) / (2*Math.atan(smoothness*.5));
};

//Funksjon for å vise og skjule deler av sitemappen
