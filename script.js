// --- Data ---
let products = JSON.parse(localStorage.getItem("products")||"[]");
let history = JSON.parse(localStorage.getItem("history")||"[]");
let company = JSON.parse(localStorage.getItem("company")||`{
  "name":"Pokladní Systém","address":"Praha","tel":"+420123456789",
  "email":"info@pokladna.cz","footer":"Děkujeme za váš nákup!"
}`);
let receipt = JSON.parse(localStorage.getItem("receipt")||`{
  "header":"==============================",
  "company_info":"{company_name}\\n{company_address}\\nTel: {company_tel}\\nEmail: {company_email}",
  "order_info":"Číslo objednávky: {order_id}\\nDatum: {date}\\nPočet položek: {count}",
  "items_header":"Název\\tKs\\tCena\\tCelkem",
  "items":"{items_table}",
  "total":"CELKEM: {total} CZK",
  "footer":"{company_footer}\\nVytištěno: {print_time}"
}`);
let cart = [];

// --- Login ---
function login(){
  let u=document.getElementById("user").value;
  let p=document.getElementById("pass").value;
  if(u==="uzivatel" && p==="poksys1"){
    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    renderProducts(); renderHistory();
  } else {
    document.getElementById("login-msg").innerText="Špatné údaje!";
  }
}

// --- Produkty ---
function renderProducts(){
  let div=document.getElementById("product-list"); div.innerHTML="";
  products.forEach((p,i)=>{
    let btn=document.createElement("button");
    btn.innerText=`${p.name} - ${p.price} CZK`;
    btn.onclick=()=>addToCart(i);
    div.appendChild(btn); div.appendChild(document.createElement("br"));
  });
  localStorage.setItem("products",JSON.stringify(products));
}
function addProduct(){
  let n=document.getElementById("newName").value;
  let pr=parseFloat(document.getElementById("newPrice").value);
  if(n && !isNaN(pr)){ products.push({name:n,price:pr}); renderProducts(); }
  document.getElementById("newName").value=""; document.getElementById("newPrice").value="";
}

// --- Košík ---
function addToCart(i){ cart.push(products[i]); renderCart(); }
function renderCart(){
  let t=document.getElementById("cart-table");
  t.innerHTML="<tr><th>Název</th><th>Cena</th></tr>";
  let sum=0;
  cart.forEach(p=>{ t.innerHTML+=`<tr><td>${p.name}</td><td>${p.price} CZK</td></tr>`; sum+=p.price; });
  document.getElementById("total").innerText="Celkem: "+sum+" CZK";
}
function resetCart(){ cart=[]; renderCart(); }

function completeOrder(){
  if(cart.length===0){ alert("Košík prázdný!"); return; }
  let sum=cart.reduce((a,b)=>a+b.price,0);
  let order_id="OBJ-"+Date.now();
  let date=new Date().toLocaleString();
  let order={items:[...cart], total:sum, date, order_id};
  history.push(order);
 
