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
    import Quill, { RangeStatic } from "quill";
    import Delta from "quill";
	import { afterUpdate } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    import FaHashtag from '../../node_modules/svelte-icons/fa/FaHashtag.svelte';
    import GoGitCommit from 'svelte-icons/go/GoGitCommit.svelte';
    import FaRegSave from 'svelte-icons/fa/FaRegSave.svelte'
    import TiTag from 'svelte-icons/ti/TiTag.svelte'
    import TiTrash from 'svelte-icons/ti/TiTrash.svelte'


    export let focusNote: note;

    let dispatch = createEventDispatcher<{graph:void}>();

    export let uID: string;

    export let noteList: note[];

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

    var Size = Quill.import('attributors/style/size');
    Size.whitelist = ['14px', '22px', '30px'];
    Quill.register(Size, true);

    var ind = 0;

    type tagHeader = number;

    let headers: tagHeader[];
    headers = [];

    let seq = false;

    type tagrange = [index:number, length:number, top:number, height:number, name:string, selected:boolean, id:string];


    let activeRanges : tagrange[];
    activeRanges = [];



    var Embed = Quill.import('blots/block/embed');
    class Hr extends Embed {
        static create(value:any) {
            let node = super.create(value);
            // give it some margin
            node.setAttribute('style', 'background-color:black;height:0px; margin-top:10px; margin-bottom:10px;');
            return node;
        }
    }

    var customHrHandler = function(){
        // get the position of the cursor
        var range = quill.getSelection();
        if (range && range.length!=0) {
            var bounds = quill.getBounds(range.index, range.length);

            activeRanges.push([range.index,range.length,bounds.top,bounds.height,"tag #"+(activeRanges.length+1),true,""+(activeRanges.length+1)]);
            console.log(range.index+" "+range.length);
            activeRanges = activeRanges;

            tagList.push("tag #"+(activeRanges.length));
        }
    }

    Hr.blotName = 'hr'; //now you can use .ql-hr classname in your toolbar
    Hr.className = 'my-hr';
    Hr.tagName = 'hr';

    Quill.register({
        'formats/hr': Hr
    });


    var tagging = false;

    var decreasing = false;




      
    onMount(async () => {
        quill = new Quill(pg1, {
            modules: {
            toolbar: {container:'#toolbar',
            handlers: {
                'hr': customHrHandler
            }
            }
            },
            theme: "snow",
            placeholder: ""
        });

        noteId = focusNote.id;
        title = focusNote.name;

        quill.on('text-change', function(delta, oldDelta, source) {

            clearTagDisplay();

            if (source == 'api') {
                quill.update();
                var cur = quill.getSelection();
                console.log(cur?.index)

                if(cur)
                    quill.setSelection(cur.index,0);
            } else if (source == 'user') {
                var curPos = quill.getSelection();

                delta = quill.getContents();

                let dff = oldDelta.diff(delta);
                console.log(dff);

                let cL = dff.changeLength();
                if(cL<=0){
                    decreasing = true;
                } else {
                    decreasing = false;
                }

                var actcur = 0;
                if(curPos && !decreasing)
                    actcur =  curPos.index-1;
                else if(curPos)
                    actcur =  curPos.index+1;

                let removeRanges : tagrange[];
                removeRanges = [];

                if(curPos && (quill.getText(curPos.index-1,1) != "#" || quill.getText(curPos.index-2,1) == "\\"))
                for(let i = 0;i<activeRanges.length;i++) {
                    if(!tagging && actcur<(activeRanges[i][0]+activeRanges[i][1])) {

                        
                        
                        if(decreasing && actcur>=activeRanges[i][0])
                            activeRanges[i][1] -= 1;
                        else if(actcur>=activeRanges[i][0])
                            activeRanges[i][1] += 1;

                        if(actcur<activeRanges[i][0]) {
                            if(decreasing)
                                activeRanges[i][0] -= 1;
                            else
                                activeRanges[i][0] += 1;
                        }

                        let b = quill.getBounds(activeRanges[i][0],activeRanges[i][1]+1);

                        activeRanges[i][2] = b.top;
                        activeRanges[i][3] = b.height;

                    } else if(tagging && actcur<activeRanges[i][0]+activeRanges[i][1]) {

                        

                        if(decreasing && actcur>=activeRanges[i][0])
                            activeRanges[i][1] -= 1;
                        else if(actcur>=activeRanges[i][0])
                            activeRanges[i][1] += 1;
                        if(actcur<activeRanges[i][0]) {
                            if(decreasing)
                                activeRanges[i][0] -= 1;
                            else
                                activeRanges[i][0] += 1;
                        }

                        let b = quill.getBounds(activeRanges[i][0],activeRanges[i][1]);

                        activeRanges[i][2] = b.top;
                        activeRanges[i][3] = b.height;
                    }

                    console.log(decreasing + " "+ activeRanges[i][1] + " " + activeRanges[i][0] + " " + actcur);
                    if(activeRanges[i][1]<=0) {
                        removeRanges.push(activeRanges[i])
                        console.log(activeRanges[i][0] + " " + activeRanges[i][1]);
                        tagging = false;
                    }
                }

                for(let j = 0;j<removeRanges.length;j++){
                    activeRanges = activeRanges.filter(n => n[0]!=removeRanges[j][0] && n[1]!=removeRanges[j][1]);
                }



                activeRanges = activeRanges;


                if(curPos && quill.getText(curPos.index-1,1) === "#" && quill.getText(curPos.index-2,1) != "\\") {
                    if(tagging) {

                        quill.deleteText(curPos.index-1,1);

                        // if(ind<Size.whitelist.length-1)
                        //     ind += 1;

                        // quill.format('size',Size.whitelist[ind])

                        quill.insertText(curPos.index-1,"\n","api");

                        tagging = false;

                    } else {
                        seq = true;

                        tagging = true;

                        quill.deleteText(curPos.index-1,1);

                        quill.insertText(curPos.index-1, "\n");

                        quill.format('size',Size.whitelist[Size.whitelist.length-1]);

                        quill.update();

                        ind = Size.whitelist.length-1;

                        var bounds = quill.getBounds(curPos.index-1, 1);

                        activeRanges.push([curPos.index,1,bounds.top,bounds.height+60,"tag #"+(activeRanges.length+1),true,""+(activeRanges.length+1)]);


                        console.log(curPos.index + " ");

                    }
                    

                } else if(curPos && quill.getText(curPos.index-1,1) === "#" && quill.getText(curPos.index-2,1) == "\\"){

                    quill.deleteText(curPos.index-2,1,'api');
                } 
                
            } else if(source=='silent'){

                

            }

            saveText();

        });



        quill.on('selection-change', function(range, oldRange, source) {
            if (range) {
                if (range.length == 0) {

                    console.log('User cursor is on', range.index);
                } else {
                    var text = quill.getText(range.index, range.length);

                    var bounds = quill.getBounds(range.index, range.length);

                    console.log(text);
                    console.log(bounds);
                }
            } else {
                console.log('Cursor not in the editor');
            }
        });
        pg1.onclick = function(e:MouseEvent){
            clearTagDisplay();
            quill.focus();
        };
        pg1.onmouseover = function(e:MouseEvent){
            pg1.style.cursor = "text";
        };

        pg1.onkeydown = function(e:KeyboardEvent){
            if(e.keyCode==13){
                if(ind>0)
                    ind -= 1;

                quill.format('size',Size.whitelist[ind]);
            }
        }

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
            noteId = noteId;
            title = focusNote.name;
            title = title;
            //hardSave();
        } else if(focusNote.ops==null && noteId != focusNote.id) {
            console.log("updating display contents to nothing");
            quill.setText("");
            noteId = focusNote.id;
            title = focusNote.name;
            //hardSave();
        }
        if(focusNote.name!=title) {
            focusNote.name = title;
            //hardSave();
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

        focusNote.tgL = [];

        for(let i = 0;i<activeRanges.length;i++){
            activeRanges[i][5] = false;
            focusNote.tgL.push(JSON.stringify(activeRanges[i]));
        }


        // check if not there
        if(focusNote.id!="") {
            await axios.put(url1+'/content/'+focusNote.id, {
                content: focusNote.ops
            }).then(function (){
            }).catch(function (error){
                console.log(error);
            });

            await axios.put(url1+'/title/'+focusNote.id, {
                title: focusNote.name
            }).then(function (){
            }).catch(function (error){
                console.log(error);
            });

            await axios.put(url1+'/tags/'+focusNote.id, {
                tags: focusNote.tgL
            }).then(function (){

                console.log("put the tag");
            }).catch(function (error){
                console.log(error);
            });
        }


        // let splt = focusNote.ops?.split(/#/);
        // tagList = [];

        // if(splt && splt.length>1){
        //     for(let i = 1;i<splt.length;i+=2) {
        //         tagList.push(splt[i]);
        //     }

        //     console.log(tagList);
        // }

        //focusNote.tgL = tagList;

        
        
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

        decreasing = false;
        tagging = false; 

        tagName = null;
        subNoteList = [];

        activeRanges = [];

        for(let i = 0;i<focusNote.tgL.length;i++){
            activeRanges.push(JSON.parse(focusNote.tgL[i]));
        }

        activeRanges = activeRanges;
    }

    function loadTextandZoom(ops:string, tgn:string) {
        let d1 = quill.getContents();
        d1.ops = JSON.parse(ops);
        quill.setContents(d1);

        decreasing = false;
        tagging = false; 

        tagName = tgn;
        subNoteList = [];

        activeRanges = [];

        for(let i = 0;i<focusNote.tgL.length;i++){
            activeRanges.push(JSON.parse(focusNote.tgL[i]));
        }

        activeRanges = activeRanges;

        if(tgn) {
            for(let j = 0;j<activeRanges.length;j++) {
                if(activeRanges[j][4]==tgn) {
                    zoomTo(activeRanges[j][2]+150);
                    break;
                }
            }
        }

        setFocusName(tgn);
    }


    function gotoGraph() {
        dispatch('graph');
    }

   


    let tagFocus = false;

    function zoomTo(i:number){
        window.scrollTo({
        top: i,
        behavior: "smooth",
        });
    }
    let tagName: string | null;
    tagName = null;

    let subNoteList: note[];
    subNoteList = [];

    function setFocusName(s:string|null){
        clearTagDisplay();
        tagName = s;

        if(tagName)
        {
            for(let i = 0;i<noteList.length;i++) {
                let n = noteList[i];
                if(n.id!=focusNote.id)
                    for(let j = 0;j<n.tgL.length;j++){
                        
                        if(tagName==JSON.parse(n.tgL[j])[4]){
                            subNoteList.push(noteList[i]);
                            break;
                        }
                    }
            }
        } else {
            subNoteList = [];
            tagFocus = false;
        }
    }

    function clearTagDisplay(){
        for(let i = 0;i<activeRanges.length;i++) {
            activeRanges[i][5] = false;
        }
    }

    function gotoReference(n:note, tgName:string|null){
        if(tgName) {
            hardSave();
            if(n.ops) {

                subNoteList = [];
                
                focusNote = n;
                loadTextandZoom(n.ops, tgName);
                noteId = n.id;
                noteId = noteId;
                title = n.name;
                title = title;
                //hardSave();

                

            }
            
        }
    }

    function deleteTag(id:string) {

        activeRanges = activeRanges.filter(n => n[6]!=id);
    }

    function init(el:HTMLDivElement){
        el.focus();
    }


    
    
</script>

<link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css">

<div class="container" id="pages">
    <h1 class="title" contenteditable="true" bind:textContent={title}>
        {title}
    </h1>
    
    <div id="toolbar">
        <!-- <select class="ql-size">
            <selected ></selected>
            <option value="14px">14px</option>
            <option value="22px">22px</option>
            <option value="30px">30px</option>
        </select> -->
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <select class="ql-color"></select>
        <select class="ql-background"></select>
        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>

        <div style="height:30px">

        </div>

        <button class="icon" on:click={customHrHandler}><TiTag/></button>
        <button class="icon" on:click={hardSave}><FaRegSave/></button>
        <button class="icon" on:click={gotoGraph}><GoGitCommit /></button>
    </div>

    <div class="pageandtags">
        <div class="page" id="first" bind:this={pg1} on:focus={()=>clearTagDisplay()}>

        </div>

        {#each activeRanges as rng}
            {#if rng[5]}
                <div class="tag2" style="position:absolute; top:{rng[2]+215}px; height:{rng[3]}px; width:20px;">

                </div>
            {/if}
            {#if !rng[5]}
                <div class="tag1" style="position:absolute; top:{rng[2]+215}px; height:{rng[3]}px; width:20px;">

                </div>
            {/if}
            
            {#if rng[5]}
                <div class="name" style="position:absolute; top:{rng[2]+215}px; height:{rng[3]}px; " bind:textContent={rng[4]} contenteditable="true" use:init>
                    {rng[4]}
                </div>
            {/if}


            
        {/each}

        {#if !tagFocus}
            <div class="showTags">
                <div class="tagsTitle">
                    Active Tags
                </div>
                <div style="width:15vw;display:flex;flex-direction:column;align-items:left; justify-content:space-around;">
                {#each activeRanges as rng}
                    <div style="width:20vw;display:flex;flex-direction:row;align-items:center; justify-content:left;">
                
                        <button class="delete" on:click={()=>deleteTag(rng[6])}>
                            X
                        </button>
                        <div class="activeName" tabindex="-1" on:focusin={()=>{clearTagDisplay();zoomTo(rng[2]+150);setFocusName(rng[4]);}} >
                            {rng[4]}
                        </div>
                    </div>
                {/each}
                </div>
            </div>
            <div class="tagNav">
                {#if tagName!=null}
                    {#if subNoteList.length!=0}
                        <div class="tagsTitleNav">
                            References
                        </div>
                        {#each subNoteList as refs}
                            <button class="activeRef" on:click={()=>{gotoReference(refs, tagName);clearTagDisplay();setFocusName(null);}}>
                                {refs.name}
                            </button>
                            
                        {/each}
                    {/if}
                {/if}
            </div>
            
            
        {/if}
    </div> 
    
    <div class="gpt">

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

    .pageandtags{
        width:fit-content;
        height: fit-content;
        display: flex;
        flex-direction: row;

        margin-top: 40px;
    }

    .icon {
        color: rgb(60,60,60);
        width: 32px;
        height: 32px;
    }

    .gpt{
        position: fixed;
        bottom: 1vh;
        right: 7vw;

        width: 10vw;
        height: 5em;

        background-color: beige;
    }

    .tag1{
        background-color: transparent;
        /* border-radius: 5px; */
        left: 21vw;
        width: 10px !important;

        border-left: 3px solid rgba(50,50,50,.3);
        border-top: 1px solid rgba(50,50,50,.3);
        border-bottom: 1px solid rgba(50,50,50,.3);


    }
    .tag2{
        border-left: 3px solid rgba(50,50,50,.8);
        border-top: 1px solid rgba(50,50,50,.8);
        border-bottom: 1px solid rgba(50,50,50,.8);
        background-color: transparent;

        left: 21vw;
        width: 10px !important;
    }

    .name:focus{
        border: none;
        outline: none;
    }


    .tag:hover{
        background-color: rgba(100, 100, 100, 1);
    }

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


    .showTags{
        position: fixed;
        right:0vw;
        top:205px;

        width:20vw;

        color:rgba(100, 100, 100, 1);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        font-size: 1.5em;

        z-index: 0;
    }

    .tagNav{
        position: fixed;
        right:0vw;
        bottom:25vh;

        width:20vw;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        font-size: 1.5em;

        z-index: 0;
    }

    .tagsTitle{
        font-size: 2em;
        color: rgba(50, 50, 50, 1);

        border-bottom: 2px solid rgb(100,100,100);
    }

    .tagsTitleNav{
        font-size: 2em;
        color: rgba(50, 50, 50, 1);

        border-bottom: 2px solid rgb(100,100,100);
    }
    .name{
        color: rgba(100, 100, 100, 1);
        font-size: 1.5em;
        left:11vw;

        width:fit-content;

        max-width:8vw;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .activeName{
        color: rgba(100, 100, 100, 1);
        font-size: 1vw;
        left:11vw;

        width:fit-content;

        max-width:8vw;

        display: flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        padding: 20px;
    }

    .activeRef{
        color: rgba(100, 100, 100, 1);
        font-size: .7em;
        left:11vw;
        font-style: normal;

        width:fit-content;

        max-width:8vw;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: transparent;
        border: none;


        cursor: pointer;
    }

    .activeName:focus{
        color: rgba(50, 50, 50, 1);
    }

    .trash-icon{
        color: rgba(100, 100, 100, .8);
        width: 32px;
        height: 32px;
        left:10vw;
    }


    .title{
        color: rgb(100,100,100);
    }

    #toolbar{
        border-color: rgb(100,100,100);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        position: fixed;
        top:240px;
        right:21vw;

        z-index: 1;

    }

    .container{
        min-width: 100vw;
        min-height: fit-content;

        background-color: rgb(179, 200, 200);

        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        padding-top:50px;
    }

    .page{
        background-color: white;
        min-width: 60vw;
        max-width: 60vw;
        min-height: 100vw;

        color: black;

        padding-left: 5em;
        padding-right: 5em;
        padding-top: 100px;
        padding-bottom: 100px;

        z-index: 0;

        margin-bottom: 5vh;
        box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    }
</style>