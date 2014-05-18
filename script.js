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
                            $('.character').animate({left: "-=64px"}, 'fast', function() {marioLeft = parseInt($('.character').css('left')); marioBody = marioLeft + marioWidth;});
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
                            console.log(parseInt($('.character').css('left')) + marioWidth);
        				    $('.character').animate({left: "+=64px"}, 'fast', function() {marioLeft = parseInt($('.character').css('left')); marioBody = marioLeft + marioWidth;});
                        }
						
						else if (parseInt($('.character').css('left')) + (marioWidth) >= 1024) {
							$('.character').animate({left: "+=0px"}, 'fast', function() {
								$('.character').css('left', 1024 - marioWidth);
								console.log('hit right wall = ');
								console.log($('.character').css('left'));
							});
						}
        				break;
        			defaultkey: "value"
        				break;
        		}
        	});
            function rainFall() {
                //randomLeft = Math.floor(Math.random() * 390 + 1);
                randomLeft = Math.floor(Math.random() * 1024 + 1);
                rainLeft = parseInt($('.rain').css('left', randomLeft));
                //$('.rain').animate({top:'200px'}, 420, function() {
                    $('.rain').animate({top: rainGround}, 1028, function() {
                    
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
                });
            }
 
});