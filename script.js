// DOM Elements
const gallery = document.getElementById('gallery');
const searchBar = document.getElementById('search-bar');
const searchCategory = document.getElementById('search-category');
const clearSearchBtn = document.getElementById('clear-search');
const tooltip = document.getElementById('tooltip');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalFileName = document.getElementById('modal-file-name');
const modalMetaData = document.getElementById('modal-meta-data');
const closeModal = document.getElementById('close-modal');
const modalSelect = document.getElementById('modal-select');
const modalDownload = document.getElementById('modal-download');
const downloadSelectedBtn = document.getElementById('download-selected');
const clearSelectionsBtn = document.getElementById('clear-selections');

// Global State
let selectedImages = [];
let lazyLoadIndex = 0;
const lazyLoadBatchSize = 30;

// Function to Render Gallery
function renderGallery(data) {
    gallery.innerHTML = '';
    const batch = data.slice(lazyLoadIndex, lazyLoadIndex + lazyLoadBatchSize);
    lazyLoadIndex += lazyLoadBatchSize;

    batch.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');
        galleryItem.innerHTML = `
            <input type="checkbox" data-file="${item.images[0]}" />
            <img src="${item.images[0]}" alt="${item.displayName}" data-id="${item.ID}" />
            <p>${item.images[0].split('/').pop()}</p>
        `;
        gallery.appendChild(galleryItem);

        // Tooltip Event
        galleryItem.addEventListener('mouseover', () => showTooltip(item, galleryItem));
        galleryItem.addEventListener('mouseout', () => hideTooltip());
        galleryItem.querySelector('img').addEventListener('click', () => openModal(item));
    });
}

// Tooltip Functions
function showTooltip(item, element) {
    tooltip.innerHTML = `
        <p><strong>File:</strong> ${item.images[0].split('/').pop()}</p>
        <p><strong>ID:</strong> ${item.ID}</p>
        <p><strong>Display Name:</strong> ${item.displayName}</p>
        <p><strong>Description:</strong> ${item.description}</p>
        <button onclick="downloadFile('${item.images[0]}')">Download</button>
    `;
    const rect = element.getBoundingClientRect();
    tooltip.style.top = `${rect.top + window.scrollY}px`;
    tooltip.style.left = `${rect.left + rect.width}px`;
    tooltip.classList.add('visible');
}

function hideTooltip() {
    tooltip.classList.remove('visible');
}

// Modal Functions
function openModal(item) {
    modalImage.src = item.images[0];
    modalFileName.textContent = item.images[0].split('/').pop();
    modalMetaData.innerHTML = `
        <p><strong>ID:</strong> ${item.ID}</p>
        <p><strong>Display Name:</strong> ${item.displayName}</p>
        <p><strong>Description:</strong> ${item.description}</p>
    `;
    modal.classList.add('visible');
}

function closeModalWindow() {
    modal.classList.remove('visible');
}

closeModal.addEventListener('click', closeModalWindow);

// Download and Clear Functions
function downloadFile(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    link.click();
}

downloadSelectedBtn.addEventListener('click', () => {
    if (selectedImages.length === 1) {
        downloadFile(selectedImages[0]);
    } else if (selectedImages.length > 1) {
        // ZIP functionality to be added
        alert('ZIP creation is not yet implemented.');
    }
});

clearSelectionsBtn.addEventListener('click', () => {
    selectedImages = [];
    document.querySelectorAll('.gallery-item input[type="checkbox"]').forEach(cb => cb.checked = false);
});

// Search Functionality
searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();
    const category = searchCategory.value;

    const filteredData = imageData.filter(item => {
        if (category === 'all') {
            return Object.values(item).some(val => String(val).toLowerCase().includes(query));
        }
        return String(item[category]).toLowerCase().includes(query);
    });

    lazyLoadIndex = 0; // Reset lazy loading
    renderGallery(filteredData);
});

clearSearchBtn.addEventListener('click', () => {
    searchBar.value = '';
    lazyLoadIndex = 0;
    renderGallery(imageData);
});

// Lazy Load
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        renderGallery(imageData);
    }
});

// Initial Render
renderGallery(imageData);
