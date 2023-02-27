<script>
    import Navbar from "./Navbar.svelte"
    import IconButton from "@smui/icon-button";
    import Note from "./Note.svelte"

    let displayNote = true;

</script>

<div class="container">
    <Navbar />
    {#if displayNote}
        <Note />
    {/if}
</div>


<style> 
.container{
    height: fit-content;
}
</style>
