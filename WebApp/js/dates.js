// Garage Sailor
// COP 4331, Fall 2019

// dates.js
// ========

// Javascript functions for setting the minimum date allowed on input when the 
// user types in the dates into the seller or sailor form.

// Function to return a new Promise() to get the correct element ID. 
// Parameter input is a string format of the current day in "YYYY-MM-DD" format. 
function getDateID(today) 
{   
    return new Promise(resolve => 
    {
        resolve(document.getElementById("date").setAttribute("min", today));
    });
}

// Helper function to set the minimum date of the element to the current day. 
async function setMinDate(input_date)
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; // January is 0!
    var yyyy = today.getFullYear();

    // For handling when days and/or months numbered 1 through 9 are used. 
    if (dd < 10)
    {
        dd = '0' + dd;
    } 

    if (mm < 10)
    {
        mm = '0' + mm;
    } 

    today = yyyy + '-' + mm + '-' + dd;

    await getDateID(today);
}
