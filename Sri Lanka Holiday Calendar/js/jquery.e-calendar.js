(function ($) {

    var eCalendar = function (options, object) {
        // Initializing global variables
        var adDay = new Date().getDate();
        var adMonth = new Date().getMonth();
        var adYear = new Date().getFullYear();
        var dDay = adDay;
        var dMonth = adMonth;
        var dYear = adYear;
        var instance = object;

        var settings = $.extend({}, $.fn.eCalendar.defaults, options);

        function lpad(value, length, pad) {
            if (typeof pad == 'undefined') {
                pad = '0';
            }
            var p;
            for (var i = 0; i < length; i++) {
                p += pad;
            }
            return (p + value).slice(-length);
        }

        var mouseOver = function () {
            $(this).addClass('c-nav-btn-over');
        };
        var mouseLeave = function () {
            $(this).removeClass('c-nav-btn-over');
        };
        var mouseOverEvent = function () {
            $(this).addClass('c-event-over');
            var d = $(this).attr('data-event-day');
            $('div.c-event-item[data-event-day="' + d + '"]').addClass('c-event-over');
        };
        var mouseLeaveEvent = function () {
            $(this).removeClass('c-event-over')
            var d = $(this).attr('data-event-day');
            $('div.c-event-item[data-event-day="' + d + '"]').removeClass('c-event-over');
        };
        var mouseOverItem = function () {
            $(this).addClass('c-event-over');
            var d = $(this).attr('data-event-day');
            $('div.c-event[data-event-day="' + d + '"]').addClass('c-event-over');
        };
        var mouseLeaveItem = function () {
            $(this).removeClass('c-event-over')
            var d = $(this).attr('data-event-day');
            $('div.c-event[data-event-day="' + d + '"]').removeClass('c-event-over');
        };
        var nextMonth = function () {
            if (dMonth < 11) {
                dMonth++;
            } else {
                dMonth = 0;
                dYear++;
            }
            print();
        };
        var previousMonth = function () {
            if (dMonth > 0) {
                dMonth--;
            } else {
                dMonth = 11;
                dYear--;
            }
            print();
        };

        function loadEvents() {
            if (typeof settings.url != 'undefined' && settings.url != '') {
                $.ajax({url: settings.url,
                    async: false,
                    success: function (result) {
                        settings.events = result;
                    }
                });
            }
        }

        function print() {
            var count = 0;
            loadEvents();
            var dWeekDayOfMonthStart = new Date(dYear, dMonth, 1).getDay();
            var dLastDayOfMonth = new Date(dYear, dMonth + 1, 0).getDate();
            var dLastDayOfPreviousMonth = new Date(dYear, dMonth + 1, 0).getDate() - dWeekDayOfMonthStart + 1;

            var cBody = $('<div/>').addClass('c-grid');
            var cEvents = $('<div/>').addClass('c-event-grid');
            var cEventsBody = $('<div/>').addClass('c-event-body');
            cEvents.append($('<div/>').addClass('c-event-title c-pad-top').html(settings.eventTitle));
            cEvents.append(cEventsBody);
            var cNext = $('<div/>').addClass('c-next c-grid-title c-pad-top');
            var cMonth = $('<div/>').addClass('c-month c-grid-title c-pad-top');
            var cPrevious = $('<div/>').addClass('c-previous c-grid-title c-pad-top');
            cPrevious.html(settings.textArrows.previous);
            cMonth.html(settings.months[dMonth] + ' ' + dYear);
            cNext.html(settings.textArrows.next);

            cPrevious.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', previousMonth);
            cNext.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', nextMonth);

            cBody.append(cPrevious);
            cBody.append(cMonth);
            cBody.append(cNext);
            for (var i = 0; i < settings.weekDays.length; i++) {
                var cWeekDay = $('<div/>').addClass('c-week-day c-pad-top');
                cWeekDay.html(settings.weekDays[i]);
                cBody.append(cWeekDay);
            }
            var day = 1;
            var dayOfNextMonth = 1;
            for (var i = 0; i < 42; i++) {
                var cDay = $('<div/>');
                if (i < dWeekDayOfMonthStart) {
                    cDay.addClass('c-day-previous-month c-pad-top');
                    cDay.html();
                    dLastDayOfPreviousMonth++
                } else if (day <= dLastDayOfMonth) {
                    cDay.addClass('c-day c-pad-top');
                    if (day == dDay && adMonth == dMonth && adYear == dYear) {
                        cDay.addClass('c-today');
                    }
                    for (var j = 0; j < settings.events.length; j++) {
                        var d = settings.events[j].datetime;
                        if (d.getDate() == day && (d.getMonth()) == dMonth && d.getFullYear() == dYear) {
                            cDay.addClass('c-event').attr('data-event-day', d.getDate());
                            cDay.on('mouseover', mouseOverEvent).on('mouseleave', mouseLeaveEvent);
                        }
                    }
                    cDay.html(day++);
                } else {
                    cDay.addClass('c-day-next-month c-pad-top');
                    cDay.html();
                    dayOfNextMonth++
                }
                cBody.append(cDay);
            }
            var eventList = $('<div/>').addClass('c-event-list');
            for (var i = 0; i < settings.events.length; i++) {
                var d = settings.events[i].datetime;
                if ((d.getMonth()) == dMonth && d.getFullYear() == dYear) {
                    var date = lpad(d.getDate(), 2) + '/' + (lpad(d.getMonth(), 2) + 1) + ' ' + lpad(d.getHours(), 2) + ':' + lpad(d.getMinutes(), 2);
                    var item = $('<div/>').addClass('c-event-item');
                    var title = $('<div/>').addClass('title').html(date + '  ' + settings.events[i].title + '<br/>');
                    var description = $('<div/>').addClass('description').html(settings.events[i].description + '<br/>');
                    item.attr('data-event-day', d.getDate());
                    item.on('mouseover', mouseOverItem).on('mouseleave', mouseLeaveItem);
                    item.append(title).append(description);
                    eventList.append(item);
                    count++;
                }
            }

            $(instance).addClass('calendar');
            cEventsBody.append(eventList);
            $(instance).html(cBody).append(cEvents);

            if(count == 0) {
                $(".c-event-grid").hide();
                document.getElementById("calendar").style.width = "300px";
            } else {
                document.getElementById("calendar").style.width = "600px";
            }
        }

        return print();
    }

    $.fn.eCalendar = function (oInit) {
        return this.each(function () {
            return eCalendar(oInit, $(this));
        });
    };

    // plugin defaults
    $.fn.eCalendar.defaults = {
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        textArrows: {previous: '<', next: '>'},
        eventTitle: 'Holidays',
        url: '',
        events: [
            {title: 'Tamil Thai Pongal Day', description: '', datetime: new Date(2016, 0, 15)},
            {title: 'Duruthu Full Moon Poya Day', description: '', datetime: new Date(2016, 0, 23)},
            {title: 'National Day', description: '', datetime: new Date(2016, 1, 4)},
            {title: 'Navam Full Moon Poya Day', description: '', datetime: new Date(2016, 1, 22)},
            {title: 'Mahasivarathri Day', description: '', datetime: new Date(2016, 2,7)},
            {title: 'Medin Full Moon Poya Day', description: '', datetime: new Date(2016, 2, 22)},
            {title: 'Good Friday', description: '', datetime: new Date(2016, 2, 25)},
            {title: 'Duruthu Full Moon Poya Day', description: '', datetime: new Date(2016, 3, 13)},
            {title: 'Day prior to Sinhala & Tamil New Year day', description: '', datetime: new Date(2016, 3, 13)},
            {title: 'Sinhala & Tamil New Year Day', description: '', datetime: new Date(2016, 3, 14)},
            {title: 'Bak Full Moon Poya Day', description: '', datetime: new Date(2016, 3,21)},
            {title: 'May Day', description: '', datetime: new Date(2016, 4, 1)},
            {title: 'Special Bank Holdiday (in lieu of May 01st which falls on a Sunday)', description: '', datetime: new Date(2016, 4, 2)},
            {title: 'Vesak Ful Moon Poya Day', description: '', datetime: new Date(2016, 4, 21)},
            {title: 'Day after Vesak Full Moon Poya Day', description: '', datetime: new Date(2016, 4, 22)},
            {title: 'Special Bank Holdiday (in lieu of May 22nd which falls on a Sunday)', description: '', datetime: new Date(2016, 4, 23)},
            {title: 'Poson Full Moon Poya Day', description: '', datetime: new Date(2016, 5,19)},
            {title: 'Id-Ul-Fitr (Ramazan Festival Day)', description: '', datetime: new Date(2016, 6, 6)},
            {title: 'Esala Full Moon Poya Day', description: '', datetime: new Date(2016, 6, 19)},
            {title: 'Duruthu Full Moon Poya Day', description: '', datetime: new Date(2016, 7, 17)},
            {title: 'Day prior to Sinhala & Tamil New Year day', description: '', datetime: new Date(2016, 8, 12)},
            {title: 'Sinhala & Tamil New Year Day', description: '', datetime: new Date(2016, 8, 16)},
            {title: 'Bak Full Moon Poya Day', description: '', datetime: new Date(2016, 9, 15)},
            {title: 'May Day', description: '', datetime: new Date(2016, 9, 29)},
            {title: 'Esala Full Moon Poya Day', description: '', datetime: new Date(2016, 10, 14)},
            {title: 'Duruthu Full Moon Poya Day', description: '', datetime: new Date(2016, 11, 12)},
            {title: 'Day prior to Sinhala & Tamil New Year day', description: '', datetime: new Date(2016, 11, 13)},
            {title: 'Sinhala & Tamil New Year Day', description: '', datetime: new Date(2016, 11, 25)},
            {title: 'Bak Full Moon Poya Day', description: '', datetime: new Date(2016, 11, 26)}
        ]
    };

}(jQuery));