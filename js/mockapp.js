let getAccessToken;

$(document).ready(()=>{

	$("#cs-loader").hide();

	$("#submitToken").click( () => {
		getAccessToken = $("#accessToken").val();

		if(getAccessToken == null || getAccessToken == ""){
			$("#errorMessage").css("visibility","inherit");
			$("#errorMessage").html("Access token is empty");
		}
		else{
			getUserDetails();
		}
	});

	$("#homePageHeader").click( () => {
		getHomePage();
	});
})

let getHomePage = () => {
	$("#errorMessage").css("visibility","hidden");
	$("#userDetails").css("display","inline");
	$("#profileDetails").css("display","none");
}

let getUserDetails = () => {

		$.ajax({
			type:'GET',
			dataType:'json',
			async: true,
			url: 'https://graph.facebook.com/me?fields=name,quotes,cover,picture.type(large),birthday,email,hometown,gender,posts{created_time,type,full_picture,story,message,source}&access_token=' + getAccessToken,

			success: (response) => {
				$("#userDetails").css("display","none");
				$("#profileDetails").css("display","inline");
				$("#coverPhoto").css("background-image", "url(" + response.cover.source + ")");
				$("#profilePhoto").html('<img src = "' + response.picture.data.url + '" class="img-fluid profilePhoto"/>');
				$("#userName").html(response.name);
				$("#card-body1").html(response.quotes);
				$("#card-body2").html("Birthday: "+response.birthday);
				$("#card-body3").html("Gender: "+response.gender);
				$("#card-body4").html("Email: "+response.email);
				$("#card-body5").html("Lives in "+response.hometown.name);
				var i = response.posts.data.length;
				for(items of response.posts.data){
					var divSubmit = $('<div class="div-border-bottom"></div>');
					divSubmit.className = "div-border-bottom";
					if(items.story != '' && items.story != undefined){
						$(divSubmit).append('<div class="story">'+ items.story +'</div>');
					}
					if(items.type != '' && items.type != undefined){
						if(items.type == 'status'){
							$(divSubmit).append('<div class="story">'+ response.name + ' updated his status' + '</div>');
							if(items.message != '' && items.message != undefined){
								$(divSubmit).append('<div class="message">'+ items.message + '</div>');
							}
						}
						else{
							if(items.message != '' && items.message != undefined){
								$(divSubmit).append('<div class="message">'+ items.message + '</div>');
							}
						}
					}
					if(items.full_picture != '' && items.full_picture != undefined){
						$(divSubmit).append('<div><img class="img-fluid img-size" src="'+ items.full_picture + '"/></div>')
					}
					if(items.created_time != '' && items.created_time !=undefined){
						$(divSubmit).append('<div class="createdtime">' + new Date(items.created_time).toString('dd-MM-yy') +'</div>');
					}
					$('#card-body-newsfeed').append(divSubmit);
				}
			},
			error: (e) =>{
				$("#errorMessage").html(e.responseJSON.error.message);
				$("#errorMessage").css("visibility","inherit");
			},
			timeout: 3000,
			beforeSend: () => {
				$("#cs-loader").show();
			},
			complete: () => {
				$("#cs-loader").hide();
			}
		})
	}
