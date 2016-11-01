$(document).ready(function() {



		$("#date").datepicker({
			"dateFormat":"dd.mm"
		});


		$('#report-form').submit(function(event) {

		  	event.preventDefault();

		  	$(this).find('input,textarea').each(function(){
		  		if ($(this).val().length < 1 ) {
		  			$(this).addClass('error-input');
		  		}else{
		  			$(this).removeClass('error-input');
		  		}
		  	});

			if ($(this).find('.error-input').length == 0) {
	

				loadSheetsApi();

	       
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

          	//loadSheetsApi();


	        loaded();
	      
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
	          spreadsheetId: '10ssixCLTbuE8rFAk2DsB3VPpHcdjOqwXW1jsTcy2ajk',
	          range: "A1:Z100",
	        }).then(function(response) {
	          range = response.result;
	          console.log(range);


	          var gmail = $('#gmail').val();
	          var email = $('#email').val();
	          var name = $('#name').val();
	          var phone = $('#phone').val();
	          var time = $('#time').val();
	          var vk = $('#vk').val();
	          

   				use_table(gmail,email,name,phone,time,email,vk);


      
	        }, function(response) {
	          appendPre('Error: ' + response.result.error.message);
	        });
	        // }, function(response) {
		//});
      }


	  function signOut() {
	    var auth2 = gapi.auth2.getAuthInstance();
	    auth2.signOut().then(function () {
	      //console.log('User signed out.');
	      $('#report-form').hide();
	      $('.g-signin2').show();
	    });
	  }

	  function use_table(gmail,email,name,phone,time,email,vk){

	  	var object = range.values;
		
		var line = object.length;

		var new_obj = new Array(email,name,phone,time,vk);


		

		object[line] = new_obj;
		
		//object[line+1] = new Array('Результаты');

		range.values = object;


		gapi.auth.authorize({client_id: '20449658341-fk436athd393dkamag4pj8f13mga5dm8.apps.googleusercontent.com', scope: 'https://www.googleapis.com/auth/spreadsheets', immediate: false}).then(function(response) {
		    	
					    	gapi.client.sheets.spreadsheets.values.update({
                		      key: "AIzaSyDsrFsWftRPGgYjotUcEOs7MvFykuDDBfQ",
					          spreadsheetId: '10ssixCLTbuE8rFAk2DsB3VPpHcdjOqwXW1jsTcy2ajk',
					          range: "'Лист1'!A1:Z100",
					          valueInputOption: 'USER_ENTERED'
					        },range).then(function(response) {
					          $('.loaded').hide();
					          $('.sended').show();
					        }, function(response) {
					        });
					    }, function(response) {
		});;



	  }

	  function loaded(){
	  	$('.loading').hide();
	  	$('.loaded').show();
	  }