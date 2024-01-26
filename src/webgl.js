const VertexShaderSource =
`
attribute vec4 Position;
void main()
{
  gl_Position = Position;
}
`;

const FragmentShaderSource =
`
precision mediump float;
void main()
{
  gl_FragColor = vec4(1, 0, 0.5, 1);
}
`;

function Main()
{
  const Arena  = ArenaCreate(1024);

  const Canvas    = document.querySelector("#glcanvas");
  const GLContext = Canvas.getContext("webgl");

  if (GLContext == null)
  {
    alert("Unable to initialize WebGL. Your machine or browser may not support it :(");
    return;
  }

  const VertexShader = GLContext.createShader(GLContext.VERTEX_SHADER);
  {
    GLContext.shaderSource(VertexShader, VertexShaderSource);
    GLContext.compileShader(VertexShader);
    const CompileStatus = GLContext.getShaderParameter(VertexShader, GLContext.COMPILE_STATUS);
    if (!CompileStatus)
    {
      console.log(GLContext.getShaderInfoLog(VertexShader));
      debugger;
    }
  }

  const FragmentShader = GLContext.createShader(GLContext.FRAGMENT_SHADER);
  {
    GLContext.shaderSource(FragmentShader, FragmentShaderSource);
    GLContext.compileShader(FragmentShader);
    const CompileStatus = GLContext.getShaderParameter(FragmentShader, GLContext.COMPILE_STATUS);
    if (!CompileStatus)
    {
      console.log(GLContext.getShaderInfoLog(FragmentShader));
      debugger;
    }
  }

  const ShaderProgram = GLContext.createProgram();
  {
    GLContext.attachShader(ShaderProgram, VertexShader);
    GLContext.attachShader(ShaderProgram, FragmentShader);
    GLContext.linkProgram(ShaderProgram);
    const LinkStatus = GLContext.getProgramParameter(ShaderProgram, GLContext.LINK_STATUS);
    if (!LinkStatus)
    {
      console.log(GLContext.getShaderInfoLog(ShaderProgram));
      debugger;
    }
  }

  const ShaderPositionLocation = GLContext.getAttribLocation(ShaderProgram, "Position");
  if (ShaderPositionLocation === -1)
  {
    debugger;
  }

  let PositionBuffer = GLContext.createBuffer();
  GLContext.bindBuffer(GLContext.ARRAY_BUFFER, PositionBuffer);

  const Positions = [0.0, 0.0, 0.0, 0.5, 0.7, 0.0];
  GLContext.bufferData(GLContext.ARRAY_BUFFER, new Float32Array(Positions), GLContext.STATIC_DRAW);

  GLContext.viewport(0, 0, GLContext.canvas.width, GLContext.canvas.height);

  GLContext.clearColor(0.0, 0.0, 0.0, 0.0);
  GLContext.clear(GLContext.COLOR_BUFFER_BIT);

  GLContext.useProgram(ShaderProgram);
  GLContext.enableVertexAttribArray(ShaderPositionLocation);
  GLContext.bindBuffer(GLContext.ARRAY_BUFFER, PositionBuffer);

  {
    const ComponentCount  = 2;
    const ComponentType   = GLContext.FLOAT;
    const NormalizeData   = false;
    const ComponentStride = 0;
    const StartOffset     = 0;
    GLContext.vertexAttribPointer(ShaderPositionLocation, 2, GLContext.FLOAT, false, 0, 0);
    GLContext.drawArrays(GLContext.TRIANGLES, 0, 3);
  }
}

function ArenaCreate(ByteCount)
{
  let Arena = {ByteCount: ByteCount, Position: 0, Memory: new ArrayBuffer(size)};
  return(Arena);
}

function ArenaPush(Arena, ByteCount)
{
  ByteCount = Math.min(Arena.ByteCount - Arena.Position, ByteCount);
  let Memory = new DataView(Arena.Memory, Arena.Position, ByteCount);
  Arena.Position += ByteCount;
  return(Memory);
}

Main();
