const newsBox = $('.articles')
const headlinesBox = $('.headlines-box')
const sidelinesBox = $('.side-headlines-box')
const weatherBox = document.querySelector('.weather-box')

var news_url = '';
let mySources = "medical-news-today,%australian-financial-review,bloomberg,business-insider,business-insider-uk,financial-post,fortune,the-wall-street-journal,%ars-technica,crypto-coins-news,engadget,hacker-news,recode,techcrunch,techradar,the-next-web,the-verge,wired,%bbc-sport,bleacher-report,espn,espn-cric-info,football-italia,four-four-two,fox-sports,nfl-news,nhl-news,talksport,the-sport-bible,%national-geographic,new-scientist,next-big-future,%abc-news,abc-news-au,al-jazeera-english,associated-press,axios,bbc-news,breitbart-news,cbc-news,cbs-news,cnn,fox-news,google-news,google-news-au,google-news-ca,google-news-in,google-news-uk,independent,msnbc,national-review,nbc-news,news24,news-com-au,newsweek,new-york-magazine,politico,reddit-r-all,reuters,rte,the-american-conservative,the-globe-and-mail,the-hill,the-hindu,the-huffington-post,the-irish-times,the-jerusalem-post,the-times-of-india,the-washington-post,the-washington-times,time,usa-today,vice-news,%buzzfeed,entertainment-weekly,ign,mashable,mtv-news,mtv-news-uk,polygon,the-lad-bible"
const allSources = mySources.split(',%')

$('.collapse').click(function(){
    if ($(this).parent().hasClass('active'))
    {
        $(this).parent().removeClass('active')
    }
    else{
        $('.collapse').parent().removeClass('active')
        $(this).parent().addClass('active')
        if ($(this).next().children().first().attr('type')=== 'text')
            $(this).next().children().first().focus()
    }

})
$('body').click(function(event){
    if ($(event.target).hasClass('collapse') || $(event.target).attr('type') === 'text')
        return
    $('.collapse').parent().removeClass('active')
    if ($('.container').hasClass('hidden')){
        // console.log("Nav is On")
        // console.log($(event.target).parent().attr('class'))
        if($(event.target).parent().hasClass('navBar')){
            // console.log("Valid")
        }
        else{
            $('.container').removeClass('hidden')
            $('#navToggle').find('i').removeClass('fa-xmark')
            $('#navToggle').find('i').addClass('fa-bars')
            $('.navMenu').removeClass('navOn')
            $('.container').removeClass('hidden')
        }

    }
    if ($(event.target).attr('data-source')){
        $('#current').text($(event.target).text())
        setAllWithSource($(event.target).attr('data-source'))
    }
    if ($(event.target).attr('data-filter')){
        el = $(event.target)
        sortNews()

    }
    if ($(event.target).attr('data-category')){
        $('#current').text($(event.target).text() +" "+ $(event.target).attr('data-category'))
        setAllWithCategory($(event.target).attr('data-category'))
    }
})
$('input').keyup(function(event){
    if (event.keyCode === 13) {
        if ($(this).next().attr('data-submit')==='addCity'){
            if ($(this).next().attr('data-submit')==='addCity'){
                const key = $(this).val()

                if (!key) {
                    $('.weather-box').css('box-shadow', '0 0 10px 0 #EF2D56')
                    setTimeout(() => {
                        $('.weather-box').css('box-shadow', 'none')

                    }, 2000);

                } else {
                    $('.weather-box').css('box-shadow', '0 0 10px 0 #0CCE6B')
                    setTimeout(() => {
                        $('.weather-box').css('box-shadow', 'none')
                    }, 2000);
                    addCity(key)
                }
            }
        }
        if ($(this).next().attr('data-submit')==='search'){
            el = $(this)
            search()
        }
    }
})
$('#navToggle').click(function(){

    $(this).find('i').toggleClass('fa-xmark')
    $(this).find('i').toggleClass('fa-bars')
    $('.navMenu').toggleClass('navOn')
    $('.container').toggleClass('hidden')
})
$('.toggleLight').click(function(){
    toggleLight()
})
$('#editCity').click(function(){
    document.querySelector('#city-input').disabled = false
    document.querySelector('#city-input').focus()
})
function setAllWithCategory(category){
    let sources = ''
    if (category === 'health')
        sources = allSources[0]
    if (category === 'business')
        sources = allSources[1]
    if (category === 'technology')
        sources = allSources[2]
    if (category === 'sports')
        sources = allSources[3]
    if (category === 'science')
        sources = allSources[4]
    if (category === 'general')
        sources = allSources[5]
    if (category === 'entertainment')
        sources = allSources[6]
    setAllWithSource(sources)

}

function flash(message) {
    $('.flash').toggleClass('active')
    $('.flash').find('h2').text(message)
    setTimeout(() => {
        $('.flash').removeClass('active')
    }, 2000)
}

const citySkeleton = document.createElement('li')
citySkeleton.classList.add('city')
citySkeleton.classList.add('skeleton')
citySkeleton.innerHTML = `
    <div></div>
`
const cityTemplate = document.createElement('li')
cityTemplate.classList.add('city')
cityTemplate.innerHTML = `
    <div class="flex-group">
        <img id="icon" src="03d.png">
        <h2 id="city"> </h2>
        <span id="country"></span>
        <button id="delCity" onclick="this.parentNode.parentNode.remove()"><i class="fa-solid fa-trash lg"></i></button>
    </div>
    <div class="flex-group">
        <h2 id="temp">26.3 </h2>

        <h2 id="descr">Mild</h2>
    </div>
`
var lastValid;
function addCity(key) {
    document.querySelector('#city-input').disabled = true
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${key}&units=metric&appid=94d55dea6959877f6dab9c4a3a650012`
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const city = data.name
            const temp = data.main.temp
            const country = data.sys.country
            const icon = data.weather[0].icon
            const descr = data.weather[0].description
            weatherBox.querySelector('#icon').src = `http://openweathermap.org/img/w/${icon}.png`
            weatherBox.querySelector('#city-input').value = city
            weatherBox.querySelector('#temp').innerHTML = temp + "<sup>o</sup>"
            weatherBox.querySelector('#descr').textContent = descr
            lastValid = city
        })
        .catch((error) => {
            flash('City Not Found')
            weatherBox.querySelector('#city-input').value = lastValid
        })
}
function search() {
    const key = el.val()
    if (!key) {
        el.parent().css('box-shadow', '0 0 5px 0 #EF2D56')
        setTimeout(() => {
            el.parent().css('box-shadow', 'none')

        }, 2000);
    } else {
        headlinesBox.html('')
        sidelinesBox.html('')
        $('#current').text('Resuts for '+key)
        initNewsSkels()
        el.parent().css('box-shadow', '0 0 5px 0 #0CCE6B')
        setTimeout(() => {
            el.parent().css('box-shadow', 'none')
            el.val('')

        }, 2000);
        news_url = `https://newsapi.org/v2/everything?q=${key}&sortBy=publishedAt&pageSize=100&searchIn=title,content&language=en&apiKey=`
        const newsPromise = fetchData(news_url)
        newsPromise.then((data) => {
            if (Object.keys(data.articles).length > 0) {
                showNews(data)
            }
            else {
                newsBox.html('')
                newsBox.html(`<h1 class="search-result txt-colored-100">NO RESULTS FOUND FOR "${key}"</h1>`)
                flash('No results Found')
            }

        })

    }
}
function toggleLight() {
    $('body').toggleClass('night')
    $('.toggleLight').toggleClass('active')
}

const headlineSkeleton = document.createElement('li')
headlineSkeleton.classList.add('headline')
headlineSkeleton.classList.add('skeleton')
headlineSkeleton.innerHTML = `
    <div class=""></div>
    <div class=""></div>
`
const headlineTemplate = document.createElement('li')
headlineTemplate.classList.add('headline')
headlineTemplate.innerHTML = `
    <div class="content">
        <a id="source" data-source=""><i class="fa-solid fa-newspaper"></i> <span></span></a>
        <a id="title-sm" target='_blank'></a>
    </div>

`
const newsSkeleton = document.createElement('li')
newsSkeleton.classList.add('article')
newsSkeleton.classList.add('skeleton')
newsSkeleton.innerHTML = `
    <div class=""></div>
    <div class=""></div>
    <div class=""></div>
`
const newsTemplate = document.createElement('li')
newsTemplate.classList.add('article')
newsTemplate.innerHTML = `
    <div>
        <a data-source="" id="source"><i class="fa-solid fa-newspaper"></i> <span></span></a>
        <div class="datetime">
        <h3 id="date"><i class="fa-solid fa-calendar"></i> <span></span></h3>
        <h3 id="time"></h3>
        </div>
    </div>
    <a id="title" href="" target='_blank'></a>
    <img loading="lazy" id='img' src="" alt="">


`
const sidelineSkeleton = document.createElement('li')
sidelineSkeleton.classList.add('side-headline')
sidelineSkeleton.classList.add('skeleton')
sidelineSkeleton.innerHTML = `
    <div class=""></div>
    <div class=""></div>
`
const sidelineTemplate = document.createElement('li')
sidelineTemplate.classList.add('side-headline')
sidelineTemplate.innerHTML = `
    <div class="img-cont">
        <i class="fa-solid fa-image"></i>
        <img id='img' src="" alt="">
    </div>
    <a id="title-sm" href=""></a>
`

function showHeadlines(data) {
    $(headlinesBox).html('')
    $(sidelinesBox).html('')
    articles = data.articles
    articles.forEach(article => {
        source = article.source.name
        sourceId = article.source.id
        link = article.url
        title = article.title
        if (title) {
            if (title.length > 70) {
                title = title.substring(0, 70) + "...(Read More)"
            }
        } else {
            title = ''
        }
        text = article.description
        if (!text)
            text = ''
        img = article.urlToImage
        const headLine = headlineTemplate.cloneNode(true)
        $(headLine).css('background-image', `linear-gradient(to bottom,rgba(0,0,0,.1),rgba(0,0,0,.5)), url(${img})`)
        $(headLine).find('#source span').text(`${source}`)
        $(headLine).find('#source').attr('data-source', sourceId)
        $(headLine).find('#title-sm').html(title)
        $(headLine).find('#title-sm').attr('href', `${link}`)
        headlinesBox.append(headLine)
        const sideHeadline = sidelineTemplate.cloneNode(true)

        $(sideHeadline).find('#img').attr('src', `${img}`)
        $(sideHeadline).find('#title-sm').html(title)
        $(sideHeadline).find('#title-sm').attr('href', `${link}`)
        sidelinesBox.append(sideHeadline)
    })
}
function showNews(data) {
    $(newsBox).html('')
    articles = data.articles
    articles.forEach(article => {
        source = article.source.name
        sourceId = article.source.id
        link = article.url
        title = article.title
        text = article.description
        img = article.urlToImage
        if (!img)
            img = ''

        date = new Date(Date.parse(article.publishedAt)).toLocaleString('en-US').toString()
        const dateFormat = date.split(',')
        const newsArticle = newsTemplate.cloneNode(true)
        $(newsArticle).find('#source span').text(source)
        $(newsArticle).find('#source').attr('data-source',sourceId)
        $(newsArticle).find('#date span').text(dateFormat[0])
        $(newsArticle).find('#time').text(dateFormat[1])
        $(newsArticle).find('#title').html(title)
        $(newsArticle).find('#title').attr('href', link)
        $(newsArticle).find('#img').attr('src', `${img}`)
        if (!img)
            $(newsArticle).find('.img-cont').remove()
        $(newsArticle).find('#link').attr('href', `${link}`)
        newsBox.append(newsArticle)
    })
}

function initHeadlineSkels() {
    headlinesBox.html('')
    for (i = 0; i < 5; i++) {
        headlinesBox.append(headlineSkeleton.cloneNode(true))
    }
}
function initSidelineSkels() {
    sidelinesBox.html('')
    for (i = 0; i < 5; i++) {
        sidelinesBox.append(sidelineSkeleton.cloneNode(true))
    }
}

function initNewsSkels() {
    newsBox.html('')
    for (i = 0; i < 5; i++) {
        newsBox.append(newsSkeleton.cloneNode(true))
    }
}


function setAllWithSource(source) {
    initHeadlineSkels()
    initNewsSkels()
    initSidelineSkels()
    window.scroll(0, 0)
    $('.filters button').removeClass('active')
    $('.filters button').first().addClass('active')
    const headline_url = `https://newsapi.org/v2/top-headlines?sources=${source}&language=en&pageSize=25&apiKey=`
    const headlinesPromise = fetchData(headline_url)
    headlinesPromise.then((data) => {
        showHeadlines(data)
    })
    news_url = `https://newsapi.org/v2/everything?sources=${source}&sortBy=publishedAt&language=en&pageSize=100&apiKey=`
    const newsPromise = fetchData(news_url)
    newsPromise.then((data) => {
        showNews(data)
    })
}

function sortNews(){
    if (!news_url)
        return
    initNewsSkels()
    window.scroll(0, 0)
    var filter = $(el).attr('data-filter')
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    if (filter !== "publishedAt"){
        const daysMinus = parseInt(filter)
        const date = new Date()
        const dateTo =new Date((date.getTime()) - (daysMinus * 24 * 60 * 60 * 1000))
        const day2 = dateTo.getDate()
        const month2 = dateTo.getMonth()
        const year2 = dateTo.getFullYear()
        filter = "popularity" + "&from=" + (year + '-' + (month + 1) + '-' + day) + '&to=' + (year2 + '-' + (month2 + 1) + '-' + day2)
    }
    news_url = news_url.replace(news_url.split('=')[2].split('&')[0], filter )
    $('.filters button').removeClass('active')
    $(el).addClass('active')
    const newsPromise = fetchData(news_url)
    newsPromise.then((data) => {
        showNews(data)
    })
}

// async function fetchData(url) {
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`HTTP error: ${response.status}`);
//         }
//         const data = await response.json();
//         return data
//     }
//     catch (error) {
//         console.error(`Could not get products: ${error}`);
//     }
// }

async function fetchData(url) {
    const response = await fetch('/fetch', {
        method: "POST",
        body: JSON.stringify({
            type: 'source',
            url: url
        })
    })
    const data = await response.json()
    return data

}
addCity("kigali")
setAllWithSource(allSources[0]+allSources[1]+allSources[2]+allSources[3]+allSources[4]+allSources[5]+allSources[6])
