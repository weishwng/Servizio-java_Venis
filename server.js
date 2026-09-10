const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();

const resources = path.join(
    __dirname,
    "src",
    "main",
    "resources"
);

const categoriaPage = path.join(
    resources,
    "Categoria_prodotti",
    "index.html"
);

const router = jsonServer.router(
    path.join(__dirname, "src", "main", "resources", "Categoria_prodotti", "server.json")
);

function sendHtmlPage(res) {
    res.set({
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": "inline",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    });
    res.sendFile(categoriaPage);
}

/* HOME */
server.get("/", (req, res) => {
    sendHtmlPage(res);
});

/* CATEGORIA */
server.get("/categoria/:id", (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).send("ID categoria non valido");
    }
    sendHtmlPage(res);
});

/* FILE STATICI: CSS, JS, immagini */
server.use(jsonServer.defaults({
    static: resources
}));

/* API JSON */
server.use(router);

server.listen(3000, () => {
    console.log("");
    console.log("=====================================");
    console.log("SERVER AVVIATO");
    console.log("=====================================");
    console.log("Home:");
    console.log("http://localhost:3000/");
    console.log("");
    console.log("Categoria 1:");
    console.log("http://localhost:3000/categoria/1");
    console.log("");
    console.log("Prodotti:");
    console.log("http://localhost:3000/prodotti");
    console.log("");
    console.log("Categorie:");
    console.log("http://localhost:3000/categorie");
    console.log("");
    console.log("Collegamenti:");
    console.log("http://localhost:3000/prodotto_categoria");
    console.log("=====================================");
});
