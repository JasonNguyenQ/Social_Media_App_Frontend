# Social Media App
A social media app that allows for instantaneous transmission of messages between many different users
## Table of Contents
[Demo Video](#demo-video)

[Prerequisites](#prerequisites)

[Installation](#installation)

[Usage](#usage)

[Contact](#contact)
## Demo Video
[![Social Media App Demo](https://github.com/JasonNguyenQ/Social_Media_App_Frontend/blob/master/mq2.webp?raw=true)](https://youtu.be/jXCQX3M2-uY)

## Prerequisites

You may have a version that differs from the ones below. If you do, please ensure that they work properly.
* npm (version 10.8.1)

## Installation

To set up the project, please follow the instructions below
1. In Vscode terminal or your preferred code editor, clone the repository <br/>```git clone https://github.com/JasonNguyenQ/Social_Media_App_Frontend.git```
2. Change your directory to the folder that has been cloned <br/> ```cd .\Social_Media_App_Frontend\```
3. Install node dependencies and packages <br/> ```npm i``` or ```npm install```
4. Set up the backend server by following the README.md in the [Social Media App Backend](https://github.com/JasonNguyenQ/Social_Media_App_Backend)
5. If you changed the domain and/or port of your backend server, change the BASE_URL constant in the [globals.tsx file](https://github.com/JasonNguyenQ/Social_Media_App_Frontend/blob/master/constants/globals.tsx) to reflect those changes
 
## Usage

Follow the steps listed below to run the front and backend
1. Create two terminals to run your front and backend with <br/>``` Ctrl+Shift+` ``` or ``` Ctrl+Shift+5 ``` for split terminal if you already had an open terminal.
2. Change your directory to the frontend in your first terminal <br/>  ```cd .\Social_Media_App_Frontend\```
3. Run the frontend <br/>```npm run dev```

The following commands refer to the usage instructions in the [Social Media App Backend](https://github.com/JasonNguyenQ/Social_Media_App_Backend)
1. Run your redis server using linux terminal <br/> ```redis-server```
2. Now change your directory to the backend in your second terminal <br/> ```cd .\Social_Media_App_Backend\```
3. Run the backend <br/>```npm run dev```

## Contact
Feel free to contact me @ [jason_nguyen14@yahoo.com](mailto:jason_nguyen14@yahoo.com) if you have any questions and/or concerns.
