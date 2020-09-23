const inputTextBox = document.querySelector("#textbox");
const submitBtn = document.querySelector("#submit-btn");
const output = document.querySelector("#output");
const baseUrl = "https://api.tvmaze.com/search/shows?q=";
const overlay = document.querySelector("#overlay");
const API_KEY = '?api_key=a2df3d1a7611194432bbdf1fc80540f2';
const BASEURL = `https://api.themoviedb.org/3/movie/popular${API_KEY}&language=en-US&page=1`
const IMGPATH = 'https://image.tmdb.org/t/p/w500'

submitBtn.addEventListener("click", function (){
    inputText = inputTextBox.value;
    getData(inputText);
});

function getData(search){
    search = search.replace(' ','%20');
    let url = baseUrl + search; // convert spaces into %20
    let myFetch = fetch(url);

    myFetch.then(function(response){
        response.json().then(function (json){
            displaySearch(json);
        });
    });

}


function displaySearch(json){
    output.innerHTML =""
    for (let i = 0; i < json.length; i++){
        let para = document.createElement('p');
        console.log(json[i]['show']['name']);
        para.textContent += json[i].show.name;

        let image = document.createElement('img');
        image.src = json[i].show.image.medium
        para.append(image)
        output.append(para)
    }
}

function homePage(){
    let moviesFetch = fetch(BASEURL);

    moviesFetch.then(function(response){
        response.json().then(function (json){
            json.results.forEach(popMovie => {

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
            });
        });
    })
}

function displayInfo(Data){
    overlay.classList.add('show');
    // overlay.innerHTML ='';
    let rating = Math.round(Data.vote_average/2);
    let star = "";
    let titleSize;
    if (rating){
        for (let i=0;i<rating;i++){
            star +=`<i class="fa fa-star" aria-hidden="true"></i>`
            console.log('star')
        }
        if(rating < 5){
            for (let i=0; i<(5-rating); i++){
                star+=`<i class="fa fa-star-o" aria-hidden="true"></i>`
            }
        }
    }else if (rating === 0){
        for (let i=0; i<5; i++){
            star+=`<i class="fa fa-star-o" aria-hidden="true"></i>`
        }
    }

    if(Data.title.length < 16){
        titleSize = `not-longer-then-16`
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
    scrollLeftBtn.classList.add('left-btn')
    scrollLeftBtn.innerHTML =`<i class="fa fa-arrow-left" aria-hidden="true"></i>`;
    castDiv.append(scrollLeftBtn);
    scrollLeftBtn.addEventListener('mouseover',function(){
        
        castDiv.scrollLeft -= 150;
    });


    // the cast cards with images
    let movieCastFetch = fetch(castUrl)
    console.log(Data.id)
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
                    console.log("doing")
                    castDiv.append(castCard);
                }
            });
        });
    })



    // scroll right button for castDiv
    let scrollRightBtn = document.createElement('button');
    scrollRightBtn.classList.add('right-btn');
    scrollRightBtn.innerHTML =`<i class="fa fa-arrow-right" aria-hidden="true"></i>`;
    castDiv.append(scrollRightBtn);
    scrollRightBtn.addEventListener('click',function(){
        
        castDiv.scrollLeft += 100;

    });
}

function overlayClose(){
    overlay.classList.remove('show')
}


homePage();
