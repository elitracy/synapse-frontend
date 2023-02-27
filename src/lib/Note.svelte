<script>
    import { element } from "svelte/internal"


let pages = [1,2,3];

</script>


<div class="container">
    <!-- <div class="page" id="first">

    </div> -->
    {#each pages as pg}
        {#if pg==1}
            <div class="page" style="margin-top: 20vh;">
                {pg}
            </div>
        {:else}
            <div class="page">
                {pg}
            </div>
        {/if}
        
    {/each}
</div>

<style>
    .container{
        min-width: 100vw;
        min-height: fit-content;

        background-color: rgb(179, 200, 200);

        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    .page{
        background-color: white;
        min-width: 60vw;
        min-height: 100vw;

        color: black;

        margin-bottom: 5vh;

        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    }
</style>