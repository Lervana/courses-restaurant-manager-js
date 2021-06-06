# Restaurant manager demo

Application for managing orders in a restaurant
Application written in JavaScript (Node.js). Its task is to provide several functionalities
necessary in running a restaurant.

### Requirements:

- The program should enable the creation and editing of the menu (minimum 12 items, below that amount the application
  returns an error with incomplete configuration information);
- The menu should contain categories;
- Each product in the menu should have an assigned name and price;
- The application should allow for placing orders and assigning them a table number (or the "take away" option - this
  option is for statistical purposes only);
- It should be possible to convert prices to another currency in real time (connection to the currency API);
- Ability to change the order status;
- Invoicing bills (also split bills) - in addition to prices, they are to provide information about the time
  in which the order was completed;
- Reports;

Backend - REST API. Communication in JSON format. Api does not require authorization. However, if someone wants to,
it can be introduced as an additional task.

### Tutorial:

_**All instructions are written and tested on macOS Big Sur.**_

| Step | Content               | File                                                  |
| ---- | --------------------- | ----------------------------------------------------- |
| 00   | Prerequisites         | [00-prerequisites.md](help/00-prerequisites.md)       |
| 01   | Creating base app     | [01-creating-new-app.md](help/01-creating-new-app.md) |
| 02   | Adding utilities      | [02-utilities.md](help/02-utilities.md)               |
| 03   | Adding docker compose | [03-docker-compose.md](help/03-docker-compose.md)     |
| 04   | Migrations setup      | [04-migrations.md](help/04-migrations.md)             |
| 05   | Server setup          | [05-server.md](help/05-server.md)                     |
| 06   | Routes setup          | [06-routes.md](help/06-routes.md)                     |
| 07   | Tests setup           | [07-tests.md](help/07-tests.md)                       |
| 08   | REST to CRUD          | [08-rest-to-crud.md](help/08-rest-to-crud.md)         |
