/**
 * Depends on EventDispatcher
 * Package: generic-utils
 * js file: event-dispatcher.js
 * */


function Ontology(baseIRI){
    
    EventDispatcher.call(this);
    
    this.baseIRI = baseIRI;
    
    this.relativeIRIs = {
        "classes": {},
        "individuals": {},
        "objectProperties": {}
    };
    

}
Ontology.prototype = Object.create(EventDispatcher.prototype);
Ontology.prototype.constructor = Ontology;


/**
 * Verifies if the ontology already has the relativeIRI
 * 
 */
Ontology.prototype.hasRelativeIRI = function(relativeIRI){
    
    return Object.keys(this.relativeIRIs).some(function(array){
        return this.relativeIRIs[array].hasOwnProperty(relativeIRI);
    },this);
    
}
/**
 * Creates an OntClass using a relativeIRI, note that the relativeIRI must not exist in this ontology
 */
Ontology.prototype.createOntClass = function(relativeIRI){
    
    if(this.hasRelativeIRI(relativeIRI))
        throw new Error("Relative IRI already exists");
    
    var newOntClass = new OntClass(this, relativeIRI);
    
    this.relativeIRIs.classes[relativeIRI] = newOntClass;
       
    this.fireEvent({
        "type": "OntClassCreated",
        "OntClass" : newOntClass
    });
    
    return newOntClass;
    
}

/**
 * Creates an OntIndividual using a relativeIRI, note that the relativeIRI must not exist in this ontology
 */
Ontology.prototype.createOntIndividual = function(relativeIRI){
    
    if(this.hasRelativeIRI(relativeIRI))
        throw new Error("Relative IRI already exists");
    
    var newOntIndividual = new OntIndividual(this, relativeIRI);
    
    this.relativeIRIs.classe[relativeIRI] = newOntIndividual;
   
    
    this.fireEvent({
        "type": "OntIndividualCreated",
        "OntIndividual" : newOntIndividual
    });
    
    return newOntIndividual;
    
}

/**
 * Creates an OntObjectProperty using a relativeIRI, note that the relativeIRI must not exist in this ontology
 */
Ontology.prototype.createOntObjectProperty = function(relativeIRI){
    
    if(this.hasRelativeIRI(relativeIRI))
        throw new Error("Relative IRI already exists");
    
    var newOntObjectProperty = new OntObjectProperty(this, relativeIRI);
    
    this.relativeIRIs.classe[relativeIRI] = newOntObjectProperty;

    this.fireEvent({
        "type": "OntObjectPropertyCreated",
        "OntObjectProperty" : newOntObjectProperty
    })
    
    return newOntObjectProperty;
    
}


/**
 * Gets a reference to the object assing to this relative IRI
 * */
Ontology.prototype.getReference = function(relativeIRI){
    
    var reference;
    var isValid = this.relativeIRIs.some(function(array){
        
        return array.some(function(association){
            
            if(association.hasOwnProperty(relativeIRI)){
                
                reference = association.relativeIRI;
                return true;
                
            } 
            
            return false;
  
        });
        
    });
    
    if(!isValid)
        throw new Error("Relative IRI already exists");
    
    return reference;
    
}


Ontology.prototype.getOntClasses = function(){
    return Object.assign({}, this.relativeIRIs.classes);
}

Ontology.prototype.getOntIndividuals = function(){
    return Object.assign({}, this.relativeIRIs.individuals);
}

Ontology.prototype.getOntObjectProperties = function(){
    return Object.assign({}, this.relativeIRIs.objectProperties);
}


/////////////////////////////////////////






function OntClass(ontology, relativeIRI){
    

    this.relativeIRI = relativeIRI;
    

    this.equivalentClasses = [];
    this.superClasses = [];
    this.disjointClasses = [];

}
//Returns an array with all the classes that this class is type of, including itself
OntClass.prototype.getTypes = function(){
    
    //Depth-first search (DFS) algorithm
    
    var types = [];
    var visited = {};
    var stack = [this];
    while(stack.length > 0){
        
        var current = stack.pop();
        
        //not discovered yet
        if(!visited[current.relativeIRI]) {
            
            types.push(current);
            
            visited[current.relativeIRI] = true;
            
            
            current.superClasses.forEach(function(nextOntClass){
                if(!visited[nextOntClass.relativeIRI]){
                    stack.push(nextOntClass);
                }
            });
            current.equivalentClasses.forEach(function(nextOntClass){
                if(!visited[nextOntClass.relativeIRI]){
                    stack.push(nextOntClass);
                }
            });
        
        }
    
    }
    return types;
}
OntClass.prototype.isTypeOf = function(ontClass){
    //If one of the types of this class matches the received class type
    //than this class is a type of the received class
    return this.getTypes().some(function(thisOntType){
        return thisOntType.relativeIRI === ontClass.relativeIRI;
    });
    
}

function OntIndividual(ontology, relativeIRI){

    this.relativeIRI = relativeIRI;
    
    this.ontology = ontology;
    
    this.typeOfClasses = [];
    this.sameAsClasses = [];
    this.differentAsClasses = [];
    
    this.onChangeHandlers = [];
    
    this.objectProperties = {};
    this.onObjectPropertyAdd = function(objectProperty){
        //preholder
    }
    
    this.onObjectPropertyRemoved = function(objectProperty){
        //preholder
        
    }

}

OntIndividual.prototype.addObjectProperty = function(objectProperty){
    if(this.objectProperties[objectProperty.relativeIRI] === void 0){
        this.objectProperties[objectProperty.relativeIRI] = {
            "objectProperty": objectProperty,
            "objectPropertyValue": null
        };
        this.onObjectPropertyAdd(objectProperty);
    }
}
OntIndividual.prototype.removeObjectProperty = function(objectProperty){
    if(this.objectProperties[objectProperty.relativeIRI] != void 0){
        delete this.objectProperties[objectProperty.relativeIRI];
        this.onObjectPropertyRemoved(objectProperty);
    }
}


function OntObjectProperty(ontology, relativeIRI){
    
    this.relativeIRI = relativeIRI;
    
    this.ontology = ontology;
    this.ontology.objectProperties.push(this);

    this.isFunctional = false;
    this.isInverseFunctional = false;
    this.isTransitive = false;
    this.isSymmetric = false;
    this.isAsymmetric = false;
    this.isReflexive = false;
    this.isIrreflexive = false;
    
    this.domainClasses = [];
    this.rangeClasses = [];
    this.superProperties = [];

}
OntObjectProperty.prototype.isValid = function(){
    return this.domainClasses.length > 0 && this.rangeClasses.length > 0;
}
OntObjectProperty.prototype.refreshAffectedIndividuals = function(){
    
    //if the ObjectProperty has all values set properly
    if(this.isValid()){
        
        //Remove all ObjectProperties from every individual
        this.ontology.individuals.forEach(function(individual){
           individual.removeObjectProperty(this);
        },this);
        
        //filter the individuals that match with the domain
        this.ontology.individuals.filter(function(individual){
            
            //true if atleast one of the domain classes match a type of the individual
            return this.domainClasses.some(function(domainOntClass){
               
               return individual.typeOfClasses.some(function(ontClass){

                    return ontClass.isTypeOf(domainOntClass); 
                   
               }, this);

           }, this);
           
        //Add the object property to the filtered individuals
        }, this).forEach(function(individual){
            
            individual.addObjectProperty(this);
            
        }, this);
        
    }
}
OntObjectProperty.prototype.addDomainClass = function(ontClass){
    
    if(ontClass.ontology !== this.ontology)
        throw new Error("Ontology of the class does not match");
    
    this.domainClasses.push(ontClass);
    
    this.refreshAffectedIndividuals();

}

OntObjectProperty.prototype.addRangeClass = function(ontClass){
    
    if(ontClass.ontology !== this.ontology)
        throw new Error("Ontology of the class does not match");
    
    this.rangeClasses.push(ontClass);
    
    this.refreshAffectedIndividuals();

}