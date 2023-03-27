<div class="card-display">
    <div class="card-container">
      <Card>
        <PrimaryAction on:click={reportID}>
          <div id="color" class="card" bind:this={c}>
            <MediaContent>
              <div
                style="color: #fff; position: absolute; bottom: 16px; left: 16px;"
              >
                <h2 class="mdc-typography--headline6" style="margin: 0;">
                  {noteName}
                </h2>
                <!-- <h3 class="mdc-typography--subtitle2" style="margin: 0;">
                  {noteCategory}
                </h3> -->
              </div>
            </MediaContent>
          </div>
          <!-- <Content class="mdc-typography--body2">
            Add details here.
          </Content> -->
        </PrimaryAction>
        <Actions>
          <ActionButtons>
            <!-- <Button on:click={() => clicked++}>
              <Label>Action</Label>
            </Button> -->

          </ActionButtons>
          <ActionIcons>
            <!-- <IconButton
              on:click={() => clicked++}
              toggle
              aria-label="Add to favorites"
              title="Add to favorites"
            >
              <Icon class="material-icons" on>favorite</Icon>
              <Icon class="material-icons">favorite_border</Icon>
            </IconButton> -->
            <!-- <IconButton
              class="material-icons"
              on:click={() => clicked++}
              title="Share">share</IconButton
            > -->
            <IconButton on:click={deleteNote} title="More options"><FaRegTrashAlt/></IconButton>
            
          </ActionIcons>
        </Actions>
        {#if dClicked}
        <div class="card-display">
          <div class="card-container">
            <Card>
              <Content component={List}>
                <Item on:click={() => clicked++}>
                  <Text>Rename</Text>
                </Item>
                <Item on:click={() => clicked++}>
                  <Text>Delete</Text>
                </Item>
              </Content>
            </Card>
          </div>
        </div>
        {/if}
      </Card>
    </div>
  
  </div>
  
  <!-- <pre class="status">Clicked: {clicked}</pre> -->
  
<script lang="ts" context="module">
  export type note = {
      id: string;
      name: string;
      category: string;
      ops: string | null;
      tgL: string[];
  };
</script>
  <script lang="ts">
    
    import Card, {
      Content,
      PrimaryAction,
      Media,
      MediaContent,
      Actions,
      ActionButtons,
      ActionIcons,
    } from '@smui/card';
    import Button, { Label } from '@smui/button';
    import IconButton, { Icon } from '@smui/icon-button';
    import { createEventDispatcher, onMount } from 'svelte';
    import axios from 'axios';
    import FaRegTrashAlt from 'svelte-icons/fa/FaRegTrashAlt.svelte'

    import List, { Item, Text } from '@smui/list';
    let clicked = 0;
    let dClicked = false;
    export let noteName : string;
    export let noteCategory : string;
    export let noteId: string;

    export let noteList: note[];

    export let uID: string;

    const dispatch1 = createEventDispatcher<{id:string}>();
    const dispatch2 = createEventDispatcher<{nts:string}>();

    const url1 = "https://api.synapsenote.com/api/notes";
    const url = "https://api.synapsenote.com/api/users";


    function reportID() {
      dispatch1('id', noteId);
    }

    function newList() {
      dispatch2('nts', noteId);
    }

    async function deleteNote() {
      await axios.delete(url1+'/'+noteId, {
          }).then(function (response){

            console.log("deleted the note");
            noteList = noteList.filter(n => n.id!=noteId);
            newList();
              
          }).catch(function (error){
              console.log(error);
        });
    }

    let c: HTMLElement;

    onMount(() => {

      if(c)
        c.setAttribute("style",`background-color: hsl(${Math.random()*(300)}, ${100}%, ${35}%)`);

    });

    

  </script>
  
  <style>

    .card{
      height: 8vh;
    }
    
  </style>