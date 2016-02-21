<?php
/*

FILE NAME: Project/templatestart.php

WRITTEN BY: Niklas Molnes Hole

WHEN: 25. November 2015

PURPOSE: The start of template where the css, icon and the main scripts for running this site is initialized. Why it is splitted into three pieced is because the user should be able to place more scripts in the head tag and content inside body.

*/

if ($to_dir == NULL) { $to_dir = ""; } ?>
<!DOCTYPE html>
<html lang="no">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
        <meta name="Nabostøy - The Official Website" content="notranslate" />
        <meta name="description" content="Besøk nettsiden Nabostøy om du vil oppdage ny musikk eller bli med i NTNU sin musikkgruppe!" />
        <meta name="keywords" content="Music, Genres, Artists, Groups, IT2805, Webtek, Mobilefriendly, NTNU">
        <!-- FB-metatags -->
        <meta property="og:title" content="Nabostøy - The Official Website!">
        <meta property="og:type" content="article">
        <meta property="og:site_name" content="Nabostøy">
        <meta property="og:image" content="<?=$to_dir;?>images/icon.png">
        <meta property="og:description" content="Besøk nettsiden Nabostøy om du vil oppdage ny musikk eller bli med i NTNU sin musikkgruppe!">
        
        <link rel="icon" href="<?=$to_dir;?>images/icon.png">
        <link rel="apple-touch-icon" href="<?=$to_dir;?>images/icon.png">
        <link rel="stylesheet" href="<?=$to_dir;?>main.css">
        <script src="<?=$to_dir;?>scripts.js"></script>
        <script src="<?=$to_dir;?>js/touchfix.js"></script>
        <script src="<?=$to_dir;?>js/play_media.js"></script>