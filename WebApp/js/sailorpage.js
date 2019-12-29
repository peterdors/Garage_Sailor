// Garage Sailor
// COP 4331, Fall 2019

// sailorpage.js
// =============

// Globals. 
var sailor_form_id = "#search-sale-form"
var form = document.querySelector(sailor_form_id);
var geocoder;
var resSales = [];
var distanceService; 
var distFromStart;

if (!form)
{
    console.log("Element with ID " + sailor_form_id + " did not load.");
    window.alert("Something went wrong! Press OK to reload the page.")
    location.href = "SailorPage.html";
}

// Function declarations. 
function initDistanceService()
{
    distanceService = new google.maps.DistanceMatrixService();
}

// Function to retrieve the distance between two addresses utilizing the Google
// Maps API. 
// Parameters take a string format of (start) and (destination). 
// Function returns a promise to resolve the distance.
function get_distance(start, destination)
{ 
    return new Promise((resolve, reject) => distanceService.getDistanceMatrix(
    {
        // Get and place the user input origin and destination from the 
        // website.
        origins: [start],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        durationInTraffic: true,
        avoidHighways: false,
        avoidTolls: false
    },

    response => 
    {
        // Make sure this completes. 
        resolve(response.rows[0].elements[0].distance.text);
        
        // Store the distance retrieved into the global variable for use in 
        // our eventhandler when calculating the distance between sailor 
        // location and garage sale. 
        var distance = response.rows[0].elements[0].distance.text;
        distFromStart = parseFloat(distance);
    }));
}

// Add a check to prevent user inputting previous dates.  
setMinDate();

// Utilizing everything below in the event handler. We make calls to the 
// variables/functions in database.js, and dates.js. 
form.addEventListener('submit', async (e) => 
{

    e.preventDefault();

    var gsale = form.elements;

    let sales = new Set();
    var len = form.elements.length - 1;
    var element;
    var date;
    var iterator;
    var i = 0;

    date = await document.getElementById('date');

    date.type = 'date';
    var dateval = date.valueAsDate;
    var inp = new Date(dateval);

    console.log(inp);

    date.type = 'text';
    
    for (var i = 0; i < len; i++)
    {
        element = gsale[i];
    
        if (element.type == "checkbox" && element.checked === true)
        {   
            await db.collection('Sellers')

            // Checks for duplicates.
            .where(element.value.toLowerCase(), '==', true)
            .where('date', '==', dateval).get()
            .then(snapshot => 
            {
                if (snapshot.empty) 
                {
                    return;
                }
                snapshot.forEach(doc => 
                {
                    sales.add(doc.data().address);
                });
            })
            .catch(err => 
            {
            
            });

            var arrlen = sales.size;
        }
    }

    sales = Array.from(sales);

    let salesDistances = new Array();

    let startAddress = document.getElementById('address').value; 

    document.getElementById("overlay").style.display = "block";

    for (var i = 0; i < sales.length; i++)
    {
        await get_distance(startAddress, sales[i]);
        salesDistances.push({address: sales[i], dist: distFromStart});
    }

    function compare(a, b) 
    {
        let comparison = 0;

        if (a.dist > b.dist) 
            comparison = 1;
        else if (b.dist > a.dist) 
            comparison = -1;

        return comparison;
    }
    
    // Sort by the closest distances to the sailors location. 
    salesDistances.sort(compare);

    // Set the origin.
    resSales[0] = startAddress;

    // We will have 8 garage sales pulled or less depending on what's in the 
    // database. 
    var min = Math.min(8, salesDistances.length);

    // Set the waypoints for the resSales array. 
    for (i = 1; i < min + 1; i++)
    {
        resSales[i] = salesDistances[i-1].address;
    }

    // Set the destination. 
    resSales[i] = startAddress;

    // This method call allows for us to transfer the resSales values to the 
    // javascript file used in TSP, BUT WE HAVE TO TURN OFF THE OPTION IN 
    // CHROME FOR BLOCKING THIRD PARTY COOKIES TO DO THIS.
    localStorage.setItem("resSalesStorage", JSON.stringify(resSales));

    // Take sailor to their mapping of the route. 
    location.href = "SailorTerminal.html";
});
