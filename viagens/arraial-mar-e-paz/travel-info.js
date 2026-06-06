async function carregarDados(){
const response = await fetch("data.json");
const data = await response.json();

document.getElementById("page-title").innerText = data.title;
document.getElementById("title").innerText = data.title;
document.getElementById("subtitle").innerText = data.subtitle;
document.getElementById("date").innerText = data.date;
document.getElementById("price").innerText = data.price;
document.getElementById("type").innerText = data.type;

data.included.forEach(item=>{
const li=document.createElement("li");
li.innerText=item;
document.getElementById("included").appendChild(li);
});

data.notIncluded.forEach(item=>{
const li=document.createElement("li");
li.innerText=item;
document.getElementById("notIncluded").appendChild(li);
});

data.boarding.forEach(item=>{
const li=document.createElement("li");
li.innerText=item;
document.getElementById("boarding").appendChild(li);
});

document.getElementById("return").innerText=data.return;

if(data.hotel){
document.getElementById("hotel-name").innerText=data.hotel.name;
data.hotel.images.forEach(img=>{
const image=document.createElement("img");
image.src=img;
document.getElementById("hotel-images").appendChild(image);
});

}else{
document.getElementById("hotel-section").style.display="none";
}

data.optional.forEach(opt=>{
const card=document.createElement("div");
card.classList.add("optional-card");
card.innerHTML=`
<img src="${opt.image}">
<h3>${opt.name}</h3>
<p>${opt.description}</p>
<p><strong>${opt.price}</strong></p>
`;
document.getElementById("optional-container").appendChild(card);
});

data.special.forEach(item=>{
const li=document.createElement("li");
li.innerText=item;
document.getElementById("special").appendChild(li);
});

data.policies.forEach(item=>{
const li=document.createElement("li");
li.innerText=item;
document.getElementById("policies").appendChild(li);
});

data.itinerary.forEach(day=>{
const div=document.createElement("div");
div.innerHTML=`<h3>${day.day}</h3><p>${day.description}</p>`;
document.getElementById("itinerary").appendChild(div);
});

const carousel=document.getElementById("hero-carousel");
data.heroImages.forEach((img,index)=>{
const image=document.createElement("img");
image.src=img;
if(index===0) image.classList.add("active");
carousel.appendChild(image);
});
}

carregarDados();

let current=0;
setInterval(()=>{
const items=document.querySelectorAll(".carousel img");
items[current].classList.remove("active");
current=(current+1)%items.length;
items[current].classList.add("active");
},5000);

function toggleOpcionais(){
const container=document.getElementById("optional-container");
if(container.style.display==="grid"){
container.style.display="none";
}else{
container.style.display="grid";
}
}

function abrirWhatsApp(){
const link="https://wa.me/message/G7FUENJX5QHII1";
window.open(link,"_blank");
}

function compartilharWhats(){
const url=window.location.href;
const texto="Olha essa viagem da RecTrips:";
const link=`https://wa.me/?text=${encodeURIComponent(texto+" "+url)}`;
window.open(link,"_blank");
}