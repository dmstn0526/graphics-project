// 변수들 선언
var canvas;
var gl;

var maxNumTriangles = 200;  
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;

var cIndex = 0;

var redraw = false;

//색상 저장하는 배열
var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

//콜백함수, onload = 모든 코드가 로드된 후 시작할 위치를 지정
/* 모든 action은 init()과 render()같은 함수 안에 있는데,
onload 이벤트가 발생할때, init()함수를 실행하게 한다*/
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    //canvas를 읽어옴. getElementById 함수로 "gl-canvas"를 불러옴

    gl = WebGLUtils.setupWebGL( canvas );
    //불러온 canvas를 인자로 넘겨, WebGL 코드를 설정해준다
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height ); //크기
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 ); //배경색
    gl.clear( gl.COLOR_BUFFER_BIT ); //색상 버퍼 지우는 코드

    //
    //  Load shaders and initialize attribute buffers
    //
    //GPU에 넘겨줄 Program 객체
    // initShaders를 사용하여 shader을 로드, 컴파일, 링크하여 program 객체를 생성한다.
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
     //data를 넣을 buffer를 만들고 data를 넣는다.
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    //color buffer를 만들고 color를 넣는다.
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var m = document.getElementById("mymenu");

    m.addEventListener("click", function(){
        cIndex = m.selectedIndex;
    });

    canvas.addEventListener("mousedown", function(event){
        redraw = true;
      });
  
      canvas.addEventListener("mouseup", function(event){
        redraw = false;
      });
      //canvas.addEventListener("mousedown", function(){
      canvas.addEventListener("mousemove", function(event){
  
          if(redraw) {
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
            var t = vec2(2*event.clientX/canvas.width-1,
             2*(canvas.height-event.clientY)/canvas.height-1);
          gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));
  
          gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
          t = vec4(colors[cIndex]);
          gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
          index++;
        }
  
      } );
        
    render();

}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, index );

    window.requestAnimFrame(render);
}
