async function caricaGiocatori() {

    const response = await fetch("/api/giocatori");

    if (!response.ok) {
        alert("Errore nel caricamento dei giocatori");
        return;
    }

    const giocatori = await response.json();

    const contenitore = document.getElementById("giocatori");

    contenitore.innerHTML = "";

    giocatori.forEach(giocatore => {

        const elemento = document.createElement("div");

        elemento.innerHTML = `
            <hr>

            <h2>${giocatore.nome} ${giocatore.cognome}</h2>

            <label>Nome:</label>
            <input id="nome-${giocatore.id}" value="${giocatore.nome}">

            <br>

            <label>Cognome:</label>
            <input id="cognome-${giocatore.id}" value="${giocatore.cognome}">

            <br>

            <label>Numero:</label>
            <input id="numero-${giocatore.id}" type="number" value="${giocatore.numero}">

            <br>

            <label>Ruolo:</label>
            <input id="ruolo-${giocatore.id}" value="${giocatore.ruolo}">

            <br><br>

            <button onclick="salvaGiocatore('${giocatore.id}')">
                SALVA
            </button>

            <span id="messaggio-${giocatore.id}"></span>
        `;

        contenitore.appendChild(elemento);
    });
}


async function salvaGiocatore(id) {

    const nome = document.getElementById(`nome-${id}`).value;
    const cognome = document.getElementById(`cognome-${id}`).value;
    const numero = document.getElementById(`numero-${id}`).value;
    const ruolo = document.getElementById(`ruolo-${id}`).value;

    const response = await fetch(`/api/giocatori/${id}`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            nome: nome,
            cognome: cognome,
            numero: Number(numero),
            ruolo: ruolo
        })
    });

    const messaggio = document.getElementById(`messaggio-${id}`);

    if (response.ok) {

        messaggio.textContent = " Salvato!";

        // Ricarica i dati direttamente da Drupal
        await caricaGiocatori();

    } else {

        messaggio.textContent = " Errore nel salvataggio";
    }
}