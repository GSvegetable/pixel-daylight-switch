/*!
 * Pixel Daylight Switch — standalone refractive glass engine
 * Unlicense. The optical lens equations are adapted from the original app.js shader.
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PixelGlassEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERT = `#version 300 es
  in vec2 aPos;
  void main(){ gl_Position=vec4(aPos,0.0,1.0); }`;
  const FRAG = `#version 300 es
  precision highp float;
  uniform sampler2D uSource;
  uniform vec2 uResolution, uCenter, uHalf, uSourceSize;
  uniform float uRadius, uRefraction, uDispersion, uBezel, uShine, uOpacity, uEdgeDark;
  uniform vec3 uInk, uLight;
  out vec4 outColor;
  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q=abs(p)-b+vec2(r);
    return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;
  }
  float softBox(vec2 p, vec2 c, vec2 h, float s) {
    vec2 q=abs(p-c)-h;
    float d=length(max(q,0.0))+min(max(q.x,q.y),0.0);
    return 1.0-smoothstep(-s,s,d);
  }
  vec3 studio(vec3 R) {
    vec3 low=mix(vec3(0.12,0.15,0.2),vec3(0.52,0.59,0.68),0.5);
    vec3 high=mix(uLight,vec3(0.72,0.79,0.86),0.35);
    vec3 c=mix(low,high,smoothstep(-0.55,0.85,R.y));
    vec2 s=R.xy/(1.0+max(R.z,0.0));
    float key=softBox(s,vec2(-0.1,0.56),vec2(0.5,0.11),0.17);
    float fill=softBox(s,vec2(0.34,-0.6),vec2(0.3,0.05),0.2);
    return c+high*key*1.15+high*fill*0.14;
  }
  void main(){
    vec2 frag=gl_FragCoord.xy;
    vec2 p=frag-uCenter;
    float d=sdRoundBox(p,uHalf,uRadius);
    if(d>1.0){outColor=vec4(0.0);return;}
    vec2 q=p;
    vec2 inner=max(uHalf-uRadius,vec2(0.0));
    q.x=sign(p.x)*max(abs(p.x)-inner.x,0.0);
    q.y=sign(p.y)*max(abs(p.y)-inner.y,0.0);
    float rad=length(q);
    vec2 gr=q/max(rad,1.0e-3);
    float rho=clamp(rad/max(uRadius,1.0),0.0,1.0);
    float mag=max(uRefraction,1.001);
    float bt=clamp((rho-0.7)/0.3,0.0,1.0);
    float band=bt*bt*(3.0-2.0*bt);
    float strength=1.0-1.0/mag+0.2;
    float bend=pow(band,2.2)*uRadius*strength;
    vec2 base=uCenter+p/mag;
    vec2 shiftDir=gr*bend;
    vec2 uv0=vec2(base.x/uResolution.x,base.y/uResolution.y);
    float ca=uDispersion*band;
    vec2 uvR=vec2((base.x+shiftDir.x*(1.0-ca))/uResolution.x,(base.y+shiftDir.y*(1.0-ca))/uResolution.y);
    vec2 uvG=vec2((base.x+shiftDir.x)/uResolution.x,(base.y+shiftDir.y)/uResolution.y);
    vec2 uvB=vec2((base.x+shiftDir.x*(1.0+ca))/uResolution.x,(base.y+shiftDir.y*(1.0+ca))/uResolution.y);
    vec3 seen=vec3(texture(uSource,uvR).r,texture(uSource,uvG).g,texture(uSource,uvB).b);
    vec2 tilt=gr*(0.22*rho+0.78*pow(rho,7.0));
    vec3 N=normalize(vec3(tilt,sqrt(max(1.0-dot(tilt,tilt),0.02))));
    vec3 R=vec3(2.0*N.z*N.xy,2.0*N.z*N.z-1.0);
    vec2 lp=q/max(uRadius,1.0);
    vec3 lens=seen*1.035;
    float edge=pow(rho,16.0);
    lens=mix(lens,uInk,edge*uEdgeDark);
    float pool=smoothstep(0.05,0.95,-lp.y*0.9+lp.x*0.2)*smoothstep(1.0,0.8,rho)*smoothstep(0.42,0.86,rho);
    lens+=uLight*pool*uShine*0.3;
    float broad=softBox(lp,vec2(-0.1,0.62),vec2(0.5,0.17),0.3)*smoothstep(0.98,0.72,rho);
    lens=mix(lens,uLight,broad*uShine);
    float fresnel=pow(1.0-N.z,3.0);
    float dir=0.2+0.8*smoothstep(-0.6,0.85,dot(gr,normalize(vec2(-0.42,0.9))));
    float mirror=clamp(fresnel*dir*dir*0.6,0.0,0.42);
    if(mirror>1.0e-3) lens=mix(lens,studio(R),mirror);
    float edgeBand=1.0-smoothstep(-uBezel,uBezel,d);
    float innerShade=exp(-abs(d)/max(uBezel,0.5))*0.12;
    lens=mix(lens,uInk,edgeBand*0.18+innerShade);
    float topSheen=softBox(p/uHalf,vec2(-0.08,0.82),vec2(0.62,0.055),0.12)*uShine*0.22;
    lens=mix(lens,uLight,topSheen);
    float alpha=uOpacity*(1.0-smoothstep(0.0,1.0,d));
    outColor=vec4(clamp(lens,0.0,1.0)*alpha,alpha);
  }`;
  const defaults={width:'100%',height:'100%',left:'0px',top:'0px',radius:'28px',refraction:1.24,dispersion:0.05,bezel:0.046,shine:0.44,opacity:1,edgeDark:0.42,ink:[0.08,0.1,0.16],light:[0.94,0.97,1],dpr:2,continuous:true};
  function createGlass(container, options) {
    if(!container || !container.ownerDocument) throw new TypeError('createGlass(container): a DOM element is required');
    const opts={...defaults,...(options||{})};
    const doc=container.ownerDocument;
    const canvas=doc.createElement('canvas');
    canvas.setAttribute('aria-hidden','true');
    canvas.className='pixel-glass-engine';
    canvas.style.cssText='position:absolute;pointer-events:none;z-index:1;display:block;max-width:none;max-height:none;';
    const computed=doc.defaultView.getComputedStyle(container);
    const previousPosition=container.style.position;
    if(computed.position==='static') container.style.position='relative';
    container.appendChild(canvas);
    const gl=canvas.getContext('webgl2',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,powerPreference:'high-performance'});
    if(!gl){canvas.remove();if(previousPosition!==container.style.position)container.style.position=previousPosition;throw new Error('PixelGlassEngine requires WebGL2.');}
    const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const msg=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(msg||'Shader compilation failed');}return s;};
    let program,vao,buffer,texture,raf=0,destroyed=false,source=opts.source||null,sourceCanvas=null,sourceCtx=null,resizeObserver=null;
    try{
      program=gl.createProgram();const vs=compile(gl.VERTEX_SHADER,VERT),fs=compile(gl.FRAGMENT_SHADER,FRAG);
      gl.attachShader(program,vs);gl.attachShader(program,fs);gl.bindAttribLocation(program,0,'aPos');gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'Shader link failed');
      gl.useProgram(program);vao=gl.createVertexArray();gl.bindVertexArray(vao);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
      texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.uniform1i(gl.getUniformLocation(program,'uSource'),0);
    }catch(error){canvas.remove();throw error;}
    const U={};for(const n of ['uResolution','uCenter','uHalf','uSourceSize','uRadius','uRefraction','uDispersion','uBezel','uShine','uOpacity','uEdgeDark','uInk','uLight'])U[n]=gl.getUniformLocation(program,n);
    const scratch=doc.createElement('canvas');sourceCanvas=scratch;sourceCtx=scratch.getContext('2d',{willReadFrequently:false});
    function resolveSource(){if(typeof source==='function')return source();return source;}
    function dimensions(el){return {w:el?.videoWidth||el?.naturalWidth||el?.width||0,h:el?.videoHeight||el?.naturalHeight||el?.height||0};}
    function draw(){
      raf=0;if(destroyed)return;
      const rect=container.getBoundingClientRect(),dpr=Math.min(Number(opts.dpr)||2,doc.defaultView.devicePixelRatio||1,2);
      const W=Math.max(2,Math.round(rect.width*dpr)),H=Math.max(2,Math.round(rect.height*dpr));
      if(!W||!H)return;
      if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;gl.viewport(0,0,W,H);}
      const el=resolveSource();
      if(!el){if(opts.background){gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([245,236,217,255]));}else{if(opts.continuous)raf=doc.defaultView.requestAnimationFrame(draw);return;}}
      else{
        const dim=dimensions(el);if(!dim.w||!dim.h){if(opts.continuous)raf=doc.defaultView.requestAnimationFrame(draw);return;}
        gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,el);
      }
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.bindVertexArray(vao);
      const width=opts.width,height=opts.height,left=opts.left,top=opts.top;
      const cssPx=(v,total)=>typeof v==='number'?v:parseFloat(v)||total;
      const w=cssPx(width,rect.width),h=cssPx(height,rect.height),x=cssPx(left,rect.width),y=cssPx(top,rect.height);
      const cx=(x+w/2)*dpr,cy=H-(y+h/2)*dpr,halfX=w*dpr/2,halfY=h*dpr/2;
      const radius=Math.min(cssPx(opts.radius,Math.min(w,h)*0.28)*dpr,halfX,halfY);
      const bezel=Math.max(0.1,Math.min(0.3,Number(opts.bezel)||0.046))*Math.min(halfX,halfY);
      gl.uniform2f(U.uResolution,W,H);gl.uniform2f(U.uCenter,cx,cy);gl.uniform2f(U.uHalf,halfX,halfY);gl.uniform2f(U.uSourceSize,dim?.w||W,dim?.h||H);
      gl.uniform1f(U.uRadius,radius);gl.uniform1f(U.uRefraction,Math.max(1.001,Number(opts.refraction)||1.24));gl.uniform1f(U.uDispersion,Math.max(0,Math.min(.25,Number(opts.dispersion)||0)));gl.uniform1f(U.uBezel,bezel);gl.uniform1f(U.uShine,Math.max(0,Number(opts.shine)||0));gl.uniform1f(U.uOpacity,Math.max(0,Math.min(1,Number(opts.opacity)??1)));gl.uniform1f(U.uEdgeDark,Math.max(0,Math.min(1,Number(opts.edgeDark)??.42)));gl.uniform3fv(U.uInk,new Float32Array(opts.ink||defaults.ink));gl.uniform3fv(U.uLight,new Float32Array(opts.light||defaults.light));
      gl.drawArrays(gl.TRIANGLES,0,3);
      if(opts.continuous)raf=doc.defaultView.requestAnimationFrame(draw);
    }
    function schedule(){if(!raf&&!destroyed)raf=doc.defaultView.requestAnimationFrame(draw);}
    resizeObserver=typeof ResizeObserver!=='undefined'?new ResizeObserver(schedule):null;resizeObserver?.observe(container);
    if(source&&typeof source==='object'&&'addEventListener'in source){source.addEventListener('loadeddata',schedule);source.addEventListener('resize',schedule);}
    schedule();
    return {
      canvas,
      setSource(next){source=next;schedule();return this;},
      setOptions(next){Object.assign(opts,next||{});schedule();return this;},
      render(){if(raf)doc.defaultView.cancelAnimationFrame(raf);raf=0;draw();return this;},
      destroy(){if(destroyed)return;destroyed=true;if(raf)doc.defaultView.cancelAnimationFrame(raf);resizeObserver?.disconnect();if(source&&typeof source==='object'&&'removeEventListener'in source){source.removeEventListener('loadeddata',schedule);source.removeEventListener('resize',schedule);}gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteVertexArray(vao);gl.deleteProgram(program);canvas.remove();if(previousPosition!==container.style.position&&container.style.position==='relative')container.style.position=previousPosition;}
    };
  }
  return {createGlass,version:'3.1.1'};
});
