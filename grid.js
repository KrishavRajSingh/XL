let rows=100;
let col=26;
let colContAddress=document.querySelector(".address-col-cont");
let rowContAddress=document.querySelector(".address-row-cont");
let cellCont=document.querySelector(".cells-cont");
let addressBar=document.querySelector(".address-bar");

for(let i=1;i<=rows;i++){
    let addressCol=document.createElement("div");
    addressCol.setAttribute("class","address-col")
    addressCol.innerText=i;
    colContAddress.appendChild(addressCol);
}
for(let i=1;i<=col;i++){
    let addressrow=document.createElement("div");
    addressrow.setAttribute("class","address-row");
    addressrow.innerText=String.fromCharCode(i+64);
    rowContAddress.appendChild(addressrow);
}
for(let i=1;i<=rows;i++){
    let rowCont=document.createElement("div");
    rowCont.setAttribute("class","row-cont");
    for(let j=1;j<=col;j++){
        let cell=document.createElement("div");
        cell.setAttribute("class","cell");
        cell.setAttribute("contenteditable","true");
        cell.setAttribute("spellcheck","false")
        // attributes for cell and storage identification
        cell.setAttribute("row",i);
        cell.setAttribute("col",j);
        rowCont.appendChild(cell);
        displayAddress(cell,i,j);
    }
    cellCont.appendChild(rowCont);
}
function displayAddress(cell,i,j){
    cell.addEventListener("click",(e)=>{
        let r=i;
        let c=String.fromCharCode(j+64);
        addressBar.value=`${c}${r}`;
    })
}

