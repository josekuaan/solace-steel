$(function ($) {
    "use strict";
    var $window = $(window);

   /* Offset start */
   var html_body = $('html, body'),
   nav = $('nav'),
   navOffset = nav.offset().top,
   $window = $(window);


      /*======== Sticky header ===========*/
      $('.navbar-collapse a').on('click', function () {
        $(".navbar-collapse").collapse('hide');
    });

      //scrollspy menu
	$('body').scrollspy({
		target: '#navbarSupportedContent',
		offset: 80
	});
    
/* offset ends */

$('#mainHeader  a').on('click', function () {
   if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
       var target = $(this.hash);
       target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
       if (target.length) {
           html_body.animate({
               scrollTop: target.offset().top - 30
           }, 1500);
           return false;
       }
   }
});

    
    //for scroll bottom to top js here
    if ($('.totop').length) {
        var scrollTrigger = 100, // px
            backToTop = function () {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    $('.totop').addClass('show');
                } else {
                    $('.totop').removeClass('show');
                }
            };
        backToTop();
        $(window).on('scroll', function () {
            backToTop();
        });
        $('.totop').on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 700);
        });
    }
    $window.on('scroll', function () {
        if ($window.scrollTop()) {
            $("#mainHeader").addClass('stiky');
        } else {
            $("#mainHeader").removeClass('stiky');
        }
        if ($window.scrollTop()) {
            $(".support-bar-area").addClass('hideme');
        } else {
            $(".support-bar-area").removeClass('hideme');
        }
        if ($window.scrollTop()) {
            $(".logo-light").addClass('displatNone');
        } else {
            $(".logo-light").removeClass('displatNone');
        }
        if ($window.scrollTop()) {
            $(".logo-dark").addClass('displatBlock');
        } else {
            $(".logo-dark").removeClass('displatBlock');
        }
    });



    //testimonial
    	// :: 2.0 Slick Active Code
	$('.slider-for').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		speed: 500,
		arrows: true,
		fade: true,
		asNavFor: '.slider-nav',
		prevArrow: '<span><i class="fa fa-angle-left"></i></span>',
		nextArrow: '<span><i class="fa fa-angle-right"></i></span>'
	});

	$('.slider-nav').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		speed: 500,
		asNavFor: '.slider-for',
		dots: false,
		centerMode: true,
		focusOnSelect: true,
		slide: 'div',
		autoplay: true,
		centerMode: true,
		arrows: false,
		centerPadding: '10px',
        mobileFirst: true,
        responsive: [
            {
              breakpoint: 1324,
              settings: {
                slidesToShow: 5,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 300,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // inst
        ]
	});




    // counter js
    $('.count').counterUp({
        delay: 10,
        time: 2000
    });

    

 /*---------------------------------------------------
            Venobox Active js
        ----------------------------------------------------*/
        $('.venobox').venobox();

        
 

    jQuery(window).on('load', function () {

        /*---------------------------------------------------
            Site Preloader
        ----------------------------------------------------*/
        var $sitePreloaderSelector = $('.site-preloader');
        $sitePreloaderSelector.fadeOut(500);


    });




}(jQuery));




// Project     :   Dogemine - DogeCoin Mining Landing Page HTML Template 
// Version     :   1.0
// Author              : Thesoftking
// Front-end developer : Mamunur Rashid