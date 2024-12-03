const gallery = document.getElementById("gallery");
const searchBar = document.getElementById("searchBar");
const searchFilter = document.getElementById("searchFilter");
const clearSearch = document.getElementById("clearSearch");
const downloadSelected = document.getElementById("downloadSelected");
const clearSelections = document.getElementById("clearSelections");
const tooltip = document.getElementById("tooltip");
const tooltipFileName = document.getElementById("tooltipFileName");
const tooltipView = document.getElementById("tooltipView");
const tooltipDownload = document.getElementById("tooltipDownload");
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
      img.addEventListener("mouseenter", (e) => showTooltip(e, imgUrl, item));
      img.addEventListener("mouseleave", hideTooltip);

      const fileNameDiv = document.createElement("div");
      fileNameDiv.className = "file-name";
      fileNameDiv.textContent = parseFileName(imgUrl);

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

      imgContainer.appendChild(img);
      imgContainer.appendChild(fileNameDiv);
      imgContainer.appendChild(checkbox);
      gallery.appendChild(imgContainer);
    });
  });
}

function showTooltip(event, imgUrl, item) {
  tooltip.style.display = "block";
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY + 10}px`;
  tooltipFileName.textContent = parseFileName(imgUrl);
  tooltipView.onclick = () => viewImage(imgUrl, item);
  tooltipDownload.onclick = () => downloadFile(imgUrl);
}

function hideTooltip() {
  tooltip.style.display = "none";
}

function viewImage(url, item) {
  modalImage.src = url;
  modalFileName.textContent = parseFileName(url);
  modalMetaData.innerHTML = `
    <div>ID: ${item.ID}</div>
    <div>Display Name: ${item.displayName}</div>
    <div>Description: ${item.description}</div>
    <div>Product Number: ${item.productNumber}</div>
  `;
  modal.classList.remove("hidden");
}

function downloadFile(url) {
  const a = document.createElement("a");
  a.href = url;
  a.download = parseFileName(url);
  a.click();
}

modalClose.addEventListener("click", () => modal.classList.add("hidden"));

// Initialize
currentData = imageData;
renderGallery(currentData);
