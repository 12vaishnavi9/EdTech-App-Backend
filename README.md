It is a Rest API for educational platforms where user can register and can enroll in various courses. Admin can create courses while users can enroll.

How to start?
1. npm i
2. sign in to ethereal and nodemailer
3. set env variables:
 MONGODB_URL="your_mongo_url, 
JWT_SECRET="any_secret_key", 
PORT=8080, 
ethereal_name="generate_ethereal_email", 
ethereal_pass="password", 
EMAIL="email_to_send_mails", 
PASSWORD="app_password_from_gmail"
4. Create env.js file:-
export const EMAIL = 'email_to_send_mails';
export const PASSWORD = 'app_password_from_gmail';
5. nodemon server.js

All Apis:-------

![Alt Text](https://github.com/12vaishnavi9/EdTech-App-Backend/blob/master/api-img1.png?raw=true)
![Alt_Text](https://github.com/12vaishnavi9/EdTech-App-Backend/assets/96681089/6aec1dca-ca1b-48a9-b3d5-5f1333a3125b)
![Alt_Text](https://github.com/12vaishnavi9/EdTech-App-Backend/blob/master/api-img3.png?raw=true)






