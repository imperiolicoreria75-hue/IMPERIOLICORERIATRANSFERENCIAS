'use strict';
const campos=[['titular','Titular / Razón social'],['rut','RUT'],['banco','Banco'],['tipo','Tipo de cuenta'],['numero','Número de cuenta'],['correo','Correo']];
const cuenta=window.cuentaImperio;
const completo=campos.every(([clave])=>typeof cuenta[clave]==='string'&&cuenta[clave].trim());
const boton=document.getElementById('copiar');
const estado=document.getElementById('estado');
for(const [clave,etiqueta] of campos){const fila=document.createElement('div');fila.className='data-row';const dt=document.createElement('dt');dt.textContent=etiqueta;const dd=document.createElement('dd');dd.textContent=cuenta[clave]||'Por confirmar';if(!cuenta[clave])dd.className='pending';fila.append(dt,dd);document.getElementById('datos').append(fila);}
boton.disabled=!completo;
if(completo)estado.textContent='Un toque para copiar todos los datos.';
function copiarAlternativo(texto){const aux=document.createElement('textarea');aux.value=texto;aux.setAttribute('readonly','');aux.style.cssText='position:fixed;top:0;left:0;opacity:0;font-size:16px';document.body.append(aux);aux.focus();aux.select();aux.setSelectionRange(0,texto.length);let ok=false;try{ok=document.execCommand('copy');}finally{aux.remove();boton.focus();}if(!ok)throw new Error('No se pudo copiar');}
let timer;
boton.addEventListener('click',async()=>{if(!completo)return;const texto=campos.map(([clave])=>cuenta[clave].trim()).join('\n');try{try{if(!navigator.clipboard?.writeText)throw new Error('Portapapeles no disponible');await navigator.clipboard.writeText(texto);}catch{copiarAlternativo(texto);}estado.textContent='Listo. Abre tu app del banco y pega los datos.';const toast=document.getElementById('toast');toast.hidden=false;clearTimeout(timer);timer=setTimeout(()=>{toast.hidden=true;},4000);try{navigator.vibrate?.(40);}catch{}}catch{estado.textContent='No se pudo copiar. Mantén presionado cada dato para copiarlo manualmente.';}});

function cerrarAviso(){clearTimeout(timer);document.getElementById('toast').hidden=true;}
document.getElementById('cerrar-aviso').addEventListener('click',cerrarAviso);
document.getElementById('toast').addEventListener('click',e=>{if(e.target.id==='toast')cerrarAviso();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')cerrarAviso();});
