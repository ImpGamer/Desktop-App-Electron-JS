const {BrowserWindow,Menu,app, ipcMain,Notification} = require("electron")
const Product = require("./models/Product")

let mainWindow
let productWindowUI = null
app.setName("Electron Desktop")

//Main window
function createWindow() {
    mainWindow = new BrowserWindow({
        width:800,height:700,
        webPreferences: {
            nodeIntegration:true,
            enableRemoteModule:true,
            contextIsolation:false
        }
    })

    mainWindow.loadFile('./src/GUI/html/index.html')
    const mainMenu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(mainMenu)
    mainWindow.on('close',() => app.quit())
}

function productWindow() {
    productWindowUI = new BrowserWindow(
        {
            width:700,height:600,
            webPreferences: {
                nodeIntegration:true,
                enableRemoteModule:true,
                contextIsolation:false
            }
        }
    )
    productWindowUI.loadFile('./src/GUI/html/createProduct.html')
    //Funcion que se ejecuta cuando la ventana se cierra
    productWindowUI.on("close",() => productWindowUI = null)
}
//Parametro de args, que se pueden enviar desde el segundo parametro del .send()
ipcMain.on('create-product',() => {
    if(productWindowUI === null) {
        productWindow()
    }
})

ipcMain.on("request-all-products",async () => {
    const products = await Product.find();
    mainWindow.webContents.send("new-product",JSON.stringify(products))
})
ipcMain.on("delete-product",async (event,product_id) => {
    await Product.findByIdAndDelete(product_id)
    const products = await Product.find()

    mainWindow.webContents.send('new-product',JSON.stringify(products))
})
ipcMain.on("get-product",async (_,id) => {
    const product = await Product.findById(id)
    productWindow()
    //Espera la carga de la ventana para mandar los datos a dicha ventana
    productWindowUI.webContents.on('did-finish-load',() => {
        productWindowUI.webContents.send('product',JSON.stringify(product))
    })
})

//Funcion oyente de eventos a su key (parametro entre comillas)
ipcMain.on('product-response',async (event,args) => {
    const newProduct = new Product(args)
    //Guardar el producto en una DB
    await newProduct.save()
    const products = await Product.find()
    //Mandar informacion a una ventana especifica
    mainWindow.webContents.send('new-product',JSON.stringify(products))
    productWindowUI.close()
})

ipcMain.on('update-product',async (event,product) => {
    await Product.findByIdAndUpdate(product._id,{
        name: product.name,
        description: product.description,
        price: product.price
    })
    const products = await Product.find()
    mainWindow.webContents.send('new-product',JSON.stringify(products))
    productWindowUI.close()
})

//Creacion de un custom menu
const template = [
    {
        label:"Inicio",
        submenu: [
            {
                label:"Quit",
                accelerator: process.platform !== "darwin" ?"Ctrl+p":"Cmd+p", //Combinacion de teclas para ejecutar el click()
                click() {app.quit()}  
            },
            {
                label:"Productos",
                accelerator: process.platform !== "darwin" ?"Ctrl+p":"Cmd+p",
                click() {
                    console.log("Has apretado el boton del menu!")
                },
            }
        ]
    },
]
//Identifica que sistema opertivo se esta usando
if(process.platform === "darwin") { //MacOS
    template.unshift({
        label: app.getName()
    })
}

ipcMain.on('show-notification',(e,notification) => {
    console.log('Notificacion mostrada')
    new Notification({
        title: notification.title,
        body: notification.body
    }).show()
})
module.exports = {createWindow}