// Book Class: Represents a Contact
class Broj {
  constructor(name, number, address, isbn) {
    this.name = name;
    this.number = number;
    this.address = address;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayNumbers() {
    const numbers = Store.getNumbers();

    numbers.forEach(broj => UI.addNumberToList(broj));
  }

  static addNumberToList(broj) {
    const list = document.querySelector("#number-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${broj.name}</td>
        <td>${broj.number}</td>
        <td>${broj.address}</td>
        <td>${broj.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteNumber(el) {
    if (el.classList.contains("delete")) {
      if (confirm("Are you sure?")) {
        el.parentElement.parentElement.remove();
      }
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#number-form");
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#name").value = "";
    document.querySelector("#number").value = "";
    document.querySelector("#address").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// Store Class: Handles Storage
class Store {
  static getNumbers() {
    let numbers;
    if (localStorage.getItem("numbers") === null) {
      numbers = [];
    } else {
      numbers = JSON.parse(localStorage.getItem("numbers"));
    }

    return numbers;
  }

  static addNumber(broj) {
    const numbers = Store.getNumbers();
    numbers.push(broj);
    localStorage.setItem("numbers", JSON.stringify(numbers));
  }

  static removeNumber(isbn) {
    const numbers = Store.getNumbers();

    numbers.forEach((broj, index) => {
      if (broj.isbn === isbn) {
        numbers.splice(index, 1);
      }
    });

    localStorage.setItem("numbers", JSON.stringify(numbers));
  }
}

// Event: Display Contact
document.addEventListener("DOMContentLoaded", UI.displayNumbers);

// Event: Add a Contact
document.querySelector("#number-form").addEventListener("submit", e => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const name = document.querySelector("#name").value;
  const number = document.querySelector("#number").value;
  const address = document.querySelector("#address").value;
  const isbn = document.querySelector("#isbn").value;

  // Validate
  if (name === "" || number === "" || address === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instatiate contact
    const broj = new Broj(name, number, address, isbn);

    // Add Contact to UI
    UI.addNumberToList(broj);

    // Add Contact to store
    Store.addNumber(broj);

    // Show success message
    UI.showAlert("Number Added", "success");

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Contact
document.querySelector("#number-list").addEventListener("click", e => {
  // Remove Contact from UI
  UI.deleteNumber(e.target);

  // Remove Contact from store
  Store.removeNumber(e.target.parentElement.previousElementSibling.textContent);

  // Show success message
  UI.showAlert("Number Removed", "success");
});

// Filter list of Contacts by name
const filterInput = document.querySelector("#filterInput");

filterInput.addEventListener("keyup", filterItems);

function filterItems(e) {
  //Converet text to lowercase
  const filter = e.target.value.toLowerCase();
  const numberList = document.querySelector("#number-list");
  const tr = numberList.querySelectorAll("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toLowerCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
