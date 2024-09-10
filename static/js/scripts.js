// <!-- dark mode toggle -->
      const toggleswitch = document.getElementById("flexSwitchCheckDefault");

      toggleswitch.addEventListener("change", () => {
        // Select the <html> tag
        const htmltag = document.documentElement;

        if (toggleswitch.checked) {
          // Set data-bs-theme to dark
          htmltag.setAttribute("data-bs-theme", "dark");
        } else {
          // Set data-bs-theme to light
          htmltag.setAttribute("data-bs-theme", "light");
        }
      });

    // <!-- pdf viewer -->
    
      // Set the worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

      let pdfDoc = null;
      let currentPage = 1;
      let currentPdf = "";
      let selectedYear = "";
      let searchTerm = "";

      // Function to select and load a PDF
      function selectPDF(pdfUrl, selectedText) {
        document.getElementById("faculty").innerText = selectedText;
        currentPdf = pdfUrl;
        loadPDF();
      }

      // Asynchronous function to load the PDF
      async function loadPDF() {
        if (!currentPdf) return;
        try {
          pdfDoc = await pdfjsLib.getDocument(currentPdf).promise;
          renderAllPages();
          //renderPage(currentPage);
        } catch (error) {
          console.error("Error loading PDF:", error);
        }
      }

      //function to render all the pdf pages
      async function renderAllPages() {
        const pdfViewer = document.getElementById("pdf-viewer");
        pdfViewer.innerHTML = "";

        const numPages = pdfDoc.numPages;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);

          const pageContainer = document.createElement("div");
          pageContainer.classList.add("pdf-page-container");
          pdfViewer.appendChild(pageContainer);

          const viewport = page.getViewport({ scale: 1.3 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          pageContainer.appendChild(canvas);

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
        }
      }


      // filter pdf by year
      async function filterByYear(year) {
        selectedYear = year;
        document.getElementById("year").innerText = selectedYear;
        if (!currentPdf) return;

        try {
          const matchingPages = await findPagesWithYear(pdfDoc, selectedYear);

          if (matchingPages.length > 0) {
            renderMatchingPages(pdfDoc, matchingPages);
          } else console.log("No matching pages found");
        } catch (error) {
          console.error("Error searching for selected year:", error);
        }
      }

      // search
      async function searchPdf() {
        searchTerm = document.getElementById("search-bar").value.trim();

        if (!currentPdf || !searchTerm) return;

        try {
          const matchingPages = selectedYear
            ? await findPagesWithYear(pdfDoc, selectedYear)
            : Array.from({ length: pdfDoc.numPages }, (_, i) => i + 1);

          const matchingSearchPages = await findPagesWithSearchTerm(
            matchingPages,
            searchTerm
          );

          const errorMessage = document.getElementById("error-message")

          if (matchingSearchPages.length > 0) {
            renderMatchingPages(pdfDoc, matchingSearchPages);
            errorMessage.style.display = "none"
          } else {
            console.log("No matching search results found");
            errorMessage.innerHTML = `No matching search results found for "<strong>${searchTerm}</strong>".`;
            errorMessage.style.display = "block"
            errorMessage.style.color = "red"
          }
        } catch (error) {
          console.error("Error searching PDf:", error);
        }
      }
      // extract text from page
      async function extractTextFromPage(pdfDoc, pageNum) {
        const page = await pdfDoc.getPage(pageNum);
        const textContext = await page.getTextContent();
        let pageText = "";

        textContext.items.forEach(function (item) {
          pageText += item.str + " ";
        });

        return pageText;
      }
      // filter by year
      async function findPagesWithYear(pdfDoc, selectedYear) {
        const totalPages = pdfDoc.numPages;
        const matchingPages = [];

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const pageText = await extractTextFromPage(pdfDoc, pageNum);
          if (pageText.includes(selectedYear)) {
            matchingPages.push(pageNum);
          }
        }
        return matchingPages;
      }

      // Find pages
      async function findPagesWithSearchTerm(matchingPages, searchTerm) {
        const matchingSearchPages = [];

        for (const pageNum of matchingPages) {
          const pageText = await extractTextFromPage(pdfDoc, pageNum);
          if (pageText.toLowerCase().includes(searchTerm.toLowerCase())) {
            matchingSearchPages.push(pageNum);
          }
        }
        return matchingSearchPages;
      }

      // render only matching pages with search
      async function renderMatchingPages(pdfDoc, matchingPages) {
        const pdfViewer = document.getElementById("pdf-viewer");
        pdfViewer.innerHTML = "";

        for (const pageNum of matchingPages) {
          const page = await pdfDoc.getPage(pageNum);

          const pageContainer = document.createElement("div");
          pageContainer.classList.add("pdf-page-container");
          pdfViewer.appendChild(pageContainer);

          const viewport = page.getViewport({ scale: 1.3 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          pageContainer.appendChild(canvas);

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
        }
      }

      const searchBar = document.getElementById("search-bar");

      // search bar listener
      searchBar.addEventListener("keydown", function (event) {
        if (event.key === "Enter") searchPdf();
      });

// Function to send the year and course code to Flask
function sendDataToFlask() {
  const courseCode = document.getElementById("search-bar").value.trim(); // Get course code from the search bar
  const selectedYear = document.getElementById("year").innerText.trim(); // Get selected year from the dropdown
  const pdfViewer = document.getElementById("pdf-viewer");
  const errorPost = document.getElementById("error-POST");

  console.log(courseCode, selectedYear)

  // Check if more than one PDF page is rendered
  if (pdfViewer.children.length > 1) {
    // Show an error message if more than one page is displayed
    errorPost.style.display = "block";
    errorPost.innerHTML = "More than one timetable is visible. Narrow your search (e.g. by typing in Course Code).";
  } else if (courseCode && selectedYear) {
    // Hide the error if the conditions are met and send the data
    errorPost.style.display = "none";

    fetch('/process-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        course_code: courseCode, // Sending the course code
        year: selectedYear // Sending the selected year
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log('Data successfully sent to Flask');
      } else {
        console.error('Error sending data to Flask');
      }
    })
    .catch((error) => console.error('Error:', error));
  } else {
    // If course code or year is missing, show an error
    errorPost.style.display = "block";
    errorPost.innerHTML = "Please fill in both the course code and year.";
  }
}
    