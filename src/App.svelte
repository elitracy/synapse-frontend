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
  import UserProfile from './lib/UserProfile.svelte';

  import { afterUpdate } from 'svelte';

  import type Delta from "../node_modules/@types/quill/node_modules/quill-delta";
  import GraphLanding from './lib/GraphLanding.svelte'

  let d = null;


  let note1: note;
  note1 = {id: "", name:"New Note", category:"general", ops:d, tgL:[]};

  let notes: note[];

  let page = 0;

  let landing = 0;

  let focusNote: note;

  let uID = '';

  const url = "https://api.synapsenote.com/api/users";
  const url1 = "https://api.synapsenote.com/api/notes";

	async function logIn(event: CustomEvent<string>) {
		uID = event.detail;

    await axios.get(url+'/'+uID+'/notes', {
      
    }).then(function (response){

      page = -1;



      if(response.data) {
        notes = [];
        for(let i = 0;i<response.data.length;i++) {
          let splt = response.data[i].content?.split(/#/);
          let tagList: string[];
          tagList = [];
          if(splt && splt.length>1){
              for(let i = 1;i<splt.length;i+=2) {
                  tagList.push(splt[i]);
              }
          }

          if(!response.data[i].tags) {
            notes.push({id: response.data[i].id, name:response.data[i].title, category:"general", ops:response.data[i].content, tgL:tagList});
          } else {
            notes.push({id: response.data[i].id, name:response.data[i].title, category:"general", ops:response.data[i].content, tgL:response.data[i].tags});
          }
        }
    }
  }).catch(function (error){
      console.log(error);
    });

    page = 1;


    for(let i = 0;i<notes.length;i++) {
      let tagList: string[];
      tagList = [];
      await axios.get(url1+'/'+notes[i].id+'/tags',{}).then(function (response){
        if(response.data) {
          for(let j = 0;j<response.data.tags.length;j++) {
            let name = JSON.parse(response.data.tags[j].name);
            name.push(response.data.tags[j].id);
            tagList.push(JSON.stringify(name));
          }
        }
      });

      notes[i].tgL = tagList;
    }
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

  function gotoLanding() {
    landing = 0;
  }

  function setNoteList(message: CustomEvent<note[]>) {
    notes = message.detail;
  }

  afterUpdate(async () => {
    notes = notes;
  });

</script>


  
  {#if page==0}
    <Login on:userID={logIn}/>
  {/if}
  {#if page==1}
    {#if landing==0}
    <!-- <NoteLanding noteList={notes} on:make={gotoNote} uID={uID} on:changeNoteList={setNoteList}/> -->
    <UserProfile noteList={notes} on:make={gotoNote} uID={uID} on:changeNoteList={setNoteList}/>
    {/if}
    {#if landing==1}
    <Landing noteList={notes} focusNote={focusNote} on:make={createNote} on:graph={gotoGraph} uID={uID}/>
    {/if}
    {#if landing==2}
    <GraphLanding noteList={notes} on:back={gotoLanding} uID={uID}/>
    {/if}
  {/if}

