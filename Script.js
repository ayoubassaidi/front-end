const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-button")
const error = document.getElementById("error")
const results = document.getElementById("results")

searchButton.addEventListener("click", function() {
    error.innerHTML = "";
    results.innerHTML = "";
    let searchValue = searchInput.value;
    
    console.log("Search clicked, value:", searchValue); // Debug
    
    if(searchValue === ""){
        error.innerHTML = "Input is required"
    } else {
        // Show loading message
        results.innerHTML = '<div class="col-12 text-center text-white"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Searching...</p></div>';
        
        let myAPI = new XMLHttpRequest();
        myAPI.open('GET', `https://api.imdbapi.dev/search/titles?query=${searchValue}`);
        myAPI.responseType = "json";
        
        myAPI.onreadystatechange = function() {
            console.log("ReadyState:", myAPI.readyState, "Status:", myAPI.status); // Debug
            
            if (myAPI.readyState === 4) {
                results.innerHTML = ""; // Clear loading
                
                if (myAPI.status === 200) {
                    console.log("Response:", myAPI.response); // Debug
                    
                    if(myAPI.response && myAPI.response.titles && myAPI.response.titles.length > 0) {
                        displayData(myAPI.response.titles)
                    } else {
                        error.innerHTML = "No results found. Try searching for: 'Inception', 'Batman', or 'Avatar'"
                    }
                } else {
                    console.log("Error status:", myAPI.status); // Debug
                    error.innerHTML = "API Error. The IMDB API might be down. Status: " + myAPI.status
                }
            }
        };
        
        myAPI.onerror = function() {
            results.innerHTML = "";
            console.log("Network error"); // Debug
            error.innerHTML = "Network error. Please check your internet connection."
        };
        
        myAPI.send();
    }
})

// Add Enter key support
searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
})

function displayData(data) {
    for(let i=0; i<data.length; i++){
        // Create Bootstrap column
        let dataContainer = document.createElement("div");
        dataContainer.setAttribute("class", "col-lg-3 col-md-4 col-sm-6");
        
        // Create card
        let card = document.createElement("div");
        card.setAttribute("class", "data-info");
        
        let title = document.createElement("h2");
        title.innerText = data[i].originalTitle;
        
        let image = document.createElement("img");
        // Check if image exists
        if(data[i].primaryImage && data[i].primaryImage.url) {
            image.setAttribute("src", data[i].primaryImage.url);
        } else {
            image.setAttribute("src", "https://via.placeholder.com/300x450?text=No+Image");
        }
        image.setAttribute("alt", data[i].originalTitle);
        
        card.appendChild(title)
        card.appendChild(image)
        dataContainer.appendChild(card)
        results.appendChild(dataContainer)
    }
}