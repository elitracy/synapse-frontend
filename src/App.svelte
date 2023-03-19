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

  let d = null;

  let note1: note;
  let note2: note;
  let note3: note;
  let note4: note;
  let note5: note;
  let note6: note;
  let note7: note;
  let note8: note;
  let note9: note;
  note1 = {id: 0, name:"Note 1", category:"CSCE 482", delta:d};
  note2 = {id: 1, name:"Note 2", category:"CSCE 447", delta:d};
  note3 = {id: 2, name:"Note 3", category:"CSCE 447", delta:d};
  note4 = {id: 0, name:"Note 4", category:"CSCE 482", delta:d};
  note5 = {id: 1, name:"Note 5", category:"CSCE 447", delta:d};
  note6 = {id: 2, name:"Note 6", category:"CSCE 447", delta:d};
  note7 = {id: 0, name:"Note 7", category:"CSCE 482", delta:d};
  note8 = {id: 1, name:"Note 8", category:"CSCE 447", delta:d};
  note9 = {id: 2, name:"Note 9", category:"CSCE 447", delta:d};

  type notes = note[];
  let notes = [
        note1, note2, note3, note4, note5, note6, note7, note8, note9
    ]

  let page = 0;

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

</script>


  
  {#if page==-1}
    <Login on:userID={logIn}/>
  {/if}
  {#if page==0}
  <NoteLanding noteList={notes}/>
    <!-- <Landing noteList={notes} on:make={createNote}/> -->
  {/if}

