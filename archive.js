/* ARCHIVE page: draws the Moon and Mars as real rotating spheres.
   Each pixel of the disc is mapped to a longitude and latitude on the surface map (globe-textures.js),
   lit from the upper left, and the map is slowly turned. */
const SPEC={moon:{tilt:.1,speed:.000012,start:0,haze:null},mars:{tilt:.42,speed:.000018,start:69/360,haze:[255,160,100]}};
function Globe(cv,key){
  const S=cv.width,R=S/2-2,ctx=cv.getContext("2d"),sp=SPEC[key],TW=1024,TH=512;
  const img=new Image();img.onload=()=>{
    const o=document.createElement("canvas");o.width=TW;o.height=TH;const oc=o.getContext("2d");oc.drawImage(img,0,0);const T=oc.getImageData(0,0,TW,TH).data;
    const N=S*S,UT=new Float32Array(N),VR=new Int32Array(N),SH=new Float32Array(N),AL=new Float32Array(N),HZ=new Float32Array(N),IN=[];
    const L=[-.55,.45,.7],ln=Math.hypot(...L),ct=Math.cos(sp.tilt),st=Math.sin(sp.tilt);
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){
      const nx=(x+.5-S/2)/R,ny=(S/2-y-.5)/R,rr=nx*nx+ny*ny;if(rr>1.02)continue;
      const nz=Math.sqrt(Math.max(0,1-rr)),k=y*S+x,yy=ny*ct+nz*st,zz=-ny*st+nz*ct;
      const lon=Math.atan2(nx,zz),lat=Math.asin(Math.max(-1,Math.min(1,yy)));
      UT[k]=(lon/(2*Math.PI)+.5)*TW;VR[k]=Math.min(TH-1,Math.max(0,((.5-lat/Math.PI)*TH)|0))*TW;
      const d=(nx*L[0]+ny*L[1]+nz*L[2])/ln;SH[k]=Math.min(1,Math.max(.035,d*1.18+.06));
      AL[k]=Math.min(1,Math.max(0,(1-Math.sqrt(rr))*R/1.4));HZ[k]=sp.haze?Math.pow(1-nz,3)*.7*Math.max(.15,d+.35):0;IN.push(k);
    }
    const id=ctx.createImageData(S,S),D=id.data;let off=sp.start*TW,vis=true,last=0;
    const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
    function draw(){
      for(let n=0;n<IN.length;n++){const k=IN[n],t=(VR[k]+(((UT[k]+off)|0)&(TW-1)))*4,s=SH[k],h=HZ[k],p=k*4;
        D[p]=Math.min(255,T[t]*s+(sp.haze?sp.haze[0]*h:0));D[p+1]=Math.min(255,T[t+1]*s+(sp.haze?sp.haze[1]*h:0));D[p+2]=Math.min(255,T[t+2]*s+(sp.haze?sp.haze[2]*h:0));D[p+3]=AL[k]*255}
      ctx.putImageData(id,0,0)}
    function loop(ts){if(vis&&ts-last>33){off-=sp.speed*TW*(ts-last);last=ts;if(off<0)off+=TW*64;draw()}if(!reduce)requestAnimationFrame(loop)}
    draw();new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);requestAnimationFrame(loop)};
  img.src=TEX[key]}
document.querySelectorAll("canvas.globe").forEach(c=>Globe(c,c.dataset.g));
