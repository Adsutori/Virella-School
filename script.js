// =====================================================
// VIRELLA SCHOOL - script.js
// Autor: projekt szkolny INF03
// Opis: glowny plik javascript dla calej strony
// =====================================================


// ===== ZMIENNE GLOBALNE =====

// tutaj trzymam numer aktualnego slajdu
var aktualnySlajd = 0;

// ile jest slajdow w sumie
var liczbaSlajdow = 0;

// timer dla slidera - zeby auto sie przewijal
var timerSlider = null;

// aktualny indeks testimonial (opinie)
var aktualnaOpinia = 0;

// timer dla opinii
var timerOpinii = null;

// tablica ze zdjeciami do lightboxa w galerii
var zdjeciaGalerii = [];

// ktore zdjecie jest teraz w lightboxie
var aktualneZdjecie = 0;

// czy liczniki juz zostaly uruchomione (zeby nie liczyc dwa razy)
var licznikUruchomiony = false;


// ===== INICJALIZACJA PO ZALADOWANIU STRONY =====

// ta funkcja odpala sie gdy strona sie zaladuje
window.onload = function() {

    // inicjalizuj nawigacje (hamburger + scroll)
    inicjalizujNav();

    // sprawdz na ktorej stronie jestesmy i odpowiednie rzeczy uruchom
    var url = window.location.href;

    // strona glowna - index.html
    if (url.indexOf("index.html") !== -1 || url.charAt(url.length - 1) === "/" || url.indexOf("index") === -1 && url.indexOf("kontakt") === -1 && url.indexOf("formularz") === -1 && url.indexOf("galeria") === -1) {
        inicjalizujStroneGlowna();
    }

    // strona kontakt
    if (url.indexOf("kontakt.html") !== -1) {
        inicjalizujKontakt();
    }

    // strona formularz
    if (url.indexOf("formularz.html") !== -1) {
        inicjalizujFormularz();
    }

    // strona galeria
    if (url.indexOf("galeria.html") !== -1) {
        inicjalizujGalerie();
    }

    // smooth scroll dziala na kazdej stronie
    inicjalizujSmoothScroll();

    // animacje przy scrollowaniu tez na kazdej stronie
    inicjalizujAnimacjeScroll();
};


// ===== NAWIGACJA =====

function inicjalizujNav() {
    var navbar = document.getElementById("navbar");
    var hamburger = document.getElementById("hamburger");
    var navLinks = document.getElementById("navLinks");

    // jesli nie ma navbara to konczymy
    if (!navbar) {
        return;
    }

    // efekt sticky - zmiana wygladu po przewineciu
    window.addEventListener("scroll", function() {
        if (window.scrollY > 60) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // hamburger menu dla mobile
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function() {
            // toggle - jesli otwarte to zamknij, jesli zamkniete to otworz
            hamburger.classList.toggle("open");
            navLinks.classList.toggle("open");
        });

        // zamknij menu po kliknieciu w link
        var linki = navLinks.querySelectorAll("a");
        for (var i = 0; i < linki.length; i++) {
            linki[i].addEventListener("click", function() {
                hamburger.classList.remove("open");
                navLinks.classList.remove("open");
            });
        }

        // zamknij menu po kliknieciu poza nim
        document.addEventListener("click", function(e) {
            if (!navbar.contains(e.target)) {
                hamburger.classList.remove("open");
                navLinks.classList.remove("open");
            }
        });
    }
}


// ===== STRONA GLOWNA =====

function inicjalizujStroneGlowna() {
    // uruchom efekt pisania w hero
    uruchomTyping();

    // uruchom slider zdjec
    inicjalizujSlider();

    // uruchom liczniki statystyk
    // liczniki odpala sie przy scrollu do sekcji - patrz inicjalizujAnimacjeScroll

    // przycisk scroll do oferty
    var btnOferta = document.getElementById("scrollOferta");
    if (btnOferta) {
        btnOferta.addEventListener("click", function(e) {
            e.preventDefault();
            var sekcja = document.getElementById("oferta");
            if (sekcja) {
                sekcja.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // auto-zmiana opinii co 6 sekund
    timerOpinii = setInterval(function() {
        aktualnaOpinia++;
        if (aktualnaOpinia > 2) {
            aktualnaOpinia = 0;
        }
        pokazOpinie(aktualnaOpinia);
    }, 6000);
}


// ===== EFEKT PISANIA (TYPING) =====

function uruchomTyping() {
    var element = document.getElementById("typingText");
    if (!element) {
        return;
    }

    // teksty ktore beda sie wyswietlac jeden po drugim
    var teksty = [
        "Where Excellence Meets Language",
        "Nauka jezykow na najwyzszym poziomie",
        "Twoje dziecko, nasza pasja"
    ];

    var aktualnyTekst = 0;   // ktory tekst teraz piszemy
    var aktualnaLitera = 0;  // ktora litera w tekscie
    var czyPiszemy = true;   // true = piszemy, false = kasujemy

    // ta funkcja wywoluje sie co jakis czas i dodaje/usuwa litery
    function krokTyping() {
        var tekst = teksty[aktualnyTekst];

        if (czyPiszemy) {
            // dodajemy kolejna litere
            aktualnaLitera++;
            element.textContent = tekst.substring(0, aktualnaLitera);

            if (aktualnaLitera >= tekst.length) {
                // napisalismy caly tekst - czekamy chwile potem kasujemy
                czyPiszemy = false;
                setTimeout(krokTyping, 2200);
                return;
            }
            // szybkosc pisania - co 75ms nowa litera
            setTimeout(krokTyping, 75);

        } else {
            // kasujemy litery
            aktualnaLitera--;
            element.textContent = tekst.substring(0, aktualnaLitera);

            if (aktualnaLitera <= 0) {
                // skasowalismy wszystko - przechodzimy do nastepnego tekstu
                czyPiszemy = true;
                aktualnyTekst++;
                if (aktualnyTekst >= teksty.length) {
                    aktualnyTekst = 0; // zacznij od poczatku
                }
                setTimeout(krokTyping, 400);
                return;
            }
            // szybkosc kasowania - troche szybciej niz pisanie
            setTimeout(krokTyping, 40);
        }
    }

    // odpalamy z opoznieniem zeby hero sie najpierw zaladowal
    setTimeout(krokTyping, 1200);
}


// ===== SLIDER ZDJEC =====

function inicjalizujSlider() {
    var slajdy = document.querySelectorAll(".slide");
    var kontenerDotow = document.getElementById("sliderDots");
    var btnPrev = document.getElementById("sliderPrev");
    var btnNext = document.getElementById("sliderNext");

    if (!slajdy || slajdy.length === 0) {
        return; // nie ma slidera na tej stronie
    }

    liczbaSlajdow = slajdy.length;

    // tworzymy kropki (dots) dla kazdego slajdu
    if (kontenerDotow) {
        for (var i = 0; i < liczbaSlajdow; i++) {
            var dot = document.createElement("button");
            dot.className = "slider-dot";
            dot.setAttribute("aria-label", "Slajd " + (i + 1));

            // musimy uzyc funkcji zeby i bylo dobrze przechwycone w petli
            dot.addEventListener("click", stworzKlikniecieSlajdu(i));

            kontenerDotow.appendChild(dot);
        }
    }

    // pokazujemy pierwszy slajd
    pokazSlajd(0);

    // przyciski prev/next
    if (btnPrev) {
        btnPrev.addEventListener("click", function() {
            poprzedniSlajd();
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", function() {
            nastepnySlajd();
        });
    }

    // auto-przewijanie co 5 sekund
    timerSlider = setInterval(function() {
        nastepnySlajd();
    }, 5000);

    // zatrzymaj auto gdy uzytkownik najedzie myszka
    var wrapper = document.querySelector(".slider-wrapper");
    if (wrapper) {
        wrapper.addEventListener("mouseenter", function() {
            clearInterval(timerSlider);
        });
        wrapper.addEventListener("mouseleave", function() {
            timerSlider = setInterval(function() {
                nastepnySlajd();
            }, 5000);
        });
    }
}

// pomocnicza funkcja - tworzy handler klikniecia dla kropki
// potrzebne bo inaczej i w petli byloby zawsze ostatnia wartosc
function stworzKlikniecieSlajdu(indeks) {
    return function() {
        pokazSlajd(indeks);
    };
}

function pokazSlajd(numer) {
    var slajdy = document.querySelectorAll(".slide");
    var doty = document.querySelectorAll(".slider-dot");

    if (!slajdy || slajdy.length === 0) {
        return;
    }

    // ukryj wszystkie slajdy
    for (var i = 0; i < slajdy.length; i++) {
        slajdy[i].classList.remove("active");
    }

    // ukryj wszystkie doty
    for (var j = 0; j < doty.length; j++) {
        doty[j].classList.remove("active");
    }

    // pokaz wybrany slajd
    aktualnySlajd = numer;
    slajdy[aktualnySlajd].classList.add("active");

    // pokaz odpowiedni dot
    if (doty[aktualnySlajd]) {
        doty[aktualnySlajd].classList.add("active");
    }
}

function nastepnySlajd() {
    var nowy = aktualnySlajd + 1;
    if (nowy >= liczbaSlajdow) {
        nowy = 0; // wracamy na poczatek
    }
    pokazSlajd(nowy);
}

function poprzedniSlajd() {
    var nowy = aktualnySlajd - 1;
    if (nowy < 0) {
        nowy = liczbaSlajdow - 1; // idziemy na koniec
    }
    pokazSlajd(nowy);
}


// ===== OPINIE (TESTIMONIALS) =====

// ta funkcja jest tez wywolywana z onclick w HTML wiec musi byc globalna
function pokazOpinie(numer) {
    var opinie = document.querySelectorAll(".testimonial");
    var doty = document.querySelectorAll(".testimonial-dot");

    if (!opinie || opinie.length === 0) {
        return;
    }

    // ukryj wszystkie opinie
    for (var i = 0; i < opinie.length; i++) {
        opinie[i].classList.remove("active");
    }

    // ukryj wszystkie doty
    for (var j = 0; j < doty.length; j++) {
        doty[j].classList.remove("active");
    }

    // zaktualizuj zmienna globalna
    aktualnaOpinia = numer;

    // pokaz wybrana opinie i dot
    if (opinie[aktualnaOpinia]) {
        opinie[aktualnaOpinia].classList.add("active");
    }
    if (doty[aktualnaOpinia]) {
        doty[aktualnaOpinia].classList.add("active");
    }
}


// ===== LICZNIKI STATYSTYK =====

function uruchomLiczniki() {
    // jesli juz uruchomione to nie robimy tego drugi raz
    if (licznikUruchomiony) {
        return;
    }
    licznikUruchomiony = true;

    // dane dla kazdego licznika: id elementu, wartosc docelowa, suffix
    var liczniki = [
        { id: "stat-uczniowie", cel: 520,  suffix: "+" },
        { id: "stat-lata",      cel: 12,   suffix: "" },
        { id: "stat-jezyki",    cel: 5,    suffix: "" },
        { id: "stat-certyfikaty", cel: 890, suffix: "+" }
    ];

    // dla kazdego licznika uruchamiamy animacje
    for (var i = 0; i < liczniki.length; i++) {
        animujLicznik(liczniki[i]);
    }
}

// animuje jeden licznik od 0 do wartosci docelowej
function animujLicznik(dane) {
    var element = document.getElementById(dane.id);
    if (!element) {
        return; // nie ma takiego elementu
    }

    var aktualnaWartosc = 0;
    var cel = dane.cel;
    var suffix = dane.suffix;

    // obliczamy o ile zwiekszac w kazdym kroku
    // chcemy zeby animacja trwala okolo 2 sekund
    // setInterval co 20ms = 100 krokow = 2 sekundy
    var krok = Math.ceil(cel / 80);

    var timer = setInterval(function() {
        aktualnaWartosc += krok;

        if (aktualnaWartosc >= cel) {
            aktualnaWartosc = cel; // nie przekraczamy wartosci docelowej
            clearInterval(timer); // zatrzymujemy timer
        }

        element.textContent = aktualnaWartosc + suffix;
    }, 25);
}


// ===== SMOOTH SCROLL =====

function inicjalizujSmoothScroll() {
    // wszystkie linki ktore zaczynaja sie od #
    var linki = document.querySelectorAll('a[href^="#"]');

    for (var i = 0; i < linki.length; i++) {
        linki[i].addEventListener("click", function(e) {
            var href = this.getAttribute("href");

            // pomijamy puste linki
            if (href === "#" || href === "") {
                return;
            }

            var cel = document.querySelector(href);
            if (cel) {
                e.preventDefault();
                cel.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }
}


// ===== ANIMACJE PRZY SCROLLOWANIU =====

function inicjalizujAnimacjeScroll() {
    // IntersectionObserver obserwuje elementy i dodaje klase gdy sa widoczne
    // sprawdzamy czy przegladarka to obsluguje
    if (!window.IntersectionObserver) {
        // stara przegladarka - po prostu pokaz wszystko
        var elementy = document.querySelectorAll(".animate-on-scroll, .feature-card, .lang-card");
        for (var i = 0; i < elementy.length; i++) {
            elementy[i].classList.add("visible");
        }
        uruchomLiczniki();
        return;
    }

    var observer = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // juz nie obserwuj tego elementu
            }
        }
    }, {
        threshold: 0.15, // element musi byc widoczny w 15%
        rootMargin: "0px 0px -50px 0px"
    });

    // obserwuj elementy z animacja
    var elementy = document.querySelectorAll(".animate-on-scroll, .feature-card, .lang-card");
    for (var j = 0; j < elementy.length; j++) {
        observer.observe(elementy[j]);
    }

    // osobny observer dla licznikow statystyk
    var sekcjaStatystyk = document.getElementById("statystyki");
    if (sekcjaStatystyk) {
        var observerStat = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                uruchomLiczniki();
                observerStat.disconnect(); // juz nie potrzebujemy
            }
        }, { threshold: 0.3 });

        observerStat.observe(sekcjaStatystyk);
    }
}


// ===== STRONA KONTAKT =====

function inicjalizujKontakt() {
    // sprawdz czy szkola jest teraz otwarta
    sprawdzGodzinyOtwarcia();

    // podswietl dzisiejszy dzien w tabeli godzin
    podswietlDzisiaj();

    // odswiezaj czas co minute
    setInterval(function() {
        sprawdzGodzinyOtwarcia();
    }, 60000);
}

function sprawdzGodzinyOtwarcia() {
    var teraz = new Date();
    var dzien = teraz.getDay();    // 0=niedziela, 1=poniedzialek, ..., 6=sobota
    var godzina = teraz.getHours();
    var minuty = teraz.getMinutes();

    // godziny otwarcia dla kazdego dnia
    // format: [otwarcie_h, zamkniecie_h] lub null jesli zamkniete
    var godzinyOtwarcia = {
        0: null,          // niedziela - zamkniete
        1: [8, 20],       // poniedzialek
        2: [8, 20],       // wtorek
        3: [8, 20],       // sroda
        4: [8, 20],       // czwartek
        5: [8, 20],       // piatek
        6: [9, 15]        // sobota
    };

    var banner = document.getElementById("openStatusBanner");
    var statusIcon = document.getElementById("statusIcon");
    var statusTitle = document.getElementById("statusTitle");
    var statusDesc = document.getElementById("statusDesc");
    var statusTime = document.getElementById("statusTime");

    if (!banner) {
        return;
    }

    // formatujemy aktualny czas do wyswietlenia
    var godzinaStr = godzina < 10 ? "0" + godzina : "" + godzina;
    var minutyStr = minuty < 10 ? "0" + minuty : "" + minuty;
    var czasTeraz = godzinaStr + ":" + minutyStr;

    if (statusTime) {
        statusTime.textContent = czasTeraz;
    }

    var dzisiajGodziny = godzinyOtwarcia[dzien];
    var czyOtwarte = false;

    if (dzisiajGodziny !== null) {
        // sprawdzamy czy jestesmy w godzinach otwarcia
        var godzinaDecymalna = godzina + minuty / 60;
        if (godzinaDecymalna >= dzisiajGodziny[0] && godzinaDecymalna < dzisiajGodziny[1]) {
            czyOtwarte = true;
        }
    }

    if (czyOtwarte) {
        // szkola jest otwarta
        statusIcon.className = "status-icon status-open";
        statusIcon.innerHTML = '<i class="fas fa-door-open"></i>';
        statusTitle.textContent = "Teraz otwarte";
        statusDesc.textContent = "Zapraszamy! Zamykamy o " + dzisiajGodziny[1] + ":00";
        banner.style.borderLeftColor = "#16a34a";
    } else {
        // szkola jest zamknieta
        statusIcon.className = "status-icon status-closed";
        statusIcon.innerHTML = '<i class="fas fa-door-closed"></i>';

        if (dzisiajGodziny === null) {
            statusTitle.textContent = "Dzisiaj zamkniete";
            statusDesc.textContent = "Niedziela — dzien wolny. Zapraszamy w poniedzialek od 8:00.";
        } else if (godzina < dzisiajGodziny[0]) {
            statusTitle.textContent = "Jeszcze zamkniete";
            statusDesc.textContent = "Otwarcie dzisiaj o " + dzisiajGodziny[0] + ":00";
        } else {
            statusTitle.textContent = "Juz zamkniete";
            statusDesc.textContent = "Otwarcie jutro o 8:00";
        }
        banner.style.borderLeftColor = "#dc2626";
    }
}

function podswietlDzisiaj() {
    var teraz = new Date();
    var dzisiaj = teraz.getDay(); // 0-6

    // szukamy wiersza z dzisiejszym dniem
    var wiersze = document.querySelectorAll(".hours-row");
    for (var i = 0; i < wiersze.length; i++) {
        var dayAttr = parseInt(wiersze[i].getAttribute("data-day"));
        if (dayAttr === dzisiaj) {
            wiersze[i].classList.add("today");
        }
    }
}


// ===== STRONA FORMULARZ =====

function inicjalizujFormularz() {
    var form = document.getElementById("zapiszForm");
    if (!form) {
        return;
    }

    // sprawdz czy sa zapisane dane w localStorage
    wczytajZapisaneDane();

    // zdarzenie submit formularza
    form.addEventListener("submit", function(e) {
        e.preventDefault(); // zatrzymaj normalne wysylanie
        wyslijFormularz();
    });

    // aktualizuj pasek postepu przy kazdej zmianie
    var pola = form.querySelectorAll("input, select, textarea");
    for (var i = 0; i < pola.length; i++) {
        pola[i].addEventListener("input", aktualizujPostep);
        pola[i].addEventListener("change", aktualizujPostep);
    }
}

// walidacja pojedynczego pola - wywolywana z oninput w HTML
function walidujPole(pole) {
    var id = pole.id;
    var wartosc = pole.value.trim();
    var blad = "";

    // sprawdzamy kazde pole z osobna
    if (id === "imieDziecka" || id === "nazwiskoDziecka") {
        if (wartosc.length < 2) {
            blad = "Minimum 2 znaki";
        } else if (wartosc.length > 50) {
            blad = "Za dlugie (max 50 znakow)";
        }
    }

    if (id === "wiekDziecka" || id === "jezyk" || id === "poziom") {
        if (wartosc === "" || wartosc === null) {
            blad = "Wybierz opcje z listy";
        }
    }

    if (id === "imieRodzica") {
        if (wartosc.length < 3) {
            blad = "Podaj imie i nazwisko";
        }
    }

    if (id === "telefonRodzica") {
        // usuwamy spacje i sprawdzamy czy to numer telefonu
        var numerBezSpacji = wartosc.replace(/\s/g, "");
        if (numerBezSpacji.length < 9) {
            blad = "Za krotki numer telefonu";
        } else if (isNaN(numerBezSpacji.replace("+", ""))) {
            blad = "Nieprawidlowy format numeru";
        }
    }

    if (id === "emailRodzica") {
        // prosta walidacja emaila - sprawdzamy czy jest @ i .
        if (wartosc.indexOf("@") === -1 || wartosc.indexOf(".") === -1) {
            blad = "Nieprawidlowy adres email";
        } else if (wartosc.length < 5) {
            blad = "Za krotki email";
        }
    }

    if (id === "zgodaRodo") {
        if (!pole.checked) {
            blad = "Zgoda jest wymagana";
        }
    }

    // pokazujemy blad lub ok
    var elementBledu = document.getElementById("err-" + id);
    var elementOk = document.getElementById("ok-" + id);

    if (blad !== "") {
        pole.classList.add("invalid");
        pole.classList.remove("valid");
        if (elementBledu) {
            elementBledu.textContent = blad;
            elementBledu.classList.add("visible");
        }
        if (elementOk) {
            elementOk.classList.remove("visible");
        }
    } else if (wartosc !== "" && wartosc !== false) {
        pole.classList.remove("invalid");
        pole.classList.add("valid");
        if (elementBledu) {
            elementBledu.classList.remove("visible");
        }
        if (elementOk) {
            elementOk.classList.add("visible");
        }
    }

    // zapisz dane do localStorage na biezaco
    zapiszDaneDoStorage();

    // aktualizuj pasek postepu
    aktualizujPostep();
}

// licznik znakow w textarea
function licznikZnakow(pole) {
    var max = 500;
    var ile = pole.value.length;
    var licznik = document.getElementById("charCounter");

    if (licznik) {
        licznik.textContent = ile + " / " + max + " znakow";
        if (ile > max) {
            pole.value = pole.value.substring(0, max); // przytnij do max
            licznik.style.color = "#dc2626";
        } else {
            licznik.style.color = "";
        }
    }
}

// aktualizuje poziomy w zaleznosci od wybranego jezyka
function aktualizujPoziomy() {
    var jezyk = document.getElementById("jezyk");
    var poziom = document.getElementById("poziom");

    if (!jezyk || !poziom) {
        return;
    }

    // poziomy dla kazdego jezyka
    var poziomy = {
        "angielski":    ["Pre-A1 (Starters)", "A1 (Movers)", "A2 (Flyers/KET)", "B1 (PET)", "B2 (FCE)", "C1 (CAE)", "C2 (CPE)"],
        "francuski":    ["A1 (Debutant)", "A2 (Elementaire)", "B1 (DELF B1)", "B2 (DELF B2)", "C1 (DALF C1)"],
        "hiszpanski":   ["A1 (Basico)", "A2 (Elemental)", "B1 (DELE B1)", "B2 (DELE B2)"],
        "mandarynski":  ["HSK 1 (Poczatkujacy)", "HSK 2 (Podstawowy)", "HSK 3 (Sredni)", "HSK 4 (Zaawansowany)"],
        "niemiecki":    ["A1 (Starter)", "A2 (Grundstufe)", "B1 (Zertifikat)", "B2 (Mittelstufe)", "C1 (Goethe C1)"]
    };

    var wybranyJezyk = jezyk.value;

    // czyscimy stare opcje
    poziom.innerHTML = '<option value="">-- Wybierz poziom --</option>';

    if (wybranyJezyk && poziomy[wybranyJezyk]) {
        var lista = poziomy[wybranyJezyk];
        // dodajemy nowe opcje w petli
        for (var i = 0; i < lista.length; i++) {
            var opcja = document.createElement("option");
            opcja.value = lista[i];
            opcja.textContent = lista[i];
            poziom.appendChild(opcja);
        }
    }
}

// aktualizuje pasek postepu wypelnienia formularza
function aktualizujPostep() {
    var wymagane = ["imieDziecka", "nazwiskoDziecka", "wiekDziecka", "jezyk", "poziom", "imieRodzica", "telefonRodzica", "emailRodzica", "zgodaRodo"];
    var wypelnione = 0;

    for (var i = 0; i < wymagane.length; i++) {
        var pole = document.getElementById(wymagane[i]);
        if (!pole) {
            continue;
        }

        if (pole.type === "checkbox") {
            if (pole.checked) {
                wypelnione++;
            }
        } else {
            if (pole.value.trim() !== "") {
                wypelnione++;
            }
        }
    }

    var procent = Math.round((wypelnione / wymagane.length) * 100);
    var pasek = document.getElementById("progressBar");
    var tekst = document.getElementById("progressText");

    if (pasek) {
        pasek.style.width = procent + "%";
    }

    if (tekst) {
        if (procent === 0) {
            tekst.textContent = "Uzupelnij formularz";
        } else if (procent < 50) {
            tekst.textContent = "Dobry poczatek! (" + procent + "%)";
        } else if (procent < 100) {
            tekst.textContent = "Prawie gotowe... (" + procent + "%)";
        } else {
            tekst.textContent = "Formularz kompletny! Mozesz wyslac.";
        }
    }
}

// zapisuje dane formularza do localStorage
function zapiszDaneDoStorage() {
    var pola = ["imieDziecka", "nazwiskoDziecka", "wiekDziecka", "jezyk", "poziom", "imieRodzica", "emailRodzica"];
    var dane = {};

    for (var i = 0; i < pola.length; i++) {
        var pole = document.getElementById(pola[i]);
        if (pole) {
            dane[pola[i]] = pole.value;
        }
    }

    // zapisujemy jako JSON do localStorage
    localStorage.setItem("virella_formularz", JSON.stringify(dane));
}

// wczytuje zapisane dane z localStorage
function wczytajZapisaneDane() {
    var zapisane = localStorage.getItem("virella_formularz");
    if (!zapisane) {
        return; // nie ma nic zapisanego
    }

    var dane = JSON.parse(zapisane);
    var kartaDanych = document.getElementById("savedDataCard");
    var infoDanych = document.getElementById("savedDataInfo");

    // sprawdzamy czy sa jakies dane
    var maDane = false;
    for (var klucz in dane) {
        if (dane[klucz] !== "") {
            maDane = true;
            break;
        }
    }

    if (!maDane) {
        return;
    }

    // wypelniamy pola jesli sa zapisane wartosci
    if (dane.imieDziecka) {
        var pole = document.getElementById("imieDziecka");
        if (pole) pole.value = dane.imieDziecka;
    }
    if (dane.nazwiskoDziecka) {
        var pole2 = document.getElementById("nazwiskoDziecka");
        if (pole2) pole2.value = dane.nazwiskoDziecka;
    }
    if (dane.imieRodzica) {
        var pole3 = document.getElementById("imieRodzica");
        if (pole3) pole3.value = dane.imieRodzica;
    }
    if (dane.emailRodzica) {
        var pole4 = document.getElementById("emailRodzica");
        if (pole4) pole4.value = dane.emailRodzica;
    }

    // pokazujemy karte z info o zapisanych danych
    if (kartaDanych) {
        kartaDanych.style.display = "block";
    }
    if (infoDanych && dane.imieDziecka) {
        infoDanych.textContent = "Znaleziono zapisane dane dla: " + dane.imieDziecka;
    }

    // aktualizujemy pasek postepu
    aktualizujPostep();
}

// czysci zapisane dane - wywolywana z onclick w HTML
function wyczyscZapisane() {
    localStorage.removeItem("virella_formularz");
    var kartaDanych = document.getElementById("savedDataCard");
    if (kartaDanych) {
        kartaDanych.style.display = "none";
    }
}

// wysyla formularz (bez backendu - tylko JS)
function wyslijFormularz() {
    // najpierw walidujemy wszystkie wymagane pola
    var wymagane = ["imieDziecka", "nazwiskoDziecka", "wiekDziecka", "jezyk", "poziom", "imieRodzica", "telefonRodzica", "emailRodzica", "zgodaRodo"];
    var czyOk = true;

    for (var i = 0; i < wymagane.length; i++) {
        var pole = document.getElementById(wymagane[i]);
        if (!pole) {
            continue;
        }

        // wywolujemy walidacje dla kazdego pola
        walidujPole(pole);

        // sprawdzamy czy pole ma klase invalid
        if (pole.classList.contains("invalid")) {
            czyOk = false;
        }

        // sprawdzamy puste pola ktore nie byly jeszcze dotykane
        if (pole.type === "checkbox" && !pole.checked) {
            czyOk = false;
        } else if (pole.type !== "checkbox" && pole.value.trim() === "") {
            czyOk = false;
            pole.classList.add("invalid");
            var blad = document.getElementById("err-" + pole.id);
            if (blad) {
                blad.textContent = "To pole jest wymagane";
                blad.classList.add("visible");
            }
        }
    }

    if (!czyOk) {
        // przewin do pierwszego bledu
        var pierwszyBlad = document.querySelector(".invalid");
        if (pierwszyBlad) {
            pierwszyBlad.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return; // nie wysylamy
    }

    // wszystko ok - pokazujemy komunikat sukcesu
    var imieDziecka = document.getElementById("imieDziecka").value;
    var jezyk = document.getElementById("jezyk").value;
    var emailRodzica = document.getElementById("emailRodzica").value;

    var form = document.getElementById("zapiszForm");
    var sukces = document.getElementById("formSuccess");
    var wiadomosc = document.getElementById("successMessage");

    if (form) {
        form.style.display = "none";
    }

    if (sukces) {
        sukces.style.display = "block";
    }

    if (wiadomosc) {
        wiadomosc.textContent = "Dziekujemy za zgloszenie " + imieDziecka + " na kurs jezyka " + jezyk + ". Potwierdzenie wyslemy na adres: " + emailRodzica;
    }

    // czyscimy localStorage po wyslaniu
    localStorage.removeItem("virella_formularz");

    // przewijamy do komunikatu
    if (sukces) {
        sukces.scrollIntoView({ behavior: "smooth" });
    }
}


// ===== STRONA GALERIA =====

function inicjalizujGalerie() {
    // zbierz wszystkie zdjecia do tablicy (dla lightboxa)
    zbierzZdjeciaGalerii();

    // dodaj klikniecia do zdjec
    dodajKliknieciaGalerii();

    // filtry galerii
    inicjalizujFiltry();

    // przycisk "zaladuj wiecej"
    var btnWiecej = document.getElementById("loadMoreBtn");
    if (btnWiecej) {
        btnWiecej.addEventListener("click", function() {
            // symulujemy ladowanie wiecej zdjec
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ladowanie...';
            var self = this;
            setTimeout(function() {
                self.innerHTML = '<i class="fas fa-check"></i> Wszystkie zdjecia zaladowane';
                self.disabled = true;
                self.style.opacity = "0.5";
            }, 1500);
        });
    }

    // lightbox - zamknij po kliknieciu overlay
    var overlay = document.getElementById("lightboxOverlay");
    var btnZamknij = document.getElementById("lightboxClose");
    var btnPoprzednie = document.getElementById("lightboxPrev");
    var btnNastepne = document.getElementById("lightboxNext");

    if (overlay) {
        overlay.addEventListener("click", zamknijLightbox);
    }
    if (btnZamknij) {
        btnZamknij.addEventListener("click", zamknijLightbox);
    }
    if (btnPoprzednie) {
        btnPoprzednie.addEventListener("click", poprzednieZdjecie);
    }
    if (btnNastepne) {
        btnNastepne.addEventListener("click", nastepneZdjecie);
    }

    // klawiatura - strzalki i ESC
    document.addEventListener("keydown", function(e) {
        var lightbox = document.getElementById("lightbox");
        if (!lightbox || !lightbox.classList.contains("open")) {
            return; // lightbox nie jest otwarty
        }

        if (e.key === "Escape") {
            zamknijLightbox();
        } else if (e.key === "ArrowLeft") {
            poprzednieZdjecie();
        } else if (e.key === "ArrowRight") {
            nastepneZdjecie();
        }
    });
}

// zbiera informacje o wszystkich zdjeciach w galerii
function zbierzZdjeciaGalerii() {
    zdjeciaGalerii = []; // czyscimy tablice
    var elementy = document.querySelectorAll(".gallery-item");

    for (var i = 0; i < elementy.length; i++) {
        var img = elementy[i].querySelector("img");
        var opis = elementy[i].querySelector(".gallery-overlay-content span");

        if (img) {
            zdjeciaGalerii.push({
                src: img.src,
                alt: img.alt,
                opis: opis ? opis.textContent : img.alt
            });
        }
    }
}

// dodaje zdarzenia klikniecia do elementow galerii
function dodajKliknieciaGalerii() {
    var elementy = document.querySelectorAll(".gallery-item");

    for (var i = 0; i < elementy.length; i++) {
        // musimy uzyc funkcji pomocniczej zeby i bylo dobrze przechwycone
        elementy[i].addEventListener("click", stworzKlikniecieGalerii(i));
    }
}

// pomocnicza funkcja dla klikniecia w galerie
function stworzKlikniecieGalerii(indeks) {
    return function() {
        otworzyLightbox(indeks);
    };
}

function otworzyLightbox(indeks) {
    var lightbox = document.getElementById("lightbox");
    var img = document.getElementById("lightboxImg");
    var caption = document.getElementById("lightboxCaption");
    var counter = document.getElementById("lightboxCounter");

    if (!lightbox || zdjeciaGalerii.length === 0) {
        return;
    }

    aktualneZdjecie = indeks;

    // ustawiamy zdjecie
    if (img && zdjeciaGalerii[indeks]) {
        img.src = zdjeciaGalerii[indeks].src;
        img.alt = zdjeciaGalerii[indeks].alt;
    }

    if (caption && zdjeciaGalerii[indeks]) {
        caption.textContent = zdjeciaGalerii[indeks].opis;
    }

    if (counter) {
        counter.textContent = (indeks + 1) + " / " + zdjeciaGalerii.length;
    }

    lightbox.classList.add("open");
    document.body.style.overflow = "hidden"; // blokuj scroll strony
}

function zamknijLightbox() {
    var lightbox = document.getElementById("lightbox");
    if (lightbox) {
        lightbox.classList.remove("open");
        document.body.style.overflow = ""; // przywroc scroll
    }
}

function nastepneZdjecie() {
    aktualneZdjecie++;
    if (aktualneZdjecie >= zdjeciaGalerii.length) {
        aktualneZdjecie = 0; // wracamy na poczatek
    }
    otworzyLightbox(aktualneZdjecie);
}

function poprzednieZdjecie() {
    aktualneZdjecie--;
    if (aktualneZdjecie < 0) {
        aktualneZdjecie = zdjeciaGalerii.length - 1; // idziemy na koniec
    }
    otworzyLightbox(aktualneZdjecie);
}

// filtry galerii - pokazuje/ukrywa zdjecia wg kategorii
function inicjalizujFiltry() {
    var przyciski = document.querySelectorAll(".filter-btn");

    for (var i = 0; i < przyciski.length; i++) {
        przyciski[i].addEventListener("click", function() {
            // usun aktywny z wszystkich
            var wszystkie = document.querySelectorAll(".filter-btn");
            for (var j = 0; j < wszystkie.length; j++) {
                wszystkie[j].classList.remove("active");
            }

            // dodaj aktywny do kliknitego
            this.classList.add("active");

            var filtr = this.getAttribute("data-filter");
            filtrujGalerie(filtr);
        });
    }
}

function filtrujGalerie(kategoria) {
    var elementy = document.querySelectorAll(".gallery-item");

    for (var i = 0; i < elementy.length; i++) {
        var katElem = elementy[i].getAttribute("data-category");

        if (kategoria === "all" || katElem === kategoria) {
            // pokaz element
            elementy[i].classList.remove("hidden");
            elementy[i].style.display = "";
        } else {
            // ukryj element
            elementy[i].classList.add("hidden");
            elementy[i].style.display = "none";
        }
    }

    // po filtrowaniu trzeba na nowo zebrac zdjecia dla lightboxa
    // bo zmienila sie lista widocznych zdjec
    zbierzZdjeciaGalerii();
    dodajKliknieciaGalerii();
}


// ===== KONIEC PLIKU =====
// wszystkie funkcje sa gotowe
// plik laczy sie z HTML przez <script src="script.js"></script>