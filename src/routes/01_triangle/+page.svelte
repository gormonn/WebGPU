<script>
	import { onMount } from 'svelte';
	import { Card } from 'flowbite-svelte';
	import { main } from './main';

	const elemId = 'root-01';

	onMount(() => {
		main(elemId);
	});

	const docsLink = 'https://webgpufundamentals.org/webgpu/lessons/webgpu-fundamentals.html';
</script>

<Card href={docsLink} title="link to docs" target="_blank">
	<canvas id={elemId}></canvas>
</Card>
