var index = 1; // current "selected" value
var rounds = 0; // number of passes done
var i = 0; // total number of clicks
var choice = -1; // chosen value
var inProgress = false;
$(document).ready(function(){
	$('button.roll').on('click',function(){
		var numchildren = $('.choices div').length; // get the number of children of the choices

		if(inProgress) // if we're already rolling we don't want to overdo it
			return;
		else if (numchildren < 2)
		{
			alert("Not enough choices. You need at least 2.")
			return;
		}
		inProgress = true; // set that we're rolling now
		resetVars(); // reset all valuess
		
		choice = Math.floor((Math.random() * numchildren) + 1); // calculate choice with oh-so-secure Math.random()
		
		roll();
			
		
	});

	$(".text").on('click',divClicked); // setup editable for the first time

	$('button.add').on('click',function() {
		var newChoice = $('<div class="choice"><span class="text">New Choice</span></div>')
		$('.choices').append(newChoice);
		var choices = $(".choice");
		choices.on('click',divClicked); // setup editable again
		bindHover();

	});

	


	bindHover();


});


next = function(){
	var numchildren = $('.choices div').length;
	if(index === 1) 
		$(".choices div:nth-child(" + (numchildren).toString() + ")").removeClass("hover"); // reset the last value
	$(".choices div:nth-child(" + (index).toString() + ")").addClass("hover"); // add hover css
	$(".choices div:nth-child(" + (index - 1).toString() + ")").removeClass("hover"); // remove hover css where it is no longer used
	if(rounds < 2 || index != choice) // if we're over two rounds passed and we're not to the selected choice, reroll
	{
		roll();
	}
	else
	{
		selected(choice);
	}
	if($('#sound').is(':checked'))
	{
		var audio = new Audio('click.ogg'); // play click sound
		audio.play();
	}
	if(index < numchildren) // if we're not at the last child
		index += 1; // increment ;)
	else // we're at the last child, reset
	{
		index = 1;
	}


}


roll = function(){
	setTimeout(next, 200 + 50 * i); // calculate timeout value to slowly increase time between clicks
	i++; // increment number of "rolls"
	if(index === $('.choices div').length) // if we're at the last value increment rounds to detect number of passes
		rounds += 1;
}

resetVars = function(){
	// reset chosen value to base css
	$(".choices div:nth-child(" + (choice).toString() + ")").removeClass("selected"); 
	// reset message text
	$('.message').css('visibility','hidden');
	// reset all vars for next roll
	index = 1;
	rounds = 0;
	i = 0;
	choice = -1;
}

selected = function(choice){
	$(".choices div:nth-child(" + (choice - 1).toString() + ")").removeClass("hover"); // remove last choice's css since it wasn't before
	$(".choices div:nth-child(" + (choice).toString() + ")").addClass("selected"); // add "selected" css
	$('.message').html('YOUR CHOICE: ' + $(".choices div:nth-child(" + (choice).toString() + ") span").text() + ' (#' + choice + ')'); // show message with current choices
	$('.message').css('visibility','visible');
	var entry = $("<p class=\"entry\" />");
	entry.html(timenow() + " - " + $(".choices div:nth-child(" + (choice).toString() + ") span").text() + ' (#' + choice + ')'); // add history entry
	$('.history').append(entry);
	$('.history').scrollTop($('.history')[0].scrollHeight);// scroll to bottom of div when history entry added
	if($('#sound').is(':checked'))
	{
		var audio = new Audio('congrats.mp3'); // load audio file for TF2 achievement sound
		audio.play(); // PLAY IT WOOO (p.s. it's really loud) TODO: fix loudness
	}
	inProgress = false; // no longer picking, can reroll
}

function divClicked() {
	$(this).parent().find("button").remove();
    var divHtml = $(this).html();
    var editableText = $("<input type=\"text\" />");
    editableText.val(divHtml);
    $(this).replaceWith(editableText);
    editableText.focus();
    editableText.select();
    editableText.enterKey(editableTextBlurred);
    // setup the blur event for this new textarea
    editableText.on("blur", editableTextBlurred);
}
function editableTextBlurred() {
    
    var html = $(this).val();
    if(html === '')
    	html = "-----"
    var viewableText = $("<span class=\"text\">");
    viewableText.html(html);
    $(this).replaceWith(viewableText);
    // setup the click event for this new div
    $(viewableText).on("click", divClicked);
    bindHover();
}

function timenow(){
    var now= new Date(), 
    ampm= 'am', 
    h= now.getHours(), 
    m= now.getMinutes(), 
    s= now.getSeconds();
    if(h>= 12){
        if(h>12) h -= 12;
        ampm= 'pm';
    }

    if(m<10) m= '0'+m;
    if(s<10) s= '0'+s;
    return now.toLocaleDateString()+ ' ' + h + ':' + m + ':' + s + ' ' + ampm;
}

$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
}

function bindHover() 
{
	var choices = $(".choice");
	choices.unbind('mouseenter mouseleave'); // unbind so we don't get duplicates
	choices.hover(// setup hover function again
			function(){ // on hover
				var del = $("<button class=\"delete\">X</button>");
				$(this).append(del);
				del.on("click",function(){
					$(this).parent().remove();
				});
			},
			function() // off hover
			{
				$(this).find("button").remove();
			});
}