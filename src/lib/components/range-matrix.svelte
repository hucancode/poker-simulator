<script>
  import { createEventDispatcher } from "svelte";
  import {
    RANKS,
    cellLabel,
    cellKind,
    notationFromCells,
    cellsFromNotation,
    PRESETS,
  } from "$lib/poker/range.js";

  export let notation = "";
  export let disabled = false;

  const dispatch = createEventDispatcher();

  let selected = cellsFromNotation(notation);
  let lastNotation = notation;

  $: if (notation !== lastNotation) {
    selected = cellsFromNotation(notation);
    lastNotation = notation;
  }

  let dragging = false;
  let dragMode = null;

  function setCell(i, mode) {
    if (mode === "add") selected.add(i);
    else selected.delete(i);
  }

  function startDrag(r, c, e) {
    if (disabled) return;
    e.preventDefault();
    const i = r * 13 + c;
    dragMode = selected.has(i) ? "remove" : "add";
    setCell(i, dragMode);
    dragging = true;
    selected = selected;
    syncNotation();
  }

  function continueDrag(r, c) {
    if (!dragging || disabled) return;
    const i = r * 13 + c;
    setCell(i, dragMode);
    selected = selected;
    syncNotation();
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    dragMode = null;
  }

  function syncNotation() {
    notation = notationFromCells(selected);
    lastNotation = notation;
    dispatch("change", { notation });
  }

  function preset(name) {
    if (disabled) return;
    selected = PRESETS[name]();
    syncNotation();
  }

  function count() {
    return selected.size;
  }

  function percent() {
    return ((selected.size / 169) * 100).toFixed(0);
  }
</script>

<svelte:window on:pointerup={endDrag} on:pointercancel={endDrag} />

<div class="range">
  <div class="presets" role="toolbar">
    <button type="button" {disabled} on:click={() => preset("any")}>Any</button>
    <button type="button" {disabled} on:click={() => preset("premium")}>Premium</button>
    <button type="button" {disabled} on:click={() => preset("broadway")}>Broadway</button>
    <button type="button" {disabled} on:click={() => preset("pairs")}>Pairs</button>
    <button type="button" {disabled} on:click={() => preset("suited_connectors")}>Connectors</button>
    <button type="button" class="clear" {disabled} on:click={() => preset("clear")}>Clear</button>
  </div>

  <div
    class="grid"
    role="grid"
    aria-label="Range matrix"
    style="touch-action: none;"
  >
    {#each Array(13) as _, r}
      {#each Array(13) as _, c}
        {@const i = r * 13 + c}
        {@const sel = selected.has(i)}
        {@const kind = cellKind(r, c)}
        <button
          type="button"
          class="cell {kind}"
          class:selected={sel}
          {disabled}
          aria-label={cellLabel(r, c)}
          aria-pressed={sel}
          on:pointerdown={(e) => startDrag(r, c, e)}
          on:pointerenter={() => continueDrag(r, c)}
        >
          <span>{cellLabel(r, c)}</span>
        </button>
      {/each}
    {/each}
  </div>
</div>

<style>
  .range {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    width: 100%;
  }
  .presets {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.25rem;
  }
  .presets button {
    background: #1f2937;
    color: #fff;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    border: 0;
    cursor: pointer;
  }
  .presets button.clear {
    background: #b91c1c;
  }
  .presets button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(13, minmax(0, 1fr));
    gap: 2px;
    width: min(100%, 26rem);
    aspect-ratio: 1 / 1;
    user-select: none;
  }
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    color: #111827;
    font-size: 0.55rem;
    font-weight: 700;
    padding: 0;
    cursor: pointer;
    transition: background-color 75ms;
  }
  .cell.pair {
    background: #fef3c7;
  }
  .cell.suited {
    background: #ecfdf5;
  }
  .cell.offsuit {
    background: #f3f4f6;
  }
  .cell.selected {
    background: #f97316;
    color: #fff;
    border-color: #c2410c;
  }
  .cell.pair.selected {
    background: #ea580c;
  }
  .cell.suited.selected {
    background: #16a34a;
  }
  .cell.offsuit.selected {
    background: #2563eb;
  }
  .cell:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  @media (min-width: 480px) {
    .cell {
      font-size: 0.7rem;
    }
  }
  @media (min-width: 768px) {
    .cell {
      font-size: 0.85rem;
    }
  }
</style>
