$(document).ready(function() {
    var gameIsOn = false;
    var randomLeft;
    var rainLeft;
    var rainWidth = $('.rain').css('width');
    var marioTop = parseInt($('body').css('height')) - parseInt($('.character').css('height'));
    var marioLeft = 0;
    var marioWidth = parseInt($('.character').css('width'));
    var marioBody = marioLeft + marioWidth;
    var rainGround = parseInt($('body').height()) - parseInt($('.ground').height()) - 13;
    var rainHit = false;
    var rainNum = 0;
    var rainNumClass;

    var rainTop;
    var rainTimerSet;
    var rainElements;
    var randomSpeed;

    var rainCond;

    function gameReset() {
        $('.play').hide();
        rainCreate();
        //rainFall();
        gameIsOn = true;
        rainHit = false;
        marioLeft = 0;
        marioBody = marioLeft + marioWidth;

        $('.character').css('left', marioLeft);
    
        //console.log('rainHit = ' + rainHit);
        //console.log('gameIsOn = ' + gameIsOn);
    }

    $('.play').click(function() {
       gameReset();
    });

    $(document).keydown(function(key) {
        switch(parseInt(key.which)) {
            case 13:
                gameReset();
                break;
            case 65:
            case 37: //Walk Left
                if(parseInt($('.character').css('left')) > 0) {

                   var walkLeft = parseInt($('.character').css('left'));
                    $('.character').css('left', walkLeft -= 64);
                    marioLeft = parseInt($('.character').css('left')); 
                    marioBody = marioLeft + marioWidth;
                }
                
                else if (parseInt($('.character').css('left')) + (marioWidth) <= 0) {
                    $('.character').animate({left: "+=0px"}, 'fast', function() {
                        $('.character').css('left', 0);
                        console.log('hit left wall = ');
                        console.log($('.character').css('left'));
                    });
                }
                break;
            case 68:
            case 39: //Walk Right
                if(parseInt($('.character').css('left')) + (marioWidth) < 1024) {
                    var walkRight = parseInt($('.character').css('left'));
                    $('.character').css('left', walkRight += 64);
                    marioLeft = parseInt($('.character').css('left')); 
                    marioBody = marioLeft + marioWidth;
                }
                
                break;
            defaultkey: "value"
                break;
        }
    });

    function rainCreate() {
        $('.rain').remove();
        for(i = 1; i <= 2; i++) {
            $('#content_wrap').prepend('<div class="rain"></div>');
        }
        console.log('raincreate');

        rainElements = $('.rain');

        rainFall();
    }

    function rainFall() {
        //console.log('rainfall');

        //console.log('rainFall rainHit = ' + rainHit);
        rainNum++;
        //console.log('rainNum = ' + rainNum);

        $('.rain').css('top', '-20px');
        //rainTop = parseInt($('.rain').css('top'));

        //window.clearInterval(rainTimerSet);
        //$('.rain').css('left', '0px');

        if(rainHit) {
            alert("You've been burned by ACID RAIN!!");
            $('.play').show();

            $('.rain').each(function() {
                $(this).css('top', '-20px');
                $(this).css('left', '0px');
                //$(this).stop(true);
                clearInterval(rainTimerSet);
            });



            rainHit = false;
            //$('.character').css('left', '0px');
        }

        else {
            console.log('rainfall');

            for(var i = 0; i < rainElements.length; i++) {

                rain = rainElements.eq(i);
                
                rainNum = i + 1;
                rainNum = 'rain' + rainNum.toString();
                //console.log(rainNum);
                rain.addClass(rainNum);

                //jQuery Prototype
                // $.fn.testFunction = function() {
                //     console.log(this);
                // }

                // $(rain).testFunction();

                rainNumClass = '.' + rainNum;
                //console.log('rainNumClass = ' + rainNumClass);

                //rainCond = "(parseInt($(rainNumClass).css('top')) <= rainGround) || ";
                // console.log(eval(rainCond).value);

                //eval("parseInt($('.rain1').css('top'))");
                
                randomLeft = Math.floor(Math.random() * 1024 + 1);
                randomSpeed = Math.floor(Math.random() * 20 + 10);

                $(rain).css('left', randomLeft);

                //console.log('rainNum = ' + rainNum);
                //console.log('rainNumClass = ' + rainNumClass);
                rainLeft = parseInt($(rainNumClass).css('left'));

                //console.log('rainLeft = ' + rainLeft);

                clearInterval(rainTimerSet);
                rainTimerSet = setInterval(function(){rainTimerSet()}, 50);
                //console.log('rainNumClass = ' + rainNumClass);

                $.fn.testFunction = function() {
                    if($(this).hasClass('rain1')) {
                        console.log($(this).attr('class'));
                    }
                }

                $(rain).testFunction();
                
            }
        }        
    }

    function rainTimer() {

        //console.log('timer');
        //console.log('rainNumClass = ' + rainNumClass);

        //second raindrop must be overriding rain1
        //console.log(rain);
        
        rainTop1 = parseInt($('.rain1').css('top'));
        rainTop2 = parseInt($('.rain2').css('top'));
        //$(rain).css('top', '-20px');

        if((rainTop1 <= rainGround) || (rainTop2 <= rainGround)) {
            rainTop1 += randomSpeed;
            $('.rain1').css('top', rainTop1);
            rainTop2 += randomSpeed;
            $('.rain2').css('top', rainTop2);
        }

        /*if(eval(rainCond) || (rainTop2 <= rainGround)) {
            rainTop1 += randomSpeed;
            $('.rain1').css('top', rainTop1);
            rainTop2 += randomSpeed;
            $('.rain2').css('top', rainTop2);
        }*/
        
        else {
            
            //console.log('rainNumClass = ' + rainNumClass);
            //console.log('rainLeft = ' + rainLeft);

            if((parseInt($('.rain1').css('left')) <= marioBody && rainLeft >= marioLeft) || (parseInt($('.rain2').css('left')) <= marioBody && rainLeft >= marioLeft)) {

                rainHit = true;
            
            }
            else {
                
                rainHit = false;

                //$('.rain').css('top', '-20px');
                
            }
            rainFall();
        }

        // for(var j = 0; j < rainElements.length; j++) {

        //     rainNumCond = j + 1;
        //     rainNumCond = '.rain' + rainNumCond.toString();
           
        //    // rainCond = "(parseInt($('.rain'" + (j + 1).toString + ").css('top')) <= rainGround) ||";

        //     console.log(rainNumCond);

        // }
    }

});