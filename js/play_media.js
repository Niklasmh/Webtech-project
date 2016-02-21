/*

FILE NAME: Project/js/play_media.js

WRITTEN BY: Niklas Molnes Hole

WHEN: 6. November 2015

PURPOSE: We create an element which is the player, but only when the user has played a song. We use cookies to save if the user has opened or closed the player. We do also save the position of the player with cookies after the user moves it.

Then, from other functions, we can call playMedia(filepath), and the player will automatically show and play. Even when
you switch page, the song will continue to play.

*/

var d = document,
    audio,
    mediaPlayerFile,
    mediaPlayerPic,
    mediaPlayerTitle,
    mediaPlayerTime,
	playerContainer,
    isPlaying = false,
    pathprefix = ( /discover\/|about\/|join\/|articles\//.test(window.location.pathname) ? '../' : '' ),
	pressedPlayer = (isTouchDevice ? 'touchstart' : 'mousedown'),
	movedPlayer = (isTouchDevice ? 'touchmove' : 'mousemove'),
	releasedPlayer = (isTouchDevice ? 'touchend' : 'mouseup'),
	startPos = { x: 0, y: 0 },
	pos = { x: 0, y: 0 },
	savePos = { x: 0, y: 0 },
	offset = { x: 0, y: 0 },
	dragging = false,
	dragged = false;

d.addEventListener('DOMContentLoaded', function (e) {
    
    if (isCookiesAllowed) {
        if (getCookie('mediaPlayer') === 'true') {
            createPlayer();
            
            mediaPlayerFile = getCookie('mediaPlayerFile');
            mediaPlayerPic = getCookie('mediaPlayerPic');
            mediaPlayerTitle = getCookie('mediaPlayerTitle');
            mediaPlayerTime = parseFloat(getCookie('mediaPlayerTime'));
            mediaPlayerPosX = parseFloat(getCookie('mediaPlayerPosX') || null);
            mediaPlayerPosY = parseFloat(getCookie('mediaPlayerPosY') || null);
            
            if (mediaPlayerFile) {
                
                if (getCookie('mediaPlaying') === 'true') {
                    playMedia(mediaPlayerFile, mediaPlayerPic, mediaPlayerTitle, mediaPlayerTime || 0);
                    addClass(d.getElementById('media-player-play'), 'on');
                } else {
                    playMedia(mediaPlayerFile, mediaPlayerPic, mediaPlayerTitle, mediaPlayerTime || 0, true);
                }
            } else {
                setCookie('mediaPlaying', false);
                removeClass(d.getElementById('media-player-play'), 'on');
            }
        } else {
            if (d.getElementById('media-player')) {
                addClass(d.getElementById('media-player'), 'hidden');
            }
        }
    }
    
    // Vi vil lagre info om spillepunkt hvert sek
    setInterval(function () {
        if (isPlaying) {
            if (audio) setCookie('mediaPlayerTime', audio.currentTime);
        }
    }, 1000);
});

function playMedia (src, pic, title, time, stop) {
    mediaPlayerFile = src;
    mediaPlayerPic = (typeof pic !== 'undefined' ? pic : 'images/icon.png');
    mediaPlayerTitle = (typeof title !== 'undefined' ? title : 'Untitled');
    mediaPlayerTime = (typeof time !== 'undefined' ? parseFloat(getCookie('mediaPlayerTime')) : 0);
    stop = (typeof stop !== 'undefined' && stop ? true : false);
    isPlaying = !stop;
    
    if (isCookiesAllowed) {
        setCookie('mediaPlayer', true);
        setCookie('mediaPlaying', !stop);
        setCookie('mediaPlayerFile', mediaPlayerFile);
        setCookie('mediaPlayerPic', mediaPlayerPic);
        setCookie('mediaPlayerTitle', mediaPlayerTitle);
        
        if (!d.getElementById('media-player')) {
            createPlayer();
        } else {
            removeClass(d.getElementById('media-player'), 'hidden');
        }
        
        d.getElementById('media-player').setAttribute('data-title', mediaPlayerTitle);
        
        if (d.getElementById('media-player-play')) {
            if (!stop) addClass(d.getElementById('media-player-play'), 'on');
            d.getElementById('media-player-play').innerHTML = (stop ? 'Spill' : 'Pause');
        }
        
        if (d.getElementById('media-player-img')) {
            d.getElementById('media-player-img').style.backgroundImage = 'url(' + pathprefix + mediaPlayerPic + ')';
        }
        
        if (audio && !audio.paused) audio.pause();
        audio = new Audio(pathprefix + mediaPlayerFile);
        if (!stop) audio.play();
        audio.addEventListener('ended', function () {
            audio.pause();
            setCookie('mediaPlaying', false);
            if (d.getElementById('media-player-play')) {
                d.getElementById('media-player-play').innerHTML = 'Spill igjen';
                removeClass(d.getElementById('media-player-play'), 'on');
            }
        });
        audio.addEventListener('loadedmetadata', function () {
            this.currentTime = parseFloat(mediaPlayerTime || 0);
        });
		
		var mppx = getCookie('mediaPlayerPosX'),
			mppy = getCookie('mediaPlayerPosY'),
			playerContainer = d.getElementById('media-player');
		
		if (mppx && mppy && typeof playerContainer !== 'undefined') {
			playerContainer.style.right = 'auto';
			playerContainer.style.bottom = 'auto';
			playerContainer.style.margin = '4px';
			
			pos.x = parseInt(mppx);
			pos.y = parseInt(mppy);
			startPos.x = parseInt(mppx);
			startPos.y = parseInt(mppy);
			
			playerContainer.style.left = pos.x + 'px';
			playerContainer.style.top = pos.y + 'px';
			
			dragged = true;
		}
    }
}

function createPlayer () {
    if (!d.getElementById('media-player')) {
        var playerContainer = d.createElement('div'),
            playerCloseBtn = d.createElement('button'),
            playerPlayBtn = d.createElement('button'),
            playerPic = d.createElement('div');
        
        playerContainer.id = 'media-player';
        
        playerCloseBtn.id = 'media-player-close';
        playerCloseBtn.className = 'close-btn';
        playerCloseBtn.innerHTML = 'X';
        playerCloseBtn.onclick = function () {
            if (getCookie('mediaPlayer') === 'true') {
                if (typeof audio !== 'undefined' && audio) audio.pause();
                setCookie('mediaPlayer', false);
                setCookie('mediaPlaying', false);
                addClass(d.getElementById('media-player'), 'hidden');
            }
        };
        
        playerPlayBtn.id = 'media-player-play';
        playerPlayBtn.className = 'play-btn';
        playerPlayBtn.innerHTML = 'Spill';
        playerPlayBtn.onclick = function () {
            if (mediaPlayerFile) {
                if (toggleClass(this, 'on')) {
                    if (getCookie('mediaPlaying') === 'false' && audio) {
                        audio.play();
                        isPlaying = true;
                        this.innerHTML = 'Pause';
                        setCookie('mediaPlaying', true);
                        setCookie('mediaPlayerFile', mediaPlayerFile);
                        setCookie('mediaPlayerPic', mediaPlayerPic);
                        setCookie('mediaPlayerTitle', mediaPlayerTitle);
                    } else {
                        playMedia(mediaPlayerFile, mediaPlayerPic, mediaPlayerTitle);
                    }
                } else {
                    if (typeof audio !== 'undefined') {
                        audio.pause();
                        isPlaying = false;
                        this.innerHTML = 'Spill';
                        setCookie('mediaPlaying', false);
                    } else {
                        playMedia(mediaPlayerFile, mediaPlayerPic, mediaPlayerTitle);
                    }
                }
            }
        };
		
        playerPic.id = 'media-player-img';
        playerPic.className = 'media-player-img';
        
        playerContainer.appendChild(playerCloseBtn);
        playerContainer.appendChild(playerPlayBtn);
        playerContainer.appendChild(playerPic);
        d.getElementsByTagName('body')[0].appendChild(playerContainer);
        
        if (typeof addHoverToElement === 'function') {
            addHoverToElement(playerCloseBtn);
            addHoverToElement(playerPlayBtn);
        }
		
		playerContainer.addEventListener(pressedPlayer, dragDown);
		window.addEventListener(releasedPlayer, dragUp);
		window.addEventListener('resize', resize);
		
		function dragDown(evt) {
			window.addEventListener(movedPlayer, dragBox, true);
			
			if (!dragged) {
				playerContainer.style.right = 'auto';
				playerContainer.style.bottom = 'auto';
				playerContainer.style.margin = '4px';
			}
			
			offset = getOffsetRect(playerContainer);
			dragging = true;
			
			if (isTouchDevice) {
				var touch = evt.targetTouches[0];
				
				savePos = { x: touch.pageX - pos.x, y: touch.pageY - pos.y };
			} else {
				savePos = { x: evt.pageX - pos.x, y: evt.pageY - pos.y };
			}
			
			if (!dragged) {
				savePos.x -= window.innerWidth*.95 - 276;
				savePos.y -= window.innerHeight - 100 - 256;
				dragged = true;
			}
		}
		
		function dragUp() {
			window.removeEventListener(movedPlayer, dragBox, true);
			
			if (dragging) {
				setCookie('mediaPlayerPosX', pos.x);
				setCookie('mediaPlayerPosY', pos.y);
			}
			
			dragging = false;
		}
		
		function dragBox (evt) {
			
			if (dragging) {
				
				var posX = -savePos.x,
					posY = -savePos.y,
					body = document.getElementsByTagName('body')[0];
				
				if (isTouchDevice) {
					var touch = evt.targetTouches[0];
					
					posX += touch.pageX;
					posY += touch.pageY;
				} else {
					posX += evt.pageX;
					posY += evt.pageY;
				}
				
				windowW = body.innerWidth;
				pos.x = Math.max(Math.min(posX, -offset.x+window.innerWidth-256-26), -offset.x);
				pos.y = Math.max(Math.min(posY, -offset.y+window.innerHeight+body.scrollTop-256-8), -offset.y+body.scrollTop);
				
				startPos.x = 0;
				startPos.y = 0;
				
				playerContainer.style.left = pos.x + 'px';
				playerContainer.style.top = pos.y + 'px';
				
				evt.preventDefault();
			}
		}
		
		function resize(evt) {
			
			if (dragged) {
				var win = { x: window.innerWidth, y: window.innerHeight };

				pos.x = Math.max(Math.min(pos.x, win.x - 264 - 18), 0);
				pos.y = Math.max(Math.min(pos.y, win.y - 264), 0);

				playerContainer.style.left = pos.x + 'px';
				playerContainer.style.top = pos.y + 'px';

				setCookie('mediaPlayerPosX', pos.x);
				setCookie('mediaPlayerPosY', pos.y);
			}
		}
    }
}

function getOffsetRect(elem) {
	var box = elem.getBoundingClientRect(),
		body = document.body,
		docElem = document.documentElement,
		scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
		scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
		clientTop = docElem.clientTop || body.clientTop || 0,
		clientLeft = docElem.clientLeft || body.clientLeft || 0,
		top  = box.top +  scrollTop - clientTop - elem.offsetTop,
		left = box.left + scrollLeft - clientLeft - elem.offsetLeft;
	
	return { x:Math.round(left), y:Math.round(top) };
}