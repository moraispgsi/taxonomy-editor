
function FlowObjectSimpleLiteral(flowCanvas, id, title, width, height){
    
    FlowObject.call(this,id,title);
    
    var content = document.createElement('div');
    content.setAttribute('class','simple content');
    content.setAttribute("id", id + "-content");
    
    var head = document.createElement('div');
    head.setAttribute('class', 'simple head');
    content.appendChild(head);

    var outputSide = document.createElement('div');
    outputSide.setAttribute('class', 'simple output-side');
    head.appendChild(outputSide);
    
    var outputRow = document.createElement('div');
    outputSide.appendChild(outputRow);
    outputRow.setAttribute('class', 'simple output-row');
    
    var label = document.createElement('span');
    label.setAttribute('class', 'simple output-label');
    label.appendChild(document.createTextNode('String'));
    outputRow.appendChild(label);
    
    var textOutputSocket = new MultipleFlowSocket(flowCanvas, 0, 40);
    outputRow.appendChild(textOutputSocket.element);
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
    aceEditor.getSession().setMode("ace/mode/text");
    
    var editorClass = editor.getAttribute('class');
    editor.setAttribute('class', editorClass + ' simple editor');
    
    textOutputSocket.getValue = aceEditor.getValue.bind(aceEditor);

    this.element.appendChild(content);
    flowCanvas.element.appendChild(this.element);

}
FlowObjectSimpleLiteral.prototype = Object.create(FlowObject.prototype);
FlowObjectSimpleLiteral.prototype.constructor = FlowObjectSimpleLiteral;




