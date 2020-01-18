
// async function getData() {
//   let response = await fetch(url)
//   let data = await response.json()
//   let content = data.slice(0, 10)

  //   for (let key in content) {
  //     goodsContent.innerHTML += `
  //     <figure class="good" id="${content[key].index}">
  //       <figcaption class="good__title"> ${content[key].type} </figcaption>
  //       <img src='${content[key].picture}' class="good__img" />
  //       <p class="good__description">${content[key].about}</p>
  //       <p class="good__price"> <b>Цена: </b> ${content[key].price}</p>
  //       <button class="good__buy-btn" >Купить</button> 
  //     </figure>  
  //     `
  // }
// }

// getData()




// const createNode = element => document.createElement(element)
// const append = (parent, el) => parent.appendChild(el)

// fetch(url)
//   .then( response => response.json() )
//   .then( data => data.map( good => {
//     let figure = document.createElement('figure'),
//         img = document.createElement('img'),
//         title = document.createElement('h5'),
//         description = document.createElement('p'),
//         price = document.createElement('p'),
//         addToCartBtn = document.createElement('button')

//     figure.className = 'good'
//     title.className = 'good__title'
//     img.className = 'good__img'
//     description.className = 'good__description'
//     price.className = 'good__price'

//     img.src = good.picture
//     figure.id = `good${good.index}`
//     title.innerHTML = good.type.slice(0,1).toUpperCase() + good.type.slice(1)
//     description.innerHTML = good.about
//     price.innerHTML = 'Цена: ' + good.price

//     append(figure, title)
//     append(figure, img)
//     append(figure, description)
//     append(figure, price)
//     append(app, figure)
//   }))
//   .catch(error => console.log(error))