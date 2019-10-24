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
    Email.textContent = doc.data().Email;
    Name.textContent = doc.data().Name;
    Cross.textContent = 'x';

    li.appendChild(Address);
    li.appendChild(Email);
    li.appendChild(Name);
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
        Email: form.Email.value,
        Name: form.Name.value
    });
    form.Address.value = '';
    form.Email.value = '';
    form.Name.value = '';
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