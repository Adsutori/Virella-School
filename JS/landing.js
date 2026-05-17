// ===== ZMIENNE GLOBALNE =====
var aktualnySlajd = 0;         // numer aktualnie pokazanego slajdu
var liczbaSlajdow = 0;         // ile slajdow jest w sumie
var timerSlider = null;        // timer slidera - zeby moc go zatrzymac
var aktualnaOpinia = 0;        // ktora opinia jest teraz pokazana
var licznikUruchomiony = false; // flaga zeby liczniki nie odpaly sie dwa razy


// ===== START =====
window.onload = function() {
    inicjalizujNav(); // z script.js
    inicjalizujStroneGlowna();
};


// ===== STRONA GLOWNA =====

function inicjalizujStroneGlowna() {
    uruchomTyping();     // efekt pisania tekstu w hero
    inicjalizujSlider(); // slider ze zdjeciami
    uruchomLiczniki();   // animowane liczniki statystyk

    // auto-zmiana opinii co 6 sekund
    // modulo (%) sprawia ze po ostatniej wraca do pierwszej
    setInterval(function() {
        aktualnaOpinia = (aktualnaOpinia + 1) % 3;
        pokazOpinie(aktualnaOpinia);
    }, 6000);

    // pokazujemy karty ktore sa domyslnie ukryte przez CSS (opacity:0)
    var ukryte = document.querySelectorAll(".animate-on-scroll, .feature-card, .lang-card");
    for (var i = 0; i < ukryte.length; i++) {
        ukryte[i].classList.add("visible");
    }
}


// ===== EFEKT PISANIA (TYPING) =====

function uruchomTyping() {
    var el = document.getElementById("typingText");
    if (!el) return;

    var teksty = [
        "Where Excellence Meets Language",
        "Nauka języków na najwyższym poziomie",
        "Twoje dziecko, nasza pasja"
    ];

    var ti    = 0;    // indeks aktualnego tekstu
    var li    = 0;    // indeks aktualnej litery
    var pisze = true; // true = piszemy, false = kasujemy

    function krok() {
        var t = teksty[ti];
        if (pisze) {
            el.textContent = t.substring(0, ++li);
            if (li >= t.length) { pisze = false; setTimeout(krok, 2200); return; }
            setTimeout(krok, 75); // co 75ms nowa litera
        } else {
            el.textContent = t.substring(0, --li);
            if (li <= 0) {
                pisze = true;
                ti = (ti + 1) % teksty.length; // modulo - wraca do 0 po ostatnim
                setTimeout(krok, 400);
                return;
            }
            setTimeout(krok, 40); // kasowanie szybsze niz pisanie
        }
    }
    setTimeout(krok, 1200); // opoznienie na start
}


// ===== SLIDER =====

function inicjalizujSlider() {
    var slajdy = document.querySelectorAll(".slide");
    var dotsEl = document.getElementById("sliderDots");
    if (!slajdy || slajdy.length === 0) return;

    liczbaSlajdow = slajdy.length;

    // tworzymy kropki nawigacyjne - jedna na kazdy slajd
    if (dotsEl) {
        for (var i = 0; i < liczbaSlajdow; i++) {
            var d = document.createElement("button");
            d.className = "slider-dot";
            // IIFE zeby zmienna i miala dobra wartosc w kazdym listenerze
            d.addEventListener("click", (function(n) {
                return function() { pokazSlajd(n); };
            })(i));
            dotsEl.appendChild(d);
        }
    }

    pokazSlajd(0); // pokazujemy pierwszy slajd

    // przyciski prev i next
    var prev = document.getElementById("sliderPrev");
    var next = document.getElementById("sliderNext");
    if (prev) prev.addEventListener("click", function() {
        pokazSlajd((aktualnySlajd - 1 + liczbaSlajdow) % liczbaSlajdow);
    });
    if (next) next.addEventListener("click", function() {
        pokazSlajd((aktualnySlajd + 1) % liczbaSlajdow);
    });

    // auto-przewijanie co 5 sekund
    timerSlider = setInterval(function() {
        pokazSlajd((aktualnySlajd + 1) % liczbaSlajdow);
    }, 5000);

    // zatrzymaj na hover, wznow po opuszczeniu
    var wrapper = document.querySelector(".slider-wrapper");
    if (wrapper) {
        wrapper.addEventListener("mouseenter", function() { clearInterval(timerSlider); });
        wrapper.addEventListener("mouseleave", function() {
            timerSlider = setInterval(function() {
                pokazSlajd((aktualnySlajd + 1) % liczbaSlajdow);
            }, 5000);
        });
    }
}

function pokazSlajd(n) {
    var slajdy = document.querySelectorAll(".slide");
    var doty   = document.querySelectorAll(".slider-dot");
    // usun active ze wszystkich, potem dodaj do wybranego
    for (var i = 0; i < slajdy.length; i++) slajdy[i].classList.remove("active");
    for (var j = 0; j < doty.length; j++)   doty[j].classList.remove("active");
    aktualnySlajd = n;
    slajdy[n].classList.add("active");
    if (doty[n]) doty[n].classList.add("active");
}


// ===== OPINIE =====

// globalna bo wywolywana tez przez onclick w HTML
function pokazOpinie(n) {
    var opinie = document.querySelectorAll(".testimonial");
    var doty   = document.querySelectorAll(".testimonial-dot");
    if (!opinie.length) return;
    for (var i = 0; i < opinie.length; i++) opinie[i].classList.remove("active");
    for (var j = 0; j < doty.length; j++)   doty[j].classList.remove("active");
    aktualnaOpinia = n;
    if (opinie[n]) opinie[n].classList.add("active");
    if (doty[n])   doty[n].classList.add("active");
}


// ===== LICZNIKI STATYSTYK =====

function uruchomLiczniki() {
    if (licznikUruchomiony) return; // nie odpala sie dwa razy
    licznikUruchomiony = true;

    // tablica z danymi dla kazdego licznika
    var dane = [
        { id: "stat-uczniowie",   cel: 520, s: "+" },
        { id: "stat-lata",        cel: 12,  s: ""  },
        { id: "stat-jezyki",      cel: 5,   s: ""  },
        { id: "stat-certyfikaty", cel: 890, s: "+" }
    ];

    for (var i = 0; i < dane.length; i++) {
        // IIFE zeby kazdy licznik mial swoje wlasne zmienne v i t
        (function(d) {
            var el = document.getElementById(d.id);
            if (!el) return;
            var v    = 0;
            var krok = Math.ceil(d.cel / 80); // 80 krokow = ok 2 sekundy
            var t = setInterval(function() {
                v += krok;
                if (v >= d.cel) { v = d.cel; clearInterval(t); }
                el.textContent = v + d.s;
            }, 25);
        })(dane[i]);
    }
}