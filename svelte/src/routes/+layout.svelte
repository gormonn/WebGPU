<script>
	import { Navbar, NavLi, NavUl } from 'flowbite-svelte';
	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;

	/** @type {import('./$types').PageData} */
	export let data;

	import '../app.css';
</script>

<main class="mx-12 mt-12 flex flex-row gap-6">
	<Navbar class="bg-amber-400 w-auto">
		<NavUl {activeUrl} ulClass="flex flex-col">
			<NavLi href="/">Home</NavLi>
			{#each data.routes as route}
				<NavLi href="/{route}">- {route}</NavLi>
			{/each}
		</NavUl>
	</Navbar>

	<div class="flex flex-col gap-6">
		<slot></slot>
	</div>
</main>

<footer class="fixed bottom-0 p-6 bg-amber-950 text-amber-50 w-screen text-right">
	Built with: <a href="https://kit.svelte.dev/" target="_blank">Svelte</a>.
</footer>

<style lang="postcss">
	:global(html) {
		@apply bg-amber-200;
	}
</style>
