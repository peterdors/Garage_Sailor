// const saleList = document.querySelector('#garage-sales');
var form = document.querySelector('#add-sale-form');
var sale = document.querySelector('#search-sale-form');
var geocoder;
var resSales = [];
var distanceService; 
var distFromStart;

function initDistanceService()
{
    distanceService = new google.maps.DistanceMatrixService();
}

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
        // console.log(response) // actually returns desired response
        resolve(response.rows[0].elements[0].distance.text);
        
        var distance = response.rows[0].elements[0].distance.text;
        distFromStart = parseFloat(distance);
    }));
}

// Saving Data
if (form)
{
    form.addEventListener('submit', async (e) => 
    {
        e.preventDefault();
        var addr = form.address.value;
        if (addr == '' || form.date.value == '')
        {
            return;
        }
        let found = false;
        date.type = 'date';
        var dateval = form.date.valueAsDate;
        date.type = 'text';
        
        var resAddr = addr.toUpperCase();

        await db.collection('Sellers').where('address', '==', resAddr).where('date', '==', dateval).get()
            .then(snapshot => 
            {
                if (!snapshot.empty) 
                {
                    found=true;
                }
            });
        if (found)
        {
            alert("Garage sale has already been added!");
            return false;
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
            address: resAddr,
            date: dateval,
        }).then(ref => 
        {
            console.log('Added document with ID: ', ref.id);
            console.log(form.date.value);
            console.log(dateval);
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

        let sales = new Set();
        var len = sale.elements.length - 1;
        var element;
        var date;
        var iterator;
        var i = 0;

        // Add a check for blank address and date
        // have to make another check if date matches date given before throwing it into list
        // need to fix input time as well with the date
        // need to check for duplicates

        // date = gsale[1];
        // TODO: Compare the date entered to today's date and if the date 
        // entered is earlier than today's date we should catch this as an error. 
        date = await document.getElementById('date');
        date.type = 'date';
        var dateval = date.valueAsDate;

        var today = new Date();
        var inp = new Date(dateval);

        console.log(inp);
        console.log(date.value);
        console.log(dateval);

        // if (inp < today)
        // {
        //     alert("Please input a date greater than or equal to " + today);
        //     return; 
        // }

        
        date.type = 'text';
        console.log("Len elements" + len);
        
        for (var i = 0; i < len; i++)
        {
            element = gsale[i];
            // console.log(element);

            if (element.type == "checkbox" && element.checked === true)
            {   
                await db.collection('Sellers').where(element.value.toLowerCase(), '==', true).where('date', '==', dateval).get()
                .then(snapshot => {
                    if (snapshot.empty) 
                    {
                        console.log("No matching documents");

                        return;
                    }
                    snapshot.forEach(doc => 
                    {
                        console.log(doc.data().address);
                        sales.add(doc.data().address);
                        // console.log(doc.id, "=>", doc.data().date);
                    });
                })
                .catch(err => 
                {
                    // console.log("Error getting documents", err);
                });

                var arrlen = sales.size;

                // console.log("arrlen before =", arrlen);

                // console.log(sales);
            }
        }

        sales = Array.from(sales);
        // console.log(sales);

        // TODO check if empty
        let salesDistances = new Array();

        let startAddress = document.getElementById('address').value; 

        document.getElementById("overlay").style.display = "block";

        for (var i = 0; i < sales.length; i++)
        {
            // TODO get distance
            await get_distance(startAddress, sales[i]);
            console.log(distFromStart);
            salesDistances.push({address: sales[i], dist: distFromStart});
        }

        function compare(a, b) 
        {
            let comparison = 0;

            if (a.dist > b.dist) comparison = 1;
            else if (b.dist > a.dist) comparison = -1;

            return comparison;
        }
        
        salesDistances.sort(compare);

        // console.log(salesDistances);

        resSales[0] = startAddress;

        var min = Math.min(8, salesDistances.length);
        
        // console.log(min);
        // console.log(resSales);

        for (i = 1; i < min + 1; i++)
        {
            resSales[i] = salesDistances[i-1].address;
        }

        // console.log(resSales);

        resSales[i] = startAddress;

        // Array for tsp
        console.log(resSales);

        // This method call allows for us to transfer the resSales values to the 
        // javascript file used in TSP, BUT WE HAVE TO TURN OFF THE OPTION IN 
        // CHROME FOR BLOCKING THIRD PARTY COOKIES TO DO THIS.
        localStorage.setItem("resSalesStorage", JSON.stringify(resSales));

        // prevent empty strings for date and address, or no boxes checked
        // check for match date and categories.
        location.href = "SailorTerminal.html";
    });
}



