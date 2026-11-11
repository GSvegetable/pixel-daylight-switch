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
precision highp sampler2D;
uniform sampler2D uSource;
uniform vec2 uRes,uSourceSize,uPill,uOrigin;
uniform vec4 uLens;
uniform float uK,uBezel,uRefraction,uDispersion,uShine,uNight,uLift,uSeam,uOpacity;
uniform vec3 uShellDay,uShellNight,uInk,uLight,uHiNight,uLoNight;
out vec4 outColor;
vec3 envLow,envHigh;
float rb(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}
vec3 smoothTex(vec2 uv){vec2 st=uv*uSourceSize-0.5;vec2 i=floor(st);vec2 f=st-i;vec2 f2=f*f;vec2 f3=f2*f;vec2 w0=(1.0-3.0*f+3.0*f2-f3)/6.0;vec2 w1=(4.0-6.0*f2+3.0*f3)/6.0;vec2 w2=(1.0+3.0*f+3.0*f2-3.0*f3)/6.0;vec2 w3=f3/6.0;vec2 g0=w0+w1;vec2 g1=w2+w3;vec2 h0=(i-0.5+w1/g0+0.5)/uSourceSize;vec2 h1=(i+1.5+w3/g1+0.5)/uSourceSize;return g0.y*(g0.x*texture(uSource,vec2(h0.x,h0.y)).rgb+g1.x*texture(uSource,vec2(h1.x,h0.y)).rgb)+g1.y*(g0.x*texture(uSource,vec2(h0.x,h1.y)).rgb+g1.x*texture(uSource,vec2(h1.x,h1.y)).rgb);}
vec3 worldExact(vec2 frag){vec2 w=vec2(frag.x-uOrigin.x,uOrigin.y-frag.y)/uK;ivec2 t=clamp(ivec2(floor(w)),ivec2(0),ivec2(uSourceSize)-1);return texelFetch(uSource,t,0).rgb;}
vec3 worldBent(vec2 frag,float scale,float foot){vec2 w=vec2(frag.x-uOrigin.x,uOrigin.y-frag.y)/uK;if(foot>1.0)return textureLod(uSource,w/uSourceSize,log2(foot)).rgb;vec2 r=floor(w+0.5);vec2 sharp=r-0.5+clamp((w-r)/max(foot,1.0e-3)+0.5,0.0,1.0);return textureLod(uSource,sharp/uSourceSize,0.0).rgb;}
float softBox(vec2 p,vec2 c,vec2 h,float s){vec2 q=abs(p-c)-h;float d=length(max(q,0.0))+min(max(q.x,q.y),0.0);return 1.0-smoothstep(-s,s,d);}
vec3 studio(vec3 R){vec3 c=mix(envLow,envHigh,smoothstep(-0.55,0.85,R.y));vec2 s=R.xy/(1.0+max(R.z,0.0));float key=softBox(s,vec2(-0.1,0.56),vec2(0.5,0.11),0.17);float fill=softBox(s,vec2(0.34,-0.6),vec2(0.3,0.05),0.2);c+=envHigh*key*1.15;c+=envHigh*fill*0.14;return c;}
vec3 shellColor(vec2 p,float d){vec2 q=p;float inner=uPill.x-uPill.y;q.x=sign(p.x)*max(abs(p.x)-inner,0.0);vec2 g=q/max(length(q),1.0e-3);float t=clamp(-d/uBezel,0.0,1.0);float a=1.0-2.0*t;a=sign(a)*pow(abs(a),1.35)*0.96;vec3 N=normalize(vec3(g*a,sqrt(max(1.0-a*a,0.02))));vec3 R=vec3(2.0*N.z*N.xy,2.0*N.z*N.z-1.0);vec3 albedo=mix(uShellDay,uShellNight,uNight);float diffuse=0.62+0.38*clamp(dot(N,normalize(vec3(-0.25,0.75,0.6))),0.0,1.0);float fresnel=0.05+0.95*pow(1.0-N.z,3.5);vec3 c=mix(albedo*diffuse,studio(R),clamp(fresnel*0.9+0.1,0.0,1.0));return c;}
vec3 reach(vec2 p,vec2 pos,vec3 col,float radius){vec2 L=pos-p;float r2=radius*radius;return col*r2/(r2+dot(L,L));}
void main(){
 vec2 frag=gl_FragCoord.xy;vec2 p=frag-0.5*uRes;envLow=mix(uShellDay*0.74,uLoNight,uNight);envHigh=mix(uLight,uHiNight,uNight);
 float d=rb(p,uPill,uPill.y);float dw=d+uBezel;vec3 color=uInk*0.0;float alpha=0.0;
 if(d>-2.0){float h=uPill.y;float wide=rb(p+vec2(0.0,h*0.13),uPill-vec2(h*0.02),h);float contact=rb(p+vec2(0.0,h*0.028),uPill,h);float shadow=0.24*(1.0-smoothstep(-h*0.2,h*0.28,wide))+0.22*(1.0-smoothstep(-h*0.03,h*0.07,contact));color=uInk*shadow;alpha=shadow;}
 if(d<1.0){vec3 body=dw>-0.8?shellColor(p,d):vec3(0.0);if(dw<1.0){vec3 c=worldExact(frag);float win=uPill.y-uBezel;float sheen=smoothstep(win*0.1,win*1.02,p.y+p.x*0.09);c=mix(c,envHigh,sheen*sheen*mix(0.17,0.05,uNight));float low=smoothstep(-win*0.5,-win*1.05,p.y-p.x*0.05);c=mix(c,envHigh,low*mix(0.05,0.015,uNight));float top=rb(p-vec2(0.0,win*0.06),uPill-vec2(uBezel),win);float inset=1.0-smoothstep(-win*0.2,win*0.03,top);float ring=exp(max(dw,-win)/(win*0.075));float depth=clamp(ring*0.46+exp(min(top,0.0)/(win*0.1))*0.4*inset,0.0,0.82);c=mix(c,uInk,depth);
 vec2 lc=uLens.xy;vec2 he=uLens.zw;float lr=min(he.x,he.y);vec2 lq=p-lc;float lift=0.055+uLift*0.04;float sd=rb(lq+vec2(0.0,lr*lift*1.5),he,lr);float sh=1.0-smoothstep(-lr*0.16,lr*(0.2+uLift*0.1),sd);c=mix(c,uInk,sh*mix(0.36,0.55,uNight));float ld=rb(lq,he,lr);
 if(ld<1.0){vec2 axis=lq;vec2 inner2=max(he-lr,vec2(0.0));axis.x=sign(lq.x)*max(abs(lq.x)-inner2.x,0.0);axis.y=sign(lq.y)*max(abs(lq.y)-inner2.y,0.0);float rad=length(axis);vec2 gr=axis/max(rad,1.0e-3);float rho=clamp(rad/lr,0.0,1.0);float mag=uRefraction;float bt=clamp((rho-0.7)/0.3,0.0,1.0);float band=bt*bt*(3.0-2.0*bt);float strength=1.0-1.0/mag+0.2;float bend=pow(band,2.2)*lr*strength;vec2 base=lc+lq/mag;vec2 shiftDir=gr*bend;vec2 center=0.5*uRes;float dBand=6.0*bt*(1.0-bt)/0.3;float foot=(1.0/mag+2.2*pow(max(band,1.0e-3),1.2)*dBand*strength)/uK;vec3 seen;float scale=uK*mag;if(band>0.02){float ca=uDispersion*band;seen.r=worldBent(center+base+shiftDir*(1.0-ca),scale,foot).r;seen.g=worldBent(center+base+shiftDir,scale,foot).g;seen.b=worldBent(center+base+shiftDir*(1.0+ca),scale,foot).b;}else{seen=worldBent(center+base,scale,foot);}vec2 tilt=gr*(0.22*rho+0.78*pow(rho,7.0));vec3 N=normalize(vec3(tilt,sqrt(max(1.0-dot(tilt,tilt),0.02))));vec3 R=vec3(2.0*N.z*N.xy,2.0*N.z*N.z-1.0);vec2 lp=lq/lr;vec3 lens=seen*1.035;float edge=pow(rho,16.0);lens=mix(lens,uInk,edge*0.42);float pool=smoothstep(0.05,0.95,-lp.y*0.9+lp.x*0.2)*smoothstep(1.0,0.8,rho)*smoothstep(0.42,0.86,rho);lens+=envHigh*pool*mix(0.3,0.1,uNight);float broad=softBox(lp,vec2(-0.1,0.62),vec2(0.5,0.17),0.3)*smoothstep(0.98,0.72,rho);lens=mix(lens,envHigh,broad*mix(uShine,0.1,uNight));float fresnel=pow(1.0-N.z,3.0);float dir=0.2+0.8*smoothstep(-0.6,0.85,dot(gr,normalize(vec2(-0.42,0.9))));float mirror=clamp(fresnel*dir*dir*0.6,0.0,0.42);if(mirror>1.0e-3)lens=mix(lens,studio(R),mirror);c=mix(c,lens,1.0-smoothstep(-0.8,0.8,ld));}
 body=mix(body,c,1.0-smoothstep(-0.8,0.8,dw));}float cover=1.0-smoothstep(-0.8,0.8,d);color=mix(color,body,cover);alpha=mix(alpha,1.0,cover);}
 float n=fract(sin(dot(frag,vec2(12.9898,78.233)))*43758.5453);n+=fract(sin(dot(frag,vec2(93.989,67.345)))*24634.6345)-1.0;color+=(n*0.75)/255.0*min(alpha*4.0,1.0);outColor=vec4(clamp(color,0.0,1.0),alpha*uOpacity);
}`;

  const defaults={width:'100%',height:'100%',left:'0px',top:'0px',radius:'28px',refraction:1.24,dispersion:0.05,bezel:0.046,shine:0.44,opacity:1,edgeDark:0.42,ink:[0.08,0.1,0.16],light:[0.94,0.97,1],shellDay:[0.42,0.52,0.62],shellNight:[0.08,0.1,0.16],hiNight:[0.42,0.5,0.62],loNight:[0.06,0.08,0.13],night:0,dpr:2,continuous:true};
  function createGlass(container, options) {
    if(!container || !container.ownerDocument) throw new TypeError('createGlass(container): a DOM element is required');
    const opts={...defaults,...(options||{})};
    if(!opts.source) throw new TypeError('createGlass requires a renderable source (canvas, image, video, bitmap, or callback).');
    const doc=container.ownerDocument;
    const canvas=doc.createElement('canvas');
    canvas.setAttribute('aria-hidden','true');
    canvas.className='pixel-glass-engine';
    canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;display:block;max-width:none;max-height:none;';
    const computed=doc.defaultView.getComputedStyle(container);
    const previousPosition=container.style.position;
    if(computed.position==='static') container.style.position='relative';
    container.appendChild(canvas);
    const gl=canvas.getContext('webgl2',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,powerPreference:'high-performance'});
    if(!gl){canvas.remove();if(previousPosition!==container.style.position)container.style.position=previousPosition;throw new Error('PixelGlassEngine requires WebGL2.');}
    const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const msg=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(msg||'Shader compilation failed');}return s;};
    let program,vao,buffer,texture,raf=0,destroyed=false,source=opts.source||null,resizeObserver=null,dim={w:1,h:1};
    try{
      program=gl.createProgram();const vs=compile(gl.VERTEX_SHADER,VERT),fs=compile(gl.FRAGMENT_SHADER,FRAG);
      gl.attachShader(program,vs);gl.attachShader(program,fs);gl.bindAttribLocation(program,0,'aPos');gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'Shader link failed');
      gl.useProgram(program);vao=gl.createVertexArray();gl.bindVertexArray(vao);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
      texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.uniform1i(gl.getUniformLocation(program,'uSource'),0);
    }catch(error){canvas.remove();throw error;}
    const U={};for(const n of ['uRes','uSourceSize','uPill','uOrigin','uLens','uK','uBezel','uRefraction','uDispersion','uShine','uNight','uLift','uSeam','uOpacity','uShellDay','uShellNight','uInk','uLight','uHiNight','uLoNight'])U[n]=gl.getUniformLocation(program,n);
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
        dim=dimensions(el);if(!dim.w||!dim.h){if(opts.continuous)raf=doc.defaultView.requestAnimationFrame(draw);return;}
        gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,el);
      }
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.bindVertexArray(vao);
      const width=opts.width,height=opts.height,left=opts.left,top=opts.top;
      const cssPx=(v,total)=>{if(typeof v==='number')return v;const value=String(v??'').trim();if(value.endsWith('%'))return (parseFloat(value)||0)*total/100;return parseFloat(value)||total;};
      const w=cssPx(width,rect.width),h=cssPx(height,rect.height),x=cssPx(left,rect.width),y=cssPx(top,rect.height);
      const cx=(x+w/2)*dpr,cy=H-(y+h/2)*dpr,halfX=w*dpr/2,halfY=h*dpr/2;
      const radius=Math.min(cssPx(opts.radius,Math.min(w,h)*0.28)*dpr,halfX,halfY);
      const bezel=Math.max(0.1,Math.min(0.3,Number(opts.bezel)||0.046))*Math.min(halfX,halfY);
      gl.uniform2f(U.uResolution,W,H);gl.uniform2f(U.uCenter,cx,cy);gl.uniform2f(U.uHalf,halfX,halfY);gl.uniform2f(U.uSourceSize,dim?.w||W,dim?.h||H);
      gl.uniform1f(U.uRadius,radius);gl.uniform1f(U.uRefraction,Math.max(1.001,Number(opts.refraction)||1.24));gl.uniform1f(U.uDispersion,Math.max(0,Math.min(.25,Number(opts.dispersion)||0)));gl.uniform1f(U.uBezel,bezel);gl.uniform1f(U.uShine,Math.max(0,Number(opts.shine)||0));gl.uniform1f(U.uOpacity,Math.max(0,Math.min(1,Number(opts.opacity)??1)));gl.uniform1f(U.uEdgeDark,Math.max(0,Math.min(1,Number(opts.edgeDark)??.42)));gl.uniform3fv(U.uInk,new Float32Array(opts.ink||defaults.ink));gl.uniform3fv(U.uLight,new Float32Array(opts.light||defaults.light));gl.uniform3fv(U.uShellDay,new Float32Array(opts.shellDay||defaults.shellDay));gl.uniform3fv(U.uShellNight,new Float32Array(opts.shellNight||defaults.shellNight));gl.uniform3fv(U.uHiNight,new Float32Array(opts.hiNight||defaults.hiNight));gl.uniform3fv(U.uLoNight,new Float32Array(opts.loNight||defaults.loNight));gl.uniform1f(U.uNight,Math.max(0,Math.min(1,Number(opts.night)||0)));
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
