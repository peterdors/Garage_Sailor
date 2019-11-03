// TODO: store checkbox as boolean instead of string.


const cafeList = document.querySelector('#garage-sales');
const form = document.querySelector('#add-sale-form');

// create element and render cafe
function renderSale(doc)
{
    let li = document.createElement('li');
    let Address = document.createElement('span');
    let Email = document.createElement('span');
    let Name = document.createElement('span');
    let Cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    Address.textContent = doc.data().Address;
    Description.textContent = doc.data().Description;
    Electronics.nodeValue = doc.data().Electronics;
    var temp = doc.data().Electronics;
    //document.querySelector('.messageCheckbox').checked;
    Cross.textContent = 'x';

    li.appendChild(Address);
    li.appendChild(Description);
    li.appendChild(Electronics);
    li.appendChild(Cross);

    cafeList.appendChild(li);

    // Deleting Data
    Cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('Sellers').doc(id).delete();
    })
}

// Getting Data
// db.collection('Sellers').get().then( (snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderSale(doc);
//     })
// })

// Saving Data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('Sellers').add({
        Address: form.Address.value,
        Description: form.Description.value,
        // Create a collection of categories with booleans.
        Electronics: form.Electronics.value
    });
    form.Address.value = '';
    form.Description.value = '';
    form.Electronics.value = '';
});

// Real-Time Listener 
db.collection('Sellers').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added')
        {
            renderSale(change.doc);
        }
        else if (change.type == 'removed')
        {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
        
    })

})