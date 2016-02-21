/*

FILE NAME: Project/js/form_validator.js

WRITTEN BY: Øyvind Auestad Bjørhus

WHEN: 25. Oktober 2015

PURPOSE: Validate forms and give the user feedback.

*/

// Vi lager et objekt for å holde styr på valideringene.
var formIsValid = false,
    valideringer = {
        'name': {
            maxLength: 40,
            permiss: 'A-Å og mellomrom',
            error: 'Bare bokstaver og mellomrom er tillatt',
            hint: 'Ditt fulle navn uten tegn'
        },
        'email': {
            maxLength: 32, // Kan være lengre, så dette er egentlig feil
            permiss: 'just.an@example',
            error: 'Husk @ og innhold på hver side',
            hint: 'Hele epost-adressen'
        },
        'phone': {
            maxLength: 40,
            permiss: '+ foran så minst 3 tall',
            error: 'Minst 3 tall',
            hint: 'Ingen mellomrom'
        },
        'extra': {
            maxLength: 120,
            permiss: 'a-zøæå0-9 ,.;:-_!#%&@$\*\(\)\[\]\{\}\+\/\\',
            error: 'Feil tegn',
            hint: 'Unngå spesielle tegn'
        }
    };

// Lager en funksjon som kan legge til/fjerne en klasse til en rekke elementer på flere premisser.
// Du kan f.eks. si at du vil at inputboksen skal legge til en 'empty' klasse, men bare om den
// er tom. Da legger du til i add-parameteren når den skal sjekke og hvilken funksjon som skal
// sjekke om elementet er tomt.
// Funksjonen kan også ta inn et element alene eller en array i både el, add og remove. Dette
// gjør funksjonen ekstremt robust.
function addClassToElementWhen(el, c, add, remove, func) {
    
	if (typeof el !== 'undefined' && typeof c !== 'undefined') {
		if (typeof el.length === 'undefined') el = [el];
        
		for (var i = 0; i < el.length;i++) {
            if (typeof add !== 'object') add = [add];
            
            if (add && typeof add === 'object') {
                
                for (var j = 0; j < add.length;j++) {
                    
                    if (typeof func === 'function') {
                        el[i].addEventListener(add[j], function () {
                            if (func(this)) {
                                addClass(this, c);
                            } else {
                                removeClass(this, c);
                            }
                        }, false);
                    } else {
                        el[i].addEventListener(add[j], function () {
                            addClass(this, c);
                        }, false);
                    }
                }
            }
            
            if (typeof remove !== 'object') remove = [remove];
            
            if (remove && typeof remove === 'object') {
                
                for (var j = 0; j < remove.length;j++) {
                    el[i].addEventListener(remove[j], function () {
                        removeClass(this, c);
                    }, false);
                }
            }
		}
	}
}

document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('join-form'),
        elements = form.querySelectorAll('input[type="text"], input[type="tel"], textarea, input[type="email"]'),
        submitBtn = form.querySelector('input[type="submit"]'),
        resetBtn = form.querySelector('input[type="reset"]');
    
    for (var i = 0; i < elements.length; i++) {
        
        // Hvis validerings-attributter er satt i html-dokumentet, henter vi ut dem. Nå er det bare lengden.
        val = elements[i].getAttribute('maxlength');
        if (val) valideringer[elements[i].name].maxLength = val - 1;
        
        if (elements[i].name === 'extra') {
            // Vi vil ha en teller på textarea siden den har så mange tegn
            letterLimiter(form['extra'], valideringer['extra'].maxLength + 1);
        }
        
        // Vi legger til en ekstra meldingsboks på hver av input-elementene
        var msg = document.createElement('div');
        msg.className = 'msg';
        msg.id = 'msg-' + elements[i].name;
        msg.setAttribute('data-error', valideringer[elements[i].name].error);
        msg.setAttribute('data-hint', valideringer[elements[i].name].hint);
        msg.setAttribute('data-permiss', valideringer[elements[i].name].permiss);
        form.insertBefore(msg, elements[i].nextSibling);
        
        // I tilfelle bruker går tilbake i historien
         if (elements[i].value.length > 0) {
             addClass(elements[i], 'dirty');
             
             // Vi vet at alle feltene måtte være validerte fra forrige økt
             addClass(elements[i], 'valid');
         }
    }
    
    if (submitBtn) addClass(submitBtn, 'invalid');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function (e) {
            var elements = document.getElementById('join-form').querySelectorAll('input[type="text"], input[type="tel"], textarea, input[type="email"]');
            for (var i = 0; i < elements.length; i++) {
                addClass(elements[i], 'empty');
                removeClass(elements[i], 'valid');
                removeClass(elements[i], 'dirty');
                removeClass(elements[i], 'max-reached');
            }
            
            elements[0].focus();
        });
    }
    
    // Vi gjør det umulig å submitte ifra knappen for brukeren sin opplevelse.
    // Hackere kan såklart komme seg forbi dette steget.
    form.addEventListener("submit", function(e){
        var elements = document.getElementById('join-form').querySelectorAll('input[type="text"], input[type="tel"], textarea:not(.g-recaptcha-response), input[type="email"]');
        
        if (!isFormValid(elements)) {
            e.preventDefault();
        }
    }, true);
    
    // Legger til en empty-klass om elementer et tomt ved focus eller input
	addClassToElementWhen(elements, 'empty', ['focus', 'input'], undefined, function (elem) {
        updateForm();
        return (elem.value.length === 0); // Blir premisset nådd vil klassen bli lagt til
    });
	
    // Legger til en empty-klass om elementer et tomt ved focus eller input
	addClassToElementWhen(elements, 'max-reached', 'input', undefined, function (elem) {
        updateForm();
        return (elem.value.length > valideringer[elem.name].maxLength);
    });
    
    // Legge til en dirty-klasse på blur. Kombinert med empty kan vi identfisere om brukeren har
    // brukt input-elementet.
	addClassToElementWhen(elements, 'dirty', 'input');
    
    // Her legger vi til en valid-klasse om inputen passerer testen.
    // Dette er ikke den endelige valideringa ettersom hvem som helst utvikler kan
    // overkomme denne sikkerheten. Dette er for brukeropplevelsen.
	addClassToElementWhen(form['name'], 'valid', ['input', 'blur'], undefined, function (elem) {
        updateForm();
        return /^[a-zøæå][a-zøæå\s]+$/gi.test(elem.value);
    });
	addClassToElementWhen(form['email'], 'valid', ['input', 'blur'], undefined, function (elem) {
        updateForm();
        return /^[^@]+@[^@]+$/gi.test(elem.value); // Burde egentlig ikke validere mail, så krever bare @
    });
	addClassToElementWhen(form['phone'], 'valid', ['input', 'blur'], undefined, function (elem) {
        updateForm();
        if (/^\+?[0-9]{3,}$/gi.test(elem.value)) {
            return true;
        } else {
            if (/[^0-9+]/gi.test(elem.value)) {
                var t, tegn = [], re = /([^0-9+])/gi;
                
                while (t = re.exec(elem.value)) tegn.push(t[1]);
                
                elem.nextSibling.setAttribute('data-error', valideringer['phone'].error + '. Du har skrevet følgende tegn feil: ' + tegn.join(', '));
            } else {
                elem.nextSibling.setAttribute('data-error', valideringer['phone'].error);
            }
        }
        
        return false;
    });
	addClassToElementWhen(form['extra'], 'valid', 'input', undefined, function (elem) {
        updateForm();
        if (/^[a-zøæå0-9 ,.;:\-_!#%&@$\*\(\)\[\]\{\}\+\/\\\n\r]+$/gi.test(elem.value)) {
            return true;
        } else {
            
            // Vi viser til brukeren hvilken tegn som ikke passet med inputpermisset
            var t, tegn = [],
                re = /([^a-zøæå0-9 ,.;:\-_!#%&@$\*\(\)\[\]\{\}\+\/\\\n\r])/gi;
            
            while (t = re.exec(elem.value)) tegn.push(t[1]);
            
            elem.nextSibling.setAttribute('data-error', valideringer['extra'].error + '. Fant: ' + tegn.join(', '));
        }
        
        return false;
    });
    
    // Vi sjekker etter hvert sekund etter vanskeligheter med reCAPTCHA-loading
    setInterval(function () {
        updateForm();
    }, 1000);
    
    function updateForm () {
        var submitBtn = document.querySelector('.form input[type="submit"]'),
            valid = isFormValid(elements);
        
        if (valid) {
            removeClass(submitBtn, 'invalid');
        } else {
            addClass(submitBtn, 'invalid');
        }
    }
});

function isFormValid (elements) {
    for (var i = 0; i < elements.length; i++) {
        if (!/(^|\s)valid($|\s)/.test(elements[i].className)) return false;
    }
    
    addClass(document.getElementsByClassName('robot-check')[0], 'valid');
    
    // Vi må sjekke om reCAPTCHA er avkrysset
    if (document.getElementById('g-recaptcha-response')) {
        if (!document.getElementById('g-recaptcha-response').value) return false;
    }
    
    return true;
}

function letterLimiter (formElem, limit) {
    var events = ['input', 'paste', 'focus', 'blur'],
        counter = document.createElement('span');
    
    counter.className = 'counter';
    document.getElementById('join-form').insertBefore(counter, formElem.nextSibling);
    counter.innerHTML = limit;
    
    for (var i = 0; i < events.length; i++) {
        formElem.addEventListener(events[i], function () {
            this.value = this.value.substr(0, limit);
            counter.innerHTML = limit - this.value.length;
        });
    }
}