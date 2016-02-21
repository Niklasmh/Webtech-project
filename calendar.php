<!--

FILE NAME: Project/calendar.php

WRITTEN BY: Ellen Bakksjø

WHEN: 25. Oktober 2015

PURPOSE: Calendar page

-->

<?php /****************TEMPLATE****************/
$arr = preg_split('/(prosjekt|Project|dreamteam2015)\\\\/', preg_replace('/\//', '\\', __DIR__));
$from_dir = ''; $to_dir = ''; $filename = basename(__FILE__); if (count($arr) > 1) {
        $from_dir = trim($arr[1], '/').'/'; $to_dir = preg_replace('/[^\/]+/', '..', $from_dir);
} include $to_dir.'templatestart.php';
/****************TEMPLATE****************/ ?>


<script src="js/calendar_generator.js"></script>
<title>Nabostøy | Kalender</title>


<?php /****************TEMPLATE****************/
include $to_dir.'templatemiddle.php';
/****************TEMPLATE****************/ ?>


<h1>Kalender</h1>

<div id="kropp">
    <header>
        <button id="left-btn" class="addhover"><img src="buttons/left.svg" alt="Venstre"></button>
        <h2 id="month-year">oktober 2015</h2>
        <button id="right-btn" class="addhover"><img src="buttons/right.svg" alt="Høyre"></button>
    </header>
<table id="calendar">
    <!-- Dette innholdet vil vises om JavaScript ikke er aktivert i nettleseren -->
    <noscript>
		<table>
			<tr>
				<td>Mandag</td>
				<td>Tirsdag</td>
				<td>Onsdag</td>
				<td>Torsdag</td>
				<td>Fredag</td>
				<td>Lørdag</td>
				<td>Søndag</td>
			</tr>
			<tr>
				<td class="addhover"></td>
				<td class="addhover"></td>
				<td class="addhover">1</td>
				<td class="addhover">2</td>
				<td class="addhover">3</td>
				<td class="addhover">4</td>
				<td class="addhover">5</td>
			</tr>
			<tr>
				<td class="addhover">6</td>
				<td class="addhover">7</td>
				<td class="addhover">8</td>
				<td class="addhover">9</td>
				<td class="addhover">10</td>
				<td class="addhover">11</td>
				<td class="addhover">12</td>
			</tr>
			<tr>
				<td class="addhover">13</td>
				<td class="addhover">14</td>
				<td class="addhover">15</td>
				<td class="addhover">16</td>
				<td class="addhover">17</td>
				<td class="addhover">18</td>
				<td class="addhover">19</td>
			</tr>
			<tr>
				<td class="addhover">20</td>
				<td class="addhover">21</td>
				<td class="addhover">22</td>
				<td class="addhover">23</td>
				<td class="addhover">24</td>
				<td class="addhover">25</td>
				<td class="addhover">26</td>
			</tr>
			<tr>
				<td class="addhover">27</td>
				<td class="addhover">28</td>
				<td class="addhover">29</td>
				<td class="addhover">30</td>
				<td class="addhover">31</td>
				<td class="addhover"></td>
				<td class="addhover"></td>
			</tr>
		</table>
    </noscript>
</table>
	<button id="left-bottom-btn" class="addhover"><img src="buttons/left.svg" alt="Venstre"></button>
	<button id="right-bottom-btn" class="addhover"><img src="buttons/right.svg" alt="Høyre"></button>
</div>

<?php /****************TEMPLATE****************/
include $to_dir.'templateend.php';
/****************TEMPLATE****************/ ?>