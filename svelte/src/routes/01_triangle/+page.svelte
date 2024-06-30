<script>
	import { onMount } from 'svelte';
	import { Card } from 'flowbite-svelte';
	import { main } from './main';

	onMount(() => {
		main();
	});

	const docsLink = 'https://webgpufundamentals.org/webgpu/lessons/webgpu-fundamentals.html';
</script>

<Card href={docsLink} title="link to docs" target="_blank">
	<canvas id="root"></canvas>
</Card>
