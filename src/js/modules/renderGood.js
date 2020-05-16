export function renderGood(good) {
  return (
    `
        <figure class="good" id="${good.index}" data-name="${good.type} ${good.index}" data-price="${good.price}">
          <figcaption class="good__title"> ${good.type} ${good.index} </figcaption>
          <img src='${good.picture}' class="good__img" />
          <p class="good__description">${good.about}</p>
          <p class="good__price"> <b>Цена: </b> ${good.price}</p>
          <p class="good__available"> ${good.isInShop ? '<b> В наличии </b>' : 'Товара нет в наличии'}</p>
          <div class="good__buy-panel"> 
            <button class="good__buy-option good__remove-btn btn red" id="goodItem${good.index}">-</button>
            <div class="good__quantity-in-cart" >0</div>
            <button class="good__buy-option good__buy-btn btn green" id="goodItem${good.index}">+</button> 
          </div>
        </figure>  
      `
  )
}