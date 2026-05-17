// ===== ZMIENNE GLOBALNE =====
// te zmienne sa potrzebne w wielu funkcjach wiec sa tutaj na gorze

var aktualnySlajd = 0;       // numer aktualnie pokazanego slajdu
var liczbaSlajdow = 0;       // ile slajdow jest w sumie
var timerSlider = null;      // tutaj trzymam timer slidera zeby moc go zatrzymac
var aktualnaOpinia = 0;      // ktora opinia jest teraz pokazana
var zdjeciaGalerii = [];     // tablica ze wszystkimi zdjeciami w galerii
var aktualneZdjecie = 0;     // indeks zdjecia otwartego w lightboxie
var licznikUruchomiony = false; // flaga zeby liczniki nie odpaly sie dwa razy


// ===== START - odpala sie gdy strona sie zaladuje =====
window.onload = function() {

    // nawigacja dziala na kazdej stronie
    inicjalizujNav();
    inicjalizujSmoothScroll();
    inicjalizujAnimacjeScroll();

    // sprawdzamy na ktorej stronie jestesmy po adresie URL
    // i uruchamiamy tylko to co potrzebne na danej stronie
    var url = window.location.href;

    if (url.indexOf("contact.html") !== -1) {
        inicjalizujKontakt();
    } else if (url.indexOf("form.html") !== -1) {
        inicjalizujFormularz();
    } else if (url.indexOf("gallery.html") !== -1) {
        inicjalizujGalerie();
    } else {
        // jesli zadne z powyzszych to jestesmy na stronie glownej
        inicjalizujStroneGlowna();
    }
};


// ===== NAWIGACJA =====

function inicjalizujNav() {
    var navbar    = document.getElementById("navbar");
    var hamburger = document.getElementById("hamburger");
    var navLinks  = document.getElementById("navLinks");

    // jesli nie ma navbara na stronie to wychodzimy z funkcji
    if (!navbar) return;

    // sticky navbar - dodaje klase scrolled po przewineciu 60px
    // CSS potem zmienia wyglad navbara dzieki tej klasie
    window.addEventListener("scroll", function() {
        navbar.classList[window.scrollY > 60 ? "add" : "remove"]("scrolled");
    });

    // hamburger menu - tylko na mobile (CSS go ukrywa na duzych ekranach)
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", function() {
        // toggle - jesli jest klasa open to ja usun, jesli nie ma to dodaj
        hamburger.classList.toggle("open");
        navLinks.classList.toggle("open");
    });

    // zamknij menu gdy klikniemy w jakis link w menu
    var linki = navLinks.querySelectorAll("a");
    for (var i = 0; i < linki.length; i++) {
        linki[i].addEventListener("click", function() {
            hamburger.classList.remove("open");
            navLinks.classList.remove("open");
        });
    }

    // zamknij menu gdy klikniemy gdzies poza nim
    document.addEventListener("click", function(e) {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove("open");
            navLinks.classList.remove("open");
        }
    });
}


// ===== STRONA GLOWNA =====

function inicjalizujStroneGlowna() {
    uruchomTyping();     // efekt pisania w hero
    inicjalizujSlider(); // slider ze zdjeciami

    // auto-zmiana opinii co 6 sekund
    // modulo (%) sprawia ze po ostatniej wraca do pierwszej
    setInterval(function() {
        aktualnaOpinia = (aktualnaOpinia + 1) % 3;
        pokazOpinie(aktualnaOpinia);
    }, 6000);

    // przycisk "poznaj oferte" - przewija do sekcji z oferta
    var btn = document.getElementById("scrollOferta");
    if (btn) {
        btn.addEventListener("click", function(e) {
            e.preventDefault(); // zatrzymaj domyslne dzialanie linka
            var s = document.getElementById("oferta");
            if (s) s.scrollIntoView({ behavior: "smooth" });
        });
    }
}


// ===== EFEKT PISANIA W HERO (TYPING EFFECT) =====

function uruchomTyping() {
    var el = document.getElementById("typingText");
    if (!el) return; // nie ma elementu - konczymy

    // teksty ktore beda sie wyswietlac jeden po drugim
    var teksty = [
        "Where Excellence Meets Language",
        "Nauka jezykow na najwyzszym poziomie",
        "Twoje dziecko, nasza pasja"
    ];

    var ti    = 0;    // indeks aktualnego tekstu
    var li    = 0;    // indeks aktualnej litery
    var pisze = true; // true = dodajemy litery, false = kasujemy

    function krok() {
        var t = teksty[ti];

        if (pisze) {
            // dodajemy nastepna litere do elementu
            el.textContent = t.substring(0, ++li);

            if (li >= t.length) {
                // doszlismy do konca tekstu - czekamy 2.2s potem kasujemy
                pisze = false;
                setTimeout(krok, 2200);
                return;
            }
            setTimeout(krok, 75); // szybkosc pisania - co 75ms nowa litera

        } else {
            // kasujemy ostatnia litere
            el.textContent = t.substring(0, --li);

            if (li <= 0) {
                // skasowalismy caly tekst - przechodzimy do nastepnego
                pisze = true;
                ti = (ti + 1) % teksty.length; // modulo - po ostatnim wraca do 0
                setTimeout(krok, 400);
                return;
            }
            setTimeout(krok, 40); // kasowanie szybsze niz pisanie
        }
    }

    // startujemy z opoznieniem zeby strona zdazyla sie zaladowac
    setTimeout(krok, 1200);
}


// ===== SLIDER ZDJEC =====

function inicjalizujSlider() {
    var slajdy = document.querySelectorAll(".slide");
    var dotsEl = document.getElementById("sliderDots");

    // jesli nie ma slajdow to nie ma co robic
    if (!slajdy || slajdy.length === 0) return;

    liczbaSlajdow = slajdy.length;

    // tworzymy kropki (dots) - jedna dla kazdego slajdu
    if (dotsEl) {
        for (var i = 0; i < liczbaSlajdow; i++) {
            var d = document.createElement("button");
            d.className = "slider-dot";
            // WAZNE: uzywamy IIFE (funkcja w funkcji) zeby zmienna i
            // miala dobra wartosc w kazdym listenerze
            d.addEventListener("click", (function(n) {
                return function() { pokazSlajd(n); };
            })(i));
            dotsEl.appendChild(d);
        }
    }

    pokazSlajd(0); // pokazujemy pierwszy slajd na start

    // przyciski prev i next
    var prev = document.getElementById("sliderPrev");
    var next = document.getElementById("sliderNext");
    if (prev) prev.addEventListener("click", function() {
        // odejmujemy 1, jesli wyjdziemy poza zakres to wracamy na koniec
        pokazSlajd((aktualnySlajd - 1 + liczbaSlajdow) % liczbaSlajdow);
    });
    if (next) next.addEventListener("click", function() {
        pokazSlajd((aktualnySlajd + 1) % liczbaSlajdow);
    });

    // auto-przewijanie co 5 sekund
    timerSlider = setInterval(function() {
        pokazSlajd((aktualnySlajd + 1) % liczbaSlajdow);
    }, 5000);

    // zatrzymaj auto-przewijanie gdy mysz jest na sliderze
    var wrapper = document.querySelector(".slider-wrapper");
    if (wrapper) {
        wrapper.addEventListener("mouseenter", function() {
            clearInterval(timerSlider); // zatrzymaj timer
        });
        wrapper.addEventListener("mouseleave", function() {
            // wznow timer po opuszczeniu slidera
            timerSlider = setInterval(function() {
                pokazSlajd((aktualnySlajd + 1) % liczbaSlajdow);
            }, 5000);
        });
    }
}

function pokazSlajd(n) {
    var slajdy = document.querySelectorAll(".slide");
    var doty   = document.querySelectorAll(".slider-dot");

    // usun klase active ze wszystkich slajdow i kropek
    for (var i = 0; i < slajdy.length; i++) slajdy[i].classList.remove("active");
    for (var j = 0; j < doty.length; j++)   doty[j].classList.remove("active");

    // dodaj active do wybranego slajdu i odpowiedniej kropki
    aktualnySlajd = n;
    slajdy[n].classList.add("active");
    if (doty[n]) doty[n].classList.add("active");
}


// ===== OPINIE RODZICOW =====

// ta funkcja musi byc globalna bo wywolujemy ja tez przez onclick w HTML
function pokazOpinie(n) {
    var opinie = document.querySelectorAll(".testimonial");
    var doty   = document.querySelectorAll(".testimonial-dot");
    if (!opinie.length) return;

    // ukryj wszystkie, potem pokaz tylko wybrana
    for (var i = 0; i < opinie.length; i++) opinie[i].classList.remove("active");
    for (var j = 0; j < doty.length; j++)   doty[j].classList.remove("active");

    aktualnaOpinia = n;
    if (opinie[n]) opinie[n].classList.add("active");
    if (doty[n])   doty[n].classList.add("active");
}


// ===== ANIMOWANE LICZNIKI STATYSTYK =====

function uruchomLiczniki() {
    // flaga - nie uruchamiaj dwa razy (np. przy szybkim scrollowaniu)
    if (licznikUruchomiony) return;
    licznikUruchomiony = true;

    // dane dla kazdego licznika: id elementu, wartosc docelowa, suffix
    var dane = [
        { id: "stat-uczniowie",   cel: 520, s: "+" },
        { id: "stat-lata",        cel: 12,  s: ""  },
        { id: "stat-jezyki",      cel: 5,   s: ""  },
        { id: "stat-certyfikaty", cel: 890, s: "+" }
    ];

    // dla kazdego licznika odpalamy osobna animacje
    for (var i = 0; i < dane.length; i++) {
        // IIFE zeby kazdy licznik mial swoje wlasne zmienne
        (function(d) {
            var el = document.getElementById(d.id);
            if (!el) return;
            var v    = 0;
            var krok = Math.ceil(d.cel / 80); // 80 krokow = ok 2 sekundy animacji

            var t = setInterval(function() {
                v += krok;
                if (v >= d.cel) { v = d.cel; clearInterval(t); } // nie przekraczaj wartosci
                el.textContent = v + d.s;
            }, 25); // co 25ms nowa wartosc
        })(dane[i]);
    }
}


// ===== SMOOTH SCROLL =====

function inicjalizujSmoothScroll() {
    // lapie wszystkie linki ktore zaczynaja sie od # (kotwice)
    var linki = document.querySelectorAll('a[href^="#"]');

    for (var i = 0; i < linki.length; i++) {
        linki[i].addEventListener("click", function(e) {
            var href = this.getAttribute("href");
            if (href === "#" || href === "") return; // pomijamy puste

            var cel = document.querySelector(href);
            if (cel) {
                e.preventDefault();
                cel.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
}


// ===== ANIMACJE PRZY SCROLLOWANIU =====

function inicjalizujAnimacjeScroll() {
    var selektor = ".animate-on-scroll, .feature-card, .lang-card";

    // stare przegladarki nie maja IntersectionObserver - pokazujemy wszystko od razu
    if (!window.IntersectionObserver) {
        var el = document.querySelectorAll(selektor);
        for (var i = 0; i < el.length; i++) el[i].classList.add("visible");
        uruchomLiczniki();
        return;
    }

    // IntersectionObserver wywoluje callback gdy element wchodzi w widok
    var obs = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                entries[i].target.classList.add("visible"); // CSS animuje pojawienie
                obs.unobserve(entries[i].target); // juz nie obserwuj - animacja tylko raz
            }
        }
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    // dodajemy do obserwacji wszystkie elementy z animacja
    var elementy = document.querySelectorAll(selektor);
    for (var j = 0; j < elementy.length; j++) obs.observe(elementy[j]);

    // osobny observer tylko dla sekcji ze statystykami
    // liczniki odpala sie dopiero gdy ta sekcja jest widoczna
    var stat = document.getElementById("statystyki");
    if (stat) {
        var obsStat = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                uruchomLiczniki();
                obsStat.disconnect(); // juz nie potrzebujemy tego observera
            }
        }, { threshold: 0.3 });
        obsStat.observe(stat);
    }
}


// ===== STRONA KONTAKT =====

function inicjalizujKontakt() {
    sprawdzGodzinyOtwarcia(); // sprawdz od razu przy wejsciu na strone
    podswietlDzisiaj();       // podswietl dzisiejszy dzien w tabeli godzin
    setInterval(sprawdzGodzinyOtwarcia, 60000); // odswiezaj co minute
}

function sprawdzGodzinyOtwarcia() {
    var t = new Date(); // aktualny czas
    var d = t.getDay();     // dzien tygodnia: 0=niedziela, 1=poniedzialek itd
    var h = t.getHours();   // godzina
    var m = t.getMinutes(); // minuty

    // godziny otwarcia dla kazdego dnia tygodnia
    // format: [od, do] lub null jesli zamkniete
    var godz = {
        0: null,       // niedziela - zamkniete
        1: [8, 20],    // poniedzialek
        2: [8, 20],    // wtorek
        3: [8, 20],    // sroda
        4: [8, 20],    // czwartek
        5: [8, 20],    // piatek
        6: [9, 15]     // sobota - krocej
    };

    var banner = document.getElementById("openStatusBanner");
    if (!banner) return; // nie jestesmy na stronie kontakt

    // formatujemy czas do wyswietlenia np "08:05"
    var hStr = (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
    var timeEl = document.getElementById("statusTime");
    if (timeEl) timeEl.textContent = hStr;

    // sprawdzamy czy teraz jest w godzinach otwarcia
    var g       = godz[d];
    var otwarte = g && (h + m / 60) >= g[0] && (h + m / 60) < g[1];

    var icon  = document.getElementById("statusIcon");
    var title = document.getElementById("statusTitle");
    var desc  = document.getElementById("statusDesc");

    if (otwarte) {
        // szkola jest otwarta - zielony kolor
        icon.className    = "status-icon status-open";
        icon.innerHTML    = '<i class="fas fa-door-open"></i>';
        title.textContent = "Teraz otwarte";
        desc.textContent  = "Zapraszamy! Zamykamy o " + g[1] + ":00";
        banner.style.borderLeftColor = "#16a34a";
    } else {
        // szkola zamknieta - czerwony kolor
        icon.className    = "status-icon status-closed";
        icon.innerHTML    = '<i class="fas fa-door-closed"></i>';
        // rozne komunikaty w zaleznosci od sytuacji
        title.textContent = !g ? "Dzisiaj zamkniete" : (h < g[0] ? "Jeszcze zamkniete" : "Juz zamkniete");
        desc.textContent  = !g ? "Niedziela - dzien wolny." : (h < g[0] ? "Otwarcie o " + g[0] + ":00" : "Otwarcie jutro o 8:00");
        banner.style.borderLeftColor = "#dc2626";
    }
}

function podswietlDzisiaj() {
    var dzisiaj = new Date().getDay(); // numer dzisiejszego dnia 0-6
    var wiersze = document.querySelectorAll(".hours-row");

    // szukamy wiersza ktory ma data-day rowne dzisiejszemu dniu
    for (var i = 0; i < wiersze.length; i++) {
        if (parseInt(wiersze[i].getAttribute("data-day")) === dzisiaj) {
            wiersze[i].classList.add("today"); // CSS go podswietli
        }
    }
}


// ===== STRONA FORMULARZ =====

function inicjalizujFormularz() {
    var form = document.getElementById("zapiszForm");
    if (!form) return;

    wczytajZapisaneDane(); // sprawdz czy cos jest zapisane w localStorage

    // przechwytujemy submit zeby nie wysylac prawdziwego requesta
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        wyslijFormularz();
    });

    // aktualizuj pasek postepu przy kazdej zmianie w formularzu
    var pola = form.querySelectorAll("input, select, textarea");
    for (var i = 0; i < pola.length; i++) {
        pola[i].addEventListener("input", aktualizujPostep);
        pola[i].addEventListener("change", aktualizujPostep);
    }
}

// walidacja pojedynczego pola - wywolywana przez oninput/onchange w HTML
function walidujPole(pole) {
    var id  = pole.id;
    var val = pole.value.trim();
    var err = ""; // pusty string = brak bledu

    // sprawdzamy rozne pola rozne zasady
    if (id === "imieDziecka" || id === "nazwiskoDziecka") {
        if (val.length < 2) err = "Minimum 2 znaki";
    } else if (id === "wiekDziecka" || id === "jezyk" || id === "poziom") {
        if (!val) err = "Wybierz opcje z listy";
    } else if (id === "imieRodzica") {
        if (val.length < 3) err = "Podaj imie i nazwisko";
    } else if (id === "telefonRodzica") {
        var nr = val.replace(/\s/g, ""); // usuwamy spacje
        if (nr.length < 9 || isNaN(nr.replace("+", ""))) err = "Nieprawidlowy numer";
    } else if (id === "emailRodzica") {
        // prosta walidacja - sprawdzamy czy jest malpa i kropka
        if (val.indexOf("@") === -1 || val.indexOf(".") === -1) err = "Nieprawidlowy email";
    } else if (id === "zgodaRodo") {
        if (!pole.checked) err = "Zgoda jest wymagana";
    }

    // pobieramy elementy do pokazania bledu lub znaczka ok
    var errEl = document.getElementById("err-" + id);
    var okEl  = document.getElementById("ok-" + id);
    var jest  = val !== "" || pole.type === "checkbox"; // czy pole ma jakas wartosc

    // ustawiamy klasy valid/invalid na polu
    pole.classList[err ? "add" : "remove"]("invalid");
    pole.classList[!err && jest ? "add" : "remove"]("valid");

    // pokazujemy lub chowamy komunikat bledu
    if (errEl) { errEl.textContent = err; errEl.classList[err ? "add" : "remove"]("visible"); }
    // pokazujemy lub chowamy znaczek ok (zielony ptaszek)
    if (okEl)  { okEl.classList[!err && jest ? "add" : "remove"]("visible"); }

    zapiszDaneDoStorage(); // zapisz na biezaco do localStorage
    aktualizujPostep();    // przelicz pasek postepu
}

// licznik znakow w polu tekstowym uwagi
function licznikZnakow(pole) {
    var max = 500;
    var ile = pole.value.length;
    var el  = document.getElementById("charCounter");
    if (ile > max) { pole.value = pole.value.substring(0, max); ile = max; } // przytnij
    if (el) { el.textContent = ile + " / " + max + " znakow"; el.style.color = ile >= max ? "#dc2626" : ""; }
}

// aktualizuje dostepne poziomy po wyborze jezyka
function aktualizujPoziomy() {
    var jezyk  = document.getElementById("jezyk");
    var poziom = document.getElementById("poziom");
    if (!jezyk || !poziom) return;

    // mapa jezyk -> lista poziomow
    var mapa = {
        "angielski":   ["Pre-A1 (Starters)", "A1 (Movers)", "A2 (KET)", "B1 (PET)", "B2 (FCE)", "C1 (CAE)", "C2 (CPE)"],
        "francuski":   ["A1", "A2", "B1 (DELF B1)", "B2 (DELF B2)", "C1 (DALF C1)"],
        "hiszpanski":  ["A1", "A2", "B1 (DELE B1)", "B2 (DELE B2)"],
        "mandarynski": ["HSK 1", "HSK 2", "HSK 3", "HSK 4"],
        "niemiecki":   ["A1", "A2", "B1 (Zertifikat)", "B2 (Mittelstufe)", "C1 (Goethe C1)"]
    };

    // czyscimy stare opcje i dodajemy nowe w petli
    poziom.innerHTML = '<option value="">-- Wybierz poziom --</option>';
    var lista = mapa[jezyk.value];
    if (!lista) return;
    for (var i = 0; i < lista.length; i++) {
        var o = document.createElement("option");
        o.value = o.textContent = lista[i];
        poziom.appendChild(o);
    }
}

// przelicza ile procent formularza jest wypelnione
function aktualizujPostep() {
    // lista pol ktore sa wymagane
    var ids = ["imieDziecka","nazwiskoDziecka","wiekDziecka","jezyk","poziom","imieRodzica","telefonRodzica","emailRodzica","zgodaRodo"];
    var ok  = 0;

    for (var i = 0; i < ids.length; i++) {
        var p = document.getElementById(ids[i]);
        // checkbox sprawdzamy inaczej niz zwykle pole
        if (p && (p.type === "checkbox" ? p.checked : p.value.trim() !== "")) ok++;
    }

    var proc  = Math.round(ok / ids.length * 100);
    var pasek = document.getElementById("progressBar");
    var tekst = document.getElementById("progressText");

    if (pasek) pasek.style.width = proc + "%";
    if (tekst) {
        // rozne komunikaty w zaleznosci od postepu
        if (proc === 0)        tekst.textContent = "Uzupelnij formularz";
        else if (proc < 50)    tekst.textContent = "Dobry poczatek! (" + proc + "%)";
        else if (proc < 100)   tekst.textContent = "Prawie gotowe... (" + proc + "%)";
        else                   tekst.textContent = "Formularz kompletny!";
    }
}

// zapisuje dane formularza do localStorage - zeby nie przepadly przy odswiezeniu
function zapiszDaneDoStorage() {
    var ids  = ["imieDziecka","nazwiskoDziecka","wiekDziecka","jezyk","poziom","imieRodzica","emailRodzica"];
    var dane = {};

    // zbieramy wartosci pol do obiektu
    for (var i = 0; i < ids.length; i++) {
        var p = document.getElementById(ids[i]);
        if (p) dane[ids[i]] = p.value;
    }

    // JSON.stringify zamienia obiekt na tekst zeby mozna bylo zapisac
    localStorage.setItem("virella_formularz", JSON.stringify(dane));
}

// wczytuje dane zapisane wczesniej z localStorage
function wczytajZapisaneDane() {
    var raw = localStorage.getItem("virella_formularz");
    if (!raw) return; // nie ma nic zapisanego - konczymy

    // JSON.parse zamienia tekst z powrotem na obiekt
    var dane = JSON.parse(raw);
    var ids  = ["imieDziecka","nazwiskoDziecka","imieRodzica","emailRodzica"];
    var maDane = false;

    // wypelniamy pola jesli sa zapisane wartosci
    for (var i = 0; i < ids.length; i++) {
        if (dane[ids[i]]) {
            var p = document.getElementById(ids[i]);
            if (p) { p.value = dane[ids[i]]; maDane = true; }
        }
    }

    if (!maDane) return; // dane byly puste - nic nie robimy

    // pokazujemy karte informujaca o zapisanych danych
    var karta = document.getElementById("savedDataCard");
    var info  = document.getElementById("savedDataInfo");
    if (karta) karta.style.display = "block";
    if (info && dane.imieDziecka) info.textContent = "Znaleziono dane dla: " + dane.imieDziecka;

    aktualizujPostep(); // przelicz pasek po wczytaniu danych
}

// czysci zapisane dane - wywolywana przez onclick na przycisku w HTML
function wyczyscZapisane() {
    localStorage.removeItem("virella_formularz");
    var k = document.getElementById("savedDataCard");
    if (k) k.style.display = "none";
}

// glowna funkcja wysylania formularza
function wyslijFormularz() {
    var ids   = ["imieDziecka","nazwiskoDziecka","wiekDziecka","jezyk","poziom","imieRodzica","telefonRodzica","emailRodzica","zgodaRodo"];
    var czyOk = true;

    // walidujemy kazde wymagane pole przed wyslaniem
    for (var i = 0; i < ids.length; i++) {
        var pole = document.getElementById(ids[i]);
        if (!pole) continue;

        walidujPole(pole); // wywolaj walidacje

        // sprawdz czy pole jest niepoprawne lub puste
        var puste = pole.type === "checkbox" ? !pole.checked : pole.value.trim() === "";
        if (pole.classList.contains("invalid") || puste) {
            czyOk = false;
            // jesli pole jest puste ale nie ma jeszcze bledu to dodaj
            if (puste && !pole.classList.contains("invalid")) {
                pole.classList.add("invalid");
                var errEl = document.getElementById("err-" + pole.id);
                if (errEl) { errEl.textContent = "To pole jest wymagane"; errEl.classList.add("visible"); }
            }
        }
    }

    if (!czyOk) {
        // przewin do pierwszego pola z bledem
        var first = document.querySelector(".invalid");
        if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
        return; // nie wysylamy - sa bledy
    }

    // wszystko ok - zbieramy dane do komunikatu
    var imie  = document.getElementById("imieDziecka").value;
    var jezyk = document.getElementById("jezyk").value;
    var email = document.getElementById("emailRodzica").value;

    // chowamy formularz i pokazujemy komunikat sukcesu
    var form   = document.getElementById("zapiszForm");
    var sukces = document.getElementById("formSuccess");
    var msg    = document.getElementById("successMessage");

    if (form)   form.style.display   = "none";
    if (sukces) sukces.style.display = "block";
    if (msg)    msg.textContent = "Zgloszenie " + imie + " na kurs jezyka " + jezyk + " przyjete. Potwierdzenie wyslemy na: " + email;

    localStorage.removeItem("virella_formularz"); // czyscimy po wyslaniu
    if (sukces) sukces.scrollIntoView({ behavior: "smooth" });
}


// ===== GALERIA I LIGHTBOX =====

function inicjalizujGalerie() {
    zbierzIBindujGalerie(); // zbierz zdjecia i dodaj klikniecia
    inicjalizujFiltry();    // przyciski filtrowania galerii

    // podpinamy przyciski lightboxa - uzywam obiektu zamiast 4x if
    var mapa = {
        "lightboxOverlay": zamknijLightbox,
        "lightboxClose":   zamknijLightbox,
        "lightboxPrev":    poprzednieZdjecie,
        "lightboxNext":    nastepneZdjecie
    };
    for (var id in mapa) {
        var el = document.getElementById(id);
        if (el) el.addEventListener("click", mapa[id]);
    }

    // obsluga klawiatury gdy lightbox jest otwarty
    document.addEventListener("keydown", function(e) {
        var lb = document.getElementById("lightbox");
        if (!lb || !lb.classList.contains("open")) return; // lightbox zamkniety - ignoruj

        if (e.key === "Escape")          zamknijLightbox();
        else if (e.key === "ArrowLeft")  poprzednieZdjecie();
        else if (e.key === "ArrowRight") nastepneZdjecie();
    });

    // przycisk "zaladuj wiecej" - tylko symulacja, bez prawdziwego ladowania
    var btn = document.getElementById("loadMoreBtn");
    if (btn) {
        btn.addEventListener("click", function() {
            var self = this; // zachowujemy referencje do przycisku
            self.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ladowanie...';
            setTimeout(function() {
                self.innerHTML = '<i class="fas fa-check"></i> Wszystkie zdjecia zaladowane';
                self.disabled = true;
                self.style.opacity = "0.5";
            }, 1500);
        });
    }
}

// zbiera dane o zdjeciach I dodaje klikniecia - polaczone w jedna funkcje
// wywolujemy to tez po filtrowaniu zeby odswiezycz tablice
function zbierzIBindujGalerie() {
    zdjeciaGalerii = []; // czyscimy stara tablice
    var elementy = document.querySelectorAll(".gallery-item");

    for (var i = 0; i < elementy.length; i++) {
        var img  = elementy[i].querySelector("img");
        var opis = elementy[i].querySelector(".gallery-overlay-content span");

        if (img) {
            // dodajemy obiekt ze zdjeciem do tablicy
            zdjeciaGalerii.push({
                src:  img.src,
                alt:  img.alt,
                opis: opis ? opis.textContent : img.alt
            });
        }

        // IIFE - tak samo jak w sliderze, zeby i mialo dobra wartosc
        elementy[i].addEventListener("click", (function(n) {
            return function() { otworzyLightbox(n); };
        })(i));
    }
}

function otworzyLightbox(n) {
    var lb = document.getElementById("lightbox");
    if (!lb || !zdjeciaGalerii.length) return;

    aktualneZdjecie = n;
    var z = zdjeciaGalerii[n]; // skrot do obiektu ze zdjeciem

    // ustawiamy zdjecie i podpis w lightboxie
    document.getElementById("lightboxImg").src         = z.src;
    document.getElementById("lightboxImg").alt         = z.alt;
    document.getElementById("lightboxCaption").textContent = z.opis;
    document.getElementById("lightboxCounter").textContent = (n + 1) + " / " + zdjeciaGalerii.length;

    lb.classList.add("open");
    document.body.style.overflow = "hidden"; // blokujemy scroll strony w tle
}

function zamknijLightbox() {
    var lb = document.getElementById("lightbox");
    if (lb) {
        lb.classList.remove("open");
        document.body.style.overflow = ""; // przywracamy scroll
    }
}

// nastepne i poprzednie zdjecie - modulo zeby sie zapetlalo
function nastepneZdjecie() {
    otworzyLightbox((aktualneZdjecie + 1) % zdjeciaGalerii.length);
}

function poprzednieZdjecie() {
    otworzyLightbox((aktualneZdjecie - 1 + zdjeciaGalerii.length) % zdjeciaGalerii.length);
}

// filtry - pokazuje/ukrywa zdjecia wg kategorii
function inicjalizujFiltry() {
    var przyciski = document.querySelectorAll(".filter-btn");

    for (var i = 0; i < przyciski.length; i++) {
        przyciski[i].addEventListener("click", function() {
            // usun active ze wszystkich przyciskow
            var all = document.querySelectorAll(".filter-btn");
            for (var j = 0; j < all.length; j++) all[j].classList.remove("active");

            this.classList.add("active"); // dodaj active do kliknitego
            filtrujGalerie(this.getAttribute("data-filter"));
        });
    }
}

function filtrujGalerie(kat) {
    var elementy = document.querySelectorAll(".gallery-item");

    for (var i = 0; i < elementy.length; i++) {
        // pokaz jesli filtr to "all" albo kategoria sie zgadza
        var pokaz = kat === "all" || elementy[i].getAttribute("data-category") === kat;
        elementy[i].style.display = pokaz ? "" : "none";
    }

    // po filtrowaniu odswiez tablice - bo zmienily sie widoczne zdjecia
    zbierzIBindujGalerie();
}


// ===== KONIEC PLIKU =====
