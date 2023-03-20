<Navbar noteList={noteList} />

<div class="container">
    <p style="font-size:4em">All Notes</p>
    <p style="font-size:1em">Select a Note Below</p>
    <br>
    <br>
    <br>
    {#each noteList as note}
        
        <div class="notecard"><NoteCard noteName={note.name} noteCategory={note.category}/></div>
    {/each}
</div>


<script lang="ts" context="module">
    export type note = {
        id: number;
        name: string;
        category: string;
        delta: Delta | null;
    };
</script>

<script lang="ts">
    import Navbar from "./Navbar.svelte"
    import IconButton from "@smui/icon-button";
    import Note from "./Note.svelte"
    import { createEventDispatcher } from 'svelte';
    import NoteCard from "./test/NoteCard.svelte";

    import type Delta from "../../node_modules/@types/quill/node_modules/quill-delta";
    

    let displayNote = true;
    const dispatch1 = createEventDispatcher<{make:note}>();


    type notes = note[];

    export let noteList: notes;

    let focusNote: note;

    focusNote = noteList[0];

    function toFocus(message: CustomEvent<number>) {
        for (let index = 0; index < noteList.length; index++) {
            const element = noteList[index];
            if(element.id == message.detail) {
                focusNote = element;
            }
        }

    }

    function newNote() {
        dispatch1('make', focusNote);
    }

</script>




<style> 
.container{
    height: fit-content;
    width:90%;
    margin: 3em;
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

</style>
