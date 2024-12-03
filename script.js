const gallery = document.getElementById("gallery");
const searchBar = document.getElementById("searchBar");
const searchFilter = document.getElementById("searchFilter");
const clearSearch = document.getElementById("clearSearch");
const downloadSelected = document.getElementById("downloadSelected");
const clearSelections = document.getElementById("clearSelections");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalFileName = document.getElementById("modalFileName");
const modalMetaData = document.getElementById("modalMetaData");
const modalSelect = document.getElementById("modalSelect");
const modalDownload = document.getElementById("modalDownload");
const modalClose = document.getElementById("modalClose");

let selectedImages = [];
let currentData = [];
let currentIndex = 0;

function parseFileName(url) {
  return url.split("products%2F").pop();
}

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

      const fileName = parseFileName(imgUrl);

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

      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.innerHTML = `
        <div><strong>${fileName}</strong></div>
        <button onclick="viewImage('${imgUrl}', '${fileName}')">View</button>
        <button onclick="downloadImage('${imgUrl}')">Download</button>
      `;

      img.addEventListener("mouseover", () => {
        tooltip.style.display = "block";
      });

      img.addEventListener("mouseout", () => {
        tooltip.style.display = "none";
      });

      imgContainer.appendChild(img);
      imgContainer.appendChild(checkbox);
      imgContainer.appendChild(tooltip);
      gallery.appendChild(imgContainer);
    });
  });
}

function viewImage(url, fileName) {
  modalImage.src = url;
  modalFileName.textContent = fileName;
  modalMetaData.textContent = "Some metadata here";
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

modalClose.addEventListener("click", closeModal);
window.addEventListener("scroll", lazyLoad);

// Initialize
currentData = imageData;
renderGallery(currentData);
