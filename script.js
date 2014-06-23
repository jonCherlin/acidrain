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

    var rainTop;
    var rainTimerSet;

    function gameReset() {
        $('.play').hide();
        rainFall();
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
    function rainFall() {

        //console.log('rainFall rainHit = ' + rainHit);
        rainNum++;
        //console.log('rainNum = ' + rainNum);

        $('.rain').css('top', '-20px');
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
            
            $('.rain').each(function() {
                
                //$(this).addClass('rain_' + rainNum);
                
                randomLeft = Math.floor(Math.random() * 1024 + 1);

                parseInt($(this).css('left', randomLeft));

                rainLeft = parseInt($(this).css('left'));

                 //$(this).css('top', '-20px');

                 //$(this).animate({top: rainGround}, 950, function() {
                /*$(this).animate({top: rainGround}, 5000, function() {
                    //console.log(rainLeft);

                    if(rainLeft <= marioBody && rainLeft >= marioLeft) {

                        rainHit = true;
                    
                    }
                    else {
                        
                        rainHit = false;

                        $('.rain').css('top', '-20px');
                        
                    }
                    
                    rainFall();
                });*/
                clearInterval(rainTimerSet);
                rainTimerSet = setInterval(function(){rainTimer()}, 8);
                
                function rainTimer() {
                    
                    rainTop = parseInt($('.rain').css('top'));

                    if(rainTop <= rainGround) {
                        rainTop += 10;
                        $('.rain').css('top', rainTop);
                    }
                    else {
                        //$('.rain').css('top', '-20px');
                        if((parseInt($('.rain1').css('left')) <= marioBody && parseInt($('.rain1').css('left')) >= marioLeft) || (parseInt($('.rain2').css('left')) <= marioBody && parseInt($('.rain2').css('left')) >= marioLeft)) {

                            rainHit = true;
                        
                        }
                        else {
                            
                            rainHit = false;

                            //$('.rain').css('top', '-20px');
                            
                        }
                        rainFall();
                    }
                }
                
            });
        }        
    }

});