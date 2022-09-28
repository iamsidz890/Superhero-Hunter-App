// get public key via marvel api docs
const publicKey = "79e79e9d0ae2abae7136ca17a1717706";
const url =
 "https://gateway.marvel.com/v1/public/characters?ts=1&apikey=79e79e9d0ae2abae7136ca17a1717706&hash=289e6ad5d20abea37d5b7d3ece2799fd " ;

// maintain both the pages as per the condition and then render acc as per the condition
const pages = {
  home: `<div class="mx-auto mt-5" ><div class="spinner-border text-red"style="width: 5rem; height: 5rem;" role="status">
    <span class="visually-hidden">Loading...</span>
  </div></div>`,
  favourite: `<p>There is nothing in your favourites page </p>`,
};

let appData = [];
let movie = [];
let favmov = "";

// function for loading content of different pages 
function loadContent() {
  var root = document.getElementById("root"),
    id = location.hash.slice(1);
    // console.log(location);
  if (id === "favourite") {
    root.innerHTML = pages[id];

    let unfavButton = document.querySelectorAll(".unfavButton");
    console.log(unfavButton, 'btn');
    if (unfavButton) {
      for (let button of unfavButton) {
        button.addEventListener(
          "click",
          (e) => {
            let index = movie.indexOf(
              e.target.parentElement.firstElementChild.innerText
            );

            movie.splice(index, 1);
            window.localStorage.setItem(
              "favData",
              JSON.stringify(movie)
            );
            window.location.reload();
          },
          false
        );
      }
    }
  } else {
    root.innerHTML = pages[id];
  }
}

if (!location.hash) {
  location.hash = "#home";
}

loadContent();

window.addEventListener("hashchange", loadContent);  
// hashchange event listener will trigger only when url chnages
window.onload = async () => {
  let response = await fetch(url);
  let responsedPromise = response.json();
  let result = await responsedPromise;
  let data = result.data.results;
  appData = [...data];
  let home = "";
  data.forEach((element) => {
    console.log();
//  the home page html loader
    home += `<div class="card border border-5 border-warning bg-warning bg-gradient text-white flex-grow-1" style="width: 18rem;">
        <img src=${element.thumbnail.path
      }/portrait_xlarge.jpg class="card-img-top" alt="..." style="height:15rem">
        <div class="card-body d-flex flex-column align-items-center gap-2">
          <h5 class="card-title "style="color:  #adb5bd;" >${element.name}</h5>
         
          <span class="btn btn-outline-secondary">Number of Series: <span class="text-white">${element.series.available
      }</span></span>
          <span class="btn btn-outline-secondary">Number of Stories: <span class="text-white">${element.stories.available
      }</span></span>
          <a href=${element.urls[2] ? element.urls[2].url : "..."
      } class="btn btn-dark bg-opacity-25" style="width:90%" target="_blank" > <span class="text-white">Comics: <span class="text-white">${element.comics.available
      }</span></span></a>
          <a href=${element.urls[0].url
      } class="btn btn-dark bg-opacity-25" style="width:90%;" target="_blank">Detail</a>
            </div>
      </div>`;
  });
  // after selecting favourite this will trigger
  let savedLocalFavData = JSON.parse(window.localStorage.getItem("favData"));
  if (savedLocalFavData !== null && savedLocalFavData.length > 0) {
    movie = savedLocalFavData;
    data.forEach((element) => {
      for (let item of savedLocalFavData) {
        if (element.name === item) {
          favmov += `<div class="card  border border-5 border-dark bg-transparent text-white " style="width: 18rem;">
      <img src=${element.thumbnail.path
            }/portrait_xlarge.jpg class="card-img-top" alt="..." style="height:15rem">
      <div class="card-body d-flex flex-column align-items-center gap-2">
        <h5 class="card-title text-light">${element.name}</h5>
       
        <span class="text-danger">Series: <span class="text-white">${element.series.available
            }</span></span>
        <span class="text-danger">Stories: <span class="text-white">${element.stories.available
            }</span></span>
        <a href=${element.urls[2] ? element.urls[2].url : "..."
            } class="btn btn-dark" style="width:90%" target="_blank" > <span class="text-white">Comics: <span class="text-white">${element.comics.available
            }</span></span></a>
        <a href=${element.urls[0].url
            } class="btn btn-dark" style="width:90%" target="_blank">More Detail</a>
        <a
            
           class="btn btn-dark unfavButton" style="width:90%" >unfavourite</a>
          </div>
    </div >; `;
        }
      }
    });
    pages["favourite"] = favmov;
  }

  pages["home"] = home;
  loadContent();
};
// select search bar and query
const searchText = document.getElementById("searchText");
const searchCard = document.getElementById("searchCard");
searchText.addEventListener("input", function handleSearch(e) {
  searchCard.innerHTML = "";
  searchCard.style.height = "0";
  
  let savedLocalFavData = JSON.parse(window.localStorage.getItem("favData"));
  console.log(savedLocalFavData);
  let value = e.target.value;
  let emptyData = [];
  if (value) {
    searchCard.style.height = "300px";
    let SuggestedData = appData.map((item) => {
      // console.log('heel' , item);
      return { name: item.name, url: item.urls[0].url };
    });
    emptyData = SuggestedData.filter((item) => {
      console.log('item' , item.name.toLowerCase().startsWith(value.toLowerCase()));
      return item.name.toLowerCase().startsWith(value.toLowerCase());
      console.log(emptyData , 'EMPTY');
    });
    if (emptyData[0]) {
      emptyData.forEach((item) => {
        let flag = false;
        if (savedLocalFavData) {
          for (let data of savedLocalFavData) {
            flag = item.name === data;
            if (flag) {
              break;
            }
          }
        }

        searchCard.innerHTML += `<li class="d-flex justify-content-between align-items-center border-bottom"> <a href=${item.url
          } class="text-decoration-none text-danger" style="font-size:15px" target="_blank">${item.name
          }</a>
                      <button type="button" class="btn btn-link text-white fav-button"  
            >${flag ? "unfavourite" : "Add to Favourites"} </button></li>`;
      });
      let buttons = document.querySelectorAll(".fav-button");

      for (let button of buttons) {
        button.addEventListener("click", (e, item) => {
          handleFav(e, item);
        });
      }
    } else {
      searchCard.innerHTML = `<p style="text-align:center;margin-top:25%" class="text-white">No result </p>`;
    }
  }
});

// handling favourite and unfavourite from search bar
function handleFav(e, item) {
  favmov = "";
  let savedLocalFavData = JSON.parse(window.localStorage.getItem("favData"));

  let index = movie.indexOf(
    e.target.previousElementSibling.innerText
  );
  if (index === -1) {
    movie.push(e.target.previousElementSibling.innerText);
    window.localStorage.setItem("favData", JSON.stringify(movie));
    savedLocalFavData = JSON.parse(window.localStorage.getItem("favData"));

    e.target.innerText = "unfavourite";
    appData.forEach((element) => {
      for (let item of savedLocalFavData) {
        if (element.name === item) {
          favmov += `<div class="card bg-dark text-white " style="width: 18rem;">
        <img src=${element.thumbnail.path
            }/portrait_xlarge.jpg class="card-img-top" alt="..." style="height:15rem">
        <div class="card-body d-flex flex-column align-items-center gap-2">
          <h5 class="card-title text-danger">${element.name}</h5>
         
          <span class="text-danger">Series: <span class="text-white">${element.series.available
            }</span></span>
          <span class="text-danger">Stories: <span class="text-white">${element.stories.available
            }</span></span>
          <a href=${element.urls[2] ? element.urls[2].url : "..."
            } class="btn btn-danger" style="width:90%" target="_blank" > <span class="text-white">Comics: <span class="text-white">${element.comics.available
            }</span></span></a>
          <a href=${element.urls[0].url
            } class="btn btn-danger" style="width:90%" target="_blank">Detail </a>
          <a 
           class="btn btn-danger unfavButton" style="width:90%" >unfavourite</a>
            </div>
      </div >; `;
        }
      }
    });

    pages["favourite"] = favmov;
    if (window.location.hash.slice(1) === "favourite") {
      loadContent();
    }
  } else if (index !== -1) {
    savedLocalFavData.splice(index, 1);
    window.localStorage.setItem("favData", JSON.stringify(savedLocalFavData));
    e.target.innerText = "favourite";
    window.location.reload();
  }
}
// end 