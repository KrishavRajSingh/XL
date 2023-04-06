
async function traceCyclicGraph(graphComponentMatrix,cycleResponse){
    let [srcr,srcc] = cycleResponse;  // start tracing from here
    let visited = [];
    let dfsVisited = [];
    for(let i = 0; i < rows; i++){
        let visitedRow = [];
        let dfsVisitedRow = [];
        for(let j = 0; j < col; j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }
    let res = await dfsCycleDetectionTracePath(graphComponentMatrix,srcr,srcc,visited,dfsVisited);   // start color tracing from the given i and j
    if(res)
    return Promise.resolve(true); ;
    return Promise.resolve(false); ;
}

// for delay
function delay(){
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve();
        },1000);        
    })
}

// color tracking
async function dfsCycleDetectionTracePath(graphComponentMatrix,srcr,srcc,visited,dfsVisited){
    visited[srcr][srcc]=true;
    dfsVisited[srcr][srcc]=true;
    let cell = document.querySelector(`.cell[row='${srcr+1}'][col='${srcc+1}']`);
    cell.style.backgroundColor = 'lightblue';
    await delay();  // waits for 1sec

    for(let children = 0;children < graphComponentMatrix[srcr][srcc].length;children++){
        let [crid,ccid] = graphComponentMatrix[srcr][srcc][children];
        if(visited[crid][ccid] === false){
            let res = await dfsCycleDetectionTracePath(graphComponentMatrix,crid,ccid,visited,dfsVisited);
            if(res === true){
                await delay();
                cell.style.backgroundColor = 'transparent';
                return Promise.resolve(true);   // returns promise so await can be used
            }
        }else if(dfsVisited[crid][ccid] === true){
            let Ccell = document.querySelector(`.cell[row='${crid+1}'][col='${ccid+1}']`);
            
            Ccell.style.backgroundColor = 'lightsalmon';
            await delay();
            Ccell.style.backgroundColor = 'transparent';
            await delay();
            cell.style.backgroundColor = 'transparent';
            return Promise.resolve(true); 
        }
    }
    cell.style.backgroundColor = 'transparent';
    dfsVisited[srcr][srcc]=false;
    return Promise.resolve(false); 
}