const tbody = document.getElementById("fornecedores");
const template = document.getElementById("linhaFornecedor");

const btnAdicionar = document.getElementById("btnAdicionar");
const btnLimpar = document.getElementById("btnLimpar");
const btnPDF = document.getElementById("btnPDF");

const melhorFornecedor = document.getElementById("melhorFornecedor");
const menorCusto = document.getElementById("menorCusto");
const economiaSegundo = document.getElementById("economiaSegundo");
const economiaPior = document.getElementById("economiaPior");
const ranking = document.getElementById("ranking");

btnAdicionar.addEventListener("click", adicionarFornecedor);

btnLimpar.addEventListener("click", () => {

    if(confirm("Deseja iniciar uma nova comparação?")){

        tbody.innerHTML="";
        ranking.innerHTML="";
        adicionarFornecedor();
        adicionarFornecedor();

    }

});

btnPDF.addEventListener("click",()=>{

    window.print();

});

function moeda(valor){

    return valor.toLocaleString("pt-BR",{

        style:"currency",
        currency:"BRL"

    });

}

function adicionarFornecedor(){

    const clone = template.content.cloneNode(true);

    const linha = clone.querySelector("tr");

    const inputs = linha.querySelectorAll("input");

    inputs.forEach(input=>{

        input.addEventListener("input",calcularTudo);

    });

    linha.querySelector(".btnExcluir").addEventListener("click",()=>{

        linha.remove();
        calcularTudo();

    });

    tbody.appendChild(clone);

    calcularTudo();

}

function calcularTudo(){

    let dados=[];

    tbody.querySelectorAll("tr").forEach(linha=>{

        linha.classList.remove("melhor");
        linha.classList.remove("pior");

        const nome = linha.querySelector(".nome").value || "Fornecedor";

        const valor = parseFloat(linha.querySelector(".valor").value) || 0;

        const quantidade = parseFloat(linha.querySelector(".quantidade").value) || 0;

        const icms = parseFloat(linha.querySelector(".icms").value) || 0;

        const total = valor * quantidade;

        const credito = total * (icms/100);

        const custo = total - credito;

        linha.querySelector(".total").innerHTML = moeda(total);

        linha.querySelector(".credito").innerHTML = moeda(credito);

        linha.querySelector(".real").innerHTML = moeda(custo);

        dados.push({

            linha,
            nome,
            custo

        });

    });

    if(dados.length===0){

        melhorFornecedor.innerHTML="Nenhum fornecedor.";

        ranking.innerHTML="";

        return;

    }

    dados.sort((a,b)=>a.custo-b.custo);

    dados[0].linha.classList.add("melhor");

    dados[dados.length-1].linha.classList.add("pior");

    melhorFornecedor.innerHTML=dados[0].nome;

    menorCusto.innerHTML=moeda(dados[0].custo);

    if(dados.length>1){

        economiaSegundo.innerHTML=moeda(dados[1].custo-dados[0].custo);

    }else{

        economiaSegundo.innerHTML=moeda(0);

    }

    economiaPior.innerHTML=moeda(

        dados[dados.length-1].custo-

        dados[0].custo

    );

    montarRanking(dados);

}

function montarRanking(lista){

    ranking.innerHTML="";

    lista.forEach((item,index)=>{

        const tr=document.createElement("tr");

        if(index===0){

            tr.classList.add("melhor");

        }

        if(index===lista.length-1){

            tr.classList.add("pior");

        }

        tr.innerHTML=`

            <td>${index+1}º</td>

            <td>${item.nome}</td>

            <td>${moeda(item.custo)}</td>

        `;

        ranking.appendChild(tr);

    });

}

adicionarFornecedor();
adicionarFornecedor();
