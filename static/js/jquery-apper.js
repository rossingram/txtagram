// Fade buttons on hover
$(document).ready(function() {
	if($.support.opacity) {
	$('.fader').hover(
		function() {
			$(this).stop().animate({opacity:0.75, filter: ''},100);
		},
		function() {
			$(this).stop().animate({opacity:1, filter: ''},100);
	});
	}
});

// "Blinking" message
$(document).ready(function() {
	$('.error_message, .ok_message, .msg_bottom').hide();
	$('.error_message, .ok_message, .msg_bottom').fadeIn(900);
});

// Sliding share box
$(document).ready(function() {
	$("#sliding_share .button").toggle(
		function () {
			$("#sliding_share").animate({left:'0'},600);
		},
		function () {
			$("#sliding_share").animate({left:'-70px'},600);
		}
	); return false;
});

// Auto-clear input
$(document).ready(function() {
	$(".field").ClearInput();
});
(function($) {$.fn.ClearInput = function() {
	$(this).each(function() {
		var DefaultValue = this.defaultValue;
		$(this).focus(function(){
			var CurrValue = $(this).val();
			if(CurrValue == DefaultValue) {
				$(this).val("");
			}
		});
		$(this).blur(function(){
			var CurrValue = $(this).val();
			if(CurrValue.length == 0) {
				$(this).val(DefaultValue);
			}
		});
	});
}})(jQuery);
