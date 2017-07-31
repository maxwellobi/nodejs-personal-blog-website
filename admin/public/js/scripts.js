$(document).ready(function () {
    $(function () {
        $(".preloader").fadeOut();
        $('#side-menu').metisMenu();
    });
    
    $(".open-close").click(function () {
        $("body").toggleClass("show-sidebar");
    });

    $(".right-side-toggle").click(function () {
        $(".right-sidebar").slideDown(50);
        $(".right-sidebar").toggleClass("shw-rside");
    
        $(".fxhdr").click(function () {
            $("body").toggleClass("fix-header");
        });
        
        $(".fxsdr").click(function () {
            $("body").toggleClass("fix-sidebar");
        });
       
        if ($("body").hasClass("fix-header")) {
            $('.fxhdr').attr('checked', true);
        }
        else {
            $('.fxhdr').attr('checked', false);
        }
       
    });
   
    $(function () {
        $(window).bind("load resize", function () {
            topOffset = 60;
            width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
            if (width < 768) {
                $('div.navbar-collapse').addClass('collapse');
                topOffset = 100; // 2-row-menu
            }
            else {
                $('div.navbar-collapse').removeClass('collapse');
            }
            height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
            height = height - topOffset;
            if (height < 1) height = 1;
            if (height > topOffset) {
                $("#page-wrapper").css("min-height", (height) + "px");
            }
        });
        var url = window.location;
        var element = $('ul.nav a').filter(function () {
            return this.href == url || url.href.indexOf(this.href) == 0;
        }).addClass('active').parent().parent().addClass('in').parent();
        if (element.is('li')) {
            element.addClass('active');
        }
    });
   
    $(function () {
        $(window).bind("load resize", function () {
            width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
            if (width < 1170) {
                $('body').addClass('content-wrapper');
                $(".sidebar-nav, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
            }
            else {
                $('body').removeClass('content-wrapper');
            }
        });
    });
    
    //tooltip
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

});

$(".collapseble").click(function () {
    $(".collapseblebox").fadeToggle(350);
});

$('.slimscrollright').slimScroll({
    height: '100%'
    , position: 'right'
    , size: "5px"
    , color: '#dcdcdc'
, });

$('.slimscrollsidebar').slimScroll({
      height: '100%'
    , position: 'left'
    , size: "6px"
    , color: 'rgba(0,0,0,0.5)'
, });


$("body").trigger("resize");

$('.visited li a').click(function (e) {
    $('.visited li').removeClass('active');
    var $parent = $(this).parent();
    if (!$parent.hasClass('active')) {
        $parent.addClass('active');
    }
    e.preventDefault();
});

$(".navbar-toggle").click(function () {
    $(".navbar-toggle i").toggleClass("ti-menu");
    $(".navbar-toggle i").addClass("ti-close");
});
