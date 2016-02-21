<?php
/*

FILE NAME: Project/templateend.php

WRITTEN BY: Niklas Molnes Hole

WHEN: 25. November 2015

PURPOSE: End of template. Should contain footer, to-top button and a subscribe form. It should also be possible to access our beautiful fb-page from this footer.

*/

if ($to_dir == NULL) { $to_dir = ""; }

$subscribed = false;

if (isset($_POST['type']) && $_POST['type'] === 'subscribe') {
    if (isset($_POST['mail'])) {
        $subscribed = true;
        // Her bør det gjøres noe fancy som å lagre mailen i en database
        
        mail($_POST['mail'], "Du abonnerer nå på Nabostøy!", "Du abonnerer nå på daglige artikler ifra Nabostøy. Bare send \"stopp\" som svar på denne mailen for å melde deg av. Takk :)", "Content-type:text/html;charset=UTF-8\r\nFrom: welcome@nabostoy.com\r\nCC: web@nabostoy.com");
    }
}

?>
				</div>
            </div>
            
            <footer id="foot">
                <div class="container">
                    <?php if ($subscribed) { ?>
                    <h5><br>Vi registrerte <?=$_POST['mail']?>.</h5><div class="thanks">Takk for at du abonnerte!</div>
                    <?php } else { ?>
                    <form action="#foot" method="post" id="subscribe" class="form">
                        <table>
                            <tr>
                                <td><input type="email" name="mail" class="animate-color" placeholder="eksempel@hotmail.com"><input type="submit" class="addhover btn-accept" value="Abonnér"></td>
                            </tr>
                        </table>
                        <input type="hidden" name="type" value="subscribe">
                    </form>
                    <?php } ?>
                    <a href="#head" id="totop" class="smooth-scroll addhover"><img src="<?=$to_dir;?>buttons/up.svg" alt="Bilde av pil til toppen" onerror="this.style.display='none'"></a>
                    
                    <p class="share"><a href="https://www.facebook.com/nabostoy/" target="_blank" class="addhover btn fb"><img src="<?=$to_dir;?>buttons/fblogo.svg" alt="Facebook logo" class="logo"/></a>
                        <a href="https://twitter.com/nabostoy" target="_blank" class="addhover btn tw"><img src="<?=$to_dir;?>buttons/twlogo.svg" alt="Twitter logo" class="logo"/></a>
                        <a href="https://github.com/niklasmh/Webtech-project" target="_blank" class="addhover btn gh"><img src="<?=$to_dir;?>buttons/ghlogo.png" alt="Github logo" class="logo"/></a></p>
                    
                    <p class="cc">Copyright Dreamteam 2015</p>
                </div>
            </footer>
        </div>
    </body>
</html>