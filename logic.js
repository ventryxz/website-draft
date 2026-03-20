const search = document.getElementById("search");
const button = document.getElementById("button");
const container = document.getElementById("container");
const foodSpots = [
    { name: "Seoul BBQ", type: "Korean", top: "40%", left: "50%" },
    { name: "Busan Bistro", type: "Seafood", top: "70%", left: "80%" },
    { name: "Kimchi Palace", type: "Korean", top: "30%", left: "45%" },
    { name: "Noodle House", type: "Ramen", top: "55%", left: "60%" }
];
button.addEventListener("click", function(){
    const query = search.value.toLowerCase();
    
    // 1. Find the matching restaurants
    const matches = foodSpots.filter(spot => 
        spot.name.toLowerCase().includes(query) || 
        spot.type.toLowerCase().includes(query)
    );

    // 2. Clear old markers (if any)
    const oldMarkers = document.querySelectorAll('.marker');
    oldMarkers.forEach(m => m.remove());

    // 3. Place new markers on the map
    matches.forEach(spot => {
        createMarker(spot);
    });


});
function createMarker(spot) {
    const marker = document.createElement("div");
    marker.classList.add("marker");
    
    // Position the marker based on the data
    marker.style.top = spot.top;
    marker.style.left = spot.left;
    
    // Add a tooltip or alert when clicked
    marker.addEventListener("click", () => {
        alert(`Welcome to ${spot.name}! We serve ${spot.type} food.`);
    });

    container.appendChild(marker);
}