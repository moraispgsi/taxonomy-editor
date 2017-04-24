function StateMachine(id, state, statesArray){
    this.id = id;
    this.state = state;
    this.statesArray = statesArray;
}


function MicroWorldBuilder(title, width, height){
    
    FlowCanvas.call(this, width, height);
    
    this.stateMachines = {};
    
    this.displayPageButton = document.createElement('Button');
    this.displayPageButtonText = document.createTextNode('Display');
    this.displayPageButton.appendChild(this.displayPageButtonText);
    this.displayPageButton.onclick = (function(){
        console.log('here');
        
    }).bind(this);
    this.element.appendChild(this.displayPageButton);

}
MicroWorldBuilder.prototype = Object.create(FlowCanvas.prototype);
MicroWorldBuilder.prototype.constructor = MicroWorldBuilder;
MicroWorldBuilder.prototype.createStateMachine = function(id, state, statesArray){
    this.stateMachines[id] = new StateMachine(id, state, statesArray);
}
MicroWorldBuilder.prototype.createReference = function(id){
    var reference = new SMReferenceFlowObject(this, id, this.stateMachines[id]);
    reference.addToFlowCanvas(this);
    return reference;
}


function SMReferenceFlowObject(flowCanvas, id, stateMachine){
    
    FlowObject.call(this,id, 'ID: ' + id);

    var content = document.createElement('div');
    content.setAttribute('class','simple content');
    content.setAttribute("id", id + "-content");
    
    var head = document.createElement('div');
    head.setAttribute('class', 'simple head round-bottom');
    content.appendChild(head);
    
    var inputSide = document.createElement('div');
    inputSide.setAttribute('class', 'simple input-side');
    head.appendChild(inputSide);
    
    var mainCenter = document.createElement('div');
    mainCenter.setAttribute('class', 'simple main-center');
    head.appendChild(mainCenter);
    
    var outputSide = document.createElement('div');
    outputSide.setAttribute('class', 'simple output-side');
    head.appendChild(outputSide);
    
    stateMachine.statesArray.forEach((function(state){
        
        //Input
        var inputRow = document.createElement('div');
        inputSide.appendChild(inputRow);
        inputRow.setAttribute('class', 'simple input-row');
        
        //this flow socket fires actions connected to it
        var actionSocket = new ActionFlowSocket(true, flowCanvas, 180, 40);
        inputRow.appendChild(actionSocket.element);
        this.bindFlowSocket(actionSocket);
        
        var inputLabel = document.createElement('span');
        inputLabel.setAttribute('class', 'simple input-label');
        inputLabel.appendChild(document.createTextNode(state));
        inputRow.appendChild(inputLabel);

    }).bind(this));
    
    //Output
    var outputRow = document.createElement('div');
    outputSide.appendChild(outputRow);
    outputRow.setAttribute('class', 'simple output-row');
    
    var outputLabel = document.createElement('span');
    outputLabel.setAttribute('class', 'simple output-label');
    outputLabel.appendChild(document.createTextNode('State'));
    outputRow.appendChild(outputLabel);
    
    //this flow socket fires actions connected to it
    var textOutputSocket = new ObserverFlowSocket(true, flowCanvas, 0, 40);
    outputRow.appendChild(textOutputSocket.element);
    this.bindFlowSocket(textOutputSocket);
    
    this.element.appendChild(content);
    flowCanvas.element.appendChild(this.element);

}
SMReferenceFlowObject.prototype = Object.create(FlowObject.prototype);
SMReferenceFlowObject.prototype.constructor = SMReferenceFlowObject;