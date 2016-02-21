<!--

FILE NAME: Project/about/sitemap.php

WRITTEN BY: Stian Sørli

WHEN: 16. Oktober 2015

PURPOSE: Homepage which displays content from calendar, articles and discover.

-->

<?php /****************TEMPLATE****************/
$arr = preg_split('/(prosjekt|Project|dreamteam2015)\\\\/', preg_replace('/\//', '\\', __DIR__));
$from_dir = ''; $to_dir = ''; $filename = basename(__FILE__); if (count($arr) > 1) {
    $from_dir = trim($arr[1], '/').'/'; $to_dir = preg_replace('/[^\/]+/', '..', $from_dir);
} include $to_dir.'templatestart.php';
/****************TEMPLATE****************/ ?>

<title>Nabostøy | Sidekart</title>

<?php /****************TEMPLATE****************/
include $to_dir.'templatemiddle.php';
/****************TEMPLATE****************/ ?>

<h1>Sidekart</h1>

<div class="sitemap-elem">
	<h4 class="addhover animate-color">Artikler</h4>
	<p class="content">
		Her kan du finne artikler publisert av Nabostøy. Det kommer nye artikler hver uke.
		<a class="addhover animate-color btn" href="../articles.php">Artikler</a>
		<a class="addhover animate-color btn" href="../articles/archive.php">Arkiv</a>
	</p>
</div>

<div class="sitemap-elem">
	<h4 class="addhover animate-color">Oppdag</h4>
	<p class="content">Her kan brukere oppdage ny musikk og gjøre horisonten sin bredere. Tilgjengelig både for de som ikke gjør annet enn å høre på musikk og søndagslystnere.<br>
		I tillegg legges artiklene "Ukas artist" opp her, artikler som viser frem og anbefaler artister direkte til leseren
		<a class="addhover animate-color btn" href="../discover.php">Oppdag</a>
		<a class="addhover animate-color btn" href="../discover/artist.php">Ukas Artist</a>
	</p>
</div>


<div class="sitemap-elem">
	<h4 class="addhover animate-color">Om oss</h4>
	<p class="content">
		Denne siden inneholder informasjon om Nabostøy i tillegg til et søknadsskjema for de interesserte. Du vil også finne denne siden som en underside.
		<a class="addhover animate-color btn" href="../about.php">Om oss</a>
		<a class="addhover animate-color btn" href="../about/join.php">Søknad</a>
		<a class="addhover animate-color btn" href="../about/sitemap.php">Sidekart</a>
	</p>
</div>

<div class="sitemap-elem">
	<h4 class="addhover animate-color">Kalender</h4>
	<p class="content">Her vil du finne en kalender som viser en oversikt over kommende hendelser. Nabostøy annonserer både sine egne arrangementer og større musikalske begivenheter i Trondheim og omegn. Følg med!
		<a class="addhover animate-color btn" href="../calendar.php">Kalender</a>
	</p>
</div>

<?php /****************TEMPLATE****************/
include $to_dir.'templateend.php';
/****************TEMPLATE****************/ ?>