jQuery(function ($) {
  window.addEventListener("scroll", (function () {
    var t = window.pageYOffset,
      e = document.getElementById("js-trigger"),
      n = document.getElementById("js-fixed-btn");
    n && e && (t > t + e.getBoundingClientRect().top ? n.setAttribute("aria-expanded", "true") : n.setAttribute("aria-expanded", "false"))
  }))
});
jQuery(function () {

  var footer = $('.footer').innerHeight(); 

  window.onscroll = function () {
    var point = window.pageYOffset; 
    var docHeight = $(document).height(); 
    var dispHeight = $(window).height();

    if (point > docHeight - dispHeight - footer) { 
      $('.in_fixed_sns').addClass('is-hidden'); 
    } else {
      $('.in_fixed_sns').removeClass('is-hidden'); 
    }
  };
});
/* header
============================== */
jQuery(function ($) {
  var nav = $('#global-nav'),
    offset = nav.offset();
  $(window).scroll(function () {
    if ($(window).scrollTop() > offset.top) {
      nav.addClass('m-fixed');
    } else { 
      nav.removeClass('m-fixed');
    }
  });
});
$(window).scroll(function () {
  var check = window.pageYOffset;
  var docHeight = $(document).height();
  var dispHeight = $(window).height();
  if (check > docHeight - dispHeight - 60) {
    $('#global-nav.m-fixed').fadeOut(500);
  } else {
    $('#global-nav.m-fixed').fadeIn(500);
  }
});

/* smp menu
============================== */
$(function () {
  $('.menu-trigger').on('click', function () {
    $(this).toggleClass('active');
    $(".nav-list").toggleClass('active');
  })
});
$(function () {
  $('.nav-list a').on('click', function () {
    $('.nav-list').toggleClass('active');
    $(".menu-trigger").toggleClass('active');
  })
});

/* fade in
============================== */
$(function () {
  $(window).on('load scroll', function () {
    $('.fadeIn').each(function () {
      var target = $(this).offset().top;
      var scroll = $(window).scrollTop();
      var height = $(window).height();
      if (scroll > target - height) {
        $(this).addClass('active');
      }
    });
  });
});


/* scroll
============================== */

$(function () {
  var windowWidth = $(window).width();
  var windowSm = 767; 
    if (windowSm >= windowWidth) {
     var headerHeight = 50; // 
   }  else {
     var headerHeight =80; //
    }
    jQuery('a[href^="#"]').click(function() {
    var speed = 600;
    var href= jQuery(this).attr("href");
    var target = jQuery(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top-headerHeight;
    jQuery('body,html').animate({scrollTop:position}, speed, 'swing');
    return false;
   });
});
$(function(){
	var num = 2; //何個づつ開くか指定
	var d_num = 1; //最初表示させたい個数を指定
	$('.news_box').each(function() { //.accordion_boxを検索
		$('.news_lists > li:gt('+ (d_num - 1) +')',this).addClass('none'); //d_numより後の要素は.none付与
		if ($('.news_lists > li',this).length > d_num) {
			$('.news-trigger',this).show(); //d_numより要素の数が多ければ「もっとみる」ボタン表示
		}
	});
	$('.news_box .news-trigger').on('click', function() { 
		var h_tag = $(this).parents('.news_box').find('.news_lists li.none'); //クリックしたボタンに関連する.accordionの非表示要素を取得
		var h_tag_num = h_tag.length; //非表示要素の個数を変数に格納
		h_tag.slice(0, num).slideDown('fast').removeClass('none'); //num個までの非表示要素を開いて.noneを外す
		if (num >= h_tag_num) {
			$(this).hide(); //非表示要素の個数がnum以下になったら「もっとみる」ボタンを非表示
		}
	});
});