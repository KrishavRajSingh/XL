let allSheetDB = [] // contains all sheetDB
// stores data of each cell
let sheetDB = [];

{
    let addSheet = document.querySelector('.sheet-add-icon');
    addSheet.click();
}

// for(let i=0;i<rows;i++){
//     let sheetRow= [];
//     for(let j=0;j<col;j++){
//         let cellProp={
//             fontFamily: "monospace",
//             fontSize: "14",
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontColor: "#000000",
//             BGcolor: "#000000", // only for indication
//             value: "",
//             formula: "",
//             children: []
//         }
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }

// selectors for properties
let bold=document.querySelector(".bold");
let italic=document.querySelector(".italic");
let underline=document.querySelector(".underline");
let fontSize=document.querySelector(".font-size-prop");
let fontFamily=document.querySelector(".font-family-prop");
let fontColor=document.querySelector(".font-color-prop");
let BGcolor=document.querySelector(".BGcolor-prop");
let alignment=document.querySelectorAll(".alignment");
let leftAlign=alignment[0];
let centerAlign=alignment[1];
let rightAlign=alignment[2];
let activeColorProp = "#95a5a6";
let inactiveColorProp="#dfe6e9";
// let addressBar=document.querySelector(".address-bar");
// application of 2 way binding

// attaching listeners
bold.addEventListener("click",(e)=>{
    let address=addressBar.value;
    let [cell,cellProp] = getActiveCell(address);

    // modification
    cellProp.bold = !cellProp.bold; //data change from previous value
    cell.style.fontWeight = cellProp.bold?"bold":"normal"; //UI change - 1 
    bold.style.backgroundColor = cellProp.bold?activeColorProp:inactiveColorProp; //UI change - 2 (backgroumd color)

})

italic.addEventListener("click",(e)=>{
    let address=addressBar.value;
    let [cell,cellProp] = getActiveCell(address);

    // modification
    cellProp.italic = !cellProp.italic; //data change from previous value
    cell.style.fontStyle = cellProp.italic?"italic":"normal"; //UI change - 1 
    italic.style.backgroundColor = cellProp.italic?activeColorProp:inactiveColorProp; //UI change - 2 (backgroumd color)

})

underline.addEventListener("click",(e)=>{
    let address=addressBar.value;
    let [cell,cellProp] = getActiveCell(address);

    // modification
    cellProp.underline = !cellProp.underline; //data change from previous value
    cell.style.textDecoration = cellProp.underline?"underline":"none"; //UI change - 1 
    underline.style.backgroundColor = cellProp.underline?activeColorProp:inactiveColorProp; //UI change - 2 (backgroumd color)

})

fontSize.addEventListener("change",(e)=>{
    let address=addressBar.value;
    let [cell,cellProp] = getActiveCell(address);

    // modification
    cellProp.fontSize=fontSize.value;
    cell.style.fontSize=fontSize.value+"px";
    // fontSize.value=cellProp.fontSize;
})

fontFamily.addEventListener("change",(e)=>{
    let address=addressBar.value;
    let [cell,cellProp] = getActiveCell(address);

    // modification
    cellProp.fontFamily=fontFamily.value;
    cell.style.fontFamily=fontFamily.value;
    // fontSize.value=cellProp.fontSize;
})

fontColor.addEventListener("change",(e)=>{
    let address=addressBar.value;
    let [cell,cellProp] = getActiveCell(address);

    // modification
    cellProp.fontColor=fontColor.value;
    cell.style.color=fontColor.value;
})

BGcolor.addEventListener("change",(e)=>{
    let address=addressBar.value;
    let [cell,cellProp] = getActiveCell(address);
    
    // modifiaction
    cellProp.BGcolor=BGcolor.value;
    cell.style.backgroundColor=BGcolor.value; 
})

alignment.forEach((alignElem)=>{
    alignElem.addEventListener("click",(e)=>{
        let address=addressBar.value;
        let [cell,cellProp] = getActiveCell(address);

        // modification
        
        let alignDirection = e.target.classList[0];
        cellProp.alignment = alignDirection;
        cell.style.textAlign = alignDirection;

        switch(alignDirection){
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                centerAlign.style.backgroundColor = activeColorProp;
                leftAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                rightAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                leftAlign.style.backgroundColor = inactiveColorProp;
                break;
        }
    })
})

function getActiveCell(address){
    let rid = Number(address.slice(1));
    let cid = Number(address.charCodeAt(0)-64);
    let cell = document.querySelector(`.cell[row="${rid}"][col="${cid}"]`);
    let cellProp = sheetDB[rid-1][cid-1];
    return [cell,cellProp];
}


// cell visuals on font and style
let allCells=document.querySelectorAll(".cell");
allCells.forEach((cell)=>{
    
    cell.addEventListener("click",(e)=>{
        let address=addressBar.value;
        let [cell1,cellProp] = getActiveCell(address);
        
        cell.style.fontSize=cellProp.fontSize+"px";
        cell.style.fontFamily=cellProp.fontFamily;
        cell.style.textDecoration = cellProp.underline?'underline':'none';
        cell.style.fontWeight = cellProp.bold?'bold':'none';
        cell.style.fontStyle = cellProp.italic?'italic':'none';
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor === '#000000'?'transparent':cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment;

        // cell property action ui change 
        fontFamily.value = cellProp.fontFamily;
        fontSize.value = cellProp.fontSize;
        bold.style.backgroundColor = cellProp.bold?activeColorProp:inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic?activeColorProp:inactiveColorProp; 
        underline.style.backgroundColor = cellProp.underline?activeColorProp:inactiveColorProp;
        fontColor.value=cellProp.fontColor;
        BGcolor.value=cellProp.BGcolor;

        // display formula
        let formulaBar = document.querySelector('.formula-bar');
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
        switch(cellProp.alignment){
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                centerAlign.style.backgroundColor = activeColorProp;
                leftAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                rightAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                leftAlign.style.backgroundColor = inactiveColorProp;
                break;
        }
        
    })
})