function ElementAppendChildFlowObject(flowCanvas, id, title){
    
    FlowObject.call(this, id, title);
    
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
    
    
    //Input
    var inputRows = [];
    var inputSockets = [];
    var inputLabels = [];
    
    for(var i = 0; i < 2 ; i++){
        inputRows[i] = document.createElement('div');
        inputSide.appendChild(inputRows[i]);
        inputRows[i].setAttribute('class', 'simple input-row');
        
        inputSockets[i] = new UnitFlowSocket(flowCanvas, 180, 40);
        inputRows[i].appendChild(inputSockets[i].element);
        this.bindFlowSocket(inputSockets[i]);
        
        inputLabels[i] = document.createElement('span');
        inputLabels[i].setAttribute('class', 'simple input-label');
        var inputLabelText = i == 0 ? 
            document.createTextNode('parent') : document.createTextNode('child');
        inputLabels[i].appendChild(inputLabelText);
        inputRows[i].appendChild(inputLabels[i]);
    }
    

    //Output
    var outputRow = document.createElement('div');
    outputSide.appendChild(outputRow);
    outputRow.setAttribute('class', 'simple output-row');
    
    var outputLabel = document.createElement('span');
    outputLabel.setAttribute('class', 'simple output-label');
    outputLabel.appendChild(document.createTextNode('DOMElement'));
    outputRow.appendChild(outputLabel);
    
    //this flow socket fires actions connected to it
    var elementOutputSocket = new MultipleFlowSocket(flowCanvas, 0, 40);
    outputRow.appendChild(elementOutputSocket.element);
    this.bindFlowSocket(elementOutputSocket);
    
    elementOutputSocket.getValue = function() {
        var element = inputSockets[0].getValue();
        for(var i = 1; i < inputSockets.length ; i++){
            element.appendChild(inputSockets[i].getValue());
        }
    }

    this.element.appendChild(content);
    flowCanvas.element.appendChild(this.element);

}
ElementAppendChildFlowObject.prototype = Object.create(FlowObject.prototype);
ElementAppendChildFlowObject.prototype.constructor = ElementAppendChildFlowObject;



function JSObjectCreateFlowObject(flowCanvas, id, title, width, height){
    
    FlowObject.call(this, id, title);

    var content = document.createElement('div');
    content.setAttribute('class','simple content');
    content.setAttribute("id", id + "-content");
    
    var head = document.createElement('div');
    head.setAttribute('class', 'simple head');
    content.appendChild(head);
    
    var outputSide = document.createElement('div');
    outputSide.setAttribute('class', 'simple output-side');
    head.appendChild(outputSide);
    
    var scriptElementOutputRow = document.createElement('div');
    outputSide.appendChild(scriptElementOutputRow);
    scriptElementOutputRow.setAttribute('class', 'simple output-row');

    var labelScriptElementSocket = document.createElement('span');
    labelScriptElementSocket.setAttribute('class', 'simple output-label');
    labelScriptElementSocket.appendChild(document.createTextNode('DOMElement'));
    scriptElementOutputRow.appendChild(labelScriptElementSocket);
    
    var scriptElementOutputSocket = new MultipleFlowSocket(flowCanvas, 0, 40);
    scriptElementOutputRow.appendChild(scriptElementOutputSocket.element);
    this.bindFlowSocket(scriptElementOutputSocket);
    
    var textOutputRow = document.createElement('div');
    outputSide.appendChild(textOutputRow);
    textOutputRow.setAttribute('class', 'simple output-row');
    
    var labelTextSocket = document.createElement('span');
    labelTextSocket.setAttribute('class', 'simple output-label');
    labelTextSocket.appendChild(document.createTextNode('String'));
    
    textOutputRow.appendChild(labelTextSocket);
    
    var textOutputSocket = new ObserverFlowSocket(true,flowCanvas, 0, 40);
    textOutputRow.appendChild(textOutputSocket.element);
    this.bindFlowSocket(textOutputSocket);
    textOutputSocket.element.style.display = 'inline-block';
    

    var editor = document.createElement('div');
    editor.setAttribute("id", id + "-editor");
    editor.style.clear = 'both';
    editor.style.width = width + 'px';
    editor.style.height = height + 'px';
    content.appendChild(editor);
    
    var aceEditor = ace.edit(editor);
    aceEditor.setTheme("ace/theme/monokai");
    aceEditor.getSession().setMode("ace/mode/javascript");
    textOutputSocket.getValue = aceEditor.getValue.bind(aceEditor);
    aceEditor.on("change", function(e){
        textOutputSocket.setChanged();
    });
    
    var editorClass = editor.getAttribute('class');
    editor.setAttribute('class', editorClass + ' simple editor');
    
    scriptElementOutputSocket.getValue = function() {
        
        var scriptElement =  document.createElement('script');
        var codeElement = document.createTextNode(aceEditor.getValue());
        
        scriptElement.appendChild(codeElement);
        
        return scriptElement;
        
    }

    this.element.appendChild(content);
    flowCanvas.element.appendChild(this.element);
    
    
}
JSObjectCreateFlowObject.prototype = Object.create(FlowObject.prototype);
JSObjectCreateFlowObject.prototype.constructor = JSObjectCreateFlowObject;



function HTMLCodeBuilder(title, width, height){
    
    //http://stackoverflow.com/questions/14340894/create-xml-in-javascript
    
    FlowCanvas.call(this, width, height);
    
    var xmlString = `
        <!DOCTYPE html>
        <html lang="pt-PT">
        <head>
            <meta charset="UTF-8" />
            <title>`+title+`</title>
        </head>
        <body>
        </body>
        </html>
    `;

        
    var parser = new DOMParser();
    this.xmlDocument = parser.parseFromString(xmlString, "text/xml"); 
    
    this.displayPageButton = document.createElement('Button');
    this.displayPageButtonText = document.createTextNode('Display');
    this.displayPageButton.appendChild(this.displayPageButtonText);
    this.displayPageButton.onclick = (function(){
        alert(new XMLSerializer().serializeToString(this.xmlDocument));
        
    }).bind(this);
    this.element.appendChild(this.displayPageButton);

}
HTMLCodeBuilder.prototype = Object.create(FlowCanvas.prototype);
HTMLCodeBuilder.prototype.constructor = HTMLCodeBuilder;
