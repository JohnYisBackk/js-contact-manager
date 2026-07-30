"use strict";

lucide.createIcons();

// ===============================
// 1. SELECT ELEMENTS
// ===============================

const contactForm = document.getElementById("contactForm");

const fullNameInput = document.getElementById("fullNameInput");
const phoneNumberInput = document.getElementById("phoneNumberInput");
const emailAddressInput = document.getElementById("emailAddressInput");
const categorySelect = document.getElementById("categorySelect");
const addBtn = document.getElementById("addBtn");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const sortSelect = document.getElementById("sortSelect");

const totalContacts = document.getElementById("totalContacts");
const favoriteContacts = document.getElementById("favoriteContacts");
const filteredContacts = document.getElementById("filteredContacts");

const emptyState = document.getElementById("emptyState");

const contactsGrid = document.getElementById("contactsGrid");

// ===============================
// 2. STATE
// ===============================

let contacts = [];

let editingContactId = null;

// ===============================
// 3. SAVE / LOAD DATA
// ===============================

function saveData() {
  localStorage.setItem("contactManager", JSON.stringify(contacts));
}

function loadData() {
  const storedContacts = localStorage.getItem("contactManager");

  if (!storedContacts) return;

  contacts = JSON.parse(storedContacts);
}

// ===============================
// 4. ADD CONTACT
// ===============================

function addContact() {
  const name = fullNameInput.value.trim();
  const phone = phoneNumberInput.value.trim();
  const email = emailAddressInput.value.trim();
  const category = categorySelect.value;

  if (editingContactId !== null) {
    const contact = contacts.find((contact) => contact.id === editingContactId);

    if (!contact) return;

    contact.name = name;
    contact.phone = phone;
    contact.email = email;
    contact.category = category;

    editingContactId = null;
    addBtn.textContent = "Add Contact";
  } else {
    const contact = {
      id: Date.now(),
      name,
      phone,
      email,
      category,
      favorite: false,
    };

    contacts.push(contact);
  }

  saveData();
  renderContacts();

  contactForm.reset();
  fullNameInput.focus();
}

// ===============================
// 5. DELETE CONTACT
// ===============================

function deleteContact(id) {
  const isConfirmed = confirm("Do you want to delete this contact?");

  if (!isConfirmed) return;

  contacts = contacts.filter((contact) => contact.id !== id);

  saveData();
  renderContacts();
}

// ===============================
// 6. EDIT CONTACT
// ===============================

function editContact(id) {
  const contact = contacts.find((contact) => contact.id === id);

  if (!contact) return;

  fullNameInput.value = contact.name;
  phoneNumberInput.value = contact.phone;
  emailAddressInput.value = contact.email;
  categorySelect.value = contact.category;

  editingContactId = id;
  addBtn.textContent = "Save Changes";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// ===============================
// 7. TOGGLE FAVORITE
// ===============================

function toggleFavorite(id) {
  const contact = contacts.find((contact) => contact.id === id);

  if (!contact) return;

  contact.favorite = !contact.favorite;

  saveData();
  renderContacts();
}

// ===============================
// 8. SEARCH CONTACTS
// ===============================

function searchContacts(contactList) {
  const searchValue = searchInput.value.toLowerCase().trim();

  if (!searchValue) return contactList;

  return contactList.filter((contact) =>
    contact.name.toLowerCase().includes(searchValue),
  );
}

// ===============================
// 9. FILTER CONTACTS
// ===============================

function filterContacts(contactList) {
  const selectedCategory = filterSelect.value;

  if (selectedCategory === "all") return contactList;

  return contactList.filter((contact) => contact.category === selectedCategory);
}

// ===============================
// 10. SORT CONTACTS
// ===============================

function sortContacts(contactList) {
  const sortValue = sortSelect.value;

  const sortedContacts = [...contactList];

  if (sortValue === "name-asc") {
    return sortedContacts.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortValue === "name-desc") {
    return sortedContacts.sort((a, b) => b.name.localeCompare(a.name));
  }

  return sortedContacts;
}

// ===============================
// 11. UPDATE STATISTICS
// ===============================

function updateStats(visibleContacts) {
  totalContacts.textContent = contacts.length;

  favoriteContacts.textContent = contacts.filter(
    (contact) => contact.favorite,
  ).length;

  filteredContacts.textContent = visibleContacts.length;
}

// ===============================
// 12. EMPTY STATE
// ===============================

function toggleEmptyState(visibleContacts) {
  if (visibleContacts.length === 0) {
    emptyState.style.display = "flex";
    contactsGrid.style.display = "none";
  } else {
    emptyState.style.display = "none";
    contactsGrid.style.display = "grid";
  }
}

// ===============================
// 13. RENDER CONTACTS
// ===============================

function renderContacts() {
  let visibleContacts = [...contacts];

  visibleContacts = searchContacts(visibleContacts);
  visibleContacts = filterContacts(visibleContacts);
  visibleContacts = sortContacts(visibleContacts);

  contactsGrid.innerHTML = "";

  updateStats(visibleContacts);
  toggleEmptyState(visibleContacts);

  visibleContacts.forEach((contact) => {
    const contactCard = document.createElement("article");

    contactCard.classList.add("contact-card");

    contactCard.innerHTML = `
      <div class="contact-card-header">
        <div class="contact-avatar">
          ${contact.name.charAt(0).toUpperCase()}
        </div>

        <button
          class="favorite-btn ${contact.favorite ? "active" : ""}"
          type="button"
          onclick="toggleFavorite(${contact.id})"
          aria-label="Toggle favorite"
        >
          <i data-lucide="star"></i>
        </button>
      </div>

      <div class="contact-info">
        <h3>${contact.name}</h3>

        <span class="category-badge">
          ${contact.category}
        </span>

        <div class="contact-details">
          <p>
            <i data-lucide="phone"></i>
            <span>${contact.phone}</span>
          </p>

          <p>
            <i data-lucide="mail"></i>
            <span>${contact.email}</span>
          </p>
        </div>
      </div>

      <div class="contact-actions">
        <button
          class="edit-btn"
          type="button"
          onclick="editContact(${contact.id})"
        >
          <i data-lucide="pencil"></i>
          Edit
        </button>

        <button
          class="delete-btn"
          type="button"
          onclick="deleteContact(${contact.id})"
        >
          <i data-lucide="trash-2"></i>
          Delete
        </button>
      </div>
    `;

    contactsGrid.appendChild(contactCard);
  });

  lucide.createIcons();
}

// ===============================
// 14. EVENT LISTENERS
// ===============================

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  addContact();
});

searchInput.addEventListener("input", renderContacts);

filterSelect.addEventListener("change", renderContacts);

sortSelect.addEventListener("change", renderContacts);

// ===============================
// 15. INITIALIZE APP
// ===============================

function initializeApp() {
  loadData();
  renderContacts();
}

initializeApp();
