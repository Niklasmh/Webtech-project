/*

FILE NAME: Project/js/calendar_generator.js

WRITTEN BY: Ellen Bakksjø

WHEN: 10. November 2015

PURPOSE: Generate and update the calendar table. Also popup when a date element is selected.

We do also use a getWeek function which is copied from http://stackoverflow.com/a/7765814/3938741
This is because it is hard to find a weeknumber with JS and we want it to be secure and fast.

UPDATE: Events are added and load async from a XML-doc with events.
Mazemap is also implementet to show the user the location of the event.
It is now possible to share events with hastag #month,year,date after URL. The page then loads the data within the event.
The page do also work on IE now.

*/

// Vi definerer og setter en rekke dato-variabler med date-objektet i JavaScript
var dager = ['man','tirs','ons','tors','fre','lør','søn'],
    mnds= ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'],
    d = document,
    isCalCreated = false,
    currentDate = new Date(),
    date,
    mnd,
    year,
    mndDays,
    mndLength,
	startweek,
    daySelected,
    xmlDoc;

// Dette er kode vi har lånt ifra stackoverflow (ref. øverst på fila). Denne gjør at vi kan få ukenummer ved å skrive new Date().getWeek();
Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(), 0, 1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

d.addEventListener('DOMContentLoaded', function(e) {
    var cal = d.getElementById('calendar'),
        btnLeft = d.getElementById('left-btn'),
        btnRight = d.getElementById('right-btn'),
        btnBottomLeft = d.getElementById('left-bottom-btn'),
        btnBottomRight = d.getElementById('right-bottom-btn'),
        title = d.getElementById('month-year'),
		hash = window.location.hash;
    
    // Herifra skal vi hente ut data fra calendar.xml med datoer. Vi sender de så til respons-funksjonen når den er hentet
    lastInnXML('data/calendar.xml', respons);
	
	// Med denne er det mulig å skrive #11,2015 eller #2015 eller #11 eller #11,15 bak url-en, og det vil resultere til å bli det samme (hvis året er 2015 i disse eksemplene). Alle kan nå dele url-en med hashtag og en mnd og/eller år slik at andre kan se på måndes-planen til Nabostøy.
    if (hash && hash.length > 1) {
        var data = hash.split('#')[1].split(',');
        
        if (data.length > 0) {
            if (!isNaN(data[0]) && data[0] > 12) {
				year = parseInt(data[0]);
            } else if (!isNaN(data[0])) {
				mnd = parseInt(data[0]) - 1;
				
				if (data.length > 1) {
					if (!isNaN(data[1]) && data[1].length > 2) {
						year = parseInt(data[1]);
					} else {
						year = parseInt('20' + data[1]);
                    }
                    
                    if (data.length > 2) {
                        if (!isNaN(data[2])) {
                            daySelected = Math.max(Math.min(parseInt(data[2]), 31), 1); // Nå blir datoen mellom 1 og 31 fra bruker
                        }
                    }
				}
			}
        }
        
		if (typeof year !== 'undefined' && !isNaN(year) && typeof mnd !== 'undefined' && !isNaN(mnd)) {
			update(mnd, year);
		} else if (typeof mnd !== 'undefined' && !isNaN(mnd)) {
			update(mnd);
		} else if (typeof year !== 'undefined' && !isNaN(year)) {
			update(undefined, year);
		} else {
			update();
		}
    } else {
    	update();
	}
    
    btnLeft.addEventListener('click', function(evt) { moveMonth(-1); });
    btnRight.addEventListener('click', function(evt) { moveMonth(); });
    btnBottomLeft.addEventListener('click', function(evt) { moveMonth(-1); });
    btnBottomRight.addEventListener('click', function(evt) { moveMonth(); });
	
	function moveMonth (steps) {
		steps = (typeof steps !== 'undefined' && !isNaN(steps) ? steps : 1);
        mnd += steps;
		
        if (mnd < 0) {
            mnd = 11;
            year--;
        } else if (mnd > 11) {
            mnd = 0;
            year++;
        }
        
        daySelected = null;
		
		window.location.href = '#' + (mnd + 1) + ',' + year;
		
        update(mnd, year);
        updateEvents();
	}
    
    
    
    // Genererer en tabell med datoer til valgt måned og år
    function update(m, y) {
        
        // Dette gjør variablene valgfrie med en default verdi. Vil også bli default om verdien er ugyldig
        m = (typeof m !== 'undefined' && !isNaN(m) && (m < 12 && m >= 0) ? m : currentDate.getMonth());
        y = (typeof y !== 'undefined' && !isNaN(y) ? y : currentDate.getYear() + 1900);
        
        // Oppdaterer informasjonen til tabellen
        date = new Date(y, m);
        mnd = date.getMonth();
        year = (date.getYear() + 1900);
        mndDays = new Date(year, mnd, 1);
        mndLength = new Date(year, ((mnd + 1) % 12), 0);
		startweek = new Date(year, mnd, 0).getWeek();
        
        // Endrer tittelen
        title.innerHTML = mnds[mnd] + ' ' + year;
        
        if (!isCalCreated) {
            var tr = d.createElement('tr');
        }
        
        for (var i = 0; i <= 6; i++) {
			
            if (!isCalCreated) {
                var td = d.createElement('th');
                td.innerHTML = dager[i];
                tr.appendChild(td);
            }
        }
        
        if (!isCalCreated) {
            cal.appendChild(tr);
        }
        
        var day = 0,
            count = 1;
        
        for (var i = 0; i < 6; i++) {
			
            if (isCalCreated) {
                tr = cal.getElementsByTagName('tr')[i+1];
            } else {
                tr = d.createElement('tr');
            }
			
			if (day < mndLength.getDate()) {
				
				if (mnd === 0) {
					tr.setAttribute('data-week', i+(startweek+i > 53 ? 1 : (day === 0 && i === 0 ? 1 : startweek)));
				} else {
					tr.setAttribute('data-week', i+startweek);
				}
			} else {
				tr.removeAttribute('data-week');
			}
            
            for (var j = 0; j <= 6; j++, count++) {
				
                if (isCalCreated) {
                    var td = tr.childNodes[j];
                } else {
                    var td = d.createElement('td'),
                        ev = d.createElement('div'),
                        da = d.createElement('div'),
                        ti = d.createElement('div');
                    td.appendChild(ev);
                    td.appendChild(da);
                    td.appendChild(ti);
                }
                
                td.onclick = undefined;
                removeClass(td, 'event');
                
                if ((mndDays.getDay() > 0 ? mndDays.getDay() : 7) <= count && day < mndLength.getDate()) {
                    day++;
                    td.children[0].innerHTML = '';
                    td.children[1].innerHTML = day;
                    td.children[2].innerHTML = '';
                    td.className = 'addhover date ' + dager[j];
                    td.id = 'dag-' + day;
					
                    if (mnd === currentDate.getMonth() && year === currentDate.getYear()+1900 && day === currentDate.getDate()) {
                        td.className += ' today';
                    }
                } else {
                    td.children[0].innerHTML = '';
                    td.children[1].innerHTML = '';
                    td.children[2].innerHTML = '';
                    td.className = '';
                }
                
                if (!isCalCreated) {
                    addHoverToElement(td);
                    tr.appendChild(td);
                }
            }
            
            if (!isCalCreated) {
                cal.appendChild(tr);
            }
        }
        
        isCalCreated = true;
    }
});

function respons(xml, id) {
    var calendar = d.getElementById('calendar'),
        showEvent = d.createElement('div');
    
    showEvent.className = 'event-window';
    showEvent.id = 'event-window';
    showEvent.onclick = function () {
        removeClass(d.getElementById('event-window'), 'show');
        window.location.href = '#' + (mnd + 1) + ',' + year;
    }
    
    var showEventBox = d.createElement('div');
    showEventBox.className = 'box-centered';
    showEvent.appendChild(showEventBox);
    
    var showEventInfo = d.createElement('p');
    showEventInfo.className = 'info';
    showEventInfo.innerHTML = 'Trykk hvor som helst for å lukke vinduet';
    showEventBox.appendChild(showEventInfo);
    
    var showEventTitle = d.createElement('h2');
    showEventTitle.className = 'title';
    showEventTitle.id = 'event-window-title';
    showEventBox.appendChild(showEventTitle);
    
    var showEventPlace = d.createElement('h4');
    showEventPlace.className = 'time';
    showEventPlace.id = 'event-window-time';
    showEventBox.appendChild(showEventPlace);
    
    var showEventDescription = d.createElement('p');
    showEventDescription.className = 'description';
    showEventDescription.id = 'event-window-description';
    showEventBox.appendChild(showEventDescription);
    
    var showEventPlace = d.createElement('h4');
    showEventPlace.className = 'place';
    showEventPlace.id = 'event-window-place';
    showEventBox.appendChild(showEventPlace);
    
    var map = d.createElement('iframe');
    map.src = 'http://use.mazemap.com/embed-single.html?campusid=1&sharepoitype=point&sharepoi=10.40153,63.41809,1&sharepoiname=P15';
    map.className = 'map';
    map.id = 'event-window-map';
    showEventBox.appendChild(map);
    
    d.getElementsByTagName('body')[0].appendChild(showEvent);
    
    if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml.responseText, "text/xml");
    } else {
        xmlDoc = xml.responseXML;
    }
    
    updateEvents();
}

function updateEvents () {
    if (xmlDoc && xmlDoc !== 'undefined') {
        var events = xmlDoc.getElementsByTagName('event');
        
        for (var i = 0; i < events.length; i++) {
            var event = events[i],
                starttid = parseDateTime(event.getAttribute('starttime')),
                sluttid = parseDateTime(event.getAttribute('endtime')),
                difftid = findTimeDiff(event.getAttribute('starttime'), event.getAttribute('endtime'));
            
            if (starttid && starttid.mnd === mnd && starttid.year === year) {
                var dagen = d.getElementById('dag-' + starttid.date);
                
                addClass(dagen, 'event');
                dagen.children[0].innerHTML = event.getElementsByTagName('title')[0].textContent;
                dagen.children[2].innerHTML = 'Kl ' + dd(starttid.hour) + ':' + dd(starttid.min);
                dagen.setAttribute('data-description', event.getElementsByTagName('description')[0].textContent);
                dagen.setAttribute('data-title', event.getElementsByTagName('title')[0].textContent);
                dagen.setAttribute('data-time', ( new Date(new Date().getTime() - parseDateTime(event.getAttribute('starttime'), true)).getTime() < 0 ? 'Starter: ' : 'Startet: ' ) + starttid.date // Må passe på når vi sier fremtid og fortid
                                            + '. ' + mnds[starttid.mnd].charAt(0).toUpperCase() + mnds[starttid.mnd].slice(1, 3) // Fra januar til Jan
                                            + '. ' + starttid.year
                                            + ' Kl. ' + dd(starttid.hour)
                                            + ':' + dd(starttid.min)
                                            + ' og varer i ' + difftid.hour + 't' + (difftid.min > 0 ? ' og ' + difftid.min + 'm' : '' )
                                            + ' (til ' + dd(sluttid.hour)
                                            + ':' + dd(sluttid.min) + ')');
                
                var place = event.getElementsByTagName('place')[0];
                
                dagen.setAttribute('data-lat', place.getAttribute('lat'));
                dagen.setAttribute('data-lng', place.getAttribute('lng'));
                dagen.setAttribute('data-place', place.textContent);
                
                dagen.onclick = function () {
                    addClass(d.getElementById('event-window'), 'show');
                    d.getElementById('event-window-title').innerHTML = this.getAttribute('data-title');
                    d.getElementById('event-window-description').innerHTML = this.getAttribute('data-description');
                    d.getElementById('event-window-place').innerHTML = this.getAttribute('data-place');
                    d.getElementById('event-window-time').innerHTML = this.getAttribute('data-time');
                    d.getElementById('event-window-map').src = 'http://use.mazemap.com/embed-single.html?campusid=1&sharepoitype=point&sharepoi='
                        + this.getAttribute('data-lng') + ','
                        + this.getAttribute('data-lat') + ',1&sharepoiname='
                        + this.getAttribute('data-place');
                    
                    // Gjør eventet delelig slik at brukere kan sende eventet slik: http://org.ntnu.no/dreamteam2015/calendar.php#11,2015,20
                    window.location.href = '#' + (mnd + 1) + ',' + year + ',' + this.id.split('dag-')[1];
                }
                
                // Denne gjør at brukeren kan sende http://org.ntnu.no/dreamteam2015/calendar.php#11,2015,20 og få opp eventet den 20. november 2015
                if (daySelected === starttid.date) dagen.click();
            }
        }
    }
}

function parseDateTime (datetime, gettotal) {
    if (typeof datetime === 'string') {
        var obj = datetime.split(/[:T\-Z]/g);
        
        if (obj.length > 5) {
            if (typeof gettotal === 'undefined') {
                return {
                    year: parseInt(obj[0]),
                    mnd: parseInt(obj[1])-1,
                    date: parseInt(obj[2]),
                    hour: parseInt(obj[3]),
                    min: parseInt(obj[4]),
                    sec: parseInt(obj[5])
                }
            } else if (gettotal) {
                return new Date(parseInt(obj[0]),
                               parseInt(obj[1])-1,
                               parseInt(obj[2]),
                               parseInt(obj[3]),
                               parseInt(obj[4]),
                               parseInt(obj[5])).getTime();
            }
        }
    }
    
    return false;
}

// Lage tall med minst 2 siffer
function dd (tall) {
    return (tall < 10 ? '0' : '' ) + tall;
}

function findTimeDiff (datetime1, datetime2) {
    if (typeof datetime1 !== 'undefined' && typeof datetime2 !== 'undefined') {
        var d1 = new Date(datetime1.replace(/-/g, '/').replace(/T/g, ' ').replace(/Z/g, ''));
        var d2 = new Date(datetime2.replace(/-/g, '/').replace(/T/g, ' ').replace(/Z/g, ''));
        var diff = new Date(d2.getTime() - d1.getTime());
        
        return {
            year: diff.getFullYear(),
            mnd: diff.getMonth(),
            date: diff.getDate(),
            hour: diff.getHours(),
            min: diff.getMinutes(),
            sec: diff.getSeconds()
        }
    }
    
    return false;
}