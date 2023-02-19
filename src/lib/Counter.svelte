<script lang="ts">
  let count = 0
</script>

<button
  on:click={() => {
    count++
  }}
  data-testid="counter-value"
>
  count is {count}
</button>
