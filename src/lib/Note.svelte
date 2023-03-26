<script lang="ts" context="module">
    export type note = {
        id: number;
        name: string;
        category: string;
        delta: Delta | null;
        tgL: string[];
    };
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import Quill from "quill";
    import type Delta from "../../node_modules/@types/quill/node_modules/quill-delta";
	import { afterUpdate } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    import FaHashtag from '../../node_modules/svelte-icons/fa/FaHashtag.svelte';
    import GoGitCommit from 'svelte-icons/go/GoGitCommit.svelte';

    export let focusNote: note;

    let dispatch = createEventDispatcher<{graph:void}>();

    let noteId: number;
    noteId = 0;

    let pg1 : HTMLElement;

    let quill: Quill;

    let title: string;
    title = '';

    let canvas: HTMLCanvasElement;

    type Point = [number, number];

    let pts: Point[];

    pts = [];

    let pxW: number;
    let pxH: number;
    pxW = 500;
    pxH = 375;

    let ptsVis = false;

      
    onMount(async () => {
        quill = new Quill(pg1, {
            modules: {
            toolbar: '#toolbar'
            },
            theme: "snow",
            placeholder: ""
        });

        noteId = focusNote.id;
        title = focusNote.name;

        quill.on('text-change', function(delta, oldDelta, source) {
            if (source == 'api') {
                console.log("An API call triggered this change.");
            } else if (source == 'user') {
                console.log("A user action triggered this change.");
            }

            saveText();

        });

        for(let i = 0;i<6;i++) {
            let pt: Point;
            pt = [Math.random()*pxW, Math.random()*pxH];
            pts.push(pt);
        }

		//requestAnimationFrame(draw);

    });

    // function draw() {
    //     const ctx = canvas.getContext('2d');
    //     if(ctx!=null) {
    //         ctx.clearRect(0,0,pxW,pxH);
    //         curves(ctx);

    //         if(ptsVis)
    //         for(let i = 0;i<pts.length;i++) {
    //             ctx.beginPath();
    //             ctx.arc(pts[i][0], pts[i][1], 4, 0, 2 * Math.PI, false);
    //             if(i%2==1)
    //                 ctx.fillStyle = 'blue';
    //             else 
    //                 ctx.fillStyle = 'red';
    //             ctx.fill();
    //             ctx.lineWidth = 1;
    //             ctx.strokeStyle = '#000000';
    //             ctx.stroke();
    //         }
    //     }
        
    // }

    afterUpdate(async () => {
        if(focusNote.delta!=null && noteId != focusNote.id) {
            console.log("updating display contents");
            quill.setContents(focusNote.delta);
            noteId = focusNote.id;
            title = focusNote.name;
        } else if(focusNote.delta==null && noteId != focusNote.id) {
            console.log("updating display contents to nothing");
            quill.setText("");
            noteId = focusNote.id;
            title = focusNote.name;
        }
        if(focusNote.name!=title)
            focusNote.name = title;

    });

    // let controlPt: number | null;
    // controlPt = null;

    // let grabbed = false;
    
    // function controlPoint(event: MouseEvent) {

        
    //     var x = event.clientX - canvas.getClientRects()[0].left;
    //     var y = event.clientY - canvas.getClientRects()[0].top;

    //     x = pxW/canvas.clientWidth*x;
    //     y = pxH/canvas.clientHeight*y;

    //     let visTog = true;

    //     if(controlPt==null) {
    //         for(let i = 0;i<pts.length;i++) {
    //             if(dist(pts[i], x, y) < 100) {
    //                 controlPt = i;
    //             }

    //             if(dist(pts[i], x, y) < 1000) {
    //                 if(!ptsVis)
    //                     ptsVis = true;
    //                 visTog = false;
	// 	            requestAnimationFrame(draw);
    //                 return;
    //             }
    //         }
    //     } else {
    //         controlPt = null;
    //         visTog = false;
    //     }

    //     if(visTog) {
    //         ptsVis = false;
	// 	    requestAnimationFrame(draw);
    //     }

    // }

    // function grabObj(event: MouseEvent) {

    //     grabbed = !grabbed;

    // }

    // function movePoint(event: MouseEvent) {
    //     if(grabbed) {
    //         for(let i = 0;i<pts.length;i++) {
    //             var x = event.clientX - canvas.getClientRects()[0].left;
    //             var y = event.clientY - canvas.getClientRects()[0].top;

    //             x = pxW/canvas.clientWidth*event.movementX;
    //             y = pxH/canvas.clientHeight*event.movementY;

    //             pts[i][0] += x;
    //             pts[i][1] += y;
    //         }
	// 	    requestAnimationFrame(draw);
    //     }else if(controlPt!=null) {
    //         var x = event.clientX - canvas.getClientRects()[0].left;
    //         var y = event.clientY - canvas.getClientRects()[0].top;

    //         x = pxW/canvas.clientWidth*x;
    //         y = pxH/canvas.clientHeight*y;

    //         pts[controlPt][0] = x;
    //         pts[controlPt][1] = y;
	// 	    requestAnimationFrame(draw);
    //     } 

    // }

    // function curves(ctx: CanvasRenderingContext2D) {
    //     ctx.beginPath();
    //     ctx.lineWidth = 1;
    //     ctx.strokeStyle = '#000000';
    //     let l = pts.length;
    //     ctx.moveTo(pts[0][0], pts[0][1]);
    //     let i = 0;
    //     for(;i<pts.length;i+=2) {
    //         ctx.quadraticCurveTo(pts[(i+1)%l][0],pts[(i+1)%l][1],pts[(i+2)%l][0],pts[(i+2)%l][1]);
    //     }
    //     ctx.quadraticCurveTo(pts[(i+1)%l][0],pts[(i+1)%l][1],pts[(i+2)%l][0],pts[(i+2)%l][1]);
    //     ctx.moveTo(pts[0][0], pts[0][1]);
    //     ctx.closePath();

    //     ctx.fillStyle = 'gray';
    //     ctx.fill('nonzero');
    //     ctx.stroke();
    // }


    // function dist(pt: Point, mx:number, my:number) {
    //     return Math.pow(pt[0]-mx,2) + Math.pow(pt[1]-my,2);
    // }
    let tagList: string[];
    tagList = [];
    let tagString = '';

    function saveText() {
        focusNote.delta = quill.getContents();
    }

    function makeTag() {
        tag = !tag;
    }

    function gotoGraph() {
        dispatch('graph');
    }

    function storeTag() {
        if(tagString!='' && !tagList.includes(tagString)) {
            tagList.push(tagString);
            focusNote.tgL.push(tagString);
        }
        tagString = '';

    }
    let tag = false;
    
    
</script>


<div class="container" id="pages">
    <h1 class="title" contenteditable="true" bind:textContent={title}>
        {title}
    </h1>
    
    <div id="toolbar">
        <select class="ql-size">
            <option value="small"></option>
            <option selected></option>
            <option value="large"></option>
            <option value="huge"></option>
        </select>
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <select class="ql-color"></select>
        <select class="ql-background"></select>
        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>
        <button on:click={makeTag}><FaHashtag /></button>
        <button on:click={gotoGraph}><GoGitCommit /></button>
        
        <!-- <button class="ql-image"></button> -->
        <!-- <button class="ql-video"></button> -->
    </div>
    {#if tag}
        <input type="text" class="taggen" bind:value={tagString}>
        <button class="taggen" on:click={storeTag}>Enter</button>
    {/if}
    <div class="page" id="first" style="margin-top:5vh;" bind:this={pg1}>

    </div>


</div>



<style>
    @import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';

    /* #applet{
        min-width: 40vw;
        min-height: 30vw;


        max-width: 40vw;
        max-height: 30vw;

        padding: 0px;
    } */

    .taggen{
        position: absolute;
        top: 50em;
        left: 5em;
    }

    .title{
        color: rgb(100,100,100);
    }

    #toolbar{
        border-color: rgb(100,100,100);
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .container{
        min-width: 100vw;
        min-height: fit-content;

        background-color: rgb(179, 200, 200);

        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        padding-top:10vh;
    }

    .page{
        background-color: white;
        min-width: 60vw;
        max-width: 60vw;
        min-height: 100vw;

        color: black;

        padding-left: 5em;
        padding-right: 5em;
        padding-top: 7.5em;
        padding-bottom: 7.5em;

        z-index: 0;

        margin-bottom: 5vh;
        box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    }
</style>