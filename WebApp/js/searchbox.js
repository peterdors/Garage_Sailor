function initSearchBox()
{
    var searchBox = new google.maps.places.SearchBox(document.getElementById('address'));

    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
    });
}
