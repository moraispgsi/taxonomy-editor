/*
This type o flowsocket is meant to allow only 0 or 1 connections which means
that if a new connection is established to this socket and there is already a
connection to the socket the new connection will take the place of the later
*/
var UnitFlowSocket = (function(){
    
    var getConnection = function() {
        if(this.hasConnection())
            return this.connections[0];
        
        return void 0;
    }
    var hasConnection = function() {
        return this.connections.length > 0;
    }
    function UnitFlowSocket(flowCanvas, controlAngleDegree , controlDistance){
        
        
        FlowSocket.call(this, flowCanvas);
    
        this.offsetControl.x = Math.cos(controlAngleDegree * Math.PI / 180) * controlDistance;
        this.offsetControl.y = - Math.sin(controlAngleDegree * Math.PI / 180) * controlDistance;
        
        this.requestsActions.push(function(socket){
            this.connections.forEach(function(connection,index,array){
                connection.destroyConnection();
            });
        }.bind(this));
        
        this.getConnection = getConnection.bind(this);
        this.hasConnection = hasConnection.bind(this);
        
    }
    UnitFlowSocket.prototype = Object.create(FlowSocket.prototype);
    UnitFlowSocket.prototype.constructor = UnitFlowSocket;
    
    return UnitFlowSocket;

})();

function MultipleFlowSocket(flowCanvas, controlAngleDegree , controlDistance){
    
    FlowSocket.call(this, flowCanvas);

    this.offsetControl.x = Math.cos(controlAngleDegree * Math.PI / 180) * controlDistance;
    this.offsetControl.y = - Math.sin(controlAngleDegree * Math.PI / 180) * controlDistance;

}
MultipleFlowSocket.prototype = Object.create(FlowSocket.prototype);
MultipleFlowSocket.prototype.constructor = MultipleFlowSocket;


/*
This class is prone to deadlocks
TODO: Limit the call stack. Check for circular connections.
*/
function ObserverFlowSocket(isUnit, flowCanvas, controlAngleDegree , controlDistance){
 
    if(isUnit)
        UnitFlowSocket.call(this, flowCanvas, controlAngleDegree , controlDistance);
    else
        MultipleFlowSocket.call(this, flowCanvas, controlAngleDegree , controlDistance);
    
    this.acceptConditions.push(function(socket){
        return (socket instanceof ObserverFlowSocket);
    });
    
    /*
    onChangeActions are functions that execute once a connected socket abstract value is changed.
    Each of the functions on the array receives the socket that changed and the new value
    */
    this.onChangeActions = [];
    
    /*
    This function should be redefined to return a meaningfull value
    */
    this.getValue = function(){
        return void 0;
    }
    
    this.onConnectActions.push(function(socket){
        socket.onChange(this,this.getValue());
    }.bind(this));

}
ObserverFlowSocket.prototype = Object.create(UnitFlowSocket.prototype);//TODO: Problem here
ObserverFlowSocket.prototype.constructor = ObserverFlowSocket;
ObserverFlowSocket.prototype.onChange = function(socket, value){
    this.onChangeActions.forEach(function(onChangeAction){
        onChangeAction(socket, value);
    });
}
ObserverFlowSocket.prototype.setChanged = function(){
    this.connections.forEach(function(connection){
        connection.connectedSocket.onChange(this,this.getValue());
    }.bind(this));
}


function ActionInducerFlowSocket(isUnit, flowCanvas, controlAngleDegree, controlDistance){
 
    if(isUnit)
        UnitFlowSocket.call(this, flowCanvas, controlAngleDegree , controlDistance);
    else
        MultipleFlowSocket.call(this, flowCanvas, controlAngleDegree , controlDistance);
    
    this.acceptConditions.push(function(socket){
        return (socket instanceof ActionFlowSocket);
    });

}
ActionInducerFlowSocket.prototype = Object.create(UnitFlowSocket.prototype);
ActionInducerFlowSocket.prototype.constructor = ActionInducerFlowSocket;
ActionInducerFlowSocket.prototype.induce = function(){
    this.connections.forEach(function(connection){
        connection.connectedSocket.fireAction(this);
    }.bind(this));
}

function ActionFlowSocket(isUnit, flowCanvas, controlAngleDegree , controlDistance){
 
    if(isUnit)
        UnitFlowSocket.call(this, flowCanvas, controlAngleDegree , controlDistance);
    else
        MultipleFlowSocket.call(this, flowCanvas, controlAngleDegree , controlDistance);
    
    this.acceptConditions.push(function(socket){
        return (socket instanceof ActionInducerFlowSocket);
    });
    
    /*
    actions are functions that execute once a connected socket abstract fires the action.
    */
    this.actions = [];

}
ActionFlowSocket.prototype = Object.create(UnitFlowSocket.prototype);
ActionFlowSocket.prototype.constructor = ActionFlowSocket;
ActionFlowSocket.prototype.fireAction = function(socket){
    this.actions.forEach(function(action){
        action(socket);
    });
}


function RadialSliderFlowSocket(flowCanvas, parent, type, arraySupportedTypes){
    
    FlowSocket.call(this, flowCanvas, type, arraySupportedTypes);
    
    parent.style.position = 'relative';
    this.element.style.position = 'absolute';
    
    this.offsetMultiplierControl = {
        'x': 0.3,
        'y': 0.3
    }
    
    function mouseMove(e){

        var parentBoundingClientRect = parent.getBoundingClientRect();
        var flowSocketBoundingClientRect = this.element.getBoundingClientRect();
        
        //Calculate the limiting angle areas
        // θ = atan(y/x)
        
        var halfParentWidth = parentBoundingClientRect.width / 2 - flowSocketBoundingClientRect.width / 2;
        var halfParentHeight = parentBoundingClientRect.height / 2 - flowSocketBoundingClientRect.height / 2;
        
        //all the angle have the same value relative to the x axis
        var limitingAngle = Math.atan(halfParentHeight / halfParentWidth);
        
        //calculate vector
        var parentCenterViewportPointOffset = flowCanvas.getViewportPointOffset(parentBoundingClientRect.left + halfParentWidth, parentBoundingClientRect.top + halfParentHeight);
        var cursorOffset = flowCanvas.getViewportPointOffset(e.pageX, e.pageY);
        
        var directionVector = {
            'x': cursorOffset.x - parentCenterViewportPointOffset.x - flowSocketBoundingClientRect.width / 2,
            'y': cursorOffset.y - parentCenterViewportPointOffset.y - flowSocketBoundingClientRect.height / 2
        };
        
        if(directionVector.x === 0 && directionVector.y == 0)
            return;

        //calculating the angle
        var angle = Math.atan( Math.abs(directionVector.y) / Math.abs(directionVector.x));
        
        //discovering the quadrant
            
        var quadrantMultiplier = {
            'x' : directionVector.x > 0 ? 1:-1,
            'y' : directionVector.y > 0 ? 1:-1,
        };
        
        this.offsetControl.x = directionVector.x * this.offsetMultiplierControl.x;
        this.offsetControl.y = directionVector.y * this.offsetMultiplierControl.y;
        
        //calculating point of intersection
        var a = 0, b = 0, h = 0;

        if(angle < limitingAngle){
            
            a = halfParentWidth * quadrantMultiplier.x;
            //finding b
            b = Math.abs(a) * Math.tan(angle) * quadrantMultiplier.y;

        } else {
            
            b = halfParentHeight * quadrantMultiplier.y;
            //finding a
            a = Math.abs(b) * Math.tan(Math.PI / 2 - angle) * quadrantMultiplier.x;

        }

        //shifting point to the left top corner of the parent
        a += halfParentWidth;
        b += halfParentHeight;

        this.element.style.left = a  + 'px';
        this.element.style.top = b  + 'px';

        this.updateConnectionsEndPoints();
        
    }
    
    window.addEventListener('mousemove', mouseMove.bind(this), false);
    parent.appendChild(this.element);
    
}
RadialSliderFlowSocket.prototype = Object.create(FlowSocket.prototype);
RadialSliderFlowSocket.prototype.constructor = RadialSliderFlowSocket;


function AreaSliderFlowSocket(flowCanvas, parent, type, arraySupportedTypes){
    
    FlowSocket.call(this, flowCanvas, type, arraySupportedTypes);
    
    parent.style.position = 'relative';
    this.element.style.position = 'absolute';
    
    this.offsetMultiplierControl = {
        'x': 0.3,
        'y': 0.3
    }
    
    function mouseMove(e){
        
  
        var parentBoundingClientRect = parent.getBoundingClientRect();
        var flowSocketBoundingClientRect = this.element.getBoundingClientRect();
        
        //Calculate the limiting angle areas
        // θ = atan(y/x)
        
        var halfParentWidth = parentBoundingClientRect.width / 2 - flowSocketBoundingClientRect.width / 2;
        var halfParentHeight = parentBoundingClientRect.height / 2 - flowSocketBoundingClientRect.height / 2;
        
        //all the angle have the same value relative to the x axis
        var limitingAngle = Math.atan(halfParentHeight / halfParentWidth);
        
        //calculate vector
        var parentCenterViewportPointOffset = flowCanvas.getViewportPointOffset(parentBoundingClientRect.left + halfParentWidth, parentBoundingClientRect.top + halfParentHeight);
        var cursorOffset = flowCanvas.getViewportPointOffset(e.pageX, e.pageY);
        
        var directionVector = {
            'x': cursorOffset.x - parentCenterViewportPointOffset.x - flowSocketBoundingClientRect.width / 2,
            'y': cursorOffset.y - parentCenterViewportPointOffset.y - flowSocketBoundingClientRect.height / 2
        };
        
        var a = 0, b = 0;
        
        if(directionVector.x < halfParentWidth && directionVector.x > - halfParentWidth
            && directionVector.y < halfParentHeight && directionVector.y > - halfParentHeight){
                
            a = directionVector.x;
            b = directionVector.y;
                 
        } else {

            if(directionVector.x === 0 && directionVector.y == 0)
                return;
    
            //calculating the angle
            var angle = Math.atan( Math.abs(directionVector.y) / Math.abs(directionVector.x));
            
            //discovering the quadrant
                
            var quadrantMultiplier = {
                'x' : directionVector.x > 0 ? 1:-1,
                'y' : directionVector.y > 0 ? 1:-1,
            };
            
            this.offsetControl.x = directionVector.x * this.offsetMultiplierControl.x;
            this.offsetControl.y = directionVector.y * this.offsetMultiplierControl.y;
            
            //calculating point of intersection
            
    
            if(angle < limitingAngle){
                
                a = halfParentWidth * quadrantMultiplier.x;
                //finding b
                b = Math.abs(a) * Math.tan(angle) * quadrantMultiplier.y;
    
            } else {
                
                b = halfParentHeight * quadrantMultiplier.y;
                //finding a
                a = Math.abs(b) * Math.tan(Math.PI / 2 - angle) * quadrantMultiplier.x;
                
            }
        
        }


        //shifting point to the left top corner of the parent
        a += halfParentWidth;
        b += halfParentHeight;

        this.element.style.left = a  + 'px';
        this.element.style.top = b  + 'px';
        
        
        this.connections.forEach(function(connection){
            connection.updateConnectionEndPoint();
        });
        
    }
    
    window.addEventListener('mousemove', mouseMove.bind(this), false);
    parent.appendChild(this.element);
    
}
AreaSliderFlowSocket.prototype = Object.create(FlowSocket.prototype);
AreaSliderFlowSocket.prototype.constructor = AreaSliderFlowSocket;


function HorizontalSliderFlowSocket(flowCanvas, parent, minOffset, maxOffset, type, arraySupportedTypes){

    
    FlowSocket.call(this,flowCanvas, type, arraySupportedTypes);

    parent.style.position = 'relative';
    this.element.style.position = 'absolute';
    this.offsetControl.x = 0;
    this.offsetControl.y = 40;
    
    function mouseMove(e){

        var parentBoundingClientRect = parent.getBoundingClientRect();
        var flowSocketBoundingClientRect = this.element.getBoundingClientRect();

        var parentViewportPointOffset = flowCanvas.getViewportPointOffset(parentBoundingClientRect.left, parentBoundingClientRect.top);
        var cursorOffset = flowCanvas.getViewportPointOffset(e.pageX, e.pageY);
        
        var marginLeft = cursorOffset.x - parentViewportPointOffset.x - flowSocketBoundingClientRect.width / 2;

        var maxValue = parentBoundingClientRect.width - flowSocketBoundingClientRect.width + maxOffset;
        var minValue = minOffset;
        marginLeft = marginLeft < maxValue ?  marginLeft : maxValue;
        marginLeft = marginLeft > minValue ?  marginLeft : minValue;
        
        this.element.style.left = marginLeft  + 'px';

        this.connections.forEach(function(connection){
            connection.updateConnectionEndPoint();
        });
        
    }
    
    window.addEventListener('mousemove', mouseMove.bind(this), false);
    parent.appendChild(this.element);
    
}
HorizontalSliderFlowSocket.prototype = Object.create(FlowSocket.prototype);
HorizontalSliderFlowSocket.prototype.constructor = HorizontalSliderFlowSocket;

