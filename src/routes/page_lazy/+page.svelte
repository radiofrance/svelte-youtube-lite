<script>
	import Youtube from '$lib/Youtube.svelte';

	const id = '9jLTaiT_cVs';
</script>

<svelte:head>
	<title>Lazy loading demo - svelte-youtube-lite</title>
</svelte:head>

<div class="page">
	<a class="back-link" href="/">Back to demo</a>

	<h1>Lazy loading demo</h1>

	<div class="content">
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere, arcu at faucibus
			tristique, erat odio finibus risus, et gravida arcu lorem sed nisl. Donec sagittis, dolor
			vitae dignissim pretium, justo nunc tincidunt velit, sed porttitor mauris lectus non lorem.
		</p>
		<p>
			Aliquam erat volutpat. Morbi vestibulum sem a mi aliquet, in ultrices neque malesuada.
			Maecenas et lacus sit amet lectus luctus tincidunt. Curabitur non lacus sed tortor interdum
			lacinia vitae a quam.
		</p>
		<p>
			Suspendisse potenti. Phasellus pretium, ligula nec cursus tristique, elit lacus commodo
			libero, sed faucibus velit turpis vitae augue. Vivamus in bibendum nulla, at vehicula risus.
		</p>
		<p>
			Proin pulvinar consequat mauris, a lacinia neque mattis et. Cras id lectus non nisi congue
			sagittis. Praesent molestie enim in risus rhoncus, vitae feugiat massa pellentesque.
		</p>
		<p>
			Nam sit amet feugiat lorem. Nunc pellentesque felis id gravida vestibulum. Donec consequat
			rutrum arcu, sed vestibulum est sodales et. Nulla facilisi. Integer maximus sem vitae nulla
			rhoncus suscipit.
		</p>
		<p>
			Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis
			efficitur malesuada erat, eget porttitor turpis mattis vitae. Sed ullamcorper mauris at quam
			sollicitudin, id faucibus magna venenatis.
		</p>
		<p>
			Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
			Etiam in erat ullamcorper, pretium risus vel, posuere purus. Donec tempor mi non turpis
			tristique, eget maximus velit viverra.
		</p>
		<p>
			Curabitur malesuada metus quis sem fermentum, vitae placerat est mattis. Integer ut massa
			pulvinar, tempor velit sit amet, sodales ligula. Fusce tempor vulputate orci, sed suscipit
			lorem luctus sed.
		</p>
	</div>

	<h2>Video below the fold</h2>
	<Youtube {id} lazy title="Lazy loaded YouTube thumbnail" />
</div>

<style>
	.page {
		max-width: 608px;
		margin-left: auto;
		margin-right: auto;
		padding-bottom: 4rem;
	}

	.back-link {
		display: inline-block;
		margin-top: 1rem;
	}

	.content {
		margin-bottom: 4rem;
	}

	.content p {
		margin: 0 0 3rem;
		line-height: 1.8;
	}
</style>
