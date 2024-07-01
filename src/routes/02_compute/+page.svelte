<script lang="ts">
	import { onMount } from 'svelte';
    import {Button, Input, Heading, FooterLink, InputAddon, Textarea, ButtonGroup} from 'flowbite-svelte';
	import { main } from './main';
    import {createEffect, createEvent, createStore, sample} from "effector";

    const inputStr = createStore('1,2,3');
    const result = createStore('');
    const perf = createStore(0);
    const count = createStore(inputStr.getState().split(',').length);

    const inputChanged = createEvent();
    const appendNumber = createEvent<number | undefined>();
    const setResult = createEvent<number[]>();

    const computeWebGPUFx = createEffect(async(input)=>{
     const t0 = performance.now();

     const data = await main(input);

     const t1 = performance.now();

     return {data, perf: t1 - t0}
    });

    // todo: create js compute fx

    const computeJSFx = createEffect((input)=>{
     const t0 = performance.now();

     const data = input.map(elem = elem ** 2);

     const t1 = performance.now();

     return {data, perf: t1 - t0}
    })

    sample({
     source: inputStr,
     clock: appendNumber,
     fn: (str, count = 1) => {
      const arr = str.split(',').map(Number);

      for(let i = 1; i <= count; i++) {
       arr.push(arr.at(-1) + 2);
      }

      return arr.join(',');
     },
     target: inputChanged,
    })

    sample({
     source: inputStr,
     fn: (val) => val.split(',').length,
     target: count
    })

    sample({
     clock: inputChanged,
     filter: (str) => {
      const regex = new RegExp('^[0-9,]+$');
      return str.match(regex);
     },
     target: inputStr
    });

    sample({
     source: inputStr,
     fn: (str) => str.split(','),
     target: computeWebGPUFx
    });

    sample({
     clock: computeWebGPUFx.doneData,
     fn: ({data}) => data.join(','),
     target: setResult
    });

    sample({
     clock: computeWebGPUFx.doneData,
     fn: ({perf}) => Math.floor(perf),
     target: perf
    });

    sample({
     clock: setResult,
     target: result
    });

	onMount(async() => {
        const input = inputStr.getState().split(',');
        const result = await main(input);
        setResult(result);
	});

	const docsLink = 'https://webgpufundamentals.org/webgpu/lessons/webgpu-fundamentals.html#a-run-computations-on-the-gpu';
</script>

<div class="flex flex-row gap-6">

 <div class="flex flex-col gap-2">
  <Heading tag="h3">WebGPU Compute:</Heading>
  <Heading tag="h6">Input:</Heading>
  <div class="flex flex-row gap-2">
   <Textarea value={$inputStr} on:change={(e)=>{ inputChanged(e.target.value) }}/>
   <ButtonGroup>
    <Button on:click={()=>appendNumber()}>+</Button>
    <Button on:click={()=>appendNumber(20)}>++</Button>
    <Button on:click={()=>appendNumber(200)}>+++</Button>
    <Button on:click={()=>appendNumber(2000)}>++++</Button>
   </ButtonGroup>
  </div>

  <Heading tag="h6">Result:</Heading>
  <Textarea value={$result}/>
  <span>count: {$count} items</span>
  <span>perf: {$perf} ms</span>
 </div>

<!-- <div class="flex flex-col gap-2">-->
<!--  <Heading tag="h3">JS Compute:</Heading>-->
<!--  <Heading tag="h6">Input:</Heading>-->
<!--  <div class="flex flex-row gap-2">-->
<!--   <Input value={$inputStr} on:change={(e)=>{ inputChanged(e.target.value) }}/>-->
<!--   <Button on:click={appendNumber}>+</Button>-->
<!--  </div>-->

<!--  <Heading tag="h6">Result:</Heading>-->
<!--  <Input value={result.getState()}/>-->
<!-- </div>-->

</div>
<FooterLink href={docsLink} title="link to docs" target="_blank">Docs</FooterLink>

