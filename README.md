ABOUT THIS PROJECT:
Title Digital Asset Management Application
Description: With limited access to the ecommerce store, I still wanted access to all of the images that I uploaded, so I am working on an HTML, JAVASCRIPT, and CSS solution to create a tool that
utilizes the product export information to access the library of images using various search methods (search all headings, id, displayname, description, product number). 

Here’s a detailed description of how the system is designed to work, broken down into its main processes and sub-processes:

1. Initial Loading and Layout

What Happens:

	•	When the HTML page loads, the browser references the following files:

	•	styles.css for styling.

	•	image_data.js for image metadata.

	•	script.js for all JavaScript logic and functionality.

	•	The header and footer are displayed as fixed elements:

	•	The header contains:

	•	A logo: “Genie DAM.”

	•	A search bar for filtering images.

	•	A dropdown menu (search-category) to choose which category to search (e.g., ID, displayName, description, productNumber).

	•	A clear search button to reset the search.

	•	The footer contains:

	•	A “Download Selected” button to download selected images.

	•	A “Clear Selections” button to deselect all checkboxes.


Sub-processes:

	1.	Lazy Loading Setup:

	•	The gallery starts empty.

	•	The JavaScript initializes by loading the first 30 images from image_data.js.

	•	Additional images are loaded dynamically as the user scrolls (lazy loading).

2. Image Display in the Gallery


What Happens:

	•	Images are displayed in a grid layout:

	•	Each image is displayed as a square thumbnail.

	•	Beneath each thumbnail:

	•	The correct file name is displayed (e.g., 10238.12016GT.JPG).

	•	A checkbox is overlaid on the top-left corner of each image.

	•	The system ensures:

	•	Images are cropped as squares.

	•	Images load efficiently without using excessive memory.

Sub-processes:

	1.	File Name Parsing:

	•	File names are parsed from the images field in the image_data.js dataset, removing unnecessary URL fragments (e.g., %source, %file).

	2.	Lazy Loading Continuation:

	•	As the user scrolls, additional images are loaded in batches of 30 until all images in image_data.js are displayed.

3. Search Functionality


What Happens:

	•	Users can type a query in the search bar and select a category (or “Search All”).

	•	The search dynamically filters images as the user types.


Sub-processes:

	1.	Category Filtering:

	•	If a specific category (e.g., ID, productNumber) is selected, only that field is searched.

	•	If “Search All” is selected, all fields in image_data.js are searched.

	2.	Dynamic Updates:

	•	The gallery is cleared.

	•	Images matching the query are displayed in real-time.



4. Tooltip Interaction

What Happens:

	•	Hovering over an image opens a tooltip:

	•	Displays:

	•	The parsed file name.

	•	Additional metadata (e.g., ID, product number, description).

	•	Contains:

	•	A “View” button to open the modal window for detailed interaction.

	•	A “Download” button to download the image directly.


Sub-processes:


	1.	Tooltip Display:

	•	The tooltip appears on hover and follows the cursor position.

	•	It does not disappear prematurely, ensuring users can interact with it.

	2.	Immediate Download:

	•	Clicking the “Download” button fetches the image URL and triggers a download to the user’s default folder.


5. Modal Window Interaction


What Happens:

	•	Clicking an image or selecting “View” in the tooltip opens the modal window:

	•	Displays:

	•	The image in larger resolution.

	•	The parsed file name above the image.

	•	All metadata fields below the image.

	•	Buttons:

	•	Select: Toggles the checkbox for that image.

	•	Download: Downloads the image directly.

	•	Close (X): Closes the modal window.

Sub-processes:

	1.	Dynamic Sizing:

	•	The modal resizes to fit the screen while ensuring space for metadata and buttons.

	2.	Interaction Logic:

	•	Select Button: Toggles the corresponding checkbox in the gallery.

	•	Download Button: Fetches the image URL and downloads the file.

	•	Close Button: Closes the modal.


6. Checkbox and Selection Management

What Happens:


	•	Users can select images by clicking the checkboxes.

	•	The footer tracks selections:

	•	“Download Selected” triggers a batch download.

	•	“Clear Selections” deselects all checkboxes.


Sub-processes:


	1.	Selection Tracking:

	•	Selected images are stored in an array.

	•	The footer buttons are updated based on the current selections.

	2.	Batch Download:

	•	If only one image is selected:

	•	Downloads the image directly.

	•	If multiple images are selected:

	•	Fetches the URLs of all selected images.

	•	Zips the images into a single file.

	•	Prompts the user to download the ZIP file.


7. Lazy Loading and Performance Optimization


What Happens:


	•	Images are loaded in batches as the user scrolls.

	•	This prevents memory overload and ensures smooth scrolling.


Sub-processes:


	1.	Scroll Detection:

	•	JavaScript listens for the scroll event.

	•	When the user nears the bottom of the page, more images are loaded.

	2.	Batch Loading:

	•	Images are loaded in groups of 30.

	•	The process continues until all images are displayed.


8. Error Handling and Edge Cases

What Happens:

	•	Handles cases where:

	•	Metadata is missing or incomplete.

	•	URLs are malformed.

	•	Selected files fail to download.


Sub-processes:


	1.	Error Display:

	•	Logs errors in the console for debugging.

	•	Displays a user-friendly message if downloads fail.

	2.	Data Validation:

	•	Ensures each image entry in image_data.js has valid metadata.

	•	Skips entries with missing or invalid URLs.


Expected User Workflow


	1.	Open the app: The gallery loads with the first 30 images from JSON file embeded in image_data.js file.

	2.	Browse images: Scroll through the gallery, hover over images to see tooltips.

	3.	Search: Type queries to filter images dynamically.

	4.	View details: Click an image or select “View” in the tooltip to open the modal window.

	5.	Select images: Use checkboxes to mark desired images or toggle the selection using the select button found in the Modal window.

	6.	Download: Click “Download Selected” to download the files (individually or as a ZIP).

	7.	Clear selections: Use “Clear Selections” to reset checkboxes.


Key Functional Enhancements

	•	Consistent header and footer design.

	•	Lazy loading for performance.

	•	Dynamic search across categories.

	•	Robust tooltip and modal interactions.

	•	File name parsing and metadata display.

	•	Seamless download functionality (individual and batch).

Future Functionality

  •	multiple displays sizes: small (current size image thumbnails 5 images across), larger thumbnails (3 images across) the images should increase and decrease in size depending on the size of browser window using FLEXBOX javascript coding

	•	In addition to large grid and small grid, I would like to include an option for list view, which includes a checkbox on the very left, a 100x100px thumbnail, and a download (individual download) button to the right, and from there, left to right, all of thee data from the image_data.js file. The image can still be clicked for the modal window view. 

	•	A method for bulk search or download: User can upload a csv file or excel file. It will allow the user to select a heading to match, for example, if I have column full of part numbers, it will query all of the part numbers and either populate them (utilizing lazy loading if there are a lot) or simply give the option to download all of them. 

