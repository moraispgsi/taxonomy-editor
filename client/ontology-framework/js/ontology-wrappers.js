/*
    Dependency:
     - framework-core
     - framework-extensions

*/

function OntologyClassHierarchyFlowCanvas(ontology){
    
    FlowCanvas.call(this);
    this.element.className += ' wire-hierarchy-flow-canvas';
    this.ontology = ontology;
}
OntologyClassHierarchyFlowCanvas.prototype = Object.create(FlowCanvas.prototype);
OntologyClassHierarchyFlowCanvas.prototype.constructor = OntologyClassHierarchyFlowCanvas;


function IOFlowObject(typeText, id){
    
    FlowObject.call(this,id, typeText + id );
    
    this.content = document.createElement('div');
    this.content.setAttribute('class','simple content');
    this.content.setAttribute("id", id + "-content");
    
    this.head = document.createElement('div');
    this.head.setAttribute('class', 'simple head round-bottom');
    this.content.appendChild(this.head);
    
    this.inputSide = document.createElement('div');
    this.inputSide.setAttribute('class', 'simple input-side');
    this.head.appendChild(this.inputSide);
    
    this.mainCenter = document.createElement('div');
    this.mainCenter.setAttribute('class', 'simple main-center');
    this.head.appendChild(this.mainCenter);
    
    this.outputSide = document.createElement('div');
    this.outputSide.setAttribute('class', 'simple output-side');
    this.head.appendChild(this.outputSide);

}
IOFlowObject.prototype = Object.create(FlowObject.prototype);
IOFlowObject.prototype.constructor = IOFlowObject;
IOFlowObject.prototype.createInputRow = function(){
        
    var inputRow = document.createElement('div');
    this.inputSide.appendChild(inputRow);
    inputRow.setAttribute('class', 'simple input-row');
    return inputRow;
        
}
IOFlowObject.prototype.createOutputRow = function(){
        
    var outputRow = document.createElement('div');
    this.outputSide.appendChild(outputRow);
    outputRow.setAttribute('class', 'simple output-row');
    return outputRow;
        
}


function OntClassFlowObject(ontologyFlowCanvas, ontClass){
    /*
    if(!(ontologyFlowCanvas instanceof OntologyFlowCanvas)){
        throw new Error("The ontologyFlowCanvas must be a type of OntologyFlowCanvas.");
    }
    */
    IOFlowObject.call(this, 'C:', ontClass.relativeIRI);
    
    this.ontClass = ontClass;
    


    //Creates input equivalentClasses
    (function createEquivalentClassesInput(){
        
        var inputRow = this.createInputRow();
        
        //this flow socket fires actions connected to it
        var equivalentClassesSocket = new ObserverFlowSocket(false, ontologyFlowCanvas, 180, 40);
        equivalentClassesSocket.isOntClassInput = true;//Mark socket as ontClass
        equivalentClassesSocket.owner = this;//Mark this as the owner of the socket
        
        //Restrictions
        equivalentClassesSocket.acceptConditions.push(function(socket){
            return socket.isOntClassOutput && socket.owner != this;
        }.bind(this));
        equivalentClassesSocket.onConnectActions.push(function(socket){
            this.ontClass.equivalentClasses.push(socket.getValue());
        }.bind(this));
        
        inputRow.appendChild(equivalentClassesSocket.element);
        this.bindFlowSocket(equivalentClassesSocket);
        
        var inputLabel = document.createElement('span');
        inputLabel.setAttribute('class', 'simple input-label');
        inputLabel.appendChild(document.createTextNode("equivalent"));
        inputRow.appendChild(inputLabel);
        
    }).bind(this)();
    
    //Creates input SuperClasses
    (function createSuperClassesInput(){
        
        var inputRow = this.createInputRow();
        
        var superClassesSocket = new ObserverFlowSocket(false, ontologyFlowCanvas, 180, 40);
        superClassesSocket.isOntClassInput = true;//Mark socket as ontClass input
        superClassesSocket.owner = this;//Mark this as the owner of the socket
        
        //Restrictions
        superClassesSocket.acceptConditions.push(function(socket){
            return socket.isOntClassOutput && socket.owner != this;
        }.bind(this));
        superClassesSocket.onConnectActions.push(function(socket){
            this.ontClass.superClasses.push(socket.getValue());
        }.bind(this));
        
        inputRow.appendChild(superClassesSocket.element);
        this.bindFlowSocket(superClassesSocket);
        
        var inputLabel = document.createElement('span');
        inputLabel.setAttribute('class', 'simple input-label');
        inputLabel.appendChild(document.createTextNode("super"));
        inputRow.appendChild(inputLabel);
        
    }).bind(this)();
    
    //Creates input DisjointClasses
    (function createSuperClassesInput(){
        
        var inputRow = this.createInputRow();
        
        var disjointClassesSocket = new ObserverFlowSocket(false, ontologyFlowCanvas, 180, 40);
        disjointClassesSocket.isOntClassInput = true;//Mark socket as ontClass input
        disjointClassesSocket.owner = this;//Mark this as the owner of the socket
        
        //Restrictions
        disjointClassesSocket.acceptConditions.push(function(socket){
            return socket.isOntClassOutput && socket.owner != this;
        }.bind(this));
        disjointClassesSocket.onConnectActions.push(function(socket){
            this.ontClass.disjointClasses.push(socket.getValue());
        }.bind(this));
        
        
        
        inputRow.appendChild(disjointClassesSocket.element);
        this.bindFlowSocket(disjointClassesSocket);
        
        var inputLabel = document.createElement('span');
        inputLabel.setAttribute('class', 'simple input-label');
        inputLabel.appendChild(document.createTextNode("disjoint"));
        inputRow.appendChild(inputLabel);
        
    }).bind(this)();
    
    //////////////////////////////////////
    
    //Output ontClass Socket
    var outputRow = this.createOutputRow();
    
    var outputLabel = document.createElement('span');
    outputLabel.setAttribute('class', 'simple output-label');
    outputLabel.appendChild(document.createTextNode('class'));
    outputRow.appendChild(outputLabel);
    
    var ontClassSocket = new ObserverFlowSocket(false,ontologyFlowCanvas, 0, 40);
    ontClassSocket.isOntClassOutput = true;//Mark socket as ontClass input
    ontClassSocket.owner = this;//Mark this as the owner of the socket
    
    //Restrictions
    ontClassSocket.acceptConditions.push(function(socket){
        return socket.isOntClassInput && socket.owner != this;
    }.bind(this));
    ontClassSocket.getValue = function(){
        return this.ontClass;
    }.bind(this);
    
    outputRow.appendChild(ontClassSocket.element);
    this.bindFlowSocket(ontClassSocket);
    
    this.element.appendChild(this.content);
    ontologyFlowCanvas.element.appendChild(this.element);

}
OntClassFlowObject.prototype = Object.create(IOFlowObject.prototype);
OntClassFlowObject.prototype.constructor = OntClassFlowObject;


function OntIndividualFlowObject(ontologyFlowCanvas, ontIndividual){
    /*
    if(!(ontologyFlowCanvas instanceof OntologyFlowCanvas)){
        throw new Error("The ontologyFlowCanvas must be a type of OntologyFlowCanvas.");
    }*/
    
    IOFlowObject.call(this,'I:', ontIndividual.relativeIRI);

    this.ontIndividual = ontIndividual;
    
    

    //Creates input typeOfClasses
    (function createTypeOfClassesInput(){
        
        var inputRow = this.createInputRow();
        
        //this flow socket fires actions connected to it
        var typeOfClassesSocket = new ObserverFlowSocket(false, ontologyFlowCanvas, 180, 40);
        typeOfClassesSocket.isOntClassInput = true;//Mark socket as ontClass
        typeOfClassesSocket.owner = this;//Mark this as the owner of the socket
        
        //Restrictions
        typeOfClassesSocket.acceptConditions.push(function(socket){
            return socket.isOntClassOutput && socket.owner != this;
        }.bind(this));
        typeOfClassesSocket.onConnectActions.push(function(socket){
            this.ontIndividual.typeOfClasses.push(socket.getValue());
        }.bind(this));
        
        inputRow.appendChild(typeOfClassesSocket.element);
        this.bindFlowSocket(typeOfClassesSocket);
        
        var inputLabel = document.createElement('span');
        inputLabel.setAttribute('class', 'simple input-label');
        inputLabel.appendChild(document.createTextNode("type"));
        inputRow.appendChild(inputLabel);
        
    }).bind(this)();
    
    //Creates input sameAsClasses
    (function createSameAsClassesInput(){
        
        var inputRow = this.createInputRow();
        
        //this flow socket fires actions connected to it
        var sameAsClassesSocket = new ObserverFlowSocket(false, ontologyFlowCanvas, 180, 40);
        sameAsClassesSocket.isOntIndividualInput = true;//Mark socket as ontIndividual input
        sameAsClassesSocket.owner = this;//Mark this as the owner of the socket
        
        //Restrictions
        sameAsClassesSocket.acceptConditions.push(function(socket){
            return socket.isOntIndividualOutput && socket.owner != this;
        }.bind(this));
        sameAsClassesSocket.onConnectActions.push(function(socket){
            this.ontIndividual.sameAsClasses.push(socket.getValue());
        }.bind(this));
        
        inputRow.appendChild(sameAsClassesSocket.element);
        this.bindFlowSocket(sameAsClassesSocket);
        
        var inputLabel = document.createElement('span');
        inputLabel.setAttribute('class', 'simple input-label');
        inputLabel.appendChild(document.createTextNode("same"));
        inputRow.appendChild(inputLabel);
        
    }).bind(this)();
    
    
    //Creates input differentAsClasses
    (function createDifferentAsClassesInput(){
        
        var inputRow = this.createInputRow();
        
        //this flow socket fires actions connected to it
        var differentAsClassesSocket = new ObserverFlowSocket(false, ontologyFlowCanvas, 180, 40);
        differentAsClassesSocket.isOntIndividualInput = true;//Mark socket as ontIndividual input
        differentAsClassesSocket.owner = this;//Mark this as the owner of the socket
        
        //Restrictions
        differentAsClassesSocket.acceptConditions.push(function(socket){
            return socket.isOntIndividualOutput && socket.owner != this;
        }.bind(this));
        differentAsClassesSocket.onConnectActions.push(function(socket){
            this.ontIndividual.differentAsClasses.push(socket.getValue());
        }.bind(this));
        
        inputRow.appendChild(differentAsClassesSocket.element);
        this.bindFlowSocket(differentAsClassesSocket);
        
        var inputLabel = document.createElement('span');
        inputLabel.setAttribute('class', 'simple input-label');
        inputLabel.appendChild(document.createTextNode("different"));
        inputRow.appendChild(inputLabel);
        
    }).bind(this)();
    
    //Dynamicly creates ObjectProperty inputs
    this.ontIndividual.onObjectPropertyAdd = function(ontObjectProperty){
        
        var inputRow = this.createInputRow();
        
        //this flow socket fires actions connected to it
        var objectPropertySocket = new ObserverFlowSocket(true, ontologyFlowCanvas, 180, 40);
        objectPropertySocket.isOntIndividualInput = true;//Mark socket as ontIndividual input
        objectPropertySocket.owner = this;//Mark this as the owner of the socket
        
        //Restrictions
        objectPropertySocket.acceptConditions.push(function(socket){
            
            if(socket.isOntIndividualOutput && socket.owner != this){
                
                //get the current individual types of the socket
                var ontIndividualTypes = socket.getValue().typeOfClasses.slice();
                
                //Array to hold the types and the implicit types
                var implicitTypes = ontIndividualTypes.splice();
                
                //Get implicit types
                ontIndividualTypes.forEach(function(typeOntClass){
                    implicitTypes = implicitTypes.concat(typeOntClass.getTypes());
                });
           
                //Does not have a type yet
                if(implicitTypes.length === 0)
                    return false;
                
                //Accept as long as the a type of the individual matches one type of the range
                return implicitTypes.some(function(typeOntClass){
                    return ontObjectProperty.rangeClasses.some(function(rangeOntClass){
                        return rangeOntClass.relativeIRI === typeOntClass.relativeIRI;
                    });
                })
            }
            
            return false;
            
        }.bind(this));
        objectPropertySocket.onConnectActions.push(function(socket){
            //Sets the value of the instance of the object property
            this.ontIndividual.objectProperties[ontObjectProperty.relativeIRI].objectPropertyValue = socket.getValue();
        }.bind(this));
        
        inputRow.appendChild(objectPropertySocket.element);
        this.bindFlowSocket(objectPropertySocket);
        
        var inputLabel = document.createElement('span');
        inputLabel.setAttribute('class', 'simple input-label');
        inputLabel.appendChild(document.createTextNode(ontObjectProperty.relativeIRI));
        inputRow.appendChild(inputLabel);
                
        
        
    }.bind(this);
    
    
    
    //////////////////////////////////////
    
    //Output ontClass Socket
    var outputRow = this.createOutputRow();
    
    var outputLabel = document.createElement('span');
    outputLabel.setAttribute('class', 'simple output-label');
    outputLabel.appendChild(document.createTextNode('individual'));
    outputRow.appendChild(outputLabel);
    
    var ontIndividualSocket = new ObserverFlowSocket(false,ontologyFlowCanvas, 0, 40);
    ontIndividualSocket.isOntIndividualOutput = true;//Mark socket as ontClass input
    ontIndividualSocket.owner = this;//Mark this as the owner of the socket
    
    //Restrictions
    ontIndividualSocket.acceptConditions.push(function(socket){
        return socket.isOntIndividualInput && socket.owner != this;
    }.bind(this));
    ontIndividualSocket.getValue = function(){
        return this.ontIndividual;
    }.bind(this);
    
    
    outputRow.appendChild(ontIndividualSocket.element);
    this.bindFlowSocket(ontIndividualSocket);
    
    this.element.appendChild(this.content);
    ontologyFlowCanvas.element.appendChild(this.element);

}
OntIndividualFlowObject.prototype = Object.create(IOFlowObject.prototype);
OntIndividualFlowObject.prototype.constructor = OntIndividualFlowObject;


function OntObjectPropertyFlowObject(ontologyFlowCanvas, ontObjectProperty){
    /*
    if(!(ontologyFlowCanvas instanceof OntologyFlowCanvas)){
        throw new Error("The ontologyFlowCanvas must be a type of OntologyFlowCanvas.");
    }
    */
    IOFlowObject.call(this,'P:', ontObjectProperty.relativeIRI);
    
    this.ontObjectProperty = new ontObjectProperty;
    
    (function createDomainInput(){
        
        var inputRow = this.createInputRow();
        
        //Intersection of classes
        var domainSocket = new ObserverFlowSocket(false, ontologyFlowCanvas, 180, 40);
        domainSocket.isOntClassInput = true;//Mark socket as ontClass input
        domainSocket.owner = this;//Mark this as the owner of the socket
        
        //Restrictions
        domainSocket.acceptConditions.push(function(socket){
            return socket.isOntClassOutput && socket.owner != this;
        }.bind(this));
        domainSocket.onConnectActions.push(function(socket){
            this.onDomainConnect(socket);
        }.bind(this));
        
        inputRow.appendChild(domainSocket.element);
        this.bindFlowSocket(domainSocket);
        
        var inputLabel = document.createElement('span');
        inputLabel.setAttribute('class', 'simple input-label');
        inputLabel.appendChild(document.createTextNode("domain"));
        inputRow.appendChild(inputLabel);
        
    }).bind(this)();
    
    (function createRangeInput(){
        
        var inputRow = this.createInputRow();
        
        //Intersection of classes
        var rangeSocket = new ObserverFlowSocket(false, ontologyFlowCanvas, 180, 40);
        rangeSocket.isOntClassInput = true;//Mark socket as ontIndividual input
        rangeSocket.owner = this;//Mark this as the owner of the socket
        
        //Restrictions
        rangeSocket.acceptConditions.push(function(socket){
            return socket.isOntClassOutput && socket.owner != this;
        }.bind(this));
        rangeSocket.onConnectActions.push(function(socket){
            this.onRangeConnect(socket);
        }.bind(this));
        
        inputRow.appendChild(rangeSocket.element);
        this.bindFlowSocket(rangeSocket);
        
        var inputLabel = document.createElement('span');
        inputLabel.setAttribute('class', 'simple input-label');
        inputLabel.appendChild(document.createTextNode("range"));
        inputRow.appendChild(inputLabel);
        
    }).bind(this)();
    
    (function createSuperPropertiesInput(){
        
        var inputRow = this.createInputRow();
        
        //Union of classes
        var superPropertiesSocket = new ObserverFlowSocket(false, ontologyFlowCanvas, 180, 40);
        superPropertiesSocket.isOntObjectPropertyInput = true;//Mark socket as ontIndividual input
        superPropertiesSocket.owner = this;//Mark this as the owner of the socket
        
        //Restrictions
        superPropertiesSocket.acceptConditions.push(function(socket){
            return socket.isOntObjectPropertyOutput && socket.owner != this;
        }.bind(this));
        superPropertiesSocket.onConnectActions.push(function(socket){
            this.ontObjectProperty.superProperties.push(socket.getValue());
        }.bind(this));
        
        inputRow.appendChild(superPropertiesSocket.element);
        this.bindFlowSocket(superPropertiesSocket);
        
        var inputLabel = document.createElement('span');
        inputLabel.setAttribute('class', 'simple input-label');
        inputLabel.appendChild(document.createTextNode("super"));
        inputRow.appendChild(inputLabel);
        
    }).bind(this)();
    
    var outputRow = this.createOutputRow();
    
    var outputLabel = document.createElement('span');
    outputLabel.setAttribute('class', 'simple output-label');
    outputLabel.appendChild(document.createTextNode('objProperty'));
    outputRow.appendChild(outputLabel);
    
    var ontIndividualSocket = new ObserverFlowSocket(false,ontologyFlowCanvas, 0, 40);
    ontIndividualSocket.isOntObjectPropertyOutput = true;//Mark socket as ontClass input
    ontIndividualSocket.owner = this;//Mark this as the owner of the socket
    
    //Restrictions
    ontIndividualSocket.acceptConditions.push(function(socket){
        return socket.isOntObjectPropertyInput && socket.owner != this;
    }.bind(this));
    ontIndividualSocket.getValue = function(){
        return this.ontObjectProperty;
    }.bind(this);
    
    
    outputRow.appendChild(ontIndividualSocket.element);
    this.bindFlowSocket(ontIndividualSocket);
    
    this.element.appendChild(this.content);
    ontologyFlowCanvas.element.appendChild(this.element);
    
}
OntObjectPropertyFlowObject.prototype = Object.create(IOFlowObject.prototype);
OntObjectPropertyFlowObject.prototype.constructor = OntObjectPropertyFlowObject;
OntObjectPropertyFlowObject.prototype.onDomainConnect = function(socket){
    this.ontObjectProperty.addDomainClass(socket.getValue());
}
OntObjectPropertyFlowObject.prototype.onRangeConnect = function(socket){
    this.ontObjectProperty.addRangeClass(socket.getValue());
}
