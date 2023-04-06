let addSheet = document.querySelector('.sheet-add-icon');
let sheetFolderCont = document.querySelector('.sheets-folder-cont');
addSheet.addEventListener('click',(e)=>{
    let sheet = document.createElement('div');
    sheet.setAttribute('class','sheet-folder');

    let allSheetFolder = document.querySelectorAll('.sheet-folder');
    sheet.setAttribute('id',allSheetFolder.length);

    sheet.innerHTML = `<div class="sheet-content">Sheet${allSheetFolder.length+1}</div>`;
    sheetFolderCont.appendChild(sheet);
    sheet.scrollIntoView();
    // created a database and graph component matrix whenever add icon is clicked
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})

function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown",(e)=>{
        // e.button -> 0 for left click, 1 for scroll click and 2 for right click
        if(e.button !== 2)  //return if not click
        return;

        let allSheetFolder = document.querySelectorAll('.sheet-folder');
        if(allSheetFolder.length === 1){
            alert('Minimum one sheet is required.');
            return;
        }

        let response = confirm('Sheet will be permanently deleted, Are you sure?');
        if(response === false)
        return;

        let sheetIdx = Number(sheet.getAttribute('id'));
        // DB removal
        allSheetDB.splice(sheetIdx,1);
        allGraphComponent.splice(sheetIdx,1);
        // UI
        // sheet.remove();
        handleSheetUIRemoval(sheet);

        // Bring Sheet1 to active and change numbering
        sheetDB = allSheetDB[0];
        graphComponentMatrix = allGraphComponent[0];
        handleSheetProperties();
    })
}

function handleSheetUIRemoval(sheet){
    sheet.remove();
    let allSheetFolder = document.querySelectorAll('.sheet-folder');
    for(let i = 0;i < allSheetFolder.length;i++){
        allSheetFolder[i].setAttribute('id',i);
        let sheetContent = allSheetFolder[i].querySelector('.sheet-content');
        sheetContent.innerText = `Sheet${i+1}`;
        allSheetFolder[i].style.backgroundColor = 'transparent';
    }
    allSheetFolder[0].style.backgroundColor = '#a4b0be';
}

function handleSheetDB(sheetIdx){
    sheetDB = allSheetDB[sheetIdx];
    graphComponentMatrix = allGraphComponent[sheetIdx];
}

function handleSheetProperties(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<col;j++){
            let cell = document.querySelector(`.cell[row='${i+1}'][col='${j+1}']`);
            cell.click();
        }
    }
    // first cell should be clicked after opening
    let firstCell=document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUI(sheet){
    let allSheetFolders = document.querySelectorAll('.sheet-folder');
    for(i = 0;i < allSheetFolders.length;i++){
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = "#a4b0be";
}

function handleSheetActiveness(sheet){
    sheet.addEventListener('click',(e)=>{
        let sheetIdx = Number(sheet.getAttribute('id'));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}

// creates DB for sheet whenever add sheet icon is clicked
function createSheetDB(){
    let sheetDB = [];
    for(let i=0;i<rows;i++){
        let sheetRow= [];
        for(let j=0;j<col;j++){
            let cellProp={
                fontFamily: "monospace",
                fontSize: "14",
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontColor: "#000000",
                BGcolor: "#000000", // only for indication
                value: "",
                formula: "",
                children: []
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    allSheetDB.push(sheetDB);
}

function createGraphComponentMatrix(){
    // storage -> 2D array
    let graphComponentMatrix = [];

    for(let i=1;i<=rows;i++){
        let row=[];
        for(let j=1;j<=col;j++){
            // why array -> one cell may have more than one children
            row.push([])
        }
        graphComponentMatrix.push(row);
    }
    allGraphComponent.push(graphComponentMatrix);
}