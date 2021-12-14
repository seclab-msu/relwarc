var total;
        var male_height;
        var female_height;
        var ages;
        var males;
        var females;
        $(window).ready(function() {

            var window_h = $(window).height();
            var nav_data = [];
            var now_nav = $('.rd_nav_m_btn.now').index();

            if($(this).scrollTop() < 500){
                $('.rd_gotop_btn').hide()
            }else{
                $('.rd_gotop_btn').show()
            }

            $('.rd_nav_m_btn').each(function(index, this_dom){
                nav_data[index]= 0;
                for(var i=0;i<=index;i++){
                    nav_data[index] += $('.rd_nav_m_btn').eq(i).outerWidth();
                }
            });

            $(window).resize(function(){
                window_h = $(window).height();
            });

            $(window).scroll(function(){
                var _now_top = $(this).scrollTop();
                if(_now_top < 500){
                    $('.rd_gotop_btn').hide()
                }else{
                    $('.rd_gotop_btn').show()
                }
                $('.rd_nav_btn').each(function () {
                    var btn_nav = $(this).data('nav');
                    var target_area_top = $('#'+btn_nav).offset().top;
                    if(_now_top >= ( target_area_top - (window_h/2))){
                        $('.rd_nav_btn').removeClass('now');
                        $(this).addClass('now');
                    }
                });
                $('.rd_nav_m_btn').each(function () {
                    var btn_nav = $(this).data('nav');
                    var target_area_top = $('#'+btn_nav).offset().top;
                    if(_now_top >= ( target_area_top - (window_h/2))){
                        $('.rd_nav_m_btn').removeClass('now');
                        $(this).addClass('now');
                    }
                });
                if(now_nav != $('.rd_nav_m_btn.now').index()){
                    now_nav = $('.rd_nav_m_btn.now').index();
                    if(now_nav > 0){
                        $('.rd_mobile_menu .view').scrollLeft(nav_data[(now_nav-1)])
                    }else{
                        $('.rd_mobile_menu .view').scrollLeft(0)
                    }
                }
            });

            $('.rd_nav_btn').on('click touchend',function () {
                $('.rd_nav_btn').removeClass('now');
                $(this).addClass('now');

                var _target = $(this).data('nav');
                if(_target == 'rd_area_05'){
                    var top = $('#' + _target).offset().top - 70;
                }else if(_target == 'rd_area_09'){
                    var top = $('#' + _target).find('.index_svg').offset().top - 110;
                }else if(_target == 'rd_area_01'){
                    var top = $('#' + _target).find('.index_svg').offset().top - 130;                    
                }else if(_target == 'rd_area_02'){
                    var top = $('#' + _target).find('.index_svg').offset().top - 130;
                }else if(_target == 'rd_area_03'){
                    var top = $('#' + _target).find('.index_svg').offset().top - 130;
                }else if(_target == 'rd_area_04'){
                    var top = $('#' + _target).find('.index_svg').offset().top - 130;
                }else if(_target == 'rd_area_06'){
                    var top = $('#' + _target).find('.index_svg').offset().top - 130;                                                                                
                }else if(_target == 'rd_area_07'){
                    var top = $('#' + _target).find('.index_svg').offset().top - 130;
                }else if(_target == 'rd_area_08'){
                    var top = $('#' + _target).find('.index_svg').offset().top - 130;
                }else if(_target == 'rd_area_10'){
                    var top = $('#' + _target).find('.index_svg').offset().top - 130;                                                            
                }else {
                    var top = $('#' + _target).find('.index_svg').offset().top - 70;
                }
                jQuery("html,body").animate({
                    scrollTop: (top - $('.rd_header_index').outerHeight())
                }, 1000);
                //console.log(_target);
            });



            $('.rd_nav_m_btn').on('click',function () {
                $('.rd_nav_m_btn').removeClass('now');
                $(this).addClass('now');

                var _target = $(this).data('nav');
                var top = $('#'+_target).offset().top;

                jQuery("html,body").animate({
                    scrollTop: (top - $('.rd_header_index').outerHeight() - $('.page_nav_m_index').outerHeight())
                }, 1000);
            });


            $('.rd_m_menu_btn').on('click',function () {
                $('.rd_m_menu').slideDown(300);
                $('.rd_m_menu').addClass('open');

                
                $('html body').css({'overflow':'hidden'});
                $('html body').css({'position':'fixed' });
            });

            $('.rd_m_menu_close_btn').on('click',function () {
                if($('.rd_m_menu').hasClass('open')){
                    $('.rd_m_menu').removeClass('open');
                    $('.rd_m_menu').slideUp(300);

                    
                    $('html body').css({'overflow':'auto'});
                    $('html body').css({'position':'static'});
                }
            });

            $('.rd_search_btn').on('click',function () {
                $('#search_form').submit();
            });

            $('.rd_search_m_btn').on('click',function () {
                $('#search_m_form').submit();
            });

            $('.search_input').on('focus',function () {
                $(this).closest('.top_search').addClass('now');
            });

            $('.search_input').on('focusout',function () {
                if($(this).closest('.top_search').hasClass('now')){
                    $(this).closest('.top_search').removeClass('now');
                }
            });
            var index_url = new Vue({
                el: '#v-index_url',
                methods: {
                    index_url : function(){
                        gotoURL('https://event.1111.com.tw/careermaster');
                    },
                },
            });

            var index = new Vue({
                el: '#v-index_area',
                data: {
                    jobPosition: '',
                    jobUrl: '',
                    article: [],
                    promotionsData: [],
                    careerTypeData: {
                        holland: {
                            all_holland_categories: {},
                            no_job_score: {},
                            job: {
                                score: {},
                                main_holland_category: {},
                                holland_categories: {}
                            }
                        },
                        job_star: {}
                    },
                    careerTypeData_Url: '',
                    data: {
                        percentage: {},
                        chart_data:{
                            age   :[],
                            male  :[],
                            female:[]
                        }
                    },
                    window_resize : vue_window.state
                },
                
                watch:{
                    window_resize :{
                        handler: function (obj, old_obj){

                            var no_job_score       = this.careerTypeData.holland.no_job_score;
                            var main_job_score     = this.careerTypeData.holland.job.score;
                            var holland_categories = this.careerTypeData.holland.all_holland_categories;

                            this.resetChartHollandBox();

                            bulidRadar(no_job_score,main_job_score,holland_categories,this.getViewMode());
                            if(this.getViewMode()=='mobile' ){
                                
                                $('.rd_drag').show();
                            }else{
                                
                                $('.rd_drag').hide();
                            }
                        },
                        deep : true
                    }
                },
                created: function(){
                    this.showFullLoading();              
                    this.getRandomJobPosition()
                },
                methods: {
                    getRandomJobPosition: function () {
                        var _this = this;
                        var url = 'https://event.1111.com.tw/careermaster/position/random';

                        axios.post(url)
                            .then(function (response) {
                                _this.jobPosition = response.data.data;
                                var job_url = '';
                                                                    job_url = 'https://event.1111.com.tw/careermaster/detail/%replaceData%';
                                    _this.jobUrl = job_url.replace('%replaceData%', _this.jobPosition.job_category_id);
                                                                _this.getArticleList(_this.jobPosition.job_category_id);
                                _this.getSexData(_this.jobPosition.job_category_id);
                                _this.getPromotionsData(_this.jobPosition.job_category_id);
                                _this.getCareerTypeData(_this.jobPosition);
                            })
                            .catch(function (error) {
                                
                            })
                            .finally(function () {
                                
                                _this.hideLoading();
                                _this.setSlickAction();
                                $('#v-index_area').find('.rd_loading').children().show();
                            })
                    },
                    getSexData: function (jobCategory) {
                        var _this = this;
                        var url = 'https://event.1111.com.tw/careermaster/detail/%replaceData%/3/json';
                        url = url.replace('%replaceData%', jobCategory);
                        axios.post(url)
                            .then(function (response) {
                                _this.showSexData(_this, response);
                                _this.$nextTick(function () {
                                    
                                    if ($('.rd_random_job_slick').visible(true)) {
                                        $('.rd_male_bar').find('p').addClass('animation1');
                                        $('.rd_female_bar').find('p').addClass('animation');
                                    }
                                            
                                    else {
                                        $(window).on('scroll.section03', function () {

                                            if ($('.rd_random_job_slick').visible(true)) {
                                                
                                                $(window).off('scroll.section03');
                                                $('.rd_male_bar').find('p').addClass('animation1');
                                                $('.rd_female_bar').find('p').addClass('animation');
                                            }
                                        });
                                    }
                                });
                            })
                            .catch(function (error) {
                                

                            })
                            .finally(function () {
                                
                            })
                    },
                    showSexData: function (me, response) {
                        var _this = this;

                        me.data       = response.data.data.result;
                        total         = response.data.data.result.total;
                        female_height = response.data.data.result.percentage.female;
                        male_height   = response.data.data.result.percentage.male;
                        ages          = response.data.data.result.chart_data.age;
                        males         = response.data.data.result.chart_data.male;
                        females       = response.data.data.result.chart_data.female;

                        water(male_height, female_height);

                        
                        if(this.getViewMode()=='mobile' ){
                            $('.rd_drag').show();
                        }else{
                            $('.rd_drag').hide();
                        }

                        setTimeout(function () {
                            $('.rd_male_bar').find('p').addClass('animation1');
                            $('.rd_female_bar').find('p').addClass('animation');
                        },200)
                    },
                    
                    chartSexAndAgeOnLeave : function() {
                        $('.rd_sex_and_age').css('opacity',1);
                        $('.rd_sex_and_age_description').hide();
                    },
                    
                    chartSexAndAgeOnHover : function(index){
                        $('.rd_sex_and_age').css('opacity',0.3);
                        $('.rd_sex_and_age_bar').eq(index).find('.rd_sex_and_age').css('opacity',1);
                        $('.rd_drag').css('top',parseInt($('.rd_sex_and_age_bar').css('height'))*index+'px');

                        var males_val   = $('.rd_sex_and_age_bar').eq(index).find('.male_bar').data('value');
                        var females_val = $('.rd_sex_and_age_bar').eq(index).find('.female_bar').data('value');

                        var males_percentage = 100 * (males_val / total);
                        var females_percentage = 100 * (females_val / total);

                        this.showSexAndAgeDescription(males_percentage,females_percentage,(index-55)*-1);
                    },
                    
                    showSexAndAgeDescription :function (_male_val,_female_val,age) {
                        var mouse_X = event.clientX;
                        var mouse_Y = event.clientY;
                        var description = $('.rd_sex_and_age_description');

                        if(this.getViewMode() != 'mobile') {
                            description.show();
                            description.css({
                                'left': (mouse_X-parseInt(document.getElementsByClassName('rd_sexes_chart_box')[0].getBoundingClientRect().left)) + 'px',
                                'top' : (mouse_Y-parseInt(document.getElementsByClassName('rd_sexes_chart_box')[0].getBoundingClientRect().top )) + 'px',
                            });
                        }
                        $('.rd_male_val').text(parseFloat(_male_val).toFixed(2));
                        $('.rd_female_val').text(parseFloat(_female_val).toFixed(2));
                        $('.rd_age').text(age);
                    },
                    getArticleList: function (jobCategory) {
                        var _this = this;
                        var url = 'https://event.1111.com.tw/careermaster/apis/articles/detail/%replaceData%';
                        url = url.replace('%replaceData%', jobCategory);
                        axios.get(url)
                            .then(function (response) {
                                var articles = response.data.getKnowledgeByIDResult.knowledge_item;
                                _this.article = articles[Math.floor(Math.random() * articles.length)];
                            })
                            .catch(function (error) {
                                
                            })
                            .finally(function () {
                                
                                _this.setDotDot();
                            })
                    },
                    setDotDot: function () {
                        $('.rd_list_short_text').dotdotdot({wrap: 'letter'});
                    },
                    getPromotionsData: function (jobCategory) {
                        this.loading = true;
                        var _this = this;
                        var url = 'https://event.1111.com.tw/careermaster/detail/%replaceData%/9/json';
                        url = url.replace('%replaceData%', jobCategory);
                        axios.post(url)
                            .then(function (response) {

                                
                                _this.promotionsData = response.data.data;
                            })
                            .catch(function (error) {
                                

                            })
                            .finally(function () {
                                
                            })
                    },
                    getCareerTypeData: function(jobCategory) {
                        var _this = this;

                        var url = 'https://event.1111.com.tw/careermaster/detail/%replaceData%/4/json';
                        url = url.replace('%replaceData%', jobCategory.job_category_id);
                        axios.post(url)
                            .then(function(response) {
                                
                                setTimeout(function () {
                                    _this.showCareerTypeData(_this, response);
                                },300);
                                _this.getCareerTypeDataUrl(jobCategory);
                            })
                            .catch(function (error) {
                                

                            })
                            .finally(function(){
                                
                            })
                    },
                    resetChartHollandBox: function () {
                        $('#chart_holland_box').html("");
                        do {
                            $('#chart_holland_box').css('width', '100%');
                        }while($('#chart_holland_box').width() == 0);

                        var new_canvas = $(document.createElement('canvas'));

                        new_canvas.attr('id','chart_holland');
                        new_canvas.attr('width','100');
                        new_canvas.attr('height','115');

                        var holland_size = 0.99;

                        $('#chart_holland_box').css('height', $('.rd_start_img_box').height());
                        var chart_holland_box_width  = parseInt($('#chart_holland_box').width())*holland_size;
                        var chart_holland_box_height = parseInt($('#chart_holland_box').height())*holland_size;
                        var width                    = 0;

                        if(chart_holland_box_width >= chart_holland_box_height){
                            width = (chart_holland_box_height)+'px';
                        } else if(chart_holland_box_width < chart_holland_box_height) {
                            width = (chart_holland_box_width)+'px';
                        }

//                        if(width != 0) {
                            $('#chart_holland_box').css('width', width);

                        $('#chart_holland_box').append(new_canvas);
                    },
                    showCareerTypeData: function(me, response) {
                        me.careerTypeData = response.data.data.result;

                        var no_job_score       = me.careerTypeData.holland.no_job_score;
                        var main_job_score     = me.careerTypeData.holland.job.score;
                        var holland_categories = me.careerTypeData.holland.all_holland_categories;
                        this.resetChartHollandBox();

                        bulidRadar(no_job_score,main_job_score,holland_categories,this.getViewMode());
                        if(this.getViewMode()=='mobile' ){
                            
                            $('.rd_drag').show();
                        }else{
                            
                            $('.rd_drag').hide();
                        }
                    },
                    getCareerTypeDataUrl: function(jobCategory) {
                        var _this = this;

                        var url = 'https://event.1111.com.tw/careermaster/images/planet/%replaceData%';
                        url = url.replace('%replaceData%', jobCategory.job_star_category_id);
                        _this.careerTypeData_Url = url;
                    },
                    setSlickAction : function(){
                        $('#rd_random_job_slick').init(function(){
                            $('ul.slick-dots').addClass('dot_box ul');
                            
                            $('ul.slick-dots li').addClass('dot').css({'height':'auto','width':'auto'});
                        });

                        $('#rd_random_job_slick').slick({
                            prevArrow:'<div class="prev"><div class="arrow"></div></div>',
                            nextArrow:'<div class="next"><div class="arrow"></div></div>',
                            appendArrows: $('.random_job_slick_control .arrow_box'),
                            dots: true,
                            infinite: true,
                            /*fade: true,*/
                            appendDots: $('.random_job_slick_control .dot_area'),
                            customPaging: function(slider, i) {
                                return '<div class="iso_cube slick_dot">\n' +
                                           '<div class="scale_cubic">\n' +
                                                '<div class="top_poly"></div>\n' +
                                            '</div>\n' +
                                           '<div class="bottom clearfix">\n' +
                                               '<div class="lpart"></div>\n' +
                                               '<div class="rpart"></div>\n' +
                                           '</div>\n' +
                                       '</div>';
                            },
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            autoplay: true,
                            autoplaySpeed: 5000,
                            focusOnSelect: true
                        });

                        $(function() {
                            $('*[draggable!=true]','.slick-track').unbind('dragstart');
                            $( ".rd_drag" ).draggable();
                        });

                        $(".rd_drag").on("draggable mouseenter mousedown",function(event){
                            event.stopPropagation();
                        });

                        var drag  = $('.rd_drag');
                        var _this = this;

                        drag.draggable({
                            axis: "y" ,
                            containment: ".rd_sexes_chart_box",
                            drag: function() {

                                var get_index = (parseInt((parseInt($(this).css('top')))/parseInt($('.rd_sex_and_age_bar').css('height')))-55)*-1;
                                var age_index = 0;

                                $.each(ages,function (index,item) {
                                    if(parseInt(item) == get_index){
                                        age_index = index;
                                    }
                                });

                                _this.chartSexAndAgeOnHover(age_index);
                            }
                        });
                    },
                    resume_more : function(){
                        gotoURL('https://www.1111.com.tw/careermaster/resume/Home', 'open');
                    },
                    change_resume_more : function(){
                        gotoURL('https://www.1111.com.tw/careermaster/resume/SignUpMoney', 'open');
                    },
                    cstar_more : function(){
                        gotoURL('https://assessment.1111.com.tw/cstar/', 'open');
                    },
                    article_more : function(){
                        gotoURL(this.article.url, 'open');
                    },
                    magician_more : function(){
                        gotoURL('https://www.1111.com.tw/14sp/autobi2014/', 'open');
                    },
                },
                mounted: function() {

                    menu_scroll();

                    $(document).on("scroll", function () {
                        menu_scroll();
                    });


                    
                    
                    var index_01_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('index_01'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/index_01.json',
                                        });
                    index_01_svg.setSpeed(1.1);

                    var _this = this;

                    if ($('#index_01').visible(true)) {

                        setTimeout(function() {
                            _this.hideFullLoading();

                            index_01_svg.play();
                        }, 500);
                    } else {
                        _this.hideFullLoading();

                        $(window).on('scroll.index_01', function() {

                            if ($('#index_01').visible(true)) {
                                
                                $(window).off('scroll.index_01');

                                index_01_svg.play();
                            }
                        });
                    }

                    
                    var post_view01_svg = bodymovin.loadAnimation({
                            container: document.getElementById('post_view01'),
                            renderer: 'svg',
                            loop: false,
                            autoplay: false,
                            path: "https://event.1111.com.tw/careermaster/ridea/svg/post_view01.json",
                        });
                    post_view01_svg.setSpeed(0.85);

                    
                        
                        
                            
                            

                            
                        
                        
                    

                    if ($('#post_view01').visible(true)) {
                        post_view01_svg.play();
                    } else {
                        $(window).on('scroll.post_view01', function() {

                            if ($('#post_view01').visible(true)) {
                                
                                $(window).off('scroll.post_view01');

                                post_view01_svg.play();
                            }
                        });
                    }

                    
                    var post_view02_svg = bodymovin.loadAnimation({
                                                container: document.getElementById('post_view02'),
                                                renderer: 'svg',
                                                loop: false,
                                                autoplay: false,
                                                path: "https://event.1111.com.tw/careermaster/ridea/svg/post_view02.json",
                                            });
                    post_view02_svg.setSpeed(0.85);

                    
                        
                        
                            
                            

                            
                        
                        
                    

                    if ($('#post_view02').visible(true)) {
                        post_view02_svg.play();
                    } else {
                        $(window).on('scroll.post_view02', function() {

                            if ($('#post_view02').visible(true)) {
                                
                                $(window).off('scroll.post_view02');

                                post_view02_svg.play();
                            }
                        });
                    }

                    
                    var post_view03_svg = bodymovin.loadAnimation({
                                                container: document.getElementById('post_view03'),
                                                renderer: 'svg',
                                                loop: false,
                                                autoplay: false,
                                                path: "https://event.1111.com.tw/careermaster/ridea/svg/post_view03.json",
                                            });
                    post_view03_svg.setSpeed(0.85);

                    
                        
                        
                            
                            

                            
                        
                        
                    

                    if ($('#post_view03').visible(true)) {
                        post_view03_svg.play();
                    } else {
                        $(window).on('scroll.post_view03', function() {

                            if ($('#post_view03').visible(true)) {
                                
                                $(window).off('scroll.post_view03');

                                post_view03_svg.play();
                            }
                        });
                    }

                    
                    var index_02_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('index_02'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/index_02.json',
                                        });
                    index_02_svg.setSpeed(1.1);

                    
                    var index_03_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('index_03'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/index_03.json',
                                        });
                    index_03_svg.setSpeed(0.75);

                    
                    var index_04_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('index_04_svg'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/index_04.json',
                                        });

                    
                    var index_04_radar01_svg = bodymovin.loadAnimation({
                                                    container: document.getElementById('index_04_radar01_svg'),
                                                    renderer: 'svg',
                                                    loop: false,
                                                    autoplay: false,
                                                    path: 'https://event.1111.com.tw/careermaster/ridea/svg/index_04_radar01.json',
                                                });

                    
                    var index_04_radar02_svg = bodymovin.loadAnimation({
                                                    container: document.getElementById('index_04_radar02_svg'),
                                                    renderer: 'svg',
                                                    loop: false,
                                                    autoplay: false,
                                                    path: 'https://event.1111.com.tw/careermaster/ridea/svg/index_04_radar02.json',
                                                });

                    
                    var map_map_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('map_map'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/map_mapa.json',
                                        });

                    
                    var map_key_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('map_key'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/map_key.json',
                                        });

                    
                    var map_box_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('map_box'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/map_box.json',
                                        });


                    
                    var map_book_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('map_book'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/map_book.json',
                                        });


                    
                    var map_test_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('map_test'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/map_test.json',
                                        });

                    
                    var map_license_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('map_license'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/map_license.json',
                                        });


                    
                    var index_06_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('index_06_svg'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/index_06.json',
                                        });

                    
                    var index_07_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('index_07_svg'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/index_07.json',
                                        });

                    
                    var index_08_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('index_08_svg'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/index_08.json',
                                        });

                    
                    var index_09_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('index_09_svg'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/index_09.json',
                                        });

                    
                    var index_10_svg = bodymovin.loadAnimation({
                                            container: document.getElementById('index_10_svg'),
                                            renderer: 'svg',
                                            loop: false,
                                            autoplay: false,
                                            path: 'https://event.1111.com.tw/careermaster/ridea/svg/index_10.json',
                                        });

                    

                    setTimeout(function() {
                        var _hash = location.hash.slice(1);
                        if( _hash !=""){
                            $(".rd_nav_btn[data-nav="+ _hash +"]").click();
                        }                        
                    },2500);

                    setTimeout(function() {



                        if ($('#index_02_anchor').visible(true)) {
                            index_02_svg.play();
                        } else {
                            $(window).on('scroll.index_02', function() {

                                if ($('#index_02_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.index_02');

                                    index_02_svg.play();
                                }
                            });
                        }

                        if ($('#index_03_anchor').visible(true)) {
                            index_03_svg.play();
                        } else {
                            $(window).on('scroll.index_03', function() {

                                if ($('#index_03_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.index_03');

                                    index_03_svg.play();
                                }
                            });
                        }

                        if ($('#index_04_svg_anchor').visible(true)) {
                            index_04_svg.play();
                        } else {
                            $(window).on('scroll.index_04_svg', function() {

                                if ($('#index_04_svg_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.index_04_svg');

                                    index_04_svg.play();
                                }
                            });
                        }

                        if ($('#index_04_radar01_svg_anchor').visible(true)) {
                            index_04_radar01_svg.play();
                        } else {
                            $(window).on('scroll.index_04_radar01_svg', function() {

                                if ($('#index_04_radar01_svg_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.index_04_radar01_svg');

                                    index_04_radar01_svg.play();
                                }
                            });
                        }

                        if ($('#index_04_radar02_svg_anchor').visible(true)) {
                            index_04_radar02_svg.play();
                        } else {
                            $(window).on('scroll.index_04_radar02_svg', function() {

                                if ($('#index_04_radar02_svg_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.index_04_radar02_svg');

                                    index_04_radar02_svg.play();
                                }
                            });
                        }

                        if ($('#map_map_anchor').visible(true)) {
                            map_map_svg.play();
                        } else {
                            $(window).on('scroll.map_map', function() {

                                if ($('#map_map_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.map_map');

                                    map_map_svg.play();
                                }
                            });
                        }

                        if ($('#map_key_anchor').visible(true)) {
                            map_key_svg.play();
                        } else {
                            $(window).on('scroll.map_key', function() {

                                if ($('#map_key_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.map_key');

                                    map_key_svg.play();
                                }
                            });
                        }

                        if ($('#map_box_anchor').visible(true)) {
                            map_box_svg.play();
                        } else {
                            $(window).on('scroll.map_box', function() {

                                if ($('#map_box_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.map_box');

                                    map_box_svg.play();
                                }
                            });
                        }

                        if ($('#map_book_anchor').visible(true)) {
                            map_book_svg.play();
                        } else {
                            $(window).on('scroll.map_book', function() {

                                if ($('#map_book_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.map_book');

                                    map_book_svg.play();
                                }
                            });
                        }

                        if ($('#map_test_anchor').visible(true)) {
                            map_test_svg.play();
                        } else {
                            $(window).on('scroll.map_test', function() {

                                if ($('#map_test_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.map_test');

                                    map_test_svg.play();
                                }
                            });
                        }

                        if ($('#map_license_anchor').visible(true)) {
                            map_license_svg.play();
                        } else {
                            $(window).on('scroll.map_license', function() {

                                if ($('#map_license_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.map_license');

                                    map_license_svg.play();
                                }
                            });
                        }

                        if ($('#index_06_svg_anchor').visible(true)) {
                            index_06_svg.play();
                        } else {
                            $(window).on('scroll.index_06_svg', function() {

                                if ($('#index_06_svg_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.index_06_svg');

                                    index_06_svg.play();
                                }
                            });
                        }

                        if ($('#index_07_svg_anchor').visible(true)) {
                            index_07_svg.play();
                        } else {
                            $(window).on('scroll.index_07_svg', function() {

                                if ($('#index_07_svg_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.index_07_svg');

                                    index_07_svg.play();
                                }
                            });
                        }

                        if ($('#index_08_svg_anchor').visible(true)) {
                            index_08_svg.play();
                        } else {
                            $(window).on('scroll.index_08_svg', function() {

                                if ($('#index_08_svg_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.index_08_svg');

                                    index_08_svg.play();
                                }
                            });
                        }

                        if ($('#index_09_svg_anchor').visible(true)) {
                            index_09_svg.play();
                        } else {
                            $(window).on('scroll.index_09_svg', function() {

                                if ($('#index_09_svg_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.index_09_svg');

                                    index_09_svg.play();
                                }
                            });
                        }

                        if ($('#index_10_svg_anchor').visible(true)) {
                            index_10_svg.play();
                        } else {
                            $(window).on('scroll.index_10_svg', function() {

                                if ($('#index_10_svg_anchor').visible(true)) {
                                    
                                    $(window).off('scroll.index_10_svg');

                                    index_10_svg.play();
                                }
                            });
                        }

                    }, 1000);

                    
                    if ($('#area_02_list').visible(true)) {
                        
                        showAnimationPeriodically('area_02_list');
                    } else {
                        $(window).on('scroll.area_02_list', function() {

                            if ($('#area_02_list').visible(true)) {
                                
                                $(window).off('scroll.area_02_list');

                                
                                showAnimationPeriodically('area_02_list');
                            }
                        });
                    }

                    
                    if ($('#resume_service').visible(true)) {
                        
                        showAnimationPeriodically('resume_service');
                    } else {
                        $(window).on('scroll.resume_service', function() {

                            if ($('#resume_service').visible(true)) {
                                
                                $(window).off('scroll.resume_service');

                                
                                showAnimationPeriodically('resume_service');
                            }
                        });
                    }

                    
                    if ($('#talk_contain').visible(true)) {
                        
                        showAnimationPeriodically('talk_contain');
                    } else {
                        $(window).on('scroll.talk_contain', function() {

                            if ($('#talk_contain').visible(true)) {
                                
                                $(window).off('scroll.talk_contain');

                                
                                showAnimationPeriodically('talk_contain');
                            }
                        });
                    }

                    
                    if ($('#analyis_list').visible(true)) {
                        
                        showAnimationPeriodically('analyis_list');
                    } else {
                        $(window).on('scroll.analyis_list', function() {

                            if ($('#analyis_list').visible(true)) {
                                
                                $(window).off('scroll.analyis_list');

                                
                                showAnimationPeriodically('analyis_list');
                            }
                        });
                    }

                    
                    if ($('#magic_list').visible(true)) {
                        
                        showAnimationPeriodically('magic_list');
                    } else {
                        $(window).on('scroll.magic_list', function() {

                            if ($('#magic_list').visible(true)) {
                                
                                $(window).off('scroll.magic_list');

                                
                                showAnimationPeriodically('magic_list');
                            }
                        });
                    }

                    
                    if ($('#ind_mind').visible(true)) {
                        
                        showAnimationPeriodically('ind_mind');
                    } else {
                        $(window).on('scroll.ind_mind', function() {

                            if ($('#ind_mind').visible(true)) {
                                
                                $(window).off('scroll.ind_mind');

                                
                                showAnimationPeriodically('ind_mind');
                            }
                        });
                    }
                }
            });
        });

        
        function menu_scroll(){
            var $top = $(".top");
                    
            var $header_index = $(".header.index");
                    
            var $page_nav_m_index = $('.page_nav_m_index');
            var _nowTop = $(document).scrollTop();
            if (_nowTop > 90) {
                $top.css('position', "fixed");
                $header_index.addClass("scroll_down");
                $page_nav_m_index.addClass("fix_style");
            } else {
                $top.css('position', 'relative');
                $header_index.removeClass("scroll_down");
                $page_nav_m_index.removeClass("fix_style");
            }            
        }

        
        function showAnimationPeriodically(id) {
            $('#'+id).find('.rd_anima_scale_in').each(function(index, element) {
                var delay = 300;  

                setTimeout(function() {
                    $(element).addClass('anima_scale_in');
                }, index * delay);
            });
        }

        $(document).ready(function(e) {
            $('img[usemap]').rwdImageMaps();
        });

function ScrollTrace(){
  var stored_height = $('#rd_area_01').outerHeight();
  var stored_height1 = stored_height + $('#rd_area_02').outerHeight();
  var stored_height2 = stored_height1 + $('#rd_area_03').outerHeight();  
  var stored_height3 = stored_height2 + $('#rd_area_04').outerHeight();                 
  var stored_height4 = stored_height3 + $('#rd_area_05').outerHeight();                 
  var stored_height5 = stored_height4 + $('#rd_area_06').outerHeight();                 
  var stored_height6 = stored_height5 + $('#rd_area_07').outerHeight(); 
  var stored_height7 = stored_height6 + $('#rd_area_08').outerHeight();              
  var stored_height8 = stored_height7 + $('#rd_area_09').outerHeight();
  var stored_height9 = stored_height8 + $('#rd_area_10').outerHeight();
      
  var a = 0;  var b = 0;var c = 0;var d = 0;  var e = 0;var f = 0;var g = 0;  var h = 0;var i = 0;var j = 0;
$(document).ready(ScrollTrace);
}
