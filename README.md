<h1 align="center">ekatra.one</h1>

🏠[Homepage](https://github.com/vruksheco/ekatraone)


• [**Ekatra**](https://www.ekatra.one/) is the first low data / no data learning platform. 
>
• Ekatra helps institutions create, deploy, and assess text message-based micro-courses that dramatically improve learning and training. 
>
• Our learning platform helps such organizations focused on career readiness for underserved high schoolers to teach them important job and life skills

• Learn more about Ekatra here: https://www.ekatra.one/  

---

<h1 align="center">Welcome to Ekatra Line Chatbot 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/ekatraone/Ekatra-Line-Chatbot/blob/main/README.md" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/ekatraone/Ekatra-Line-Chatbot/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
    </a>
    <a href="https://twitter.com/ekatraone" target="_blank">
    <img alt="Twitter: @ekatraone" src="https://img.shields.io/twitter/follow/ekatraone.svg?style=social" />
  </a>
  <a href="https://twitter.com/ramshaa_shaikh" target="_blank">
    <img alt="Twitter: @ramshaa_shaikh" src="https://img.shields.io/twitter/follow/ramshaa_shaikh.svg?style=social" />
  </a>
</p>

>
>
> The Ekatra Line Chatbot is a Node.js-powered interactive chatbot that assists you in deploying courses on Line.
>
> Every day, the Chatbot give access to new course modules by sending a reminder template message to students.
>
> This Chatbot offers an excellent learning experience on our preferred platform Line and allows students to learn at their own speed.

### ✨ [Demo]


https://user-images.githubusercontent.com/32320502/184151711-07653934-d471-4a9e-929b-4c4b9c4cd178.mp4

### **Try WomenWill Line Bot:**

<p align="center"><a href="https://lin.ee/cwdnjPm"><img src="https://user-images.githubusercontent.com/32320502/184133369-e3e9dc92-a4c0-4af5-96e9-672dc00e204a.png" height="100"></a>

## Tech Stack
1. [**Line Messaging API**](https://developers.line.biz/en/services/messaging-api/) : The Messaging API lets you develop two-way communication between your service and LINE users. It makes  more convenient to communicate with LINE users on your LINE Official Account. By using the Messaging API, you can provide functions such as reservation functions and digital membership cards in your LINE chat rooms to enable smoother communication with your customers.
  
2. [**Airtable**](https://support.airtable.com/hc/en-us) :  Airtable is an easy-to-use online platform for creating and sharing relational databases.
It is a spreadsheet-database hybrid which lets you create powerful databases that can be used to power custom applications.
Airtable has two APIs:
    * [REST API](https://support.airtable.com/hc/en-us/sections/360009623014-API)
    * [Metadata API](https://airtable.com/api/meta)
    

3. [**Railway**](https://railway.app/) : Railway is a platform for deployment where you can set up infrastructure, work with it locally, and then deploy to the cloud.
----
## Prerequisites
1. [Line Account](https://account.line.biz/signup)
2. [Airtable Account](https://airtable.com/signup)
3. [Railway Account](https://railway.app/) [or any other cloud platform of your choice]
---
## Initial Steps : Obtain required API Keys and Access Tokens  🔑
  A. *Line Channel Token* 
1. Login to [Line Developer Console](https://developers.line.biz/console/)
2. Go to Providers> Click Create > Enter your channel name
![Line SignUp](./docs/Output/Line%20Console.png)
3. Select *Create Messaging API Channel* > Fill out the necessary information for channel > Click *Create* > Review the entered values > Click *Ok*
4. In *Messaging API* tab > Under **Channel access token** heading > Click on *Issue* > Copy the *access token*


B. *Airtable REST API* 

1. Go to your [account page](https://airtable.com/account)
2. Under API heading in Account Overview page, click **Generate API key button**.
3. Securely save them in your .env file.
---
## Line configuration.

#### Follow the instructions described in [Line Documentation](./docs/Line.md) to configure your Line Channel.
---
## Let's discuss about our backend - Airtable.
#### Head over to [Airtable Documentation](./docs/Airtable.md) to understand tables schema, field description.
---

## Chatbot Flow. 🤖

#### Let's understand how the chatbot flow works.
1. When the user add the channel as friend, a follow webhook event will be triggered and student records will be stored in the Airtable.
2. Following the follow webhook event a greeting message will be sent to the user. *(Optional)*
3. Implement CRON job to send a start day template to initiate the course day. 

Refer the [flowchart](./docs/Output/Line.jpg) to understand how chatbot works

Refer [Schedule Template Message](https://github.com/ekatraone/schedule-template-messages) repository to schedule start day template message.

---

## Author

👤 **Ramsha Shaikh**

* Twitter: [@ramshaa_shaikh](https://twitter.com/ramshaa_shaikh)
* Github: [@ramshashaikh](https://github.com/ramshashaikh)
* LinkedIn: [@ramsha-shaikh](https://www.linkedin.com/in/ramsha-shaikh/)

🏢 **Ekatra Learning, Inc.**
* Website: https://www.ekatra.one/
* Twitter: [@ekatraone](https://twitter.com/ekatraone)
* Github: [@ekatraone](https://github.com/ekatraone)

## 🤝 Contributing

If you have any suggestion on how to improve the code create a [PR request](https://github.com/ekatraone/Ekatra-Line-Chatbot/pulls) or faced any issues feel free to [contact me](https://github.com/ekatraone/Ekatra-Line-Chatbot/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2022 [Ramsha Shaikh](https://github.com/ramshashaikh).<br />
This project is [MIT](https://github.com/ekatraone/Ekatra-Line-Chatbot/blob/main/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
