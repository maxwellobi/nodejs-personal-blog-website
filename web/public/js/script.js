
(function($){
'use strict';

  // Removed Image tooltip title on hover
	$('.woocommerce-LoopProduct-link img').removeAttr('title');

/*============  1.SOME BUTTON OFF CLICK ===========*/
function sgny_mainMenu_fun(){
	$("li.menu-item-has-children > a").on("click",function(e){
		e.preventDefault();
	});

	var check = $(".menu-hover").hasClass("menuClick");
	if(true == check){
		$(".menuClick  .menu-nav-shap-warp").click(function(){
			$(this).toggleClass("menu-opened");
			$(".nav-warp").slideToggle("fast");
		});
	}else{
		$(".menu-hover").hover(function(){
			$(".menu-nav-shap-warp").addClass("menu-opened");
			$(".nav-warp").stop(true, true).slideDown("fast");
		},function(){
			$(".menu-nav-shap-warp").removeClass("menu-opened");
			$(".nav-warp").stop(true, true).slideUp("fast");
		});
	}
}

/*============  2.ISOTOPE POST GALLERY ===========*/
function sgny_gallery_post(){
	var $gallery = $("body").has(".gallery-warp").length;
	if(true == $gallery){
		setTimeout(function(){
			var $grid = $('.gallery-warp').isotope({
			  itemSelector: '.gallery-single-item',
			  percentPosition: true
			});
		},100);
	}
	return;
}

/*============  3.SLIDER IMAGE POST GALLERY ===========*/
function sgny_slider_post(){
	var $slider = $("body").has(".post-slider").length;
	if(true == $slider){
		var loopItem = $(".post-slider .slide-single-item");
		loopItem = (loopItem.length > 1) ? true : false;
		$(".post-slider").owlCarousel({
			autoplay:true,
			loop: loopItem,
	        items: 1,
	        center:true,
			dotsContainer: '#owlDots',
			dots:true,
	        nav: true,
	        navText:['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']
		});
	}
	return;
}

/*============  4.FUNCTION  MOBIL MENU===========*/
function sgny_mobil_menu(){
	$('#mobil_menu').slimmenu({
		resizeWidth: '800',
		collapserTitle: '',
		animSpeed: 'medium',
		easingEffect: null,
		indentChildren: false,
		childrenIndenter: '&nbsp;',
		expandIcon: '<i class="fa fa-angle-down"></i>',
		collapseIcon: '<i class="fa fa-angle-up"></i>'
	});

	$("#mobil_menu li.menu-item-has-children > a").on("click",function(){
		$(this).next(".sub-toggle").trigger("click");
	});
}

/*============  5.MASONARY ISOTOP===========*/
function sgny_post_masonary(){
	var $postMaso = $("body").has(".masonary-post-warp").length;
	if(true == $postMaso){
		setTimeout(function(){
			$(".post-slider").each(function(){
				var $this = $(this);
				$this.height($this.find(".owl-stage-outer").height());
			});
			var $grid = $('.masonary-post-warp').isotope({
			  itemSelector: '.masonary-single-post-item',
			  percentPosition: true
			});
		},350);
	}
	return;
}

/*============ 6.NICE SCROLL INIT FUNCTION ===========*/
function sgny_Scrollbar(){
	if (!Modernizr.touch){
		$(".content, .right-sidebar-scroll").niceScroll({
			cursorcolor: "#222222",
			cursorwidth: "8px",
			cursorborder: "0px solid #222222",
			cursorborderradius: "0px",
			background: "#E0E0E0",
			zindex: 9999,
			autohidemode: false,
			scrollspeed:20,
			smoothscroll: true
		});
		setTimeout(function(){
			$("body").find("#ascrail2000").insertAfter(".content");
			$("html").addClass("not-touch");
			$(".pusher").addClass("has_nicescroll");
		},100);
	}
	return;
}

/*============ 7.FITVIDS VIDEO JS INIT FUNCTION ===========*/
function sgny_videoFitvids(){
	$("#page-warp").fitVids();
}

/*============ 8.LEFT SIDEBAR RESPOSIVE FIX FUNCTION ===========*/
function sgny_leftSideautoheight(){
	var $leftSidebar = $("body").has(".l-sidebar-footer").length;
	if(true == $leftSidebar){
		$(".left-sidebar").height($(window).height());
	}
	return false;
}
/*============ 9.RELATED POST CAROUSEL INIT FUNCTION ===========*/
function sgny_relatedPostCarousel(){
	var $relaPostCar = $("body").has(".related-post-carousel").length;
	if(true == $relaPostCar){
		$(".related-post-carousel").owlCarousel({
			autoplay:false,
			loop: true,
	        items: 3,
			dots:true,
	        nav: false,
	        margin:28,
		    responsive:{
		        0:{
		            items:1,
		        },
		        750:{
		            items:2,
		        },
		        970:{
		            items:3,
		        },
		        1170:{
		            items:3,

		        }
		    }

		});
	}
	return false;
}

/*============= 10.SOME CUSTOM  STYLE FOR CONTACT FORM  FUNCTION ===========*/
function sgny_contact_form_input(){
	$('.wpcf7-date').datepicker({
		    format: 'mm/dd/yyyy',
		    startDate: '-3d'
	});
	// input range and number filed
		var $rangeSelect,$numberFi;
		$rangeSelect = $(".stylest-contact-form input[type='range'], .wpcf7-form-control-wrap input[type='range']");
		$numberFi = $(".stylest-contact-form input[type='number'] , .wpcf7-form-control-wrap input[type='number']");

		$numberFi.on("change",function(){
			var max = parseInt($(this).attr('max'));
			var min = parseInt($(this).attr('min'));

		    if ($(this).val() > max)
		    {
		          $(this).attr("disabled","disabled");
		          $(this).val(max);
		    }
		    if($(this).val() < min){
		    	$(this).attr("disabled","disabled");
		        $(this).val(min);
		    }

			$rangeSelect.val($(this).val());

		});

		$rangeSelect.on("change",function(){
			var $rangeVal = $(this).val();
			$numberFi.removeAttr("disabled");
			$numberFi.val($rangeVal);
		});

	// input file upload
	var fileSelec = $(".stylest-contact-form input[type='file'], .wpcf7-form-control-wrap input[type='file']");
	fileSelec.parent().addClass("file-upload");
	fileSelec.before("<span class='file-btn'>Upload</span>");
	fileSelec.after("<span class='file-name'>No file selected</span>");
	fileSelec.on("change",function(){
		var fileName = $(this).val();
		$(this).next(".file-name").text(fileName);
	});

  // input checkbox
  var $checkBoxSelector = $(".stylest-contact-form input[type='checkbox'], .wpcf7-checkbox label input[type='checkbox']");
  $checkBoxSelector.after("<span class='checkbox-btn'></span>");

  // input radio
  var $radioSelector = $(".stylest-contact-form input[type='radio'], .wpcf7-radio label input[type='radio']");
  $radioSelector.after("<span class='radio-btn'></span>");
}

/*============= 11.CUSTOM DEFAULT HTML TABLE CLASS FUNCTION ===========*/
function sgny_default_table_addclass(){
	var tableclass = $(".single-crosshtml-content  table, .comment-content table").attr("class");
	if(undefined == tableclass || null == tableclass){
		$(".single-crosshtml-content  table, .comment-content table").addClass("table");
	}
	return;
}

/*============= 12.CUSTOM DEFAULT MOBIL   CLASS FUNCTION ===========*/
function sgny_mobil_touch(){
	$('.woocommerce ul.products li.product, .woocommerce-page ul.products li.product')
	.on('click touchend', function(e) {
		$(this).trigger('hover');
	});
}

/*============ 13.WOOCOMMERCE QUANTITY BUTTON FUNCTION ===========*/
function sgny_woocom_spinner(){
	var $content = $("body")
	.has(".quantity input.qty[type=number], .quantity input.qty[type=number]")
	.length;
	if(true == $content){
	var fidSelector = $('.woocommerce .quantity input.qty[type=number], .woocommerce-page .quantity input.qty[type=number]');
	    fidSelector.before('<span class="qty-up"></span>');
	    fidSelector.after('<span class="qty-down"></span>');
	    setTimeout(function(){
			$('.woocommerce .quantity input.qty[type=number], .woocommerce-page .quantity input.qty[type=number]').each(function(){
				var minNumber = $(this).attr("min");
				var maxNumber = $(this).attr("max");
				$(this).prev('.qty-up').on('click', function() {
					if($(this).next("input.qty[type=number]").val() == maxNumber){
						return false;
					}else{
						$(this).next("input.qty[type=number]").val( parseInt($(this).next("input.qty[type=number]").val(), 10) + 1);
					}
				});
				$(this).next('.qty-down').on('click', function() {
					if($(this).prev("input.qty[type=number]").val() == minNumber){
						return false;
					}else{
						$(this).prev("input.qty[type=number]").val( parseInt($(this).prev("input.qty[type=number]").val(), 10) - 1);
					}
				});
			});

	    },100);
    }
    return;
}
/*============ 14.WOOCOMMERCE CHCKBOX AND RADIO INPUT STYLE INIT FUNCTION ===========*/
function sgny_input_chckbox_radio_style(){
	$(".woocommerce-checkout, .woocommerce-page, .woocommerce")
	.find("input[type='checkbox']")
	.after("<span class='woo-check-style'></span>");
}

/*============ 15.WOOCOMMERCE RELATED PRODUCT CAROUSEL INIT FUNCTION ===========*/
function sgny_wooc_relatedprodcarousel(){
	var $relaPostCar = $("body").has(".related.products  ul.products").length;
	if(true == $relaPostCar){
		var $loopItem = ($(".related.products  ul.products li").length > 3) ? true : false;
		$(".single-product.woocommerce .related.products  ul.products li.product").each(function(){
			$(this).replaceWith('<div class="'+$(this).attr('class')+'">'+$(this).html()+'</div>');
		});
		$(".single-product.woocommerce .related.products  ul.products")
		.replaceWith('<div class="owl-carousel  sgny_woo_related_products_warp">'+$(".single-product.woocommerce .related.products  ul.products").html()+'</div>');

		setTimeout(function(){

			$(".sgny_woo_related_products_warp").on('initialized.owl.carousel', function(e) {
			$(".owl-item").addClass("product");
			}).owlCarousel({
				autoplay:false,
				loop:$loopItem,
				items: 3,
				dots:true,
				nav: false,
				margin:30,
				itemElement:'li',
				stageElement:'ul',
				stageClass:'owl-stage products',
				responsive:{
					0:{
						items:1,
					},
					450:{
						items:2,
					},
					750:{
						items:3,
					},
					970:{
						items:3,
					},
					1170:{
						items:3,

					}
				}

			});
		},100);

	}
	return false;
}

/*============ 16.WOOCOMMERCE ACCOUNT FORM OPEN INIT FUNCTION ===========*/
function sgny_woo_form_open(){
	$(".form-trigger-btn").on("click",function(e){
		e.preventDefault();
		$(".woo-acount-login-rageter-form").attr("id",$(this).data("trigger"));
	});
}

/*============= xxxxxxxxxxxxxxxxxxxxxxxxx ===========*/

/*============= DOCUMENT READY ALL FUNCTION  CALL ===========*/
$(function(){
	if (typeof sgny_mainMenu_fun == 'function'){
			sgny_mainMenu_fun();
		}
	if (typeof sgny_slider_post == 'function'){
			sgny_slider_post();
		}
	if (typeof sgny_mobil_menu == 'function'){
			sgny_mobil_menu();
		}
	if (typeof sgny_videoFitvids == 'function'){
			sgny_videoFitvids();
		}
	if (typeof sgny_relatedPostCarousel == 'function'){
			sgny_relatedPostCarousel();
		}
	if (typeof sgny_contact_form_input == 'function'){
			sgny_contact_form_input();
		}
	if (typeof sgny_default_table_addclass == 'function'){
			sgny_default_table_addclass();
		}
	if (typeof sgny_mobil_touch == 'function'){
			sgny_mobil_touch();
		}
	if (typeof sgny_woocom_spinner == 'function'){
			sgny_woocom_spinner();
		}
	if (typeof sgny_wooc_relatedprodcarousel == 'function'){
			sgny_wooc_relatedprodcarousel();
		}
	if (typeof sgny_input_chckbox_radio_style == 'function'){
			sgny_input_chckbox_radio_style();
		}
	if (typeof sgny_woo_form_open == 'function'){
			sgny_woo_form_open();
		}

});

/*============= WINDOW LOAD RESIZE FUNTION CALL ===========*/
$(window).on("load  resize",function(){
	if (typeof sgny_post_masonary == 'function'){
			sgny_post_masonary();
		}
	if (typeof sgny_leftSideautoheight == 'function'){
			sgny_leftSideautoheight();
		}
});
/*============= ONLY WINDOW LOAD FUNTION CALL ===========*/
$(window).on("load",function(){
	if (typeof sgny_gallery_post == 'function'){
		sgny_gallery_post();
	}
});

		// WPML Dropdown
		$('.topdd-content').hide();
    $('.top-dropdown').each(function() {

      var $this    = $(this),
          $open    = $this.find('.top-active'),
          $content = $this.find('.topdd-content');

      $open.on('click', function( e ) {

        e.preventDefault();
        e.stopPropagation();

				if ($( ".top-active i" ).hasClass( "fa-angle-down" ) ){
					$( ".top-active i" ).removeClass('fa-angle-down');
					$( ".top-active i" ).addClass('fa-angle-up');
				} else {
				  $( ".top-active i" ).addClass('fa-angle-down');
				  $( ".top-active i" ).removeClass('fa-angle-up');
				}
				$(document.body).on('click', function () {
		      $( ".top-active i" ).addClass('fa-angle-down');
				  $( ".top-active i" ).removeClass('fa-angle-up');
		    });

        if( $content.hasClass('opened') ) {
          $content.removeClass('opened').fadeOut('fast');
        } else {
          $content.trigger('close-modals').addClass('opened').fadeIn('fast');
          $content.find('input').focus();
        }

      });

      $content.on('click', function ( event ) {

        if (event.stopPropagation) {
          event.stopPropagation();
        } else if ( window.event ) {
          window.event.cancelBubble = true;
        }

      });

      $(document.body).on('click close-modals', function () {
	      $('.topdd-content').removeClass('opened').fadeOut('fast');
	    });

    });

})(jQuery);