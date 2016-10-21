$(document).ready(function() {



		$("#date").datepicker({
			"dateFormat":"dd.mm"
		});


		$('#report-form').submit(function(event) {

		  	event.preventDefault();

		  	$(this).find('input,textarea').each(function(){
		  		if ($(this).val().length < 3 ) {
		  			$(this).addClass('error-input');
		  		}else{
		  			$(this).removeClass('error-input');
		  		}
		  	});

			if ($(this).find('.error-input').length == 0) {
	          var email = $('#gmail').val();
	          
	          use_table(email);

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

	      	$('#person').html(profile.getName()+',<br>'+profile.getEmail());

	      	$('.g-signin2').hide();

          	loadSheetsApi();
	      
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
      //	gapi.auth.authorize({client_id: '20449658341-fk436athd393dkamag4pj8f13mga5dm8.apps.googleusercontent.com', scope: 'https://www.googleapis.com/auth/spreadsheets', immediate: false}).then(function(response) {
	        gapi.client.sheets.spreadsheets.values.get({
	          spreadsheetId: '14VaRta1xOjgnKSommsSBzBWEA-KbY0x_CCfT4UGKOoQ',
	          range: "A1:Z100",
	        }).then(function(response) {
	          range = response.result;
	          console.log(range);
	          loaded();        
	        }, function(response) {
	          console.log(response.result.error.message);
	        });
     // }, function(response) {
	//	});
	}


	  function signOut() {
	    var auth2 = gapi.auth2.getAuthInstance();
	    auth2.signOut().then(function () {
	      //console.log('User signed out.');
	      $('#report-form').hide();
	      $('.g-signin2').show();
	    });
	  }

	  function use_table(email){

	  	gapi.client.sheets.spreadsheets.values.get({
	          spreadsheetId: '14VaRta1xOjgnKSommsSBzBWEA-KbY0x_CCfT4UGKOoQ',
	          range: "A1:Z100",
	        }).then(function(response) {
	          range = response.result;
	          console.log(range);


	           	var object = range.values;
		

				for(var i=0; i<object.length; i++) {

				  for(key in object[i]) {
				    if(object[i][key].indexOf(email)!=-1) {
				    	alert('Вы уже есть в списке');

				    	return false;
				    }
				  }
				}

				object[object.length] = new Array(email,$('#name').val(),$('#phone').val(),$('#contacts').val(),$('#money').val(),$('#trello').val());

				range.values = object;


				gapi.auth.authorize({client_id: '20449658341-fk436athd393dkamag4pj8f13mga5dm8.apps.googleusercontent.com', scope: 'https://www.googleapis.com/auth/spreadsheets', immediate: false}).then(function(response) {
				    	
							    	gapi.client.sheets.spreadsheets.values.update({
							          spreadsheetId: '14VaRta1xOjgnKSommsSBzBWEA-KbY0x_CCfT4UGKOoQ',
							          range: "'Лист1'!A1:Z100",
							          valueInputOption: 'USER_ENTERED'
							        },range).then(function(response) {
							          $('.loaded').hide();
							          $('.sended').show();
							        }, function(response) {
							        });
							    }, function(response) {
				});;




	        }, function(response) {
	          console.log(response.result.error.message);
	        });

	 

	  }



	  function loaded(){
	  	$('.loading').hide();
	  	$('.loaded').show();
	  }