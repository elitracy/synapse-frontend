<!-- <Navbar noteList={noteList} /> -->




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
    import Navbar from "./Navbar.svelte"
    import IconButton from "@smui/icon-button";
    import Note from "./Note.svelte"
    import { createEventDispatcher } from 'svelte';
    import NoteCard from "./test/NoteCard.svelte";
    import axios from 'axios';

    import type Delta from "../../node_modules/@types/quill/node_modules/quill-delta";
    

    let displayNote = true;
    const dispatch1 = createEventDispatcher<{make:note}>();
    const dispatch2 = createEventDispatcher<{changeNoteList:note[]}>();

    export let uID: string;
    type notes = note[];

    export let noteList: notes;

    let focusNote: note;

    const url1 = "https://api.synapsenote.com/api/notes";
    const url = "https://api.synapsenote.com/api/users";

    async function createNote() {
        await axios.post(url1+'/', {
            content: "",
            userId: uID,
            title: "New Note",
            isPublic: true
        }).then(async function (response){
            await axios.get(url+'/'+uID+'/notes', {
      
            }).then(function (response){

            if(response.data){
                noteList = [];
                    for(let i = 0;i<response.data.length;i++) {

                        let splt = response.data[i].content?.split(/#/);
                        let tagList: string[];
                        tagList = [];
                        if(splt && splt.length>1){
                            for(let i = 1;i<splt.length;i+=2) {
                                tagList.push(splt[i]);
                            }
                        }
                        noteList.push({id: response.data[i].id, name:response.data[i].title, category:"general", ops:response.data[i].content, tgL:tagList});
                    }
                }
            }).catch(function (error){
            console.log(error);
            });
        }).catch(function (error){
            console.log(error);
        });
    }


    function toFocus1(message: CustomEvent<string>) {
        for (let index = 0; index < noteList.length; index++) {
            const element = noteList[index];
            if(element.id == message.detail) {
                focusNote = element;
            }
        }

        newNote();
    }

    function newList(message: CustomEvent<string>) {
        noteList = noteList.filter(n => n.id!=message.detail);

        dispatch2("changeNoteList",noteList);
    }

    function newNote() {
        dispatch1('make', focusNote);
        dispatch2("changeNoteList",noteList);
    }

</script>

<div class="container">
    <p style="font-size:4em">All Notes</p>
    <br>
    <br>
    <br>
    {#if noteList}
        {#each noteList as note}
            <div class="notecard"><NoteCard noteName={note.name} noteCategory={note.category} noteId={note.id} on:id={toFocus1} noteList={noteList} uID={uID} on:nts={newList}/></div>
        {/each}
    {/if}

    <div class="create">
        <button on:click={createNote}>Create Note</button>
    </div>
    
</div>


<!-- <link rel="stylesheet" href="src/bare.css"> -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/svelte-material-ui@6.0.0/bare.min.css"
/>
  <!-- <link rel="stylesheet" href="node_modules/svelte-material-ui/bare.css"> -->
  <!-- Material Icons -->
<link
rel="stylesheet"
href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
<!-- Roboto -->
<link
rel="stylesheet"
href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
/>
<!-- Roboto Mono -->
<link
rel="stylesheet"
href="https://fonts.googleapis.com/css?family=Roboto+Mono"
/>

<style> 
.container{
    height: fit-content;
    width:90%;
    margin: 3em;
    background-color: rgb(179, 200, 200);

    color: #242424;
}
p {
    margin-block-start: 0;
    margin-block-end: 0;
}
.notecard {
    width:20em;
    display:inline-block;
    padding:1em;
}

.create{
    position: fixed;
    bottom: 10vh;
    left: 10vw;

    font-size: 2em;
}

</style>
