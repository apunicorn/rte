$(function() {

    var contents = [];

    function render() {
        var letters = [],
            cursor,
            idNum = 0;
        $('#editor').empty();
        function cursorBlink() {
            $('#cursor').animate({
                opacity: 0
            }, 300).animate({
                opacity: 1
            }, 300);
        };

        $('html').click(function () {
            if ($('#cursor')) {
                $('#cursor').remove();
            }
            $('#editor').children().css('background-color' , 'transparent');
            $('#editor').children().off('mousemove');
        });

        $('#editor').click(function (e) {
            e.stopPropagation();
        }); 
        if(contents.length > 0){
            $('#cursor').remove();
            show();
        } else {
            $('#editor').click(function(){
                if ($('#cursor')) {
                    $('#cursor').remove();
                }
                cursor = $('<span>|</span>');
                cursor.attr('id', 'cursor');
                cursor.css({
                    'color': 'red',
                    'font-weight': 'bold'
                   });
                $('#editor').append(cursor);
                setInterval(function () {
                    cursorBlink()
                }, 300);
            });
            if($('#cursor')){
                $('#editor').keypress(function(ev){
                    contents.push({
                        type: 'character',
                        value: String.fromCharCode(ev.keyCode),
                        format: {bold:false, italic:false}
                    });
                    render();
                });
            }
        }

        function show(){
            $.each(contents, function () {
                var content = this,
                    contentVal = content.value;
                    idNum++;
                    var newSpan = $('<span></span>');
                if (content.type == 'character') {
                    var format = content.format,
                        bolded = format.bold,
                        italicized = format.italic;
                    if (bolded && italicized) {
                        newSpan.attr('id' , idNum);
                        newSpan.html('<b><i>' + contentVal + '</i></b>');
                        $("#editor").append(newSpan);
                    } else if (bolded) {
                        newSpan.attr('id' , idNum);
                        newSpan.html('<b>' + contentVal + '</b>');
                        $("#editor").append(newSpan);
                    } else if (italicized) {
                       newSpan.attr('id' , idNum);
                        newSpan.html('<i>' + contentVal + '</i>');
                        $("#editor").append(newSpan);
                    } else {
                            newSpan.attr('id' , idNum);
                            newSpan.html(contentVal);
                            $("#editor").append(newSpan);
                           }
                } else {
                    newSpan.attr('id' , idNum + '_break');
                    newSpan.html(' <br> ');
                    $("#editor").append(newSpan);
                }
            });
        
            var lastSpan = $('<span></span>');
            lastSpan.attr('id' , contents.length + 1 + '_last');
            lastSpan.html('&nbsp;');
            $("#editor").append(lastSpan);
           
            var letterSpans = $('#editor').children();
            letterSpans.each(function () {
                var letterSpan = $(this),
                    selectionStart,
                    selectionEnd,
                    difference;
                letterSpan.mousedown(function () {
                    if ($('#cursor')) {
                        $('#cursor').remove();
                    }
                    letterSpans.css('background-color' , 'transparent');
                    letterSpans.off('mousemove');
                    selectionStart = parseInt($(this).attr('id'));
                    letterSpans.off('mousemove').mousemove(function (ev) {
                        letterSpans.off('mouseup').mouseup(function () {
                        selectionEnd = parseInt($(this).attr('id'));
                            difference = selectionStart - selectionEnd;
                            for(var ww = 0; ww < Math.abs(difference); ww++){
                               var spans = $('span');
                                if(difference > 0){
                                   var redId = selectionEnd + ww;
                                } else {
                                   var redId = selectionStart + ww;     
                                }
                               var red = $('#'+ redId);
                               red.css('background-color', 'red'); 
                            };
                            
                            letterSpans.off('mousemove');
                        });
                    });
                    letterSpans.off('mouseup').mouseup(function () {
                        letterSpans.css('background-color' , 'transparent');
                        cursor = $('<span>|</span>');
                        cursor.attr('id', 'cursor');
                        cursor.css({
                            'color': 'red',
                            'font-weight': 'bold'
                        });
                        letterSpan.before(cursor);
                        setInterval(function () {
                            cursorBlink()
                        }, 300);
                    });
                });
            });
        };
    };

    render();
 });



