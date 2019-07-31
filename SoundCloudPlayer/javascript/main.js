/*
1.Search
*/

var UI = {};

UI.enterPress = document.querySelector('.js-search');
UI.enterPress.addEventListener('keyup',function(e){

	var input = document.querySelector("input").value;
	console.log(input);
	if (e.which===13){

		SoundCloudAPI.getTrack(input);
	}
})

UI.submitClick = document.querySelector('.js-submit');



/*
2.query the souldcloud
*/

/*nameSpacing an object that wraps up the SC functions */
var SoundCloudAPI = {};

/* define SoundCloundAPI's init and pass SC.initialize to it*/
SoundCloudAPI.init = function(){
	/*Sound cloud initialize*/

SC.initialize({
  client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
});
}


/*
SC is an object created by soundclound and the source code is this line
<script src="https://connect.soundcloud.com/sdk/sdk-3.3.2.js"></script>
*/

/*call init to initiate using SC*/
SoundCloudAPI.init();
/*define SoundCloudAPI.getTrack that retrieve track provided by soundcloud according to the user inputValue*/
SoundCloudAPI.getTrack = function(inputValue){
	SC.get('/tracks', {
	/*
	license is a filter witch can be removed
	q is the variable setup for keyword search, we want to retrive user search and give it to q
	*/
  q: inputValue, // , license: 'cc-by-sa'
}).then(function(tracks) {
  console.log(tracks);
  /*
  SoundCloudAPI.renderTrack after we get the tracks.
  Next step will grab the array of tracks data.
  Then go through each arrayelement by the forEach function 
  created in SoundCloudAPI.renderTrack function.
  */

  SoundCloudAPI.renderTrack(tracks);

});
 
}

/*
call the function while giving it user's inputValue, 
the function will retrieve track from soundcloud through SC
*/

/*
SoundCloudAPI.getTrack("Sam Smith"); 
*/

SoundCloudAPI.renderTrack = function(array){

	/*remove the previous search results*/
	var resetCard = document.querySelector('.js-search-results');
	resetCard.innerHTML = " ";

	/*create new cards with the received tracks data from soundcloud*/
	array.forEach(function(arrayElement){
		console.log(arrayElement.title);
		/*this card created by js is inside of class "search-results .." and after card class in html*/
	var card = document.createElement('div');
	card.classList.add("card"); /*add the card class in html to the card in js */
	var searchResult = document.querySelector('.js-search-results');/*or .search-results*/
	searchResult.appendChild(card);

	var img = document.createElement('div');
	img.classList.add("image");
	card.appendChild(img);

	var image_img = document.createElement('img');
	image_img.classList.add("image_img");
	image_img.src = arrayElement.artwork_url || "https://cdn2-www.dogtime.com/assets/uploads/2016/09/rottweiler-puppy-13-e1553629955213.jpg";
	/*
	if (arrayElement.artwork_url ==null){
		image_img.src = "https://cdn2-www.dogtime.com/assets/uploads/2016/09/rottweiler-puppy-13-e1553629955213.jpg";
	}*/
	img.appendChild(image_img);
    

	var content = document.createElement('div');
	content.classList.add("content");
	card.appendChild(content);

	var header = document.createElement('div');
	header.classList.add("header");
	content.appendChild(header);

	var a = document.createElement('a');
	/*grab the arrayElement retrieved from soundCloud and display the song title*/
	a.innerHTML = '<a href="'+arrayElement.permalink_url+'" target="_black">'+arrayElement.title+'</a>';
	header.appendChild(a);

	var addToPlaylist = document.createElement('div');
	/*In html it will show as ui bottom attached button js-button  */
	addToPlaylist.classList.add('ui', 'bottom', 'attached', 'button', 'js-button');
	card.appendChild(addToPlaylist);
	addToPlaylist.addEventListener('click', function(){

		/*
		ArrayElement contains data of each soundtrack, 
		in getEmbed it extracts url (that plays the sound)of arrayElement 
		  */

      SoundCloudAPI.getEmbed(arrayElement);

	})

	var addIcon = document.createElement('i');
	/* either ' or " may work*/
	addIcon.classList.add("add","icon");
	addToPlaylist.appendChild(addIcon);

	var textOfIcon = document.createElement('span');
	textOfIcon.innerHTML = "Add to playlist";
	addToPlaylist.appendChild(textOfIcon);



	})


}



/*
3.display the cards
*/

var userInput = document.querySelector(".js-search").value;

document.querySelector(".js-submit").addEventListener('click',function(){
	SoundCloudAPI.getTrack(userInput);
})




/*
4.add to playlist
*/
SoundCloudAPI.getEmbed = function(e){

	/*use SC SDK to retrieve the embed cookie that will be added to playlist sidebar*/
SC.oEmbed(e.permalink_url, {
  auto_play: true
}).then(function(embed){
  console.log('oEmbed response: ', embed);

  /*grab the div js-playlist sidebar created in html, then we can make sidebar dynamic*/
  var sidebar = document.querySelector('.col-left');

  /*sidebar.innerHTML = embed.html;  in this way new added covers last added*/
  var box = document.createElement('div');
  box.innerHTML = embed.html;

  /*
 Box is inserted into sidebar,
 Because the first time sidebar has no child, the first added song will be the firstChild
  */
  sidebar.insertBefore(box,sidebar.firstChild);
 /* console.log('sidebar.innerHTML'+sidebar.innerHTML);*/

 /*locally store the playlist, so it does not disppear after refresh, it has to be 2 strings*/
  localStorage.setItem('myPlaylist', sidebar.innerHTML);



});

}

 

/*read the data stored in localStorage and put into .col-left*/

   var storedPlaylist = document.querySelector('.col-left');
   storedPlaylist.innerHTML = localStorage.getItem('myPlaylist');


UI.clearList = document.querySelector("button");
//UI.clearList.classList.add("js-button");
UI.clearList.addEventListener('click', function(){
	localStorage.clear();
})

