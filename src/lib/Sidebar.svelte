{#if show}
    <!-- {#if atTop} -->
        <nav transition:fly={{x: -250, opacity: 1}} style:top="{atTop ? '0px' : '0px'}" style="z-index=1;display:flex;flex-direction:column;align-items:center;">
            <div style="margin-top:50px;">
                <SearchBar bind:textValue={tValue}/>
            </div>
            
            {#each noteList as note}
                {#if tValue === '' || note.name.toUpperCase().includes(tValue.toUpperCase())}
                    <button 
                        style="margin-bottom:10px" 
                        on:click={() => {modal_show = true; show = false; focusNewNote(note.id);}}>
                            {note.name}
                    </button>
                    
                {/if}
            {/each}
            <!-- <IconButton class="material-icons"  aria-label="Download" on:click={newNote} style="color:black;"
            >add_box</IconButton
            > -->
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
      id: string;
      name: string;
      category: string;
      ops: string | null;
      tgL: string[];
  };
</script>

<script lang="ts">
import { fly } from 'svelte/transition';
import Modal from './SidebarModal.svelte';
import SearchBar from './SearchBar.svelte';
import { createEventDispatcher } from 'svelte';
import IconButton from '@smui/icon-button';
import { afterUpdate } from "svelte";

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


const dispatch = createEventDispatcher<{toFocus:string}>();
const dispatch1 = createEventDispatcher<{make:Boolean}>();

function focusNewNote(id: string) {
    // report the new noteID
    dispatch("toFocus",
        id
    );
}

function newNote() {
      // report the new noteID
      dispatch1("make",
          true
      );

      show = false;

      console.log("here");
  }


</script>
		
<style>
nav {
  position: fixed;
  /* top: 0; */
  left: 0;
  height: 100%;
  padding: 2rem 1rem 0.6rem;
  border-right: 1px solid #aaa;
  background: white;
  overflow-y: auto;
	width: 10rem;

    z-index: 1;
}
button {
    border:1px thick black !important;
}
/* .top {
    top:50px !important;
} */
</style>