var KatalogAnserCommentsID = new Array();
var TreeComWysiwyg = false;

function KatalogComPage( page, katalog_id, link_tpl ){
	
	KatalogAllCancelAnswer();
	if( document.getElementById( "status-nav-com" ) != null )
		{
			document.getElementById( "status-nav-com" ).innerHTML = "<img src=\"/templates/" + dle_skin + "/katalog/style/horizont-ajax.gif\" border=\"0\" alt=\"Загрузка\" align=\"absmiddle\" />";
		}
	
	$.ajax({
		url: "/engine/ajax/katalog/com-navigation.php",
		data: "com_page=" + page + "&katalog_id=" + katalog_id + "&link_tpl=" + link_tpl,
		success: function( data ){
			$( "#katalog_comments" ).html( data );
			window.location = "#comment";
		},
		dataType: "html",
		type: "POST"
	});
	
}


function KatalogAddComments(){

	var Url = "";
	var form = document.forms['AddKatalogComment'];
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
		url: dle_root + "engine/ajax/katalog/addcomments.php",
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
							document.getElementById( "KatalogCommentsList" ).appendChild( Element );
							Element.id = "new_comment_" + new_id;
							$( "#" + Element.id ).html( data );					
						}
						
					if( document.getElementById( "KatalogNotComment" ) != null )
						{
							var DelElement = document.getElementById( "KatalogNotComment" );
							DelElement.parentNode.removeChild( DelElement );
						}
						
					if( form.answer_id )
						{
							var ObjCom = document.getElementById( "tree_comments_form-" + form.answer_id.value );
							ObjCom.id = "tree_comments_result-" + form.answer_id.value;
							KatalogAllCancelAnswer();
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
					document.getElementById( "KatalogCommentsList" ).appendChild( Element );
					Element.id = "new_comment_" + new_id;
					$( "#" + Element.id ).html( data );	
				}
			
			if( document.getElementById( "dle-captcha") != null )
				{
					KatalogReCaptcha();
					form.sec_code.value = "";
				}
		},
		dataType: "html",
		type: "POST"
	});
}

// Удаление отзыва
function KatalogDelCom( id, katalog_id, otziv ){
	
	var Quest = confirm( "Вы действительно желаете удалить данный отзыв?" );
	if( Quest )
		{
			document.getElementById( "comm-id-" + id ).innerHTML = "Происходит удаление, дождитесь ответа...";	
			
			$.ajax({
				url: dle_root + "engine/ajax/katalog/com-del.php",
				data: "id=" + id + "&katalog_id=" + katalog_id + "&otziv=" + otziv,
				success: function( data ){
					$( "#comm-id-" + id ).html( data );
				},
				dataType: "html",
				type: "POST"
			});	
		}	
}

// Редактирование отзыва
var KatalogCasheComEdit = new Array();
function KatalogEditCom( id ){
	
	if( !KatalogCasheComEdit[ id ] ) KatalogCasheComEdit[ id ] = document.getElementById( "comm-id-" + id ).innerHTML;
	document.getElementById( "comm-id-" + id ).innerHTML = "Загрузка, дождитесь ответа...";	
	
	$.ajax({
		url: dle_root + "engine/ajax/katalog/com-edit.php",
		data: "id=" + id,
		success: function( data ){
			$( "#comm-id-" + id ).html( data );
			fombj = document.forms['AddKatalogComment'];
		},
		dataType: "html",
		type: "POST"
	});
}

// Сохранение редактирования отзыва
function KatalogSaveEditCom( id, photo_id ){
	
	var Comment = document.getElementById( "dleeditcomments" + id ).value;
		
	document.getElementById( "comm-id-" + id ).innerHTML = "Сохранение, дождитесь ответа...";
	
	$.ajax({
		url: dle_root + "engine/ajax/katalog/com-edit.php",
		data: "id=" + id + "&comments=" + Comment + "&save=1",
		success: function( data ){
			$( "#comm-id-" + id ).html( data );
		},
		dataType: "html",
		type: "POST"
	});
}

// Отмена редактирования отзыва
function CanceKatalogEditCom( id ){
	document.getElementById( "comm-id-" + id ).innerHTML = KatalogCasheComEdit[ id ];
	KatalogCasheComEdit[ id ] = "";
}




function KatalogformSubmit( nameForm, file, IdResult, img, imgId ){		
		
	if( !IdResult ) IdResult = "";
	if( !img ) img = "";
	if( !imgId ) ShowLoading( "" );
	if( !file ) return false;
		
	var Url = "";
	var formSend = document.forms[ nameForm ];
		
	if( imgId ) document.getElementById( imgId ).innerHTML = "<img src=\"/engine/inc/katalog/style/images/" + img + "\" border=\"0\" alt=\"Загрузка\" />";
		
	for( var i = 0; i < formSend.elements.length; i++ )
		{
			var ElementForm = formSend.elements[i];
			switch( ElementForm.type )
				{
					case "checkbox": {
						if( ElementForm.checked == true )
							{
								Url += "&" + ElementForm.name + "=" + ElementForm.value;
							}
						break
					}
						
					case "select-multiple": {
						for( var imultiple = 0; imultiple < ElementForm.options.length; imultiple++ )
							{
								if( ElementForm.options[ imultiple ].selected )
									{
										Url += "&" + ElementForm.name + "=" + ElementForm.options[imultiple].value;
									}
							}
						break
					}
					
					case "radio": {
						var radioObj = formSend[ ElementForm.name ];
						for( var imultiple = 0; imultiple < radioObj.length; imultiple++ )
							{
								if ( radioObj[ imultiple ].checked == true )
									{
										Url += "&" + ElementForm.name + "=" + radioObj[ imultiple ].value;
										radio = true;
									}
							}
						break
					}
						
					case "hidden": {
						Url += "&" + ElementForm.name + "=" + ElementForm.value;
						break
					}
						
					case "text": {
						Url += "&" + ElementForm.name + "=" + ElementForm.value;
						break
					}
						
					default: {
						Url += "&" + ElementForm.name + "=" + ElementForm.value;
						break
					}
				}
		}
		
	$.ajax({
		url: "/engine/ajax/katalog/" + file,
		data: Url,
		success: function( data ){
			if( !imgId ) HideLoading( "" );
			if( IdResult ) $( "#" + IdResult ).html( data );
		},
		dataType: "html",
		type: "POST"
	});
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