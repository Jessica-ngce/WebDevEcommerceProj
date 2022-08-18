const deleteProductButtonElements = document.querySelectorAll(
  ".product-item button"
);

async function deleteProduct(event) {
  const buttonElement = event.target;
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;
  console.log(csrfToken);
  let response;

  try {
    response = await fetch(
      "/admin/products/" + productId + "?_csrf=" + csrfToken,
      {
        method: "DELETE",
      }
    );
  } catch (err) {
    console.log(err);
  }

  if (!response) {
    alert("Something went wrong!");
    return;
  }

  // dom traversal
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const element of deleteProductButtonElements) {
  element.addEventListener("click", deleteProduct);
}
