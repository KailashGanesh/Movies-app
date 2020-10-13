const inputTextBox = document.querySelector("#textbox");
const submitBtn = document.querySelector("#submit-btn");
const output = document.querySelector("#output");
const overlay = document.querySelector("#overlay");

const baseUrl = "https://api.tvmaze.com/search/shows?q="; // tvmaze

const API_KEY = '?api_key=a2df3d1a7611194432bbdf1fc80540f2';
const BASEURL = `https://api.themoviedb.org/3/movie/popular${API_KEY}&language=en-US&page=1`
const SEARCHURL = `https://api.themoviedb.org/3/search/movie${API_KEY}&language=en-US&include_adult=false&query=`
const IMGPATH = 'https://image.tmdb.org/t/p/w500'

submitBtn.addEventListener("click", function (){
    inputText = inputTextBox.value;
    searchForData(inputText);
});

function searchForData(search){
    search = search.replace(' ','%20'); // convert spaces into %20
    let url = SEARCHURL + search;
    fetch(url).then(function(response){
        response.json().then(function (json){
            displayResults(json);
        });
    });

}

function homePage(){
    let moviesFetch = fetch(BASEURL);
    moviesFetch.then(function(response){
        response.json().then(function (json){
            displayResults(json);
        });
    })
}

function displayResults(json){
    output.innerHTML =""
    console.log(json)
    json.results.forEach(popMovie => {
        if (popMovie.poster_path){
            let card_div = document.createElement('div')
            let card = `<div class="poster">
                <img src="${IMGPATH + popMovie.poster_path}" alt="${popMovie.title}">
                </div>
                <div class="card-info">
                <h5>${popMovie.title}</h5>
                <span>${popMovie.vote_average}</span>
            </div>`
            card_div.innerHTML += card;
            card_div.classList.add('card')
            output.append(card_div); 
            card_div.addEventListener('click', function(){displayInfo(popMovie)})
        }
    });
}



// overlay display info function
function displayInfo(Data){
    overlay.classList.add('show');  // if this function is called then we need to display the overlay
    overlay.classList.add('background-blur') // set's overlay background to transprent and blur
    let rating = Math.round(Data.vote_average/2); //calculate rating out of 5 from out of 10
    let star = "";
    let titleSize; // this is used to reduce title font size if title is longer then 16 charters
    // check if the veriable rating is available
    if (rating){
        for (let i=0;i<rating;i++){ // rating = 3 then 3 filled-stars will be placed
            star +=`<i class="fa fa-star" aria-hidden="true"></i>`
        }
        if(rating < 5){ // place empty stars for the rest
            for (let i=0; i<(5-rating); i++){
                star+=`<i class="far fa-star"></i>`
            }
        }
    }else if (rating === 0){ // if rating is zero then place 5 empty stars
        for (let i=0; i<5; i++){
            star+=`<i class="far fa-star"></i>`
        }
    }

    if(Data.title.length < 16){
        titleSize = `not-longer-then-16` // css-class which makes the font big
    }
    overlay.innerHTML = `<span class="close-btn" onclick="overlayClose()">&times;</span>
    <div class="movie-poster">
    <img src="${IMGPATH + Data.poster_path}" alt="${Data.title}">
        <div class="movie-info">
            <div class="title-rating">
                <h1 class="movie-title ${titleSize}">${Data.title}</h1>

                <div class="subtitle">
                    <span>${Data.release_date}</span>
                    <div class="rating">
                        <div class="stars">
                            ${star}
                        </div>
                        <span>${rating}</span>
                    </div>
                </div>

            </div>
            <p>${Data.overview}</p> 
        </div>
    </div>`

    // movie casts data request from theMoviedb api
    let castUrl = `https://api.themoviedb.org/3/movie/${Data.id}/credits${API_KEY}` 

    // making the cast element for the overlay
    let castDiv = document.createElement('div')
    castDiv.classList.add('cast')
    overlay.append(castDiv);

    // scroll left buttons for the cast element
    let scrollLeftBtn = document.createElement('button');
    let scrollLeftInterval;
    scrollLeftBtn.classList.add('left-btn')
    scrollLeftBtn.innerHTML =`<i class="fa fa-arrow-left" aria-hidden="true"></i>`;
    castDiv.append(scrollLeftBtn);
    scrollLeftBtn.addEventListener('mouseover',function(){
        StartScrollLeft();
        scrollLeftInterval = setInterval(StartScrollLeft, 400);
    });
    scrollLeftBtn.addEventListener('mouseout',function(){
        clearInterval(scrollLeftInterval);
    });
    function StartScrollLeft(){
        castDiv.scrollLeft -= 700;
    }


    // the cast cards with images
    let movieCastFetch = fetch(castUrl)
    movieCastFetch.then(function(response){
        response.json().then(function (json){
            json.cast.forEach(Cast => {
                if(Cast.profile_path){
                    let castCard = document.createElement('div');
                    castCard.classList.add('item');
                    castCard.innerHTML =`
                        <img src="${IMGPATH}${Cast.profile_path}" alt="${Cast.name}">
                        <div class="cast-info">
                            <h4>${Cast.name}</h4>
                            <span>${Cast.character}</span>
                        </div>`
                    castDiv.append(castCard);
                }
            });
        });
    })



    // scroll right button for castDiv
    let scrollRightBtn = document.createElement('button');
    let scrollRightInterval;
    scrollRightBtn.classList.add('right-btn');
    scrollRightBtn.innerHTML =`<i class="fa fa-arrow-right" aria-hidden="true"></i>`;
    castDiv.append(scrollRightBtn);
    scrollRightBtn.addEventListener('mouseover',function(){
        startScrollRight();
        scrollRightInterval = setInterval(startScrollRight, 400);
    });
    scrollRightBtn.addEventListener('mouseout',function(){
        clearInterval(scrollRightInterval);
    });
    function startScrollRight(){
        castDiv.scrollLeft += 700;
    }

}

function overlayClose(){
    // when this function is called it closes the overlay
    overlay.classList.remove('show')
    overlay.classList.remove('background-blur')
}


homePage(); //calls homepage functin to display the home page
