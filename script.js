const gallery = document.getElementById("gallery");
const searchBar = document.getElementById("searchBar");
const searchFilter = document.getElementById("searchFilter");
const clearSearch = document.getElementById("clearSearch");
const downloadSelected = document.getElementById("downloadSelected");
const clearSelections = document.getElementById("clearSelections");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalFileName = document.getElementById("modalFileName");
const modalSelect = document.getElementById("modalSelect");
const modalDownload = document.getElementById("modalDownload");
const modalClose = document.getElementById("modalClose");

let selectedImages = [];
let currentData = [];
let currentIndex = 0;

function renderGallery(data, append = false) {
  if (!append) {
    gallery.innerHTML = "";
    currentIndex = 0;
  }
  const slice = data.slice(currentIndex, currentIndex + 30);
  currentIndex += 30;

  slice.forEach((item) => {
    item.images.forEach((imgUrl) => {
      const imgContainer = document.createElement("div");
      imgContainer.className = "image-container";

      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = item.displayName;

      const fileName = imgUrl.split("/").pop();

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "select-checkbox";
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          selectedImages.push(imgUrl);
        } else {
          selectedImages = selectedImages.filter((url) => url !== imgUrl);
        }
      });

      const fileLabel = document.createElement("div");
      fileLabel.textContent = fileName;

      img.addEventListener("click", () => {
        openModal(imgUrl, fileName);
      });

      imgContainer.appendChild(img);
      imgContainer.appendChild(checkbox);
      imgContainer.appendChild(fileLabel);
      gallery.appendChild(imgContainer);
    });
  });
}

function openModal(imgUrl, fileName) {
  modalImage.src = imgUrl;
  modalFileName.textContent = fileName;
  modalSelect.onclick = () => {
    const checkbox = document.querySelector(
      `input[type="checkbox"][value="${imgUrl}"]`
    );
    if (checkbox) checkbox.checked = !checkbox.checked;
  };
  modalDownload.onclick = () => {
    window.open(imgUrl, "_blank");
  };
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function lazyLoad() {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    currentIndex < currentData.length
  ) {
    renderGallery(currentData, true);
  }
}

searchBar.addEventListener("input", () => {
  const filter = searchFilter.value;
  const query = searchBar.value.toLowerCase();
  currentData = imageData.filter((item) => {
    if (filter === "all") {
      return (
        item.ID.toString().includes(query) ||
        item.displayName.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.productNumber.toLowerCase().includes(query)
      );
    }
    return item[filter]?.toString().toLowerCase().includes(query);
  });
  renderGallery(currentData);
});

clearSearch.addEventListener("click", () => {
  searchBar.value = "";
  currentData = imageData;
  renderGallery(currentData);
});

window.addEventListener("scroll", lazyLoad);
modalClose.addEventListener("click", closeModal);

// Initial Render
currentData = imageData;
renderGallery(currentData);
