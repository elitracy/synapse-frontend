<style>

</style>

<script lang="ts">
  import Login from './lib/Login.svelte';
  import Landing from './lib/Landing.svelte';
  import IconButton from '@smui/icon-button';
  import Navbar from './lib/Navbar.svelte';


  type note = {name:string, category:string, id:number};

  let note1: note;
  note1 = {name:"Note 1", category:"math", id:1};

  let note2: note;
  note2 = {name:"Note 2", category:"chemistry", id:2};

  let note3: note;
  note3 = {name:"Note 3", category:"biology", id:3};

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
