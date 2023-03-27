<div class="card-display">
    <div class="card-container">
      <Card>
        <PrimaryAction on:click={reportID}>
          <Media class="card-media-16x9" aspectRatio="16x9">
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
          </Media>
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
    import { createEventDispatcher } from 'svelte';
    import axios from 'axios';
    import FaRegTrashAlt from 'svelte-icons/fa/FaRegTrashAlt.svelte'

    let clicked = 0;
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

  </script>
  
  <style>
    * :global(.card-media-16x9) {
      background-image: url(https://place-hold.it/320x180?text=16x9&fontsize=23);
    }
  </style>