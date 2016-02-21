<!--

FILE NAME: Project/index.php

WRITTEN BY: Niklas Molnes Hole

WHEN: 16. Oktober 2015

PURPOSE: Homepage which displays content from calendar, articles and discover.

-->

<?php /****************TEMPLATE****************/
$arr = preg_split('/(prosjekt|Project|dreamteam2015)\\\\/', preg_replace('/\//', '\\', __DIR__));
$from_dir = ''; $to_dir = ''; $filename = basename(__FILE__); if (count($arr) > 1) {
    $from_dir = trim($arr[1], '/').'/'; $to_dir = preg_replace('/[^\/]+/', '..', $from_dir);
} include $to_dir.'templatestart.php';
/****************TEMPLATE****************/ ?>


<script src="js/slideshow.js"></script>
<title>Nabostøy | Hjem</title>


<?php /****************TEMPLATE****************/
include $to_dir.'templatemiddle.php';
/****************TEMPLATE****************/ ?>


<h1>Velkommen til Nabostøy!</h1>

<h2>Her kan du lese de nyeste artiklene</h2>
<div class="slideshow addhover switch" data-tag="article" data-title="tag:title" data-src="articles.xml">
</div>

<h2>Oppdage nye artister</h2>
<div class="slideshow addhover switch" data-tag="group" data-title="att:name" data-src="artists.xml">
</div>

<h2>Og spille dine favoritt sanger i Naboplayer</h2>
<p>&nbsp;</p>
<button class="accept-btn addhover" data-src="media/audio/Suit_Me.m4a" data-name="Suit Me" data-img="images/artistimages/wingsuits.jpg" onclick="playMedia(this.getAttribute('data-src'), this.getAttribute('data-img'), this.getAttribute('data-name'));">Spill Suit Me av Wingsuits</button>

<p>&nbsp;</p>
<p>&nbsp;</p>
<h2>Ivrig musikkelsker? Send søknad!</h2>
<p>Vi har gjort det enkelt for deg og venner å søke. Bare fyll ut skjemaet <a href="about/join.php">her</a>.</p>
<p>&nbsp;</p>
<p>&nbsp;</p>


<?php /****************TEMPLATE****************/
include $to_dir.'templateend.php';
/****************TEMPLATE****************/ ?>