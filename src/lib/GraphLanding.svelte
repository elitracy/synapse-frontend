<script lang="ts" context="module">

    export type point = [x:number, y:number];
    export type topic = {
        size: number;
        name: string;
        tpL: topic[];
        root: topic | null;
        location: point | null;
        color: string | null;
    };

    export type note = {
        id: number;
        name: string;
        category: string;
        delta: Delta | null;
        tgL: string[];
    };

</script>






<script lang="ts" src="./test/topics.json">
    import type Delta from "../../node_modules/@types/quill/node_modules/quill-delta";

    export let noteList;
  
    let g: topic[];

    g = [];


    function makeNodes(ntL: note[]){
        for(let k = 0;k<ntL.length;k++) {
            g.push({size:ntL[k].tgL.length*4+10,name:ntL[k].name, tpL:[], root:null,location:null, color:null});
            let ind = g.length-1;
            for(let i = 0;i<ntL[k].tgL.length;i++) {
                g.push({size:5,name:ntL[k].tgL[i], tpL:[], root:g[ind],location:null, color:null});
            }
        }
    }

    makeNodes(noteList)

    let s = 6;

    import { onMount } from "svelte";
    import { draw } from "svelte/transition"
    import type { X } from "vitest/dist/types-0373403c"
    let canvasElement: HTMLCanvasElement;

    let selected:topic[];
    selected = [];

    let hovering: topic | null;
    hovering = null;

    onMount(() => {
        // get canvas context
        canvasElement.width = window.screen.availWidth*.6;
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
                let pr = g[i].root?.location;
                if(t&&pr){
                    t = [pr[0]+t[0],pr[1]+t[1]];
                    if(dist(p,t)<g[i].size*s && g[i].root){
                        hovering = g[i];
                        chge = true;
                        break;
                    }
                }
            }

            if(chge)
                canvasElement.style.cursor = "pointer"; 
            else {
                canvasElement.style.cursor = "default";
                hovering = null;
            }
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
                    
                    if(t && g[i].root!=null){
                        let pr = g[i].root?.location;
                        if(pr)
                            t = [t[0]+pr[0],t[1]+pr[1]];
                        if(dist(p,t)<g[i].size*s){
                            if(selected.includes(g[i]) ){
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



            // animate the edge creation
            if(ctx) {
                function animateEdge(ctx: CanvasRenderingContext2D | null, a:number, fc:number, pa:point, pb:point) {

                    if(ctx) {
                        ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
                        drawTopicsAnimateEdge(ctx,a,fc, pa, pb);
                    }

                    if(a<fc)
                        setTimeout(()=>requestAnimationFrame(()=>animateEdge(ctx,a+1,fc,pa,pb)), 5);
                    else {
                        selected[0].tpL.push(selected[1]);
                        selected = [];
                    }
                    
                }
                let fc = 50;
                let pa:point;
                let pb:point;

                pa = [0,0];
                pb = [0,0];

                let rtl1 = selected[0].root?.location;
                let rtl2 = selected[1].root?.location;

                if(selected[0].location && rtl1)
                    pa = [selected[0].location[0]+rtl1[0],selected[0].location[1]+rtl1[1]];
                if(selected[1].location && rtl2)
                    pb = [selected[1].location[0]+rtl2[0],selected[1].location[1]+rtl2[1]];
                requestAnimationFrame(()=>animateEdge(canvasElement.getContext("2d"), 1, fc,pa,pb));

                
            }


        }
        
    });
    

    function dist(p1:point, p2:point) {
        return Math.sqrt(Math.pow(p2[0]-p1[0],2)+Math.pow(p2[1]-p1[1],2));
    }

    

    function drawTopics(ctx: CanvasRenderingContext2D){
        
        ctx.translate(canvasElement.width/2, canvasElement.height/2);

        

        for(let i = 0;i<g.length;i++) {

            if(g[i]!=null && !g[i].root) {
                g[i].location;

                let num = g[i]?.size;
                let p = g[i]?.location;

                if(p) {
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
                                    ${Math.random()*(50)+200},
                                    ${Math.random()*(50)+200},
                                    ${Math.random()*(50)+200}, 0.7)`;
                        let c = g[i].color;
                        if(c)
                            gradient.addColorStop(0, c); 
                    }
                                
                    gradient.addColorStop(1, 'gray');

                    ctx.fillStyle = gradient;

                    
                    ctx.fill();

                    ctx.fillStyle = 'white';
                    ctx.font = "30px Arial";

                    ctx.textAlign = 'center';

                    let addx = 0;
                    let addy = num*s+30;

                    if(p[0]<0)
                        addx *= -1;
                    if(p[1]<0) {
                        addy *= -1;
                        addy += 15;
                    }

                    ctx.textAlign = 'center';
                    ctx.fillText(g[i].name,p[0]+addx,p[1]+addy, 200);
                }
                
            
            }
            
        }

        for(let i = 0;i<g.length;i++) {
            if(g[i]!=null && g[i]?.tpL.length!=0) {
                let p = g[i].location;
                let pr = g[i].root?.location;
                if(p && pr) {
                    p = [pr[0]+p[0], pr[1]+p[1]];
                    for(let j = 0;j<g[i].tpL.length;j++) {
                        if(g[i].tpL[j]) {
                            let p1 = g[i].tpL[j].location;
                            let pr1 = g[i].root?.location;
                            if(p1 && pr1){

                                p1 = [pr1[0]+p1[0], pr1[1]+p1[1]];

                                let r = 50;

                                let angle = anglebtw(p,p1);


                                //let c1 = [0.2*(p1[0]-p[0])+p[0] - Math.cos(angle+Math.PI/2)*r,0.2*(p1[1]-p[1])+p[1] - Math.sin(angle+Math.PI/2)*r];
                                //let c2 = [0.8*(p1[0]-p[0])+p[0] + Math.cos(angle+Math.PI/2)*r,0.8*(p1[1]-p[1])+p[1] + Math.sin(angle+Math.PI/2)*r];

                                ctx.beginPath();
                                ctx.moveTo(...p);
                                ctx.lineTo(p1[0],p1[1]);

                                ctx.lineWidth = 5;
                                ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                                
                                ctx.stroke();
                            }
                        }
                        ctx.moveTo(...p);
                    }
                }
            }
        }


        for(let i = 0;i<g.length;i++) {

            if(g[i]!=null && g[i].root) {
                g[i].location;

                let num = g[i]?.size;
                let p = g[i]?.location;
                if(num && p) {
                    let rt = g[i].root;
                    if(rt && rt.location) {
                        ctx.beginPath();
                        ctx.ellipse(rt.location[0]+p[0],rt.location[1]+p[1],(num)*s,(num)*s, 0,0,2*Math.PI);
                        ctx.closePath();

                        var gradient = ctx.createRadialGradient(rt.location[0]+p[0],rt.location[1]+p[1], num*s-2, rt.location[0]+p[0],rt.location[1]+p[1], num*s);
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

                        ctx.fillStyle = 'black';
                        ctx.font = "20px Arial";

                        let addx = 0;
                        let addy = num*s+15;

                        if(p[0]<0)
                            addx *= -1;
                        if(p[1]<0)
                            addy *= -1;

                        ctx.textAlign = 'center';
                        //ctx.fillText(g[i].name,rt.location[0]+p[0]+addx,rt.location[1]+p[1]+addy, 200);
                    } 
                }
            }

            }


        ctx.translate(-canvasElement.width/2, -canvasElement.height/2);
    }

    function drawTopicsAnimateEdge(ctx: CanvasRenderingContext2D, a:number, fc:number, pa:point, pb:point){
        
        ctx.translate(canvasElement.width/2, canvasElement.height/2);

        

        for(let i = 0;i<g.length;i++) {

            if(g[i]!=null && !g[i].root) {
                g[i].location;

                let num = g[i]?.size;
                let p = g[i]?.location;

                if(p) {
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
                                    ${Math.random()*(50)+200},
                                    ${Math.random()*(50)+200},
                                    ${Math.random()*(50)+200}, 0.7)`;
                        let c = g[i].color;
                        if(c)
                            gradient.addColorStop(0, c); 
                    }
                                
                    gradient.addColorStop(1, 'gray');

                    ctx.fillStyle = gradient;

                    
                    ctx.fill();

                    let addx = 0;
                    let addy = num*s+30;

                    if(p[0]<0)
                        addx *= -1;
                    if(p[1]<0) {
                        addy *= -1;
                        addy += 15;
                    }

                    ctx.textAlign = 'center';

                    ctx.fillStyle = 'white';
                    ctx.font = "30px Arial";
                    ctx.fillText(g[i].name,p[0]+addx,p[1]+addy, 200);
                }
                
            
            }
            
        }

        for(let i = 0;i<g.length;i++) {
            if(g[i]!=null && g[i]?.tpL.length!=0) {
                let p = g[i].location;
                let pr = g[i].root?.location;
                if(p && pr) {
                    p = [pr[0]+p[0], pr[1]+p[1]];
                    for(let j = 0;j<g[i].tpL.length;j++) {
                        if(g[i].tpL[j]) {
                            let p1 = g[i].tpL[j].location;
                            let pr1 = g[i].root?.location;
                            if(p1 && pr1){

                                p1 = [pr1[0]+p1[0], pr1[1]+p1[1]];

                                let r = 50;

                                let angle = anglebtw(p,p1);

                                ctx.beginPath();
                                ctx.moveTo(...p);
                                ctx.lineTo(p1[0],p1[1]);

                                ctx.lineWidth = 5;
                                ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                                
                                ctx.stroke();
                            }
                        }
                        ctx.moveTo(...p);
                    }
                }
            }
        }



        let r = 50;

        let angle = anglebtw(pa,pb);

        pb = [(a/fc)*(pb[0]-pa[0])+pa[0], (a/fc)*(pb[1]-pa[1])+pa[1]];

        let coef = Math.sin(Math.PI/2+Math.PI/2*(a/fc));

        let c1 = [0.7*(pb[0]-pa[0])+pa[0] - coef*Math.cos(angle+Math.PI/2)*r,0.7*(pb[1]-pa[1])+pa[1] - coef*Math.sin(angle+Math.PI/2)*r];
        let c2 = [0.9*(pb[0]-pa[0])+pa[0] + coef*Math.cos(angle+Math.PI/2)*r,0.9*(pb[1]-pa[1])+pa[1] + coef*Math.sin(angle+Math.PI/2)*r];

        ctx.beginPath();
        ctx.moveTo(...pa);
        ctx.bezierCurveTo(c1[0],c1[1],c2[0],c2[1],pb[0],pb[1]);

        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0,'+a/fc*.3+')';
        
        ctx.stroke();


        for(let i = 0;i<g.length;i++) {

            if(g[i]!=null && g[i].root) {
                g[i].location;

                let num = g[i]?.size;
                let p = g[i]?.location;
                if(num && p) {
                    let rt = g[i].root;
                    if(rt && rt.location) {
                        ctx.beginPath();
                        ctx.ellipse(rt.location[0]+p[0],rt.location[1]+p[1],(num)*s,(num)*s, 0,0,2*Math.PI);
                        ctx.closePath();

                        var gradient = ctx.createRadialGradient(rt.location[0]+p[0],rt.location[1]+p[1], num*s-2, rt.location[0]+p[0],rt.location[1]+p[1], num*s);
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

                        ctx.fillStyle = 'black';
                        ctx.font = "20px Arial";

                        let addx = 0;
                        let addy = num*s+15;

                        if(p[0]<0)
                            addx *= -1;
                        if(p[1]<0)
                            addy *= -1;

                        ctx.textAlign = 'center';
                        //ctx.fillText(g[i].name,rt.location[0]+p[0]+addx,rt.location[1]+p[1]+addy, 200);
                    } 
                }
            }

            }


        ctx.translate(-canvasElement.width/2, -canvasElement.height/2);
    }


    function anglebtw(p:point, p1:point){
        if(p[0]-p1[0] == 0)
            return Math.PI/2;
        return Math.atan((p[1]-p1[1])/(p[0]-p1[0]));
    }


    function initializePoints(){

        let rr = canvasElement.width/2*.8;

        let rts: topic[];
        let tps: topic[];
        rts = [];
        tps = [];

        let rtc = 0;

        let done = false;


        for(let i = 0;i<g.length;i++) {

            if(g[i].root) {
                let p: point;

                let pr = g[i].root;

                if(pr) {
                    tps.push(g[i]);
                }

                
            } else {
                let p: point;


                for(let b = 0;b<tps.length;b++) {
                    let prt = tps[b].root?.location;
                    let srt = tps[b].root?.size;

                    if(tps.length==1) {
                        tps[b].location = [0,0];
                        break;
                    }

                    if(prt && srt) {
                        tps[b].location = [srt*(s-3)*Math.cos(b/tps.length*2*Math.PI),srt*(s-3)*Math.sin(b/tps.length*2*Math.PI)];
                    }
                }

                rtc++;

                tps = [];

                p = [0, 0];

                for(let k = 1;k<10;k++) {
                    let done = false;
                    let m = 2*Math.PI*Math.random();
                    for(let j = m;j<2*Math.PI+m;j+=Math.PI/3+Math.random()) {
                        for(let l = 0;l<rts.length;l++)
                        {
                            console.log(rts.length);
                            let rtl = rts[l].location;
                            if(rtl)
                            if(((dist(rtl,p)<(rts[l].size+g[i].size+10)*s))) {
                                p = [rr/10*k*Math.cos(j), -rr/10*k*Math.sin(j)];
                                done = false;
                                console.log(rtl + " " + p);
                                break;
                            }
                            done = true;
                        }
                        if(done)
                            break;
                    }
                    console.log(k);
                    if(done)
                        break;
                }

                if(g[i]!=null && g[i]?.size) {
                    g[i].location = p;
                }
                
                rts.push(g[i]);

                done = false;
            } 
            if(g.length-1 == i) {
                for(let b = 0;b<tps.length;b++) {
                    let prt = tps[b].root?.location;
                    let srt = tps[b].root?.size;

                    if(prt && srt) {
                        tps[b].location = [srt*(s-4)*Math.cos(b/tps.length*2*Math.PI),srt*(s-4)*Math.sin(b/tps.length*2*Math.PI)];
                        console.log(tps[b].location);
                    }
                }

                tps = [];
            }
            
        }

    }

    function outOfBounds(p: point) {
        let buffer = 500;
        if((p[0]<(-canvasElement.width/2+buffer/2) || p[0]>(canvasElement.width/2-buffer/2) || p[1]<(-canvasElement.height/2+buffer) || p[1]>(canvasElement.height/2-buffer)))
            return true;
        return false;
    }


</script>

<div class="container">
        <canvas bind:this={canvasElement} width="1000" height="700">

        </canvas>
        <div class="side">
            {#if selected.length==1}
                <div class="selection">
                    {selected[0].name}
                </div>
            {/if}
            {#if hovering!=null}
                <div class="selection">
                    {hovering.name}
                </div>
            {/if}
        </div>
    
</div>


<style> 
.container{
    height: fit-content;

    /* background-color: white; */

    border-radius: 5px;

    

    margin-top: 5em;
}
.selection1{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    font-size: 3em;
}
.selection2{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    font-size: 3em;
}
</style>
