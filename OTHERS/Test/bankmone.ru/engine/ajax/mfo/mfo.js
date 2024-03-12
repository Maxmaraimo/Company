
var MfoAnserCommentsID = new Array();
var TreeComWysiwyg = false;



// Навигация по отзывам
function MfoComPage( page, mfo_id, link_tpl ){
	
	MfoAllCancelAnswer();
	if( document.getElementById( "status-nav-com" ) != null )
		{
			document.getElementById( "status-nav-com" ).innerHTML = "<img src=\"/templates/" + dle_skin + "/mfo/style/horizont-ajax.gif\" border=\"0\" alt=\"Загрузка\" align=\"absmiddle\" />";
		}
	
	$.ajax({
		url: "/engine/ajax/mfo/com-navigation.php",
		data: "com_page=" + page + "&mfo_id=" + mfo_id + "&link_tpl=" + link_tpl,
		success: function( data ){
			$( "#mfo_comments" ).html( data );
			window.location = "#comment";
		},
		dataType: "html",
		type: "POST"
	});
	
}

// Добавлеение комментария
function MfoAddComments(){

	var Url = "";
	var form = document.forms['AddMfoComment'];
    ShowLoading( "Отзыв успешно отправлен.<br><br>В ближайшее время он будет опубликован." );
	setTimeout(function() { location.reload() }, 3000);
	
	for( var i=0; i < form.elements.length; i++ )
		{
			var ElementForm = form.elements[i];
			switch( ElementForm.type ){
				
				case "checkbox": {
					if( ElementForm.checked == true )
						{
							Url += "&" + ElementForm.name + "=" + ElementForm.value;
						}
					break
				}
				
				default: {
					Url += "&" + ElementForm.name + "=" + ElementForm.value;
					break
				}
			}
		}

	$.ajax({
		url: dle_root + "engine/ajax/mfo/addcomments.php",
		data: Url,
		success: function( data ){
			
			setTimeout(function() { HideLoading( "Отзыв успешно отправлен.<br>В ближайшее время он будет опубликован." ) }, 5000);

			if( /script language/i.exec( data ) == null )
				{
					if( form.answer_id )
						{
							$( "#tree_comments_form-" + form.answer_id.value ).html( data );
							document.getElementById( "button_answer_to_" + form.answer_id.value ).innerHTML = "";
						}
							else
						{
							var new_id = Math.floor( Math.random() * ( 100 - 5 + 1 ) ) + 5;
							var Element = document.createElement( "div" );
							document.getElementById( "MfoCommentsList" ).appendChild( Element );
							Element.id = "new_comment_" + new_id;
							$( "#" + Element.id ).html( data );					
						}
						
					if( document.getElementById( "MfoNotComment" ) != null )
						{
							var DelElement = document.getElementById( "MfoNotComment" );
							DelElement.parentNode.removeChild( DelElement );
						}
						
					if( form.answer_id )
						{
							var ObjCom = document.getElementById( "tree_comments_form-" + form.answer_id.value );
							ObjCom.id = "tree_comments_result-" + form.answer_id.value;
							MfoAllCancelAnswer();
						}
						
					if( dle_group == 5 )
						{
							form.name.value = "";
							form.com_mail.value = "";
						}
					
					form.comments.value = "";
					
				}
					else
				{
					var new_id = Math.floor( Math.random() * ( 100 - 5 + 1 ) ) + 5;
					var Element = document.createElement( "div" );
					document.getElementById( "MfoCommentsList" ).appendChild( Element );
					Element.id = "new_comment_" + new_id;
					$( "#" + Element.id ).html( data );	
				}
			
			if( document.getElementById( "dle-captcha") != null )
				{
					MfoReCaptcha();
					form.sec_code.value = "";
				}
		},
		dataType: "html",
		type: "POST"
	});
}

// Удаление отзыва
function MfoDelCom( id, mfo_id, otziv ){
	
	var Quest = confirm( "Вы действительно желаете удалить данный отзыв?" );
	if( Quest )
		{
			document.getElementById( "comm-id-" + id ).innerHTML = "Происходит удаление, дождитесь ответа...";	
			
			$.ajax({
				url: dle_root + "engine/ajax/mfo/com-del.php",
				data: "id=" + id + "&mfo_id=" + mfo_id + "&otziv=" + otziv,
				success: function( data ){
					$( "#comm-id-" + id ).html( data );
				},
				dataType: "html",
				type: "POST"
			});	
		}	
}

// Редактирование отзывов
var MfoCasheComEdit = new Array();
function MfoEditCom( id ){
	
	if( !MfoCasheComEdit[ id ] ) MfoCasheComEdit[ id ] = document.getElementById( "comm-id-" + id ).innerHTML;
	document.getElementById( "comm-id-" + id ).innerHTML = "Загрузка, дождитесь ответа...";	
	
	$.ajax({
		url: dle_root + "engine/ajax/mfo/com-edit.php",
		data: "id=" + id,
		success: function( data ){
			$( "#comm-id-" + id ).html( data );
			fombj = document.forms['AddMfoComment'];
		},
		dataType: "html",
		type: "POST"
	});
}

// Сохранение редактирования отзыва
function MfoSaveEditCom( id, photo_id ){
	
	var Comment = document.getElementById( "dleeditcomments" + id ).value;
		
	document.getElementById( "comm-id-" + id ).innerHTML = "Сохранение, дождитесь ответа...";
	
	$.ajax({
		url: dle_root + "engine/ajax/mfo/com-edit.php",
		data: "id=" + id + "&comments=" + Comment + "&save=1",
		success: function( data ){
			$( "#comm-id-" + id ).html( data );
		},
		dataType: "html",
		type: "POST"
	});
}

// Отмена редактирования отзыва
function CanceMfoEditCom( id ){
	document.getElementById( "comm-id-" + id ).innerHTML = MfoCasheComEdit[ id ];
	MfoCasheComEdit[ id ] = "";
}


$(function() {

var selectName = $('select').attr('name');
var hidden = $('<input type="hidden" name="'+selectName+'">');
hidden.val($('select').val());
hidden.insertAfter($('select'));

$("select option").unwrap().each(function() {
    var btn = $('<div class="btnra">'+$(this).text()+'</div>');
    if($(this).is(':checked')) btn.addClass('on');
    $(this).replaceWith(btn);
});

$(document).on('click', '.btnra', function() {
    $('.btnra').removeClass('on');
    $(this).addClass('on');
    $('input[name="'+selectName+'"]').val($(this).text());
});

});

