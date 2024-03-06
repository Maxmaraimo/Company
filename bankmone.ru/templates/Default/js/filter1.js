$("#nal").ready(function(nal){
	$("#slider2").slider({
		range: "min",
		value: 12,//Значение, которое будет выставлено слайдеру при загрузке
		min: 6,//Минимально возможное значение на ползунке
		max: 60,//Максимально возможное значение на ползунке
		step: 6,//Шаг, с которым будет двигаться ползунок
		slide: onSlide,
		stop : function() {
			$('.block-kol').fadeTo(0,1)  
		}
	});
	$("#slider1").slider({
		range: "min",
		value: 100000,//Значение, которое будет выставлено слайдеру при загрузке
		min: 10000,//Минимально возможное значение на ползунке
		max: 1000000,//Максимально возможное значение на ползунке
		step: 10000,//Шаг, с которым будет двигаться ползунок
		slide: onSlide,
		stop : function() {
			$('.block-kol').fadeTo(0,1) 
		}
		
	});
	
	function onSlide(e, ui) {
		$('.block-kol').fadeTo(0, 0.5);
		$(this).closest('.filter-block').find('.right-nomer-value').html(ui.value);
		setTimeout(showItems);
	}
	
	function showItems() {   
		const
		price = $('#slider1').slider('value'),
		days = $('#slider2').slider('value');

	$('.kr-offer').each(function() {
		const $this = $(this);
		$this.toggle(
			price <= parseInt($this.find('.kr-offer-summa').text().replace(/\D/g, '')) &&
			days <= parseInt($this.find('.kr-offer-srok').text().replace(/\D/g, ''))
		);
	});

	$('.no-offer').toggle(!$('.kr-offer:visible').length);
}

showItems();
});
