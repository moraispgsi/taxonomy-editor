


function WireHierarchyNode(flowCanvas, hasMultipleParents, hasMultipleChildren, title){
    
    if(flowCanvas === void 0 || !(flowCanvas instanceof FlowCanvas))
        throw new Error('A valid FlowCanvas is required.');
    
    this.title = title;
    
    this.element = document.createElement('div');
    this.element.setAttribute('class','wire-hierarchy-node');
    
    this.draggableArea = document.createElement('div');
    this.draggableArea.setAttribute('class','wire-hierarchy-node-draggable-area');
    
    this.title = document.createElement('h1');
    this.title.setAttribute('class','wire-hierarchy-node-title');
    this.title.appendChild(document.createTextNode(title));

    makeDraggable(this.draggableArea,this.element);
    this.element.appendChild(this.draggableArea);
    this.draggableArea.appendChild(this.title);
    
    var parentSocketHolder = document.createElement('div');
    var ParentSocketConstructor = hasMultipleParents ? MultipleFlowSocket : UnitFlowSocket;
    this.parentsSocket = new ParentSocketConstructor(flowCanvas, 90, 20);
    this.parentsSocket.isParentSocket = true;
    this.parentsSocket.owner = this;
    this.parentsSocket.acceptConditions.push(function(socket){
            return socket.isChildSocket && socket.owner != this;
    }.bind(this));
    
    parentSocketHolder.className = 'wire-hierarchy-node-parents-socket';
    parentSocketHolder.appendChild(this.parentsSocket.element);
    this.element.appendChild(parentSocketHolder);
    
    
    var parentSocketLabel = document.createElement('span');
    parentSocketLabel.textContent = 'parent';
    parentSocketLabel.className = 'wire-hierarchy-node-parents-socket-label';
    this.element.appendChild(parentSocketLabel);
    
    var childrenSocketHolder = document.createElement('div');
    var ChildrenSocketConstructor = hasMultipleChildren ? MultipleFlowSocket : UnitFlowSocket;
    this.childrenSocket = new ChildrenSocketConstructor(flowCanvas, 270, 20);
    this.childrenSocket.isChildSocket = true;
    this.childrenSocket.owner = this;
    this.childrenSocket.acceptConditions.push(function(socket){
            return socket.isParentSocket && socket.owner != this;
    }.bind(this));
    childrenSocketHolder.className = 'wire-hierarchy-node-children-socket';
    childrenSocketHolder.appendChild(this.childrenSocket.element);
    this.element.appendChild(childrenSocketHolder);
    
    var childrenSocketLabel = document.createElement('span');
    childrenSocketLabel.textContent = 'child';
    childrenSocketLabel.className = 'wire-hierarchy-node-children-socket-label';
    
    this.element.appendChild(childrenSocketLabel);
    
    this.element.addEventListener("dragged", function(){
        this.parentsSocket.updateConnectionsEndPoints();
        this.childrenSocket.updateConnectionsEndPoints();
    }.bind(this));
    
    
    
    
    
    flowCanvas.element.appendChild(this.element);

}


