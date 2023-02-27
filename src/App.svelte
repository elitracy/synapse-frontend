<style>

</style>

<script lang="ts">
  import Login from './lib/Login.svelte';
  import Landing from './lib/Landing.svelte';
  import IconButton from '@smui/icon-button';
  import Navbar from './lib/Navbar.svelte';

  let page = 0;

	function logIn(event: CustomEvent<Boolean>) {
		console.log("Log in successful");
    page = 1;
	}
</script>

<main>
  <Navbar />
  
  {#if page==0}
    <Login on:attempt={logIn}/>
  {/if}
  {#if page==1}
    <Landing />
  {/if}
</main>
