/* Mars location map: flat map of Mars (east longitude 0-360). Coordinates: NASA NSSDC / mission papers, as compiled by The Planetary Society's Mars landing-site map. */
const SITES=[
["Viking 1",22.48,310.03,["Viking 1 Lander"],"mars-1","Chryse Planitia","22.48°N, 310.03°E (49.97°W)"],
["Mars Pathfinder",19.33,326.45,["Sojourner Rover"],"mars-2","Ares Vallis","19.33°N, 326.45°E (33.55°W)"],
["Spirit",-14.57,175.48,["Spirit Rover"],"mars-3","Gusev crater","14.57°S, 175.48°E"],
["Opportunity",-1.95,354.47,["Opportunity Rover"],"mars-4","Meridiani Planum","1.95°S, 354.47°E"],
["InSight",4.50,135.62,["InSight Lander"],"mars-5","Elysium Planitia","4.50°N, 135.62°E"],
["Jezero Crater",18.44,77.45,["Ingenuity Helicopter (flew near the Perseverance landing site)"],"mars-6","Jezero Crater","18.44°N, 77.45°E (landing site, approximate for Ingenuity)"]];
const W=680,H=340,LBL={0:[-9,-9,"end"],1:[0,22,"middle"],2:[0,-12,"middle"],3:[8,26,"end"],4:[0,-12,"middle"],5:[0,-12,"middle"]};
let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Flat map of Mars showing landing sites"><defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a3a1c"/><stop offset=".5" stop-color="#c4602f"/><stop offset="1" stop-color="#6a2a14"/></linearGradient></defs><rect width="${W}" height="${H}" rx="14" fill="url(#mg)"/><g stroke="#fff3" fill="none">`;
for(let l=0;l<=360;l+=60)svg+=`<line x1="${l/360*W}" y1="0" x2="${l/360*W}" y2="${H}"/>`;
for(let a=-60;a<=60;a+=30)svg+=`<line x1="0" y1="${(90-a)/180*H}" x2="${W}" y2="${(90-a)/180*H}"/>`;
svg+=`</g><g fill="#fff9" font-family="Inter,sans-serif" font-size="9">`;
for(let l=0;l<=360;l+=60)svg+=`<text x="${l/360*W+(l==360?-4:3)}" y="${H-4}" text-anchor="${l==360?"end":"start"}">${l}°E</text>`;
svg+=`</g><line x1="0" y1="${H/2}" x2="${W}" y2="${H/2}" stroke="#fff6" stroke-dasharray="3 4"/>`;
SITES.forEach((s,i)=>{const x=s[2]/360*W,y=(90-s[1])/180*H,L=LBL[i];svg+=`<g class="site" data-i="${i}" tabindex="0"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" fill="transparent"/><circle class="dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6"/><text x="${(x+L[0]).toFixed(1)}" y="${(y+L[1]).toFixed(1)}" text-anchor="${L[2]}">${s[0]}</text></g>`});
svg+="</svg>";
const box=document.getElementById("marsmap");
box.innerHTML=`<div>${svg}<p class="mnote">Flat map of Mars. The dashed line is the equator. Longitude is measured east from 0° to 360°.</p></div><div><h2>Where was it left?</h2><p>Select a site to see the equipment that stayed there.</p><div id="siteinfo"></div><p class="mnote">Coordinates: NASA NSSDC and mission papers, compiled in <a href="https://www.planetary.org/space-images/mars_landing_site_map_lakdawalla" target="_blank" rel="noopener" style="color:#9ee7ff">The Planetary Society's Mars landing-site map</a>. Jezero Crater: Perseverance landing site, about 18.44°N, 77.45°E.</p></div>`;
function pick(i){const s=SITES[i];document.querySelectorAll(".site").forEach((g,j)=>g.classList.toggle("on",i==j));document.getElementById("siteinfo").innerHTML=`<h3 style="font-size:24px;color:#ff9a5a">${s[0]}</h3><p class="mnote">${s[5]} · ${s[6]}</p><ul>${s[3].map(t=>`<li>${t}</li>`).join("")}</ul><a href="explore.html#e-${s[4]}" style="color:#9ee7ff">Open in the Equipment Explorer →</a>`}
box.querySelectorAll(".site").forEach(g=>{g.onclick=()=>pick(+g.dataset.i);g.onkeydown=e=>{if(e.key=="Enter")pick(+g.dataset.i)}});pick(0);
