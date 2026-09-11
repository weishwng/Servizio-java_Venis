const SERVER_URL = "http://localhost:3000";
//node server.js

const percorso = window.location.pathname.match(/^\/categoria\/(\d+)\/?$/i);

let tuttiDati = [];

async function getData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("errore nel get: " + response.status);
    }
    return await response.json();
}

async function postData(url, dati) {
    const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dati)
    });

    if (!response.ok) {
        throw new Error("errore nella post: " + response.status);
    }

    return await response.json();
}

async function eliminaData(url) {
    const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attivo: 0 }) 
    });

    if (!response.ok) {
        throw new Error("Errore nell'eliminazione: " + response.status);
    }
    
    return await response.json();
}


function aggiornaOrario() {
    const ora = new Date().toLocaleTimeString("it-IT");
    document.getElementById("lastUpdate").textContent ="Ultimo aggiornamento: " + ora;
}

function showStatus(messaggio, tipo = "info") {
    const box = document.getElementById("statusMessage");

    box.textContent = messaggio;
    box.className = tipo;

    if (tipo !== "errore") {
        setTimeout(() => {
            box.textContent = "";
            box.className = "";
        }, 4000);
    }
}

function resetFiltri() {
    document.getElementById("search").value = "";
    document.getElementById("filtroNome").value = "";
    document.getElementById("filtroId").value = "";
    document.getElementById("filtroPrezzo").value = "";
    document.getElementById("filtroQuantita").value = "";
}

async function caricaProdotti() {
    if (!percorso) {
        return await getData(SERVER_URL + "/prodotti");
    }

    const idCategoria = percorso[1];
    const collegamenti = await getData(SERVER_URL + "/prodotto_categoria?id_categoria=" + idCategoria);
    const prodotti = await getData(SERVER_URL + "/prodotti");

    return prodotti.filter(prodotto =>
        collegamenti.some(collegamento =>
            Number(collegamento.id_prodotto) === Number(prodotto.id)
        )
    );
}

async function mostraProdottiCategoria() {
    const btn = document.getElementById("fetchButton");

    btn.disabled = true;
    btn.textContent = "Caricamento...";

    try {
        tuttiDati = await caricaProdotti();

        resetFiltri();
        mostraDati();
        aggiornaOrario();

        showStatus("dati aggiornati con successo", "ok");

    } catch (error) {
        console.error(error);
        showStatus("server non raggiungibile", "errore");

    } finally {
        btn.disabled = false;
        btn.textContent = "Aggiorna dati";
    }
}

function mostraDati() {
    const testo = document.getElementById("search").value.trim().toLowerCase();

    const nome = document.getElementById("filtroNome").value.trim().toLowerCase();

    const idVal = document.getElementById("filtroId").value.trim();
    const prezzo = document.getElementById("filtroPrezzo").value.trim();
    const quantita = document.getElementById("filtroQuantita").value.trim();

    let risultati = [...tuttiDati];

    if (nome) {risultati = risultati.filter(prodotto =>String(prodotto.nome).toLowerCase().includes(nome));}

    if (idVal) {risultati = risultati.filter(prodotto =>String(prodotto.id) === idVal);}
    if (prezzo) {risultati = risultati.filter(prodotto =>String(prodotto.prezzo) === prezzo);}
    if (quantita) {risultati = risultati.filter(prodotto =>String(prodotto.quantita) === quantita);}

    if (testo) {
        risultati = risultati.filter(prodotto => {
            const valori = [
                String(prodotto.id),
                String(prodotto.nome),
                String(prodotto.prezzo),
                String(prodotto.quantita)
            ];

            return valori.some(valore =>
                valore.toLowerCase().includes(testo)
            );
        });
    }

    risultati = risultati.filter(prodotto => Number(prodotto.attivo) === 1);

    document.getElementById("risultato").textContent = JSON.stringify(risultati, null, 2);
}

async function aggiungiProdotto(e) {
    e.preventDefault();//per far si che ad ogni click non ricarichi la pagina da solo
    try {
        const nome = document.getElementById("nome").value.trim();
        const prezzo = Number(document.getElementById("prezzo").value);
        const quantita = Number(document.getElementById("quantita").value);
        const idCategoria = Number(document.getElementById("categoria_id").value);

        if (!nome || isNaN(prezzo) || isNaN(quantita)) {
            throw new Error("controlla i dati inseriti");
        }

        if (isNaN(idCategoria)) {
            throw new Error("id categoria non valido");
        }

        const nuovoProdotto = await postData(SERVER_URL + "/prodotti",
            {
                nome: nome,
                prezzo: prezzo,
                quantita: quantita,
                attivo:1
            }
        );

        await postData(SERVER_URL + "/prodotto_categoria",
            {
                id_prodotto: nuovoProdotto.id,
                id_categoria: idCategoria
            }
        );

        //aggiorna i dati
        document.getElementById("formAggiungi").reset();

        await mostraProdottiCategoria();

        showStatus("prodotto aggiunto con successo", "ok");
    } catch (error) {
        console.error(error);
        showStatus(error.message, "errore");
    }
}

async function eliminaProdotto(e) {
    e.preventDefault();
    try {
        const idProdotto = Number(document.getElementById("prodotto_id").value);
        if (isNaN(idProdotto)) {
            throw new Error("ID prodotto non valido");
        }

        await eliminaData(SERVER_URL + "/prodotti/" + idProdotto);

        document.getElementById("formElimina").reset();
        await mostraProdottiCategoria();

        showStatus("Prodotto eliminato con successo", "ok");

    } catch (error) {
        console.error(error);
        showStatus(error.message, "errore");
    }
}


//tutti gli add event listener di html
window.addEventListener("load", () => {

    document.getElementById("fetchButton").addEventListener("click", mostraProdottiCategoria);
    document.getElementById("formElimina").addEventListener("submit", eliminaProdotto);
    document.getElementById("formAggiungi").addEventListener("submit", aggiungiProdotto);

    document.getElementById("ricercaProdotto").addEventListener("click", mostraDati);
    document.getElementById("search").addEventListener("input", mostraDati);
    document.getElementById("filtroNome").addEventListener("input", mostraDati);
    document.getElementById("filtroId").addEventListener("input", mostraDati);
    document.getElementById("filtroPrezzo").addEventListener("input", mostraDati);
    document.getElementById("filtroQuantita").addEventListener("input", mostraDati);

    mostraProdottiCategoria();
});