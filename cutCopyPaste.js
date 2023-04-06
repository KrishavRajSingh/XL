let ctrlKey;
let copyBtn = document.querySelector('.copy');
let cutBtn = document.querySelector('.cut');
let pasteBtn = document.querySelector('.paste');

document.addEventListener("keydown",(e)=>{
    ctrlKey = e.ctrlKey;
})
document.addEventListener('keyup',(e)=>{
    ctrlKey = e.ctrlKey;
})

let rangeStorage = [];  // to store the range of cells -> [firstCell,lastCell]
allCells.forEach((cell) => {
    cell.addEventListener('click',(e)=>{
        if(!ctrlKey)
        return;
        // select new range if two cells already selected and remove the first rane
        if(rangeStorage.length >= 2){
            removeBorder();
            rangeStorage = [];
        }
        cell.style.border = "2px solid black"
        let row = Number(cell.getAttribute('row'))-1;
        let col = Number(cell.getAttribute('col'))-1;
        rangeStorage.push([row,col]);
    })
})

function removeBorder(){
    for(let i=0;i<rangeStorage.length;i++){
        let cell = document.querySelector(`.cell[row='${rangeStorage[i][0]+1}'][col='${rangeStorage[i][1]+1}']`);
        cell.style.border = '1px solid lightgrey'
    }
}

let copiedData = [];
copyBtn.addEventListener('click',(e)=>{
    if(rangeStorage<2)
    return;
    copiedData=[];
    let startRow = Math.min(rangeStorage[0][0],rangeStorage[1][0]);
    let lastRow = Math.max(rangeStorage[0][0],rangeStorage[1][0]);
    let startCol = Math.min(rangeStorage[0][1],rangeStorage[1][1]);
    let lastCol = Math.max(rangeStorage[0][1],rangeStorage[1][1]);
    for(let i=startRow;i<=lastRow;i++){
        let copyRow = [];
        for(let j=startCol;j<=lastCol;j++){
            let cellProp = sheetDB[i][j];

            let newCellProp={
                            fontFamily: cellProp.fontFamily,
                            fontSize: cellProp.fontSize,
                            bold: cellProp.bold,
                            italic: cellProp.italic,
                            underline: cellProp.underline,
                            alignment: cellProp.alignment,
                            fontColor: cellProp.fontColor,
                            BGcolor: cellProp.BGcolor, // only for indication
                            value: cellProp.value,
                            formula: `${cellProp.value}`,
                            children: []
                        }
            copyRow.push(newCellProp);
        }
        copiedData.push(copyRow);
    }
    removeBorder();
})


cutBtn.addEventListener('click',(e)=>{
    if(rangeStorage<2)
    return;
    let startRow = Math.min(rangeStorage[0][0],rangeStorage[1][0]);
    let lastRow = Math.max(rangeStorage[0][0],rangeStorage[1][0]);
    let startCol = Math.min(rangeStorage[0][1],rangeStorage[1][1]);
    let lastCol = Math.max(rangeStorage[0][1],rangeStorage[1][1]);
    copyBtn.click();
    for(let i=startRow;i<=lastRow;i++){
        for(let j=startCol;j<=lastCol;j++){
            let cell = document.querySelector(`.cell[row='${i+1}'][col='${j+1}']`);
            let cellProp = sheetDB[i][j];
            cellProp.fontFamily = "monospace"
            cellProp.fontSize = "14"
            cellProp.bold = false
            cellProp.italic = false
            cellProp.underline = false
            cellProp.alignment = "left"
            cellProp.fontColor = "#000000"
            cellProp.BGcolor = "#000000"    // only for indication
            cellProp.value = ""
            cellProp.formula = ""

            cell.click();
        }
    }
})

pasteBtn.addEventListener('click',(e)=>{
    // paste data
    if(rangeStorage<2)
    return;
    let rowDiff = Math.abs(rangeStorage[0][0]-rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1]-rangeStorage[1][1]);

    // target
    let address = addressBar.value;
    let sRow = Number(address.slice(1))-1;  
    let sCol = Number(address.charCodeAt(0)-64)-1;
    let lRow = sRow+rowDiff;
    let lCol = sCol+colDiff;

    // r -> row index in copied data
    // c -> column index in copied data
    for(let i=sRow, r=0;i<=lRow;i++,r++){
        for(let j=sCol, c=0;j<=lCol;j++,c++){
            let cell = document.querySelector(`.cell[row='${i+1}'][col='${j+1}']`);
            if(!cell)
            continue;
            // DB
            let data = copiedData[r][c];
            let cellProp = sheetDB[i][j];

            // set properties of copied data to cell prop
            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;
            cellProp.formula = data.formula;
            // UI
            cell.click();
        }
    }
    
})

// function handleSelectedCells(cell){
//     cell.addEventListener('click',(e)=>{
//         if(!ctrlKey)
//         return;
//         if(rangeStorage.length >= 2)
//         return;

//         cell.style.border = "1px solid black"
//         let row = Number(cell.getAttribute('row'))-1;
//         let col = Number(cell.getAttribute('col'))-1;
//         rangeStorage.push([row,col]);
//         console.log(rangeStorage);
//     })
// }