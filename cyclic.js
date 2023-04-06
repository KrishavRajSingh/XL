let allGraphComponent = [];
// storage -> 2D array
let graphComponentMatrix = [];
// for(let i=1;i<=rows;i++){
//     let row=[];
//     for(let j=1;j<=col;j++){
//         // why array -> one cell may have more than one children
//         row.push([])
//     }
//     graphComponentMatrix.push(row);
// }

// true if cyclic, else false
function isGraphCyclic(graphComponentMatrix){
    // visited[][], dfsVisited[][]
    let visited = [];       // to trace node
    let dfsVisited = [];    // to trace stack
    for(let i=1;i<=rows;i++){
        let visitedRow = [];
        let dfsVisitedRow = [];
        for(let j=1;j<=col;j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for(let i=0;i<rows;i++){
        for(let j=0;j<col;j++){
            let res = dfsCycleDetection(graphComponentMatrix,i,j,visited,dfsVisited);
            if(res)
            return [i,j];
        }
    }
    return null;
}

// start ---  visited -> true, dfsVisited->true
// end --- dfsVisited -> false
// if visited === true, already explored path, go back
// if(vis[i][j]==true&&dfsvisited[i][j]==true)
// returns true -> cyclic
function dfsCycleDetection(graphComponentMatrix,srcr,srcc,visited,dfsVisited){
    visited[srcr][srcc]=true;
    dfsVisited[srcr][srcc]=true;

    // A1 = [[1,1], [1,2], [2,3], .... ]
    for(let children = 0;children<graphComponentMatrix[srcr][srcc].length;children++){
        let [crid,ccid] = graphComponentMatrix[srcr][srcc][children];
        if(visited[crid][ccid] === false){
            let response = dfsCycleDetection(graphComponentMatrix, crid, ccid, visited, dfsVisited);
            if(response){
                return true;    // cycle found, no need to explore more
            }
        }
        else if(dfsVisited[crid][ccid] === true){
            return true;
        }
    }
    dfsVisited[srcr][srcc]=false;
    return false;  
}