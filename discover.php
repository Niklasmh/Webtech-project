<!--

FILE NAME: Project/discover.php

WRITTEN BY: Øyvind Auestad Bjørhus

WHEN: 26. Oktober 2015

PURPOSE: This page displays artists of the week and retrieves artists from artists.xml

-->

<?php /****************TEMPLATE****************/
$arr = preg_split('/(prosjekt|Project|dreamteam2015)\\\\/', preg_replace('/\//', '\\', __DIR__));
$from_dir = ''; $to_dir = ''; $filename = basename(__FILE__); if (count($arr) > 1) {
    $from_dir = trim($arr[1], '/').'/'; $to_dir = preg_replace('/[^\/]+/', '..', $from_dir);
} include $to_dir.'templatestart.php';
/****************TEMPLATE****************/ ?>


<script src="js/img_ui.js"></script>
<script src="js/get_genre.js"></script>
<title>Nabostøy | Oppdag</title>


<?php /****************TEMPLATE****************/
include $to_dir.'templatemiddle.php';
/****************TEMPLATE****************/ ?>


<h1>Oppdag</h1>

<div id="sjangere">
    <h2>Finn artister</h2>
    <ul class="discover">
	</ul>
</div>

<div id="ukasartist">
	<div class="boxed">
		<h2><a href="discover/artist.php" class="addhover btn">Ukas Artist - Arkiv <img src="buttons/right.svg" alt="Pil til høyre" class="arrow"/></a></h2>
	</div>
	<div class="ukasartist">
        <div>
            <h2>Ukas artist:</h2>
            <a href="discover/artist.php?g=g3"><img src="images/artistimages/mystery.jpg" alt="Sigve Mystery"></a>
            <p>Sjekk ut de nyeste og beste låtene fra Sigve.
                <br><a href="discover/artist.php?g=g3">Sjekk ut artisten!</a></p>
        </div>
        <div>
            <h2>Forrige ukes artist:</h2>
            <a href="discover/artist.php?g=g2"><img src="images/artistimages/aerosmith.jpg" alt="Aerosmith"></a>
            <p>Hardrock-gutta spiller så høytalerene sprenger på scenen i Trondheim!
                <br><a href="discover/artist.php?g=g2">Sjekk ut artisten!</a></p>
        </div>
	</div>
</div>


<?php /****************TEMPLATE****************/
include $to_dir.'templateend.php';
/****************TEMPLATE****************/ ?>
