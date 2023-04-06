let downloadBtn = document.querySelector('.download');
let uploadBtn = document.querySelector('.upload');

// download
downloadBtn.addEventListener('click',(e)=>{
    let sheetData = [sheetDB,graphComponentMatrix];
    let a=document.createElement('a');
    const file = new Blob([JSON.stringify(sheetData)], { type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = 'Sheet';
	a.click();
})

uploadBtn.addEventListener('click',(e)=>{
    // opens FileExplorer
    let input = document.createElement('input');
    input.setAttribute('type','file');
    input.click();

    input.addEventListener('change',(e)=>{
        let fr = new FileReader();
        let files = input.files; 
        //select first file
        let obj = files[0];
        fr.readAsText(obj);
        fr.addEventListener('load',(e)=>{
            let readSheetData = JSON.parse(fr.result);
            // create new sheet and display
            addSheet.click();
            // replace sheetDB, graphComponent
            sheetDB = readSheetData[0];
            graphComponentMatrix = readSheetData[1];
            allSheetDB[allSheetDB.length-1] = sheetDB;
            allGraphComponent[allGraphComponent.length-1] = graphComponentMatrix;
            handleSheetProperties();
        })
    })
})