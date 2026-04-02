
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
const foodSpots = [
    { name: "Seoul BBQ", type: "Korean", lat: 37.5665, lng: 126.9780 },
    { name: "Busan Bistro", type: "Seafood", lat: 35.1796, lng: 129.0756 },
    { name: "Kimchi Palace", type: "Korean", lat: 37.2636, lng: 127.0286 },
    { name: "Noodle House", type: "Ramen", lat: 35.8242, lng: 127.1480 }
];

let map;
let activeMarkers = [];

function initMap(){
    const southKoreaCenter = { lat:35.9078, lng: 127.7669 };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: southKoreaCenter,
        mapTypeId: "roadmap"
    });
}

const search = document.getElementById("search");
const button = document.getElementById("button");

button.addEventListener("click", function(){
    const query = search.value.toLowerCase();
    
    // 1. Clear old markers from the map
   activeMarkers.forEach(marker => {
        marker.setMap(null); //for each marker in the array, set it to null to clear the map
   });
   activeMarkers = []; //remove each marker from the array
    // 2. Fidn the matching restaurants
    const matches = foodSpots.filter(spot =>
        spot.name.toLowerCase().includes(query) ||
        spot.type.toLowerCase().includes(query)
    );

    //3. Place new markers on the Google Map
    matches.forEach(spot => {
        createMarker(spot);
    });


});
function createMarker(spot) {
    const marker = new google.maps.Marker({
        position: {lat: spot.lat, lng: spot.lng},
        map: map,
        title: spot.name,
        animation: google.maps.Animation.DROP
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="color: black; padding: 5px;">
                <h3 style="margin: 0 0 5px 0; color: #b7410e;">${spot.name}</h3>
                <p style="margin: 0;">We serve delicious <strong>${spot.type}</strong> food!</p>
            </div>
        `
    });

    // Add a tooltip or alert when clicked
    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    activeMarkers.push(marker);
}