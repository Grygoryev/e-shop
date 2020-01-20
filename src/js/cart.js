// let goodsToBuy = []
// let a = []

// let total = document.getElementById('cart-total')

// function countTotalSumm() {
//   return goodsToBuy.reduce((sum, item) => sum += item.price.slice(1) * item.quantity, 0)
// }

// function initState() {
//   goodsToBuy == null ? '' : goodsToBuy = [...JSON.parse(localStorage.getItem('goodsToBuy'))]

//   goodsToBuy.forEach( item =>  {
//     if ( localStorage.key(`order${item.goodID}`) ) {
//       a.push(JSON.parse(localStorage.getItem(`order${item.goodID}`)))
//     }


//   })
//   total.innerHTML = 'Общая сумма покупки: $' + countTotalSumm().toFixed(3)
//   console.log(a)
//   console.log(goodsToBuy)


// }

// function renderCart() {
//   const cartContent = document.getElementById('cart')

//   cartContent.innerHTML = ''
//   cartContent.innerHTML = a.map((good) => renderGood(good))
// }

// function renderGood(good) {
//   return (
//     `
//         <figure class="good" id="${good.index}">
//           <figcaption class="good__title"> ${good.type} ${good.index} </figcaption>
//           <img src='${good.picture}' class="good__img" />
//           <p class="good__description">${good.about}</p>
//           <p class="good__price"> <b>Цена: </b> ${good.price}</p>
//           <p class="good__available"> ${good.isInShop ? '<b> В наличии </b>' : 'Товара нет в наличии'}</p>
//           <button class="good__buy-btn btn blue" id="goodItem${good.index}">Добавить в корзину</button> 
//         </figure>  
//       `
//   )
// }

// window.onload = function() {
//   initState()
//   renderCart()
// }

