

<script lang="ts">
    import LoginCard from "./LoginCard.svelte"
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{userID:string}>();

	function forwardLoginAttempt(event: CustomEvent<string>) {
		dispatch("userID",
        event.detail
        );

        console.log("recieved " + event.detail)
	}

</script>

<div class="centered-container">
    <LoginCard on:userID={forwardLoginAttempt}/>
</div>

<style>
    .centered-container{
        min-height: 400px;
        max-height: 100vh;
        min-width: auto;

        width: fit-content;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>