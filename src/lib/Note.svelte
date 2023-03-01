<script lang="ts" context="module">
    export type note = {
        id: number;
        name: string;
        category: string;
        delta: Delta | null;
    };
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import Quill from "quill";
    import type Delta from "../../node_modules/@types/quill/node_modules/quill-delta";
	import { afterUpdate } from 'svelte';

    export let focusNote: note;

    let noteId: number;
    noteId = 1;

    let textcpy: string;

    let pg1 : HTMLElement;
    
      
      export let toolbarOptions = [
          [{ header: [1,2,3,4,5,6,false] }, "blockquote", "link", "image", "video"],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "ordered" }],
          [{ align: [] }],
          ["clean"],
      ];

    let quill: Quill;
      
    onMount(async () => {
        quill = new Quill(pg1, {
            modules: {
            toolbar: toolbarOptions
            },
            theme: "snow",
            placeholder: ""
        });

        noteId = focusNote.id;

        quill.on('text-change', function(delta, oldDelta, source) {
            if (source == 'api') {
                console.log("An API call triggered this change.");
            } else if (source == 'user') {
                console.log("A user action triggered this change.");
            }

            saveText();

        });

    });

    afterUpdate(async () => {
        if(focusNote.delta!=null && noteId != focusNote.id) {
            console.log("updating display contents");
            quill.setContents(focusNote.delta);
            noteId = focusNote.id;
        } else if(focusNote.delta==null && noteId != focusNote.id) {
            console.log("updating display contents to nothing");
            quill.setText("");
            noteId = focusNote.id;
        }
    });

    

    function saveText() {
        focusNote.delta = quill.getContents();
    }
    
</script>


<div class="container" id="pages">
    <h1>
        {focusNote.name}
    </h1>
    <div class="page" id="first" style="margin-top:5vh;" bind:this={pg1}>

    </div>

</div>



<style>
    @import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';

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