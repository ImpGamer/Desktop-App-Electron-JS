const btnSend = document.getElementById('btnSave')
const inputName = document.getElementById('name')
const inputDescription = document.getElementById('description')
const inputPrice = document.getElementById('price')

const {ipcRenderer} = require("electron")
let producto = undefined
let isUpdate;

btnSend.addEventListener('click',(event) => {
    event.preventDefault()
    if(!validateInputs()) {
        alert("Datos ingresado. No validos")
        return
    }
    isUpdate = producto!=undefined?true:false

    const product = {
        _id: isUpdate?producto._id:null,
        name: inputName.value,
        description: inputDescription.value,
        price: inputPrice.value,
        dateCreated: new Date()
    }
    let notification = {
        title: '',
        body: ''
    }

    if(!isUpdate) {
        notification.title = "Producto Creado"
        notification.body = `El producto ${product.name} se ha creado correctamente`

        ipcRenderer.send('product-response',product)
        ipcRenderer.send('show-notification',notification)
    } else {
        notification.title = "Producto Actualizado"
        notification.body = `El producto ${product.name} se ha actualizado correctamente`

        ipcRenderer.send('update-product',product)
        ipcRenderer.send('show-notification',notification)
    }

})

function validateInputs() {
    return inputName.value.length !== 0 &&
        inputDescription.value.length !== 0 &&
        inputPrice.value > 0
}
ipcRenderer.on('product',(event,product) => {
    producto = JSON.parse(product)
    console.log(producto)
})