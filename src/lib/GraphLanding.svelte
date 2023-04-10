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
        id: string;
        name: string;
        category: string;
        ops: string | null;
        tgL: string[];
    };

</script>






<script lang="ts" src="./test/topics.json">
    import { stringify } from "postcss"

    import type Delta from "../../node_modules/@types/quill/node_modules/quill-delta";
    import { createEventDispatcher } from 'svelte';
    import MdHome from 'svelte-icons/md/MdHome.svelte';
    import axios from 'axios';
  
    const url = "https://api.synapsenote.com/api/users";
    const url1 = "https://api.synapsenote.com/api/notes";

    export let noteList: note[];
  
    let g: topic[];

    g = [];

    let scale = 1;


    type Edge = [from:string, to:string, how:string, format:string];

    let eList: Edge[];

    eList = [];

    var stringToHTML = function (str:string) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    };

    


    function makeNodes(){
        let ntL = noteList;

        let roots = [];
        for(let k = 0;k<ntL.length;k++) {
            g.push({size:ntL[k].tgL.length*2+10,name:ntL[k].name, tpL:[], root:null,location:null, color:`rgba(175,175,175, 0.9)`});

            roots.push(g.length-1);

            let ind = g.length-1;
            for(let i = 0;i<ntL[k].tgL.length;i++) {
                g.push({size:3,name:JSON.parse(ntL[k].tgL[i])[4], tpL:[], root:g[ind],location:null, color:`rgb(${Math.random()*(255)},${Math.random()*255},${Math.random()*255})`});


                for(let j = 0;j<g.length-1;j++) {
                    if(g[j].name == g[g.length-1].name) {
                        g[g.length-1].color = g[j].color;
                        break;
                    }
                }
            }
        }

        for(let k = 0;k<roots.length;k++) {

            for(let l = 0;l<ntL.length;l++) {
                if(k!=l) {
                    for(let i = 0;i<ntL[k].tgL.length;i++) {
                        for(let j = 0;j<ntL[l].tgL.length;j++) {
                            if(JSON.parse(ntL[l].tgL[j])[4] == JSON.parse(ntL[k].tgL[i])[4] && !g[roots[k]].tpL.includes(g[roots[l]]) && !g[roots[l]].tpL.includes(g[roots[k]])) {
                                g[roots[k]].tpL.push(g[roots[l]]);

                                let d =`<p><b>${g[roots[k]].name}</b> shares topic <u>${JSON.parse(ntL[l].tgL[j])[4]}</u> with <b>${g[roots[l]].name}</b></p>`;

                                eList.push([g[roots[k]].name,g[roots[l]].name,`shares topic ${JSON.parse(ntL[l].tgL[j])[4]} with`, d]);
                                eList = eList;
                            }
                        }
                    }
                }
                
            }
        }
    }

    onMount(async () => {
        makeNodes();
        axios.get(url+"/"+uID+"/adj_list",{

        }).then(function (response) {
            if(response.data.tag_adjacency_list) {
                eList = JSON.parse(response.data.tag_adjacency_list);

                eList = eList;

                eList = eList.filter(n => n[0]!=n[1]);

                console.log(eList);
            }
            makeAllPreKnownEdges();
        });
    });


    let s = 6;

    import { onMount } from "svelte";
    import { draw } from "svelte/transition"
    import type { X } from "vitest/dist/types-0373403c"
    import { each } from "svelte/internal"

    let canvasElement: HTMLCanvasElement;


    export let uID:string;

    let selected:topic[];
    selected = [];

    let hovering: topic | null;
    hovering = null;

    let ctx:CanvasRenderingContext2D | null;
    ctx = null;

    let edgeRelation:string;

    let xC = 0;
    let yC = 0;


    function scaleup() {
        scale+=.1;
        if(ctx) {
            ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
            drawTopics(ctx);
        }
    }
    function scaledown() {
        scale-=.1;
        if(ctx) {
            ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
            drawTopics(ctx);
        }
    }

    function scaleupWheel() {
        scale+=.005;
        if(ctx) {
            ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
            drawTopics(ctx);
        }
    }
    function scaledownWheel() {
        scale-=.005;
        if(ctx) {
            ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
            drawTopics(ctx);
        }
    }



    onMount(() => {
        // get canvas context
        canvasElement.width = window.screen.availWidth;
        canvasElement.height = window.screen.availHeight*.9;
        ctx = canvasElement.getContext("2d")

        if(ctx) {
            initializePoints();
            ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
            drawTopics(ctx);
        }

        let drag = false;

        let isdragging = false;

        // canvasElement.onmousedown = function(ev: MouseEvent){
        //     drag = true;
        // };

        canvasElement.onmousemove = function(e) {

            // if(isdragging)
            //     drag = true;
            // else 
            //     drag = false;

            // console.log(drag)

            // if(!moveSelect && drag && ctx) {
            //     xC+=e.movementX;
            //     yC+=e.movementY;
            //     ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
            //     drawTopics(ctx);
            //     return;
            // }

            var x = e.clientX - canvasElement.getClientRects()[0].left - canvasElement.width/2;
            var y = e.clientY - canvasElement.getClientRects()[0].top - canvasElement.height/2;

            x = x/scale;
            y = y/scale;

            let p:point;
            p = [x,y];

            let chge = false;

            if(!moveSelect) {
                let done = false;
                for(let i = 0;i<g.length;i++){
                    let t = g[i].location;
                    let pr = g[i].root?.location;
                    if(t&&pr){
                        t = [pr[0]+t[0],pr[1]+t[1]];
                        if(dist(p,t)<g[i].size*s){
                            if(g[i].root) {
                                hovering = g[i];
                                chge = true;
                            } 
                            done = true;
                            break;
                        }
                    } 
                }
                if(!done)
                for(let i = 0;i<g.length;i++){
                    let t = g[i].location;
                    if(t) {
                        if(!g[i].root && dist(p,t)<g[i].size*s){
                            hovering = null;
                            chge = true;
                            break;
                        }
                    }
                }
            }
            else if(ctx) {
                canvasElement.style.cursor = "move"; 
                moveSelect.location = p;
                ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
                drawTopics(ctx);
                return;
            }

            if(chge && hovering)
                canvasElement.style.cursor = "pointer"; 
            else if(chge)
                canvasElement.style.cursor = "grab"; 
            else {
                canvasElement.style.cursor = "grab";
                hovering = null;
            }
        };

        let single = true;

        let moveSelect: topic | null;
        moveSelect = null;


        canvasElement.onclick = function(e) {


            var x = e.clientX - canvasElement.getClientRects()[0].left - canvasElement.width/2;
            var y = e.clientY - canvasElement.getClientRects()[0].top - canvasElement.height/2;

            x = x/scale;
            y = y/scale;


            let p:point;
            p = [x,y];

            let chge = false;

            single = true;

            setTimeout(()=>{
                if(single) {
                    let done = false;
                    if(!moveSelect)
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
                                    done = true;
                                    break;
                                }
                                selected.push(g[i]);
                                if(ctx){
                                    ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
                                    drawTopics(ctx);
                                }

                                selected = selected;
                                done = true;

                                break;
                            }
                        } 
                    
                    }
                    if(!done) {
                        selected = [];
                        if(ctx) {
                            ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
                            drawTopics(ctx);
                        }
                        
                        for(let i = 0;i<g.length;i++){
                            let t = g[i].location;
                            if(t && !g[i].root) {
                                if(dist(p,t)<g[i].size*s){
                                    if(!moveSelect){
                                        moveSelect = g[i];
                                        done = true;
                                        break;
                                    } else {
                                        moveSelect = null;
                                    }

                                    break;
                                }
                            }
                        }
                    }
                    
                    if(!done && moveSelect) {
                        moveSelect = null;
                    }
                }
                

                // if(selected.length==2 && ctx) {
                //     setTimeout(()=>addEdge(),100);
                // }
                
            }, 200);

        
        }


        canvasElement.ondblclick = function(e) {

            var x = e.clientX - canvasElement.getClientRects()[0].left - canvasElement.width/2;
            var y = e.clientY - canvasElement.getClientRects()[0].top - canvasElement.height/2;


            x = x/scale;
            y = y/scale;


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


        
        
    });

    function addEdge() {
                    
        if(selected.length<2)
            return;

        if(selected[0].tpL.includes(selected[1]) || selected[1].tpL.includes(selected[0])){
            selected = [];
            if(ctx) {
                ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
                drawTopics(ctx);
            }
            return;
        }

        if(selected[0].root && selected[1].root) {

            let d = "<b>"+selected[0].root.name+"</b>:<u>"+selected[0].name+"</u> " + edgeRelation + " <b>"+selected[1].root.name+"</b>:<u>"+selected[1].name+"</u>";
            eList.push([selected[0].root.name+":"+selected[0].name,selected[1].root.name+":"+selected[1].name,edgeRelation,d])
        }
        eList = eList;


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

                    selected[0].tpL = selected[0].tpL;
                    // selected[1].tpL.push(selected[0]);

                    // selected[1].tpL = selected[1].tpL;
                    selected = [];
                }
                
            }
            let fc = 30;
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

        console.log(eList);

        axios.post(url+"/"+uID+"/adj_list",{
            adj_list:JSON.stringify(eList)
        }).then(function (response) {
        });

    }

    function makeAllPreKnownEdges(){
        for(let i = 0;i<eList.length;i++) {
            console.log(eList[i][0]);
            if(eList[i][0].split(":").length==2) {

                let r1 = eList[i][0].split(":")[0];
                let n1 = eList[i][0].split(":")[1];


                let r2 = eList[i][1].split(":")[0];
                let n2 = eList[i][1].split(":")[1];

                let a:topic|null;
                let b:topic|null;

                a = null;
                b = null;

                for(let j = 0;j<g.length;j++) {
                    let rt = g[j].root;
                    if(rt) {
                        if(rt.name==r1 && g[j].name==n1) {
                            a = g[j];
                        }
                    }
                }

                for(let j = 0;j<g.length;j++) {
                    let rt = g[j].root;
                    if(rt) {
                        if(rt.name==r2 && g[j].name==n2) {
                            b = g[j];
                        }
                    }
                }

                if(a && b) {
                    console.log(a.name + " " + b.name);
                    let a1:topic;
                    a1 = a;
                    let b1:topic;
                    b1 = b;
                    setTimeout(()=>addEdgeFromKnown(a1,b1), 800*i);

                    
                }
            }
            
        }
    }

    function removeEdge(e:Edge){
            if(e[0].split(":").length==2) {

                let r1 = e[0].split(":")[0];
                let n1 = e[0].split(":")[1];


                let r2 = e[1].split(":")[0];
                let n2 = e[1].split(":")[1];

                let a:topic|null;
                let b:topic|null;

                a = null;
                b = null;

                for(let j = 0;j<g.length;j++) {
                    let rt = g[j].root;
                    if(rt) {
                        if(rt.name==r1 && g[j].name==n1) {
                            a = g[j];
                        }
                    }
                }

                for(let j = 0;j<g.length;j++) {
                    let rt = g[j].root;
                    if(rt) {
                        if(rt.name==r2 && g[j].name==n2) {
                            b = g[j];
                        }
                    }
                }

                if(a && b) {
                    let a1:topic;
                    a1 = a;
                    let b1:topic;
                    b1 = b;
                    
                    a1.tpL = a1.tpL.filter(n => n!=b1);
                    b1.tpL = b1.tpL.filter(n => n!=a1);

                    
                }
            }
    }

    function addEdgeFromKnown(g0:topic, g1:topic) {

        // if(g0.root && g1.root) {

        //     let d = "<b>"+g0.root.name+"</b>:<u>"+g0.name+"</u> " + edgeRelation + " <b>"+g1.root.name+"</b>:<u>"+g1.name+"</u>";
        //     eList.push([g0.root.name+":"+g0.name,g1.root.name+":"+g1.name,edgeRelation,d])
        // }
        // eList = eList;


        // animate the edge creation
        if(ctx) {
            function animateEdge(ctx: CanvasRenderingContext2D | null, a:number, fc:number, pa:point, pb:point) {

                if(ctx) {
                    ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
                    drawTopicsAnimateEdge(ctx,a,fc, pa, pb);
                }

                if(a<fc)
                    setTimeout(()=>requestAnimationFrame(()=>animateEdge(ctx,a+1,fc,pa,pb)), 1);
                else {
                    g0.tpL.push(g1);

                    g0.tpL = g0.tpL;
                    // g1.tpL.push(g0);

                    // g1.tpL = g1.tpL;
                }
                
            }
            let fc = 30;
            let pa:point;
            let pb:point;

            pa = [0,0];
            pb = [0,0];

            let rtl1 = g0.root?.location;
            let rtl2 = g1.root?.location;

            if(g0.location && rtl1)
                pa = [g0.location[0]+rtl1[0],g0.location[1]+rtl1[1]];
            if(g1.location && rtl2)
                pb = [g1.location[0]+rtl2[0],g1.location[1]+rtl2[1]];

            requestAnimationFrame(()=>animateEdge(canvasElement.getContext("2d"), 1, fc,pa,pb));

            
        }

    }


    function dist(p1:point, p2:point) {
        return Math.sqrt(Math.pow(p2[0]-p1[0],2)+Math.pow(p2[1]-p1[1],2));
    }

    

    function drawTopics(ctx: CanvasRenderingContext2D){
        
        ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
        ctx.translate(canvasElement.width/2, canvasElement.height/2);

        ctx.translate(xC,yC);

        ctx.scale(scale,scale);


        for(let i = 0;i<g.length;i++) {
            if(g[i].root==null && g[i].tpL.length!=0) {
                let p = g[i].location;
                if(p) {
                    p = [p[0], p[1]];
                    for(let j = 0;j<g[i].tpL.length;j++) {
                        if(g[i].tpL[j]) {
                            let p1 = g[i].tpL[j].location;
                            if(p1){

                                p1 = [p1[0], p1[1]];

                                let r = 50;

                                let angle = anglebtw(p,p1);


                                //let c1 = [0.2*(p1[0]-p[0])+p[0] - Math.cos(angle+Math.PI/2)*r,0.2*(p1[1]-p[1])+p[1] - Math.sin(angle+Math.PI/2)*r];
                                //let c2 = [0.8*(p1[0]-p[0])+p[0] + Math.cos(angle+Math.PI/2)*r,0.8*(p1[1]-p[1])+p[1] + Math.sin(angle+Math.PI/2)*r];

                                ctx.beginPath();
                                ctx.moveTo(...p);
                                ctx.lineTo(p1[0],p1[1]);

                                ctx.lineWidth = 30;
                                ctx.strokeStyle = 'rgba(100,100,100,.2)';
                                
                                ctx.stroke();
                            }
                        }
                        ctx.moveTo(...p);
                    }
                }
            }
        }

        for(let i = 0;i<g.length;i++) {

            if(g[i]!=null && !g[i].root) {
                g[i].location;

                let num = g[i]?.size;
                let p = g[i]?.location;

                if(p) {
                    ctx.beginPath();
                    ctx.ellipse(p[0],p[1],(num)*s,(num)*s, 0,0,2*Math.PI);
                    ctx.closePath();

                    ctx.fillStyle = "rgb(179, 200, 200)";
                    ctx.fill();

                    var gradient = ctx.createRadialGradient(p[0],p[1], num*s-2, p[0],p[1], num*s);
                    if(g[i].color) {
                        let c = g[i].color;
                        if(c)
                            gradient.addColorStop(0, c);
                    } else {
                        g[i].color = `hsla(
                                    ${Math.random()*(360)},
                                    ${100}%,
                                    ${75}%, 0.1)`;
                        let c = g[i].color;
                        if(c)
                            gradient.addColorStop(0, c); 
                    }
                                
                    gradient.addColorStop(1, 'black');

                    ctx.fillStyle = gradient;

                    
                    ctx.fill();

                    ctx.fillStyle = 'black';
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
            if(g[i]!=null && g[i].tpL.length!=0) {
                let p = g[i].location;
                let pr = g[i].root?.location;
                if(p && pr) {
                    p = [pr[0]+p[0], pr[1]+p[1]];
                    for(let j = 0;j<g[i].tpL.length;j++) {
                        if(g[i].tpL[j]) {
                            let p1 = g[i].tpL[j].location;
                            let pr1 = g[i].tpL[j].root?.location;
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
                                ctx.strokeStyle = 'rgba(0,0,0,.4)';
                                
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

                        if(selected.includes(g[i])) {
                            ctx.lineWidth = 5;
                            ctx.strokeStyle = 'rgb(100,100,100,.8)';
                            ctx.stroke();
                        }

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


        ctx.scale(1/scale,1/scale);

        ctx.translate(-xC,-yC);

        ctx.translate(-canvasElement.width/2, -canvasElement.height/2);
    }

    function drawTopicsAnimateEdge(ctx: CanvasRenderingContext2D, a:number, fc:number, pa:point, pb:point){
        
        ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
        ctx.translate(canvasElement.width/2, canvasElement.height/2);

        ctx.translate(xC,yC);

        ctx.scale(scale,scale);

        for(let i = 0;i<g.length;i++) {
            if(g[i].root==null && g[i].tpL.length!=0) {
                let p = g[i].location;
                if(p) {
                    p = [p[0], p[1]];
                    for(let j = 0;j<g[i].tpL.length;j++) {
                        if(g[i].tpL[j]) {
                            let p1 = g[i].tpL[j].location;
                            if(p1){

                                p1 = [p1[0], p1[1]];

                                let r = 50;

                                let angle = anglebtw(p,p1);


                                //let c1 = [0.2*(p1[0]-p[0])+p[0] - Math.cos(angle+Math.PI/2)*r,0.2*(p1[1]-p[1])+p[1] - Math.sin(angle+Math.PI/2)*r];
                                //let c2 = [0.8*(p1[0]-p[0])+p[0] + Math.cos(angle+Math.PI/2)*r,0.8*(p1[1]-p[1])+p[1] + Math.sin(angle+Math.PI/2)*r];

                                ctx.beginPath();
                                ctx.moveTo(...p);
                                ctx.lineTo(p1[0],p1[1]);

                                ctx.lineWidth = 30;
                                ctx.strokeStyle = 'rgba(100,100,100,.2)';
                                
                                ctx.stroke();
                            }
                        }
                        ctx.moveTo(...p);
                    }
                }
            }
        }

        for(let i = 0;i<g.length;i++) {

            if(g[i]!=null && !g[i].root) {
                g[i].location;

                let num = g[i]?.size;
                let p = g[i]?.location;

                if(p) {
                    ctx.beginPath();
                    ctx.ellipse(p[0],p[1],(num)*s,(num)*s, 0,0,2*Math.PI);
                    ctx.closePath();


                    ctx.fillStyle = "rgb(179, 200, 200)";
                    ctx.fill();

                    var gradient = ctx.createRadialGradient(p[0],p[1], num*s-2, p[0],p[1], num*s);
                    if(g[i].color) {
                        let c = g[i].color;
                        if(c)
                            gradient.addColorStop(0, c);
                    } else {
                        g[i].color = `hsla(
                                    ${Math.random()*(360)},
                                    ${100}%,
                                    ${75}%, 0.1)`;
                        let c = g[i].color;
                        if(c)
                            gradient.addColorStop(0, c); 
                    }
                                
                    gradient.addColorStop(1, 'black');

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

                    ctx.fillStyle = 'black';
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
                            let pr1 = g[i].tpL[j].root?.location;
                            if(p1 && pr1){

                                p1 = [pr1[0]+p1[0], pr1[1]+p1[1]];

                                let r = 50;

                                let angle = anglebtw(p,p1);

                                ctx.beginPath();
                                ctx.moveTo(...p);
                                ctx.lineTo(p1[0],p1[1]);

                                ctx.lineWidth = 5;
                                ctx.strokeStyle = 'rgba(0,0,0,.4)';
                                
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

        let coef = 1*Math.sin(Math.PI/2+Math.PI/2*(a/fc));

        let c1 = [0.4*(pb[0]-pa[0])+pa[0] - coef*Math.cos(angle+Math.PI/2)*r,0.4*(pb[1]-pa[1])+pa[1] - coef*Math.sin(angle+Math.PI/2)*r];
        let c2 = [0.9*(pb[0]-pa[0])+pa[0] + coef*Math.cos(angle+Math.PI/2)*r,0.9*(pb[1]-pa[1])+pa[1] + coef*Math.sin(angle+Math.PI/2)*r];

        ctx.beginPath();
        ctx.moveTo(...pa);
        ctx.bezierCurveTo(c1[0],c1[1],c2[0],c2[1],pb[0],pb[1]);

        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0,.4)';
        
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


        ctx.scale(1/scale,1/scale);


        ctx.translate(-xC,-yC);

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

                for(let k = 1;k<20;k++) {
                    let done = false;
                    let m = 2*Math.PI*Math.random();
                    for(let j = m;j<2*Math.PI+m;j+=Math.PI/3+Math.random()) {
                        for(let l = 0;l<rts.length;l++)
                        {
                            console.log(rts.length);
                            let rtl = rts[l].location;
                            if(rtl)
                            if(((dist(rtl,p)<(rts[l].size+g[i].size+10)*s))) {
                                p = [rr/10*k*Math.cos(j), -rr/20*k*Math.sin(j)];
                                done = false;
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

    let back = createEventDispatcher<{back:void}>();

    function backToLanding() {
        back("back");
    }

    let tpCache: TouchEvent[];

    tpCache = [];

    window.onwheel = function(e:WheelEvent) {
        if(e.deltaY>0) {
            for(let i = 0;i<10;i++)
                scaleupWheel();
        } else {
            for(let i = 0;i<10;i++)
                scaledownWheel();
        }
    };

    function deleteEdge(e: Edge){
        eList = eList.filter(n => n!=e);

        axios.post(url+"/"+uID+"/adj_list",{
            adj_list:JSON.stringify(eList)
        }).then(function (response) {
            removeEdge(e);
            if(ctx) {
                ctx.clearRect(0,0,canvasElement.width,canvasElement.height);
                drawTopics(ctx);
            }
        });
    }




</script>

<div class="container">
    <div class="grid">

    </div>
    <div class="graphNodes">
        <canvas bind:this={canvasElement} width="1000" height="700">

        </canvas>
        <div class="side">
            {#if selected.length==0 && hovering==null}
                <div class="selectionM">
                    Click on two nodes to make a connection!
                </div>
            {/if}
            {#if selected.length==1}
                <div class="selection1">
                    {selected[0].name}
                </div>
            {/if}
            {#if selected.length==2}
                <div class="selection1">
                    <div class="title">
                        {selected[0].name}
                    </div>
                    
                </div>
                <div class="selection2">
                    <div class="title">
                        {selected[1].name}
                    </div>
                </div>
                <div class="relation" contenteditable="true" bind:textContent={edgeRelation}>
                    is the same as 
                </div>
                
            {/if}
            
        </div>

        {#if selected.length==2}
            <button on:click={addEdge} class="connect">
                Connect
            </button>
        {/if}
        {#if hovering!=null && selected.length!=2}
            <div class="selectionM" style="background-color:transparent; color:whitesmoke">
                {hovering.name}
            </div>
        {/if}

        <div class="showEdges">
            <div class="edgesTitle">
                Edges
            </div>
            <div style="width:15vw;display:flex;flex-direction:column;align-items:left; justify-content:space-around;">
            {#each eList as e}
            <div style="width:20vw;display:flex;flex-direction:row;align-items:center; justify-content:left;">
                <button class="delete" on:click={()=>deleteEdge(e)}>
                    X
                </button>
                <div class="edges">
                    {@html e[3]}
                </div>
            </div>
            {/each}
            </div>
        </div>

            <button on:click={backToLanding} class="landing">
                <div class="icon">
                    <MdHome></MdHome>
                </div>
            </button>

        <!-- <div class="scaleup">
            <button on:click={scaleup}>+</button>
        </div>
        <div class="scaledown">
            <button on:click={scaledown}>-</button>
        </div> -->
    </div>
        
    
</div>


<style> 

.delete{
    background-color: transparent;
    color: brown;
    border:none;
    width:1.1em;
    height: 1.1em;
    font-size: .8em;

    padding: 0;
    margin: 0;

    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.grid{

    position: absolute;
    top:0;
    left:0;

    width: 100%;
    height: 100%;

    z-index: 1;

    background-image: url("assets/Locator_Grid.png");


    opacity: 20%;

    filter: grayscale(100%);
}

.icon {
        color: whitesmoke;
        width: 32px;
        height: 32px;
    }
.container{
    height: fit-content;

    /* background-color: white; */

    border-radius: 5px;



    background-color: white;

    padding-top: 10vh;
    padding-bottom: 10vh;
    



    

    /* margin-top: 5em; */
}

.graphNodes{

    position: absolute;
    top:0;
    left:0;

    width: 100%;
    height: 100%;

    z-index: 2;

}
.selection1{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-size: 2em;

    position: absolute;
    top: 5vh;
    left: 10vw;

    width: 30vw;
    height: 10vh;

    color: whitesmoke;

    background-color: transparent;
}
.selectionM{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-size: 2em;

    position: absolute;
    top: 5vh;
    left: 20vw;

    width: 60vw;
    height: 10vh;

    color: whitesmoke;

    background-color: transparent;
}
.selection2{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-size: 2em;

    position: absolute;
    top: 5vh;
    right: 10vw;

    width: 30vw;
    height: 10vh;

    color: whitesmoke;

    background-color: transparent;
}
.connect{
    position: absolute;
    bottom: 10vh;
    left:45vw;

    max-width: 60vw;
    min-width: 10vw;

    background-color: #242424;


    color: whitesmoke;

    font-size: 2em;
}

.landing{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;


    background-color: #242424;
    z-index: 2;
    position: absolute;
    top: 0vh;
    left:0vw;

    font-size: 2em;

    border: none;
}

.landing:hover{
    border: none;
}

.scaleup{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;


    background-color: transparent;
    z-index: 2;
    position: absolute;
    bottom: 5vh;
    right:10vw;

    font-size: 2em;
}
.scaledown{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;


    background-color: transparent;
    z-index: 2;
    position: absolute;
    bottom: 5vh;
    right:5vw;

    font-size: 2em;
}

.relation{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


    background-color: transparent;
    z-index: 2;
    position: absolute;

    top: 5vh;
    right: 35vw;

    width: 30vw;
    height: 10vh;


    color: whitesmoke;

    font-size: 1.5em;
}

.relation:focus{
    outline: none;
}

.edges {
    padding-top: 10px;
    color: #242424;
    font-size: .8em;
    padding-left: 20px;
}

.showEdges{
    position: fixed;
    left:0vw;
    top:205px;

    width:20vw;
    margin-left: 10px;
    margin-right: 10px;

    color:rgba(100, 100, 100, 1);

    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: left;

    font-size: 1.5em;

    z-index: 0;

    overflow-y: scroll;
}

.edgesTitle{
    font-size: 2em;
    color: rgba(50, 50, 50, 1);

    border-bottom: 2px solid rgb(100,100,100);
}

.side{
    background-color: #242424;
    width: 100vw;
    height:200px;

    position: absolute;
    top: 0;

    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
</style>
