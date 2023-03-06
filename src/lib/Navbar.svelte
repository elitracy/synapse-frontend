
<script lang="ts" context="module">
  import type Delta from "../../node_modules/@types/quill/node_modules/quill-delta";
  export type note = {
        id: number;
        name: string;
        category: string;
        delta: Delta | null;
    };
</script>

<script lang="ts">
  import TopAppBar, {
    Row,
    Section,
    Title,
    AutoAdjust,
  } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import Sidebar from './Sidebar.svelte';
  
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher<{toFocus:number}>();
  const dispatch1 = createEventDispatcher<{make:Boolean}>();

  function toFocus(message: CustomEvent<number>) {
      // report the new noteID
      dispatch("toFocus",
          message.detail
      );
  }

  function newNote() {
      // report the new noteID
      dispatch1("make",
          true
      );

      console.log("here");
  }
 
  let topAppBar: TopAppBar;
  let sidebar_show = false;

  type notes = note[];

  export let noteList: notes;
</script>

<TopAppBar bind:this={topAppBar} variant="short" style="background-color:#50656e;">
    <Row>
      <Section>
        <IconButton class="material-icons" on:click={() => sidebar_show = !sidebar_show}>menu</IconButton>
        <Title>Synapse</Title>
      </Section>
      <Section align="end" toolbar>
        <IconButton class="material-icons" aria-label="Download"
          >account_circle</IconButton
        >
        
      </Section>
    </Row>
  </TopAppBar>
  <AutoAdjust style="padding: 0px;"{topAppBar}>
    
    <!-- <img
      alt="Page content placeholder"
      src="/page-content.jpg"
      style="display: block; max-width: 100%; height: auto; margin: 1em auto;"
    /> -->
  </AutoAdjust>

  <Sidebar bind:show={sidebar_show} noteList={noteList} on:toFocus={toFocus} on:make={newNote}/>

  

  

<!-- <link rel="stylesheet" href="src/bare.css"> -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/svelte-material-ui@6.0.0/bare.min.css"
/>
  <!-- <link rel="stylesheet" href="node_modules/svelte-material-ui/bare.css"> -->
  <!-- Material Icons -->
<link
rel="stylesheet"
href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
<!-- Roboto -->
<link
rel="stylesheet"
href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
/>
<!-- Roboto Mono -->
<link
rel="stylesheet"
href="https://fonts.googleapis.com/css?family=Roboto+Mono"
/>
  <style>
    /* Hide everything above this component. */
    :global(#smui-app),
    :global(body),
    :global(html) {
      display: block !important;
      height: auto !important;
      width: auto !important;
      position: static !important;
    }
  </style>