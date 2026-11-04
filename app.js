// БАЗА ДАНИХ (ціни в USD)
const cars = [
    { id: 1, make: "BMW", model: "X5 M50d", year: 2023, price: 95000, mileage: 12000, class: "suv", cylinders: 6, transmission: "a", drive: "awd", fuel_type: "diesel", highway_mpg: 30, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Спортивний кросовер у топовій комплектації M-пакет. Ідеальний стан, один власник. Лазерні фари, пневмопідвіска, панорамний дах." },
    { id: 2, make: "BMW", model: "320i", year: 2021, price: 34500, mileage: 45000, class: "sedan", cylinders: 4, transmission: "a", drive: "rwd", fuel_type: "gas", highway_mpg: 36, image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Надійний седан бізнес-класу. Обслуговувався тільки на офіційному сервісі. Apple CarPlay, камера заднього виду." },
    { id: 3, make: "Audi", model: "Q7 S-Line", year: 2022, price: 78000, mileage: 38000, class: "suv", cylinders: 6, transmission: "a", drive: "awd", fuel_type: "diesel", highway_mpg: 28, image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Великий сімейний позашляховик на 7 місць. Матричні фари, доводчики дверей, преміум акустика Bang & Olufsen." },
    { id: 4, make: "Audi", model: "A4", year: 2020, price: 25000, mileage: 98000, class: "sedan", cylinders: 4, transmission: "a", drive: "fwd", fuel_type: "gas", highway_mpg: 34, image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Економічний автомобіль для міста. Стан сів і поїхав. Нова літня гума в подарунок." },
    { id: 5, make: "Toyota", model: "Camry Hybrid", year: 2024, price: 42000, mileage: 1500, class: "sedan", cylinders: 4, transmission: "a", drive: "fwd", fuel_type: "hybrid", highway_mpg: 47, image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Абсолютно нове авто, на гарантії до 2029 року. Дуже економна витрата пального в місті." },
    { id: 6, make: "Toyota", model: "Land Cruiser 300", year: 2023, price: 110000, mileage: 18000, class: "suv", cylinders: 6, transmission: "a", drive: "awd", fuel_type: "diesel", highway_mpg: 20, image: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Легендарна надійність. Броньована плівка по всьому кузову, максимальна комплектація Executive Lounge." },
    { id: 7, make: "Porsche", model: "911 Carrera", year: 2022, price: 135000, mileage: 22000, class: "coupe", cylinders: 6, transmission: "a", drive: "rwd", fuel_type: "gas", highway_mpg: 24, image: "https://images.unsplash.com/photo-1503376760302-8fac2a829e1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Автомобіль вихідного дня. Зберігався виключно в теплому паркінгу. Спортивний вихлоп, карбонові вставки." },
    { id: 8, make: "Porsche", model: "Taycan 4S", year: 2023, price: 105000, mileage: 8000, class: "sedan", cylinders: 0, transmission: "a", drive: "awd", fuel_type: "electricity", highway_mpg: 80, image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Електромобіль майбутнього. Батарея Performance Plus. Запас ходу до 500 км на одному заряді." }
];

const T={trans:{a:'Автомат',m:'Механіка'},drive:{fwd:'Передній',rwd:'Задній',awd:'Повний'},fuel:{gas:'Бензин',diesel:'Дизель',electricity:'Електро',hybrid:'Гібрид'},cls:{suv:'Позашляховик',sedan:'Седан',coupe:'Купе'}};
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const money=n=>new Intl.NumberFormat('uk-UA',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const km=n=>n.toLocaleString('uk-UA')+' км';
const S={q:'',make:'',fuel:'',trans:'',max:140000,sort:'new',pre:null};
const sorters={new:(a,b)=>b.year-a.year||a.price-b.price,cheap:(a,b)=>a.price-b.price,exp:(a,b)=>b.price-a.price,km:(a,b)=>a.mileage-b.mileage};
const makes=[...new Set(cars.map(c=>c.make))];
const img=c=>`<img src="${c.image}" alt="${c.make} ${c.model}" loading="lazy" onerror="this.remove()">`;
const card=c=>`<a class="card" href="#/car/${c.id}"><div class="ph">${img(c)}<span class="yr">${c.year}</span></div><div class="cb"><h3>${c.make} ${c.model}</h3><div class="pr">${money(c.price)}</div><ul class="sp"><li>${km(c.mileage)}</li><li>${T.fuel[c.fuel_type]}</li><li>${T.trans[c.transmission]}</li><li>${c.cylinders?c.cylinders+' цил.':'Електро'}</li></ul></div></a>`;

// Головна: швидкий підбір
$('#q-make').innerHTML='<option value="">Усі марки</option>'+makes.map(m=>`<option>${m}</option>`).join('');
const quickCount=()=>{const m=$('#q-make').value,x=+$('#q-max').value||1e9;$('#q-count').textContent=cars.filter(c=>(!m||c.make===m)&&c.price<=x).length};
$('#q-make').onchange=$('#q-max').onchange=quickCount;
$('#quick').onsubmit=e=>{e.preventDefault();Object.assign(S,{make:$('#q-make').value,max:+$('#q-max').value||140000,q:'',fuel:'',trans:''});location.hash='#/catalog'};
$('#featured').innerHTML=cars.filter(c=>[1,7,8].includes(c.id)).map(card).join('');

// Каталог
function renderCatalog(){
  const list=cars.filter(c=>(!S.make||c.make===S.make)&&(!S.fuel||c.fuel_type===S.fuel)&&(!S.trans||c.transmission===S.trans)&&c.price<=S.max&&(c.make+' '+c.model).toLowerCase().includes(S.q)).sort(sorters[S.sort]);
  $('#count').textContent=list.length;$('#f-max-o').textContent=money(S.max);
  $('#chips').innerHTML=['',...makes].map(m=>`<button class="${S.make===m?'on':''}" data-m="${m}">${m||'Усі марки'}</button>`).join('');
  $('#grid').innerHTML=list.length?list.map(card).join(''):'<div class="empty"><h3>Нічого не знайдено</h3><p>Збільште бюджет або приберіть частину фільтрів.</p><button class="btn" id="reset">Скинути фільтри</button></div>';
}
const bind=(id,k,num)=>$(id).addEventListener('input',e=>{S[k]=num?+e.target.value:e.target.value.trim().toLowerCase();renderCatalog()});
bind('#f-q','q');bind('#f-max','max',1);
['fuel','trans','sort'].forEach(k=>$('#f-'+k).addEventListener('change',e=>{S[k]=e.target.value;renderCatalog()}));
$('#chips').onclick=e=>{if(e.target.dataset.m!==undefined){S.make=e.target.dataset.m;renderCatalog()}};
$('#grid').onclick=e=>{if(e.target.id==='reset'){Object.assign(S,{q:'',make:'',fuel:'',trans:'',max:140000});syncCatalog()}};
function syncCatalog(){$('#f-q').value=S.q;$('#f-fuel').value=S.fuel;$('#f-trans').value=S.trans;$('#f-max').value=S.max;$('#f-sort').value=S.sort;renderCatalog()}

// Сторінка авто + кредитний калькулятор (ставка умовна)
let cur;
function showCar(id){
  cur=cars.find(c=>c.id===id);if(!cur){location.hash='#/catalog';return}
  const c=cur,l=c.fuel_type==='electricity'?'—':(235.215/c.highway_mpg).toFixed(1)+' л/100 км';
  $('#p-car').innerHTML=`<a class="back" href="#/catalog">← До каталогу</a><div class="car"><div class="ph">${img(c)}<span class="yr">${c.year}</span></div><div>
  <h1>${c.make} ${c.model}</h1><p class="cl">${T.cls[c.class]}</p><div class="big">${money(c.price)}</div><p class="ds">${c.description}</p>
  <div class="spec"><div><small>Пробіг</small><b>${km(c.mileage)}</b></div><div><small>Пальне</small><b>${T.fuel[c.fuel_type]}</b></div><div><small>Коробка</small><b>${T.trans[c.transmission]}</b></div><div><small>Привід</small><b>${T.drive[c.drive]}</b></div><div><small>Двигун</small><b>${c.cylinders?c.cylinders+' циліндрів':'Електро'}</b></div><div><small>Витрата в трасі</small><b>${l}</b></div></div>
  <div class="calc"><h3>Орієнтовний платіж у кредит</h3>
  <label>Перший внесок <span id="dpo"></span></label><input type="range" id="dp" min="0" max="70" step="5" value="30">
  <label>Термін <span id="tmo"></span></label><input type="range" id="tm" min="12" max="84" step="12" value="48">
  <div class="m" id="mo"></div><small>Розрахунок умовний, ставка 12% річних. Точні умови підбере менеджер.</small></div>
  <button class="btn" id="req">Записатись на тест-драйв</button></div></div>`;
  $('#dp').oninput=$('#tm').oninput=calc;calc();
  $('#req').onclick=()=>{S.pre=`Цікавить ${c.make} ${c.model}, ${c.year} р. Хочу записатись на тест-драйв.`;location.hash='#/contacts'};
}
function calc(){
  const dp=+$('#dp').value,n=+$('#tm').value,r=.12/12,p=cur.price*(1-dp/100);
  $('#dpo').textContent=`${dp}% (${money(cur.price*dp/100)})`;$('#tmo').textContent=n+' міс.';
  $('#mo').textContent=money(p*r/(1-Math.pow(1+r,-n)))+' / міс.';
}

// Контакти
function prefill(){if(S.pre){$('#l-msg').value=S.pre;$('#l-sub').value='Запис на тест-драйв';S.pre=null}}
$('#lead').onsubmit=e=>{e.preventDefault();const n=e.target.n.value.trim();
  e.target.innerHTML=`<div class="thanks"><h3>Дякуємо, ${n.replace(/</g,'&lt;')}!</h3><p>Заявку отримано. Менеджер зв’яжеться з вами найближчим часом.</p></div>`};

// Маршрутизація за hash: працюють кнопка «Назад» і прямі посилання
function route(){
  const [p,id]=(location.hash.slice(2)||'home').split('/'),pg=['home','catalog','car','contacts'].includes(p)?p:'home';
  $$('.page').forEach(s=>s.hidden=s.id!=='p-'+pg);
  $$('.top nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===(pg==='car'?'catalog':pg)));
  if(pg==='catalog')syncCatalog();if(pg==='car')showCar(+id);if(pg==='contacts')prefill();
  window.scrollTo(0,0);
}
addEventListener('hashchange',route);route();
