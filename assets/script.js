let topicArr = ["monkey", "cat", "bear", "panda", "capybara", "horse", "bird", "dog", "arctic fox", "red panda"];

//add buttons
$('#add').on("click", function(event){
    event.preventDefault();
    let text = $('#query');
    let userInput = text.val().trim();
    userInput = userInput.toLowerCase();
    if(userInput !== "" && topicArr.indexOf(userInput) == -1) {
        topicArr.push(text.val());
        drawBtns();
    }
    
    //clear text field
    text.val("");
});

//draw buttons
function drawBtns() {
    let btnGrp = $('#btns');
    btnGrp.empty();
    for (let index = 0; index < topicArr.length; index++) {
        const element = topicArr[index];
        let btn = $('<button>');
        btn.val(element).html(element.toUpperCase()).on("click", function(){
            let search = buildQuery(this.value, "search");
            makeGifs(search);

        });
        btn.appendTo('#btns');
        
    }
}
//delete last button
$('#delete').on("click", function(event){
    event.preventDefault();
    topicArr.pop();
    drawBtns();
});

//make query URL
function buildQuery(searchTerm, type) {
    //http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5
    //api.giphy.com
    ///v1/gifs/search?q= query &api_key
    let apiKey = "&api_key=vx2xjv4d3f7uE12X8wl5Ysc4vprY5qKJ";
    let limit = '&limit=10';
    let rating = '&rating=PG'
    let offset = '&offset=' + Math.floor(Math.random() * 100);
    //in case I want to change my query to a random instead of search later
    if(type === "search"){
        return 'https://api.giphy.com/v1/gifs/search?q=' + searchTerm + apiKey + limit + offset + rating;
    }
}

//function for ajax call
function makeGifs(queryURL) {
    
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        //build imgs, use src as still image, add attr for data-still, data-animate, data-state (still or animated)
        //add function with click that swaps states between still and animated
        if(response.data.length > 0) {

            for(i = 0; i < response.data.length; i++) {
                
                let img = $('<img>');
                //.data["0"].images.fixed_height_still.url
                img.attr("src", response.data[i].images.fixed_height_still.url)
                .attr("data-still", response.data[i].images.fixed_height_still.url)
                .attr("data-animate", response.data[i].images.fixed_height.url)
                .attr("data-state", "still");
                img.on("click", function(){
                    let thisImg = $(this);
                    let state = thisImg.attr("data-state");
                    if(state === "still") {
                        thisImg.attr("src", thisImg.attr("data-animate"));
                        thisImg.attr("data-state", "animate");
                    } else {
                        thisImg.attr("src", thisImg.attr("data-still"));
                        thisImg.attr("data-state", "still");
                    }
                });
                let div = $('<div>');
                div.css("width", response.data[i].images.fixed_height.width);
                div.addClass("gifBox");
                div.html("<p>Rating: " + response.data[i].rating + "</p>").append(img);
                div.prependTo('#results');
                
            }//end for
        }//end if
    }); //end response fx

} //end makeGifs fx

//add button to clear gifs
$("#clear").on("click", function(event){
    event.preventDefault();
    $('#results').empty();
});

//add initial buttons
drawBtns();
