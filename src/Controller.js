const { Productos } = require('./clases/Productos.js');
const { Producto } = require('./clases/Producto.js');

const productos = new Productos();

function getProductos(){
    const res = productos.getAll();
    return (res)?res:{ error : 'No hay productos' };
}

function saveProducto(params){
    try {  
        if(typeof params.titulo !== 'undefined' && typeof params.precio !== 'undefined' && typeof params.thumbnail !== 'undefined'){
            const {titulo, precio, thumbnail} = params; 
            const prod = new Producto(titulo, precio, thumbnail);
            return productos.save(prod);
        }else{
            return false;
        }
    } catch (e) {  
        return false;  
    }  
}

function putProductoById(id, datos){
    try {  
        if(typeof datos.titulo !== 'undefined' && typeof datos.precio !== 'undefined' && typeof datos.thumbnail !== 'undefined'){
            const {titulo, precio, thumbnail} = datos;
            return productos.update(id, titulo, precio, thumbnail);
        }else{
            return false;
        }
    } catch (e) {  
        return false;  
    }
}

function getProductoById(id){
    return productos.getById(id);
}

function delProductoById(id){
    return productos.delById(id);
}

module.exports = {
    getProductos,
    saveProducto,
    getProductoById,
    delProductoById,
    putProductoById,
};