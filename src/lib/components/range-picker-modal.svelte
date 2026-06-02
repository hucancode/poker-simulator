<script>
  import { createEventDispatcher } from "svelte";
  import RangeMatrix from "$lib/components/range-matrix.svelte";

  export let notation = "";
  export let title = "Pick range";
  export let open = false;
  export let removable = false;

  const dispatch = createEventDispatcher();
  let dialog;

  $: if (dialog) {
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }

  function onMatrixChange(e) {
    notation = e.detail.notation;
    dispatch("change", { notation });
  }

  function onTextChange(e) {
    notation = e.target.value;
    dispatch("change", { notation });
  }

  function close() {
    open = false;
    dispatch("close");
  }

  function remove() {
    dispatch("remove");
    close();
  }
</script>

<dialog
  bind:this={dialog}
  on:close={close}
  on:click|self={close}
  class="modal"
>
  <div class="inner" on:click|stopPropagation role="presentation">
    <header>
      <h3>{title}</h3>
    </header>

    <RangeMatrix {notation} on:change={onMatrixChange} />

    <details class="adv">
      <summary>Notation</summary>
      <input
        type="text"
        value={notation}
        on:change={onTextChange}
        placeholder="e.g. QQ+,AKs,AKo"
      />
    </details>

    <footer>
      {#if removable}
        <button type="button" class="remove" on:click={remove}>
          Remove
        </button>
      {/if}
      <button type="button" class="done" on:click={close}>Done</button>
    </footer>
  </div>
</dialog>

<style>
  .modal {
    border: 0;
    padding: 0;
    background: transparent;
    max-width: 100vw;
    max-height: 100vh;
  }
  .modal::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
  .inner {
    background: var(--bg, #fff);
    color: var(--fg, #111);
    padding: 0.75rem;
    width: min(100vw, 32rem);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: auto;
  }
  header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  header h3 {
    margin: 0;
    font-size: 1rem;
    flex: 1;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .adv {
    font-size: 0.875rem;
  }
  .adv summary {
    cursor: pointer;
    color: #6b7280;
  }
  .adv input {
    width: 100%;
    padding: 0.25rem;
    border: 1px solid #d1d5db;
    margin-top: 0.25rem;
    font-family: ui-monospace, monospace;
  }
  footer {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }
  .done {
    background: #000;
    color: #fff;
    border: 0;
    padding: 0.5rem 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
  }
  .remove {
    background: #b91c1c;
    color: #fff;
    border: 0;
    padding: 0.5rem 1.25rem;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
  }
</style>
