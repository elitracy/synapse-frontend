{#if show}
    <!-- {#if atTop} -->
        <nav transition:fly={{x: 250, opacity: 1}} style:top="{atTop ? '50px' : '0px'}" style="z-index=1;">
            <SearchBar bind:textValue={tValue}/>
            {#each noteList as note}
                {#if tValue === '' || note.name.toUpperCase().includes(tValue.toUpperCase())}
                    <button 
                        style="margin-bottom:10px" 
                        on:click={() => {modal_show = true; show = false; focusNewNote(note.id);}}>
                            {note.name}
                    </button>
                {/if}
            {/each}
        </nav>
    <!-- {/if} -->
    <!-- {#if !atTop}
    <nav transition:fly={{x: 250, opacity: 1}}>
        <SearchBar />
        {#each notes as note}
            <button style="margin-bottom:10px" on:click={() => {modal_show = true; show = false;}}>{note.name}</button>
        {/each}

    </nav>
    {/if} -->
{/if}


<Modal bind:show={modal_show} />

<script lang="ts" context="module">
  import type Delta from "../../node_modules/@types/quill/node_modules/quill-delta";
  export type note = {
        id: number;
        name: string;
        category: string;
        delta: Delta | null;
    };
</script>

<script lang="ts">
import { fly } from 'svelte/transition';
import Modal from './SidebarModal.svelte';
import SearchBar from './SearchBar.svelte';
import { createEventDispatcher } from 'svelte';

export let show = false;
let modal_show = false;
let atTop = true;
let tValue = '';

window.addEventListener("scroll", function(){
  if(window.scrollY==0){
      atTop = true;
  } else {
      atTop = false;
  }
  });

type notes = note[];

export let noteList: notes;


const dispatch = createEventDispatcher<{toFocus:number}>();

function focusNewNote(id: number) {
    // report the new noteID
    dispatch("toFocus",
        id
    );
}


</script>
		
<style>
nav {
  position: fixed;
  /* top: 0; */
  right: 0;
  height: 100%;
  padding: 2rem 1rem 0.6rem;
  border-left: 1px solid #aaa;
  background: white;
  overflow-y: auto;
	width: 10rem;
}
button {
    border:1px thick black !important;
}
/* .top {
    top:50px !important;
} */
</style>