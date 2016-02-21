/*

FILE NAME: Project/js/get_genre.js

WRITTEN BY: Øyvind Auestad Bjørhus

WHEN: 6. November 2015

PURPOSE: Get data from artists.xml document and group them into genres. We are using an asyncronized prosess to load the groups, else the site would be unnecessary huge. We also delete the data after usage.

*/

var d = document, xmlDoc, savedGroups = [], waitForRemoval = [];

d.addEventListener('DOMContentLoaded', function (e) {
    
    if (typeof lastInnXML === 'function') {
        lastInnXML('data/artists.xml', respons);
    }
});

function respons(xml) {
	var display = d.querySelector('#sjangere > .discover');
    
    if (window.DOMParser) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xml.responseText, "text/xml");
    } else {
        var xmlDoc = xml.responseXML;
    }
    
    if (display && display !== 'undefined' && xmlDoc && xmlDoc !== 'undefined') {
        var genres = xmlDoc.getElementsByTagName('genre');
        
        for (var i = 0; i < genres.length; i++) {
            var container = d.createElement('li'),
                genreInput = d.createElement('input'),
                genreLabel = d.createElement('label'),
                genreLabel = d.createElement('label'),
                genreContainer = d.createElement('ul'),
                genreName = genres[i].getAttribute('name'),
                subGenres = genres[i].getElementsByTagName('sub_genre');
            
            genreInput.id = genreName;
            genreInput.type = 'checkbox';
            genreInput.onchange = function () {
                var thisElem = this;
                
                // Vi sletter artist-data etter 0.4 sek siden da er animasjonen ferdig.
                waitForRemoval = savedGroups;
                savedGroups = [];
                
                setTimeout(function () {
                    for (var i = 0; i < waitForRemoval.length; i++) {
                        waitForRemoval[i].parentElement.removeChild(waitForRemoval[i]);
                    }

                    waitForRemoval = [];
                    if (thisElem.checked) scrollTo(thisElem.parentElement, undefined, easeWithTan);
                }, 400);
                
                if (this.checked) {
                    var el = d.querySelectorAll('#sjangere > .discover > li > input[type="checkbox"]');
                    
                    for (var i = 0; i < el.length; i++) {
                        if (el[i].id !== this.id) {
                            el[i].checked = false;
                            if (isTouchDevice) removeClass(el[i].nextElementSibling, 'open');
                        }
                    }
                    
                    el = d.querySelectorAll('#sjangere > .discover > li > ul > li > input[type="checkbox"]');
                    
                    for (var i = 0; i < el.length; i++) {
                        el[i].checked = false;
                        if (isTouchDevice) removeClass(el[i].nextElementSibling, 'open');
                    }
                }
            }
            
            genreLabel.innerHTML = genreName.replace('_', ' ');
            genreLabel.setAttribute('for', genreName.replace(' ', '-'));
            if (isTouchDevice) {
                genreLabel.addEventListener('click', function (e) {

                    if (getClass(this, 'open')) {
                        removeClass(this, 'open');
                    } else {
                        addClass(this, 'open');
                    }
                });
            }
            
            if (typeof addHoverToElement === 'function') {
                addHoverToElement(genreLabel);
            }
            
            container.appendChild(genreInput);
            container.appendChild(genreLabel);
            
            for (var j = 0; j < subGenres.length; j++) {
                var subContainer = d.createElement('li'),
                    subGenreInput = d.createElement('input'),
                    subGenreLabel = d.createElement('label'),
                    subGenreContainer = d.createElement('ul'),
                    subGenreName = subGenres[j].getAttribute('name');
                
                subGenreInput.id = subGenreName.replace(' ', '-');
                subGenreInput.type = 'checkbox';
                subGenreInput.onchange = function () {
                    var thisElem = this;
                    
                    waitForRemoval = savedGroups;
                    savedGroups = [];
                    
                    setTimeout(function () {
                        for (var i = 0; i < waitForRemoval.length; i++) {
                            waitForRemoval[i].parentElement.removeChild(waitForRemoval[i]);
                        }
                        
                        waitForRemoval = [];
                        if (thisElem.checked) scrollTo(thisElem.parentElement, undefined, easeWithTan);
                    }, 400);
                    
                    if (this.checked) {
                        el = d.querySelectorAll('#sjangere > .discover > li > ul > li > input[type="checkbox"]');
                        for (var i = 0; i < el.length; i++) {
                            if (this.id !== el[i].id) {
                                el[i].checked = false;
                                if (isTouchDevice) removeClass(el[i].nextElementSibling, 'open');
                            }
                        }
                        
                        var genreGroups = xmlDoc.querySelectorAll('sub_genre[name="' + this.id + '"] genre_group');
                        
                        for (var i = 0; i < genreGroups.length; i++) {
                            var groupId = genreGroups[i].getAttribute('group'),
                                group = xmlDoc.getElementById(groupId);
                            
                            if (notCoolBrowser) {
                                var gs = xmlDoc.getElementsByTagName('group');
                                
                                for (var gn = 0; gn < gs.length; gn++) {
                                    if (gs[gn].getAttribute('id') == groupId) {
                                        group = gs[gn];
                                        break;
                                    }
                                }
                            }
                            
                            if (group) {
                                var genreGroup = d.createElement('li'),
                                    groupName = d.createElement('h2'),
                                    groupBox = d.createElement('div'),
                                    groupFigure = d.createElement('figure'),
                                    groupImg = d.createElement('img'),
                                    groupLink = d.createElement('a'),
                                    groupMembers = d.createElement('ul'),
                                    groupSongs = d.createElement('ul');
                                
                                genreGroup.className = 'group-block';

                                groupName.innerHTML = group.getAttribute('name');
                                groupName.className = 'group-name';

                                groupLink.innerHTML = 'Les mer om artisten her';
                                groupLink.className = 'btn accept-btn';
                                groupLink.href = 'discover/artist.php?g=' + groupId;

                                groupImg.src = group.getElementsByTagName('picture')[0].getAttribute('src');
                                groupImg.alt = group.getElementsByTagName('picture')[0].getAttribute('alt');
                                groupImg.title = groupImg.alt;
                                groupImg.className = 'showoff border';
                                
                                groupMembers.className = 'members';
                                groupSongs.className = 'songs';
                                
                                var members = group.getElementsByTagName('group_member'),
                                    groupMember = d.createElement('li');

                                groupMember.innerHTML = 'Medlemmer:';
                                groupMember.className = 'member-description';

                                groupMembers.appendChild(groupMember);
                                
                                for (var m = 0; m < members.length; m++) {
                                    groupMember = d.createElement('li');
                                    groupMember.innerHTML = members[m].getAttribute('name');
                                    groupMember.className = 'member';
                                    
                                    groupMembers.appendChild(groupMember);
                                }
                                
                                groupBox.appendChild(groupFigure);
                                groupBox.appendChild(groupMembers);
                                
                                if (group.getElementsByTagName('songs').length > 0) {
                                    var songs = group.getElementsByTagName('song'),
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
                                            playBtn.setAttribute('data-img', 'images/' + groupImg.src.split('/images/')[1]);
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
                                    
                                    groupBox.appendChild(groupSongs);
                                }
                                
                                genreGroup.appendChild(groupName);
                                genreGroup.appendChild(groupLink);
                                groupFigure.appendChild(groupImg);
                                genreGroup.appendChild(groupBox);
                                savedGroups.push(genreGroup);
                                this.parentElement.getElementsByTagName('ul')[0].appendChild(genreGroup);
                                
                                if (typeof addHoverToElement === 'function') {
                                    addHoverToElement(groupLink);
                                }
                                
                                if (typeof addResizeToImg === 'function') {
                                    addResizeToImg(groupImg);
                                }
                            }
                        }
                    }
                }
                
                subGenreLabel.innerHTML = subGenreName.replace('_', ' ');
                subGenreLabel.setAttribute('for', subGenreName);
                if (isTouchDevice) {
                    subGenreLabel.addEventListener('click', function (e) {

                        if (getClass(this, 'open')) {
                            removeClass(this, 'open');
                        } else {
                            addClass(this, 'open');
                        }
                    });
                }
                
                if (typeof addHoverToElement === 'function') {
                    addHoverToElement(subGenreLabel);
                }
                
                subContainer.appendChild(subGenreInput);
                subContainer.appendChild(subGenreLabel);
                
                // Data
                
                subContainer.appendChild(subGenreContainer);
                genreContainer.appendChild(subContainer);
            }
            
            container.appendChild(genreContainer);
            display.appendChild(container);
        }
    }
}