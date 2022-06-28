class Productos{
    constructor(){
        this.productos = [];
    }

    getAll(){
        return (this.productos.length > 0)?this.productos:false;
    }
    isValidProduct(obj){
        let titulo = obj.titulo;
        let precio = obj.precio;
        // validación sencilla.
        if(titulo == '' || precio == ''){
            return false;
        }else{
            return true;
        }
    }
    save(obj){
        if(this.isValidProduct(obj)){
            let id;
            if(this.productos.length > 0){
                let ids = this.productos.map(function(item) {
                    return item.id;
                });
                id = Math.max(...ids) + 1;
            }else{
                id = 1;
            }
            obj['id'] = id;
            return (this.productos.push(obj))?this.productos:false;
        }else{
            return false;
        }
    }
    update(id, titulo, precio, thumbnail){
        id = parseInt(id);
        const itemIndex = this.productos.findIndex((item) => (item.id == id));
        if(this.isValidProduct({"titulo": `${titulo}`, "precio": precio}) && itemIndex != -1){
            let obj = this.productos.filter((item) => (item.id == id));
            if(obj.length < 1){
                return false;
            }else{
                this.productos[itemIndex]["titulo"] = titulo;
                this.productos[itemIndex]["precio"] = precio;
                this.productos[itemIndex]["thumbnail"] = thumbnail;
                return this.productos[itemIndex];
            }
        }else{
            return false;
        }
    }

    getById(id){
        id = parseInt(id);
        const element = this.productos.filter((item) => (item.id == id));
        return (element.length < 1)?false:element;
    }

    delById(id){
        id = parseInt(id);
        const itemIndex = this.productos.findIndex((item) => (item.id == id));
        if(itemIndex != -1){
            this.productos.splice(itemIndex, 1);
            return true;
        }else{
            return false;
        }
    }
}

module.exports = {
    Productos,
};