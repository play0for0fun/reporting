$(document).ready(function() {



    $("#date").datepicker({
        "dateFormat": "dd.mm"
    });


    $('#report-form').submit(function(event) {
        event.preventDefault();
        $('input:checkbox').each(function() {
            if ($(this).prop("checked") != true) {
                $(this).next().addClass('error-check');
            } else {
                $(this).next().removeClass('error-check');
            }
        });

        if ($('#calendar .day-date.active').length == count_of_days) {
            $('.input-header-middle').removeClass('error-check');
        } else {
            $('.input-header-middle').addClass('error-check');
        }


        if ($('.error-input,.error-check').length == 0) {
            find_cur_row();
        }

    });


});

function onSignIn(googleUser) {
    auth = gapi.auth2.getAuthInstance();
    var profile = googleUser.getBasicProfile();
    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail());
    $('#gmail').val(profile.getEmail());
    $('#report-form').show();

    $('#person').html(profile.getName() + ',<br>' + profile.getEmail());

    $('.g-signin2').hide();

    loadSheetsApi();
    /*
    			var today = new Date();
    			var dd = today.getDate();
    			var mm = today.getMonth()+1;
    			if(dd<10){
    			    dd='0'+dd
    			} 
    			if(mm<10){
    			    mm='0'+mm
    			} 
    			var today = dd+'.'+mm;
    		    $("#date").val(today);
    */


}


/**
 * Load Sheets API client library.
 */
function loadSheetsApi() {
    var discoveryUrl =
        'https://sheets.googleapis.com/$discovery/rest?version=v4';
    gapi.client.load(discoveryUrl).then(listMajors);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors() {
    //gapi.auth.authorize({client_id: '20449658341-fk436athd393dkamag4pj8f13mga5dm8.apps.googleusercontent.com', scope: 'https://www.googleapis.com/auth/spreadsheets', immediate: false}).then(function(response) {

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1stpKVORtP8eoEHgLK9c-8ZQYomEx1CQ7A5lmjF0TzKE',
        range: "A1:ZZ300",
    }).then(function(response) {
        range = response.result;
        console.log(range);
        var email = $('#gmail').val();
        make_calendar();
        find_cur_project(range, email);
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
    //      }, function(response) {
    //});
}


function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        //console.log('User signed out.');
        $('#report-form').hide();
        $('.g-signin2').show();
    });
}

function find_cur_project(range, email) {

    var object = range.values;


    for (var i = 0; i < object.length; i++) {

        for (key in object[i]) {
            if (object[i][key].indexOf(email) != -1) {

                if (object[i][parseInt(key) + 1].indexOf('оглас') != -1) {

                    index_of_line = i;

                    if (object[i][parseInt(key) - 3]) {
                        $('#project').html(object[i][parseInt(key) - 3]);
                    } else {
                        $('#project').html(object[i - 1][parseInt(key) - 3]);
                    }

                    $('#etap').html(object[i][parseInt(key) - 2]);
                    $('#deadline').html(object[i][parseInt(key) + 4]);
                    $('#cloud').attr('href', object[i][parseInt(key) + 2]);
                    //$('#result').attr('href',object[i][parseInt(key)+3]);

                    loaded();
                }


            }
        }
    }
}


function find_cur_row() {

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1stpKVORtP8eoEHgLK9c-8ZQYomEx1CQ7A5lmjF0TzKE',
        range: "A1:ZZ300",
    }).then(function(response) {
        range = response.result;
        console.log(range);

        var object = range.values;


        for (key in object[0]) {
            if (object[0][key].indexOf('едлайн') != -1) {
                var index_of_row = key;

                range.values[index_of_line][index_of_row] = $('#deadline').text();
            }
        }

        for (key in object[0]) {
            if (object[0][key].indexOf('сылка') != -1) {
                var index_of_row = key;

                range.values[index_of_line][index_of_row] = $('#link_to').val();
            }
        }

        for (key in object[0]) {
            if (object[0][key].indexOf('татус') != -1) {
                var index_of_row = key;

                range.values[index_of_line][index_of_row] = 'В работе';
            }
        }


        gapi.auth.authorize({
            client_id: '20449658341-fk436athd393dkamag4pj8f13mga5dm8.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            immediate: false
        }).then(function(response) {

            gapi.client.sheets.spreadsheets.values.update({
                key: "AIzaSyDsrFsWftRPGgYjotUcEOs7MvFykuDDBfQ",
                valueInputOption: "USER_ENTERED",
                spreadsheetId: "1stpKVORtP8eoEHgLK9c-8ZQYomEx1CQ7A5lmjF0TzKE",
                range: range.range
            }, range).then(function(response) {


                $('#calendar .day-date.active').each(function() {

                    for (key in object[0]) {
                        if (object[0][key].indexOf($(this).text()) != -1) {
                            var index_of_row = key;

                            //console.log('row= '+index_of_line+' row= '+index_of_row+' wapka= '+object[0][key]+'text= '+$('#calendar .day-date.active:nth-of-type('+i+')').text());

                            update_color_request = {
                                "requests": [{
                                    "updateCells": {
                                        "start": {
                                            "sheetId": 0,
                                            "rowIndex": index_of_line,
                                            "columnIndex": index_of_row
                                        },
                                        "rows": [{
                                            "values": [{
                                                "userEnteredFormat": {
                                                    "backgroundColor": {
                                                        "green": 0.7
                                                    }
                                                }
                                            }]
                                        }],
                                        "fields": "userEnteredFormat.backgroundColor"
                                    }
                                }]
                            };

                            gapi.client.sheets.spreadsheets.batchUpdate({
                                key: 'AIzaSyDsrFsWftRPGgYjotUcEOs7MvFykuDDBfQ',
                                spreadsheetId: '1stpKVORtP8eoEHgLK9c-8ZQYomEx1CQ7A5lmjF0TzKE',

                            }, update_color_request).then(function(response) {
                                var result = response.result;
                                console.log('cant1');
                                console.log(result);
                            }, function(response) {
                                console.log('cant2');
                                console.log(response.result.error.message);
                            });




                            //range.values[index_of_line][index_of_row] = $('#calendar .day-date.active')[i].text();
                        }
                    }

                });



                $('.loaded').hide();
                $('.sended').show();
            }, function(response) {
                console.log(response);

            });
        }, function(response) {
            console.log(response);
        });;

    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });



}

var count_of_days = 10;

function make_calendar() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = dd + '.' + mm;

    console.log('today = ', today);

    for (var i = 0; i < range.values[0].length; i++) {
        console.log('range.values[0][i] = ', range.values[0][i]);
        if (range.values[0][i] == today) {
            var start_index = i
        }
    }

    for (var i = 0; i < 15; i++) {
        var sceleton = '<div class="day-date">' + range.values[0][start_index + i] + '</div>';
        $(sceleton).appendTo('#calendar');
    }

    $('#count_of_days').html(count_of_days);

    $('#calendar .day-date').click(function(event) {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            if ($('#calendar .day-date.active').length < count_of_days) {
                $(this).addClass('active');
            }
        }

        make_deadline();
    });

    //loaded();
}

function make_deadline() {
    if ($('#calendar .day-date.active').length == count_of_days) {
        var cur_deadline = $('#calendar .day-date.active').last().html();
        $('#deadline').html(cur_deadline);
    }
}

function loaded() {
    $('.loading').hide();
    $('.loaded').show();
}