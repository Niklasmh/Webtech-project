/*

FILE NAME: Project/js/get_article.js

WRITTEN BY: Siddise Hirpa

WHEN: 29. Oktober 2015

PURPOSE: Get data from article xml document.

UPDATE: The file is now IE11+ friendly, which means most browsers support this application's features.

*/

var d = document,
    articles = {},
    tags = [],
    oldtags = [],
    sortby = 'date',
    sortasc = false,
    kolonner = [{ name: 'dato', id: 4 },
                { name: 'tittel', id: 1 },
                { name: 'forfatter', id: 5 }],
    articleContainer,
    aid,
    sek, msg, path;

d.addEventListener('DOMContentLoaded', function (e) {
    var search = window.location.search;
    var hash = window.location.hash;
	
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
		idFound = parseInt(search.split('a=')[1].split('&')[0]);
        
		if (idFound) {
        	lastInnXML('../data/articles.xml', respons, idFound);
		}
	}
	
	if (!idFound) {
        lastInnXML('../data/articles.xml', respons);
    }
});

function respons(xml, id) {
	var display = d.getElementById('article');
    
    if (window.DOMParser) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xml.responseText, "text/xml");
    } else {
        var xmlDoc = xml.responseXML;
    }
    
    if (display && display !== 'undefined' && xmlDoc && xmlDoc !== 'undefined') {

        if (id && typeof id !== 'undefined' && !isNaN(id)) {
            var article = xmlDoc.getElementById(id);
            
            if (notCoolBrowser) {
                var gs = xmlDoc.getElementsByTagName('article');
                for (var gn = 0; gn < gs.length; gn++) {
                    if (gs[gn].getAttribute('id') == id) {
                        article = gs[gn];
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
                goBack.onclick = function (e) { window.history.back(); e.preventDefault(); };
                goBack.href = '#';
                goBack.innerHTML += 'Tilbake til søk';
            } else {

                // Hvis brukeren hopper dit ifra en annen side vil vi bare hoppe til arkivet.
                goBack.href = window.location.pathname;
                goBack.innerHTML += 'Til arkivet';
            }

            goBackContainer.appendChild(goBack);
            display.appendChild(goBackContainer);

            if (article && article !== 'undefined') {
                var a = article;

                d.getElementById('archiveright').style.width = '100%';
                d.getElementById('archiveleft').style.display = 'none';

                var container = d.createElement('div');
                container.className = 'article animate-color addhover';

                var pic = d.createElement('div');
                //pic.className = 'cropimg';
                display.appendChild(pic);

                var fig = d.createElement('figure');
                var img = d.createElement('img');
                img.className = 'showoff big flat background border';
                img.src = a.getElementsByTagName('picture')[0].getAttribute('src').replace(/^.\//, '../');
                img.alt = a.getElementsByTagName('picture')[0].getAttribute('alt');
                img.title = img.alt;
                fig.appendChild(img);
                pic.appendChild(fig);

                if (!notCoolBrowser) {
                    var details = d.createElement('p');
                    details.className = 'details';
                    details.innerHTML = 'Skrevet av ' + a.getElementsByTagName('author')[0].textContent + ' den ' + XMLDatetimeFormat(a.getElementsByTagName('datetime')[0].textContent);
                    display.appendChild(details);
                }

                // Disse taggene på artikkelen gjør det mulig å finne andre artikler med samme tag.
                var c = a.getElementsByTagName('tags')[0].childNodes,
                    tagsOn = d.createElement('div');

                tagsOn.className = 'tags';

                if (c) {

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
                }

                display.appendChild(tagsOn);

                var title = d.createElement('h2');
                title.className = 'title';
                title.innerHTML = a.getElementsByTagName('title')[0].textContent;
                display.appendChild(title);

                var content = d.createElement('div');
                content.className = 'content';
                var c = a.getElementsByTagName('content')[0].childNodes;
                for (var i = 0; i < c.length; i++) {
                    var el = c[i],
                        newel;

                    if (el.tagName === 'paragraph') {
                        newel = d.createElement('p');
                        newel.className = 'paragraph';
                        newel.innerHTML = el.textContent;
                    } else if (el.tagName === 'header') {
                        newel = d.createElement('h3');
                        newel.className = 'header west-eu';
                        newel.innerHTML = el.textContent;
                    } else if (el.tagName === 'media') {
						newel = d.createElement('button');
						if (el.getAttribute('title')) {
							newel.innerHTML = el.getAttribute('title');
						} else {
							newel.innerHTML = 'Spill av ' + el.getAttribute('name');
						}
						newel.className = 'play-btn';
						newel.setAttribute('data-src', 'media/' + el.getAttribute('type') + '/' + el.getAttribute('src'));
						newel.setAttribute('data-name', el.getAttribute('name'));
						newel.setAttribute('data-img', 'images/' + img.src.split('/images/')[1]);
						newel.onclick = function () {
							// Play a song in self build media player.
							playMedia(this.getAttribute('data-src'), this.getAttribute('data-img'), this.getAttribute('data-name'));
						}

						if (typeof addHoverToElement === 'function') {
							addHoverToElement(newel);
						}
                    }

                    if (newel && typeof newel === 'object') {
                        content.appendChild(newel);
                    }
                }

                display.appendChild(content);


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
            var articles = xmlDoc.getElementsByTagName('article');
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
                btnCheckSorterEtter.onchange = sorterArtikler;
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
            btnCheckSorter.onchange = sorterArtikler;
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

            if (articles.length > 0) {
                for(var i = 0; i < articles.length; i++) {
                    var a = articles[i],
                        link = '?a=' + a.getAttribute('id');

                    var container = d.createElement('div');
                    container.className = 'article animate-color addhover';

                    var readMore = d.createElement('a');
                    readMore.className = 'read-more addhover';
                    readMore.href = link;
                    var pic = d.createElement('div');
                    pic.className = 'cropimg';
                    pic.style.backgroundImage = 'url(' + a.getElementsByTagName('picture')[0].getAttribute('src').replace(/^.\//, '../') + ')';
                    readMore.appendChild(pic);
                    container.appendChild(readMore);

                    /* Dropper bilder. Lager heller bakgrunnsbilder for aspekt ratio * /
                    var img = d.createElement('img');
                    img.src = a.getElementsByTagName('picture')[0].getAttribute('src');
                    img.alt = a.getElementsByTagName('picture')[0].getAttribute('alt');
                    pic.appendChild(img);
                    /**/

                    var title = d.createElement('h2');
                    title.innerHTML = a.getElementsByTagName('title')[0].textContent;
                    container.appendChild(title);

                    var intro = d.createElement('p');
                    intro.innerHTML = a.getElementsByTagName('intro')[0].textContent;
                    container.appendChild(intro);

                    readMore = d.createElement('a');
                    readMore.className = 'read-more addhover';
                    readMore.href = link;
                    readMore.innerHTML = 'Les mer...';
                    container.appendChild(readMore);

                    details = d.createElement('p');
                    details.style.display = 'none';
                    details.innerHTML = a.getElementsByTagName('datetime')[0].textContent;
                    container.appendChild(details);

                    details = d.createElement('p');
                    details.style.display = 'none';
                    details.innerHTML = a.getElementsByTagName('author')[0].textContent;
                    container.appendChild(details);

                    if (!notCoolBrowser) {
                        details = d.createElement('p');
                        details.className = 'details';
                        details.innerHTML = 'Skrevet av ' + a.getElementsByTagName('author')[0].textContent + ' den ' + XMLDatetimeFormat(a.getElementsByTagName('datetime')[0].textContent);
                        container.appendChild(details);
                    }

                    // Legger til ferdig oppsett til id, article, på slutten.
                    display.appendChild(container);

                    var tagGroup = d.createElement('div');
                    tagGroup.className = 'tags';

                    var c = a.getElementsByTagName('tags')[0].childNodes;

                    for (var k = 0; k < c.length; k++) {
                        var el = c[k],
                            newel;

                        if (el.tagName && el.tagName === 'tag') {
                            var tagname = el.getAttribute('name');
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
                                input.className = 'tag-check'
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
                            //tagInst.id = 'tag-bar-' + a.getAttribute('id');
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
                    }
                }

                updateTags();
                sorterArtikler();
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
            articles = d.getElementsByClassName('article');
        
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
            
            for (var i = 0; i < articles.length; i++) {
                var el = articles[i];
                
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
            
            for (var i = 0; i < articles.length; i++) {
                var el = articles[i];
                
                removeClass(el, 'disabled');
            }
            
            var tagBars = d.getElementsByClassName('tag');
            
            for (var i = 0; i < tagBars.length; i++) {
                removeClass(tagBars[i], 'selected');
            }
        }
    }
}

function sorterArtikler() {
    var table = document.getElementById('article'),
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