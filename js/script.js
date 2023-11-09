// Seleção de elementos do DOM
const modal = document.querySelector(".modal_container");
const tbody = document.querySelector("tbody");
const sName = document.querySelector("#m_name");
const sJob = document.querySelector("#m_job");
const sSalary = document.querySelector("#m_salary");
const btnSave = document.querySelector("#btn_save");

let items;
let id;

// Função para recuperar dados do localStorage ou retornar um array vazio
const getItemBD = () => JSON.parse(localStorage.getItem("dbfunc")) || [];

// Função para armazenar os dados no localStorage
const setItemsBD = () => localStorage.setItem("dbfunc", JSON.stringify(items));

// Função para abrir o modal, com opção de edição
function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    // Fecha o modal se o clique ocorrer fora do conteúdo do modal
    if (e.target.className.indexOf("modal_container") != -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    // Preenche os campos do modal com os dados do item para edição
    sName.value = items[index].name;
    sJob.value = items[index].job;
    sSalary.value = items[index].salary;
    id = index;
  } else {
    // Limpa os campos do modal para inserção de novo item
    sName.value = "";
    sJob.value = "";
    sSalary.value = "";
  }
}

// Função para carregar e exibir os itens na tabela
function loadItems() {
  items = getItemBD();
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItem(item, index);
  });
}

// Carrega os itens ao carregar a página
loadItems();

// Função para inserir um item na tabela
function insertItem(item, index) {
  let tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${item.name}</td>
    <td>${item.job}</td>
    <td>${item.salary}</td>
    <td class="action">
      <button onclick="editItem(${index})">
        <i class="bx bx-edit"></i>
      </button>
    </td>
    <td class="action">
      <button onclick="deleteItem(${index})">
        <i class="bx bx-trash"></i>
      </button>
    </td>
  `;

  tbody.appendChild(tr);
}

// Função para editar um item
function editItem(index) {
  openModal(true, index);
}

// Função para excluir um item
function deleteItem(index) {
  const confirmation = confirm("Deseja excluir este funcionário?");

  if (confirmation) {
    // Remove o item da lista e atualiza os dados no localStorage
    items.splice(index, 1);
    setItemsBD();
    loadItems();
  }
}

// Manipula o evento de clique do botão "Salvar"
btnSave.onclick = (e) => {
  if (sName.value == "" || sJob.value == "" || sSalary.value == "") {
    return; // Impede a execução se algum campo estiver vazio
  }

  e.preventDefault(); // Impede o envio do formulário (comportamento padrão)

  if (id !== undefined) {
    // Se o ID estiver definido, estamos editando um item existente
    items[id].name = sName.value;
    items[id].job = sJob.value;
    items[id].salary = sSalary.value;
  } else {
    // Caso contrário, estamos adicionando um novo item à lista
    items.push({
      name: sName.value,
      job: sJob.value,
      salary: sSalary.value,
    });
  }

  setItemsBD(); // Armazena os dados atualizados no localStorage
  modal.classList.remove("active"); // Fecha o modal
  loadItems(); // Recarrega e exibe os itens atualizados na tabela
  id = undefined; // Limpa o ID para futuras inserções
};
