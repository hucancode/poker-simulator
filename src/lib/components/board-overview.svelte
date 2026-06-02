<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { handTextToArray, handArrayToText } from "$lib/poker/cards";
  import Card from "$lib/components/card.svelte";
  import VillainDisplay from "$lib/components/villain-display.svelte";
  import CardPickerModal from "$lib/components/card-picker-modal.svelte";
  import RangePickerModal from "$lib/components/range-picker-modal.svelte";
  import { register } from "swiper/element/bundle";

  let swiperEl;

  export let disabled = false;

  const VILLAIN_NAMES = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Heidi"];
  const VILLAIN_SLOTS = VILLAIN_NAMES.length;
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
  export function getActiveVillainNames() {
    return VILLAIN_NAMES.filter((_, i) => villains[i].notation.trim());
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

  const swiperParams = {
    slidesPerView: 1.5,
    slidesPerGroup: 1,
    spaceBetween: 8,
    pagination: { clickable: true },
    navigation: false,
    slidesOffsetAfter: 24,
    breakpoints: {
      500: { slidesPerView: 2, navigation: true, slidesOffsetAfter: 0 },
      900: { slidesPerView: 3, navigation: true, slidesOffsetAfter: 0 },
    },
  };

  onMount(() => {
    register();
    if (swiperEl) {
      Object.assign(swiperEl, swiperParams);
      swiperEl.initialize();
    }
  });
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
    <swiper-container bind:this={swiperEl} init="false" aria-label="Villains">
      {#each villains as v, i (i)}
        <swiper-slide>
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
            <span class="label">{VILLAIN_NAMES[i]}</span>
            <VillainDisplay
              notation={v.notation}
              dead={hero.concat(community)}
            />
          </div>
        </swiper-slide>
      {/each}
    </swiper-container>
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
    title={`${VILLAIN_NAMES[editing.idx]} range`}
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
  .villains swiper-container {
    width: 100%;
    --swiper-pagination-color: var(--fg);
    --swiper-pagination-bullet-inactive-color: var(--border);
    --swiper-pagination-bullet-inactive-opacity: 1;
    --swiper-pagination-bullet-size: 0.5rem;
    --swiper-pagination-bullet-horizontal-gap: 0.25rem;
    --swiper-navigation-color: var(--fg);
    --swiper-navigation-size: 1.25rem;
  }
  .villains :global(swiper-container::part(wrapper)) {
    padding-bottom: 2rem;
  }
  .villain {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    cursor: pointer;
    height: 100%;
    background: var(--card-bg);
    color: var(--fg);
    transition: border-color 100ms, opacity 100ms;
  }
  .villain.empty {
    opacity: 0.75;
  }
  .villain:hover,
  .villain:focus-visible,
  .villain.empty:hover {
    opacity: 1;
    border-color: var(--fg);
    outline: none;
  }
</style>
