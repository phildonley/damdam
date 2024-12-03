// Fetch data from embedded JSON-like structure
const imageData = [
    // JSON data structure here
];

// Elements
const galleryContainer = document.getElementById("gallery-container");
const searchInput = document.getElementById("search-input");
const searchCategory = document.getElementById("search-category");
const clearSearchBtn = document.getElementById("clear-search");
const downloadSelectedBtn = document.getElementById("download-selected");
const clearSelectionBtn = document.getElementById("clear-selection");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalInfo = document.getElementById("modal-info");
const modalSelect = document.getElementById("modal-select");
const modalDownload = document.getElementById("modal-download");
const closeButton = document.querySelector(".close-button");

let selectedImages = [];
let currentModalImage = null;

// Populate Gallery
function populateGallery(filteredData = imageData) {
    galleryContainer.innerHTML = ""; // Clear existing images
    filteredData.forEach((item) => {
        item.images.forEach((imageURL) => {
            const imageWrapper = document.createElement("div");
            imageWrapper.className = "image-wrapper";

            const img = document.createElement("img");
            img.src = imageURL;
            img.alt = item.displayName;
            img.addEventListener("click", () => openModal(item, imageURL));

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.addEventListener("change", () => toggleSelection(imageURL));

            const label = document.createElement("label");
            label.textContent = imageURL.split("/").pop(); // Parse file name

            imageWrapper.append(img, checkbox, label);
            galleryContainer.appendChild(imageWrapper);
        });
    });
}

// Search Functionality
function searchImages() {
    const query = searchInput.value.toLowerCase();
    const category = searchCategory.value;

    const filteredData = imageData.filter((item) => {
        if (category === "all") {
            return Object.values(item).some((value) =>
                value.toString().toLowerCase().includes(query)
            );
        }
        return item[category]?.toString().toLowerCase().includes(query);
    });

    populateGallery(filteredData);
}

// Modal Functionality
function openModal(item, imageURL) {
    currentModalImage = imageURL;
    modalImage.src = imageURL;
    modalInfo.textContent = `Product: ${item.productNumber}`;
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
    currentModalImage = null;
}

// Selection Functionality
function toggleSelection(imageURL) {
    if (selectedImages.includes(imageURL)) {
        selectedImages = selectedImages.filter((url) => url !== imageURL);
    } else {
        selectedImages.push(imageURL);
    }
}

// Download Functionality
function downloadImages() {
    if (selectedImages.length === 1) {
        const link = document.createElement("a");
        link.href = selectedImages[0];
        link.download = selectedImages[0].split("/").pop();
        link.click();
    } else if (selectedImages.length > 1) {
        // Logic to bundle images into zip and download
    }
}

// Event Listeners
searchInput.addEventListener("input", searchImages);
clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    populateGallery();
});
downloadSelectedBtn.addEventListener("click", downloadImages);
clearSelectionBtn.addEventListener("click", () => {
    selectedImages = [];
    document.querySelectorAll("input[type='checkbox']").forEach((cb) => {
        cb.checked = false;
    });
});
closeButton.addEventListener("click", closeModal);

populateGallery(); // Initial Load
