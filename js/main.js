var contactImageInput = document.getElementById("avatarInput");
var avatarPreview = document.getElementById("avatarPreview");
var contactNameInput = document.getElementById("contactName");
var contactPhoneNumberInput = document.getElementById("contactPhoneNumber");
var contactEmailInput = document.getElementById("contactEmail");
var contactAddressInput = document.getElementById("contactAddress");
var contactGroupInput = document.getElementById("contactGroup");
var contactNotesInput = document.getElementById("contactNotes");
var contactFavoriteInput = document.getElementById("contactFavorite");
var contactEmergencyInput = document.getElementById("contactEmergency");
var contactSearchs = document.getElementById("contactSearch");
var updateIndex = -1;
var rowContact = document.getElementById("rowCardContact");

var totalContactLength = document.getElementById("totalContactLength");
var totalFavoriteLength = document.getElementById("totalFavoriteLength");
var totalEmergencyLength = document.getElementById("totalEmergencyLength");

var rowFavorite = document.getElementById("rowFavorite");
var rowEmergency = document.getElementById("rowEmergency");

var contactList = [];

if (localStorage.getItem("contact") !== null) {
  contactList = JSON.parse(localStorage.getItem("contact"));
  displayContact(contactList);
  displayFavorite();
  displayEmergency();
  updateStatuesCount();
}

// -Event image
contactImageInput.addEventListener("change", function (e) {
  var file = e.target.files[0];

  if (file) {
    var imageUrl = URL.createObjectURL(file);
    avatarPreview.innerHTML = `
            <img src="${imageUrl}" class="img-fluid rounded-circle w-100 h-100 object-fit-cover">
        `;
  }
});

function creatContact() {
  if (
    validationForm(contactNameInput) &&
    validationForm(contactPhoneNumberInput) &&
    validationForm(contactEmailInput) &&
    validationForm(contactAddressInput) &&
    validationForm(contactNotesInput) 
  ) {
    var contact = {
      img: contactImageInput.files[0]
        ? "./images/" + contactImageInput.files[0].name
        : "",
      name: contactNameInput.value,
      phoneNumber: contactPhoneNumberInput.value,
      email: contactEmailInput.value,
      address: contactAddressInput.value,
      group: contactGroupInput.value,
      noutes: contactNotesInput.value,
      favorite: contactFavoriteInput.checked,
      emergency: contactEmergencyInput.checked,
    };
        var isPhoneExist = false;

    for (var i = 0; i < contactList.length; i++) {

      if (
        contactList[i].phoneNumber == contact.phoneNumber &&
        i != updateIndex
      ) {
        isPhoneExist = true;
        break;
      }
    }

    if (isPhoneExist) {
      Swal.fire({
        title: "Duplicate Phone Number",
        text: `A contact with this phone number already exists: ${contactList[i].name}`,
        icon: "error",
        confirmButtonColor: "#7f22fe",
      });
      return;
    }

    if (updateIndex == -1) {
      contactList.push(contact);

      setTimeout(() => {
        Swal.fire({
          title: "Added!",
          text: "Contact added successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1100,
        });
      }, 300);
    } else {
      contactList[updateIndex] = contact;

      updateIndex = -1;

      setTimeout(() => {
        Swal.fire({
          title: "Updated!",
          text: "Contact updated successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1100,
        });
      }, 300);
    }
    localStorage.setItem("contact", JSON.stringify(contactList));
    clearContactForm();
    if (contactSearchs.value != ``) {
      search();
    } else {
      displayContact(contactList);
    }
    console.log(contactList);
    displayFavorite();
    displayEmergency();
    updateStatuesCount();
    modelHide();
  }
}

function modelHide() {
  var modal = bootstrap.Modal.getInstance(
    document.getElementById("exampleModal"),
  );
  modal.hide();
}

function clearContactForm() {
  contactImageInput.value = "";
  avatarPreview.innerHTML = `<i class="fa-solid fa-user"></i>`;
  contactNameInput.value = "";
  contactPhoneNumberInput.value = "";
  contactEmailInput.value = "";
  contactAddressInput.value = "";
  contactGroupInput.value = "";
  contactNotesInput.value = "";
  contactFavoriteInput.checked = false;
  contactEmergencyInput.checked = false;
}

function displayContact(list) {
  var cardContact = "";
  for (var i = 0; i < list.length; i++) {
    cardContact += `
        <div class="col-md-6 bg">
                  <div class="contact-card-header">
                    <div class="p-3">
                      <div class="d-flex align-items-center gap-3">
                        <div class="logo">
                            ${
                              list[i].img && list[i].img !== ""
                                ? `<img src="${list[i].img}" class="img-fluid" alt="avatar">`
                                : `<span>${list[i].name.slice(0, 2).toUpperCase()}</span>`
                            }

                            ${
                              list[i].favorite
                                ? `<div class="icon-fav-img" onclick="addContactToFavorite(${i})">
                                      <i class="fa-solid fa-star"></i>
                                    </div>
                                  `
                                : ""
                            }

                              ${
                                list[i].emergency
                                  ? `
                                    <div class="icon-emer-img" onclick="addContactToEmergency(${i})">
                                      <i class="fa-solid fa-heart-pulse"></i>
                                    </div>
                                  `
                                  : ""
                              }
                        </div>
                        <div class="content">
                          <h3 id="contactName">${list[i].name}</h3>
                          <p id="contactPhone"><span class=""><i class="fa-solid fa-phone"></i></span> ${list[i].phoneNumber}</p>
                        </div>
                      </div>
                      <div class="contact-card-body">
                        <div class="email d-flex align-items-center gap-3 mt-2">
                          <div class="logo-email">
                            <i class="fa-solid fa-envelope"></i>
                          </div>
                          ${list[i].email}
                        </div>

                        <div class="address d-flex align-items-center gap-3 mt-2">
                          <div class="logo-address">
                            <i class="fa-solid fa-location-dot"></i>
                          </div>
                          ${list[i].address}
                        </div>
                        
                        <div class="select-option d-flex align-items-center gap-3 mt-2">
                        ${list[i].group === "family" ? `<span class="family p-1">family</span>` : ""}
                            ${list[i].group === "friends" ? `<span class="friends p-1">friends</span>` : ""}
                            ${list[i].group === "work" ? `<span class="work p-1">Work</span>` : ""}
                            ${list[i].group === "school" ? `<span class="school p-1">school</span>` : ""}
                            ${list[i].group === "other" ? `<span class="other p-1">other</span>` : ""}
                            ${
                              list[i].emergency
                                ? `
                            <span class="Emergency p-1">
                                <i class="fa-solid fa-heart-pulse me-1"></i>
                                Emergency
                            </span>
                            `
                                : ""
                            }
                        </div>


                      </div>
                    </div>
                    <div class="contact-footer mt-4 rounded-bottom-4 p-2 px-3 d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center gap-2">
                        <a  href="tel:${list[i].phoneNumber}">
                          <div class="logo-phone">
                            <i class="fa-solid fa-phone"></i>
                          </div>
                        </a>
                        <a  href="mailto:${list[i].email}">
                          <div class="logo-email ">
                            <i class="fa-solid fa-envelope"></i>
                          </div>
                        </a>
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        <div class=" ${list[i].favorite == true ? "favv" : "add-favorit"}" onclick="addContactToFavorite(${i})">
                          ${
                            list[i].favorite == true
                              ? `<i class="fa-solid fa-star text-warning"></i>`
                              : `<i class="fa-regular fa-star"></i>`
                          }
                        </div>
                        <div class=" ${list[i].emergency == true ? "Emergancyyy" : "add-Emergency"}" onclick="addContactToEmergency(${i})">
                          ${
                            list[i].emergency == true
                              ? `<i class="fa-solid fa-heart-pulse"></i>`
                              : `<i class="fa-regular fa-heart"></i>`
                          }
                        
                        </div>
                        <div class="add-edit"     data-bs-toggle="modal"
                        data-bs-target="#exampleModal" onclick="setFormToUptate(${i})">
                          <i class="fa-solid fa-pen"></i>
                        </div>
                        <div class="add-delete" onclick="deleteContact(${i})">
                          <i class="fa-solid fa-trash"></i>
                        </div>
                      </div>
                    </div>

                  </div>
                  
                </div>
        `;
  }

  rowContact.innerHTML = cardContact;
}

function deleteContact(deleteIndex) {
  Swal.fire({
    title: "Delete Contact?",
    text: "Are you sure you want to delete this contact?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DC2625",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      contactList.splice(deleteIndex, 1);

      localStorage.setItem("contact", JSON.stringify(contactList));
      if (contactSearchs.value != ``) {
        search();
      } else {
        displayContact(contactList);
      }
      displayFavorite();
      displayEmergency();
      updateStatuesCount();

      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 1100,
      });
    }
  });
}

function search() {
  // console.log('hello');
  var searchElement = contactSearchs.value;
  var searchResult = [];
  for (var i = 0; i < contactList.length; i++) {
    if (
      contactList[i].name
        .toLowerCase()
        .includes(searchElement.trim().toLowerCase()) ||
      contactList[i].phoneNumber
        .toLowerCase()
        .includes(searchElement.trim().toLowerCase()) ||
      contactList[i].email
        .toLowerCase()
        .includes(searchElement.trim().toLowerCase())
    ) {
      searchResult.push(contactList[i]);
    }
  }

  if (searchResult.length == 0) {
    rowContact.innerHTML = `<div>
            <p class='text-center no-found fw-bold fs-3'>NO CONTACT FOUND</p>
        </div>`;
    return;
  }
  displayContact(searchResult);
}

function setFormToUptate(index) {
  updateIndex = index;
  // console.log('update' + updateIndex);
  contactNameInput.value = contactList[updateIndex].name;
  contactPhoneNumberInput.value = contactList[updateIndex].phoneNumber;
  contactEmailInput.value = contactList[updateIndex].email;
  contactAddressInput.value = contactList[updateIndex].address;
  contactGroupInput.value = contactList[updateIndex].group;
  contactNotesInput.value = contactList[updateIndex].noutes;
  contactFavoriteInput.checked = contactList[updateIndex].favorite;
  contactEmergencyInput.checked = contactList[updateIndex].emergency;
}

function getUptadedContact() {
  contactList[updateIndex].name = contactNameInput.value;
  contactList[updateIndex].phoneNumber = contactPhoneNumberInput.value;
  contactList[updateIndex].email = contactEmailInput.value;
  contactList[updateIndex].address = contactAddressInput.value;
  contactList[updateIndex].group = contactGroupInput.value;
  contactList[updateIndex].noutes = contactNotesInput.value;
  contactList[updateIndex].favorite = contactFavoriteInput.checked;
  contactList[updateIndex].emergency = contactEmergencyInput.checked;

  if (contactList[updateIndex].img) {
    avatarPreview.innerHTML = `
        <img src="${contactList[updateIndex].img}"
        class="img-fluid rounded-circle w-100 h-100 object-fit-cover">
        `;
  } else {
    avatarPreview.innerHTML = `
        <span>
            ${contactList[updateIndex].name.slice(0, 2).toUpperCase()}
        </span>
        `;
  }

  localStorage.setItem("contact", JSON.stringify(contactList));
  if (contactSearchs.value != ``) {
    search();
  } else {
    displayContact(contactList);
  }
  displayFavorite();
  displayEmergency();
  clearContactForm();
  modelHide();
}

function displayFavorite() {
  var favCartona = ``;
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].favorite == true) {
      favCartona += `
            <div class="d-flex align-items-center justify-content-between cont">
                <div class="d-flex align-items-center gap-2">
                    <div class="logo">
                      ${
                        contactList[i].img &&
                        contactList[i].img !== "" &&
                        contactList[i].img !== "./images/undefined"
                          ? `<img src="${contactList[i].img}" class="img-fluid" alt="avatar">`
                          : `<span>${contactList[i].name.slice(0, 2).toUpperCase()}</span>`
                      }
                    </div>

                    <div class="content">

                        <h3 class="mb-0">
                            ${contactList[i].name}
                        </h3>

                        <p>
                            ${contactList[i].phoneNumber}
                        </p>

                    </div>

                </div>

                <a href="tel:${contactList[i].phoneNumber}">
                    <i class="fa-solid fa-phone"></i>
                </a>

            </div>
            `;
    }
  }
  if (favCartona == "" || contactList.length == 0) {
    // console.log('sdfsdf');
    favCartona = `<p class="text-secondary text-center fw-semibold fs-6 mb-0">No favorites yet</p>`;
  }
  rowFavorite.innerHTML = favCartona;
}

function addContactToFavorite(favIndex) {
  contactList[favIndex].favorite = !contactList[favIndex].favorite;
  console.log(contactList[favIndex].favorite);

  localStorage.setItem("contact", JSON.stringify(contactList));

  displayContact(contactList);
  displayFavorite();
  updateStatuesCount();
}

function displayEmergency() {
  var emergencyCartona = ``;
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].emergency == true) {
      emergencyCartona += `
                          <div class="d-flex align-items-center justify-content-between cont">
                            <div class="d-flex align-items-center gap-2">
                          
                                <div class="logo">
                                  ${
                                    contactList[i].img &&
                                    contactList[i].img !== "" &&
                                    contactList[i].img !== "./images/undefined"
                                      ? `<img src="${contactList[i].img}" class="img-fluid" alt="avatar">`
                                      : `<span>${contactList[i].name.slice(0, 2).toUpperCase()}</span>`
                                  }
                                </div>
                              <div class="content">
                                <h3 id="" class="mb-0">${contactList[i].name}</h3>
                                <p id="">${contactList[i].phoneNumber}</p>
                              </div>
                            </div>
                            <a href="tel:${contactList[i].phoneNumber}">
                              <i class="fa-solid fa-phone"></i>
                            </a>
                          </div>
    `;
    }
  }
  if (emergencyCartona == ``) {
    emergencyCartona = `<p class="text-secondary text-center fw-semibold fs-6 mb-0">No emergency yet</p>`;
  }
  rowEmergency.innerHTML = emergencyCartona;
}

function addContactToEmergency(emergency) {
  contactList[emergency].emergency = !contactList[emergency].emergency;
  localStorage.setItem("contact", JSON.stringify(contactList));
  displayContact(contactList);
  displayEmergency();
  updateStatuesCount();
}

function updateStatuesCount() {
  totalContactLength.innerHTML = contactList.length;
  var favoriteCount = 0;
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].favorite == true) {
      favoriteCount++;
    }
  }
  totalFavoriteLength.innerHTML = favoriteCount;

  var emergencyCount = 0;
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].emergency == true) {
      emergencyCount++;
    }
  }
  totalEmergencyLength.innerHTML = emergencyCount;
}

function validationForm(element) {
  var regx = {
    contactName: /^[A-Za-z]{3,15}( [A-Za-z]{3,10})?$/,
    contactPhoneNumber: /^01[1205][0-9]{8}$/,
    contactEmail: /(^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$)/,
    contactAddress: /^[a-zA-Z0-9\s,-]{0,50}$/,
    contactNotes: /^[a-zA-Z0-9\s,!-]{0,20}$/,
    avatarInput: /(png|image\/jpeg|image\/jpg|image\/webp)$/,
  };

  if (element.id == "avatarInput") {
    if (element.files.length == 0) {
      return true;
    }
  }

  if (regx[element.id].test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    if (element.nextElementSibling) {
      element.nextElementSibling.classList.add("d-none");
    }
    return true;
  } else {
    element.classList.add("is-invalid");

    element.classList.remove("is-valid");
    if (element.nextElementSibling) {
      element.nextElementSibling.classList.remove("d-none");
    }

    return false;
  }
}
