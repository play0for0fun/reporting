$(document).ready(function() {



    $("#date").datepicker({
        "dateFormat": "dd.mm"
    });


    $('#report-form').submit(function(event) {
        event.preventDefault();
        if ($("#agree").prop("checked") != true) {
            $("#agree").next().css('color', 'red');
        } else {
            var date = $('#date').val();
            find_cur_row(date);
            //alert(index_of_line+', '+index_of_row)
        }
    });


});

function onSignIn(googleUser) {
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
    $("#date").val(today);



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
        find_cur_project(range, email);
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
    //     }, function(response) {
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

                if (object[i][parseInt(key) + 1].indexOf('работ') != -1) {

                    index_of_line = i;

                    if (object[i][parseInt(key) - 3]) {
                        $('#project').html(object[i][parseInt(key) - 3]);
                    } else {
                        $('#project').html(object[i - 1][parseInt(key) - 3]);
                    }

                    $('#etap').html(object[i][parseInt(key) - 2]);
                    $('#deadline').html(object[i][parseInt(key) + 4]);
                    $('#cloud').attr('href', object[i][parseInt(key) + 2]);
                    $('#result').attr('href', object[i][parseInt(key) + 3]);

                    loaded();
                }


            }
        }
    }
}


function find_cur_row(date) {

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1stpKVORtP8eoEHgLK9c-8ZQYomEx1CQ7A5lmjF0TzKE',
        range: "A1:ZZ300",
    }).then(function(response) {
        range = response.result;
        console.log(range);
        var object = range.values;


        for (var i = 0; i < object.length; i++) {

            for (key in object[i]) {
                if (parseInt(key) > 9 && object[i][key].indexOf(date) != -1) {

                    index_of_row = key;

                    console.log(index_of_row);

                    range.values[index_of_line][index_of_row] = $('#report').val();


                    gapi.auth.authorize({
                        client_id: '20449658341-fk436athd393dkamag4pj8f13mga5dm8.apps.googleusercontent.com',
                        scope: 'https://www.googleapis.com/auth/spreadsheets',
                        immediate: false
                    }).then(function(response) {

                        gapi.client.sheets.spreadsheets.values.update({
                            spreadsheetId: '1stpKVORtP8eoEHgLK9c-8ZQYomEx1CQ7A5lmjF0TzKE',
                            range: range.range,
                            valueInputOption: 'USER_ENTERED'
                        }, range).then(function(response) {
                            $('.loaded').hide();
                            $('.sended').show();
                        }, function(response) {});
                    }, function(response) {});;


                }
            }
        }

    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });



}

function loaded() {
    $('.loading').hide();
    $('.loaded').show();
}