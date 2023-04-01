<script lang="ts" context="module">
    export type note = {
      id: string;
      name: string;
      category: string;
      ops: string | null;
      tgL: string[];
  };
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import Quill from "quill";
    import Delta from "quill";
	import { afterUpdate } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    import FaHashtag from '../../node_modules/svelte-icons/fa/FaHashtag.svelte';
    import GoGitCommit from 'svelte-icons/go/GoGitCommit.svelte';
    import FaRegSave from 'svelte-icons/fa/FaRegSave.svelte'

    export let focusNote: note;

    let dispatch = createEventDispatcher<{graph:void}>();

    export let uID: string;

    let noteId: string;
    noteId = "";

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

        quill.on('selection-change', function(range, oldRange, source) {
            if (range) {
                if (range.length == 0) {
                console.log('User cursor is on', range.index);
                } else {
                    var text = quill.getText(range.index, range.length);
                    console.log(text);
                }
            } else {
                console.log('Cursor not in the editor');
            }
        });

        for(let i = 0;i<6;i++) {
            let pt: Point;
            pt = [Math.random()*pxW, Math.random()*pxH];
            pts.push(pt);
        }


        if(focusNote.ops)
            loadText(focusNote.ops);

    });

    afterUpdate(async () => {
        if(focusNote.ops!=null && noteId != focusNote.id) {
            console.log("updating display contents");
            loadText(focusNote.ops);
            noteId = focusNote.id;
            title = focusNote.name;
            hardSave();
        } else if(focusNote.ops==null && noteId != focusNote.id) {
            console.log("updating display contents to nothing");
            quill.setText("");
            noteId = focusNote.id;
            title = focusNote.name;
            hardSave();
        }
        if(focusNote.name!=title) {
            focusNote.name = title;
            hardSave();
        }

    });

    
    let tagList: string[];
    tagList = [];

    let chngCount = 0;

    tagList = [];

    import axios from 'axios';
  
    const url = "https://api.synapsenote.com/api/users";
    const url1 = "https://api.synapsenote.com/api/notes";

    async function hardSave() {
        chngCount = 0;


        // check if not there
        if(focusNote.id!="") {
            await axios.put(url1+'/content/'+focusNote.id, {
                content: focusNote.ops
            }).then(function (){
                console.log('creating note');
            }).catch(function (error){
                console.log(error);
            });

            await axios.put(url1+'/title/'+focusNote.id, {
                title: focusNote.name
            }).then(function (){
                console.log('creating note');
            }).catch(function (error){
                console.log(error);
            });
        }


        let splt = focusNote.ops?.split(/#/);
        tagList = [];

        if(splt && splt.length>1){
            for(let i = 1;i<splt.length;i+=2) {
                tagList.push(splt[i]);
            }

            console.log(tagList);
            focusNote.tgL = tagList;
        }
        
    }

    function saveText() {
        focusNote.ops = JSON.stringify(quill.getContents().ops);


        chngCount++;

        if(chngCount>10)
            hardSave();

    }

    function loadText(ops:string) {
        let d1 = quill.getContents();
        d1.ops = JSON.parse(ops);
        quill.setContents(d1);
    }


    function gotoGraph() {
        dispatch('graph');
    }


    
    
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
        <button class="ql-save" on:click={hardSave}><FaRegSave/></button>
        <button class="ql-graph" on:click={gotoGraph}><GoGitCommit /></button>
        
        <!-- <button class="ql-image"></button> -->
        <!-- <button class="ql-video"></button> -->
    </div>

    
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