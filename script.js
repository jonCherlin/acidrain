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
            $(document).keydown(function(key) {
                switch(parseInt(key.which,10)) {
                    case 13:
                        $('.play').hide();
                        rainFall();
                        break;
        			case 65:
        				$('.character').animate({left: "-=40px"}, 'fast', function() {marioLeft = parseInt($('.character').css('left')); marioBody = marioLeft + marioWidth;});
        				break;
        			case 68:
        				$('.character').animate({left: "+=40px"}, 'fast', function() {marioLeft = parseInt($('.character').css('left')); marioBody = marioLeft + marioWidth;});
        				break;
        			defaultkey: "value"
        				break;
        		}
        	});
            function rainFall() {
                randomLeft = Math.floor(Math.random() * 390 + 1);
                rainLeft = parseInt($('.rain').css('left', randomLeft));
                $('.rain').animate({top:'200px'}, 420, function() {
                    
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