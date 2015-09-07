

// module for opacity and ui-slider

var opacity = (function() {
		var start = function() {
				_setUpListeners();
			},
			_setUpListeners = function() {
				_origin();
				_sliderUi();
				if($('#watermark').hasClass('buttons')) {
					$('.slider').removeClass('not_work');
				}
			},
			_origin = function() {

				$('.draggable').css({
		        'opacity': app.uiSliderVal / 100
		    });
			},
			_sliderUi = function() {
				$( ".ui-slider" ).slider({
					range: "min",
					min: 1,
					max: 100,
					value: app.uiSliderVal,
					slide: function( event, ui ) {
						app.uiSliderVal = ui.value;
						app.watermark.opacity = ui.value / 100;
						$('.draggable').removeClass('transition');
						if($('#watermark').hasClass('buttons')) {
							$('.draggable').css({
							  'opacity': app.uiSliderVal / 100
							});

						} else{ return false }
						//console.log(app.watermark.opacity);

					}
				});
			}

		return {
	        init: start
		}
}());

//////////// plugin for drag and coordinates









$.fn.draga = function(options) {

	//console.log(app.containerWidth);

	$('[data-pos]').off('click');
	$('.coordinates__input').off('change keyup input click blur');
	$('.coordinates__input_loc').off('click mousedown');


 	options = {
		container: options.container || '.main-img-container',
		inputPush: options.inputPush
 	}

 	var elem = this,
			input = options.inputPush,
		 	posLeft = 0,
		  posTop = 0,
		  posX,
		  posY;

			// если был загружен вотермарк
	if(input === '#watermark') {
		$('.location').css({
			'opacity': 1
		});
		$('#watermark').addClass('buttons');
	}




	$(options.container).css({
		'width': app.picture.width + 'px',
		'height': app.picture.height + 'px'
	});






	// method for 9 radio buttons for change coordinates
  var buttons = (function() {

    var start = function() {

    	_setUpListeners();


    },
    _setUpListeners = function() {
			_switchOnButtons();

			$('.settings__position-btn_many').on('click', function() {
				_switchOffButtons();
			});
			$('.settings__position-btn_one').on('click', function() {
				_switchOnButtons();
			});
    },

    _clickInput = function() {
      $('[data-pos]').on('click', function() {
				$('.draggable').addClass('transition');
        $('[type=radio]').removeAttr("checked");
        $(this).attr("checked", "checked");

     		var position = $(this).data('pos');


        posLeft = Math.round(app.objPos[position].left);
        posTop = Math.round(app.objPos[position].top);

				elem.css(app.objPos[position]);

      	$('.posX').val(posLeft);
    	  $('.posY').val(posTop);



     	});
    },
		_switchOffButtons = function() {
			$('[data-pos]').off('click');
			$('[type=radio]').removeAttr("checked")
											 .removeClass('click');
			$('.radio__label').css({
				'cursor': 'default'
			});
		},
		_switchOnButtons = function() {

				elem.css(app.objPos['top-left']);
				$('[type=radio]').removeAttr("checked")
												 .addClass('click');
				$('.radio__label').css({
				 'cursor': 'pointer'
			 });

				_clickInput();

				$('[data-pos=top-left]').attr("checked", "checked");

				$('.posX').val('0');
				$('.posY').val('0');
		}

    return {
      init: start
    }

  }());

	// method for arrows whitch move elem
  var arrows = (function() {

		var elemRightPosition = app.picture.width - app.watermark.width,
    		elemBottomPosition = app.picture.height - app.watermark.height;

    var arrow;

    var start = function() {

      _setUpListeners();


    },
    _setUpListeners = function() {

      $('.coordinates__input_loc')
        	.on('click', function() {

		        arrow = $(this);
		        _moveElem();
      		})
					.addClass('js-hover');
			$('.coordinates__input').css({
					'cursor': 'pointer'
			});

      _mousePress();
			_moveByText();

    },
		_moveByText = function() {

			$('.coordinates__input')
				.on('focus', function() {
					$this = $(this);

					$this.val('')
							 .removeAttr('readonly');

				})
	      .on('change keyup input click', function() {
					$('.draggable').addClass('transition');

					if (this.value.match(/[^0-9]/g)) {
			      this.value = this.value.replace(/[^0-9]/g, '');
			    }

					if($this.hasClass('posX') && $('.posX').val() > elemRightPosition) {

					 $('.posX').val(elemRightPosition);

					} else if($this.hasClass('posY') && $('.posY').val() > elemBottomPosition) {

						$('.posY').val(elemBottomPosition);

					}

					elem.css({
						'left': $('.posX').val() + 'px',
						'top': $('.posY').val() + 'px'
					});
					_addRed();

				})
				.on('blur', function() {

					if($this.val() === '') {
						var leftCss = 	parseInt(elem.css('left').slice(0, -2), 10),
								topCss = 	parseInt(elem.css('top').slice(0, -2), 10);


						$('.posX').val(leftCss);
						$('.posY').val(topCss);

						elem.css({
							'left': $('.posX').val() + 'px',
							'top': $('.posY').val() + 'px'
						});
						_addRed();
					}

				});
		},

    _moveElem = function() {

      var up = 'coordinates__input_loc-up',
          inputText = arrow.siblings('.coordinates__input'),
          thisText = parseInt(inputText.val(), 10),
          elemCssLeft,
          elemCssLeftNumber,
          elemCssTop,
          elemCssTopNumber;



			if(arrow.hasClass(up)) {
        _move(1);
      } else {
        if(thisText < 1) { thisText = 1; }
        _move(-1);
      }

      function _move(one) {
        if(inputText.hasClass('posX')){
          if(thisText > elemRightPosition - 1) { thisText = elemRightPosition - 1; }
          inputText.val(thisText + one);
          elem.css({
            'left': thisText + one
          });
        } else {
          if(thisText > elemBottomPosition - 1) { thisText = elemBottomPosition - 1; }
          inputText.val(thisText + one);
          elem.css({
            'top': thisText + one
          });
        }
      }

      _addRed();

    },

    _mousePress = function() {

      var mousedown = false;
      var mousedown_timer = '';
      $('.coordinates__input_loc').on('mousedown', function() {

          arrow = $(this);
          mousedown = true;
          mousedown_timer = setInterval(function() {
              if(mousedown) {
                  _moveElem();
              }
          }, 120);
      }).mouseup(function() {
          mousedown = false;
          clearInterval(mousedown_timer);
      }).mouseleave(function() {
          mousedown = false;
          clearInterval(mousedown_timer);
      });
    },

		_addRed = function() {
			elemCssLeft = elem.css('left');
			elemCssTop = elem.css('top');
			elemCssLeftNumber = parseInt(elemCssLeft.substring(0, elemCssLeft.length - 2), 10) || 0;
			elemCssTopNumber = parseInt(elemCssTop.substring(0, elemCssTop.length - 2), 10) || 0;

			addRed(elemCssLeftNumber, elemCssTopNumber);
		}

    return {
      init: start
    }

  }());

	if($('#watermark').hasClass('buttons')) {
  	buttons.init();
  	arrows.init();
	}
		//opacity.init();

	}

	function addRed(left, top) {
		$('[type=radio]').removeAttr("checked");
		for(var key in app.objPos) {
			if(left == app.objPos[key].left && top == app.objPos[key].top) {
				$('[data-pos = ' + key + ']').attr("checked", 'checked');
			}
		}
}
// method for drag elem
var drag = (function() {

	var start = function() {
			_setUpListeners();
		},
		_setUpListeners = function() {
			_onDrag();
		},
		_onDrag = function() {
			var cont,
					left,
					top,
					posLeft,
					posTop;



			$('.draggable').draggable({


				drag: function(){

					$('[type=radio]').removeAttr("checked");
					$('.draggable').removeClass('transition');
					left = $(this).css('left');
					top = $(this).css('top');
					posLeft = parseInt(left.slice(0, -2), 10);
					posTop = parseInt(top.substring(0, top.length - 2), 10);

					$('.posX').val(posLeft);
					$('.posY').val(posTop);

					addRed(posLeft, posTop);

				},
				containment: app.imgConteiner

			});
		}

	return {
		init: start
	}

}());


var multiplyElem = (function() {



	var elem = $('.draggable');
	var repeatWidth,
	    repeatHeight,
	    imgSum,
	    _difference,
			_differenceHeight,
			newImgSum,
			posLeft,
			posTop,
			watermarkS,
			repeatS;

	var start = function() {
		_setUpListeners();
	},
	_setUpListeners = function() {

		_loadRemove();


		$('.settings__position-btn_many').on('click', function() {
			_multiply();
		});

		$('.settings__position-btn_one').on('click', function() {
			_doOneElem();

		});
		//console.log(app.picture.width);


	},
	_multiply = function() {
		if($('#watermark').hasClass('buttons')) {
			if(app.flag === true) {

				app.watermark.mode = 'tile';

				app.flag = false;

				$('#watermark')

				elem.wrap('<div class="repeatBlock"></div>')
						.addClass('repeatElem')
						.css({
							'left': 0,
							'top': 0
						});
				$(".draggable").draggable({ disabled: true });

				_addImages();
				_dragImages();

				$('.settings__position-btn').removeClass('btn-active');
				$('.settings__position-btn_many').addClass('btn-active');
			}
		}

	},
	_doOneElem = function() {
		if(app.flag === false) {
			app.watermark.mode = 'notile';
			_removeAll();
		}
	},
	_addImages = function() {
		repeatWidth = $('.repeatBlock').width();
    repeatHeight = $('.repeatBlock').height();
    repeatS = repeatWidth * repeatHeight;
    _difference = (repeatWidth - app.picture.width) / 2;
		_differenceHeight = (repeatHeight - app.picture.height) / 2;
		watermarkS = app.watermark.width * app.watermark.height;


		imgSum = Math.ceil(repeatS / watermarkS);

		for(var i = 0; i < imgSum; i++) {
			$('.repeatBlock').append('<img src="' + app.watermark.url + '" class="draggable appendedImg">');
		}
		//console.log(imgSum);

		$('.draggable').css({
				'opacity': app.uiSliderVal / 100
		});
	},
	_removeImages = function() {
		$('.appendedImg').remove();
	},
	_dragImages = function() {
		watermarkS = app.watermark.width * app.watermark.height
			//console.log(repeatWidth);
		$('.repeatBlock').draggable({

			drag: function(){


				var left = $(this).css('left'),
						top = $(this).css('top'),
						marginLeft = parseInt($(this).css('margin-left').slice(0, -2), 10);

				posLeft = parseInt(left.slice(0, -2), 10);
				posTop = parseInt(top.substring(0, top.length - 2), 10);

				newImgSum = Math.ceil(repeatS / watermarkS);

				repeatWidth = $('.repeatBlock').width();
				repeatHeight = $('.repeatBlock').height();
				repeatS = repeatWidth * repeatHeight;

				$('.draggable').css({
						'opacity': app.uiSliderVal / 100
				});

				_increaseWidthAndHeight();


				if (	 (posLeft  >  app.picture.width - app.watermark.width)
						|| (posTop  >  app.picture.height - app.watermark.height)
					  || ((posLeft + repeatWidth) < app.watermark.width)
					 	|| ((posTop + repeatHeight) < app.watermark.height) ) {

					$('.repeatBlock').draggable({
						revert: true,
						revertDuration: 200
					});
					//$('.repeatBlock').draggable({ containment: [0, 0, repeatWidth, repeatHeight] });
				} else {
					$('.repeatBlock').draggable({ revert: false});

				}



			}
			//containment: [-app.picture.width, -app.picture.height + app.watermark.width + _differenceHeight, repeatWidth + app.watermark.width - _difference, repeatHeight + app.picture.height - _differenceHeight]

		});
	},
	_increaseWidthAndHeight = function(nameBlock, namePic) {
		if(posLeft + repeatWidth < app.picture.width + _difference) {

			if(repeatWidth < app.picture.width * 2) {
				$('.repeatBlock').css({
					'width': (repeatWidth + _difference) + 'px'
				});
			}

			for(var i = 0; i < newImgSum - imgSum; i++) {
				$('.repeatBlock').append('<img src="' + app.watermark.url + '" class="draggable appendedImg">');
			}
		};

		if(posTop + repeatHeight < app.picture.height + _differenceHeight) {

			if(repeatHeight < app.picture.height * 2) {
				$('.repeatBlock').css({
					'height': (repeatHeight + _differenceHeight) + 'px'
				});
			}

			for(var i = 0; i < newImgSum - imgSum; i++) {
				$('.repeatBlock').append('<img src="' + app.watermark.url + '" class="draggable appendedImg">');
			}
		};
	},
	_removeAll = function() {
		app.flag = true;
		$(".draggable").removeClass('repeatElem')
				.unwrap()
				.css({
					'top': 0,
					'left': 0
				});
		$('.posX').text(0);
		$('.posY').text(0);

		_removeImages();

		$(".draggable").draggable({ disabled: false });
		$('.settings__position-btn').removeClass('btn-active');
		$('.settings__position-btn_one').addClass('btn-active');
	},
	_loadRemove = function() {
		if($("div").is(".repeatBlock")) {
			_removeAll();
		}
	}


	return {
		init: start
	}

}());

// добавить стрелочки к координатам
var addArrows = (function() {
	var coordinatesButtons = '<div class="noselect coordinates__input_loc coordinates__input_loc-up"></div><div class="noselect coordinates__input_loc coordinates__input_loc-bottom"></div>';

  var start = function() {
    _setUpListeners();
  },
  _setUpListeners = function() {
		$('.coordinates__block').append(coordinatesButtons);
  }

  return {
    init: start
  }

}());

// добавить радиокнопки
var addInputs = (function() {
	var objPosArray = [
	      'top-left',
	      'top-middle',
	      'top-right',
	      'middle-left',
	      'middle-middle',
	      'middle-right',
	      'bottom-left',
	      'bottom-middle',
	      'bottom-right'
	    ];
    var start = function() {
        _setUpListeners();
      },
      _setUpListeners = function() {
        _addInputs();
      },
      _addInputs = function() {
        $('.location').prepend('<div class="radio"></div>');

        for( var i = 0; i < 9; i++) {

          var input = '<input type="radio" id="' + objPosArray[i] + '" name="radio" class="radio_button" data-pos="' + objPosArray[i] + '"><label class="radio__label" for="' + objPosArray[i] + '"></label>'
            $('.radio').append(input);
        }
      }

    return {
          init: start
    }

  }());
