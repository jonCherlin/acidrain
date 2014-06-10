// Add your JavaScript below!
$(document).ready(function() {
    //alert('Click OK to Play!');
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
    //console.log(rainGround);

    function gameReset() {
        $('.play').hide();
        rainFall();
        gameIsOn = true;
        rainHit = false;
    
        console.log('rainHit = ' + rainHit);
        console.log('gameIsOn = ' + gameIsOn);
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
                        //console.log(parseInt($('.character').css('left')));
                        if(parseInt($('.character').css('left')) > 0) {

                           var walkRight = parseInt($('.character').css('left'));
                            $('.character').css('left', walkRight -= 64);
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
                        //console.log(parseInt($('.character').css('left')) + ($('.character').width() * 2));
						//console.log('marioWidth = ' + marioWidth);
                        if(parseInt($('.character').css('left')) + (marioWidth) < 1024) {
                           // console.log(parseInt($('.character').css('left')) + marioWidth);

                            var walkLeft = parseInt($('.character').css('left'));
                            $('.character').css('left', walkLeft += 64);
                            marioLeft = parseInt($('.character').css('left')); 
                            marioBody = marioLeft + marioWidth;
                        }
						
        				break;
        			defaultkey: "value"
        				break;
        		}
        	});
            function rainFall() {

                console.log('rainFall rainHit = ' + rainHit);

                if(rainHit) {
                    alert("You've been burned by ACID RAIN!!");
                    $('.play').show();
                    //$('.rain').css('top', '-20px');
                    //$('.rain').stop();

                    $('.rain').each(function() {
                        $(this).css('top', '-20px');
                        $(this).stop(true);
                    });



                    rainHit = false;
                    //alert("hit");
                    $('.character').css('left', '0px');
                }

                else {
                    $('.rain').each(function() {
                        //console.log($(this));
                        randomLeft = Math.floor(Math.random() * 1024 + 1);

                        parseInt($(this).css('left', randomLeft));

                        rainLeft = parseInt($(this).css('left'));

                         //console.log($(this).css('left'));

                         $(this).css('top', '-20px');

                         $(this).animate({top: rainGround}, 900, function() {
                            console.log(rainLeft);
                            //console.log('rain left = ' + parseInt($(this).css('left')));

                            if(rainLeft <= marioBody && rainLeft >= marioLeft) {
                                console.log("yes hit");
                                console.log('rain left = ' + rainLeft);
                                console.log('marioBody = ' + marioBody);
                                console.log('marioLeft = ' + marioLeft);

                                /*alert("You've been burned by ACID RAIN!!");*/

                                //gameIsOn = false;
                                rainHit = true;
                                console.log('rain hit identity = ' + $(this).attr('class'));
                                console.log('rain hit y-pos = ' + $(this).css('top'));

                                /*$('.play').show();
                                $('.rain').css('top', '-20px');
                                $('.rain').stop();*/

                            }
                            else {
                                console.log("not hit");
                                console.log('rain left = ' + rainLeft);
                                console.log('marioBody = ' + marioBody);
                                console.log('marioLeft = ' + marioLeft);
                                rainHit = false;
                            }
                            //isRainHit();
                            /*else {
                                $('.rain').css('top', '-20px');
                                rainFall();
                                console.log('rainFall not rainHit = ' + rainHit);
                            }*/

                            rainFall();
                        });
                        
                        //isRainHit();

                    });
                }        
                
               


            }

            /*console.log('rainHit = ' + rainHit);
            console.log('gameIsOn = ' + gameIsOn);*/

            /*function isRainHit() {
                //if(gameIsOn) {
                    if(rainHit) {
                        $('.play').show();
                        $('.rain').css('top', '-20px');
                        $('.rain').stop();
                        gameIsOn = false;
                    }
                    else {
                        console.log('game is on and rain not hit');
                        $('.rain').css('top', '-20px');
                        rainFall();
                    }
                //}
            }*/
 
});