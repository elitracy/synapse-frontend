

<script lang="ts">
    import { onMount } from "svelte";
    import Quill from "quill";

    type note = {name:string, category:string, id:number};

    export let focusNote: note;

    let pg1 : HTMLElement;
    
      
      export let toolbarOptions = [
          [{ header: 1 }, { header: 2 }, "blockquote", "link", "image", "video"],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "ordered" }],
          [{ align: [] }],
          ["clean"]
      ];
      
    onMount(async () => {

        let quill1 = new Quill(pg1, {
            modules: {
            toolbar: toolbarOptions
            },
            theme: "snow",
            placeholder: ""
        });

    });
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