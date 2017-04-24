//Class Point


Point = (function(){

    var x;
    var y;
    
    return function (x,y){
        
        this.onXChange = function(newVal){
            
        }
        this.onYChange = function(newVal){
            
        }
        
        Object.defineProperty(this, 'x', {
            enumerable : true,
            configurable : false,
            get : function() {
                return x;
            },
            set : function(newValue) {
                
                if(x !== newValue){
                    x = newValue;
                    this.onXChange(newValue);
                }
 
            } 
        });
        
        Object.defineProperty(this, 'y', {
            enumerable : true,
            configurable : false,
            get : function() {
                return y;
            },
            set : function(newValue) {
                
                if(y !== newValue){
                    y = newValue;
                    this.onYChange(newValue);
                }
                
            } 
        });
        
    }
    
})();

function CubicLine(){
    var svgNS = 'http://www.w3.org/2000/svg';
    
    this.element = document.createElementNS(svgNS,'path');
    this.element.setAttributeNS(null, 'class','flow-cubic-line');
    
    this.current = [
        0, 0, //start point
        0, 0, //end point
        0, 0, //controlA point
        0, 0  //controlB point
    ];
    
    this.start = new Point(0,0);
    this.end = new Point(0,0);
    this.controlA = new Point(0,0);
    this.controlB = new Point(0,0);
 
    var object = this;
    
    this.start.onXChange = function(newValue) {
        object.changeValue(0,newValue);
    }
    
    this.start.onYChange = function(newValue) {
        object.changeValue(1,newValue);
    }
    
    this.end.onXChange = function(newValue) {
        object.changeValue(2,newValue);
    }
    
    this.end.onYChange = function(newValue) {
        object.changeValue(3,newValue);
    }
    
    this.controlA.onXChange = function(newValue) {
        object.changeValue(4,newValue);
    }
    
    this.controlA.onYChange = function(newValue) {
        object.changeValue(5,newValue);
    }
    
    this.controlB.onXChange = function(newValue) {
        object.changeValue(6,newValue);
    }
    
    this.controlB.onYChange = function(newValue) {
        object.changeValue(7,newValue);
    }

}

CubicLine.prototype.update = function(){
        
    var result = 'M' + this.current[0] + ' ' + this.current[1];
    result += ' C ' + this.current[4] + ' ' + this.current[5] + ' , ';
    result += this.current[6] + ' ' + this.current[7] + ' , ';
    result += this.current[2] + ' ' + this.current[3];
    this.element.setAttribute('d',result);
        
}

CubicLine.prototype.changeValue = function(index,newValue) {
    this.current[index] = newValue;
    this.update();
}


//UTILITY
function makeDraggable(dragAreaElement,dragElement){
    
    /* Handle dragging */
    var valueX = 0;
    var valueY = 0;
    
    function move(e){

        var parentBoundingClientRect = dragElement.parentNode.getBoundingClientRect();
        var top = parentBoundingClientRect.top;
        var left = parentBoundingClientRect.left;     
        
        var x = e.pageX - left - valueX;
        var y = e.pageY - top - valueY;
        
        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;

        x = x > dragElement.parentNode.offsetWidth  - dragElement.offsetWidth  ? dragElement.parentNode.offsetWidth  - dragElement.offsetWidth  : x;
        y = y > dragElement.parentNode.offsetHeight - dragElement.offsetHeight ? dragElement.parentNode.offsetHeight - dragElement.offsetHeight : y;
        
        dragElement.style.left = x + 'px';
        dragElement.style.top = y + 'px';

 
        var event = new CustomEvent("dragged", { 
            "detail": "Element dragged",
            'pageX' : e.pageX,
            'pageY' : e.pageY
        });
        dragElement.dispatchEvent(event);
        
    }
    
    function mouseUp(e){
        window.removeEventListener('mousemove', move, true);
        var bodyClass = document.body.getAttribute('class') || '';
        if(bodyClass != ''){
            bodyClass = bodyClass.replace(' disable-select', '');
            document.body.setAttribute('class', bodyClass);
        }
    }
    
    function mouseDown(e){
        
        var bodyClass = document.body.getAttribute('class') || '';
        document.body.setAttribute('class', bodyClass + ' disable-select');
        
        var dragElementBoundingClientRect = dragElement.getBoundingClientRect();
        var top = dragElementBoundingClientRect.top;
        var left = dragElementBoundingClientRect.left;
        
        valueX = event.pageX - left;
        valueY = event.pageY - top;
        window.addEventListener('mousemove', move, true);
        
    }
    
    dragAreaElement.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
    
}


function FlowCanvas(){
    
    var svgNS = 'http://www.w3.org/2000/svg';
    
    this.element = document.createElement('div');
    this.element.setAttribute('class','flow-canvas');
    this.element.style.width = '100%';
    this.element.style.height = '100%'

    this.svgCanvas = document.createElementNS(svgNS ,'svg');
    this.svgCanvas.setAttributeNS(null,'class','flow-canvas-svg');
    
    this.element.appendChild(this.svgCanvas);
    this.flowSockets = [];
    
}

FlowCanvas.prototype.getElementOffset = function(element){
    
    var elementBoundingClientRect = element.getBoundingClientRect();
    var flowCanvasBoundingClientRect = this.element.getBoundingClientRect();
    
    return {
        'x': elementViewportOffset.left - flowCanvasBoundingClientRect.left,
        'y': elementViewportOffset.top - flowCanvasBoundingClientRect.top
    }
    
}


FlowCanvas.prototype.getViewportPointOffset = function(viewportPointX, viewportPointY){
    
    var flowCanvasViewportOffset = this.element.getBoundingClientRect();
    
    return {
        'x': viewportPointX - flowCanvasViewportOffset.left,
        'y': viewportPointY - flowCanvasViewportOffset.top
    }
    
}



//Receive the flow object in order to update position changes to the sockets connection
function FlowSocket(flowCanvas) {

    this.circleSize = 16;
    this.borderThickness = 2;
    
    var svgNS = 'http://www.w3.org/2000/svg';
    
    this.element = document.createElementNS(svgNS ,'svg');
    this.element.setAttributeNS(null,'class','flow-socket-svg');
    this.flowCanvas = flowCanvas;


    this.circle = document.createElementNS(svgNS ,'circle');
    var circle = this.circle;
    
    var arrayClass = [];
    
    this.circleClasses = {
        'addClass' : function(className){
            var index = arrayClass.indexOf(className);
             
            if (index === -1) {
                arrayClass.push(className);
                circle.setAttributeNS(null,'class','flow-socket-circle ' + arrayClass.join(' '));
            }
            
        },
        'removeClass' : function(className){
            var index = arrayClass.indexOf(className);
            
            if (index > -1) {
                arrayClass.splice(index, 1);
                circle.setAttributeNS(null,'class','flow-socket-circle ' + arrayClass.join(' '));
            }
            
        },
        'removeAllClasses' : function() {
            arrayClass = [];
            circle.setAttributeNS(null,'class','flow-socket-circle');
        },
        'hasClass' : function(className) {
            return arrayClass.indexOf(className) > -1;
        }
        
    };
    

    /*
    Accept conditions are functions that validate the acceptance of sockets.
    Each of the functions on the array receives the socket to test its acceptance
    and must return either true or false whether
    */
    this.acceptConditions = [];
     /*
    tries to accept a socket, usually used for testing if the sockets can
    establish a safe and relevant connection. The function must return
    true to accept or false to refuse
    */
    this.accept = function(socket){
        return this.acceptConditions.every(function(acceptCondition) {
            return acceptCondition(socket);
        });
    }
    
    /*
    Request conditions are functions that validate a connection request.
    Each of the functions on the array receives the socket that is attempting to connect
    and must return either true or false
    */
    this.requestsConditions = [];
    /*
    Request actions are functions that run on a connection request.
    Each of the functions on the array receives the socket that is attempting to connect
    */
    this.requestsActions = [];
    this.onRequestConnect = function(socket){
        
        this.requestsActions.forEach(function(requestAction){
            requestAction(socket);
        });
        
        //Evaluates every request condition and cancels if one or more are not met
        return this.requestsConditions.every(function(requestCondition) {
            return requestCondition(socket);
        });

    }
    
    /*
    Connect actions are functions that run after a connection is established between sockets.
    Each of the functions on the array receives the socket that connected to this socket
    */
    this.onConnectActions = [];
    //Ocurs when a socket is connected to another socket
    this.onConnect = function (socket){
        this.onConnectActions.forEach(function(onConnectAction){
            onConnectAction(socket);
        });
    }
    
    
    /*
    Connect actions are functions that run after a disconnection between sockets.
    Each of the functions on the array receives the socket that disconnected to this socket
    */
    this.onDisconnectActions = [];
    //Ocurs when a socket is disconnected to another socket
    this.onDisconnect = function (socket){
        this.onDisconnectActions.forEach(function(onDisconnectAction){
            onDisconnectAction(socket);
        });
    }


    this.element.appendChild(this.circle);
    this.circle.setAttributeNS(null, 'class', 'flow-socket-circle');
    this.circle.setAttributeNS(null, 'cx', this.circleSize / 2);
    this.circle.setAttributeNS(null, 'cy', this.circleSize / 2);
    this.circle.setAttributeNS(null, 'r', this.circleSize / 2 - this.borderThickness);
    
    this.connections = [];
    this.offsetControl = {
        'x': 0,
        'y': 0
    }

    
    var socket = this;
    var socketHalfSize = socket.circleSize / 2;
    
    function socketsMatch(socket1, socket2){
        return  socket1 != socket2 && socket1.accept(socket2) && socket2.accept(socket1);
    }
    
    function markAcceptable(){
        
        flowCanvas.flowSockets.forEach(function(flowSocket){

            if(socketsMatch(socket, flowSocket)) {
                flowSocket.circleClasses.addClass('accepting');
            }
            
        });
        
    }
    
    function unmarkAcceptable(){
        
        flowCanvas.flowSockets.forEach(function(flowSocket){
            
            if(socketsMatch(socket, flowSocket)){
                flowSocket.circleClasses.removeClass('accepting');
            }
            
        });
        
    }
    
    function areConnected(socket1, socket2){
        return socket1.connections.some(function(connection){
            return (connection.line.socketA === socket1 && 
            connection.line.socketB === socket2) || (connection.line.socketB === socket1 && 
            connection.line.socketA === socket2);
        });
    }
    
    function requestConnection(socket1, socket2, connection){

        if(!socketsMatch(socket1,socket2)){
            return;
        }
        
        if(areConnected(socket1,socket2))
            return;
        
        if(!socket2.onRequestConnect(socket1))
            return;
        
        if(!socket1.onRequestConnect(socket2))
            return;

        connection.done = true;

        socket1.circleClasses.removeAllClasses();
        socket1.circleClasses.addClass('connected');
        
        socket2.circleClasses.removeAllClasses();
        socket2.circleClasses.addClass('connected');
        
        connection.line.element.setAttributeNS(null,'class','flow-socket-connection');
        
        function generateUpdateConnectionEndPointFunction(socket, isASide){
            
            return function(){
                
                var socketBoundingClientRect = socket.element.getBoundingClientRect();
                var socketOffset = flowCanvas.getViewportPointOffset(socketBoundingClientRect.left, socketBoundingClientRect.top);
               
                var x = socketOffset.x + socketHalfSize;
                var y = socketOffset.y + socketHalfSize;
                
                if(isASide) {
                    connection.line.start.x = x;
                    connection.line.start.y = y;
                    connection.line.controlA.x = x + socket.offsetControl.x;
                    connection.line.controlA.y = y + socket.offsetControl.y;
                    connection.line.socketA = socket;
                    
                } else {
                    connection.line.end.x = x;
                    connection.line.end.y = y;
                    connection.line.controlB.x = x + socket.offsetControl.x;
                    connection.line.controlB.y = y + socket.offsetControl.y;
                    connection.line.socketB = socket;
                }
            }
            
        }

        var connectionData1 = {
            "control":'B',
            "line": connection.line,
            "connectedSocket": socket2,
            "updateConnectionEndPoint" : generateUpdateConnectionEndPointFunction(socket1,false)
        };
        
        socket1.connections.push(connectionData1);
        connectionData1.updateConnectionEndPoint();
        
        var connectionData2 = {
            "control":'A',
            "line": connection.line,
            "connectedSocket": socket1,
            "updateConnectionEndPoint" : generateUpdateConnectionEndPointFunction(socket2,true)
        };
        
        socket2.connections.push(connectionData2);
        connectionData2.updateConnectionEndPoint();
        
        
        function destroyConnection(){
            
            connectionData1.destroyConnection = function() {};
            connectionData2.destroyConnection = function() {};
            connectionData1.updateConnectionEndPoint = function() {};
            connectionData2.updateConnectionEndPoint = function() {};
            
            
            var index1 = socket1.connections.indexOf(connectionData1);
            socket1.connections.splice(index1, 1);
            var index2 = socket2.connections.indexOf(connectionData2);
            socket2.connections.splice(index2, 1);
            
            if(socket1.connections.length == 0)
                socket1.circleClasses.removeAllClasses();
            if(socket2.connections.length == 0)
                socket2.circleClasses.removeAllClasses();
            
            flowCanvas.svgCanvas.removeChild(connection.line.element);
            
            socket1.onDisconnect(socket2);
            socket2.onDisconnect(socket1);

        }
        
        connection.line.element.onclick = function(e){
            destroyConnection();
        }
        
        connectionData1.destroyConnection = destroyConnection;
        connectionData2.destroyConnection = destroyConnection;
        
        //Fire onConnect handlers
        socket2.onConnect(socket1);
        socket1.onConnect(socket2);
            
    }
    
    
    function move(e){
        
        var offset = flowCanvas.getViewportPointOffset(e.pageX, e.pageY); 
        
        offset.x -= window.scrollX;
        offset.y -= window.scrollY;
        
        flowCanvas.connection.line.end.x = offset.x ;
        flowCanvas.connection.line.end.y = offset.y;
        flowCanvas.connection.line.controlB.x = offset.x;
        flowCanvas.connection.line.controlB.y = offset.y;
        
    }
    
    //mouseup runs after socketMouseUp
    function mouseUp(e){
        
        window.removeEventListener('mousemove', move, true);
        window.removeEventListener('mouseup', mouseUp, false);
        
        var bodyClass = document.body.getAttribute('class') || '';
        if(bodyClass != ''){
            bodyClass = bodyClass.replace(' disable-select', '');
            document.body.setAttribute('class', bodyClass);
        }
        
        unmarkAcceptable();

        //Connection is not established between sockets
        if(!flowCanvas.connection.done){
          
            flowCanvas.svgCanvas.removeChild(flowCanvas.connection.line.element);
            
            if(!socket.circleClasses.hasClass('connected'))
                socket.circleClasses.removeAllClasses();

        }
        
        delete flowCanvas.connection;

    }
    
    function socketMouseDown(e){
        
        
        var bodyClass = document.body.getAttribute('class') || '';
        document.body.setAttribute('class', bodyClass + ' disable-select');

        if(!socket.circleClasses.hasClass('connected'))
            socket.circleClasses.addClass('action');
        
        //Change class style of the supported sockets
        markAcceptable();
        
        var socketBoundingClientRect = socket.element.getBoundingClientRect();
        var socketOffset = flowCanvas.getViewportPointOffset(socketBoundingClientRect.left, socketBoundingClientRect.top);

        var x = socketOffset.x + socketHalfSize;
        var y = socketOffset.y + socketHalfSize;
        
        var line = new CubicLine();
        flowCanvas.svgCanvas.appendChild(line.element);
        
        line.start.x = x;
        line.start.y = y;
        line.controlA.x = x + socket.offsetControl.x;
        line.controlA.y = y + socket.offsetControl.y;
        line.end.x = x;
        line.end.y = y;
        line.controlB.x = x;
        line.controlB.y = y;
        
        //Create a shared connection which will be destroid once the mouse is up
        flowCanvas.connection = {
            'line' : line,
            'socket' : socket
        };
        
        //Using capture phase to make sure it runs first
        window.addEventListener('mousemove', move, true);
        window.addEventListener('mouseup', mouseUp, false);
        
    }
    
    function socketMouseUp(e){
        
        if(flowCanvas.connection === void 0)
            return;

        requestConnection(socket,flowCanvas.connection.socket, flowCanvas.connection);

    }
    
    function socketMouseOver(e){
        
        if(flowCanvas.connection == void 0 || 
            !socketsMatch(socket,flowCanvas.connection.socket))
            return;
            
        if(!socket.circleClasses.hasClass('connected')){
            socket.circleClasses.addClass('action');
        }
        
    }
    
    function socketMouseOut(e){
        
        if(flowCanvas.connection !== void 0 && flowCanvas.connection.socket != socket){

            if(!socket.circleClasses.hasClass('connected'))
                socket.circleClasses.removeClass('action');
  
        }
        
    }
    
    //add event handlers in bubbling phase
    socket.element.addEventListener('mousedown', socketMouseDown, false);
    socket.element.addEventListener('mouseup', socketMouseUp, false);
    socket.element.addEventListener('mouseover', socketMouseOver, true);
    socket.element.addEventListener('mouseout', socketMouseOut, true);
    
    flowCanvas.flowSockets.push(this);    


}
FlowSocket.prototype.updateConnectionsEndPoints = function(){
    this.connections.forEach(function(connection){
            connection.updateConnectionEndPoint();
    });
}
