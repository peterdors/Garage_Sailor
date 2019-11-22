// const saleList = document.querySelector('#garage-sales');
const form = document.querySelector('#add-sale-form');
const sale = document.querySelector('#search-sale-form');
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
            address: form.address.value,
            date: form.date.valueAsDate,
            electronics: form.electronics.checked,
            furniture: form.furniture.checked,
            art: form.art.checked,
            clothing: form.clothing.checked,
            books: form.books.checked,
            bicycles: form.bicycles.checked,
            jewelry: form.jewelry.checked,
            toys: form.toys.checked, 
            other: form.other.checked
        }).then(ref => 
        {
            console.log('Added document with ID: ', ref.id);
        });

        form.address.value = '';
        form.date.value = '';
        form.electronics.checked = false;
        form.furniture.checked = false;
        form.art.checked = false;
        form.clothing.checked = false;
        form.bicycles.checked = false;
        form.jewelry.checked = false;
        form.toys.checked = false;
        form.other.checked = false;

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

        // Add a check for blank address and date
        // have to make another check if date matches date given before throwing it into list
        // need to fix input time as well with the date
        // need to check for duplicates

        // date = gsale[1];
        date = document.getElementById('date');
        date.type = 'date';
        var dateval = date.valueAsDate;
        date.type = 'text';

        for (var i = 0; i < len; i++)
        {
            element = gsale[i];

            if (element.type == "checkbox" && element.checked === true)
            {   
                await db.collection('Sellers').where(element.value.toLowerCase(), '==', true).where(date.id, '==', dateval).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log("No matching documents");
                        return;
                    }
                    snapshot.forEach(doc => {
                        sales.add(doc.data().address);
                        console.log(doc.id, "=>", doc.data());
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
        sales = Array.from(sales);
        // TODO check if empty
        
        let salesDistances = [];
        let startAddress = document.getElementById('address').value; 

        // TODO
        let startLatLng = {lat: 50, lng:50};

        function dist(start, curr)
        {
            return Math.pow(start.lat - curr.lat,2) + Math.pow(start.lng - curr.lng,2);
        }


        for (var i=0; i<sales.length; i++)
        {
            // TODO get latlng
            var curr = {lat: 50+i, lng:50+i};
            var distFromStart = dist(startLatLng, curr)
            salesDistances.push({address: sales[i], dist: distFromStart});
        }


        function compare(a,b) {
            let comparison=0;

            if(a.dist>b.dist) comparison=1;
            else if (b.dist>a.dist) comparison=-1;

            return comparison;
        }
        
        salesDistances.sort(compare);
        
        resSales = [];
        resSales.push(startAddress);
        for (var i=0; i<Math.min(8, salesDistances.length); i++)
        {
            resSales.push(salesDistances[i].address);
        }
        ResSales.push(startAddress);
        // Array for tsp
        console.log(resSales);
        // prevent empty strings for date and address, or no boxes checked
        // check for match date and categories.
    
        location.href = "SailorTerminal.html";
    });
}





































function initMap()
{
    var searchBox = new google.maps.places.SearchBox(document.getElementById('address'));
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
    })
}


// // Real-Time Listener 
// db.collection('Sellers').onSnapshot(snapshot => {
//     let changes = snapshot.docChanges();
//     changes.forEach(change => {
//         if (change.type == 'added')
//         {
//             renderSale(change.doc);
//         }
//         else if (change.type == 'removed')
//         {
//             let li = saleList.querySelector('[data-id=' + change.doc.id + ']');
//             saleList.removeChild(li);
//         }
        
//     })

// })


// Either put all information entries under one form or create 
// link all different form id's under one event listener 

// Instead of address field i have, set it up for the query




// // create element and render/display sale
// function renderSale(doc)
// {
//     let li = document.createElement('li');
//     let Address = document.createElement('span');
//     let Description = document.createElement('span');
//     let Cross = document.createElement('div');

//     li.setAttribute('data-id', doc.id);
    
//     Address.textContent = doc.data().Address;
//     Description.textContent = doc.data().Description;

//     Cross.textContent = 'x';

//     li.appendChild(Address);
//     li.appendChild(Description);
//     li.appendChild(Cross);

//     saleList.appendChild(li);

//     //Deleting Data
//     Cross.addEventListener('click', (e) => {
//         e.stopPropagation();
//         let id = e.target.parentElement.getAttribute('data-id');
//         db.collection('Sellers').doc(id).delete();
//     })
// }