/* -----------------------------------------------------------------------------

I'm Mat - Material Personal Resume vCard Template

File:           Base SCSS File
Version:        1.2
Last change:    08/06/16 
Author:         Suelo 

-------------------------------------------------------------------------------- */

"use strict";

var $body = $('body');

var $header = $('#header'),
    topBarHeight = $('#top-bar').outerHeight(),
    scrolled = 0;

var setHeader = function() {
    scrolled = $(window).scrollTop();
    //console.log(scrolled)
    topBarHeight = $('#top-bar').outerHeight()
   // console.log(topBarHeight)
    if(scrolled >= topBarHeight) {
        $body.addClass('sticky-layout');
    } else {
        $body.removeClass('sticky-layout');
    }
}

var Mat = {
    init: function() {

        this.Basic.init();
        this.Component.init(); 
        
    },
    Basic: {
        init: function() {

            this.mobileDetector();
            this.backgrounds();
            this.masonry();
            this.map();
            this.navPrimary();
            this.filter();
            this.imagesList();

        },
        mobileDetector: function () {

            var isMobile = {
                Android: function() {
                    return navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function() {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function() {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                },
                Opera: function() {
                    return navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function() {
                    return navigator.userAgent.match(/IEMobile/i);
                },
                any: function() {
                    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
                }
            };

            window.trueMobile = isMobile.any();

        },
        backgrounds: function() {
            // Image
            $('.bg-image').each(function(){
                var src = $(this).children('img').attr('src');
                $(this).css('background-image','url('+src+')').children('img').hide();
            });

            // Slideshow 
            $('.bg-slideshow').owlCarousel({
                singleItem: true,
                autoPlay: 4000,
                pagination: false,
                navigation: false,
                navigationText: false,
                slideSpeed: 1500,
                transitionStyle: 'fade',
                mouseDrag: false,
                touchDrag: false
            });

            // Video 
            var $bgVideo = $('.bg-video');
            if($bgVideo) {
                $bgVideo.YTPlayer();
            }
            if(trueMobile && $bgVideo) {
                $bgVideo.prev('.bg-video-placeholder').show();
                $bgVideo.remove()
            }

        },
        imagesList: function() {
            /*$('.images-list .image-box').on('mouseover', function(){
                console.log($(this));
                var $container = $(this).parents('.images-list'),
                    $hover = $container.next('.images-list-hover'),
                    $content = $hover.children('.content'),
                    $self = $(this),
                    x = $self.offset().left - $container.offset().left - 10,
                    y = $self.offset().top - $container.offset().top - 10,
                    width = $self.width() + 20,
                    height = $self.height() + 20;

                    $hover.css({
                        'left': x + 'px',
                        'top': y + 'px',
                        'width': width + 'px',
                        'height': height + 'px'
                    });

                   // $content.html($(this).find('.hover').html());
                    console.log($container);
                    console.log($container.offset().left);
                    console.log($container.offset().top);
                    console.log($self.offset().left);
                    console.log($self.offset().top);

                console.log(x,y,width,height);

            });*/
        },
        animations: function() {
            // Animation - appear 
            $('.animated').appear(function() {
                $(this).each(function(){ 
                        var $target =  $(this);
                        var delay = $(this).data('animation-delay');
                        setTimeout(function() {
                            $target.addClass($target.data('animation')).addClass('visible')
                        }, delay);
                });
            });
        },
        masonry: function() {

            /*var $grid = $('.masonry','#content');

            $grid.masonry({
                columnWidth: '.masonry-sizer',
                itemSelector: '.masonry-item',
                percentPosition: true
            });

            $grid.imagesLoaded().progress(function() {
                $grid.masonry('layout');
            });

            $grid.on('layoutComplete', Waypoint.refreshAll());*/

        },
        navPrimary: function() {

            var $header = $('#header');
            var $navBar = $('#nav-bar');
            var $mobileNav = $('#nav-mobile');
            var $section = $('section','#sections-wrapper');
            var $menuItem = $('#nav-primary li > a, #nav-mobile li > a');
            var $scrollers = $('#nav-primary, #nav-mobile, *[data-target="local-scroll"]');
            var contentTopPadding = $('#content').innerHeight() - $('#content').height();

            var currentLocation = window.location.href;
            currentLocation = currentLocation.split('/');
            currentLocation = currentLocation[currentLocation.length-1];

            $scrollers.localScroll({
                offset: -$navBar.height() - (contentTopPadding - $header.height()),
                duration: 800,
                easing: 'easeOutCubic'
            });

            /* Panel Remove */

            $menuItem.on('click', function(e){
                if($(this).data('toggle')!='panel' && $(this).attr('href').indexOf('.html') == -1) {
                    $body.removeClass('panel-open');
                    return false;
                }
            });

            /* Waypoint */

            var checkMenuItem = function(id) {
                $menuItem.each(function(){
                    var link = $(this).attr('href');
                    if(id==link) $(this).addClass('active');
                    else $(this).removeClass('active');
                });
            }

            $section.waypoint({
                handler: function(direction) {
                    if(direction=='up') {
                        var $activeSection = $(this.element);
                        var id = '#'+this.element.id;
                        checkMenuItem(id);
                    }
                },
                offset: function() {
                    return -(this.element.clientHeight - $navBar.outerHeight());
                }
            });

            $section.waypoint({
                handler: function(direction) {
                    if(direction=='down') {
                        var $activeSection = $(this.element);
                        var id = '#'+this.element.id;
                        checkMenuItem(id);
                    }
                },
                offset: function() {
                    return $navBar.outerHeight() + (contentTopPadding - $header.height())
                }
            });

            var scrollPosition = $(window).scrollTop();
            //console.log(scrollPosition)
           // console.log($navBar.height())

            if(scrollPosition > $navBar.height()) {
                $body.addClass('sticky-layout');
                console.log("entro")
            }

            if (currentLocation.indexOf('#') != -1) {
                var currentSection = currentLocation.split('#');
                currentSection = currentSection[currentSection.length-1];
                if($('#'+currentSection).length > 0) {
                    var sectionOffset = $('#'+currentSection).offset().top;
                    $('html, body').animate({ scrollTop: sectionOffset - $navBar.height() - (contentTopPadding - $header.height()) });
                }
            }

        },
        filter: function() {

            var $filterIsotope = $('.filter-isotope'),
                $list,
                filterValue;

            $filterIsotope.each(function(){
                $list = $($(this).data('filter-list'));
                if($list.hasClass('masonry')) {
                    $list.isotope({
                        itemSelector: '.masonry-item',
                        percentPosition: true,
                        masonry: {
                            columnWidth: '.masonry-sizer'
                        }
                    });
                }
                else $list.isotope();
            });

            $filterIsotope.on('click', 'a', function(){

                $list = $($(this).parents('.filter-isotope').data('filter-list'));
                filterValue = $(this).attr('data-filter');

                $list.isotope({
                    filter: filterValue
                });

                $(this).parents('ul').find('.active').removeClass('active');
                $(this).parent('li').addClass('active');

                return false;
            });

        },
        map: function() {

            var $googleMap = $('#google-map');

            if($googleMap.length>0) {
                var yourLatitude = $googleMap.data('latitude');   
                var yourLongitude = $googleMap.data('longitude');  
                var pickedStyle = $googleMap.data('style');     
                var dark = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
                var light = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];

                var pickedStyle = $googleMap.data('style');   

                var myOptions = {
                    zoom: 14,
                    center: new google.maps.LatLng(yourLatitude,yourLongitude),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: false,
                    panControl: false,
                    zoomControl: true,
                    scaleControl: false,
                    streetViewControl: false,
                    scrollwheel: false,
                    styles: eval(pickedStyle)
                };

                var map = new google.maps.Map(document.getElementById('google-map'), myOptions);
                var image = pickedStyle == 'dark' ? 'https://firebasestorage.googleapis.com/v0/b/portafolio-5fd2c.appspot.com/o/location-pin-light.png?alt=media&token=a4787f2c-b9bc-4d67-90f2-2bc94f395390' : 'https://firebasestorage.googleapis.com/v0/b/portafolio-5fd2c.appspot.com/o/location-pin.png?alt=media&token=500cd059-4e19-4c47-8659-fee269fb5ee2';
                var myLatLng = new google.maps.LatLng(yourLatitude,yourLongitude);
                var myLocation = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    icon: image
                });
            }
                
                

        }
    },
    Component: {
        init: function() {  

            this.ajaxModal(); 
            this.carousel(); 
            this.forms();
            this.inputs();
            this.panel();
            this.progressBar();
            this.sectionVideo(); 
            this.shareIt(); 
            this.tabs(); 
            this.twitterFeed();

        },
        ajaxModal: function() {

            $body.append('<div id="ajax-tmp"></div>');

            var toLoad;
            var offsetTop;

            var $ajaxLoader = $('#ajax-loader');
            var $ajaxModal = $('#ajax-modal');
            var $ajaxTmp = $('#ajax-tmp');

            function showNewContent() {
                $ajaxModal.fadeIn(200, function(){
                    $('html').addClass('locked-scrolling');
                });
            }
            
            function loadContent() {　

               /*$ajaxTmp.load(toLoad, function() {

                    $ajaxModal.show(0).addClass('loading-started');
                    $ajaxLoader.fadeIn(200).css('display','inline-block');

                    var $self = $(this);

                    $self.waitForImages({
                        finished: function() {
                            $ajaxModal.html($ajaxTmp.html());

                            setTimeout(function(){
                                $('html').addClass('locked-scrolling');
                                $ajaxModal.children('.ajax-modal-wrapper').show(0);

                                $ajaxModal.addClass('loading-finished');
                                $ajaxLoader.fadeOut(400);

                                $ajaxTmp.html('');
                            },800);
                        },
                        waitForAll: true
                    });
               });*/

                var bhtml="<h1>hola mundo</h1>";
               //$ajaxTmp.load(bhtml, function() {
                $ajaxTmp.innerHTML=bhtml;
                $ajaxModal.show(0).addClass('loading-started');
                $ajaxLoader.fadeIn(200).css('display','inline-block');

                $ajaxModal.html(bhtml);
                setTimeout(function(){
                    $('html').addClass('locked-scrolling');
                    $ajaxModal.children('.ajax-modal-wrapper').show(0);

                    $ajaxModal.addClass('loading-finished');
                    $ajaxLoader.fadeOut(400);

                    $ajaxTmp.html('');
                },800);

        　  }

            function closeDetails() {
                $('html').removeClass('locked-scrolling');
                $(document).scrollTop(offsetTop)
                $ajaxModal.fadeOut(200, function() {
                    $(this).removeClass('loading-started loading-finished');
                })
            }

            $body.delegate('*[data-toggle="ajax-modal"]','click', function() {
                offsetTop = $(document).scrollTop();
                toLoad = $(this).attr('href');　
                loadContent();
                return false; 
            });

            $ajaxModal.delegate('*[data-dismiss="ajax-modal"]','click', function(){
                closeDetails();
                return false;
            });

        },
        carousel: function() {

            $('.carousel').each(function(){

                var items, singleItem, autoPlay, transition, drag, stopOnHover, navigation, pagination;

                items = $(this).data('items');
                singleItem = $(this).data('single-item');
                autoPlay =  $(this).data('autoplay');
                transition = !$(this).data('transition') ? false : $(this).data('transition');
                pagination = !$(this).data('pagination') ? false : true;
                navigation = !$(this).data('navigation') ? false : true;
                drag = transition=="fade" ? false : true;
                stopOnHover = transition=="fade" || pagination==false || navigation==false ? false : true;

                $(this).owlCarousel({
                    items: items,
                    itemsDesktop: [1199,Math.ceil(items*0.6)], 
                    itemsDesktopSmall: [991,Math.ceil(items*0.5)],
                    itemsTablet: [768,Math.ceil(items*0.4)],
                    itemsMobile: [479,Math.ceil(items*0.2)],
                    singleItem: singleItem,
                    autoPlay: autoPlay,
                    pagination: pagination,
                    navigation: navigation,
                    navigationText: false,
                    slideSpeed: 800,
                    stopOnHover: stopOnHover,
                    transitionStyle: transition,
                    mouseDrag: drag,
                    touchDrag: drag,
                    addClassActive: true
                });

            });
        },
        instagramFeed: function(){
            var $feedContainer = $('#instagram-feed'),
                limit =  $feedContainer.data('limit');
            var feed = new Instafeed({
                accessToken: '2969283166.5b9e1e6.69a69480132f4fa18a1554e82291439b',
                userId: '2969283166',
                //get: 'user',
                target: 'instagram-feed',
                template: '<a href="{{link}}" target="_blank"><img src="{{image}}" /></a>',
                limit: limit
            });
            feed.run();
        },
        forms: function(){

            /* Notification Bar */
            var $notificationBar = $('#notification-bar'),
                $notificationClose = $('#notification-bar').find('.close-it');

            var showNotification = function(type,msg) {
                $notificationBar.html('<div class='+type+'>'+msg+'<a href="#" class="close-it"><i class="ti-close"></i></a></div>');
                $notificationBar.addClass('visible');
               /* setTimeout(function(){
                }, 400);
                setTimeout(function(){
                    $notificationBar.removeClass('visible');
                }, 10000);*/
                //console.log("me llamaron")
            };
            $body.delegate('#notification-bar .close-it','click', function(){
                closeNotification();
                return false;
            });

            var closeNotification = function() {
                $notificationBar.removeClass('visible');
            }
            


            /* Validate Form */
            $('.validate-form').each(function(){
                $(this).validate({
                    validClass: 'valid',
                    errorClass: 'error',
                    onfocusout: function(element,event) {
                        $(element).valid();
                    },
                    errorPlacement: function(error,element) {
                        return true;
                    },
                    rules: {
                        email: {
                            required    : true,
                            email       : true
                        }
                    }
                });
            });

            // Sign In
            var $signInForm  = $('.sign-in-form');

            if($signInForm.length>0) {
            
               /* $signInForm.submit(function() {
                    var $btn = $(this).find('.btn-submit'),
                        $form = $(this),
                        response,
                        msgSuccess = $(this).data('message-success'),
                        msgError = $(this).data('message-error');

                    if ($form.valid()){
                        $btn.addClass('loading');
                        $.ajax({
                            type: $form.attr('method'),
                            url:  $form.attr('action'),
                            data: $form.serialize(),
                            cache       : false,
                            dataType    : 'jsonp',
                            jsonp: 'c',
                            contentType: "application/json; charset=utf-8",
                            error       : function(err) {setTimeout(function(){ $btn.addClass('error'); }, 1200); },
                            success     : function(data) {
                                setTimeout(function(){
                                    $btn.addClass(data.result);
                                }, 400);
                            },
                            complete: function(data) {
                                setTimeout(function(){
                                    $btn.removeClass('loading error success');
                                }, 10000);
                            }
                        });
                        return false;
                    }
                    return false;
                });*/

            }

            // Contact Form
            var $contactForm  = $('.contact-form');

            if($contactForm.length>0) {
                
                $contactForm.submit(function() {
                    
                   // var $btn = $(this).find('.btn-submit');
                    //var $form = $(this);
                   // var response;
                   // showNotification("success", "hola mundo")
                  //  showNotification("error", "hola mundo")
                   /* if ($form.valid()){
                        //$btn.addClass('loading');
                        $.ajax({
                            type: 'POST',
                            url:  'assets/php/contact-form.php',
                            data: $form.serialize(),
                            error       : function(err) { setTimeout(function(){ $btn.addClass('error'); }, 1200); },
                            success     : function(data) {
                                if (data != "success") {
                                    response = 'error';
                                } else {
                                    response = 'success';
                                }
                                setTimeout(function(){
                                    $btn.addClass(response);
                                }, 400);
                            },
                            complete: function(data) {
                                setTimeout(function(){
                                    $btn.removeClass('loading error success');
                                }, 10000);
                            }
                        });
                        return false;
                    }*/
                    return false;
                });

            }

        },
        inputs: function(){
            $('.form-control').on('focusout', function(){
                if(this.value) $(this).addClass('has-value');
                else $(this).removeClass('has-value');

            });
        },
        modal: function() {

            $('.modal[data-timeout]').each(function(){
                var timeout = $(this).data('timeout'),
                    $this = $(this);
                setTimeout(function() {
                    $this.modal('show');
                }, timeout)
            });

        },
        panel: function() {
            $('[data-toggle="panel"]').on('click', function(){
                $body.toggleClass('panel-open');
                return false;
            });
        },
        progressBar: function() {
           /* $('.progress-bar').appear(function() {
                $(this).each(function() {
                    var value;
                    value = $(this).attr('aria-valuenow');
                    console.log(value)
                    $(this).html(value + '%').css('width', value + '%');
                });
            });*/
        },
        sectionVideo: function() {
            $('.section-video .btn-play').on('click', function(){
                var video = '<iframe src="' + $(this).attr('href') + '" autoplay="1"></iframe>';
                var $container =  $(this).parents('.section-video');
                $container.addClass('playing');
                var width = $container.width();
                var height = $container.height();

                $(this).siblings('.image').html(video);
                $container.find('iframe').css({
                    'width': width + 'px',
                    'height': height + 'px'
                });
                return false;
            });
        },
        shareIt: function() {
            $('#share-it > .icon-share').on('click', function(){
                $(this).parent('#share-it').toggleClass('open');
                return false;
            });
        },
        tabs: function() {
            $('.tabs-wrapper').each(function(){
                var $selector = $(this).children('.selector'),
                    $elActive = $(this).find('.active'),
                    navOffset = $(this).offset().left,
                    thisOffset = $elActive.offset().left,
                    offset = thisOffset - navOffset,
                    width = $elActive .outerWidth();

                $selector.css({
                    'width': width+'px',
                    'left': offset+'px'
                });
            })

            $('.tabs-wrapper > .nav-tabs > li > a').on('click', function(){
                var $selector = $(this).parents('.tabs-wrapper').children('.selector'),
                    navOffset = $(this).parents('.tabs-wrapper').offset().left,
                    thisOffset = $(this).offset().left,
                    offset = thisOffset - navOffset,
                    width = $(this).outerWidth();

                    $selector.css({
                        'width': width+'px',
                        'left': offset+'px'
                    });
            });
        },
        twitterFeed: function() {
            $('.twitter-feed').each(function() {
                var count = $(this).data("count");
                $(this).twittie({
                    apiPath: 'assets/api/twitter/tweet.php',
                    count: count,
                    template: '{{tweet}} - <span class="date">{{date}}</span>'
                });
            });
        },
        typing: function() {
            $('.typing').appear(function(){
                $(this).each(function(){
                    var text = [$(this).html()];
                    var height = $(this).height();
                    $(this).html('').parent('.typing-wrapper').css('min-height',height+'px');
                    $(this).typed({
                        strings: text,
                        startDelay: 1000,
                        typeSpeed: 30,
                        contentType: 'html'
                    });
                });
            });
        },
        tooltip: function() {
            $("[data-toggle='tooltip']").tooltip();
        }
    }
};

$(document).ready(function (){
    Mat.init();
});

$(window).scroll(function(){
    setHeader();
});

$(window).load(function(){
    Mat.Component.typing();
    $body.addClass('loaded');
    $('#page-loader').fadeOut(600, function(){
        Mat.Basic.animations();
    });
});


