<!--

FILE NAME: Project/articles.php

WRITTEN BY: Siddise Hirpa

WHEN: 16. Oktober 2015

PURPOSE: This page displays the latest articles from Nabostøy.

-->

<?php /****************TEMPLATE****************/
$arr = preg_split('/(prosjekt|Project|dreamteam2015)\\\\/', preg_replace('/\//', '\\', __DIR__));
$from_dir = ''; $to_dir = ''; $filename = basename(__FILE__); if (count($arr) > 1) {
    $from_dir = trim($arr[1], '/').'/'; $to_dir = preg_replace('/[^\/]+/', '..', $from_dir);
} include $to_dir.'templatestart.php';
/****************TEMPLATE****************/ ?>


<title>Nabostøy | Artikler</title>


<?php /****************TEMPLATE****************/
include $to_dir.'templatemiddle.php';
/****************TEMPLATE****************/ ?>


<h1>Artikler</h1>

<!-- left side of page -->

<div id="articleleft">
    
    <div class="boxed">
        <p> Ikke gå glipp av en av de eneste hendelsene i musikk-Trondheim.
        Følg med her for de ferskeste nyhetene. Alltid.</p>
    </div><br>
    
    <div class="boxed">
        <a href="articles/archive.php?a=1"><img src="images/articleimages/gitar.jpg" alt="Noen som spiller gitar"></a>
        <h4>Hvilken gitar passer deg best?</h4>
        <p>Stor test av kjente gitarmerker viser forbløffende resultater <a href="articles/archive.php?a=1"> les mer </a></p>
    </div>
    
    <div class="boxed">
        <a href="articles/archive.php?a=5"><img src="images/articleimages/salat.jpg" alt="Ei dame med mat"></a>
        <h4>Kan salat hjelpe med musikksmaken til Beliebers???</h4>
        <p> Studenter ved NTNU har viet sin masteroppgave til å finne ut om det er noen flere fordeler til å spise salat daglig. <a href="articles/archive.php?a=5"> les mer </a></p>
    </div>
</div>

<!-- right side of page -->

<div id="articleright">
    
    <div class="boxed">
        <h2 style="text-align:right;"><a href="articles/archive.php" style="font-size:1em" class="addhover btn">Arkiv<img src="buttons/right.svg" alt="Pil til høyre" class="arrow"/></a></h2>
    </div>
    
    <div class="boxed">
        <a href="articles/archive.php?a=2"><img src="images/artistimages/wingsuits.jpg" alt="Bandet Wingsuits"></a>
        <h4>Wingsuits kommer ut med ny singel!</h4>
        <p>Det nylig oppstartede bandet i Trondheim, Wingsuits, kommer ut med sin første singel <a href="articles/archive.php?a=2"> les mer </a></p>
    </div>
    
    <div class="boxed">
        <a href="articles/archive.php?a=6"><img src="images/articleimages/kanye.jpg" alt="Kanye West på en scene"></a>
        <h4>Stor konsert i Trondheim!</h4>
        <p>Etter lange forhandlinger kan Trondheim endelig få Kanye West på scenen. <a href="articles/archive.php?a=6"> les mer </a></p>
    </div>
    
</div>


<?php /****************TEMPLATE****************/
include $to_dir.'templateend.php';
/****************TEMPLATE****************/ ?>