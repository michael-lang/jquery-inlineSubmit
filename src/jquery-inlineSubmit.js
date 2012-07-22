/* candorCircle inline submit widget.
*/
(function ($) {
	$.widget("candorCircle.inlineSubmit", {
		options: {
			savingTemplate: "<span class=\"responseStatus\"><span class=\"animated-saving\">saving...</span></span>",
			savedTemplate: "<span class=\"responseStatus\"><span class=\"saved\">saved</span></span>",
			failedTemplate: "<span class=\"responseStatus\"><span class=\".ui-state-error failed\">failed <a href=\"#\" class=\"try-again\">try again</a></span></span>",
			success: function (prms) { },
			error: function (prms) { },
			complete: function (prms) { },
			responseContainer: ".response-status" //selector from parent node or function given input reference
		},
		_self: null,
		_create: function () {
			_self = this;
			if (this.element.is(':text') || this.element.is('textarea')) {
				this.element.focusin(function () {
					$(this).data("originalValue", $.trim($(this).val()));
					$(this).addClass("focusIn"); // TODO: Need to investigate why this doesn't work.
					$(this).css("border-color", "#46FF00"); // change to css style
				}).focusout(function () {
					if ($(this).data("originalValue") != $.trim($(this).val())) {
						if ($(this).parents("form").validate().element(this)) {
							_self.save($(this), $.trim($(this).val()));
						}
					}

					$(this).removeClass("focusIn"); // TODO: Need to investigate why this doesn't work.
					$(this).css("border-color", "ActiveBorder"); // change to css style
				});
			} else if (this.element.is("select")) {
				this.element.data("originalValue", $.trim(this.element.val()));
				this.element.change(function () {
					if ($(this).data("originalValue") != $.trim($(this).val())) {
						_self.save($(this), $(this).val());
						$(this).data("originalValue", $.trim($(this).val()));
					}
				});
			} else if (this.element.is(":radio")) {
				this.element.data("originalValue", $.trim($("input[name='" + $(this).attr("name") + "']:checked").val()));
				this.element.click(function () {
					if ($(this).data("originalValue") != $.trim($("input[name='" + $(this).attr("name") + "']:checked").val())) {
						_self.save($(this), $("input[name='" + $(this).attr("name") + "']:checked").val());
					}
				});
			}
		},
		destroy: function () {
			//nothing to do?
		},
		save: function (propertyInput, propertyValue) {
			var theForm = $(propertyInput).closest('form').first();
			var propName = propertyInput.attr("name");
			if (propName == undefined) {
				propName = propertyInput.attr("id");
			}
			var serializedData = 'propertyName=' + propName + '&propertyValue=' + encodeURIComponent(propertyValue) + '&inlineSubmit=inlineSubmit';
			_self._showSaving(propertyInput);

			$.ajax({
				type: "post",
				url: $(theForm).attr("action"),
				data: serializedData,
				success: function (data, textStatus, jqXHR) {
					if (data.success == true) {
						if (data.refreshRequired) // for major changes
							location.reload(true);
						_self._showSavedSuccess(propertyInput);
						$(".try-again").click(); //retry all previous failed changes pending
					} else {
						_self._showFailure(propertyInput, propertyValue);
					}
					var evt = _self.options.success;
					if ($.isFunction(evt)) { evt({ data: data, textStatus: textStatus, jqXHR: jqXHR, element: propertyInput, name: propName, value: propertyValue }); }
				},
				error: function (jqXHR, textStatus, errorThrown) {
					_self._showFailure(propertyInput, propertyValue);
					var evt = _self.options.error;
					if ($.isFunction(evt)) { evt({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown, element: propertyInput, name: propName, value: propertyValue }); }
				},
				complete: function (jqXHR, textStatus) {
					var evt = _self.options.complete;
					if ($.isFunction(evt)) { evt({ jqXHR: jqXHR, textStatus: textStatus, element: propertyInput, name: propName, value: propertyValue }); }
				}
			});
		},
		_getResponseContainer: function (propertyInput) {
			var opt = _self.options.responseContainer;
			if ($.isFunction(opt)) {
				return opt(propertyInput);
			} else {
				return $(propertyInput).parent().find(opt);
			}
		},
		_clearResponseContainer: function (propertyInput) {
			_self._getResponseContainer(propertyInput).empty();
		},
		_showSaving: function (propertyInput) {
			_self._clearResponseContainer(propertyInput);
			var p = _self._getResponseContainer(propertyInput);
			var savingMarkup = $(_self.options.savingTemplate);
			savingMarkup.attr("data-rand", Math.random());
			p.append(savingMarkup);
			p.show();
		},
		_showSavedSuccess: function (propertyInput) {
			_self._clearResponseContainer(propertyInput);
			var p = _self._getResponseContainer(propertyInput);
			var savedMarkup = $(_self.options.savedTemplate);
			savedMarkup.attr("data-rand", Math.random());
			p.append(savedMarkup);
			savedMarkup.fadeOut(2000, function () {
				_self._clearResponseContainer(propertyInput);
			});
		},
		_showFailure: function (propertyInput, propertyValue) {
			_self._clearResponseContainer(propertyInput);
			var p = _self._getResponseContainer(propertyInput);
			var failedMarkup = $(_self.options.failedTemplate);
			failedMarkup.attr("data-rand", Math.random());
			p.append(failedMarkup);
			p.find(".try-again").click(function (event) {
				event.preventDefault();
				_self.save(propertyInput, propertyValue);
			});
		}
	});
})(jQuery);