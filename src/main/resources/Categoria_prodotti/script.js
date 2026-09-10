const SERVER_URL = "http://localhost:3000";
//Avvio server node server.js

const percorso = window.location.pathname.match(/^\/categoria\/(\d+)\/?$/);

async function getData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Errore nella GET: " + response.status);
    }
    return await response.json();
}

async function postData(url, dati) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dati)
    });

    //controlla se il server ha risposto con uno status di errore
    if (!response.ok) {
      throw new Error(`Errore nella POST: ${response.status}`);
    }

    return response.json(); 
    
  } catch (error) {
    console.error("Si è verificato un problema:", error.message);
    throw error;
  }
}

async function tuttiProdotti() {
    const prodotti = await getData(`${SERVER_URL}/prodotti`);
    document.getElementById("risultato").textContent = JSON.stringify(prodotti, null, 2);
}

async function mostraProdottiCategoria() {
    if (!percorso) {
        tuttiProdotti();
    }

    const idCategoria = percorso[1];

    //prendo i collegamenti della categoria
    const collegamenti = await getData(`${SERVER_URL}/prodotto_categoria?id_categoria=${idCategoria}`);

    //prendo tutti i prodotti
    const prodotti = await getData(`${SERVER_URL}/prodotti`);

    //tengo solo i prodotti della categoria
    const prodottiCategoria = prodotti.filter(prodotto =>
        collegamenti.some(collegamento =>
            Number(collegamento.id_prodotto) === Number(prodotto.id)
        )
    );
    //mostro il JSON
    document.getElementById("risultato").textContent = JSON.stringify(prodottiCategoria,null,2);
}

async function aggiungiProdotto(event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value;

    const prezzo = Number(
        document.getElementById("prezzo").value
    );

    const quantita = Number(
        document.getElementById("quantita").value
    );

    const idCategoria = Number(
        document.getElementById("categoria_id").value
    );

    //creo il prodotto
    const nuovoProdotto = await postData(
        `${SERVER_URL}/prodotti`,
        {
            nome: nome,
            prezzo: prezzo,
            quantita: quantita
        }
    );

    //creo il collegamento prodotto a categoria
    await postData(
        `${SERVER_URL}/prodotto_categoria`,
        {
            id_prodotto: nuovoProdotto.id,
            id_categoria: idCategoria
        }
    );

    console.log(`Prodotto ${nuovoProdotto.nome} aggiunto alla categoria ${idCategoria}`);

    //ricarico i prodotti della categoria
    await mostraProdottiCategoria();

    //svuoto i campi
    document.getElementById("nome").value = "";
    document.getElementById("prezzo").value = "";
    document.getElementById("quantita").value = "";
    document.getElementById("categoria_id").value = "";
}

//quando premo "Aggiungi prodotto"
document.getElementById("formProdotto").addEventListener("submit",aggiungiProdotto);

//quando apro /categoria/1
mostraProdottiCategoria().catch(errore => {
    document.getElementById("risultato").textContent = errore.message;
});