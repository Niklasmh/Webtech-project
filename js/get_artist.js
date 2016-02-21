/*

FILE NAME: Project/js/get_artist.js

WRITTEN BY: Stian Sørli

WHEN: 29. Oktober 2015

PURPOSE: Get data from artists.xml document.

The data is displayed as blocks where you can sort by date or
title and categorize by tagnames. This is a powerful js-file which can import data
from a XML-document, parse it to the webpage and manipulate the data afterwards.
It can handle alot of data, but since we only use example-data, it should not be
much more. If we should have published the site and made alot more articles, we
would need a smarter code which handles AJAX more often than just when the page loads.

UPDATE: The file is now IE11+ friendly, which means most browsers support this application's features.

*/

var d = document,
    groups = {},
    tags = [],
    oldtags = [],
    sortby = 'date',
    sortasc = true,
    kolonner = [{ name: 'dato', id: 3 },
                { name: 'tittel', id: 1 }],
    groupContainer,
    aid,
    sek, msg, path;

d.addEventListener('DOMContentLoaded', function (e) {
    var search = window.location.search,
		hash = window.location.hash;
	
    if (hash && hash.length > 1) {
        var userdata = hash.split('#')[1].split(';');
        
        if (userdata.length > 0) {
            if (userdata[0].length > 0) {
                oldtags = userdata[0].split(',');
            }
        }
        
        if (userdata.length > 1) {
            if (userdata[1].length > 0) {
                var sortdata = userdata[1].split(',');
                sortby = (sortdata.length > 0 && sortdata[0].length > 0 ? sortdata[0] : false);
                sortasc = (sortdata.length > 1 && sortdata[1].length > 0 && sortdata[1] === 'desc');
            }
        }
    }
    
	idFound = false;
	
    if (search && search.length > 1) {
		idFound = parseInt(search.split('g=g')[1].split('&')[0]);
        
		if (idFound) {
        	lastInnXML('../data/artists.xml', respons, idFound);
		}
	}
	
	if (!idFound) {
        lastInnXML('../data/artists.xml', respons);
    }
});

function respons(xml, id) {
	var display = d.getElementById('group');
    
    if (window.DOMParser) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xml.responseText, "text/xml");
    } else {
        var xmlDoc = xml.responseXML;
    }
    
    if (display && display !== 'undefined' && xmlDoc && xmlDoc !== 'undefined') {
		
        if (id && typeof id !== 'undefined' && !isNaN(id)) {
            var group = xmlDoc.getElementById('g' + id);
            
            if (notCoolBrowser) {
                var gs = xmlDoc.getElementsByTagName('group');
                
                for (var gn = 0; gn < gs.length; gn++) {
                    if (gs[gn].getAttribute('id') == 'g' + id) {
                        group = gs[gn];
                        break;
                    }
                }
            }
            
            var goBackContainer = d.createElement('h3');
            var goBack = d.createElement('a');
            goBack.className = 'addhover btn';
            
            var goBackPic = d.createElement('img');
            goBackPic.src = '../buttons/left.svg';
            goBackPic.className = 'arrow';
            goBackPic.alt = 'Pil til venstre';
            goBack.appendChild(goBackPic);
            
            // Vi vil at brukeren skal kunne gå tilbake til samme søk.
            if (isCookiesAllowed && window.location.href.split('?')[0].split('#')[0] === document.referrer.split('?')[0].split('#')[0]) {
                goBack.onclick = function (e) { window.history.go(-1); e.preventDefault(); };
                goBack.href = '#';
                goBack.innerHTML += 'Tilbake til søk';
            } else {
                
                // Hvis brukeren hopper dit ifra en annen side vil vi bare hoppe til arkivet.
                goBack.href = window.location.pathname;
                goBack.innerHTML += 'Til artister';
            }
            
            goBackContainer.appendChild(goBack);
            display.appendChild(goBackContainer);
			
            if (group && group !== 'undefined') {
                var g = group;
                
                d.getElementById('archiveright').style.width = '100%';
                d.getElementById('archiveleft').style.display = 'none';
                
                var container = d.createElement('div');
                container.className = 'group animate-color addhover';
                
                var pic = d.createElement('div');
                //pic.className = 'cropimg';
                display.appendChild(pic);

                var fig = d.createElement('figure');
                var img = d.createElement('img');
                img.className = 'showoff big flat background border';
                img.src = g.getElementsByTagName('picture')[0].getAttribute('src').replace(/^.\//, '../');
                img.alt = g.getElementsByTagName('picture')[0].getAttribute('alt');
                img.title = img.alt;
                fig.appendChild(img);
                pic.appendChild(fig);
				
				// Disse taggene på artikkelen gjør det mulig å finne andre artikler med samme tag.
				var c = g.getElementsByTagName('tags')[0].childNodes,
					tagsOn = d.createElement('div');
                
				tagsOn.className = 'tags';
				
				for (var t = 0; t < c.length; t++) {
                    if (c[t].tagName === 'tag') {
                        var tagOn = d.createElement('a');

                        tagOn.innerHTML = c[t].getAttribute('name');
                        tagOn.className = 'tag selected animate-color';
                        tagOn.href = window.location.pathname + '#' + tagOn.innerHTML;
                        tagsOn.appendChild(tagOn);

                        if (typeof addHoverToElement === 'function') {
                            addHoverToElement(tagOn);
                        }
                    }
				}
				
				display.appendChild(tagsOn);

                var title = d.createElement('h2');
                title.className = 'title';
                title.innerHTML = g.getAttribute('name');
                display.appendChild(title);

                var content = d.createElement('div');
                content.className = 'content';
                var c = d.createElement('p');
				c.innerHTML = g.getElementsByTagName('description')[0].textContent;
                content.appendChild(c);
                display.appendChild(content);
                
                var groupSongs = d.createElement('ul');
                
                groupSongs.className = 'group-songs';
                
                if (g.getElementsByTagName('songs').length > 0) {
                    var songs = g.getElementsByTagName('song'),
                        groupSong = d.createElement('li');

                    groupSong.innerHTML = 'Sanger:';
                    groupSong.className = 'song-description';

                    groupSongs.appendChild(groupSong);

                    for (var s = 0; s < songs.length; s++) {
                        groupSong = d.createElement('li');

                        if (songs[s].getAttribute('src') !== null) {
                            var playBtn = d.createElement('button');
                            playBtn.innerHTML = 'Spill av';
                            playBtn.className = 'play-btn';
                            playBtn.setAttribute('data-src', 'media/' + songs[s].getAttribute('src').split('/media/')[1]);
                            playBtn.setAttribute('data-name', songs[s].getAttribute('title'));
                            playBtn.setAttribute('data-img', 'images/' + img.src.split('/images/')[1]);
                            playBtn.onclick = function () {
                                // Play a song in self build media player.
                                playMedia(this.getAttribute('data-src'), this.getAttribute('data-img'), this.getAttribute('data-name'));
                            }

                            groupSong.appendChild(playBtn);

                            if (typeof addHoverToElement === 'function') {
                                addHoverToElement(playBtn);
                            }
                        }

                        var songDesc = d.createElement('span');

                        songDesc.innerHTML = ' ' + songs[s].getAttribute('title');
                        
                        if (typeof songs[s].getAttribute('length') !== 'undefined') {
                             songDesc.innerHTML += ' - (' + songs[s].getAttribute('length') + ')';
                        }
                        
                        groupSong.className = 'song';
                        
                        groupSong.appendChild(songDesc);
                        groupSongs.appendChild(groupSong);
                    }

                    display.appendChild(groupSongs);
                }
                
                // Legger til en resize-funksjon på bildet om funksjonen eksisterer
                if (typeof addResizeToImg === 'function') {
                    addResizeToImg(img);
                }
            
                // Legger til en hover-funksjon på bildet om funksjonen eksisterer
                if (typeof addHoverToElement === 'function') {
                    addHoverToElement(img);
                }
            } else {
                var error = d.createElement('h2');
                error.className = 'error';
                error.innerHTML = 'Fantes ingen artikkel med id lik ' + id + '.';
                display.appendChild(error);

                rediriger(error, window.location.pathname, error.innerHTML);
            }
            
            // Legger til en hover-funksjon om funksjonen eksisterer
            if (typeof addHoverToElement === 'function') {
                addHoverToElement(goBack);
            }
        }

        if (!id || typeof id === 'undefined' || isNaN(id)) {
            var groups = xmlDoc.getElementsByTagName('group');
            tags = [];
			
            var sidebar = d.getElementById('archiveleft'),
                sidemeny = d.createElement('div');
            sidemeny.id = 'sidemeny';

            var tittel = d.createElement('h3');
            tittel.innerHTML = 'Sorter';
            sidemeny.appendChild(tittel);

            var beskrivelse = d.createElement('p');
            beskrivelse.innerHTML = 'Sorter etter:';
            sidemeny.appendChild(beskrivelse);
            
            var sorterEtter = d.createElement('div');
            
            sorterEtter.className = 'sorter-etter';
            
            for (var i = 0; i < kolonner.length; i++) {
                var btnCheckSorterEtter = d.createElement('input');
                btnCheckSorterEtter.type = 'radio';
                btnCheckSorterEtter.checked = (i === 0) || kolonner[i].name === sortby;
                btnCheckSorterEtter.id = 'sorter-etter-btn-' + kolonner[i].id;
                btnCheckSorterEtter.value = kolonner[i].id;
                btnCheckSorterEtter.name = 'sorter-etter-btn-id';
                btnCheckSorterEtter.onchange = sorterArtister;
                btnCheckSorterEtter.className = 'sorter-etter-btn';
                sorterEtter.appendChild(btnCheckSorterEtter);

                var btnSorterEtter = d.createElement('label');
                btnSorterEtter.className = 'sorter-etter-btn animate-color';
                btnSorterEtter.innerHTML = kolonner[i].name;
                btnSorterEtter.setAttribute('for', 'sorter-etter-btn-' + kolonner[i].id);
                sorterEtter.appendChild(btnSorterEtter);
                
                if (typeof addHoverToElement === 'function') {
                        addHoverToElement(btnSorterEtter);
                }
            }
            
            sidemeny.appendChild(sorterEtter);
            
            var btnCheckSorter = d.createElement('input');
            btnCheckSorter.type = 'checkbox';
            btnCheckSorter.id = 'sorter-btn';
            btnCheckSorter.checked = sortasc;
            btnCheckSorter.onchange = sorterArtister;
            btnCheckSorter.className = 'sorter-btn';
            sidemeny.appendChild(btnCheckSorter);

            var btnSorter = d.createElement('label');
            btnSorter.className = 'sorter-btn';
            btnSorter.setAttribute('for', 'sorter-btn');
            sidemeny.appendChild(btnSorter);

            var tittel = d.createElement('h3');
            tittel.innerHTML = 'Emneknagger';
            sidemeny.appendChild(tittel);

            var beskrivelse = d.createElement('p');
            beskrivelse.innerHTML = 'Huk av:';
            sidemeny.appendChild(beskrivelse);
            
            sidebar.appendChild(sidemeny);
            
            if (groups.length > 0) {
                for(var i = 0; i < groups.length; i++) {
                    var g = groups[i],
                        link = '?g=' + g.getAttribute('id');
                    
                    var container = d.createElement('div');
                    container.className = 'group animate-color addhover';

                    var readMore = d.createElement('a');
                    readMore.className = 'read-more addhover';
                    readMore.href = link;
                    var pic = d.createElement('div');
                    pic.className = 'cropimg';
                    	pic.style.backgroundImage = 'url(' + (g.getElementsByTagName('picture').length > 0 ? g.getElementsByTagName('picture')[0].getAttribute('src').replace(/^.\//, '../') : '../images/default.jpg') + ')';
                    readMore.appendChild(pic);
                    container.appendChild(readMore);

                    var title = d.createElement('h2');
                    title.innerHTML = g.getAttribute('name');
                    container.appendChild(title);

                    readMore = d.createElement('a');
                    readMore.className = 'read-more addhover';
                    readMore.href = link;
                    readMore.innerHTML = 'Les mer...';
                    container.appendChild(readMore);
                    
                    details = d.createElement('p');
                    details.style.display = 'none';
                    details.innerHTML = g.getElementsByTagName('start_date')[0].textContent;
                    container.appendChild(details);
                    
                    details = d.createElement('p');
                    details.className = 'details';
                    details.textContent = 'Medlem siden ' + XMLDatetimeFormat(g.getElementsByTagName('start_date')[0].textContent);
                    container.appendChild(details);
                    
                    // Legger til ferdig oppsett til id, group, på slutten.
                    display.appendChild(container);
                    
					var tagGroup = d.createElement('div');
					tagGroup.className = 'tags';
                    
                    var c = g.getElementsByTagName('tags')[0].childNodes;
                    
                    for (var k = 0; k < c.length; k++) {
                        var el = c[k],
                            newel;
                        
                        if (el.tagName && el.tagName === 'tag') {
                            var tagname = el.getAttribute('name').replace(' ', '-');
                            var found = false;
                            var pos = 0;
                            
                            for (var j = 0; j < tags.length; j++) {
                                if (tags[j].name === tagname) {
                                    found = true;
                                    pos = j;
                                    break;
                                }
                            }
                            
                            if (found) {
                                tags[pos].count++;
                                tags[pos].elements.push(container);
                                
                                var oldel = d.getElementById('taglabel-' + tagname);
                                
                                if (oldel) {
                                    oldel.innerHTML = tagname + ' (' + tags[pos].count + ')';
                                }
                            } else {
                                tags.push({ name: tagname, count: 1, elements: [container] });
                                
                                var input = d.createElement('input');
                                input.type = 'checkbox';
                                input.value = tagname;
                                input.id = 'tag-' + tagname;
                                input.className = 'tag-check';
                                input.onchange = updateTags;
                                for (var t = 0; t < oldtags.length; t++) {
                                    if (oldtags[t].toLowerCase() === tagname.toLowerCase()) {
                                        input.checked = true;
                                    }
                                }
                                sidemeny.appendChild(input);
                                
                                var label = d.createElement('label');
                                label.innerHTML = tagname + ' (1)';
                                label.id = 'taglabel-' + tagname;
                                label.setAttribute('for', 'tag-' + tagname);
                                label.className = 'animate-color addhover ';
                                sidemeny.appendChild(label);
                                
                                if (typeof addHoverToElement === 'function') {
                                    addHoverToElement(label);
                                }
                            }
							
							var tagInst = d.createElement('span');
							tagInst.className = 'tag animate-color tag-bar-' + tagname;
                            tagInst.id = 'tag-bar-' + g.getAttribute('id') + '-' + tagname;
							tagInst.innerHTML = tagname;
							tagInst.onclick = function () {
								document.getElementById('tag-' + this.innerHTML).checked = (!document.getElementById('tag-' + this.innerHTML).checked);
                                updateTags();
							}
                            
							tagGroup.appendChild(tagInst);
							
							if (typeof addHoverToElement === 'function') {
                        		addHoverToElement(tagInst);
							}
                        }
                    }
					
					container.appendChild(tagGroup);

                    // Legger til en hover-funksjon om funksjonen eksisterer
                    if (typeof addHoverToElement === 'function') {
                        addHoverToElement(container);
                        addHoverToElement(readMore);
                        addHoverToElement(btnSorter);
                    }
                }
                
                updateTags();
                sorterArtister();
            } else {
                var error = d.createElement('h2');
                error.className = 'error';
                error.innerHTML = 'Det finnes ingen artikler for øyeblikket.';
                display.appendChild(error);

                rediriger(error, '../', error.innerHTML);
            }
        }
    }
}

function updateTags () {
    if (tags && tags !== 'undefined') {
        var elements = d.getElementsByClassName('tag-check'),
            tagsChecked = [],
            groups = d.getElementsByClassName('group');
        
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];

            if (el.checked) {
                tagsChecked.push(el.value);
            }
            
            var tagBars = d.getElementsByClassName('tag-bar-' + el.value);
            
            for (var j = 0; j < tagBars.length; j++) {
                if (el.checked) {
                    addClass(tagBars[j], 'selected');
                } else {
                    removeClass(tagBars[j], 'selected');
                }
            }
        }
        
        oldtags = tagsChecked;
        
        if (tagsChecked.length > 0) {
            
            // Vi vil at brukeren skal kunne dele linken med sine tagger
            window.location.href = '#' + tagsChecked.join(',') + ';' + sortby + (sortasc ? '' : ',desc');
            
            for (var i = 0; i < groups.length; i++) {
                var el = groups[i];
                
                // Vi fjerner ikke artiklene, men skjuler de.
                // Mindre prosess enn å fjerne de helt.
                addClass(el, 'disabled');
            }
            
            for (var i = 0; i < tags.length; i++) {
                var found = false;
                
                for (var j = 0; j < tagsChecked.length; j++) {
                    if (tagsChecked[j] === tags[i].name) {
                        found = true;
                        break;
                    }
                }
                
                if (found) {
                    for (var j = 0; j < tags[i].elements.length; j++) {
                        var el = tags[i].elements[j];
                        
                        removeClass(el, 'disabled');
                    }
                }
            }
        } else {
			
			// Dette er for å unngå at href = # går til topps, som er default
			var thisBody = d.getElementsByTagName('body')[0],
				scroll = thisBody.scrollTop;
			
			window.location.href = '#;' + sortby + (sortasc ? '' : ',desc');
			thisBody.scrollTop = scroll;
            
            for (var i = 0; i < groups.length; i++) {
                var el = groups[i];
                
                removeClass(el, 'disabled');
            }
            
            var tagBars = d.getElementsByClassName('tag');
            
            for (var i = 0; i < tagBars.length; i++) {
                removeClass(tagBars[i], 'selected');
            }
        }
    }
}

function sorterArtister() {
    var table = document.getElementById('group'),
        row = [].slice.call(table.children),
        desc = (document.getElementById('sorter-btn').checked ? 1 : -1),
        col = document.querySelector('input[name="sorter-etter-btn-id"]:checked').value;
    
	row.sort(function(first, second) {
		return first.children[col].innerHTML.toLowerCase() == second.children[col].innerHTML.toLowerCase() ? 0 : (first.children[col].innerHTML.toLowerCase() > second.children[col].innerHTML.toLowerCase() ? desc : -desc);
	});
    
	for (f in row) {
		table.appendChild(row[f]);
	}
    
    sortasc = (desc === -1);
    
    for (var i = 0; i < kolonner.length; i++) {
        if (kolonner[i].id == col) {
            sortby = kolonner[i].name;
            break;
        }
    }
    
    window.location.href = '#' + oldtags.join(',') + ';' + sortby + (sortasc ? '' : ',desc');
}

function rediriger(el, path, msg, setsek) {
    if (el && typeof el !== 'undefined' ) {
        path = (!path || typeof path === 'undefined' ? window.location.pathname : path);
        msg = (!msg || typeof msg === 'undefined' ? 'Du fikk en error.' : msg);
        sek = (!setsek || typeof setsek === 'undefined' ? 3 : setsek);
        
        var wait = setInterval(function() {
            el.innerHTML = msg + '<br>Redirigerer om ' + sek + '...';
            sek--;
            if (sek < 0) {
                clearInterval(wait);
                window.location.replace(path);
            }
        }, 1000);
    }
}