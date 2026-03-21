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

    elmnt.style.backgroundColor = color;

}
document.getElementById("home").click();


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