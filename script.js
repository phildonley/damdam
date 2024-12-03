const gallery = document.getElementById("gallery");
const tooltip = document.getElementById("tooltip");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalFileName = document.getElementById("modal-file-name");
const modalMetadata = document.getElementById("modal-metadata");
const modalClose = document.getElementById("modal-close");
const modalSelect = document.getElementById("modal-select");
const modalDownload = document.getElementById("modal-download");
const searchCategory = document.getElementById("search-category");
const searchBar = document.getElementById("search-bar");
const clearSearch = document.getElementById("clear-search");
const downloadSelected = document.getElementById("download-selected");
const clearSelections = document.getElementById("clear-selections");

let selectedItems = new Set();
let filteredData = [...imageData]; // Keep a copy of the filtered data for search
let lazyLoadIndex = 0;

// Populate the gallery with lazy loading
function populateGallery(startIndex = 0, batchSize = 30) {
    const fragment = document.createDocumentFragment();
    const endIndex = Math.min(startIndex + batchSize, filteredData.length);
    for (let i = startIndex; i < endIndex; i++) {
        const image = filteredData[i];
        const div = document.createElement("div");
        div.classList.add("gallery-item");
        div.innerHTML = `
            <img src="${image.images[0]}" alt="${image.displayName}" data-index="${i}">
            <input type="checkbox" data-index="${i}">
            <p>${image.images[0].split("/products/")[1]}</p>
        `;
        fragment.appendChild(div);
    }
    gallery.appendChild(fragment);
    lazyLoadIndex = endIndex;
}

// Lazy load on scroll
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        populateGallery(lazyLoadIndex);
    }
});

// Tooltip functionality
gallery.addEventListener("mouseover", (e) => {
    const target = e.target.closest(".gallery-item img");
    if (target) {
        const index = target.dataset.index;
        const image = filteredData[index];
        tooltip.innerHTML = `
            <p>File Name: ${image.images[0].split("/products/")[1]}</p>
            <p>ID: ${image.ID}</p>
            <p>Display Name: ${image.displayName}</p>
            <p>Description: ${image.description || "N/A"}</p>
            <p>Product Number: ${image.productNumber}</p>
            <button data-index="${index}" class="tooltip-view">View</button>
            <button data-index="${index}" class="tooltip-download">Download</button>
        `;
        tooltip.classList.remove("hidden");
    }
});

// Close tooltip on mouseout
gallery.addEventListener("mouseout", () => {
    tooltip.classList.add("hidden");
});

// Modal functionality
gallery.addEventListener("click", (e) => {
    const target = e.target.closest(".gallery-item img");
    if (target) {
        const index = target.dataset.index;
        const image = filteredData[index];
        modalFileName.textContent = image.images[0].split("/products/")[1];
        modalImage.src = image.images[0];
        modalMetadata.innerHTML = `
            <p>ID: ${image.ID}</p>
            <p>Display Name: ${image.displayName}</p>
            <p>Description: ${image.description || "N/A"}</p>
            <p>Product Number: ${image.productNumber}</p>
        `;
        modal.classList.remove("hidden");
    }
});

// Close modal
modalClose.addEventListener("click", () => modal.classList.add("hidden"));

// Search functionality
searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    const category = searchCategory.value;
    filteredData = imageData.filter((image) => {
        if (category === "all") {
            return Object.values(image).some((value) => String(value).toLowerCase().includes(query));
        }
        return String(image[category]).toLowerCase().includes(query);
    });
    gallery.innerHTML = "";
    lazyLoadIndex = 0;
    populateGallery();
});

// Clear search
clearSearch.addEventListener("click", () => {
    searchBar.value = "";
    filteredData = [...imageData];
    gallery.innerHTML = "";
    lazyLoadIndex = 0;
    populateGallery();
});

// Handle downloads
downloadSelected.addEventListener("click", async () => {
    if (selectedItems.size === 0) return;
    const zip = new JSZip();
    for (const index of selectedItems) {
        const image = filteredData[index];
        const fileName = image.images[0].split("/products/")[1];
        const blob = await fetch(image.images[0]).then((res) => res.blob());
        zip.file(fileName, blob);
    }
    zip.generateAsync({ type: "blob" }).then((content) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = `selected_images_${Date.now()}.zip`;
        a.click();
    });
});

// Clear selections
clearSelections.addEventListener("click", () => {
    selectedItems.clear();
    document.querySelectorAll(".gallery-item input[type='checkbox']").forEach((cb) => {
        cb.checked = false;
    });
});
