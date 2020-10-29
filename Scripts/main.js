'use strict';

nova.commands.register('baigoAligner.alignEquals', (editor) => {
    var selectedRanges = editor.selectedRanges.reverse(); // 取得选中

    editor.edit(function(e) {
        for (var range of selectedRanges) {
            var selectedText = editor.getTextInRange(range);
            var newText      = baigoAligner.align(selectedText, '=');
            e.delete(range);
            e.insert(range.start, newText);
        }
    });

    editor.scrollToCursorPosition();
});

nova.commands.register('baigoAligner.removeBeforeEqual', (editor) => {
    var selectedRanges = editor.selectedRanges.reverse(); // 取得选中

    editor.edit(function(e) {
        for (var range of selectedRanges) {
            var selectedText = editor.getTextInRange(range);
            var newText      = baigoAligner.align(selectedText, '=', true);
            e.delete(range);
            e.insert(range.start, newText);
        }
    });

    editor.scrollToCursorPosition();
});

nova.commands.register('baigoAligner.alignColons', (editor) => {
    var selectedRanges = editor.selectedRanges.reverse(); // 取得选中

    editor.edit(function(e) {
        for (var range of selectedRanges) {
            var selectedText = editor.getTextInRange(range);
            var newText      = baigoAligner.align(selectedText, ':');
            e.delete(range);
            e.insert(range.start, newText);
        }
    });

    editor.scrollToCursorPosition();
});

nova.commands.register('baigoAligner.removeBeforeColon', (editor) => {
    var selectedRanges = editor.selectedRanges.reverse(); // 取得选中

    editor.edit(function(e) {
        for (var range of selectedRanges) {
            var selectedText = editor.getTextInRange(range);
            var newText      = baigoAligner.align(selectedText, ':', true);
            e.delete(range);
            e.insert(range.start, newText);
        }
    });

    editor.scrollToCursorPosition();
});

var baigoAligner = {
    align: function(selectedText, symbol, remove){
        var arr_selectedText = selectedText.split('\n');

        if (typeof symbol == 'undefined') {
            symbol = '=';
        }

        if (symbol == '=') {
            if (selectedText.indexOf('.=') > 0) {
                symbol = '.=';
            } else if (selectedText.indexOf('+=') > 0) {
                symbol = '+=';
            }
        }

        if (typeof remove == 'undefined') {
            remove = false;
        }

        return baigoAligner.getText(arr_selectedText, symbol, remove);
    },
    getTrim: function(string, side){
        var str_return = '';

        if (typeof side == 'undefined') {
            side = '';
        }

        switch (side) {
            case 'left':
                str_return = string.replace(/(^\s*)/g, '');
            break;

            case 'right':
                str_return = string.replace(/(\s*$)/g, '');
            break;

            default:
                str_return = string.trim();
            break;
        }

        return str_return;
    },
    getLongest: function(selectedText, symbol) {
        var num_longest = 0;

        for (var str_selectedLine of selectedText) {
            if (str_selectedLine.indexOf(symbol) > 0) {
                var arr_textItem  = str_selectedLine.split(symbol);
                var str_firstItem = arr_textItem[0].trim();

                if (str_firstItem.length > num_longest) {
                    num_longest = str_firstItem.length;
                }
            }
        }

        return num_longest;
    },
    getText: function(selectedText, symbol, remove) {
        var str_newText  = '';
        var num_longest  = baigoAligner.getLongest(selectedText, symbol);
        var str_lastLine = selectedText[selectedText.length - 1];

        for (var str_selectedLine of selectedText) {
            var str_newLine = '';

            if (str_selectedLine.indexOf(symbol) > 0) {
                str_newLine += baigoAligner.getLine(str_selectedLine, symbol, num_longest, remove);
            } else {
                str_newLine += str_selectedLine;
            }

            str_newText += str_newLine;

            if (str_selectedLine != str_lastLine) {
                str_newText += '\n';
            }
        }

        return str_newText;
    },
    getLine: function(selectedLine, symbol, longest, remove) {
        var str_newLine   = '';
        var arr_textItem  = selectedLine.split(symbol);
        var str_firstItem = arr_textItem[0].trim();
        var str_lastItem  = arr_textItem[arr_textItem.length - 1];
        var num_diff      = longest - str_firstItem.length;

        arr_textItem[0] = baigoAligner.getTrim(arr_textItem[0], 'right');

        if (remove !== true) {
            if (num_diff > 0) {
                for (var iii = 0; iii < num_diff; iii++) {
                    arr_textItem[0] += ' ';
                }
            }
        }

        if (symbol == '=' || symbol == '.=' || symbol == '+=' ) {
            arr_textItem[0] += ' ';
        }

        for (var str_text of arr_textItem) {
            str_newLine += str_text;

            if (str_text != str_lastItem) {
                str_newLine += symbol;
            }
        }

        return str_newLine;
    }
};
