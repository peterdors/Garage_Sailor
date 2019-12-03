// Garage Sailor
// COP 4331, Fall 2019

// searchbox.js
// ============

// Function for adding the Google Maps API SearchBox functionality to the 
// address text box on the sailor and seller page forms. 
// This allows for autocomplete of the users address and to get the address
// accurately from our end.  
function initSearchBox()
{
    var searchBox = new google.maps.places.SearchBox(document.getElementById('address'));

    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
    });
}
