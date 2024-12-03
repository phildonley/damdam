// Select elements
const gallery = document.getElementById('gallery');
const searchBox = document.getElementById('searchBox');
const categorySelector = document.getElementById('categorySelector');
const clearSearchButton = document.getElementById('clearSearch');
const tooltip = document.getElementById('tooltip');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalMetadata = document.getElementById('modalMetadata');
const modalSelect = document.getElementById('modalSelect');
const modalDownload = document.getElementById('modalDownload');

// Lazy loading variables
let lazyLoadIndex = 0;
const lazyLoadBatchSize = 30;

// Selected items
let selectedItems = new Set();

// Render gallery
function renderGallery(data) {
    gallery.innerHTML = ''; // Clear previous items
    data.forEach((item, index) => {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        imageContainer.dataset.index = index;

        const image = document.createElement('img');
        image.src = item.images[0]; // Show the first image
        image.alt = item.displayName;
        image.addEventListener('mouseover', () => showTooltip(item, image));
        image.addEventListener('mouseleave', hideTooltip);

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
    modalMetadata.textContent = `ID: ${item.ID}, Product Number: ${item.productNumber}`;
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
    renderGallery(filteredData);
}

// Event listeners
searchBox.addEventListener('input', performSearch);
clearSearchButton.addEventListener('click', () => {
    searchBox.value = '';
    performSearch();
});

// Initial lazy load
renderGallery(imageData.slice(0, lazyLoadBatchSize));

// Lazy load on scroll
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        lazyLoadIndex += lazyLoadBatchSize;
        renderGallery(imageData.slice(0, lazyLoadIndex + lazyLoadBatchSize));
    }
});
