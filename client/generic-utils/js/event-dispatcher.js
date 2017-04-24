function EventDispatcher(){
    
    this.listeners = [];
    
}
EventDispatcher.prototype.fireEvent = function(event){

    this.listeners.forEach(function(listener){
       listener(event); 
    });
}
EventDispatcher.prototype.addEventListener = function(type, handler){
    
    this.listeners.push(function(e){
        if(e.type === type)
            handler(e);
    });
    
}