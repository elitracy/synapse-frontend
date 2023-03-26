<!-- <Navbar noteList={noteList} /> -->




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

    function toFocus1(message: CustomEvent<number>) {
        for (let index = 0; index < noteList.length; index++) {
            const element = noteList[index];
            if(element.id == message.detail) {
                focusNote = element;
            }
        }

        newNote();
    }

    function newNote() {
        dispatch1('make', focusNote);
    }

</script>

<div class="container">
    <p style="font-size:4em">All Notes</p>
    <p style="font-size:1em">Select a Note Below</p>
    <br>
    <br>
    <br>
    {#each noteList as note}
        <div class="notecard"><NoteCard noteName={note.name} noteCategory={note.category} noteId={note.id} on:id={toFocus1}/></div>
    {/each}
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
