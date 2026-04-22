
        function openPage(pageName, elmnt, color){
            var i, tabcontent, tablinks;

            tabcontent = document.getElementsByClassName("tabcontent");
            for(i = 0; i < tabcontent.length; i++)
            {
                tabcontent[i].style.display = "none";

            }

            tablinks = document.getElementsByClassName("tablink");
            for(i = 0; i < tablinks.length; i++)
            {
                tablinks[i].style.backgroundColor = "";
            }

            document.getElementById(pageName).style.display = "block";

            const slideAnim = document.getElementById(pageName).querySelectorAll('.slidein');
            slideAnim.forEach(el => {
                el.style.animation = "none";
                el.offsetHeight; // Trigger a "reflow" (this is a magic JS trick)
                el.style.animation = null; // Re-enables the CSS animation
            });

            typewriteTexts = document.getElementById(pageName).getElementsByClassName("typewrite");
            for(i = 0; i < typewriteTexts.length; i++)
            {
                typewriter(typewriteTexts[i]);
            }

            
            elmnt.style.backgroundColor = "#323437";
            function blink(){
                elmnt.style.backgroundColor = color;
            }
            setTimeout(blink, 100);
            elmnt.style.backgroundColor = "#323437";
            
        }

        function typewriter(elmnt){
            if (elmnt.typingTimer) {
                clearTimeout(elmnt.typingTimer);
            }
            if (!elmnt.getAttribute("data-text")) {
                elmnt.setAttribute("data-text", elmnt.innerHTML);
            }

            // Now, ALWAYS pull the text from the "backup" label
            const text = elmnt.getAttribute("data-text");

            elmnt.innerHTML = "";
            let speed = elmnt.getAttribute("data-speed");

            if(isNaN(speed))
            {
                speed = 100;
            }
            
            var i = 0;
            function type(){
                if(i < text.length){
                    if(text.substring(i, i+4) === "<br>")
                    {
                        elmnt.innerHTML += "<br>";
                        i += 4;
                        type();
                    }else
                    {
                        elmnt.innerHTML += text.charAt(i);
                        i++;
                    }
                    elmnt.typingTimer = setTimeout(type, speed);
                }
            }
            type();
        }



    //map
// --- UI LOGIC (Tabs & Animations) ---
function openPage(pageName, elmnt, color){
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for(i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablink");
    for(i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    document.getElementById(pageName).style.display = "block";

    const slideAnim = document.getElementById(pageName).querySelectorAll('.slidein');
    slideAnim.forEach(el => {
        el.style.animation = "none";
        el.offsetHeight; // Trigger a "reflow"
        el.style.animation = null; // Re-enables the CSS animation
    });

    const typewriteTexts = document.getElementById(pageName).getElementsByClassName("typewrite");
    for(i = 0; i < typewriteTexts.length; i++) {
        typewriter(typewriteTexts[i]);
    }

    elmnt.style.backgroundColor = "#323437";
    function blink(){
        elmnt.style.backgroundColor = color;
    }
    setTimeout(blink, 100);
    elmnt.style.backgroundColor = "#323437";
}

function typewriter(elmnt){
    if (elmnt.typingTimer) {
        clearTimeout(elmnt.typingTimer);
    }
    if (!elmnt.getAttribute("data-text")) {
        elmnt.setAttribute("data-text", elmnt.innerHTML);
    }

    const text = elmnt.getAttribute("data-text");
    elmnt.innerHTML = "";
    let speed = parseInt(elmnt.getAttribute("data-speed"));

    if(isNaN(speed)) {
        speed = 100;
    }
    
    var i = 0;
    function type(){
        if(i < text.length){
            if(text.substring(i, i+4) === "<br>") {
                elmnt.innerHTML += "<br>";
                i += 4;
                type();
            } else {
                elmnt.innerHTML += text.charAt(i);
                i++;
            }
            elmnt.typingTimer = setTimeout(type, speed);
        }
    }
    type();
}

// --- GOOGLE MAPS LOGIC ---
let map;
let infoWindow;
let activeMarkers = [];

async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { Place } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const southKoreaCenter = { lat: 37.5665, lng: 126.9780 };

    map = new Map(document.getElementById("map"), {
        zoom: 12,
        center: southKoreaCenter,
        mapId: "DEMO_MAP_ID", 
    });

    infoWindow = new InfoWindow();

    const searchButton = document.getElementById("button");
    const searchInput = document.getElementById("search");
    const locateButton = document.getElementById("locate-me");

    // 1. SEARCH LOGIC (Corrected)
    searchButton.addEventListener("click", async () => {
        const textQuery = searchInput.value;
        const selectedChips = Array.from(document.querySelectorAll('.ingredient:checked'))
                                .map(el => el.value);
        
        // Base search avoids overly restrictive strings
        const baseSearch = textQuery ? textQuery : "Korean grocery market";
        const fullQuery = `${baseSearch} ${selectedChips.join(" ")}`.trim();

        if (fullQuery.length < 3) {
            alert("Please select an ingredient or type a search term!");
            return;
        }

        // Clear existing markers
        activeMarkers.forEach(m => m.setMap(null));
        activeMarkers = [];

        const currentBounds = map.getBounds();
        
        const request = {
            textQuery: fullQuery,
            fields: ['displayName', 'location', 'formattedAddress', 'rating'],
            maxResultCount: 15,
            language: 'en-US',
            // Use locationBias instead of hard locationRestriction
            locationBias: currentBounds || map.getCenter(), 
        };  

        try {
            const { places } = await Place.searchByText(request);
            
            if (places && places.length > 0) {
                places.forEach(place => createMarker(place));
                
                if (places.length === 1) {
                    map.setZoom(12);
                }
            } else {
                console.warn("No results in this tight view. Zooming out...");
                map.setZoom(map.getZoom() - 2);
                alert("No specialty markets in this area. I've zoomed out—try searching again!");
            }
        } catch (error) {
            console.error("Search failed:", error);
        }
    });

    // 2. CHIP AUTO-SEARCH LOGIC
    document.querySelectorAll('.ingredient').forEach(chip => {
        chip.addEventListener('change', () => {
            searchButton.click(); 
        });
    });

    // 3. GEOLOCATION LOGIC
    locateButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            locateButton.innerText = "⏳";
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    map.panTo(userPos); 
                    map.setZoom(14);

                    google.maps.event.addListenerOnce(map, 'idle', () => {
                        console.log("Map arrived at user location. Searching now...");
                        searchButton.click(); 
                        locateButton.innerText = "📍";
                    });
                },
                (error) => {
                    console.error("Location error:", error);
                    alert("Could not get location. Make sure you clicked 'Allow'.");
                    locateButton.innerText = "📍";
                },
                { enableHighAccuracy: true } 
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    });
}

// 4. MARKER CREATION
function createMarker(place) {
    const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: place.location,
        title: place.displayName,
    });

    marker.addListener("click", () => {
        const content = `
            <div style="color: black; padding: 10px; font-family: sans-serif;">
                <h3 style="margin:0; color: #E63946;">${place.displayName}</h3>
                <p style="margin:5px 0; font-size: 0.9em;">${place.formattedAddress}</p>
                ${place.rating ? `<p style="margin:0;">Rating: ⭐${place.rating}</p>` : ''}
            </div>
        `;
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
    });

    activeMarkers.push(marker);
}