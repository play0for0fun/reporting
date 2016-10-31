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

	  		$('input[type="radio"]').closest('.line').addClass('error-input');
			$('input[type="radio"]:checked').closest('.line').removeClass('error-input');

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
	          spreadsheetId: '1nanzjcNaNAvrfeqVThlb0fejOTsDec5d9v_qad6TepM',
	          range: "A1:Z1300",
	        }).then(function(response) {
	          range = response.result;
	          console.log(range);


	          var email = $('#gmail').val();
	          var name = $('#name').val();
	          var vk = $('#vk').val();
	          var skype = $('#skype').val();
	          var valid = $('#valid').val().replace(/:/g, "%3A").replace(/\//g, "%2F").replace('http','https://validator.w3.org/nu/?doc=http');
	          var map = $('#map').val().replace(/:/g, "%3A").replace(/\//g, "%2F").replace('http','https://validator.w3.org/nu/?showoutline=yes&doc=http');
	          var pagespeed = $('#pagespeed').val().replace(/:/g, "%3A").replace(/\//g, "%2F").replace('http','https://developers.google.com/speed/pagespeed/insights/?hl=ru&url=http');
	          var pingdom = $('#pingdom').val();
	          var krosbrowser = $('#krosbrowser').val();
	          var adaptive = $('#adaptive').val();
	          var grunt = $('#grunt').val();
	          var sass = $('#sass').val();
	          var learn = $('#learn').val();
	          var valid_n = $('input[name="V1"][type="radio"]:checked').val();
	          var pagespeed_n = $('input[name="V2"][type="radio"]:checked').val();
	          var pingdom_n = $('input[name="V3"][type="radio"]:checked').val();
	          

   				use_table(email,name,vk,skype,valid,map,pagespeed,pingdom,krosbrowser,adaptive,grunt,sass,learn,valid_n,pagespeed_n,pingdom_n);


      
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

	  function use_table(email,name,vk,skype,valid,map,pagespeed,pingdom,krosbrowser,adaptive,grunt,sass,learn,valid_n,pagespeed_n,pingdom_n){

	  	var object = range.values;
		
		var line = object.length;

		for(var i=0; i<object.length; i++) {

		  for(key in object[i]) {
		    if(object[i][key].indexOf(email)!=-1) {
				
				alert('Вы уже заполняли эти данные');
		    	return false;
		    }
		  }
		}

		var new_obj = new Array(email,' ',name,vk,skype,valid,map,pagespeed,pingdom,krosbrowser,adaptive,grunt,sass,learn,valid_n,pagespeed_n,pingdom_n);


		

		object[line] = new_obj;
		
		//object[line+1] = new Array('Результаты');

		range.values = object;

		console.log(range.range);

		gapi.auth.authorize({client_id: '20449658341-fk436athd393dkamag4pj8f13mga5dm8.apps.googleusercontent.com', scope: 'https://www.googleapis.com/auth/spreadsheets', immediate: false}).then(function(response) {
		    	
					    	gapi.client.sheets.spreadsheets.values.update({
                		      key: "AIzaSyDsrFsWftRPGgYjotUcEOs7MvFykuDDBfQ",
					          valueInputOption: 'USER_ENTERED',
					          spreadsheetId: '1nanzjcNaNAvrfeqVThlb0fejOTsDec5d9v_qad6TepM',
					          range: range.range
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