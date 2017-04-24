function FlowObject(id,name){
    
    this.id = id;
    this.name = name;
    
    this.element = document.createElement('div');
    this.element.setAttribute('id', id);
    this.element.setAttribute('class','flow-object');
    
    this.draggableArea = document.createElement('div');
    this.draggableArea.setAttribute('class','flow-object-draggable-area');
    
    this.title = document.createElement('h1');
    this.title.setAttribute('class','flow-object-title');
    this.title.appendChild(document.createTextNode(name));

    makeDraggable(this.draggableArea,this.element);
    this.element.appendChild(this.draggableArea);
    this.draggableArea.appendChild(this.title);

}
FlowObject.prototype.bindFlowSocket = function(flowSocket){
    this.element.addEventListener("dragged", function(){
        flowSocket.updateConnectionsEndPoints();
    });
}
FlowObject.prototype.addToFlowCanvas = function(flowCanvas){
    if(flowCanvas !== void 0 && flowCanvas instanceof FlowCanvas)
        flowCanvas.element.appendChild(this.element);
}
