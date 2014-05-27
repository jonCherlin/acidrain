// Add your JavaScript below!
$(document).ready(function() {
    //alert('Click OK to Play!');
    //var gameIsOn = false;
    $('.play').click(function() {
       $('.play').hide();
       rainFall();
    });
            
            var randomLeft;
            var rainLeft;
            var rainWidth = $('.rain').css('width');
            var marioTop = parseInt($('body').css('height')) - parseInt($('.character').css('height'));
            var marioLeft;
            var marioWidth = parseInt($('.character').css('width'));
            var marioBody;
            var rainGround = parseInt($('body').height()) - parseInt($('.ground').height()) - 13;
            //console.log(rainGround);

            $(document).keydown(function(key) {
                switch(parseInt(key.which)) {
                    case 13:
                        $('.play').hide();
                        rainFall();
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
                $('.rain').each(function() {
                    //console.log($(this));
                    randomLeft = Math.floor(Math.random() * 1024 + 1);
                    rainLeft = parseInt($(this).css('left', randomLeft));

                     //console.log($(this).css('left'));

                     $(this).animate({top: rainGround}, 900, function() {
                        
                        if(parseInt($(this).css('left')) <= marioBody && parseInt($(this).css('left')) >= marioLeft) {
                            console.log('rain left = ' + parseInt($(this).css('left')));
                            console.log('marioBody = ' + marioBody);
                            console.log('marioLeft = ' + marioLeft);

                            alert("You've been burned by ACID RAIN!!");
                            //gameIsOn = false;
                            $('.play').show();
                            $('.rain').css('top', '-20px');
                            $('.rain').stop();
                        }
                        else {
                            $('.rain').css('top', '-20px');
                            rainFall();
                        }
                    });

                });

                    //interesting fun pace at 350
                    //$('.rain').animate({top: rainGround}, 350, function() {
                    
                    /*$('.rain').animate({top: rainGround}, 900, function() {
                    
                        if(randomLeft <= marioBody && randomLeft >= marioLeft) {
                            alert("You've been burned by ACID RAIN!!");
                            //gameIsOn = false;
                            $('.play').show();
                            $('.rain').css('top', '-20px');
                            $('.rain').stop();
                        }
                        else {
                            $('.rain').css('top', '-20px');
                            rainFall();
                        }
                    });*/
            }
 
});