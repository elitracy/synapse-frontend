{#if show}
    <!-- {#if atTop} -->
        <nav transition:fly={{x: 250, opacity: 1}} style:top="{atTop ? '50px' : '0px'}">
            <SearchBar bind:textValue={tValue}/>
            {#each notes as note}
                {#if tValue === '' || note.name.toUpperCase().includes(tValue.toUpperCase())}
                    <button 
                        style="margin-bottom:10px" 
                        on:click={() => {modal_show = true; show = false;}}>
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

<script>
import { fly } from 'svelte/transition';
import Modal from './SidebarModal.svelte';
import SearchBar from './SearchBar.svelte';

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

    let notes = [
        {name : "Note 1", category : "math"},
        {name : "Note 2", category : "science"},
        {name : "Note 3", category : "math"}
    ]
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
.top {
    top:50px !important;
}
</style>