


let gmotion = function (nodes) {

    let graphStats = {
        totalEnergy: 0,
        avgMotion: 0,
        maxMotion: 0
    };

    nodes.forEach(n=>{
        let dx = n.px-n.x
        let dy = n.py-n.y
        let m = Math.sqrt(dx*dx+dy*dy)
        let dv = Math.sqrt(n.vx*n.vx+n.vy*n.vy)

        graphStats.totalEnergy += dv
        graphStats.avgMotion += m
        graphStats.maxMotion = Math.max(graphStats.maxMotion,m)

        n.px = n.x
        n.py = n.y
    })
    graphStats.avgMotion /= nodes.length

    return graphStats;
}



let GraphQuality = function(graph, name){

    let start_time= null, end_time = null

    graph.nodes.forEach(n=>{n.px=0;n.py=0;})

    function update(iterNum){
        end_time = performance.now()
        if( start_time == null ) start_time = end_time

        let graphReadability = graph.nodes.length < 2000 ? greadability(graph.nodes, graph.links) : {}
        let graphMotion = gmotion(graph.nodes)

        let data = {
            frame: iterNum,
            file: graph.file,
            experiment: name,
            nodes: graph.nodes,
            timing: {...graph.timing,frameTime:{'name': "Frame Time", 'value':end_time-start_time}},
            quality: {...graphReadability,...graphMotion},
        }

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                //console.log(xhr.responseText)
            }
          }
        xhr.open("POST", "graph_quality", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));

        start_time = performance.now()
    }

    return {
        update : function(iterNum){ update(iterNum); return this }
    }

}

