// const saleList = document.querySelector('#garage-sales');
const form = document.querySelector('#add-sale-form');
const sale = document.querySelector('#search-sale-form');
var geocoder;

// Saving Data
if (form)
{
    form.addEventListener('submit', async (e) => 
    {
        e.preventDefault();
        if (form.address.value == '' || form.date.value == '')
        {
            return;
        }
        await db.collection('Sellers').add
        ({
            electronics: form.electronics.checked,
            furniture: form.furniture.checked,
            art: form.art.checked,
            clothing: form.clothing.checked,
            books: form.books.checked,
            bicycles: form.bicycles.checked,
            jewelry: form.jewelry.checked,
            toys: form.toys.checked, 
            other: form.other.checked,
            address: form.address.value,
            date: form.date.valueAsDate,
        }).then(ref => 
        {
            console.log('Added document with ID: ', ref.id);
            console.log(form.date.value);
        });

        form.electronics.checked = false;
        form.furniture.checked = false;
        form.art.checked = false;
        form.clothing.checked = false;
        form.bicycles.checked = false;
        form.jewelry.checked = false;
        form.toys.checked = false;
        form.other.checked = false;
        form.address.value = '';
        form.date.value = '';

        location.href = "SellerTerminal.html";        
    });    
}


if (sale)
{
    sale.addEventListener('submit', async (e) => 
    {
        e.preventDefault();
        var gsale = sale.elements;
        let sales = new Set([]);
        var len = sale.elements.length;
        var element;
        var date;
        var iterator;

        // Add a check for blank address and date
        // have to make another check if date matches date given before throwing it into list
        // need to fix input time as well with the date
        // need to check for duplicates

        date = await gsale[10];
        console.log(date.valueAsDate);

        for (var i = 0; i < len; i++)
        {
            element = gsale[i];
            if (element.type == "checkbox" && element.checked === true)
            {
                await db.collection('Sellers').where(element.id, '==', true).where(date.id, '==', date.valueAsDate).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log("No matching documents");
                        return;
                    }
                    snapshot.forEach(doc => {
                        sales.add(doc.data().address);
                        console.log(doc.id, "=>", doc.data().date);
                    });
                })
                .catch(err => {
                    console.log("Error getting documents", err);
                });

                var arrlen = sales.size;

                console.log("arrlen before =", arrlen);

                console.log(sales);
            }
        }

        iterator = sales.values();

        var latLng = await getGeocode(iterator.next().value);
        var lat = latLng.lat();
        var lng = latLng.lng();

        console.log("Latitude & Longitude: " + lat + ", " + lng);

        // prevent empty strings for date and address, or no boxes checked
        // check for match date and categories.
    
        location.href = "SailorTerminal.html";
    });
}

function initMap()
{
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map); // Existing map object displays directions
    // Create route from existing points used for markers
    const route = {
        origin: dakota,
        destination: frick,
        travelMode: 'DRIVING'
    }
    
    geocoder = new google.maps.Geocoder();
    var searchBox = new google.maps.places.SearchBox(document.getElementById('address'));
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
    });

    directionsService.route(route,
        function(response, status) { // anonymous function to capture directions
          if (status !== 'OK') {
            window.alert('Directions request failed due to ' + status);
            return;
          } else {
            directionsRenderer.setDirections(response); // Add route to the map
            var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
            if (!directionsData) {
              window.alert('Directions request failed');
              return;
            }
            else {
              document.getElementById('msg').innerHTML += " Driving distance is " + directionsData.distance.text + " (" + directionsData.duration.text + ").";
            }
          }
        });
}

const getGeocode = address =>
{
    return new Promise((resolve, reject) => geocoder.geocode(
        {address: address},
        response =>
        {
            resolve(response[0].geometry.location);
        }
    ));
}

