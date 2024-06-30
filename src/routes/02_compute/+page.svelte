<script>
	import { onMount } from 'svelte';
	import { Card } from 'flowbite-svelte';
	import { main } from './main';

	const elemId = 'root2';

	onMount(() => {
		main(elemId);
	});

	const docsLink = 'https://webgpufundamentals.org/webgpu/lessons/webgpu-fundamentals.html#a-run-computations-on-the-gpu';
</script>

<Card href={docsLink} title="link to docs" target="_blank">
	<canvas id={elemId}></canvas>
</Card>
