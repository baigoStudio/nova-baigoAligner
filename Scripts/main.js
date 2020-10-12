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
        var longest          = 0;
        var newText          = '';
        var arr_selectedText = selectedText.split('\n');
        var lastLine         = arr_selectedText[arr_selectedText.length - 1];

        if (typeof symbol == 'undefined') {
            symbol = '=';
        }

        if (typeof remove == 'undefined') {
            remove = false;
        }

        for (var selectedLine of arr_selectedText) {
            if (selectedLine.indexOf(symbol) > 0) {
                var arr_textItem       = selectedLine.split(symbol);
                var first_selectedLine = arr_textItem[0].trim();

                if (first_selectedLine.length > longest) {
                    longest = first_selectedLine.length;
                }
            }
        }

        for (var selectedLine of arr_selectedText) {
            var newLine = '';

            if (selectedLine.indexOf(symbol) > 0) {
                var arr_textItem       = selectedLine.split(symbol);
                var first_selectedLine = arr_textItem[0].trim();
                var lastItem           = arr_textItem[arr_textItem.length - 1];
                var diff               = longest - first_selectedLine.length;

                arr_textItem[0] = baigoAligner.trim(arr_textItem[0], 'right');

                if (remove !== true) {
                    if (diff > 0) {
                        for (var iii = 0; iii < diff; iii++) {
                            arr_textItem[0] += ' ';
                        }
                    }
                }

                if (symbol === '=') {
                    arr_textItem[0] += ' ';
                }

                for (var text of arr_textItem) {
                    newLine += text;

                    if (text != lastItem) {
                        newLine += symbol;
                    }
                }
            } else {
                newLine += selectedLine;
            }

            newText += newLine;

            if (selectedLine != lastLine) {
                newText += '\n';
            }
        }

        return newText;
    },
    trim: function(string, side){
        var returnStr = '';

        if (typeof side == 'undefined') {
            side = '';
        }

        switch (side) {
            case 'left':
                returnStr = string.replace(/(^\s*)/g, '');
            break;

            case 'right':
                returnStr = string.replace(/(\s*$)/g, '');
            break;

            default:
                returnStr = string.trim();
            break;
        }

        return returnStr;
    }
};
