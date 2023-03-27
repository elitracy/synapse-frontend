<style>

</style>

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
  note1 = {id: "", name:"New Note", category:"general", ops:d, tgL:[]};

  type notes = note[];
  let notes = [
        note1
    ]

  let page = 0;

  let landing = 0;

  let focusNote = notes[0];

  let uID = '';

  const url = "https://api.synapsenote.com/api/users";
  const url1 = "https://api.synapsenote.com/api/notes";

	async function logIn(event: CustomEvent<string>) {
		uID = event.detail;

    await axios.get(url+'/'+uID+'/notes', {
      
    }).then(function (response){

      console.log(response.data);
      if(response.data)
        for(let i = 0;i<response.data.length;i++) {
          notes.push({id: response.data[i].id, name:response.data[i].title, category:"general", ops:response.data[i].content, tgL:[]});
          console.log(i);
        }
    }).catch(function (error){
      console.log(error);
    });

    page = 1;
	}

  async function createNote(message: CustomEvent<note>) {
    notes.push({id: "", name:"New Note", category:"general", ops:null, tgL:[]});
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
    <Landing noteList={notes} focusNote={focusNote} on:make={createNote} on:graph={gotoGraph} uID={uID}/>
    {/if}
    {#if landing==2}
    <GraphLanding noteList={notes}/>
    {/if}
  {/if}

