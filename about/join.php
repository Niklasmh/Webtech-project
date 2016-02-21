<!--

FILE NAME: Project/about/join.php

WRITTEN BY: Niklas Molnes Hole

WHEN: 16. Oktober 2015

PURPOSE: Here you can join Nabostøy with an application. The application provides enough information to the user so he/she alone can apply without sending false data. Our formvalidator will also warn the user about false syntax and return a hint about which characters the user wrote wrong.

Bruker reCAPTCHA for validering. Ressurs: https://www.google.com/recaptcha/
Dette er integrert med php på serveren slik at det blir mer sikkert.

Catch the data send from user and validate the reCAPTCHA.
The reCAPTCHA project layes on GitHub: https://github.com/google/recaptcha.
Some code is also borrowed from that site because it is essential to make it work.

-->

<?php /****************TEMPLATE****************/
$arr = preg_split('/(prosjekt|Project|dreamteam2015)\\\\/', preg_replace('/\//', '\\', __DIR__));
$from_dir = ''; $to_dir = ''; $filename = basename(__FILE__); if (count($arr) > 1) {
    $from_dir = trim($arr[1], '/').'/'; $to_dir = preg_replace('/[^\/]+/', '..', $from_dir);
} include $to_dir.'templatestart.php';
/****************TEMPLATE****************/ ?>

<script src="../js/form_validator.js"></script>
<script src='https://www.google.com/recaptcha/api.js'></script>
<title>Nabostøy | Søknad</title>

<?php /****************TEMPLATE****************/
include $to_dir.'templatemiddle.php';
/****************TEMPLATE****************/

$valid = false;
$msg = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['type']) && $_POST['type'] === 'join') {
    $name = (isset($_REQUEST['name']) ? $_REQUEST['name'] : false);
    $email = (isset($_REQUEST['email']) ? $_REQUEST['email'] : false);
    $tel = (isset($_REQUEST['phone']) ? $_REQUEST['phone'] : false);
    $body = (isset($_REQUEST['extra']) ? $_REQUEST['extra'] : false);
    
    $name = preg_replace('/[^a-zøæå0-9 ]/i', '', $name);
    $tel = preg_replace('/[^+0-9]/', '', $tel);
    $body = preg_replace('/[^a-zøæå0-9 ,.;:-_!#%&@\$\*\(\)\[\]\{\}\+\/\\\n]/i', '', $body);
    
    $passed = ($name && $email && $tel && $body);
    $msg = "Input feilet. Du prøver ikke å hacke, vel?";
    
    if ($passed) {
        $msg = "CAPTCHA feilet..";
        
        if (isset($_POST['g-recaptcha-response'])) {
            $secret = "6LfsjRATAAAAAG3aQAJCYUqQCaUtucb5yBc0cjau";
            require('../api/recaptcha/src/autoload.php');
            $recaptcha = new \ReCaptcha\ReCaptcha($secret, new \ReCaptcha\RequestMethod\CurlPost());
            $resp = $recaptcha->verify($_POST['g-recaptcha-response'], $_SERVER["REMOTE_ADDR"]);
            if ($resp->isSuccess()) {
                $valid = true;
                $our_mail = "nikasmh@hotmail.com";
                
                mail($email, "Søknad til studentorganisasjonen Nabostøy", "Takk for at du har meldt deg på. :)", "Content-type:text/html;charset=UTF-8\r\nFrom: $our_mail\r\nCC: $our_mail");
                
                mail("$our_mail", "Søknad ifra $name", "Mitt telefonnr: $tel,<br>Min begrunnelse: $body", "Content-type:text/html;charset=UTF-8\r\nFrom: $email");
                
                $msg = "Vi har nå sendt en epost som svar på mottatt søknad. Tusen takk!";
            } else {
                $errors = $resp->getErrorCodes();
            }
        }
    }
}
?>

<h1 class="container">S&oslash;knad</h1>
<div id="form">
    <?php if ($msg) { if (!$valid) { echo "<p style='color:#a00;font-size:1.4em'>Kunne ikke sende søknaden, noe gikk galt. <a href='javascript:history.go(-1)'>Gå tilbake</a> og se gjennom formen igjen.</p><p style='color:#a00;'><br>Feilmelding fra vår server: $msg</p>"; } else { echo "<p style='color:#0a0;font-size:1.4em'>$msg</p>"; } }?>
    <div class="boxed">
        <p>Om du ønsker å bli en del av vårt fellesskap kan du fylle inn dette skjemaet. Du vil motta en velkomstepost fra oss og vil være hjertelig velkommen på våre møter og arrangementer. <a href="../about.php">Tilbake</a></p>
		<p>&nbsp;</p>
        <form action="#" class="contact form" id="join-form" method="post">
            <p>Navn</p>
            <input class="animate-color" type="text" name="name" size="14" maxlength="40" placeholder="Mozart Salieri" autofocus required>
            
            <p>Kjønn</p>
            <input id="gender-mann" type="radio" name="gender" value="mann" checked>
            <label for="gender-mann" class="addhover">Mann</label>
            
            <input id="gender-kvinne" type="radio" name="gender" value="kvinne">
            <label for="gender-kvinne" class="addhover">Kvinne</label>
            
            <p>E-post</p>
            <input class="animate-color" type="email" name="email" size="32" maxlength="40" placeholder="mozart@eksempel.no" required>
            
            <p>Kontakttelefon</p>
            <input class="animate-color" type="tel" name="phone" size="14" maxlength="12" placeholder="+4712345678">
            
            <p>Velg studieretning</p>
            <select name="class" class="animate-color" required>
                <option value="" disabled selected>Velg her...</option>
                <option value="BIT">BIT - Bachelor i informatikk</option>
                <option value="BFY">BFY - Bachelor i fysikk</option>
                <option value="BMA">BMA - Bachelor i matematikk</option>
            </select>
            
            <p>Skriv litt om deg selv </p>
            <textarea class="animate-color" name="extra" maxlength="120" placeholder="Skriv dine kommentarer her" required></textarea>
            
            <div class="g-recaptcha robot-check" data-theme="dark" data-sitekey="6LfsjRATAAAAAMIaPMHGnK-78PSr8QgIVjGrWTR0"></div>
            <p>&nbsp;</p>
            <input type="hidden" name="type" value="join">
            <input type="submit" value="Send inn" class="addhover">
            <input type="reset" value="Fjern felter" class="addhover">
        </form>
    </div>
</div>

<?php /****************TEMPLATE****************/
include $to_dir.'templateend.php';
/****************TEMPLATE****************/ ?>