<script>
  import { createEventDispatcher } from "svelte";
  import { handTextToArray, handArrayToText } from "$lib/poker/cards";
  import Card from "$lib/components/card.svelte";
  import VillainDisplay from "$lib/components/villain-display.svelte";
  import CardPickerModal from "$lib/components/card-picker-modal.svelte";
  import RangePickerModal from "$lib/components/range-picker-modal.svelte";
  import { Splide, SplideTrack, SplideSlide } from "@splidejs/svelte-splide";
  import "@splidejs/splide/css";

  export let disabled = false;

  const VILLAIN_SLOTS = 8;
  let hero = [];
  let community = [];
  let villains = Array(VILLAIN_SLOTS)
    .fill()
    .map(() => ({ notation: "" }));

  let editing = null;

  const dispatch = createEventDispatcher();

  $: heroUsed = community;
  $: communityUsed = hero;

  function open(target) {
    if (disabled) return;
    editing = target;
  }

  function closeModal() {
    editing = null;
  }

  function onHeroChange(e) {
    hero = e.detail.cards;
    notify();
  }

  function onCommunityChange(e) {
    community = e.detail.cards;
    notify();
  }

  function onVillainChange(idx, e) {
    villains[idx].notation = e.detail.notation;
    villains = villains;
    notify();
  }

  function clearVillain(idx) {
    villains[idx].notation = "";
    villains = villains;
    editing = null;
    notify();
  }

  function notify() {
    dispatch("updated");
  }

  export function getHero() {
    return handArrayToText(hero);
  }
  export function getCommunity() {
    return handArrayToText(community);
  }
  export function getVillainNotations() {
    return villains.map((v) => v.notation).filter((n) => n.trim());
  }
  export function getVillainSlots() {
    return villains.map((v) => v.notation);
  }
  export function isValid() {
    if (hero.length !== 2) return false;
    if (community.length < 3 || community.length > 5) return false;
    if (!villains.some((v) => v.notation.trim())) return false;
    return true;
  }
  export function loadFromUrl(params) {
    const h = params.get("h");
    if (h) hero = handTextToArray(h);
    const c = params.get("c");
    if (c) community = handTextToArray(c);
    const vs = params.getAll("v");
    if (vs.length > 0) {
      villains = Array(VILLAIN_SLOTS)
        .fill()
        .map((_, i) => ({ notation: vs[i] ?? "" }));
    }
    notify();
  }
  export function randomize() {
    const pool = Array(52)
      .fill()
      .map((_, i) => i)
      .sort(() => Math.random() - 0.5);
    hero = pool.slice(0, 2);
    const boardSize = 3 + Math.floor(Math.random() * 3);
    community = pool.slice(2, 2 + boardSize);
    villains = Array(VILLAIN_SLOTS)
      .fill()
      .map(() => ({ notation: "" }));
    villains[0].notation = "QQ+,AKs,AKo";
    notify();
  }

  const splideOptions = {
    perPage: 3,
    perMove: 1,
    gap: "0.5rem",
    pagination: true,
    arrows: false,
    drag: true,
    padding: { left: 0, right: "1.5rem" },
    breakpoints: {
      500: { perPage: 2, arrows: true, padding: 0 },
      900: { perPage: 3, arrows: true, padding: 0 },
    },
  };
</script>

<div class="overview" class:disabled>
  <section
    class="row"
    role="button"
    tabindex="0"
    on:click={() => open("board")}
    on:keydown={(e) => (e.key === "Enter" || e.key === " ") && open("board")}
  >
    <span class="label">Community</span>
    <div class="cards-row">
      {#each Array(5) as _, i}
        <Card card={i < community.length ? community[i] : -1} />
      {/each}
    </div>
  </section>

  <section
    class="hero"
    role="button"
    tabindex="0"
    on:click={() => open("hero")}
    on:keydown={(e) => (e.key === "Enter" || e.key === " ") && open("hero")}
  >
    <span class="label">You</span>
    <div class="cards-row">
      {#each Array(2) as _, i}
        <Card card={i < hero.length ? hero[i] : -1} />
      {/each}
    </div>
  </section>

  <div class="villains">
    <Splide options={splideOptions} aria-label="Villains">
      {#each villains as v, i (i)}
        <SplideSlide>
          <div
            class="villain"
            class:empty={!v.notation.trim()}
            role="button"
            tabindex="0"
            on:click={() => open({ type: "villain", idx: i })}
            on:keydown={(e) =>
              (e.key === "Enter" || e.key === " ") &&
              open({ type: "villain", idx: i })}
          >
            <span class="label">Villain {i + 1}</span>
            <VillainDisplay
              notation={v.notation}
              dead={hero.concat(community)}
            />
          </div>
        </SplideSlide>
      {/each}
    </Splide>
  </div>
</div>

{#if editing === "hero"}
  <CardPickerModal
    open={true}
    cards={hero}
    usedCards={heroUsed}
    max={2}
    min={2}
    title="Your two cards"
    on:change={onHeroChange}
    on:close={closeModal}
  />
{:else if editing === "board"}
  <CardPickerModal
    open={true}
    cards={community}
    usedCards={communityUsed}
    max={5}
    min={3}
    title="Community cards"
    on:change={onCommunityChange}
    on:close={closeModal}
  />
{:else if editing && editing.type === "villain"}
  <RangePickerModal
    open={true}
    notation={villains[editing.idx].notation}
    title={`Villain ${editing.idx + 1} range`}
    removable={!!villains[editing.idx].notation.trim()}
    on:change={(e) => onVillainChange(editing.idx, e)}
    on:remove={() => clearVillain(editing.idx)}
    on:close={closeModal}
  />
{/if}

<style>
  .overview {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }
  .overview.disabled {
    pointer-events: none;
    opacity: 0.6;
  }
  .row {
    padding: 0.625rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    cursor: pointer;
    transition: border-color 100ms, background 100ms;
  }
  .label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #6b7280;
  }
  .cards-row {
    display: flex;
    gap: 0.25rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .villains {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .villains :global(.splide__pagination) {
    position: static;
    margin-top: 0.5rem;
    padding: 0;
    gap: 0.25rem;
  }
  .villains :global(.splide__pagination__page) {
    background: #d1d5db;
    opacity: 1;
    width: 0.5rem;
    height: 0.5rem;
  }
  .villains :global(.splide__pagination__page.is-active) {
    background: #000;
    transform: scale(1.2);
  }
  .villain {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    cursor: pointer;
    height: 100%;
    background: #f9fafb;
    transition: border-color 100ms, opacity 100ms;
  }
  .villain.empty {
    opacity: 0.75;
  }
  .villain:hover,
  .villain:focus-visible,
  .villain.empty:hover {
    opacity: 1;
    border-color: #000;
    outline: none;
  }
</style>
