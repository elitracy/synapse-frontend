

<script lang="ts">
    import LoginCard from "./LoginCard.svelte"
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{attempt:Boolean}>();

	function forwardLoginAttempt(event: CustomEvent<Boolean>) {
		dispatch("attempt",
        event.detail
        );

        console.log("recieved " + event.detail)
	}

</script>

<div class="centered-container">
    <LoginCard on:attempt={forwardLoginAttempt}/>
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