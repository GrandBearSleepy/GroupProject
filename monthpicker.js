(function ($) {
    $.fn.monthpicker = function (options, language) {
        
        var month  = {
            
        }, defaults = {
            minYear: "2010",
            maxYear: "2100",
            class: "",
            month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }, i, yearbox, monthbox, obj = $(this);

        if (!$.isEmptyObject(options)) {
            defaults = $.extend(defaults, month[options.lang],);
        }

        options = $.extend(defaults, options);

        obj.hide();

        if (options.minYear > options.maxYear) {
            for (i = options.minYear; i >= options.maxYear; i--) {
                yearbox += '<option value="' + i + '">' + i + '</option>';
            }
        } else {
            for (i = options.minYear; i <= options.maxYear; i++) {
                yearbox += '<option value="' + i + '">' + i + '</option>';
            }
        }

        $.map(options.month, function (n, i) {
            monthbox += '<option value="' + i + '">' + n + '</option>';
        });
        var yearElement = $('<select class="yearpick ' + options.class + '">' + yearbox + '</select>'),
            monthElement = $('<select class="monthpick ' + options.class + '">' + monthbox + '</select>');
      
        monthElement.insertBefore(obj);
        yearElement.insertAfter(obj);

        var createTimestamp = function () {
            obj.attr('value', Math.round(Date.UTC(yearElement.val(), monthElement.val(), 1)) / 1000);
        }

        yearElement.change(createTimestamp);
        monthElement.change(createTimestamp);

        if (obj.val()!= ""){
            var timestamp = new Date(parseInt(obj.val()) * 1000);
            yearElement.val(timestamp.getFullYear());
            monthElement.val(timestamp.getMonth());
        }
    };
})(jQuery);



