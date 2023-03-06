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

  import type Delta from "../node_modules/@types/quill/node_modules/quill-delta";

  let d = null;

  let note1: note;
  note1 = {id: 0, name:"Note", category:"general", delta:d};

  type notes = note[];
  let notes = [
        note1
    ]

  let page = 0;

  let uID = '';

  const url = "https://api.synapsenote.com/api/users";
  const url1 = "https://api.synapsenote.com/api/notes";

	async function logIn(event: CustomEvent<string>) {
		uID = event.detail;

    await axios.get(url+'/:userId/notes', {
      params: {userID: uID}
    }).then(function (response){
      console.log(response);
      for(let i = 1;i<response.data.length;i++)
        notes.concat({id: i, name:response.data[i].context, category:"general", delta:null});
    });

    page = 1;
	}

  async function createNote(message: CustomEvent<note>) {
    console.log("here");
    await axios.post(url1+'/', {
      context: message.detail.name,
      userId: uID
    }).then(function (){
      notes.push({id: notes.length, name:"New Note", category:"general", delta:null});
    });
  }

</script>

<main>
  
  {#if page==0}
    <Login on:userID={logIn}/>
  {/if}
  {#if page==1}
    <Landing noteList={notes} on:make={createNote}/>
  {/if}
</main>
