// 🔥 IMPORTS FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// 🔥 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyC25g8_LH0t4gDPAP3AGt7sy0BTCkRwQ",
  authDomain: "unitroca-cbb87.firebaseapp.com",
  projectId: "unitroca-cbb87",
  storageBucket: "unitroca-cbb87.appspot.com",
  messagingSenderId: "596745322490",
  appId: "1:596745322490:web:c68511934888b3d3606e43"
};


// 🔥 INICIALIZA
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase conectado 🔥");


// 🔥 LISTA LOCAL
let itens = [];


// 🚀 POSTAR ITEM (AGORA SALVA NO FIREBASE)
window.postarItem = async function () {

    let nome = document.getElementById("item").value;
    let curso = document.getElementById("curso").value;
    let categoria = document.getElementById("categoria").value;
    let descricao = document.getElementById("descricao").value;

    if (!nome || !descricao) {
        alert("Preencha nome e descrição!");
        return;
    }

    let item = {
        nome,
        curso,
        categoria,
        descricao
    };

    try {
        await addDoc(collection(db, "itens"), item);

        alert("Item salvo no banco 🔥");

        limparFormulario();
        carregarItens();

    } catch (erro) {
        console.error("Erro ao salvar:", erro);
    }
};


// 🔥 CARREGAR ITENS DO FIREBASE
async function carregarItens() {

    itens = [];

    const querySnapshot = await getDocs(collection(db, "itens"));

    querySnapshot.forEach((doc) => {
        itens.push(doc.data());
    });

    renderizar(itens);
}


// 🔥 RENDERIZAR NA TELA
function renderizar(listaFiltrada) {
    let lista = document.getElementById("lista");

    lista.innerHTML = "";

    if (listaFiltrada.length === 0) {
        lista.innerHTML = "<p class='text-center'>Nenhum item encontrado</p>";
        return;
    }

    listaFiltrada.forEach(function(item) {
        lista.innerHTML += `
        <div class="col-md-4 mb-4">
            <div class="card shadow-sm h-100">
                <div class="card-body">
                    <h5>${item.nome}</h5>
                    <p>${item.descricao}</p>
                    <small class="text-muted">${item.categoria} • ${item.curso}</small>
                </div>
            </div>
        </div>
        `;
    });
}


// 🔍 FILTRO
window.filtrar = function () {

    let busca = document.getElementById("busca").value.toLowerCase();
    let filtroCategoria = document.getElementById("filtroCategoria").value;

    let filtrados = itens.filter(function(item) {

        let nomeMatch = item.nome.toLowerCase().includes(busca);
        let categoriaMatch = filtroCategoria === "todos" || item.categoria === filtroCategoria;

        return nomeMatch && categoriaMatch;
    });

    renderizar(filtrados);
};


// 🧹 LIMPAR FORMULÁRIO
function limparFormulario() {
    document.getElementById("item").value = "";
    document.getElementById("curso").value = "";
    document.getElementById("descricao").value = "";
}


// 🔥 CARREGA AUTOMATICAMENTE AO ABRIR
carregarItens();