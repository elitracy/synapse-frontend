<style>

</style>

<script lang="ts" context="module">
  export type note = {
      id: number;
      name: string;
      category: string;
      delta: Delta | null;
  };
</script>

<script lang="ts">
  import Login from './lib/Login.svelte';
  import Landing from './lib/Landing.svelte';
  import IconButton from '@smui/icon-button';
  import Navbar from './lib/Navbar.svelte';

  import type Delta from "../node_modules/@types/quill/node_modules/quill-delta";

  let d = null;

  let note1: note;
  note1 = {id: 1, name:"Note 1", category:"math", delta:d};

  let note2: note;
  note2 = {id: 2, name:"Note 2", category:"biology", delta:d};

  let note3: note;
  note3 = {id: 3, name:"Note 3", category:"chemistry", delta:d};

  type notes = note[];
  let notes = [
        note1, note2, note3
    ]

  let page = 0;

	function logIn(event: CustomEvent<Boolean>) {
		console.log("Log in successful");
    page = 1;
	}
</script>

<main>
  
  {#if page==0}
    <Login on:attempt={logIn}/>
  {/if}
  {#if page==1}
    <Landing noteList={notes}/>
  {/if}
</main>
