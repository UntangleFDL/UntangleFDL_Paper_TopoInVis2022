

////////////////////////////////////////////////////////////////////////////////////
//////
////// Navigation Helpers
//////
////////////////////////////////////////////////////////////////////////////////////
var pages = [{page: 'layout_figures.html', title: 'Initial Layout Figures'},
                {page: 'large_figures.html', title: 'Large Data Figures'},
                {page: 'h1_figures.html', title: 'H1 Feature Figures'},
                {page: 'other_algos.html', title: 'Other Algorithms'}]


function insert_navbar( curpage ){
    html = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
              <div class="container-fluid">
                <a class="navbar-brand" href="index.html">Untangling FDL</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav me-auto mb-2 mb-lg-0">`

    pages.forEach(function(p){
        html += '<li class="nav-item">'
        if( curpage === p.page ){
            html += '<a class="nav-link active" aria-current="page" href="' + p.page + '">' + p.title + '</a>'
        }
        else{
            html += '<a class="nav-link" href="' + p.page + '">' + p.title + '</a>'
        }
        html += '</li>'
    });

     html += `</ul>
                    </div>
                  </div>
                </nav>`

    document.write(html);
}


////////////////////////////////////////////////////////////////////////////////////
//////
////// Download Helpers
//////
////////////////////////////////////////////////////////////////////////////////////
function downloadText(text, filename) {
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click()
}

function downloadJson(obj, filename) {
    downloadText(JSON.stringify(obj), filename);
}

function downloadSVG( plotID, filename=null ){
    if(filename ===null) filename = plotID + ".svg"
    let svgData = $("#"+plotID)[0].outerHTML;
    let svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = filename
    downloadLink.click();
}


////////////////////////////////////////////////////////////////////////////////////
//////
////// Dataset Helpers
//////
////////////////////////////////////////////////////////////////////////////////////
let dataset = ["data/aves-sparrow-social-2009.json", "data/balanced_tree__3_6__.json",
    "data/barabasi_albert_graph__50_40__.json", "data/barbell.json", "data/bcsstk.json",
    "data/bio-celegans.json", "data/bio-diseasome.json", "data/bn-mouse-visual-cortex-2.json",
    "data/chordal_cycle_graph__90__.json", "data/circular_ladder_graph__100__.json",
    "data/connected_caveman_graph__10_20__.json", "data/davis_southern_women.json",
    "data/dolphin-social.json", "data/dorogovtsev_goltsev_mendes_graph__5__.json",
    "data/duplication_divergence_graph__50_0_5__.json", "data/engymes_g123.json", "data/enron-email.json",
    "data/ladder.json", "data/les_miserables.json", "data/lobster.json", "data/lollipop_graph__10_50__.json",
    "data/map_of_science.json", "data/movies.json", "data/random_geometric_graph__400_0_1__.json",
    "data/retweet.json", "data/science_collab_network.json", "data/train_bombing.json", "data/usair97.json",
    "data/watts_strogatz_graph__100_5_0_05__.json"]


let large_data  = ['large_data/airport.json', 'large_data/hic_1k_net_6.json', 'large_data/smith.json']


let exp_loop = { "data/bcsstk.json": [2,3,5,6,7],
                 "data/bio-diseasome.json" : [21,22,23],
                 "data/bn-mouse-visual-cortex-2.json": [5,7,9,10,13],
                 "data/circular_ladder_graph__100__.json": [0],
                 "data/engymes_g123.json": [91,98,104,109,110,117,127],
                 "data/map_of_science.json": [106,164,245],
                 "data/random_geometric_graph__400_0_1__.json": [33,34,42,45,46],
                 "data/retweet.json": [1,2,3,4,5],
                 "data/science_collab_network.json": [2,4,5,6],
                 "data/watts_strogatz_graph__100_5_0_05__.json": [0,3,8,9,10,16]}

////////////////////////////////////////////////////////////////////////////////////
//////
////// Coloring Helpers
//////
////////////////////////////////////////////////////////////////////////////////////
let grp_colors = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896',
                '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7',
                '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']

//let deg_color = (t)=>{ return d3.interpolateYlOrRd( t<0 ? 0 : ( t>1 ? 0.7 : t*0.7 ) ) }
let deg_color = (t)=>{ return d3.interpolatePlasma( t<0 ? 0.85 : ( t>1 ? 0 : (1-t)*0.85 ) ) }


function update_graph_draw_colors( graph_draw, color_by_group, color_by_degree, color_by_degree_ranked ){

    let graph = graph_draw.graph()
    let degree_range = [0,0]

    if( color_by_degree ) degree_range = d3.extent( graph.nodes, n => n.degree )
    if( color_by_degree_ranked ) degree_range = d3.extent( graph.nodes, n => n.degreeRank )

    if(degree_range[0] === degree_range[1]){
        degree_range[0] -= 1
        degree_range[1] += 1
    }

    graph_draw.setNodeFill( (d)=>{
        if( color_by_group && 'group' in d ) return grp_colors[d.group%grp_colors.length]
        if( color_by_degree || !('group' in d) ) return deg_color((d.degree-degree_range[0])/(degree_range[1]-degree_range[0]))
        if( color_by_degree_ranked || !('group' in d) ) return deg_color((d.degreeRank-degree_range[0])/(degree_range[1]-degree_range[0]))
        return 'black'
    })

    graph_draw.setNodeStroke( (d)=>{
        if( color_by_group && 'group' in d ) return "white"
        if( color_by_degree || color_by_degree_ranked || !('group' in d) ) return "#666"
        return 'black'
    })
}

let dataset_colors = { "data/aves-sparrow-social-2009.json": 'color_by_degree_ranked',
                       "data/balanced_tree__3_6__.json": 'color_by_degree_ranked',
                       "data/barabasi_albert_graph__50_40__.json": 'color_by_degree_ranked',
                       "data/barbell.json": 'color_by_degree_ranked',
                       "data/bcsstk.json": 'color_by_degree_ranked',
                       "data/bio-celegans.json": 'color_by_degree_ranked',
                       "data/bio-diseasome.json": 'color_by_degree_ranked',
                       "data/bn-mouse-visual-cortex-2.json": 'color_by_degree_ranked',
                       "data/chordal_cycle_graph__90__.json": 'color_by_degree_ranked',
                       "data/davis_southern_women.json": 'color_by_degree_ranked',
                       "data/dolphin-social.json": 'color_by_degree_ranked',
                       "data/dorogovtsev_goltsev_mendes_graph__4__.json": 'color_by_degree_ranked',
                       "data/duplication_divergence_graph__50_0_5__.json": 'color_by_degree_ranked',
                       "data/enron-email.json": 'color_by_degree_ranked',
                       "data/engymes_g123.json": 'color_by_degree_ranked',
                       "data/ladder.json": 'color_by_degree_ranked',
                       "data/les_miserables.json": 'color_by_group',
                       "data/lobster.json": 'color_by_degree_ranked',
                       "data/lollipop_graph__10_50__.json": 'color_by_degree_ranked',
                       "data/map_of_science.json": 'color_by_group',
                       "data/movies.json": 'color_by_degree_ranked',
                       "data/random_geometric_graph__400_0_1__.json": 'color_by_degree_ranked',
                       "data/retweet.json": 'color_by_degree_ranked',
                       "data/science_collab_network.json": 'color_by_degree_ranked',
                       "data/train_bombing.json": 'color_by_degree_ranked',
                       "data/usair97.json": 'color_by_degree_ranked',
                       "data/watts_strogatz_graph__100_5_0_05__.json" : 'color_by_degree_ranked',
                       'large_data/airport.json': 'color_by_degree_ranked',
                       'large_data/hic_1k_net_6.json': 'color_by_degree_ranked',
                       'large_data/smith.json': 'color_by_degree_ranked',
                       'data/dummy.json': 'color_by_degree_ranked'
                    }

dataset.forEach( ds =>{
  if( ! (ds in dataset_colors ) ) dataset_colors[ds] = 'color_by_group'
})


large_data.forEach( ds =>{
  if( ! (ds in dataset_colors ) ) dataset_colors[ds] = 'color_by_group'
})



////////////////////////////////////////////////////////////////////////////////////
//////
////// Naming Helpers
//////
////////////////////////////////////////////////////////////////////////////////////
let layouts = ["random","layered_layout","radial_layout"]
let stat_fields = ['lcmc_q_local', 'trustworthy_q_local', 'continuity_q_local', 'crossing', 'crossingAngle', 'angularResolutionMin']
let stat_names ={ crossing: "Edge Crossings", crossingAngle: "Crossing Angle", angularResolutionMin: "Minimum Angular Resolution",
                        trustworthy_q_local: "Trustworthiness", continuity_q_local: "Continuity", lcmc_q_local: "LCMC"}

let proper_names = {'random': "Random Layout (conventional)",
                    "layered_layout": "Layered Layout (our approach)",
                    'radial_layout': "Radial Layout (our approach)",
                    "Maximum Motion": "Maximum Displacement",
                    "Average Motion": "Average Displacement",
                    "Angular resolution (min)": "Minimum Angular Resolution"}

function get_proper_name( v ){
    if( v in proper_names ) return proper_names[v]
    if( v in stat_names ) return stat_names[v]
    return v
}





////////////////////////////////////////////////////////////////////////////////////
//////
////// Misc Helpers
//////
////////////////////////////////////////////////////////////////////////////////////

// Helper function to bring a selcted object to the front of the display
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};



