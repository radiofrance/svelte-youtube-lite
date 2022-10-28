export function getYTApiRequirements() {
	// navigator.vendor seems to be deprecated : https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vendor
	return navigator?.vendor.includes('Apple') || navigator?.userAgent.includes('Mobi');
}

export function createYoutubeEmbed(
	YTApiContainer: HTMLElement,
	youtubeId: string,
	params: URLSearchParams
) {
	return () => {
		const paramsObj = Object.fromEntries(params.entries());
		new window.YT.Player(YTApiContainer, {
			width: '100%',
			host: 'https://www.youtube-nocookie.com',
			videoId: youtubeId,
			playerVars: paramsObj,
			events: {
				onReady: (event) => {
					event.target.playVideo();
				}
			}
		});
	};
}
