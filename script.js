document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.getElementById("gallery");
    const tooltip = document.getElementById("tooltip");
    const modal = document.getElementById("modal");
    const modalImage = document.getElementById("modal-image");
    const modalMetadata = document.getElementById("modal-metadata");
    const modalClose = document.getElementById("modal-close");
    const modalDownload = document.getElementById("modal-download");
    const modalSelect = document.getElementById("modal-select");
    const searchBox = document.getElementById("search-box");
    const searchCategory = document.getElementById("search-category");
    const clearSearch = document.getElementById("clear-search");
    const downloadSelected = document.getElementById("download-selected");
    const clearSelections = document.getElementById("clear-selections");

    let lazyLoadIndex = 0;
    const lazyLoadBatch = 30;

    const loadImages = (images) => {
        const fragment = document.createDocumentFragment();
        images.forEach((image) => {
            const container = document.createElement("div");
            container.className = "image-container";

            const img = document.createElement("img");
            img.src = image.images[0];
            img.alt = image.displayName;
            img.dataset.metadata = JSON.stringify(image);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "image-checkbox";

            const fileName = document.createElement("p");
            fileName.className = "file-name";
            fileName.textContent = image.images[0].split("/").pop();

            container.appendChild(img);
            container.appendChild(checkbox);
            container.appendChild(fileName);
            fragment.appendChild(container);

            img.addEventListener("click", () => openModal(image));
            img.addEventListener("mouseover", (e) => showTooltip(e, image));
            img.addEventListener("mouseout", hideTooltip);
        });

        gallery.appendChild(fragment);
    };

    const showTooltip = (event, image) => {
        tooltip.textContent = `${image.displayName}\n${image.productNumber}`;
        tooltip.style.top = `${event.clientY + 10}px`;
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.classList.remove("hidden");
    };

    const hideTooltip = () => {
        tooltip.classList.add("hidden");
    };

    const openModal = (image) => {
        modalImage.src = image.images[0];
        modalMetadata.textContent = JSON.stringify(image, null, 2);
        modal.classList.remove("hidden");
    };

    modalClose.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    const searchImages = () => {
        const query = searchBox.value.toLowerCase();
        const category = searchCategory.value;

        const filtered = imageData.filter((image) => {
            if (category === "all") {
                return Object.values(image).some((value) =>
                    value.toString().toLowerCase().includes(query)
                );
            }
            return image[category]
                ?.toString()
                .toLowerCase()
                .includes(query);
        });

        gallery.innerHTML = "";
        loadImages(filtered.slice(0, lazyLoadBatch));
    };

    searchBox.addEventListener("input", searchImages);
    clearSearch.addEventListener("click", () => {
        searchBox.value = "";
        gallery.innerHTML = "";
        loadImages(imageData.slice(0, lazyLoadBatch));
    });

    let selectedImages = [];
    downloadSelected.addEventListener("click", () => {
        if (selectedImages.length === 0) {
            alert("No images selected.");
            return;
        }

        // Add logic for zipping and downloading selected images
        console.log("Download logic pending...");
    });

    clearSelections.addEventListener("click", () => {
        selectedImages = [];
        document.querySelectorAll(".image-checkbox").forEach((checkbox) => {
            checkbox.checked = false;
        });
    });

    window.addEventListener("scroll", () => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight &&
            lazyLoadIndex < imageData.length
        ) {
            lazyLoadIndex += lazyLoadBatch;
            loadImages(
                imageData.slice(lazyLoadIndex, lazyLoadIndex + lazyLoadBatch)
            );
        }
    });

    loadImages(imageData.slice(0, lazyLoadBatch));
});