/**
 * 
 * Desenvolvido por Tiago Monteiro
 * Ideias: Porque não criar uma classe chamada StyleSheet que trata de de ficheiros CSS
 *          Assim se podias produzir o Link através dessa classe para por no header do HTML
 * 
 *          - Existir a possibilidade de fazer um import de uma biblioteca atraves de uma
 *              função da classe HTML
 * 
 * */


function HTML(){
    this.doctype="html";
    this.lang="pt-PT";
    this.head=void 0;
    this.body=void 0;
}


function HTMLFlowObject(flowCanvas, html, title, width, height){
    
    FlowObject.call(this, null, title);

    var content = document.createElement('div');
    content.setAttribute('class','html content');

    
    var head = document.createElement('div');
    head.setAttribute('class', 'html head');
    content.appendChild(head);
    
    var body = document.createElement('div');
    body.setAttribute('class', 'html body');
    content.appendChild(body);
 
   

    this.element.appendChild(content);
    flowCanvas.element.appendChild(this.element);
    
    
}

function Head(title){
    
    
    this.childNodes = [];
    this.title = title;
   
    
}
Head.prototype.parse = function(){
    
    
    
    //clean all the child nodes of the Head
    while(document.head.hasChildNodes()){
        document.head.removeChild(document.head.lastChild);
    }
    
    
       //add our tittle
    var title = document.createElement('title');
    title.textContent = this.title;
    document.head.appendChild(title);
    
    
    
    //add our child nodes
        for(var i=0; i< this.childNodes.length; i++){
            document.head.appendChild(this.childNodes[i].parse());
        }
        
 
    
}
Head.prototype.add = function (node){
    this.childNodes.unshift(node);
}



function Body(){
    this.childNodes = [];
}
Body.prototype.add = function (node){
    this.childNodes.unshift(node);
}
Body.prototype.parse = function(){
    
    //remove body's nodes
   while(document.body.hasChildNodes()){
        document.body.removeChild(document.body.lastChild);
    }
    
    
    //add our child nodes
        for(var i=0; i< this.childNodes.length; i++){
            document.body.appendChild(this.childNodes[i].parse());
        }
        
}



function Meta(name,content){
    this.element = document.createElement('meta');
    this.element.name=name;
    this.element.content = content;
}
Meta.prototype.parse = function(){
    return this.element;
}



function Link(rel, type, href){
    this.element=document.createElement('link');
    this.element.rel=rel;
    this.element.type=type;
    this.element.href=href;
}
Link.prototype.parse = function(){
    return this.element;
}



function Script(){
    this.element = document.createElement('script');
    
    if(arguments.length == 1){
        this.element.textContent=arguments[0];
    }else{
        this.element.type=arguments[0];
        this.element.src=arguments[1];
    }
    
}
Script.prototype.parse = function(){
    return this.element;
}





function Style(textContent){
    
    this.element = document.createElement('style');
    this.element.textContent=textContent;
    
}
Style.prototype.parse = function() {
    return this.element;
}





window.onload = function(){
    
    
    
var flowCanvas = new HTMLCodeBuilder('MyHTML',1000, 600);
            document.body.appendChild(flowCanvas.element);    
var x = new HTML();



//x.head.add(new Meta("viewport","initial-scale=1.0"));
//x.head.add(new Link('stylesheet','text/css','css/flow_canvas.css'));
//x.head.add(new Link('stylesheet','text/css','css/flow_objects.css'));
//x.head.add(new Script('text/javascript','js/node-factory.js'));
//x.head.add(new Script('text/javascript','js/flow-sockets-components.js'));
///x.head.add(new Script('text/javascript','ace-builds/src-noconflict/ace.js'));
//x.head.add(new Script('text/javascript','js/functions.js'));
//x.head.add(new Script('text/javascript','js/ace-builds/src-noconflict/ace.js'));

//x.head.add(new Style("#map { height: 200px; width: 200px; } #editor { height: 200px; width: 350px; } "));
//x.body.add(new Script(`var flowCanvas=new FlowCanvas(1e3,600);document.body.appendChild(flowCanvas.element);var flowObject1=new FlowObjectHTMLSimpleLiteral(flowCanvas,"MyDivID","MyDiv",600,400),flowObject2=new FlowObjectHTMLSimpleLiteral(flowCanvas,"MyDiv2ID","MyDiv2",200,200),flowObject6=new FlowObject("a3","a3"),div1=document.createElement("div");flowObject6.element.appendChild(div1);var div2=document.createElement("div");flowObject6.element.appendChild(div2);var slider3=new UnitFlowSocket(flowCanvas,"StringIn",["StringOut"],180,40);div1.appendChild(slider3.element);var textArea=document.createElement("textarea");div1.appendChild(textArea),flowObject6.bindFlowSocket(slider3),flowCanvas.addFlowObject(flowObject6),slider3.onConnect=function(e){textArea.value=e.getValue()},slider3.onRequestConnect=function(){return!0};var slider3=new UnitFlowSocket(flowCanvas,"StringIn",["StringOut"],180,40);div2.appendChild(slider3.element),flowObject6.bindFlowSocket(slider3),flowCanvas.addFlowObject(flowObject6);`));

//var m = new Meta();
//m.element.charset="UTF-8";
//x.head.add(m);
        
       
      
                //x.parse();
                
                var y = new HTMLFlowObject(flowCanvas,x,'html',400,400);
                
}