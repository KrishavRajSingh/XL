let formulaBar=document.querySelector(".formula-bar");

allCells.forEach((cell)=>{
    cell.addEventListener("blur",(e)=>{
        let address = addressBar.value;
        let [activeCell,cellProp]=getActiveCell(address);
        let enteredData = activeCell.innerText;
        
        if(enteredData == cellProp.value){
            return;
        }
        cellProp.value = enteredData;
        
        removeChildFromParent(cellProp.formula);
        cellProp.formula = enteredData;
        // cellProp.formula = "";
        updateChildren(address)
    })
})

formulaBar.addEventListener("keydown",async (e)=>{
if(e.key==="Enter" && formulaBar.value){
    let address = addressBar.value;
    let formula = spaceSeparated(formulaBar.value);
    let [cell,cellProp] = getActiveCell(address);

    // if change in formula break old relationshp i.e. remove children from parent and add new relationship
    if(formula !== cellProp.formula){
        removeChildFromParent(cellProp.formula);
    }

    addChildToGraphComponent(formula,address);

    // check if formula is cyclic or not
    let cycleResponse = isGraphCyclic(graphComponentMatrix);
    if(cycleResponse){
        let res = confirm('Cyclic formula detected. Press OK to trace.');
        // keep tracing until the user is satisfied
        while(res){
            await traceCyclicGraph(graphComponentMatrix,cycleResponse);   // wait for complete color tracking
            res = confirm("Press OK to trace again.");
        }
        removeChildrenFromGraphComponent(formula,address);
        return;
    }

    // evaluate value and add child address to parent's children arary
    let evaluatedValue = evaluateFormula(formula,true);
    
    //  to update UI and cell prop in DB
    setCellUIandcellProp(evaluatedValue,formula,address);
    // to update the children 
    updateChildren(address);
}   
})

// to update the children if any change in parent
function updateChildren(parentAddress){
    let [parentCell,parentCellProp] = getActiveCell(parentAddress);
    let children = parentCellProp.children;
    if(children.length==0)
    return;
    for(let i=0;i<children.length;i++){
        let childAddress = children[i];
        let [childCell,childCellProp] = getActiveCell(childAddress);
        let childFormula = childCellProp.formula;
        // only evaluate, don't add to parent's children array
        let evaluatedValue = evaluateFormula(childFormula,false);

        setCellUIandcellProp(evaluatedValue,childFormula,childAddress);
        updateChildren(childAddress);
    }
}

function removeChildFromParent(formula){
    let childAdress = addressBar.value;

    // the formula is coming from cellProp which is space separated
    let encodedArr = formula.split(" ");
    for(let i=0;i<encodedArr.length;i++){
        let ch = encodedArr[i].charCodeAt(0);
        if(ch>=65 && ch<=90){
            let [parentCell,parentCellProp] = getActiveCell(encodedArr[i]);
            let childIdx = parentCellProp.children.indexOf(childAdress);
            parentCellProp.children.splice(childIdx,1);
        }
    }
}


function evaluateFormula(formula,flag){
    
    // child address
    let childAdress = addressBar.value;
    
    let encodedArr = formula.split(" ");
    for(let i=0;i<encodedArr.length;i++){
        let ch = encodedArr[i].charCodeAt(0);
        if(ch>=65 && ch<=90){
            let [parentCell,parentCellProp] = getActiveCell(encodedArr[i]);
            encodedArr[i] = parentCellProp.value;
            // if flag true then add childAddress to parentcell's children else just evaluate the value
            if(flag){
                parentCellProp.children.push(childAdress); // adding child to parent
            }
        }
        
    }
    let decodedExpression = encodedArr.join(" ");
return eval(decodedExpression);
}

function setCellUIandcellProp(evaluatedValue,formula,address){
    
    let [cell,cellProp]=getActiveCell(address);
    cell.style.fontFamily = cellProp.fontFamily; //if not clicked first cell was not initially with monospace font
    cell.innerText = evaluatedValue; // UI update
    cellProp.value = evaluatedValue; // DB update
    cellProp.formula = formula;
}

function spaceSeparated(formula){
    // space separation of operators 

    y=formula.split("");

    for(let i=1;i<y.length-1;i++){
        if(y[i]=='+'||y[i]=='-'||y[i]=='*'||y[i]=='/'||y[i]=='%'){
            if(y[i-1]!=' '){
                y.splice(i,0,' ')
                i=i+1;
            }
            if(y[i+1]!=' '){
                y.splice(i+1,0,' ')
                i=i+1;
            }
            
        }
    }

    formula = y.join("");
    return formula;
}

function addChildToGraphComponent(formula,childAddress){
    let crid = Number(childAddress.slice(1));
    let ccid = Number(childAddress.charCodeAt(0)-64);
    let encodedFormula = formula.split(' ');
    for(let i=0;i<encodedFormula.length;i++){
        let ascii = encodedFormula[i].charCodeAt(0);
        if(ascii>=65&&ascii<=90){
            let prid = Number(encodedFormula[i].slice(1));
            let pcid = Number(encodedFormula[i].charCodeAt(0)-64);
            // B1 = A1 + 10 -> A1 stored as [[1][1]] in B1
            graphComponentMatrix[prid-1][pcid-1].push([crid-1,ccid-1]);
        }
    }
}

function removeChildrenFromGraphComponent(formula,childAddress){
    let crid = Number(childAddress.slice(1));
    let ccid = Number(childAddress.charCodeAt(0)-64);
    let encodedFormula = formula.split(' ');
    for(let i=0;i<encodedFormula.length;i++){
        let ascii = encodedFormula[i].charCodeAt(0);
        if(ascii>=65&&ascii<=90){
            let prid = Number(encodedFormula[i].slice(1));
            let pcid = Number(encodedFormula[i].charCodeAt(0)-64);
            // B1 = A1 + 10 -> A1 stored as [[1][1]] in B1
            graphComponentMatrix[prid-1][pcid-1].pop();
        }
    }
}