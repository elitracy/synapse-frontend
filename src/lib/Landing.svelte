<script lang="ts">
    import Navbar from "./Navbar.svelte"
    import IconButton from "@smui/icon-button";
    import Note from "./Note.svelte"
    import { createEventDispatcher } from 'svelte';

    let displayNote = true;


    type note = {name:string, category:string, id:number};
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

</script>

<div class="container">
    <Navbar noteList={noteList} on:toFocus={toFocus}/>
    {#if displayNote}
        <Note focusNote={focusNote}/>
    {/if}
</div>


<style> 
.container{
    height: fit-content;
}
</style>
