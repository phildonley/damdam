// Select elements
const gallery = document.getElementById('gallery');
const searchBox = document.getElementById('searchBox');
const categorySelector = document.getElementById('categorySelector');
const clearSearchButton = document.getElementById('clearSearch');
const tooltip = document.getElementById('tooltip');
const tooltipFilename = document.getElementById('tooltipFilename');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalFileName = document.getElementById('modalFileName');
const modalMetadata = document.getElementById('modalMetadata');
const modalSelect = document.getElementById('modalSelect');
const modalDownload = document.getElementById('modalDownload');
const downloadSelectedButton = document.getElementById('downloadSelected');
const clearSelectionsButton = document.getElementById('clearSelections');

// Lazy loading variables
let lazyLoadIndex = 0;
const lazyLoadBatchSize = 30;

// Selected items
let selectedItems = new Set();

// Render gallery
function renderGallery(data) {
    data.forEach((item) => {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        const image = document.createElement('img');
        image.src = item.images[0];
        image.alt = item.displayName;
        image.addEventListener('mouseover', () => showTooltip(item, image));
        image.addEventListener('mouseleave', hideTooltip);
        image.addEventListener('click', () => openModal(item));

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => toggleSelection(item));

        const filename = document.createElement('p');
        filename.textContent = parseFileName(item.images[0]);

        imageContainer.appendChild(checkbox);
        imageContainer.appendChild(image);
        imageContainer.appendChild(filename);
        gallery.appendChild(imageContainer);
    });
}

// Tooltip logic
function showTooltip(item, target) {
    const rect = target.getBoundingClientRect();
    tooltip.style.top = `${rect.bottom + window.scrollY}px`;
    tooltip.style.left = `${rect.left}px`;
    tooltip.classList.remove('hidden');
    tooltipFilename.textContent = parseFileName(item.images[0]);
}

function hideTooltip() {
    tooltip.classList.add('hidden');
}

// Modal logic
function openModal(item) {
    modalImage.src = item.images[0];
    modalFileName.textContent = parseFileName(item.images[0]);
    modalMetadata.textContent = `ID: ${item.ID}, Product Number: ${item.productNumber}, Description: ${item.description}`;
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

// Utility functions
function parseFileName(url) {
    const match = url.match(/products%2F(.+?)\.(jpg|jpeg|png|gif)$/i);
    return match ? match[1] : 'Unknown File';
}

function toggleSelection(item) {
    if (selectedItems.has(item)) {
        selectedItems.delete(item);
    } else {
        selectedItems.add(item);
    }
}

// Search functionality
function performSearch() {
    const query = searchBox.value.toLowerCase();
    const category = categorySelector.value;
    const filteredData = imageData.filter((item) => {
        if (category === 'all') {
            return (
                item.ID.toString().includes(query) ||
                item.displayName.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.productNumber.toLowerCase().includes(query)
            );
        } else {
            return item[category]?.toString().toLowerCase().includes(query);
        }
    });
    gallery.innerHTML = '';
    renderGallery(filteredData);
}

// Event listeners
searchBox.addEventListener('input', performSearch);
clearSearchButton.addEventListener('click', () => {
    searchBox.value = '';
    performSearch();
});
modal.querySelector('.close').addEventListener('click', closeModal);

// Initial lazy load
renderGallery(imageData.slice(0, lazyLoadBatchSize));

// Lazy load on scroll
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        lazyLoadIndex += lazyLoadBatchSize;
        renderGallery(imageData.slice(lazyLoadIndex, lazyLoadIndex + lazyLoadBatchSize));
    }
});

// Clear selections
clearSelectionsButton.addEventListener('click', () => {
    selectedItems.clear();
    document.querySelectorAll('.image-container input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = false;
    });
});

// Download selected
downloadSelectedButton.addEventListener('click', () => {
    if (selectedItems.size === 1) {
        // Download single file
        const item = Array.from(selectedItems)[0];
        const link = document.createElement('a');
        link.href = item.images[0];
        link.download = parseFileName(item.images[0]);
        link.click();
    } else if (selectedItems.size > 1) {
        // Bundle selected files into a ZIP (use JSZip for this functionality)
        alert('ZIP download is not implemented yet.');
    }
});
