async function caricaProdotti() {

    const response = await fetch("/api/prodotti");

    const contenitore = document.getElementById("prodotti");

    if (!response.ok) {
        contenitore.innerHTML =
            '<div class="empty">Errore nel caricamento dei prodotti.</div>';
        return;
    }

    const prodotti = await response.json();

    contenitore.innerHTML = "";

    if (prodotti.length === 0) {
        contenitore.innerHTML =
            '<div class="empty">Nessun prodotto presente.</div>';
        return;
    }

    prodotti.forEach(prodotto => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <h3>${prodotto.nome}</h3>

            <span class="category">
                ${prodotto.categoria}
            </span>

            <div class="price">
                € ${Number(prodotto.prezzo).toFixed(2)}
            </div>

            <div class="quantity">
                Quantità disponibile: ${prodotto.quantita}
            </div>

            <div class="card-actions">
                <button class="delete-btn"
                        onclick="eliminaProdotto(${prodotto.id})">
                    Elimina
                </button>
            </div>
        `;

        contenitore.appendChild(card);
    });
}


async function eliminaProdotto(id) {

    const conferma = confirm(
        "Vuoi davvero eliminare questo prodotto?"
    );

    if (!conferma) {
        return;
    }

    const response = await fetch(`/api/prodotti/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        await caricaProdotti();
    } else {
        alert("Errore durante l'eliminazione del prodotto.");
    }
}


document
    .getElementById("form-prodotto")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const nome =
            document.getElementById("nome").value;

        const categoria =
            document.getElementById("categoria").value;

        const prezzo =
            document.getElementById("prezzo").value;

        const quantita =
            document.getElementById("quantita").value;

        const messaggio =
            document.getElementById("messaggio");

        const response = await fetch("/api/prodotti", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nome: nome,
                categoria: categoria,
                prezzo: Number(prezzo),
                quantita: Number(quantita)
            })
        });

        if (response.ok) {

            messaggio.textContent =
                "Prodotto aggiunto correttamente.";

            messaggio.className = "success";

            this.reset();

            await caricaProdotti();

        } else if (response.status === 409) {

            messaggio.textContent =
                "Questo prodotto esiste già.";

            messaggio.className = "error";

        } else {

            messaggio.textContent =
                "Errore durante il salvataggio.";

            messaggio.className = "error";
        }
    });


document
    .getElementById("btn-carica")
    .addEventListener("click", caricaProdotti);


caricaProdotti();
