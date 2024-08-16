import GUI from './GUI/JS/gui.js';

const btnCreateProduct = document.getElementById('btnCreateProduct')
const btnProducts = document.querySelector('#btnProducts')
const btnMain = document.getElementById('btnMain')
const divMain = document.querySelector('#main')
let products = []
let productsDiv = null

const {ipcRenderer} = require('electron')

let tableProducts = `
<div class="flex justify-center items-start w-full h-full text-white">
    <div class="mt-8 w-[95%]">
        <div class="flex justify-between items-center px-8 h-[56px] bg-gray-800">
        <span>Nombre</span>
        <span>Descripcion</span>
        <span>Precio</span>
        <span>Fecha Creacion</span>
        <span>Acciones</span>
        </div>
        <div id="products" class="bg-gray-700 px-2 py-2"></div>
    </div>
</div>
`

btnCreateProduct.addEventListener('click',() => ipcRenderer.send('create-product'))

btnMain.addEventListener('click',() => {
    const main_content = GUI.getMain()
    divMain.innerHTML = main_content
})

btnProducts.addEventListener('click',() => {
    divMain.innerHTML = tableProducts
    productsDiv = document.getElementById('products')
    ipcRenderer.send("request-all-products")

    insertProductsElements(productsDiv)
})

ipcRenderer.on('new-product',(event,args) => {
    products = JSON.parse(args)
    insertProductsElements(productsDiv)
})

function insertProductsElements(container) {
    container.innerHTML = ""
    products.forEach(
        product => container.appendChild(GUI.getElementProductList(product))
    )
}