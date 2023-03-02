<style>
    .logo {
        height: min(200px, 10vw);
        width: min(200px, 10vw);

        min-height: 100px;
        min-width: 100px;

        margin-bottom: 2vw;

        /* border: 1px solid #242424; */

        background: url('/neuron.png') center no-repeat;
        background-size: contain;
    }
    .card-container {
        min-height: 450px;
        height: 65vh;
        min-width: 350px;
        width: 60vw;

        display: flex;
        flex-direction: row;
        justify-content: center;

        align-items: center;

        background: url('/card.svg') no-repeat;
        background-size: contain;

        background-position: calc(50% + 15px) 50%;

        /* border: 1px solid black; */

        color: white;
    }

    .bounds {
        min-height: 240px;
        height: 20vw;
        min-width: 270px;
        max-width: min(40vw, 45vh);

        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        /* border: 1px solid black; */
    }

    .text-field {
        border: none;
        border-style: none;
        background-color: #242424;
        border: 0;
        outline: 0;

        width: 90%;
        margin-bottom: min(30px, 2vw);

        color: rgb(199, 199, 199);

        text-decoration-style: none;
        font-size: min(3vw, 2em);

        text-align: left;
        box-sizing: border-box;
        padding: 5px;
        border-bottom: 3px solid;

        font-family: 'Arial';

        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    }

    ::placeholder {
        color: rgb(199, 199, 199);
        opacity: 0.9;
    }

    #email {
        border-image: linear-gradient(60deg, hsl(0, 66%, 24%), hsl(236, 100%, 63%)) 5;
    }
    #pass {
        border-image: linear-gradient(200deg, hsl(0, 66%, 24%), hsl(236, 100%, 63%)) 5;
    }

    .text {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }
    .text-field:focus {
        outline: none !important;
    }

    .button {
        height: auto;
        font-size: min(2vw, 1em);
        text-align: center;
        background-color: #242424;
        font-family: 'Arial';
        color: rgb(199, 199, 199);
        margin: 2px;
        outline: none !important;
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    }
    .button:hover {
        height: auto;
        font-size: min(2vw, 1em);
        text-align: center;
        background-color: #242424;
        font-family: 'Arial';
        color: rgb(199, 199, 199);
        margin: 2px;
        outline: none !important;
        border: 1px solid hsl(0, 66%, 24%);
    }
</style>

<!-- provides basic email + password login capabilities -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    let email: string
    let pass: string

    email = ''
    pass = ''

    let loginSuccess = false

    let hidden = false

    const dispatch = createEventDispatcher<{ attempt: boolean }>()

    function loginAttempt() {
        // query the database to check UN against Pass

        loginSuccess = true
        // report the message
        if (loginSuccess) dispatch('attempt', loginSuccess)
        console.log('dispatched the attempt')
    }

    function createAccount() {
        // query the database to store UN and Pass

        loginSuccess = true
        // report the message
        if (loginSuccess) dispatch('attempt', loginSuccess)

        console.log('dispatched the attempt')
    }

    function toggleToCreateAccount() {
        if (hidden == true) {
            createAccount()
        }
        hidden = true
    }
</script>

<div class="card-container">
    <div class="bounds">
        <div class="logo" />

        <div class="text">
            <input
                type="text"
                name="email"
                id="email"
                class="text-field"
                placeholder="Email"
                value={email} />
            <input
                type="password"
                name="password"
                id="pass"
                class="text-field"
                placeholder="Password"
                value={pass} />
        </div>

        <div>
            {#if !hidden}
                <button
                    class="button"
                    on:click={() => {
                        loginAttempt()
                    }}>
                    Log In
                </button>
            {/if}
            <button
                class="button"
                on:click={() => {
                    toggleToCreateAccount()
                }}>
                Create Account
            </button>
        </div>
    </div>
</div>
