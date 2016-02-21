<!--

FILE NAME: Project/about.php

WRITTEN BY: Niklas Molnes Hole

WHEN: 16. Oktober 2015

PURPOSE: This page displays information about Nabostøy.

-->

<?php /****************TEMPLATE****************/
$arr = preg_split('/(prosjekt|Project|dreamteam2015)\\\\/', preg_replace('/\//', '\\', __DIR__));
$from_dir = ''; $to_dir = ''; $filename = basename(__FILE__); if (count($arr) > 1) {
    $from_dir = trim($arr[1], '/').'/'; $to_dir = preg_replace('/[^\/]+/', '..', $from_dir);
} include $to_dir.'templatestart.php';
/****************TEMPLATE****************/ ?>


<script src="js/img_ui.js"></script>
<title>Nabostøy | Om oss</title>


<?php /****************TEMPLATE****************/
include $to_dir.'templatemiddle.php';
/****************TEMPLATE****************/ ?>

<h1>Om oss</h1>

<div id="info">
    <div class="boxed">
        <p>Nabostøy er en studentorganisasjon med hjerte i Trondheim og hjerte for musikk. Vi ønsker å spre lykke og musikk til ethvert hjørne, både på campus og i byen, og alle som ønsker er hjertelig velkommen blant oss. Vi vet at av alle språk er musikkens internasjonale symfoni det beste, så vi vil samle alle musikkelskere ett sted for å dele vårt engasjement og våre lydbølger.</p>
    </div>

    <div class="boxed">
        <p>Nabostøy ble stiftet våren 2015 av Mozart Salieri, en kvinne med en visjon om å samle alle verdens musikkelskere under en og samme paraply. Til å begynne med var Nabostøy tre medlemmer og en gammel LP-spiller som hadde alt for mye tid før eksamen, men har senere utvidet seg til å ha minst sju medlemmer! Alle med egen walkman.</p>
    </div>

    <div class="boxed">
        <figure>
            <img src="images/medlemmer.jpg" alt="Stolte medlemmer" title="Nabostøy sine stolte medlemmer." class="showoff big flat border">
        </figure>
    </div>

    <div class="boxed">
        <p><a href="about/sitemap.php">Sidekart</a> over Nabostøy</p>
    </div>
    <br>
</div>

<div id="joinInfo">
    <div class="boxed">
        <h2>Interessert?</h2>
        <p>Dersom du føler at Nabostøy er en organisasjon for deg kan du klikke <a href="about/join.php">her</a> og fylle inn søknadsskjemaet. Om du er nysgjerrig kan du møte opp på <em>P15</em> under en samling for å bli bedre kjent med oss.
            <br><br>
            Tlf: 123 45 678
        </p>
        <iframe id="mazemap" src="http://use.mazemap.com/embed.html?v=1&amp;campusid=1&amp;left=10.4041&amp;right=10.4074&amp;top=63.4184&amp;bottom=63.4177&amp;zlevel=3&amp;sharepoitype=point&amp;sharepoi=10.40585%2C63.41808%2C3&amp;sharepoiname=P15"></iframe>
        <small><a href="http://www.mazemap.com/">Map by MazeMap</a></small>
    </div>
</div>

<?php /****************TEMPLATE****************/
include $to_dir.'templateend.php';
/****************TEMPLATE****************/ ?>