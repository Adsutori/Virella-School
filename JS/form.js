// ===== START =====
window.onload = function() {
    inicjalizujNav(); // z script.js
    inicjalizujFormularz();
};


// ===== FORMULARZ =====

function inicjalizujFormularz() {
    var form = document.getElementById("zapiszForm");
    if (!form) return;

    wczytajZapisaneDane(); // wczytaj dane z localStorage jesli sa

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

// walidacja pola - wywolywana przez oninput w HTML
function walidujPole(pole) {
    var id  = pole.id;
    var val = pole.value.trim();
    var err = ""; // pusty = brak bledu

    if (id === "imieDziecka" || id === "nazwiskoDziecka") {
        if (val.length < 2) err = "Minimum 2 znaki";
    } else if (id === "wiekDziecka" || id === "jezyk" || id === "poziom") {
        if (!val) err = "Wybierz opcje z listy";
    } else if (id === "imieRodzica") {
        if (val.length < 3) err = "Podaj imie i nazwisko";
    } else if (id === "telefonRodzica") {
        var nr = val.replace(/\s/g, ""); // usun spacje przed sprawdzeniem
        if (nr.length < 9 || isNaN(nr.replace("+", ""))) err = "Nieprawidlowy numer";
    } else if (id === "emailRodzica") {
        if (val.indexOf("@") === -1 || val.indexOf(".") === -1) err = "Nieprawidlowy email";
    } else if (id === "zgodaRodo") {
        if (!pole.checked) err = "Zgoda jest wymagana";
    }

    var errEl = document.getElementById("err-" + id);
    var okEl  = document.getElementById("ok-" + id);
    var jest  = val !== "" || pole.type === "checkbox";

    // ustawiamy klasy i komunikaty bledu / ok
    pole.classList[err ? "add" : "remove"]("invalid");
    pole.classList[!err && jest ? "add" : "remove"]("valid");
    if (errEl) { errEl.textContent = err; errEl.classList[err ? "add" : "remove"]("visible"); }
    if (okEl)  { okEl.classList[!err && jest ? "add" : "remove"]("visible"); }

    zapiszDaneDoStorage(); // zapisz na biezaco
    aktualizujPostep();
}

// aktualizuje opcje poziomu po wyborze jezyka
function aktualizujPoziomy() {
    var jezyk  = document.getElementById("jezyk");
    var poziom = document.getElementById("poziom");
    if (!jezyk || !poziom) return;

    // mapa jezyk -> dostepne poziomy
    var mapa = {
        "angielski":   ["Pre-A1","A1","A2 (KET)","B1 (PET)","B2 (FCE)","C1 (CAE)","C2 (CPE)"],
        "francuski":   ["A1","A2","B1 (DELF B1)","B2 (DELF B2)","C1 (DALF C1)"],
        "hiszpanski":  ["A1","A2","B1 (DELE B1)","B2 (DELE B2)"],
        "mandarynski": ["HSK 1","HSK 2","HSK 3","HSK 4"],
        "niemiecki":   ["A1","A2","B1 (Zertifikat)","B2 (Mittelstufe)","C1 (Goethe C1)"]
    };

    poziom.innerHTML = '<option value="">-- Wybierz poziom --</option>';
    var lista = mapa[jezyk.value];
    if (!lista) return;

    // dodajemy opcje w petli
    for (var i = 0; i < lista.length; i++) {
        var o = document.createElement("option");
        o.value = o.textContent = lista[i];
        poziom.appendChild(o);
    }
}

// przelicza procent wypelnienia formularza i aktualizuje pasek
function aktualizujPostep() {
    var ids = ["imieDziecka","nazwiskoDziecka","wiekDziecka","jezyk","poziom","imieRodzica","telefonRodzica","emailRodzica","zgodaRodo"];
    var ok  = 0;
    for (var i = 0; i < ids.length; i++) {
        var p = document.getElementById(ids[i]);
        // checkbox sprawdzamy inaczej niz zwykle pole tekstowe
        if (p && (p.type === "checkbox" ? p.checked : p.value.trim() !== "")) ok++;
    }
    var proc  = Math.round(ok / ids.length * 100);
    var pasek = document.getElementById("progressBar");
    var tekst = document.getElementById("progressText");
    if (pasek) pasek.style.width = proc + "%";
    if (tekst) tekst.textContent = proc < 50 ? "Uzupelnij formularz (" + proc + "%)" : proc < 100 ? "Prawie gotowe... (" + proc + "%)" : "Formularz kompletny!";
}

// zapisuje dane do localStorage zeby nie przepadly przy odswiezeniu
function zapiszDaneDoStorage() {
    var ids  = ["imieDziecka","nazwiskoDziecka","wiekDziecka","jezyk","poziom","imieRodzica","emailRodzica"];
    var dane = {};
    for (var i = 0; i < ids.length; i++) {
        var p = document.getElementById(ids[i]);
        if (p) dane[ids[i]] = p.value;
    }
    // JSON.stringify zamienia obiekt na tekst - localStorage przyjmuje tylko tekst
    localStorage.setItem("virella_formularz", JSON.stringify(dane));
}

// wczytuje dane z localStorage i wypelnia pola formularza
function wczytajZapisaneDane() {
    var raw = localStorage.getItem("virella_formularz");
    if (!raw) return; // brak zapisanych danych

    // JSON.parse zamienia tekst z powrotem na obiekt
    var dane   = JSON.parse(raw);
    var ids    = ["imieDziecka","nazwiskoDziecka","imieRodzica","emailRodzica"];
    var maDane = false;

    for (var i = 0; i < ids.length; i++) {
        if (dane[ids[i]]) {
            var p = document.getElementById(ids[i]);
            if (p) { p.value = dane[ids[i]]; maDane = true; }
        }
    }

    if (!maDane) return;

    // pokazujemy info ze dane zostaly wczytane z pamieci
    var karta = document.getElementById("savedDataCard");
    var info  = document.getElementById("savedDataInfo");
    if (karta) karta.style.display = "block";
    if (info && dane.imieDziecka) info.textContent = "Znaleziono dane dla: " + dane.imieDziecka;
    aktualizujPostep();
}

// czysci localStorage - wywolywana przez onclick w HTML
function wyczyscZapisane() {
    localStorage.removeItem("virella_formularz");
    var k = document.getElementById("savedDataCard");
    if (k) k.style.display = "none";
}

// wysyla formularz - waliduje wszystko i pokazuje komunikat sukcesu
function wyslijFormularz() {
    var ids   = ["imieDziecka","nazwiskoDziecka","wiekDziecka","jezyk","poziom","imieRodzica","telefonRodzica","emailRodzica","zgodaRodo"];
    var czyOk = true;

    for (var i = 0; i < ids.length; i++) {
        var pole = document.getElementById(ids[i]);
        if (!pole) continue;
        walidujPole(pole); // wywolaj walidacje dla kazdego pola

        var puste = pole.type === "checkbox" ? !pole.checked : pole.value.trim() === "";
        if (pole.classList.contains("invalid") || puste) {
            czyOk = false;
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
        return;
    }

    // formularz ok - chowamy go i pokazujemy komunikat sukcesu
    var imie  = document.getElementById("imieDziecka").value;
    var jezyk = document.getElementById("jezyk").value;
    var email = document.getElementById("emailRodzica").value;

    var form   = document.getElementById("zapiszForm");
    var sukces = document.getElementById("formSuccess");
    var msg    = document.getElementById("successMessage");

    if (form)   form.style.display   = "none";
    if (sukces) sukces.style.display = "block";
    if (msg)    msg.textContent = "Zgloszenie " + imie + " na kurs: " + jezyk + ". Potwierdzenie wyslemy na: " + email;

    localStorage.removeItem("virella_formularz");
    if (sukces) sukces.scrollIntoView({ behavior: "smooth" });
}