
const products=document.getElementById("products");
let productsList=""
fetch("http://localhost:3000/produts")
.then(res=>res.json())
.then(data=>{
    console.log(data);
    data.forEach(e => {
    console.log(e.name);
    productsList += `
    <div class="product1">
      <img src="${e.img}" alt="${e.name}" >
      <div class="products-detials">
        <h2>${e.name}</h2>
        <div class="detial">
          <label for="size">Size</label><br>
          <input type="text" name="size" placeholder="Enter Size" required><br>

          <label for="quantity">Quantity</label><br>
          <input type="number" name="quantity" placeholder="Enter Quantity" min="1" required>
        </div>
        <button class="add-btn" data-name="${e.name}">Add</button>
      </div>
    </div>`;
    });
    products.innerHTML=productsList;

    const addButtons = document.querySelectorAll(".add-btn");
 addButtons.forEach(btn => {
   btn.addEventListener("click", () => {
    const parent = btn.closest(".products-detials");
    const sizeInput = parent.querySelector("input[name='size']");
    const quantityInput = parent.querySelector("input[name='quantity']");

    const sizeValue = sizeInput.value;
    const quantityValue = quantityInput.value;
    const productName = btn.dataset.name;
    Postbill(sizeValue,quantityValue,productName);
   });
});
});

fetch("http://localhost:3000/list")
  .then(res => res.json())
  .then(data => {
    let listHtml = "";
    data.forEach((e) => {
      listHtml += `
        <tr data-id="${e.id}">
          <td></td>
          <td contenteditable="true" class="editable" data-field="name">${e.name}</td>
          <td contenteditable="true" class="editable" data-field="size">${e.size}</td>
          <td contenteditable="true" class="editable" data-field="quantity">${e.quantity}</td>
        </tr>`;
    });
    document.getElementById("list").innerHTML = listHtml;

    // Optional: Add save on blur (or use a "Save All" button)
    document.querySelectorAll(".editable").forEach(cell => {
      cell.addEventListener("blur", () => {
        const row = cell.closest("tr");
        const id = row.dataset.id;
        const field = cell.dataset.field;
        const value = cell.innerText;
console.log(cell.dataset.field)
        // Patch the value to the backend
        fetch(`http://localhost:3000/list/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ [field]: value })
        }).then(res => res.json()).then(data => {
          console.log("Updated:", data);
        });
      });
    });
  });


function Postbill(size,quantity,name){
  let Size=size
  let Quantity=quantity
  let productname=name
  console.log(Size)
  console.log(Quantity)
  console.log(productname)
  fetch("http://localhost:3000/list",{
    method: "POST",
    headers:{
      "content-type":"application/json,text/plain,*/*",
      "accept":"application/json"
    },
    body:JSON.stringify({
      name:productname,
      size:Size,
      quantity:Quantity
    })
  })
  .then((res)=>res.json())
  .then(data=>{
    data.produts.forEach(e => {
      console.log(e.id);
    })
  })
}

// print contennt
function printDiv(divId) {
  const printContents = document.getElementById(divId).innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;

  // Optional: reload scripts or reattach events if needed
  location.reload(); // or manually rebind if you have dynamic elements
}
let clears=document.getElementById("clear");
clears.addEventListener("click", ()=>clear())
function clear(){
  fetch("http://localhost:3000/list")
.then((res)=>res.json())
.then(data=>{
  data.forEach(e=>{
    fetch(`http://localhost:3000/list/${e.id}`,{
      method : "DELETE",
    }
    )
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
    })
  })
})
}


document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");  // Check if DOM is loaded
  fetch("http://localhost:3000/previous")
    .then(res => res.json()) // Convert the JSON response to an object
    .then(data => {
      console.log(data);  // Check if the data is fetched correctly
      let output = `<h3>Total Previous Bills: ${data.previous.length}</h3>`; // Display total bills count

      data.previous.forEach((bill, index) => {
        output += `
          <div class="bill-card">
            <h3>Bill #${index + 1} (ID: ${bill.billId})</h3>
            <table class="bill-table">
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Quantity</th>
              </tr>
              ${bill.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.size}</td>
                  <td>${item.quantity}</td>
                </tr>
              `).join("")}
            </table>
            <button onclick="printBill(${bill.billId})">Print Bill</button>
          </div>
        `;
      });

      // Ensure the container element exists
      const container = document.getElementById("previousBillsContainer");
      if (container) {
        console.log("Setting container content...");
        container.innerHTML = output;
      } else {
        console.error("Element 'previousBillsContainer' not found.");
      }
    }).catch((error) => {
      console.error("Error fetching previous bills:", error);
    });
});
