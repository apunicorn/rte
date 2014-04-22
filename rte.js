$(function() {

    var contents = [],
    highlighted = [],
    cursorThere = false,
    cursor2there = false,
    red;

    //adds characters and line breaks to the contents array

    $('#editor').keypress(function(ev){
        buildUp(ev);
    });

    function buildUp(e) {
        if(e.keyCode == '13'){
            contents.push({
                type: 'endline'
            });
        } else {
            contents.push({
                type: 'character',
                value: String.fromCharCode(e.keyCode),
                format: {bold:false, italic:false}
            });
        };
        render();
    };

    function render() {
        var letters = [],
            cursor,
            idNum = 0;
        $('#editor').empty();
        cursorThere = false;
        showCursor();
        function cursorBlink(type) {
            type.animate({
                opacity: 0
            }, 300).animate({
                opacity: 1
            }, 300);
        };

        function showCursor() {
                cursor = $('<span>|</span>');
                cursor.attr('id', 'cursor');
                cursor.css({
                    'color': 'red',
                    'font-weight': 'bold'
                   });
                if(!cursorThere && !cursor2there){
                    $('#editor').append(cursor);
                    setInterval(function () {
                        cursorBlink($('#cursor'));
                    }, 300);
                    cursorThere = true;
                } 
        };
        //if you click outside the editor div, the cursor(s) and highlighting disappears
        $('html').click(function () {
            if ($('#cursor')) {
                $('#cursor').remove();
                cursorThere = false;
            }
            if ($('#cursor2')) {
                $('#cursor2').remove();
                cursor2there = false;
            }
            $('#editor').children().css('background-color' , 'transparent');
            $('#editor').children().off('mousemove');
        });

        $('#editor').click(function (e) {
            e.stopPropagation();
        }); 
        if(contents.length > 0){
            show();
        } else {
            $('#editor').click(function(){
                showCursor();
            });
        }
        //backspace button removes last letter when cursor at end of text
        $('#editor').off('keydown').keydown(function(ev){
            if(ev.keyCode == '8'){
                contents.pop(); 
                render(); 
          };
  });

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
                        newSpan.attr('id' , idNum);
                    if (bolded && italicized) {
                        newSpan.html('<b><i>' + contentVal + '</i></b>');
                        $('#cursor').before(newSpan);
                    } else if (bolded) {
                        newSpan.html('<b>' + contentVal + '</b>');
                        $('#cursor').before(newSpan);
                    } else if (italicized) {
                        newSpan.html('<i>' + contentVal + '</i>');
                        $('#cursor').before(newSpan);
                    } else {
                        newSpan.html(contentVal);
                            $('#cursor').before(newSpan);
                        }
                } else {
                    newSpan.attr('id' , idNum + '_break');
                    newSpan.html(' <br> ');
                    $('#cursor').before(newSpan);
                }
            });

           
            var letterSpans = $('#editor').children();
            letterSpans.each(function () {
                var letterSpan = $(this),
                    selectionStart,
                    selectionEnd,
                    difference;
                letterSpan.mousedown(function () {
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
                               red = $('#'+ redId);
                               red.css('background-color', 'red'); 
                               highlighted.push(red.selector.substring(1));
                            };
                            
                            selectedAlter(highlighted);
                            
                            letterSpans.off('mousemove');
                            highlighted = [];
                        });
                    });

                    function selectedAlter(newHi){
                        //17: control, 66: b, 73: i, 82: r, 72:  h
                        var pressedStuff = {17: false, 66: false, 73: false, 82: false, 72: false};
                        $('#editor').off('keydown').keydown(function(ev){
                            for(var vv=0; vv<newHi.length; vv++){
                                if(ev.keyCode == '8'){
                                  var indexRemove = newHi[vv]-1;
                                  contents.splice(indexRemove, 1); 
                                } else if(ev.keyCode in pressedStuff){
                                    pressedStuff[ev.keyCode] =true;
                                    if(pressedStuff[17] && pressedStuff[66]) {
                                        console.log('both');
                                    }
                                }
                          };
                          render();
                      });
                    };
                        letterSpans.off('mouseup').mouseup(function () {
                            if ($('#cursor')) {
                                $('#cursor').remove();
                            }
                            if ($('#cursor2')) {
                                $('#cursor2').remove();
                            }
                            letterSpans.css('background-color' , 'transparent');
                            cursor2 = $('<span>|</span>');
                            cursor2.attr('id', 'cursor2');
                            cursor2.css({
                                'color': 'red',
                                'font-weight': 'bold'
                            });
                            letterSpan.before(cursor2);
                            cursor2there = true;
                            setInterval(function () {
                                cursorBlink($('#cursor2'))
                            }, 300);
                            $('#editor').off('keydown').keydown(function(ev){
                                var willRemove = Array.prototype.indexOf.call($("#editor").children(), $("#cursor2")[0]);
                                if(ev.keyCode == '8'){
                                    var indexToAdd = letterSpans[willRemove-2];
                                    contents.splice(willRemove-1, 1);
                                    render();
                              } else {
                                    //need to buildUp() and show() and render()...
                              }
                          });
                        });
                });
            });
        };
    };

    render();
 });



