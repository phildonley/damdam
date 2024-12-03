const gallery = document.getElementById("gallery");
const searchBar = document.getElementById("searchBar");
const searchCategory = document.getElementById("searchCategory");
const clearSearchButton = document.getElementById("clearSearch");
const downloadSelectedButton = document.getElementById("downloadSelected");
const clearSelectionButton = document.getElementById("clearSelection");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalDetails = document.getElementById("modalDetails");
const modalCloseButton = document.getElementById("modalCloseButton");
const selectToggle = document.getElementById("selectToggle");
const modalDownloadButton = document.getElementById("modalDownloadButton");

let selectedImages = new Set();

// Render gallery items
function renderGallery(images) {
    gallery.innerHTML = '';
    images.forEach((image) => {
        const item = document.createElement("div");
        item.classList.add("gallery-item");
        item.innerHTML = `
            <img src="${image.images[0]}" alt="${image.displayName}" data-id="${image.ID}" class="thumbnail" />
            <div class="info">
                <p>${image.images[0].split('/').pop()}</p>
                <input type="checkbox" data-id="${image.ID}" class="select-checkbox" />
            </div>
        `;
        gallery.appendChild(item);

        // Add event listener to the thumbnail
        const thumbnail = item.querySelector(".thumbnail");
        thumbnail.addEventListener("click", () => openModal(image));

        // Add event listener to the checkbox
        const checkbox = item.querySelector(".select-checkbox");
        checkbox.addEventListener("change", () => toggleSelection(image, checkbox.checked));
    });
}

// Open modal
function openModal(image) {
    modalImage.src = image.images[0];
    modalDetails.innerHTML = `
        <p>ID: ${image.ID}</p>
        <p>Name: ${image.displayName}</p>
        <p>Description: ${image.description || 'No description available'}</p>
    `;
    selectToggle.textContent = selectedImages.has(image) ? "Unselect" : "Select";
    modal.classList.remove("hidden");

    // Add event listener to modal buttons
    selectToggle.onclick = () => toggleSelection(image, !selectedImages.has(image));
    modalDownloadButton.onclick = () => downloadImage(image.images[0]);
}

// Close modal
modalCloseButton.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// Toggle selection
function toggleSelection(image, isSelected) {
    if (isSelected) {
        selectedImages.add(image);
    } else {
        selectedImages.delete(image);
    }
    updateSelectedCheckbox(image.ID, isSelected);
}

// Update selected checkbox
function updateSelectedCheckbox(id, isSelected) {
    const checkbox = gallery.querySelector(`.select-checkbox[data-id="${id}"]`);
    if (checkbox) {
        checkbox.checked = isSelected;
    }
}

// Download single image
function downloadImage(url) {
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split('/').pop();
    a.click();
}

// Download selected images as ZIP
function downloadSelected() {
    if (selectedImages.size === 1) {
        const singleImage = Array.from(selectedImages)[0].images[0];
        downloadImage(singleImage);
        return;
    }

    // Create ZIP file logic
    const zip = new JSZip();
    selectedImages.forEach((image) => {
        zip.file(image.images[0].split('/').pop(), fetch(image.images[0]).then((res) => res.blob()));
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = `cxc_image_extract_${new Date().toISOString()}.zip`;
        a.click();
    });
}

// Clear selections
clearSelectionButton.addEventListener("click", () => {
    selectedImages.clear();
    gallery.querySelectorAll(".select-checkbox").forEach((checkbox) => {
        checkbox.checked = false;
    });
});

// Filter images based on search
searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    const category = searchCategory.value;
    const filteredImages = imageData.filter((image) => {
        if (category === "all") {
            return Object.values(image).some((value) => value?.toString().toLowerCase().includes(query));
        }
        return image[category]?.toString().toLowerCase().includes(query);
    });
    renderGallery(filteredImages);
});

// Clear search
clearSearchButton.addEventListener("click", () => {
    searchBar.value = '';
    renderGallery(imageData);
});

// Initial render
renderGallery(imageData);