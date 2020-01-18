const getData = () => {
  return fetch(url)
    .then(response => response.json())
    .then(data => data.map(good => {
      goodsContent.innerHTML += renderGood(good)
    }))
}

export default getData