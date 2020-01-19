export function renderGood(good) {
  return (
    `
        <figure class="good" id="${good.index}">
          <figcaption class="good__title"> ${good.type} ${good.index} </figcaption>
          <img src='${good.picture}' class="good__img" />
          <p class="good__description">${good.about}</p>
          <p class="good__price"> <b>Цена: </b> ${good.price}</p>
          <p class="good__available"> ${good.isInShop ? '<b> В наличии </b>' : 'Товара нет в наличии'}</p>
          <button class="good__buy-btn btn blue" id="goodItem${good.index}">Добавить в корзину</button> 
        </figure>  
      `
  )
}