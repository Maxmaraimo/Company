$(document).ready(function(zaym){
	$("#slider4").slider({
		range: "min",
		value: 14,//Значение, которое будет выставлено слайдеру при загрузке
		min: 7,//Минимально возможное значение на ползунке
		max: 60,//Максимально возможное значение на ползунке
		step: 1,//Шаг, с которым будет двигаться ползунок
		slide: onSlide,
		stop : function() {
			$('.block-kol').fadeTo(0,1)  
		}
	});
	$("#slider3").slider({
		range: "min",
		value: 10000,//Значение, которое будет выставлено слайдеру при загрузке
		min: 1000,//Минимально возможное значение на ползунке
		max: 50000,//Максимально возможное значение на ползунке
		step: 500,//Шаг, с которым будет двигаться ползунок
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
		price = $('#slider3').slider('value'),
		days = $('#slider4').slider('value');

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