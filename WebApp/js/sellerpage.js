// Garage Sailor
// COP 4331, Fall 2019

// sellerpage.js
// =============

// Javascript code for implementing on the seller page. We also take code from 
// the files dates.js, and searchbox.js

// Globals. 
var sale_form_id = "#add-sale-form"
var form = document.querySelector(sale_form_id);

// Check if we retrieved the element or not. 
if (!form)
{
    console.log("Element with ID " + sale_form_id + " did not load.");
    window.alert("Something went wrong! Press OK to reload the page.")
    location.href = "SellerPage.html";
}

// Add a check to prevent user inputting previous dates.  
setMinDate();

// Utilizing everything below in the event handler. We make calls to the 
// variables/functions in database.js, and dates.js. 
form.addEventListener('submit', async (e) => 
{
    e.preventDefault();
    
    var addr = form.address.value;

    if (addr == '' || form.date.value == '')
    {
        window.alert("Form date was not input!");
        return;
    }

    let found = false;
    date.type = 'date';
    var dateval = form.date.valueAsDate;
    date.type = 'text';
    
    var resAddr = addr.toUpperCase();

    await db.collection('Sellers')
        .where('address', '==', resAddr)
        .where('date', '==', dateval)
        .get()
        .then(snapshot => 
        {
            if (!snapshot.empty) 
            {
                found=true;
            }
        });

    if (found)
    {
        window.alert("Garage sale has already been added!");
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
        // Do nothing. 
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

    // Take seller to their confirmation for posting. 
    location.href = "SellerTerminal.html";        
});    
