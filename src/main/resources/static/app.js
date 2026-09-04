async function caricaGiocatori() {

    const response = await fetch("/api/giocatori");

    const giocatori = await response.json();

    const contenitore = document.getElementById("giocatori");

    contenitore.innerHTML = "";

    giocatori.forEach(giocatore => {

        const elemento = document.createElement("div");

        elemento.innerHTML = `
            <hr>
            <h2>${giocatore.nome} ${giocatore.cognome}</h2>
            <p>Numero: ${giocatore.numero}</p>
            <p>Ruolo: ${giocatore.ruolo}</p>
        `;

        contenitore.appendChild(elemento);
    });
}