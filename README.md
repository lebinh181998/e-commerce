# E-COMMERCE
## INTRODUCTION
A website used to buy products(iphone, ipad,...).
## FUNCTIONALS
### USER
- Authorizon: Login to use a few functionals.
- View product detail: Click product will go to Product Detail page. Here, you can enter quantity and add product to cart. At the bottom of page, click related products to view.
- View cart: At Cart page, you can see products you added. You can edit products before order.
- Order: At Order page, enter your information and click "Place Order" button to order.
- View orders: Click History button at the top right of page and then you will see your orders.
- Chat with admin: You can send questions to admin.
### ADMIN
- Authorizon: Login to go to website.
- View more other information: At Dashboard page, You will see latest orders and quantity of clients, orders,...
- View Products: Click Products at the left of page. You will see products list. Here, you can edit products and add a product.
- View Rooms: Click Rooms at the left of page. You will see rooms list. Here, you will chat with clients.
## INSTALL
- Download project.
- Extract project.
- Download and install nodejs version 18.16.1 or larger at https://nodejs.org
- Open cmd and find path to project folder.
- Run "npm install" at `client`, `server` and `admin` folder.
## DEPLOYMENT GUIDE
- Change the url to http://localhost:5000 in a few file and `use-input` file in `hook` folder.
- Insert line "proxy": "http://localhost:5000" in `package.json`.
