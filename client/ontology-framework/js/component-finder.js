/**
 * Depends on EventDispatcher
 * Package: generic-utils
 * js file: event-dispatcher.js
 * */


/**
 * Receives a manifest of the components in the following JSON format
 * {
    
    'resource1' : {
        'title': 'This is a title',
        'description': 'This is a description!',
        'keywords': [],
        'create': function,
        'createOnce': true/false
    }, 'resource2' : {
        'title': 'This is a title',
        'description': 'This is a description!',
        'keywords': [],
        'create': contructionFunction,
        'createOnce': true/false
    },'resource3' : {
        'title': 'This is a title',
        'description': 'This is a description!',
        'keywords': [],
        'create': function,
        'createOnce': true/false
    }
    
   }
 *
 */
function ComponentFactory(manifest){
    
    EventDispatcher.call(this);
    this.manifest = manifest;

}
ComponentFactory.prototype = Object.create(EventDispatcher.prototype);
ComponentFactory.prototype.constructor = ComponentFactory;


ComponentFactory.prototype.getResourceList = function(){
    return Object.getOwnPropertyNames(this.manifest);
}

ComponentFactory.prototype.hasResource = function(resource){
    return this.getResourceList().indexOf(resource) !== -1;
}


ComponentFactory.prototype.create = function(resource){
    if(!this.hasResource(resource))
        throw new Error("This factory does not have the specified resource");
    
    var result = this.manifest[resource].create();
    
    if(this.manifest[resource].createOnce){
        
        var handler = function(){};//default handler

        delete this.manifest[resource];
        
        this.fireEvent({
            'type': 'resourceReleased',
            'resource': resource
        });
        
    }
        
    return result;
}
//TODO: Go through the keywords
ComponentFactory.prototype.getResourceListFiltered = function(keyword){
    return Object.getOwnPropertyNames(this.manifest).filter(function(resource){
        return resource.indexOf(keyword) !== -1;
    });
}

ComponentFactory.prototype.getResourceInfo = function(resource){
    if(!this.hasResource(resource))
        throw new Error("This factory does not have the specified resource");
        
    return {
        'title':  this.manifest[resource].title,
        'description':  this.manifest[resource].description,
        'keywords': this.manifest[resource].keywords
    };
    
}

