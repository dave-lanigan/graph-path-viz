
/*
Notes:

-have red hover when you first click.
-be able to unclick a node.
-be able to click and drag to click multiple nodes

*/


//----Graph Functions

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

// async function delayed_color_change(node,color) {
//     await sleep(2000);
//     elem=document.getElementById(node);
//     elem.style.backgroundColor = color;
//   }

class Graph{
    constructor(N,A){
        if (Object.keys(N).length == 0){
            this.N={};
        }
        else if (Object.keys(N).length !=0){
            this.N=N;
        }
        if (A.length == 0){
            this.A=[];
        }
        else if (A.length !=0){
            this.A=A;
        }
    }

    nodes(){return this.N;}
    adjacency() {return this.A}

    neighbors(node){
        let Acopy = this.A
        let Ncopy = this.N

        let neighbor_array = Acopy[ Ncopy[node] ];

        let nearest = [];
        let node_vals = Object.values(Ncopy);
        let node_keys = Object.keys(Ncopy);
        
        for (let i=0;i<neighbor_array.length;i++){
            if (neighbor_array[i]==1){
                nearest.push(  node_keys[  node_vals.indexOf(i)  ]  )
            }
        }
    return nearest;
    }

    remove_node(node){

        let num_nodes = this.A.length
        let point = this.N[node];

        for (let i=0;i<num_nodes;i++){ 
            this.A[i][point]=0; 
            this.A[point][i]=0;  }
    }
}

function bfs_path(G,s,e){

    let visited = {};
    let prev = {};
    let q =[];
    let narr = Object.keys(G.nodes())

    //remove nodes without neighbors (deleted nodes)
    let nodes_array=[];
    for (let i=0;i<narr.length;i++){ 
        if ( G.neighbors( narr[i] ).length!=0 ){
            nodes_array.push(narr[i])
            }
        }

    //create visited and prev objects
    for(let i=0;i< nodes_array.length;i++){
        visited[ nodes_array[i] ]=false;
        prev[ nodes_array[i] ]=null;
    }
    
    visited[s]=true;
    q.push(s);
    
    while( q.length !=0  ){
        let node=q.shift();
        let neighbors = G.neighbors(node);

        for (let k=0;k<neighbors.length;k++){
            let n=neighbors[k]
            if ( visited[ n ]==false ){
                q.push( n );
                visited[n]=true;
                //if (n!=e){delayed_color_change(node);}
                prev[n]=node
            }
        }
    }
    let path=[];
    let p=e;
    while (p!=null){
        path.push( p )
        p=prev[p]
    }
    return path.reverse()
}


function run(path){

    let s = start_node.id
    let e = end_node.id

    path=bfs_path(G,s,e);
    path.pop()
    path.shift()


    if (end_node!=0){
        for (let i=0;i<path.length;i++){
            //delayed_color_change(path[i],"#457b9d");
            let sq = document.getElementById( path[i] );
            sq.style.backgroundColor="#2ec4b6";
        }
    }
    else if (end_node==0){
        message_div.innerHTML="Select an end node.";
    }
}



//------------- WebPage Set up

colors =  {
    "dark": "#011627",
    "mid-dark": "#e71d36",
    "middle": "#ff9f1c",
    "light": "#2ec4b6",
    "lightest": "#fdfffc",
    "light-yellow":"#ffe066",
    "light-blue":"#00b4d8",
  }

let sq_size=20;
let start_node;
let end_node;
let node_list;
let N;
let A;
let message_div = document.getElementById('message-div')
let G;

const sub = document.getElementById('submit-button');
sub.onclick = function() {

    node_list = [];
    N = {};
    A = [];

    message_div.innerHTML="";

    start_node=0;
    end_node=0;

    // Get graph size
    var val = document.getElementById("data").value;
    var out =  parseInt(val.split("x")[0] )

    // do we need this? flexbox should fix the problem
    var main_div = document.getElementById('main-div')
    main_div.style.width = (out*sq_size).toString()+"px";
    main_div.style.height = (out*sq_size).toString()+"px";

    //clean out main-div
    main_div.innerHTML="";

    //create graph squares buttons
    for (let j = 0; j<out;j++){
        for (let i = 0; i<out;i++){
                var clickMeButton = document.createElement('button');
                clickMeButton.id = j.toString()+"_"+i.toString()
                clickMeButton.classList.add("btn");
                clickMeButton.onclick = percolate;
                document.getElementById("main-div").appendChild(clickMeButton);
            node_list.push( clickMeButton.id )
            }
    }
    main_div.style.border= `1px ${colors["lightest"]} solid`;


    // create run algo button
    var go_div = document.getElementById('go-div')
    go_div.innerHTML = "";

    var gobutton = document.createElement("button");
    gobutton.id = "go-id";
    gobutton.onclick = run;
    gobutton.style.width = (out*sq_size).toString()+"px";
    gobutton.innerHTML="Run Algo!"
    document.getElementById('go-div').appendChild(gobutton);

    var go_div = document.getElementById('go-div')
    go_div.style.width=(sq_size*out).toString() + "px";


    //randomly pick start node
    var rand_id = node_list[Math.floor(Math.random() * node_list.length)];
    start_node = document.getElementById(rand_id)
    start_node.style.backgroundColor = colors["light-blue"];

    //change color for hover to be red
    /*
    buttons_class = document.classList.add("btn")[0];
    buttons_class.style.hover = #xcvbxcv;
    */

   let num_nodes=node_list.length

    //create blank adjacency array
    const zeros = (m, n) => [...Array(m)].map(e => Array(n).fill(0));
    A = zeros(out*out,out*out)

   // fill N
   let values = [];
   for (let i=0; i<num_nodes;i++){values.push(i);}
   for (let i=0; i<num_nodes;i++){N[node_list[i]]=values[i];}

   //fill adjacency array
   //corners
    let corners = [0, out - 1 , out*out - out , out*out - 1]

    //corner 1
    A[ 0 ][ corners[0] + 1 ]=1
    A[ 0 ][ corners[0] + out ]=1
    // corner 2
    A[ corners[1] ][ corners[1] - 1 ] = 1
    A[ corners[1] ][ corners[1] + out ] = 1
    // corner 3
    A[ corners[2] ][ corners[2] - out ]=1
    A[ corners[2] ][ corners[2] + 1 ]=1
    // corner 4
    A[ corners[3] ][ corners[3] - out ]=1
    A[ corners[3] ][ corners[3] - 1 ]=1

    for (let g=0;g<num_nodes;g++){

        let el = node_list[g].split("_");
        let row=parseInt( el[0] );
        let col=parseInt( el[1] );
        
        if ( corners.indexOf(g)==-1 ){
            point=g

            //if side left
            if ( col==0){
                //point = col + row
                A[point][point - out]=1
                A[point][point + 1]=1
                A[point][point + out]=1
            }
            //if side right
            if ( col == (out - 1 ) ){
                //point = col + row
                A[point][point - out]=1
                A[point][point - 1]=1
                A[point][point + out]=1
            }
            //if side bottom
            if ( row==0 ){
                //point = col + row
                A[point][point - 1]=1
                A[point][point + 1]=1
                A[point][point + out]=1
            }
            //if side top
            if ( row== (out - 1) ){
                //point = col + row
                A[point][point - 1]=1
                A[point][point + 1]=1
                A[point][point - out]=1
            }
            //if middle
            if ( row!=0 && row!= (out -1 ) &&  col!=0 && col!= (out-1) ){
                //point = col + row
                A[point][point - out]=1
                A[point][point - 1]=1
                A[point][point + 1]=1
                A[point][point + out]=1
            }
        }
    }//end build array loop

    G = new Graph(N,A);
    
    let submit_button = document.getElementById("submit-button");
    submit_button.innerHTML="Reset"

    let message = document.createElement("p");
    message.id="message-p"
    message.innerHTML="Select an end node.";
    document.getElementById('message-div').appendChild(message);
    


    //return G,A,N;

}//end on click function

function percolate() {


    if (end_node==0){ 
        end_node = document.getElementById(this.id)
        end_node.style.backgroundColor = colors["mid-dark"];;
        /*
        buttons_class = document.classList.add("btn")[0];
        buttons_class.style.hover = #xcvbxcv;
        */
       let mp = document.getElementById("message-p");
        mp.innerHTML="Percolate the graph by de-selecting nodes.";
        
     }
     else if (end_node != 0){
        i_d=this.id
        let out=i_d.split("_")
        let point = parseInt(out[0]) + parseInt(out[1])

        rm_node = document.getElementById(i_d)
        rm_node.style.backgroundColor = colors["lightest"];

        G.remove_node(i_d)

        // A.splice(point,1)
        // let num_nodes = A[0].length
        // for (let i=0;i<num_nodes){}

    }
}
