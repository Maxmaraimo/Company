var Youtube = (function () {
	var video;
	var results;
	var thumbSize;

	var getThumb = function (url, size) {
		if (url === null) {
			return '';
		}

		thumbSize = (size === null) ? 'big' : size;
		results = url.match(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/);
		video = (results === null) ? url : results[1];

		if (thumbSize === 'small') {
			return 'https://img.youtube.com/vi/' + video + '/2.jpg';
		}

		if (thumbSize === 'max') {
			return 'https://img.youtube.com/vi/' + video + '/maxresdefault.jpg';
		}

		return 'https://img.youtube.com/vi/' + video + '/0.jpg';
	};

	var isYoutubeUrl = function (url) {
		var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
		if (url && url.match(p)) {
			return true;
		}
		return false;
	};

	return {
		thumb: getThumb,
		isUrl: isYoutubeUrl,
	};
}());
