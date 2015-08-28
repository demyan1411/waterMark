//******* ie8 preventDefault
	function ie8SafePreventEvent(e) {
	    if (e.preventDefault) {
	        e.preventDefault()
	    } else {
	        e.stop()
	    };

	    e.returnValue = false;
	    e.stopPropagation();
	}
//Tooltips && Validator

// module for opacity and ui-slider
 	var opacity = (function() {

		var start = function() {
				_setUpListeners();
			},
			_setUpListeners = function() {
				_origin();
				_sliderUi();
			},
			_origin = function() {
				$('.opacity_block').css({
		          'opacity': .8
		        });
			},
			_sliderUi = function() {
				$( ".ui-slider" ).slider({
					range: "min",
					min: 1,
					max: 100,
					value: 80,
					slide: function( event, ui ) {
						$('.opacity_block').css({
						  'opacity': ui.value / 100
						});

					}
				});
			}

		return {
	        init: start()
		}

	}());





//////////// plugin for drag and coordinates

$.fn.draga = function(options) {

 	options = {
 		container: options.container || '.js-container',
    arrows: options.arrows || false,
    radio: options.radio || false
 	}

 	var elem = this;


 	var elemWidth = elem.width(),
 		elemHeight = elem.height(),
    posLeft = 0,
    posTop = 0,
    posX,
    posY,

 		containerWidth = $(options.container).width(),
 		containerHeight = $(options.container).height(),

 		elemRightPosition = containerWidth - elemWidth,
 		elemBottomPosition = containerHeight - elemHeight,

 		elemMiddlePositonWidth = (containerWidth / 2) - (elemWidth / 2),
 		elemMiddlePositonHeight = (containerHeight / 2) - (elemHeight / 2);

    var objPos = {
  		'top-left': {
        'left': 0,
        'top': 0
      },
  		'top-middle': {
        'left': elemMiddlePositonWidth,
        'top': 0
      },
  		'top-right': {
        'left': elemRightPosition,
        'top': 0
      },
  		'middle-left': {
        'left': 0,
        'top': elemMiddlePositonHeight
      },
  		'middle-middle': {
        'left': elemMiddlePositonWidth,
        'top': elemMiddlePositonHeight
      },
  		'middle-right': {
        'left': elemRightPosition,
        'top': elemMiddlePositonHeight
      },
  		'bottom-left': {
        'left': 0,
        'top': elemBottomPosition
      },
  		'bottom-middle': {
        'left': elemMiddlePositonWidth,
        'top': elemBottomPosition
      },
  		'bottom-right': {
        'left': elemRightPosition,
        'top': elemBottomPosition
      }
  	};



// method for create 9 radio buttons for change coordinates
  var buttons = (function() {

    var start = function() {
      if(options.radio) {
        _setUpListeners();
      }
    },
    _setUpListeners = function() {
      $('.location').prepend('<div class="radio"></div>')

      _addInputs();
      _clickInput();
    },
    _addInputs = function() {
      for(var key in objPos) {
        var input = '<input type="radio" id="' + key + '" name="radio" class="radio_button" data-pos="' + key + '"><label class="radio__label" for="' + key + '"></label>'
    			$('.radio').append(input);
      }
    },
    _clickInput = function() {
      $('[data-pos]').on('click', function() {
        $('[type=radio]').removeAttr("checked");
        $(this).attr("checked", "checked");
     		var position = $(this).data('pos');

        posLeft = objPos[position].left,
        posTop = objPos[position].top;

      	elem.css(objPos[position]);

      	$('.posX').text(posLeft);
    	  $('.posY').text(posTop);

     	});
    }

    return {
      init: start()
    }

  }());


// method for arrows whitch move elem

  var arrows = (function() {
    var coordinatesButtons = '<div class="noselect coordinates__input_loc coordinates__input_loc-up"></div><div class="noselect coordinates__input_loc coordinates__input_loc-bottom"></div>';
    var arrow;

    var start = function() {
      if(options.arrows) {
        _setUpListeners();
      }
    },
    _setUpListeners = function() {
      $('.coordinates').css({'display': 'inline-block'});
      _addArrows();
      $('.coordinates__input_loc')
          .on('click', function() {
            arrow = $(this);
            _moveElem();
          });
      _mousePress();
    },
    _addArrows = function() {
      $('.coordinates__block').append(coordinatesButtons);
    },
    _moveElem = function() {

      var up = 'coordinates__input_loc-up',
          inputText = arrow.siblings('.coordinates__input'),
          thisText = parseInt(inputText.text(), 10),
          elemCssLeft,
          elemCssLeftNumber,
          elemCssTop,
          elemCssTopNumber;
      console.log(elemRightPosition);
      if(arrow.hasClass(up)) {
        _move(1);
      } else {
        if(thisText < 1) { thisText = 1; }
        _move(-1);
      }

      function _move(one) {
        if(inputText.hasClass('posX')){
          if(thisText > elemRightPosition - 1) { thisText = elemRightPosition - 1; }
          inputText.text(thisText + one);
          elem.css({
            'left': thisText + one
          });
        } else {
          if(thisText > elemBottomPosition - 1) { thisText = elemBottomPosition - 1; }
          inputText.text(thisText + one);
          elem.css({
            'top': thisText + one
          });
        }
      }

      elemCssLeft = elem.css('left');
      elemCssTop = elem.css('top');
      elemCssLeftNumber = parseInt(elemCssLeft.substring(0, elemCssLeft.length - 2), 10) || 0;
      elemCssTopNumber = parseInt(elemCssTop.substring(0, elemCssTop.length - 2), 10) || 0;

      if(posLeft !== elemCssLeftNumber || posTop !== elemCssTopNumber) {
        $('[type=radio]').removeAttr("checked");
      }

      addRed(elemCssLeftNumber, elemCssTopNumber);

    },
    _mousePress = function() {
      var mousedown = false;
      var mousedown_timer = '';
      $('.coordinates__input_loc').mousedown(function() {
          arrow = $(this);
          mousedown = true;
          mousedown_timer = setInterval(function() {
              if(mousedown) {
                  _moveElem();
              }
          }, 70);
      }).mouseup(function() {
          mousedown = false;
          clearInterval(mousedown_timer);
      }).mouseleave(function() {
          mousedown = false;
          clearInterval(mousedown_timer);
      });
    }

    return {
      init: start()
    }

  }());


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

          $('.btn').on('click', function() {
            cont = false;
            $('.draggable').draggable({
              containment: cont
            });
            elem.addClass('repeat');
          });

          $('.btn2').on('click', function() {
            cont = '.js-container';
            $('.draggable').draggable({
              containment: cont
            });
            elem.removeClass('repeat')
                .css({
                  'top': 0,
                  'left': 0
                });
            $('.posX').text(0);
            $('.posY').text(0);
          });

          $('.draggable').draggable({


         		drag: function(){

       				$('[type=radio]').removeAttr("checked");

        		 	left = $(this).css('left');
        	    top = $(this).css('top');
        	    posLeft = parseInt(left.slice(0, -2), 10);
        	    posTop = parseInt(top.substring(0, top.length - 2), 10);

        	    $('.posX').text(posLeft);
        			$('.posY').text(posTop);

              addRed(posLeft, posTop);

        	  },
            containment: '.js-container'

         	});
        }

      return {
        init: start()
      }

    }());

    function addRed(left, top) {
      for(var key in objPos) {
        if(left == objPos[key].left && top == objPos[key].top) {
          $('[data-pos = ' + key + ']').attr("checked", 'checked');
        }
      }
    }




}

