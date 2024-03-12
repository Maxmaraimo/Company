
var BankiAnserCommentsID = new Array();
var TreeComWysiwyg = false;

// Навигация по комментариям
function BankiComPage( page, banki_id, link_tpl ){
	
	BankiAllCancelAnswer();
	if( document.getElementById( "status-nav-com" ) != null )
		{
			document.getElementById( "status-nav-com" ).innerHTML = "<img src=\"/templates/" + dle_skin + "/banki/style/horizont-ajax.gif\" border=\"0\" alt=\"Загрузка\" align=\"absmiddle\" />";
		}
	
	$.ajax({
		url: "/engine/ajax/banki/com-navigation.php",
		data: "com_page=" + page + "&banki_id=" + banki_id + "&link_tpl=" + link_tpl,
		success: function( data ){
			$( "#banki_comments" ).html( data );
			window.location = "#comment";
		},
		dataType: "html",
		type: "POST"
	});
	
}

// Добавлеение комментария
function BankiAddComments(){

	var Url = "";
	var form = document.forms['AddBankiComment'];
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
		url: dle_root + "engine/ajax/banki/addcomments.php",
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
							document.getElementById( "BankiCommentsList" ).appendChild( Element );
							Element.id = "new_comment_" + new_id;
							$( "#" + Element.id ).html( data );					
						}
						
					if( document.getElementById( "BankiNotComment" ) != null )
						{
							var DelElement = document.getElementById( "BankiNotComment" );
							DelElement.parentNode.removeChild( DelElement );
						}
						
					if( form.answer_id )
						{
							var ObjCom = document.getElementById( "tree_comments_form-" + form.answer_id.value );
							ObjCom.id = "tree_comments_result-" + form.answer_id.value;
							BankiAllCancelAnswer();
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
					document.getElementById( "BankiCommentsList" ).appendChild( Element );
					Element.id = "new_comment_" + new_id;
					$( "#" + Element.id ).html( data );	
				}
			
			if( document.getElementById( "dle-captcha") != null )
				{
					BankiReCaptcha();
					form.sec_code.value = "";
				}
		},
		dataType: "html",
		type: "POST"
	});
}

// Удаление отзыва
function BankiDelCom( id, banki_id, otziv ){
	
	var Quest = confirm( "Вы действительно желаете удалить данный отзыв?" );
	if( Quest )
		{
			document.getElementById( "comm-id-" + id ).innerHTML = "Происходит удаление, дождитесь ответа...";	
			
			$.ajax({
				url: dle_root + "engine/ajax/banki/com-del.php",
				data: "id=" + id + "&banki_id=" + banki_id + "&otziv=" + otziv,
				success: function( data ){
					$( "#comm-id-" + id ).html( data );
				},
				dataType: "html",
				type: "POST"
			});	
		}	
}

// Редактирование отзывов
var BankiCasheComEdit = new Array();
function BankiEditCom( id ){
	
	if( !BankiCasheComEdit[ id ] ) BankiCasheComEdit[ id ] = document.getElementById( "comm-id-" + id ).innerHTML;
	document.getElementById( "comm-id-" + id ).innerHTML = "Загрузка, дождитесь ответа...";	
	
	$.ajax({
		url: dle_root + "engine/ajax/banki/com-edit.php",
		data: "id=" + id,
		success: function( data ){
			$( "#comm-id-" + id ).html( data );
			fombj = document.forms['AddBankiComment'];
		},
		dataType: "html",
		type: "POST"
	});
}

// Сохранение редактирования отзыва
function BankiSaveEditCom( id, photo_id ){
	
	var Comment = document.getElementById( "dleeditcomments" + id ).value;
		
	document.getElementById( "comm-id-" + id ).innerHTML = "Сохранение, дождитесь ответа...";
	
	$.ajax({
		url: dle_root + "engine/ajax/banki/com-edit.php",
		data: "id=" + id + "&comments=" + Comment + "&save=1",
		success: function( data ){
			$( "#comm-id-" + id ).html( data );
		},
		dataType: "html",
		type: "POST"
	});
}

// Отмена редактирования отзыва
function CanceBankiEditCom( id ){
	document.getElementById( "comm-id-" + id ).innerHTML = BankiCasheComEdit[ id ];
	BankiCasheComEdit[ id ] = "";
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