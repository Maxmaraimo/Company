/**
 * http://jsfiddle.net/gEhjZ/95/
 */
var	saveSelection = function (containerEl) {
	var doc = containerEl.ownerDocument;
	var win = doc.defaultView;
	var range = win.getSelection().getRangeAt(0);
	var preSelectionRange = range.cloneRange();
	preSelectionRange.selectNodeContents(containerEl);
	preSelectionRange.setEnd(range.startContainer, range.startOffset);
	var start = preSelectionRange.toString().length;
	return {
		start: start,
		end: start + range.toString().length,
	};
};
var	restoreSelection = function (containerEl, savedSel) {
	var doc = containerEl.ownerDocument;
	var win = doc.defaultView;
	var charIndex = 0;
	var range = doc.createRange();
	range.setStart(containerEl, 0);
	range.collapse(true);
	var nodeStack = [containerEl], node, foundStart = false, stop = false;
	while (!stop && (node = nodeStack.pop())) {
		if (node.nodeType == 3) {
			var nextCharIndex = charIndex + node.length;
			if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
				range.setStart(node, savedSel.start - charIndex);
				foundStart = true;
			}
			if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
				range.setEnd(node, savedSel.end - charIndex);
				stop = true;
			}
			charIndex = nextCharIndex;
		} else {
			var i = node.childNodes.length;
			while (i--) {
				nodeStack.push(node.childNodes[i]);
			}
		}
	}
	var sel = win.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
};

function additionalErrorHandle(html, mistakes) {
	var htmlWords = {};

	var doubleBrokenWord = html.match(/([a-zа-яё\-_]*)<span id="selectionBoundary[^]+?class="rangySelectionBoundary"[^]*?>[^]+?<\/span>([a-zа-яё\-_]*?)<span id="selectionBoundary[^]+?class="rangySelectionBoundary"[^]*?>[^]+?<\/span>([a-zа-яё\-_]*)/i);
	if (doubleBrokenWord) {
		htmlWords[doubleBrokenWord[1] + doubleBrokenWord[2] + doubleBrokenWord[3]] = doubleBrokenWord[0];
	} else {
		var regexp = /([a-zа-яё\-_]*)<span id="selectionBoundary[^]+?class="rangySelectionBoundary"[^]*?>[^]+?<\/span>([a-zа-яё\-_]*)/gi;
		var r;
		while (r = regexp.exec(html)) {
			htmlWords[r[1] + r[2]] = r[0];
		}
	}

	$.each(htmlWords, function (k2, v2) {
		html = html.replace(v2, '__htmlword-' + k2 + '__');
	});

	$.each(mistakes, function (k, v) {
		var word = v;
		if (word in htmlWords) {
			var regexp = new RegExp('(^|[^a-zа-яё_-])(' + '__htmlword-' + word.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&') + '__' + ')($|[^a-zа-яё_-])', 'gi');
			html = html.replace(regexp, '$1<word-error>$2</word-error>$3');
		}
		var regexp = new RegExp('(^|[^a-zа-яё_-])(' + word.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&') + ')($|[^a-zа-яё_-])', 'gi');
		html = html.replace(regexp, '$1<word-error>$2</word-error>$3');
	});

	$.each(htmlWords, function (k2, v2) {
		html = html.replace('__htmlword-' + k2 + '__', v2);
	});

	return html;
}

/**
 * Получить длину строки без тегов
 *
 * @param html
 * @returns {number}
 * @private
 */
var getTextLengthWithoutTags = function (html) {
	return getTextWithoutTags(html)
		.length ^ 0;
};

/**
 * Получить строку без тегов
 *
 * @param html
 * @returns {number}
 * @private
 */
var getTextWithoutTags = function (html) {
	return window.htmlToText ?
		window.htmlToText(html)
			.replace(/<\/?[^>]*>/gi, '')
			.replace(/&nbsp;/gi, ' ')
			.replace(/([ ]\n)|([ ]\r\n)/gi, '\n')	// Убираем все пробельные символы перед переносом строки
			.replace(/((\r\n)+)|(\n)+/gi, '\n')		// Заменяем двойные или более переносы строки на один
			.replace(/!\r\n/gi, '\n')							// Заменяем переносы с \n на \r\n
			.replace(/[ ][ ]+/g, ' ')								// Убираем двойные или более пробелы
			.trim() :
		html;
};

function trumbowygInit(t) {
	if (t.trumbowyg('html') == '') {
		t.trumbowyg('html', '<p><br></p>');
		var el = t.parent().find('.trumbowyg-editor')[0];
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(el.childNodes[0], 0);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	}
}

function saveBondaries(tagsHtml) {
	var tagsHtmlLocal = tagsHtml;

	if (tagsHtmlLocal[0] && typeof tagsHtmlLocal !== 'string') {
		tagsHtmlLocal = tagsHtmlLocal[0];
	}

	var boundaries = {};
	var html = tagsHtmlLocal.replace(/<span id="selectionBoundary_\d+_\d+" class="rangySelectionBoundary".*?>[^<>]+?<\/span>/gi, function (f, p1) {
		boundaries[p1] = f;
		return '##boundary_' + p1 + '##';
	});
	return {
		html: html,
		boundaries: boundaries,
	};
}

function restoreBondaries(html, boundaries) {
	html = html.replace(/##boundary_([^#]+)##/gi, function (f, p1) {
		if (p1 in boundaries) {
			return boundaries[p1];
		}
		return '';
	});
	return html;
}

function applyWordErrors(oldHtml, mistakes) {
	var html = oldHtml;
	html = html.replace(/<\/?word-error>/gi, '');

	var handledErrors = [];

	var errorId = -1;
	var errorWord = '';
	var errorWordCaret = 0;
	var errorWordStart = 0;
	var rangyCrop = false;
	var openTag = '<word-error>';
	var closeTag = '</word-error>';
	var errorTags = [];
	var spaceTags = new RegExp('<[^>]*?(?:p|br|li|div)[^>]*?>', 'i');
	var rangyOpenTag = new RegExp('<span id="selectionBoundary[^]+?>', 'i');
	var rangyCloseTag = new RegExp('</span[^>]*?>', 'i');
	var pos = 0;
	var tag = '';
	var mode = 0;

	for (var i = 0; i < html.length; i++) {
		var char = html[i];
		switch (mode) {
			case 0:
				if (char == '<') {
					tag += char;
					mode = 1;
					break;
				}
				if (!errorWord) {
					$.each(mistakes, function (k, v) {
						if (v[0] == pos) {
							errorWordStart = -1;
							errorId = k;
							errorWord = v[1];
							errorWordCaret = 0;
							return false;
						}
					});
				}
				if (errorWord) {
					if (char == errorWord[errorWordCaret]) {
						if (errorWordStart < 0) {
							errorWordStart = i;
						}
						errorWordCaret++;
						if (errorWordCaret >= errorWord.length) {
							errorTags.push([errorWordStart, i + 1]);
							handledErrors.push(errorId);
							errorId = -1;
							errorWord = '';
						}
					}
				}
				if (!rangyCrop) {
					pos++;
				}
				break;
			case 1:
				tag += char;
				if (char == '>') {
					if (rangyCrop && rangyCloseTag.test(tag)) {
						rangyCrop = false;
					} else if (rangyOpenTag.test(tag)) {
						rangyCrop = true;
					} else if (spaceTags.test(tag)) {
						pos++;
					}
					tag = '';
					mode = 0;
				}
				break;
		}
	}

	var newHtml = '';
	for (var i = 0; i < html.length; i++) {
		$.each(errorTags, function (k, v) {
			if (i == v[0]) {
				newHtml += openTag;
			} else if (i == v[1]) {
				newHtml += closeTag;
			}
		});
		newHtml += html[i];
	}

	var unhandledMistakes = [];
	$.each(mistakes, function (k, v) {
		if ($.inArray(k, handledErrors) == -1) {
			unhandledMistakes.push(v[1]);
		}
	});

	if (unhandledMistakes.length > 0) {
		// эта функция нужна на случай если что-то пошло не так. она тоже подчёркивает, но коряво
		// например, не могут сопоставиться позиции и дело доходит до этого метода
		// этого нужно избегать
		newHtml = additionalErrorHandle(newHtml, unhandledMistakes);
	}

	return newHtml;
}

/**
 * Удалить все теги и стили
 * @param tagsHtml
 * @param saveWordError
 * @returns {*}
 */
function removeTags(tagsHtml, saveWordError, saveLines, saveLineBreaks, saveControlChars) {
	var bd = saveBondaries(tagsHtml);
	var html = bd.html;

	if (saveLines) {
		html = html.replace(/<(\/?(?:p|br|div))[^>]*?>/g, '##$1##');
	}

	if (!saveControlChars) {
		html = html.replace(/[\x00-\x1F\x7F-\x9F\uFEFF]/g, '');
	}
	if (!saveLineBreaks) {
		html = html.replace(/\r\n/g, '\n');
		html = html.replace(/\n/g, '');
	}
	html = html.replace(/<style[^>]*>[^]+?<\/style>/gi, '');

	if (saveWordError) {
		html = html.replace(/(?!<\/?(word-error)>)<\/?[\s\w="-:&;?]+>/gi, '');
	} else {
		html = html.replace(/<\/?[^>]*>/gi, '');
	}

	html = html.replace(/&nbsp;/gi, ' ');
	html = restoreBondaries(html, bd.boundaries);

	if (saveLines) {
		html = html.replace(/##(\/?(?:p|br|div))##/g, '<$1>');
	}

	return html;
}

/**
 * Набор текста
 */
function onInputEditor(that, needCleanup, onInit) {
	var el = $(that);
	if (needCleanup === true) {
		var keepedSelection = null;
		try {
			keepedSelection = rangySelectionSaveRestore.saveSelection();
		} catch (e) {}
		var string = el.html();
		string = removeTags(string, false, true, true, true);
		el.html(string);
		if (keepedSelection) {
			try {
				rangySelectionSaveRestore.restoreSelection(keepedSelection);
			} catch (e) {}
		}
	}

	var string = el.html();
	var en = el.data('en');
	if (en) {
		newString = string.replace(/[А-Яа-яЁё]/g, '');
		if (newString != string) {
			el.html(newString);
		}
		string = newString;
	}

	var max = el.data('max');
	var editorLength = getTextLengthWithoutTags(string);
	var savedValue = el.data('savedValue') || '';
	var diff = editorLength - getTextLengthWithoutTags(savedValue);

	// если для поля задано максимальное значение и оно превышено не даём вводить и вставлять текст
	if (max && (editorLength > max) && (diff >= 0)) {
		var selection = saveSelection(el[0]);

		selection.end = selection.end - diff;
		selection.start = selection.start - diff;

		el.html(savedValue);
		restoreSelection(el[0], selection);

		return;
	} else {
		var $contentStorage = el.siblings('.js-content-storage');
		var textVal = getTextWithoutTags(string);
		var isNewTextCounter = el.data('text-counter');
		if (!isNewTextCounter) {
			$contentStorage.val(textVal);
		}
		$contentStorage.trigger('input');
	}

	el.data('savedValue', string);

	if (window.isLinuxOS) {
		caretLinuxFix.saveSelectionToData(el);
	}
}

/**
 * Костыли для восстановления каретки при смене языка на линухе
 * В linux любая управляющая последовательность активирующая интерфейс ОС будет вызывать двойное срабатывание blur/focus на поле ввода, и как следствие потерю положения каретки
 */
var caretLinuxFix = {
	/**
	 * Записывает последнее событие, способное установить фокус на элемент
	 * @param {Object} e
	 */
	documentClickKeydownHandler: function (e) {
		// событие клика, либо нажатие tab
		if (
			(e.type === 'click' && $(e.target).hasClass('js-content-editor')) ||
			(e.type === 'keydown' && e.keyCode === 9)
		) {
			window.lastFocusAffectedEvent = e;
			return;
		}

		window.lastFocusAffectedEvent = null;
	},

	/**
	 * Проверяет доступно ли сохранение выбора для элемента
	 * @param {Object} element
	 */
	isSelectionAvailable: function (element) {
		if (element && element.ownerDocument && element.ownerDocument.defaultView) {
			var selection = element.ownerDocument.defaultView.getSelection();
			if (selection && selection.rangeCount > 0) {
				return true;
			}
		}

		return false;
	},

	/**
	 * Сохраняет положение каретки в дата-аттрибут поля
	 * @param {Object} $editor
	 */
	saveSelectionToData: function ($editor) {
		var element = $editor[0];
		if (!element || !caretLinuxFix.isSelectionAvailable(element)) {
			return;
		}

		var selection = saveSelection(element);
		if (selection) {
			$editor.data('moz-selection', selection);
		}
	},

	/**
	 * Восстанавливаем каретку, если фокус установлен не юзером
	 * @param {Object} e
	 */
	restoreSelectionAfterNotUserEvents: function (e) {
		var $editor = $(e.target);
		var selection = $editor.data('moz-selection');
		if (
			!$editor.hasClass('js-content-editor') ||
			!selection ||
			window.lastFocusAffectedEvent
		) {
			return;
		}

		restoreSelection($editor[0], selection);
	},

	/**
	 * Инициализирует необходимые для работы костыля события
	 */
	initLinuxCaretEvents: function () {
		window.lastFocusAffectedEvent = null;

		$(document).on('click keydown', this.documentClickKeydownHandler);

		$(document).on('focus', '.of-form .js-content-editor', this.restoreSelectionAfterNotUserEvents);
	},
};

$(function () {
	window.isLinuxOS = window.navigator.platform &&
		/Linux/.test(window.navigator.platform);

	$(document).on('paste drop', '.of-form .js-content-editor', function (e) {
		var that = this;
		var $that = $(that);
		var insertType = 'insertText';
		var insertedText = (e.originalEvent || e).clipboardData.getData('text/plain');

		if ($that.is('.text-counter-init')) {
			insertedText = insertedText.replace(/( |&nbsp;)( |&nbsp;)+/g, ' '); // Вырезаем множественные пробелы
			insertType = 'insertHtml';
		}

		try {
			document.execCommand(insertType, false, insertedText);
			e.stopPropagation();
			e.preventDefault();
			onInputEditor(that);
		} catch (e) {
			setTimeout(function () { onInputEditor(that, true); }, 0);
		}
	});

	if (!window.noFieldsTrigger) {
		setTimeout(function () {
			$('.of-form .js-content-editor').each(function (index, el) {
				setTimeout(function () {
					onInputEditor(el, null, true);
				});
			});
		});
	}

	$(document).on('input', '.of-form .js-content-editor', function () { onInputEditor(this); });
	$(document).on('focus', '.of-form .js-content-editor', function (e) {
		$(e.target).closest('.vf-block').find('.kwork-save-step__field-hint').addClass('active');
	});
	$(document).on('blur', '.of-form .js-content-editor', function (e) {
		var el = $(this);
		var string = el.html();

		var editorLength = getTextLengthWithoutTags(string);
		if (editorLength > 0) {
			var $contentStorage = el.siblings('.js-content-storage');
			var textVal = getTextWithoutTags(string);
			if ($contentStorage.val() !== textVal) {
				$contentStorage.val(textVal);
			}
		}
	});

	if (window.isLinuxOS) {
		caretLinuxFix.initLinuxCaretEvents();
	}
});
