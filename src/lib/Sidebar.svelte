{#if show}
    {#if atTop}
        <nav transition:fly={{x: 250, opacity: 1}} style="top:50px;">
            <button on:click={() => {modal_show = true; show = false;}}>Note 1</button>
        </nav>
    {/if}
    {#if !atTop}
    <nav transition:fly={{x: 250, opacity: 1}}>
        <button on:click={() => {modal_show = true; show = false;}}>Note 1</button>
    </nav>
    {/if}
{/if}

<Modal bind:show={modal_show} />

<script>
import { fly } from 'svelte/transition';
import Modal from './SidebarModal.svelte';

export let show = false;
let modal_show = false;
let atTop = true;

    window.addEventListener("scroll", function(){
    if(window.scrollY==0){
        atTop = true;
    } else {
        atTop = false;
    }
    });
</script>
		
<style>
nav {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  padding: 2rem 1rem 0.6rem;
  border-left: 1px solid #aaa;
  background: #fff;
  overflow-y: auto;
	width: 10rem;
}
</style>