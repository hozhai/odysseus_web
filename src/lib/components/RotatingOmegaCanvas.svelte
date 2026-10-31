<script lang="ts">
	import { Canvas, T } from "@threlte/core";
	import RotatingOmegaScene from "./RotatingOmegaScene.svelte";
</script>

<Canvas dpr={[1, 1.5]}>
	<T.PerspectiveCamera makeDefault position={[0, 0, 7]} fov={35} />
	<RotatingOmegaScene />
</Canvas>
