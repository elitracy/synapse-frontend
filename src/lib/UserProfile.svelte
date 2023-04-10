<!-- <Navbar noteList={noteList} /> -->




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
    import Navbar from "./Navbar.svelte"
    import IconButton from "@smui/icon-button";
    import Note from "./Note.svelte"
    import { createEventDispatcher } from 'svelte';
    import NoteCard from "./test/NoteCard.svelte";
    import axios from 'axios';
    import Textfield from '@smui/textfield';
    import Icon from '@smui/textfield/icon';
    import HelperText from '@smui/textfield/helper-text';
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    
    let focused = false;
    let focused1 = false;
    let value: string | null = null;
    let value1 : string | null = null;
    let dirty = false;
    let invalid = false;
    let dirty1 = false;
    let invalid1= false;
    $: disabled = focused || !value || !dirty || invalid;
    $: disabled1 = focused1 || !value1 || !dirty1 || invalid1;
    function clickHandler() {
        alert(`Sending to ${value}!`);
        value = null;
        dirty = false;
    }

    // import type Delta from "quill/node_modules/quill-delta";

    let displayNote = true;
    const dispatch1 = createEventDispatcher<{make:note}>();
    const dispatch2 = createEventDispatcher<{changeNoteList:note[]}>();

    export let uID: string;
    type notes = note[];

    export let noteList: notes;

    let focusNote: note;

    const url1 = "https://api.synapsenote.com/api/notes";
    const url = "https://api.synapsenote.com/api/users";

    async function getEmail() {
        // query the database to check UN against Pass
        
            console.log('passed regex');

            //check for existing user
            let getEm = axios.create();

            await getEm.get(`${url}/${uID}`, {
                
            })
            .then(async function (response) {
                if((response.data!=null)) {
                   

                    let p1 = response.data.email;
                    value = p1;
                    value1 = "";
                    console.log(p1)
                    return;

                    

                    console.log('success');

                    // report the message
                    
                } 
            })
            .catch(function (error) {
                console.log(error);
                return "FAILED";
            });
            
    }

    async function fireUpdate() {
        let putEm = axios.create();

        await putEm.put(`${url}/${uID}/email`, {
             email:value 
        })
        .then(async function (response) {
        })
        .catch(function (error) {
            console.log(error);
            console.log("FAILED")
            return "FAILED";
        });

        let putPa = axios.create();

        await putPa.put(`${url}/${uID}/password`, {
            password:value1 
        })
        .then(async function (response) {
        })
        .catch(function (error) {
            console.log(error);
            console.log("FAILED")
            return "FAILED";
        });
    }



</script>

<Navbar noteList={noteList} />
<div class="container">
    <p style="font-size:4em">Update Profile Settings</p>
    <br>
    <br>
    <br>
    <LayoutGrid>
        <Cell span={4}></Cell>
        <Cell span={4}>
            <Textfield
            type="email"
            bind:dirty
            bind:invalid
            updateInvalid
            bind:value={value}
            label="Email"
            style="width:100%;"
            on:focus={() => (focused = true)}
            on:blur={() => (focused = false)}
            withTrailingIcon={!disabled}
            on:mount={getEmail()}
          ></Textfield>
        </Cell>
        <Cell span={4}></Cell>

        <Cell span={4}></Cell>
        <Cell span={4}>
            <Textfield
                label="Password"
                bind:value={value1}
                style="width: 100%;"
            ></Textfield>
        </Cell>
        <Cell span={4}></Cell>

        <Cell span={4}></Cell>
        <Cell span={4}><button style="width:100%;margin-bottom:10px;" on:click={fireUpdate}>Update</button></Cell>
        <Cell span={4}></Cell>
    </LayoutGrid>
  <br>
  <br>
  <br>
  
    

 
    
</div>


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
.container{
    height: fit-content;
    width:90%;
    margin: 3em;
    background-color: white;

    color: #242424;
}
p {
    margin-block-start: 0;
    margin-block-end: 0;
}
.notecard {
    width:20em;
    display:inline-block;
    padding:1em;
}

.create{
    position: fixed;
    bottom: 10vh;
    left: 10vw;

    font-size: 2em;
}

</style>
