<style>

</style>

<script lang="ts">
  import Login from './lib/Login.svelte';

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
</main>
