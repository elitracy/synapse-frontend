<style>

</style>

<script lang="ts" context="module">
  export type note = {
      id: number;
      name: string;
      category: string;
      delta: Delta | null;
  };
</script>

<script lang="ts">
  import Login from './lib/Login.svelte';
  import Landing from './lib/Landing.svelte';
  import IconButton from '@smui/icon-button';
  import Navbar from './lib/Navbar.svelte';
  import axios from 'axios';
  import NoteLanding from './lib/NoteLanding.svelte';

  import type Delta from "../node_modules/@types/quill/node_modules/quill-delta";
    import GraphLanding from './lib/GraphLanding.svelte'

  let d = null;

  let note1: note;
  let note2: note;
  let note3: note;
  note1 = {id: 0, name:"Note 1", category:"CSCE 482", delta:d};
  note2 = {id: 1, name:"Note 2", category:"CSCE 447", delta:d};
  note3 = {id: 2, name:"Note 3", category:"CSCE 447", delta:d};

  type notes = note[];
  let notes = [
        note1, note2, note3
    ]

  let page = 1;

  let landing = 0;

  let focusNote = notes[0];

  let uID = '';

  const url = "https://api.synapsenote.com/api/users";
  const url1 = "https://api.synapsenote.com/api/notes";

	async function logIn(event: CustomEvent<string>) {
		uID = event.detail;

    // await axios.get(url+'/:userId/notes', {
    //   params: {uID}
    // }).then(function (response){
    //   console.log(response);
    //   if(response.data)
    //   for(let i = 1;i<response.data.length;i++)
    //     notes.concat({id: i, name:response.data[i].context, category:"general", delta:null});
    // });

    page = 1;
	}

  async function createNote(message: CustomEvent<note>) {
    console.log("here");
    // await axios.post(url1+'/', {
    //   context: message.detail.name,
    //   userId: uID
    // }).then(function (){
       notes.push({id: notes.length, name:"New Note", category:"general", delta:null});
    // });
  }

  async function gotoNote(message: CustomEvent<note>) {
    focusNote = message.detail;
    landing = 1;
  }

  function gotoGraph() {
    landing = 2;
  }

</script>


  
  {#if page==0}
    <Login on:userID={logIn}/>
  {/if}
  {#if page==1}
    {#if landing==0}
    <NoteLanding noteList={notes} on:make={gotoNote}/>
    {/if}
    {#if landing==1}
    <Landing noteList={notes} focusNote={focusNote} on:make={createNote} on:graph={gotoGraph}/>
    {/if}
    {#if landing==2}
    <GraphLanding/>
    {/if}
  {/if}

