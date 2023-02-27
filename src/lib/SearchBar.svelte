<div style="margin-bottom: 10px">
    <Textfield
      class="shaped-outlined"
      variant="outlined"
      bind:value={textValue}
      label="Search"
    >
      <Icon class="material-icons" slot="leadingIcon">search</Icon>
      <!-- <HelperText slot="helper">Helper Text</HelperText> -->
    </Textfield>
 
    <!-- <pre class="status">Value: {textValue}</pre> -->
  </div>

  <script>
    export let textValue = '';
    import Textfield from '@smui/textfield';
    import Icon from '@smui/textfield/icon';
  </script>