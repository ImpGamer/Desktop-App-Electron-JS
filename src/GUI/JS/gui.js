const {ipcRenderer} = require('electron')

export default class GUI {
    static getElementProductList(producto) {
        const containerElement = document.createElement('div');
        containerElement.classList.add("flex", "justify-between", "items-center", "px-3", "mb2", "bg-gray-800", "h-[48px]", "text-white");
        let date = new Date(producto.createdAt);
        date = date.toLocaleDateString();

        const productElement = `
            <span>${producto.name}</span>
            <span>${producto.description}</span>
            <span>${producto.price}</span>
            <span>${date}</span>
            <div>
                <button class="px-2 py-1 text-sm bg-blue-700 rounded">
                    <i class="fa-solid fa-rotate"></i>
                    Update
                </button>
                <button class="px-2 py-1 text-sm bg-red-700 rounded">
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </div>
        `;
        containerElement.innerHTML = productElement;

        const deleteButton = containerElement.querySelector('.bg-red-700');
        deleteButton.addEventListener('click', () => {
            GUI.deleteProduct(producto._id);
        });
        const updateButton = containerElement.querySelector('.bg-blue-700')
        updateButton.addEventListener('click',() => {
            GUI.updateProduct(producto._id)
        })

        return containerElement;
    }

    static getMain() {
        return `
        <div class="flex flex-col justify-center items-center w-full h-full text-white">
                <figure class="mb-3">
                    <img src="../assets/images/electron.png" alt="electron logo" width="250" height="250">
                </figure>
                <p class="mb-1 text-2xl font-light">Curso de Electron JS</p>
                <h2 class="text-2xl">EDteam</h2>
            </div>
        `;
    }
    static deleteProduct(id) {
        if(confirm("Seguro que deseas eliminar este producto")) {
            ipcRenderer.send("delete-product",id)
            ipcRenderer.send('show-notification',{title:"Producto eliminado",body:"El producto se ha eliminado correctamente"})
        }
    }
    static updateProduct(id) {
        ipcRenderer.send("get-product",id)
    }
}
