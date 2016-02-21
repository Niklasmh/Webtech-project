<?php
/*

FILE NAME: Project/templatemiddle.php

WRITTEN BY: Niklas Molnes Hole

WHEN: 25. November 2015

PURPOSE: The middle of template where the menu is generated. With php, we mark the links with a class depending on which site we are currently displaying.

*/

if (!isset($to_dir)) { $to_dir = ""; }
if (!isset($from_dir)) { $from_dir = ""; }
if (!isset($filename)) { $filename = ""; } ?>
    </head>
    <body>
        <div id="site">
            <div class="backgroundcover"></div>
            <header id="head">
                <div class="container">
                    <a href="<?=$to_dir;?>./" class="addhover mobile-title">Nabostøy</a>
                    <input id="dropdown" type="checkbox">
                    <label for="dropdown" class="addhover animate-color">Meny</label>
                    <nav class="menu">
                        <table>
                            <tr>
                                <td><a href="<?=$to_dir;?>./" class="addhover<?php if ($from_dir == "" && $filename == "index.php") { echo ' selected'; } ?>">Nabostøy</a></td>
                                <td>
                                    <input id="dropdownArtikler" type="checkbox">
                                    <label for="dropdownArtikler" class="addhover animate-font-color<?php if (preg_match('/^articles/', $from_dir.$filename)) { echo ' selected'; } ?>">Artikler</label>
                                    <ul class="addhover">
                                        <li><a href="<?=$to_dir;?>articles.php" class="addhover<?php if (preg_match('/^articles/', $filename)) { echo ' selected'; } ?>">Artikler</a></li>
                                        <li><a href="<?=$to_dir;?>articles/archive.php" class="addhover<?php if (preg_match('/^archive/', $filename)) { echo ' selected'; } ?>">Arkiv</a></li>
                                    </ul>
                                </td>
                                <td>
                                    <input id="dropdownOppdag" type="checkbox">
                                    <label for="dropdownOppdag" class="addhover animate-font-color<?php if (preg_match('/^discover/', $from_dir.$filename)) { echo ' selected'; } ?>">Oppdag</label>
                                    <ul class="addhover">
                                        <li><a href="<?=$to_dir;?>discover.php" class="addhover<?php if (preg_match('/^discover/', $filename)) { echo ' selected'; } ?>">Oppdag</a></li>
                                        <li><a href="<?=$to_dir;?>discover/artist.php" class="addhover<?php if (preg_match('/^artist/', $filename)) { echo ' selected'; } ?>">Artister</a></li>
                                    </ul>
                                </td>
                                <td>
                                    <input id="dropdownOm" type="checkbox">
                                    <label for="dropdownOm" class="addhover animate-font-color<?php if (preg_match('/^about/', $from_dir.$filename)) { echo ' selected'; } ?>">Om oss</label>
                                    <ul class="addhover">
                                        <li><a href="<?=$to_dir;?>about.php" class="addhover<?php if (preg_match('/^about/', $filename)) { echo ' selected'; } ?>">Om oss</a></li>
                                        <li><a href="<?=$to_dir;?>about/join.php" class="addhover<?php if (preg_match('/^join/', $filename)) { echo ' selected'; } ?>">Søknad</a></li>
                                        <li><a href="<?=$to_dir;?>about/sitemap.php" class="addhover<?php if (preg_match('/^sitemap/', $filename)) { echo ' selected'; } ?>">Sidekart</a></li>
                                    </ul>
                                </td>
                                <td><a href="<?=$to_dir;?>calendar.php" class="addhover<?php if (preg_match('/^calendar/', $from_dir.$filename)) { echo ' selected'; } ?>">Kalender</a></td>
                            </tr>
                        </table>
                    </nav>
                </div>
            </header>
            <div id="main">
                <div class="container<?php $prefix = (empty($from_dir) ? explode('.', $filename) : explode('/', $from_dir) ); echo " ".$prefix[0]."-template";?>">