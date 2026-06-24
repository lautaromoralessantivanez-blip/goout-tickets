// ==========================
// FIREBASE
// ==========================

import {
collection,
addDoc,
getDocs,
query,
orderBy,
doc,
updateDoc,
deleteDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ==========================
// VARIABLES
// ==========================

const cliente =
document.getElementById("cliente");

const concepto =
document.getElementById("concepto");

const monto =
document.getElementById("monto");

const metodo =
document.getElementById("metodo");

const efectivo =
document.getElementById("efectivo");

const mercadopago =
document.getElementById("mercadopago");

const observaciones =
document.getElementById("observaciones");

const mixtoBox =
document.getElementById("mixtoBox");

const guardarImprimir =
document.getElementById("guardarImprimir");

// ==========================
// CONFIG EMPRESA
// ==========================

const empresaNombre =
document.getElementById("empresaNombre");

const empresaDescripcion =
document.getElementById("empresaDescripcion");

const empresaCuit =
document.getElementById("empresaCuit");

const empresaDireccion =
document.getElementById("empresaDireccion");

const empresaTelefono =
document.getElementById("empresaTelefono");

const empresaMensaje =
document.getElementById("empresaMensaje");

const anchoTicket =
document.getElementById("anchoTicket");

// ==========================
// PREVIEW
// ==========================

const prevNombre =
document.getElementById("prevNombre");

const prevDescripcion =
document.getElementById("prevDescripcion");

const prevCuit =
document.getElementById("prevCuit");

const prevDireccion =
document.getElementById("prevDireccion");

const prevTelefono =
document.getElementById("prevTelefono");

const prevCliente =
document.getElementById("prevCliente");

const prevConcepto =
document.getElementById("prevConcepto");

const prevMetodo =
document.getElementById("prevMetodo");

const prevTotal =
document.getElementById("prevTotal");

const prevMensaje =
document.getElementById("prevMensaje");

const prevNumero =
document.getElementById("prevNumero");

const prevFecha =
document.getElementById("prevFecha");

const filtroPeriodo =
document.getElementById("filtroPeriodo");

const filtroMetodo =
document.getElementById("filtroMetodo");

let ticketsCache = [];
let ultimoNumero = 0;
// ==========================
// MENU
// ==========================

const paginas =
document.querySelectorAll(".pagina");

const botones =
document.querySelectorAll(".menu-btn");

botones.forEach(btn => {

btn.addEventListener(
"click",
() => {

botones.forEach(b =>
b.classList.remove("active")
);

paginas.forEach(p =>
p.classList.remove("activa")
);

btn.classList.add("active");

document
.getElementById(
btn.dataset.page
)
.classList.add("activa");

});

});

// ==========================
// METODO MIXTO
// ==========================

metodo.addEventListener(
"change",
() => {

if(
metodo.value === "Mixto"
){

mixtoBox.style.display =
"block";

}else{

mixtoBox.style.display =
"none";

}

actualizarPreview();

}
);

// ==========================
// PREVIEW EN VIVO
// ==========================

function actualizarPreview(){

prevCliente.textContent =
cliente.value || "-";

prevConcepto.textContent =
concepto.value || "-";

prevMetodo.textContent =
metodo.value || "-";

prevTotal.textContent =
"$" +
(monto.value || 0);

const ahora =
new Date();

prevFecha.textContent =
ahora.toLocaleDateString("es-AR")
+
" "
+
ahora.toLocaleTimeString(
"es-AR",
{
hour12:false
}
);

prevNumero.textContent =
"N° " +
String(
ultimoNumero + 1
).padStart(6,"0");

}

[
cliente,
concepto,
monto,
metodo
].forEach(campo => {

campo.addEventListener(
"input",
actualizarPreview
);

});

actualizarPreview();

setInterval(
actualizarPreview,
1000
);

// ==========================
// GUARDAR CONFIGURACION
// ==========================

document
.getElementById("guardarConfig")
.addEventListener(
"click",
() => {

const config = {

nombre:
empresaNombre.value,

descripcion:
empresaDescripcion.value,

cuit:
empresaCuit.value,

direccion:
empresaDireccion.value,

telefono:
empresaTelefono.value,

mensaje:
empresaMensaje.value,

ancho:
anchoTicket.value

};

localStorage.setItem(
"configGOOUT",
JSON.stringify(config)
);

cargarConfig();

alert(
"Configuración guardada"
);

}
);

function cargarConfig(){

const config =
JSON.parse(
localStorage.getItem(
"configGOOUT"
)
);

if(!config) return;

prevNombre.textContent =
config.nombre || "GO OUT";

prevDescripcion.textContent =
config.descripcion || "";

prevCuit.textContent =
config.cuit || "";

prevDireccion.textContent =
config.direccion || "";

prevTelefono.textContent =
config.telefono || "";

prevMensaje.textContent =
config.mensaje || "";

empresaNombre.value =
config.nombre || "";

empresaDescripcion.value =
config.descripcion || "";

empresaCuit.value =
config.cuit || "";

empresaDireccion.value =
config.direccion || "";

empresaTelefono.value =
config.telefono || "";

empresaMensaje.value =
config.mensaje || "";

anchoTicket.value =
config.ancho || "80";

const ticket =
document.getElementById(
"ticketPreview"
);

ticket.style.width =
config.ancho === "58"
? "58mm"
: "80mm";

}

// ==========================
// GUARDAR TICKET FIREBASE
// ==========================

guardarImprimir.addEventListener(
"click",
guardarTicket
);

async function guardarTicket(){

try{

const fechaActual =
new Date();

if(
!cliente.value ||
!concepto.value ||
!monto.value
){
alert(
"Complete Cliente, Concepto y Monto"
);
return;
}

if(
metodo.value === "Mixto"
){

const total =
Number(monto.value);

const suma =
Number(efectivo.value || 0)
+
Number(mercadopago.value || 0);

if(total !== suma){

alert(
"La suma de Efectivo y Mercado Pago debe coincidir con el total"
);

return;

}

}
const ticketData = {

fecha:
fechaActual.toLocaleDateString(),

hora:
fechaActual.toLocaleTimeString(
"es-AR",
{
hour12:false
}
),
timestamp:
Date.now(),

numero:
ultimoNumero + 1,

numeroFormateado:
String(
ultimoNumero + 1
).padStart(6,"0"),

cliente:
cliente.value,

concepto:
concepto.value,

monto:
Number(monto.value),

metodo:
metodo.value,

efectivo:
Number(
efectivo.value || 0
),

mercadopago:
Number(
mercadopago.value || 0
),

observaciones:
observaciones.value

};

ultimoNumero++;

await addDoc(
collection(
window.db,
"tickets"
),
ticketData
);

window.print();

limpiarFormulario();

cargarTickets();

}catch(error){

console.error(error);

alert(
"Error guardando ticket"
);

}

}

// ==========================
// LIMPIAR FORM
// ==========================

function limpiarFormulario(){

cliente.value = "";

concepto.value = "";

monto.value = "";

observaciones.value = "";

efectivo.value = "";

mercadopago.value = "";

metodo.value = "Efectivo";

mixtoBox.style.display =
"none";

actualizarPreview();

}

// ==========================
// CARGAR MOVIMIENTOS
// ==========================

async function cargarTickets(){

const lista =
document.getElementById(
"listaMovimientos"
);

lista.innerHTML = "";

const q =
query(
collection(
window.db,
"tickets"
),
orderBy(
"timestamp",
"desc"
)
);

const snapshot =
await getDocs(q);

let totalGeneral = 0;
let totalEfectivo = 0;
let totalMP = 0;
let cantidad = 0;

const grupos = {};

ticketsCache = [];

snapshot.forEach(doc => {

const t = doc.data();

t.id = doc.id;

ticketsCache.push(t);

if(
t.numero &&
t.numero > ultimoNumero
){
ultimoNumero = t.numero;
}
cantidad++;

totalGeneral +=
Number(t.monto || 0);

if(
t.metodo === "Efectivo"
){

totalEfectivo +=
Number(t.monto);

}

if(
t.metodo ===
"Mercado Pago"
){

totalMP +=
Number(t.monto);

}

if(
t.metodo ===
"Mixto"
){

totalEfectivo +=
Number(t.efectivo || 0);

totalMP +=
Number(
t.mercadopago || 0
);

}

if(
!grupos[t.fecha]
){

grupos[t.fecha] = [];

}

grupos[t.fecha].push(t);

});

actualizarPreview();

Object.keys(grupos)
.forEach(fecha => {

const dia =
document.createElement("div");

dia.className = "dia";

dia.innerHTML = `

<div class="dia-header">

📅 ${fecha}
(${grupos[fecha].length})

</div>

<div class="dia-content">

${grupos[fecha]
.map(t => `

<div class="ticket-item">

<strong>
Ticket N° ${t.numeroFormateado || "000000"}
</strong>

<br>

${t.cliente}

<br>

${t.concepto}
<br>

${t.metodo === "Mixto"
? `Mixto (Ef: $${Number(t.efectivo || 0).toLocaleString()} | MP: $${Number(t.mercadopago || 0).toLocaleString()})`
: t.metodo
}
<br>

$${Number(t.monto).toLocaleString()}

<br>

${t.hora}



<br><br>

<button
class="eliminar-ticket"
data-id="${t.id}">
🗑 Eliminar
</button>

</div>

`)
.join("")}

</div>

`;

dia
.querySelector(
".dia-header"
)
.addEventListener(
"click",
() => {

const content =
dia.querySelector(
".dia-content"
);

content.style.display =
content.style.display ===
"block"
? "none"
: "block";

}
);

lista.appendChild(dia);
dia.querySelectorAll(".eliminar-ticket")
.forEach(btn => {

btn.addEventListener(
"click",
async (e) => {

e.stopPropagation();

const id = btn.dataset.id;

const claveGuardada =
localStorage.getItem("claveAdmin");

if(claveGuardada){

const clave =
prompt(
"Ingrese la clave de administrador"
);

if(clave !== claveGuardada){

alert(
"Clave incorrecta"
);

return;

}

}

const confirmar = confirm(
"¿Eliminar este comprobante?"
);

if(!confirmar) return;

try{

await deleteDoc(
doc(
window.db,
"tickets",
id
)
);

await cargarTickets();

}catch(error){

console.error(error);

alert(
"Error al eliminar"
);

}

}
);

});
});

// ==========================
// ESTADISTICAS
// ==========================

document.getElementById(
"totalGeneral"
).textContent =
"$" +
totalGeneral.toLocaleString();

document.getElementById(
"totalEfectivo"
).textContent =
"$" +
totalEfectivo.toLocaleString();

document.getElementById(
"totalMP"
).textContent =
"$" +
totalMP.toLocaleString();

document.getElementById(
"cantidadTickets"
).textContent =
cantidad;

actualizarEstadisticas();

}

// ==========================
// INICIO
// ==========================

cargarConfig();
cargarTickets();
function actualizarEstadisticas() {

let totalGeneral = 0;
let totalEfectivo = 0;
let totalMP = 0;
let cantidad = 0;

const periodo = filtroPeriodo.value;
const metodoFiltro = filtroMetodo.value;

const hoy = new Date();

let movimientosFiltrados = [];

ticketsCache.forEach(t => {

const fechaTicket = new Date(t.timestamp);

let cumplePeriodo = true;

if(periodo === "dia"){

cumplePeriodo =
fechaTicket.toDateString() ===
hoy.toDateString();

}

if(periodo === "semana"){

const hace7Dias = new Date();
hace7Dias.setDate(hoy.getDate() - 7);

cumplePeriodo =
fechaTicket >= hace7Dias;

}

if(periodo === "mes"){

cumplePeriodo =
fechaTicket.getMonth() === hoy.getMonth()
&&
fechaTicket.getFullYear() === hoy.getFullYear();

}

let cumpleMetodo = true;

if(metodoFiltro === "efectivo"){
cumpleMetodo =
t.metodo === "Efectivo"
||
(
t.metodo === "Mixto" &&
Number(t.efectivo || 0) > 0
);
}

if(metodoFiltro === "mp"){
cumpleMetodo =
t.metodo === "Mercado Pago"
||
(
t.metodo === "Mixto" &&
Number(t.mercadopago || 0) > 0
);
}

if(cumplePeriodo && cumpleMetodo){

movimientosFiltrados.push(t);

cantidad++;

if(metodoFiltro === "efectivo"){

if(t.metodo === "Efectivo"){
totalGeneral += Number(t.monto || 0);
}

if(t.metodo === "Mixto"){
totalGeneral += Number(t.efectivo || 0);
}

}
else if(metodoFiltro === "mp"){

if(t.metodo === "Mercado Pago"){
totalGeneral += Number(t.monto || 0);
}

if(t.metodo === "Mixto"){
totalGeneral += Number(t.mercadopago || 0);
}

}
else{

totalGeneral += Number(t.monto || 0);

}
if(metodoFiltro === "efectivo"){

if(t.metodo === "Efectivo"){
totalEfectivo += Number(t.monto || 0);
}

if(t.metodo === "Mixto"){
totalEfectivo += Number(t.efectivo || 0);
}

}
else if(metodoFiltro === "mp"){

if(t.metodo === "Mercado Pago"){
totalMP += Number(t.monto || 0);
}

if(t.metodo === "Mixto"){
totalMP += Number(t.mercadopago || 0);
}

}
else{

if(t.metodo === "Efectivo"){
totalEfectivo += Number(t.monto || 0);
}

if(t.metodo === "Mercado Pago"){
totalMP += Number(t.monto || 0);
}

if(t.metodo === "Mixto"){
totalEfectivo += Number(t.efectivo || 0);
totalMP += Number(t.mercadopago || 0);
}

}

}

});

document.getElementById("totalGeneral").textContent =
"$" + totalGeneral.toLocaleString();

document.getElementById("totalEfectivo").textContent =
"$" + totalEfectivo.toLocaleString();

document.getElementById("totalMP").textContent =
"$" + totalMP.toLocaleString();

document.getElementById("cantidadTickets").textContent =
cantidad;

const detalle =
document.getElementById("detalleEstadisticas");

if(!detalle){
    return;
}

detalle.innerHTML =
movimientosFiltrados.map(t => `

<div class="ticket-item">

<strong>
#${t.numeroFormateado}
</strong>

<br>

${t.cliente}

<br>

${t.concepto}

<br>

${t.metodo === "Mixto"
? `Mixto (Ef: $${Number(t.efectivo || 0).toLocaleString()} | MP: $${Number(t.mercadopago || 0).toLocaleString()})`
: t.metodo
}

<br>

$${Number(t.monto).toLocaleString()}
<br>

${t.fecha} ${t.hora}

</div>

`).join("");
}
filtroPeriodo.addEventListener(
"change",
actualizarEstadisticas
);

filtroMetodo.addEventListener(
"change",
actualizarEstadisticas
);
window.addEventListener(
"load",
() => {
    actualizarEstadisticas();
}
);
const guardarClave =
document.getElementById("guardarClave");

guardarClave.addEventListener(
"click",
guardarClaveAdmin
);

function guardarClaveAdmin(){

const nuevaClave =
document.getElementById("claveAdmin").value;

if(!/^\d{6}$/.test(nuevaClave)){
alert("La clave debe tener 6 números");
return;
}

const claveActual =
localStorage.getItem("claveAdmin");

if(claveActual){

const validar =
prompt("Ingrese la clave actual");

if(validar !== claveActual){
alert("Clave incorrecta");
return;
}

}

localStorage.setItem(
"claveAdmin",
nuevaClave
);

alert("Clave guardada");
}
document
.getElementById("descargarResumen")
.addEventListener(
"click",
descargarResumenPDF
);

function descargarResumenPDF(){

const { jsPDF } = window.jspdf;

const pdf = new jsPDF();
pdf.setFontSize(22);
pdf.text("GO OUT", 105, 15, { align: "center" });

pdf.setFontSize(14);
pdf.text("Resumen de Movimientos", 105, 24, { align: "center" });

pdf.line(10, 30, 200, 30);

pdf.setFontSize(10);

pdf.text(
`Fecha de emisión: ${
new Date().toLocaleDateString("es-AR")
} ${
new Date().toLocaleTimeString("es-AR",{hour12:false})
}`,
10,
40
);

pdf.text(
`Periodo: ${filtroPeriodo.value}`,
10,
47
);

pdf.text(
`Método: ${filtroMetodo.value}`,
10,
54
);

let y = 70;

pdf.setFontSize(11);

pdf.setFont(undefined,"bold");
pdf.rect(10, y - 5, 190, 10);

pdf.text("Cliente",15,y);
pdf.text("Metodo",75,y);
pdf.text("Detalle",115,y);
pdf.text("Importe",170,y);
pdf.setFont(undefined,"normal");

y += 10;

const hoy = new Date();

let total = 0;
let cantidad = 0;

ticketsCache.forEach(t => {

const fechaTicket =
new Date(t.timestamp);

let mostrar = true;

if(filtroPeriodo.value === "dia"){
mostrar =
fechaTicket.toDateString() ===
hoy.toDateString();
}

if(filtroPeriodo.value === "semana"){
const hace7Dias = new Date();
hace7Dias.setDate(
hoy.getDate() - 7
);
mostrar =
fechaTicket >= hace7Dias;
}

if(filtroPeriodo.value === "mes"){
mostrar =
fechaTicket.getMonth() === hoy.getMonth()
&&
fechaTicket.getFullYear() === hoy.getFullYear();
}

if(filtroMetodo.value === "efectivo"){
mostrar =
t.metodo === "Efectivo"
||
(
t.metodo === "Mixto" &&
Number(t.efectivo || 0) > 0
);
}

if(filtroMetodo.value === "mp"){
mostrar =
t.metodo === "Mercado Pago"
||
(
t.metodo === "Mixto" &&
Number(t.mercadopago || 0) > 0
);
}


if(mostrar){

cantidad++;
if(filtroMetodo.value === "efectivo"){

if(t.metodo === "Efectivo"){
total += Number(t.monto || 0);
}

if(t.metodo === "Mixto"){
total += Number(t.efectivo || 0);
}

}
else if(filtroMetodo.value === "mp"){

if(t.metodo === "Mercado Pago"){
total += Number(t.monto || 0);
}

if(t.metodo === "Mixto"){
total += Number(t.mercadopago || 0);
}

}
else{

total += Number(t.monto || 0);

}
y += 10;
if(y > 280){
pdf.addPage();
y = 20;
}

let detalle = "-";

if(t.metodo === "Mixto"){
detalle =
`Ef:${Number(t.efectivo || 0).toLocaleString()} MP:${Number(t.mercadopago || 0).toLocaleString()}`;
}

pdf.rect(10, y - 5, 190, 10);

pdf.text(
String(t.cliente).substring(0,18),
15,
y + 2
);

pdf.text(
t.metodo === "Mixto"
? "Mixto"
: t.metodo,
75,
y + 2
);

pdf.text(
detalle,
105,
y + 2
);

let importeMostrar = Number(t.monto || 0);

if(filtroMetodo.value === "efectivo" && t.metodo === "Mixto"){
importeMostrar = Number(t.efectivo || 0);
}

if(filtroMetodo.value === "mp" && t.metodo === "Mixto"){
importeMostrar = Number(t.mercadopago || 0);
}

pdf.text(
"$" + importeMostrar.toLocaleString(),
170,
y + 2
);

}

});

y += 25;

pdf.rect(120, y, 75, 22);

pdf.setFont(undefined,"bold");

pdf.text(
`Cantidad Tickets: ${cantidad}`,
125,
y + 8
);

pdf.text(
`TOTAL GENERAL:`,
125,
y + 17
);

pdf.text(
`$${total.toLocaleString()}`,
175,
y + 17
);

pdf.setFont(undefined,"normal");

pdf.save(
`Resumen_${filtroPeriodo.value}_${filtroMetodo.value}.pdf`
);

}