const ruolo = { //ruoli dei giocatori e le rispettive classi CSS per lo stile
    palleggiatore: "ruolo-palleggiatore",
    opposto: "ruolo-opposto",
    centrale: "ruolo-centrale",
    banda: "ruolo-banda",
    libero: "ruolo-libero"
};

async function caricaGiocatori() {

    const response = await fetch("/api/giocatori"); //richiestta get

    if (!response.ok) {
        alert("Errore nel caricamento dei giocatori");
        return;
    }

    const giocatori = await response.json();

    const contenitore = document.getElementById("giocatori");

    contenitore.innerHTML = "";

    giocatori.forEach(giocatore => {

        const elemento = document.createElement("article");
        elemento.className = "player-card";

        const ruoloClasse = ruolo[(giocatore.ruolo || "").toLowerCase()] || "ruolo-altro";

        elemento.innerHTML = `
            <div class="player-number ${ruoloClasse}">${giocatore.numero}</div>

            <div class="player-body">
                <div class="player-heading">
                    <h2>${giocatore.nome} ${giocatore.cognome}</h2>
                    <span class="player-role ${ruoloClasse}">${giocatore.ruolo}</span>
                </div>

                <div class="player-fields">
                    <label>Nome
                        <input id="nome-${giocatore.id}" value="${giocatore.nome}">
                    </label>

                    <label>Cognome
                        <input id="cognome-${giocatore.id}" value="${giocatore.cognome}">
                    </label>

                    <label>Numero
                        <input id="numero-${giocatore.id}" type="number" value="${giocatore.numero}">
                    </label>

                    <label>Ruolo
                        <input id="ruolo-${giocatore.id}" value="${giocatore.ruolo}">
                    </label>
                </div>

                <div class="player-actions">
                    <button class="btn-save" onclick="salvaGiocatore('${giocatore.id}')">Salva</button>
                    <span id="messaggio-${giocatore.id}" class="player-message"></span>
                </div>
            </div>
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
        messaggio.textContent = "Salvato";
        messaggio.classList.remove("is-error");
        messaggio.classList.add("is-success");
        await caricaGiocatori(); 
    } else {
        messaggio.textContent = "Errore nel salvataggio";
        messaggio.classList.remove("is-success");
        messaggio.classList.add("is-error");
    }
}
