$(function() {

    $('#editor1').focus();

    function newBox(element){
      var contents = [],
      cursorPos,
      cursorFlag = false,
      cursor2Flag = true,
      red;

      //adds characters and line breaks to the contents array

      element.keypress(function(ev){
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
          render('end');
      }

      function cursorThere() {
        cursor2Flag = false;
        return $("#cursor").length;
        cursorFlag = true;
      }

      function cursor2There() {
        cursorFlag = false;
        return $("#cursor2").length;
        cursor2Flag = true;
      }


      function cursorBlink(type) {
        type.animate({
          opacity: 0
        }, 300).animate({
          opacity: 1
        }, 300);
      }

      function showCursor(arg) {
        var cursor = $('<span>|</span>');
        cursor.attr('id', 'cursor');
        cursor.css({
          'color': '#00CCFF',
          'font-weight': 'bold'
        });
        var cursor2 = $('<span>|</span>');
        cursor2.attr('id', 'cursor');
        cursor2.css({
          'color': '#00CCFF',
          'font-weight': 'bold'
        });
        if(arg == 'end'){
          if(!cursorThere() && !cursorFlag){
            $('#cursor2').remove();
            element.append(cursor);
            setInterval(function () {
              cursorBlink($('#cursor'));
            }, 300);
            return cursor;

          }
        } else {//if(!cursor2There() && !cursor2Flag){
          $('#cursor').remove();
          var editorKids = element.children(), 
          whereToPlace = editorKids[arg-1];
          //remember to wrap whereToPlace in $() since you're using it!!!!
          $(whereToPlace).before(cursor2);
          return cursor2;
        }
      }


      function render(where) {
          var letters = [],
            idNum = 0;
          element.empty();
              var cursor = showCursor('end');

          //if you click outside the editor div, the cursor(s) and highlighting disappears
          $('html').click(function () {
            $('#cursor').remove();
            $('#cursor2').remove();
            element.children().css('background-color' , 'transparent');
            element.children().off('mousemove');
          });

          element.click(function (e) {
              e.stopPropagation();
          }); 
          if(contents.length > 0){
              show();
          } else {
              //$('#editor').click(function(){
              //    showCursor();
              //});
          }
          //backspace button removes last letter when cursor at end of text
          element.off('keydown').keydown(function(ev){
              if(ev.keyCode == '8'){
                  contents.pop(); 
                  render('end'); 
              };
          });

          if(!isNaN(where)){
            var cursor = showCursor(where);
          }
      };

      function showContentElement(index) {
        var content = this,
        contentVal = content.value;
        var idNum = index+1;
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

      }

      function addLastSpan() {

        var lastSpan = $('<span></span>');
        lastSpan.attr('id' , contents.length + 1 + '_last');
        lastSpan.html('&nbsp;');
        element.append(lastSpan);
        return lastSpan;
      }

      function show(){
        $.each(contents, showContentElement);
        
        var lastSpan = addLastSpan();

        var letterSpans = element.children();
        letterSpans.each(function () {
          var letterSpan = $(this),
              selectionStart,
              selectionEnd,
              difference;
                  letterSpan.mousedown(function () {
                      //this doesnt actually work:
                      if (cursorThere()) {
                          $('#cursor').remove();
                      }
                      //this does though:
                      if (cursor2There()) {
                          $('#cursor2').remove();
                      }
                      letterSpans.css('background-color' , 'transparent');
                      letterSpans.off('mousemove');
                      selectionStart = parseInt($(this).attr('id'));
                      letterSpans.off('mousemove').mousemove(function (ev) {

                          letterSpans.off('mouseup').mouseup(function () {
                            var highlighted = [];
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
                                 red.css('background-color', '#99FF99'); 
                                 highlighted.push(red.selector.substring(1));
                              }
                              
                              selectedAlter(highlighted);
                              
                              letterSpans.off('mousemove');
                          });
                      });

                      function selectedAlter(newHi){
                        var counter = 1;
                          //17: control, 66: b, 73: i, 82: r, 72:  h
                          var pressedStuff = {17: false, 66: false, 73: false, 82: false, 72: false};
                          element.off('keydown').keydown(function(ev){
                              for(var vv=0; vv<newHi.length; vv++){
                                  if(ev.keyCode == '8'){
                                    var indexRemove = newHi[vv]-counter;
                                    contents.splice(indexRemove, 1); 
                                    counter++;
                                  } else if(ev.keyCode in pressedStuff){
                                      pressedStuff[ev.keyCode] =true;
                                      if(pressedStuff[17] && pressedStuff[66]) {
                                          console.log('both');
                                      }
                                  }
                            };
                            render('end');
                        });
                      }
                          letterSpans.off('mouseup').mouseup(function () {
                               if (cursorThere()) {
                                   $('#cursor').remove();
                               }
                               if (cursor2There()) {
                                   $('#cursor2').remove();
                               }
                               letterSpans.css('background-color' , 'transparent');
                               cursor2 = $('<span>|</span>');
                               cursor2.attr('id', 'cursor2');
                               cursor2.css({
                                   'color': '#00CCFF',
                                   'font-weight': 'bold'
                               });
                               letterSpan.before(cursor2);
                               cursorPos = letterSpan[0].id;
                               setInterval(function () {
                                   cursorBlink($('#cursor2'))
                               }, 300);
                               element.off('keydown').keydown(function(ev){
                                   var willRemove = Array.prototype.indexOf.call(element.children(), $("#cursor2")[0]);
                                   if(ev.keyCode == '8'){
                                       var indexToAdd = letterSpans[willRemove-2];
                                       contents.splice(willRemove-1, 1);
                                       cursorPos--;
                                       render(cursorPos);
                                       //need to make a var with the place that the cursor is at so i can reference that and keep it there
                             } else {
                                      //need to buildUp() and show() and render()...
                                }
                           });
                            });
                  });
              });
          };

      render('end');
    };

    newBox($('#editor1'));
 });