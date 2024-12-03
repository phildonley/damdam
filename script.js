// Elements
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

// Helper Functions
function renderGallery(data) {
  gallery.innerHTML = ""; // Clear existing images
  data.forEach((item) => {
    item.images.forEach((imgUrl) => {
      const imgContainer = document.createElement("div");
      imgContainer.className = "image-container";
      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = item.displayName;

      // Tooltip
      img.title = `ID: ${item.ID}\nName: ${item.displayName}\nProduct Number: ${item.productNumber}`;

      // File Name
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
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

// Event Listeners
searchBar.addEventListener("input", () => {
  const filter = searchFilter.value;
  const query = searchBar.value.toLowerCase();
  const filteredData = imageData.filter((item) => {
    if (filter === "all") {
      return (
        item.ID.toString().includes(query) ||
        item.displayName.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.productNumber.toLowerCase().includes(query)
      );
    }
    return item[filter]?.toString().toLowerCase().includes(query);
  });
  renderGallery(filteredData);
});

clearSearch.addEventListener("click", () => {
  searchBar.value = "";
  renderGallery(imageData);
});

downloadSelected.addEventListener("click", () => {
  if (selectedImages.length === 1) {
    window.open(selectedImages[0], "_blank");
  } else if (selectedImages.length > 1) {
    // Zip logic here...
  }
});

modalClose.addEventListener("click", closeModal);

// Initial Render
renderGallery(imageData);
