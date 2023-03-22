<script lang="ts" context="module">

    export type point = [x:number, y:number];
    export type topic = {
        size: number;
        name: string;
        tpL: topic[];
        location: point | null;
        color: string | null;
    };

</script>






<script lang="ts" src="./test/topics.json">


let obj = '{ "name":"Note 1", "subtopics": [{ "topic": { "name":"bubble sort", "subtopics": []}},{ "topic": { "name":"merge sort", "subtopics": []}},{ "topic": { "name":"quick sort", "subtopics": []}}]}';
   
    let g: topic[];

    g = [];

    
    let act_obj = JSON.parse(obj);

    function makeNodes(){
        g.push({size:7,name:act_obj.name, tpL:[],location:null, color:null});
        let sts = act_obj.subtopics;
        for(let i = 0;i<sts.length;i++) {
            g.push({size:5,name:act_obj.subtopics[i].topic.name, tpL:[],location:null, color:null});
        }
    }

    makeNodes()

    let s = 6;

    let lvl = 7;

    import { onMount } from "svelte";
    import { draw } from "svelte/transition"
    import type { X } from "vitest/dist/types-0373403c"
    let canvasElement: HTMLCanvasElement;

    let selected:topic[];
    selected = [];

    onMount(() => {
        // get canvas context
        canvasElement.width = window.screen.availWidth*.7;
        canvasElement.height = window.screen.availHeight*.7;
        let ctx = canvasElement.getContext("2d")

        if(ctx) {
            initializePoints();
            drawTopics(ctx);
        }

        canvasElement.onmousemove = function(e) {

            var x = e.clientX - canvasElement.getClientRects()[0].left - canvasElement.width/2;
            var y = e.clientY - canvasElement.getClientRects()[0].top - canvasElement.height/2;

            let p:point;
            p = [x,y];

            let chge = false;

            for(let i = 0;i<g.length;i++){
                let t = g[i].location;
                if(t){
                    if(dist(p,t)<g[i].size*s){
                        chge = true;
                        break;
                    }
                }
            }

            if(chge)
                canvasElement.style.cursor = "pointer"; 
            else 
                canvasElement.style.cursor = "default";
        };

        let single = true;

        canvasElement.onclick = function(e) {

            var x = e.clientX - canvasElement.getClientRects()[0].left - canvasElement.width/2;
            var y = e.clientY - canvasElement.getClientRects()[0].top - canvasElement.height/2;

            let p:point;
            p = [x,y];

            let chge = false;

            single = true;

            setTimeout(()=>{
                if(single)
                for(let i = 0;i<g.length;i++){
                    let t = g[i].location;
                    if(t){
                        if(dist(p,t)<g[i].size*s){
                            if(selected.includes(g[i])){
                                selected = selected.filter(n => n!=g[i]);
                                selected = selected;

                                if(ctx) {
                                    ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
                                    drawTopics(ctx);
                                }

                                break;
                            }
                            selected.push(g[i]);
                            if(ctx){
                                ctx.translate(canvasElement.width/2, canvasElement.height/2);
                                ctx.beginPath();
                                ctx.ellipse(t[0],t[1],(g[i].size)*s,(g[i].size)*s, 0,0,2*Math.PI);
                                ctx.closePath();

                                ctx.lineWidth = 3;
                                ctx.strokeStyle = 'rgb(215, 189, 226)';
                                ctx.stroke();
                                ctx.translate(-canvasElement.width/2, -canvasElement.height/2);

                            }

                            selected = selected;

                            break;
                        }
                    }
                }

                if(selected.length==2 && ctx) {
                    setTimeout(()=>addEdge(),100);
                }
                
            }, 200);


            
        
        }

        canvasElement.ondblclick = function(e) {

            var x = e.clientX - canvasElement.getClientRects()[0].left - canvasElement.width/2;
            var y = e.clientY - canvasElement.getClientRects()[0].top - canvasElement.height/2;

            let p:point;
            p = [x,y];

            single = false;

            for(let i = 0;i<g.length;i++){
                let t = g[i].location;
                if(t){
                    if(dist(p,t)<g[i].size*s){
                        lvl-=2;

                        selected = [];

                        if(ctx) {
                            ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
                            drawTopics(ctx);
                        }
                        break;
                    }
                }
            }

        }

        function addEdge() {

            if(selected[0].tpL.includes(selected[1]) || selected[1].tpL.includes(selected[0])){
                selected = [];
                if(ctx) {
                    ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
                    drawTopics(ctx);
                }
                return;
            }


            selected[0].tpL.push(selected[1]);
            selected = [];

            if(ctx) {
                ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
                drawTopics(ctx);
            }
        }
        
    });
    

    function dist(p1:point, p2:point) {
        return Math.sqrt(Math.pow(p2[0]-p1[0],2)+Math.pow(p2[1]-p1[1],2));
    }


    function addEdge(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
    }

    

    function drawTopics(ctx: CanvasRenderingContext2D){
        
        ctx.translate(canvasElement.width/2, canvasElement.height/2);

        for(let i = 0;i<g.length;i++) {
            if(g[i]!=null && g[i]?.tpL.length!=0) {
                let p = g[i].location;
                if(p) {
                    for(let j = 0;j<g[i].tpL.length;j++) {
                        if(g[i].tpL[j]) {
                            let p1 = g[i].tpL[j].location;
                            if(p1){

                                let r = 50;


                                let c1 = [0.3*(p1[0]-p[0])+p[0] - r,0.3*(p1[1]-p[1])+p[1] - r];
                                let c2 = [0.7*(p1[0]-p[0])+p[0] + r,0.7*(p1[1]-p[1])+p[1] + r];

                                ctx.beginPath();
                                ctx.moveTo(...p);
                                ctx.bezierCurveTo(c1[0],c1[1],c2[0],c2[1],p1[0],p1[1]);

                                ctx.lineWidth = 5;
                                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                                
                                ctx.stroke();
                            }
                        }
                        ctx.moveTo(...p);
                    }
                }
            }
        }

        for(let i = 0;i<g.length;i++) {

            if(g[i]!=null && g[i]?.size==lvl) {
                g[i].location;

                let num = g[i]?.size;
                let p = g[i]?.location;
                if(num && p) {
                    ctx.beginPath();
                    ctx.ellipse(p[0],p[1],(num)*s,(num)*s, 0,0,2*Math.PI);
                    ctx.closePath();

                    var gradient = ctx.createRadialGradient(p[0],p[1], num*s-5, p[0],p[1], num*s);
                    if(g[i].color) {
                        let c = g[i].color;
                        if(c)
                            gradient.addColorStop(0, c);
                    } else {
                        g[i].color = `rgb(
                                    ${Math.random()*(100)+100},
                                    ${Math.random()*(100)+100},
                                    ${Math.random()*(100)+100})`;
                        let c = g[i].color;
                        if(c)
                            gradient.addColorStop(0, c); 
                    }
                            
                    //gradient.addColorStop(0, 'white');           
                    gradient.addColorStop(1, 'black');

                    ctx.fillStyle = gradient;

                    // ctx.lineWidth = 1;
                    // ctx.strokeStyle = 'black';
                    // ctx.stroke();
                    
                    
                    ctx.fill();

                    ctx.fillStyle = 'white';
                    ctx.font = "30px Arial";
                    ctx.fillText(g[i].name,p[0]+num*s+5,p[1]+num*s+5, 200);

                }
            }
            
        }


        ctx.translate(-canvasElement.width/2, -canvasElement.height/2);
    }


    function initializePoints(){

        let rr = g.length*100;

        let pts: point[];
        pts = [];

        for(let i = 0;i<g.length;i++) {
            let p: point;

            p = [Math.random()*rr-rr/2, Math.random()*rr-rr/2];

            for(let k = 0;k<10;k++) {
                for(let j = 0;j<pts.length;j++) {
                    if(dist(pts[j],p)<100) {
                        p = [Math.random()*rr-rr/2, Math.random()*rr-rr/2];
                        break;
                    }
                }
            }

            if(g[i]!=null && g[i]?.size) {
                g[i].location = p;
            }
            
            pts.push(p);
        }

    }


</script>

<div class="container">
    <canvas bind:this={canvasElement} width="1000" height="700">

    </canvas>

    {#if selected.length==1}
        <div class="selection">
            {selected[0].name}
        </div>
    {/if}

    <!-- {#if selected.length==2}
        <div class="selection">
            {selected[0].name+" "}{selected[1].name}
        </div>
        <button></button>
    {/if} -->
    
</div>


<style> 
.container{
    height: fit-content;

    /* background-color: white; */

    border-radius: 5px;

    margin-top: 5em;
}
.selection{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    font-size: 3em;
}
</style>
