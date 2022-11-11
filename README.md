# Untangling Force-Directed Layouts with Persistent Homology


## Abstract

Force-directed layouts belong to a popular class of methods used to position nodes in a node-link diagram. However, they typically lack direct consideration of global structures, which can result in visual clutter and the overlap of unrelated structures. In this paper, we use the principles of persistent homology to untangle force-directed layouts thus mitigating these issues. First, we devise a new method to use 0-dimensional persistent homology to efficiently generate an initial graph layout. The approach results in faster convergence and better quality graph layouts. Second, we provide a new definition and an efficient algorithm for 1-dimensional persistent homology features (i.e., tunnels/cycles) on graphs. We provide users the ability to interact with the 1-dimensional features by highlighting them and adding cycle-emphasizing forces to the layout. Finally, we evaluate our approach with 32 synthetic and real-world graphs by computing various metrics, e.g., co-ranking, edge crossing, etc., to demonstrate the efficacy of our proposed method.


## Citation

Bhavana Doppalapudi, <a href="http://www.sci.utah.edu/~beiwang/">Bei Wang</a>, and <a href="https://cspaul.com">Paul Rosen</a>. *Untangling Force-Directed Layouts Using Persistent Homology*, IEEE Workshop on Topological Data Analysis and Visualization (TopoInVis), 2022. <a href="https://arxiv.org/abs/2208.06927">https://arxiv.org/abs/2208.06927</a>


## Viewing the Demo

The demo can be viewed at <a href="https://untanglefdl.github.io/UntangleFDL_Paper_TopoInVis2022/">https://untanglefdl.github.io/UntangleFDL_Paper_TopoInVis2022/</a>


## To Run the Demo

To run properly, the code needs to be hosted on a webserver and loaded in a web browser. These instructions are for running a webserver locally with python. We have tested this setup on Mac, Linux, and Windows 11 distributions. 

### [required] Install python3

    On Debian linux, such as Ubuntu
    > sudo apt install python3

    On Mac, you can download from python.org, macports, or homebrew. You will need python3. 

    On Windows, you can download from python.org or the Windows Store.

### [required] Run the code

    Run the code (Mac/Linux)
    > ./run.sh
    
    Run the code (Windows)
    > Run run.bat
    
    Everything should be installed and the code will run. If everything goes as planned, a web browser will be opened automatically for you when everything is done. If it doesn't, you can open a web browser and go to http://localhost:5350/.



## Acknowledgements
    
This work was partially supported by the National Science Foundation (IIS-1513616 and IIS-1845204), Department of Energy (DOE) DE-SC0021015.
