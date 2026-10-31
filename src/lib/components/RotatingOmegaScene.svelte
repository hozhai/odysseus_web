<script lang="ts">
	import { T, useTask } from "@threlte/core";
	import { Shape } from "three";
	import { onMount } from "svelte";
	import type { Group } from "three";

	const omegaShape = new Shape();
	omegaShape.moveTo(-1.55, -1.32);
	omegaShape.lineTo(-0.62, -1.32);
	omegaShape.lineTo(-0.62, -0.98);
	omegaShape.bezierCurveTo(-0.96, -0.68, -1.08, -0.26, -1.08, 0.14);
	omegaShape.bezierCurveTo(-1.08, 0.88, -0.62, 1.42, 0, 1.42);
	omegaShape.bezierCurveTo(0.62, 1.42, 1.08, 0.88, 1.08, 0.14);
	omegaShape.bezierCurveTo(1.08, -0.26, 0.96, -0.68, 0.62, -0.98);
	omegaShape.lineTo(0.62, -1.32);
	omegaShape.lineTo(1.55, -1.32);
	omegaShape.lineTo(1.55, -0.98);
	omegaShape.lineTo(1.05, -0.98);
	omegaShape.bezierCurveTo(1.32, -0.57, 1.42, -0.12, 1.42, 0.28);
	omegaShape.bezierCurveTo(1.42, 1.18, 0.78, 1.78, 0, 1.78);
	omegaShape.bezierCurveTo(-0.78, 1.78, -1.42, 1.18, -1.42, 0.28);
	omegaShape.bezierCurveTo(-1.42, -0.12, -1.32, -0.57, -1.05, -0.98);
	omegaShape.lineTo(-1.55, -0.98);
	omegaShape.closePath();

	let omega = $state.raw<Group>();
	let prefersReducedMotion = $state(false);

	onMount(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updatePreference = () => {
			prefersReducedMotion = mediaQuery.matches;
		};

		updatePreference();
		mediaQuery.addEventListener("change", updatePreference);

		return () => mediaQuery.removeEventListener("change", updatePreference);
	});

	useTask((delta) => {
		if (!omega || prefersReducedMotion) return;

		omega.rotation.x += delta * 0.18;
		omega.rotation.y += delta * 0.22;
		omega.rotation.z += delta * 0.14;
	});
</script>

<T.Group bind:ref={omega}>
	<T.Mesh position.z={-0.2}>
		<T.ExtrudeGeometry
			args={[
				omegaShape,
				{
					depth: 0.4,
					bevelEnabled: false,
					curveSegments: 32
				}
			]}
		/>
		<T.MeshStandardMaterial color="#93b1e3" metalness={0.62} roughness={0.24} />
	</T.Mesh>
</T.Group>
<T.AmbientLight intensity={1.5} />
<T.DirectionalLight position={[-3, 4, 5]} intensity={3} />
<T.DirectionalLight position={[4, 1, -3]} intensity={2} />
