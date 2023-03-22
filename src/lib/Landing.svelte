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

    import type Delta from "../../node_modules/@types/quill/node_modules/quill-delta";
    

    let displayNote = true;
    const dispatch1 = createEventDispatcher<{make:note}>();


    type notes = note[];

    export let noteList: notes;

    export let focusNote: note;

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

<div class="container">
    <Navbar noteList={noteList} on:toFocus={toFocus} on:make={newNote}/>
    {#if displayNote}
        <Note focusNote={focusNote}/>
    {/if}
</div>


<style> 
.container{
    height: fit-content;
}
</style>
